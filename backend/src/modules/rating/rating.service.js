/**
 * Ratings & Reputation services — business rules and data access.
 *
 * Epic: FR-RATE  ·  Owner: Pawan (Sprint 4)
 * Requirements:
 *   - FR-RATE-01: Rating scale (1 to 5 whole stars only, no free-text review)
 *   - FR-RATE-02: Double-blind reveal (withhold until both submit or 14 days, closes at reveal)
 *   - FR-RATE-03: Completion-rate as a distinct stat from star rating
 *   - FR-RATE-04: Per-Engagement independent ratings
 *   - FR-RATE-05: Applicable to completed gigs and ended part-time engagements
 *   - FR-RATE-06: Public response to a revealed rating (max 300 chars)
 */
import prisma from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";

const REVEAL_WINDOW_DAYS = 14;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Checks if ratings for an engagement should be auto-revealed due to the 14-day expiry.
 * If expired and any unrevealed ratings exist, sets revealedAt to current time.
 */
async function checkAndApplyFourteenDayReveal(engagementId) {
  const engagement = await prisma.engagement.findUnique({
    where: { id: engagementId },
    select: { ratingOpenedAt: true, completedAt: true, endedAt: true, status: true },
  });

  if (!engagement) return;

  const openedAt = engagement.ratingOpenedAt || engagement.completedAt || engagement.endedAt;
  if (!openedAt) return;

  const now = new Date();
  const elapsedDays = (now.getTime() - new Date(openedAt).getTime()) / MS_PER_DAY;

  if (elapsedDays >= REVEAL_WINDOW_DAYS) {
    await prisma.rating.updateMany({
      where: {
        engagementId,
        revealedAt: null,
      },
      data: {
        revealedAt: now,
      },
    });
  }
}

/**
 * Submits a 1-5 star rating for an engagement (FR-RATE-01, FR-RATE-02).
 */
export async function submitRating({ engagementId, userId, score }) {
  if (!engagementId) throw new AppError("Engagement ID is required.", 400);

  // FR-RATE-01: 1 to 5 whole stars only, no free text field
  const parsedScore = Number(score);
  if (!Number.isInteger(parsedScore) || parsedScore < 1 || parsedScore > 5) {
    throw new AppError("Rating must be a whole number between 1 and 5.", 400);
  }

  const engagement = await prisma.engagement.findUnique({
    where: { id: engagementId },
    include: {
      gigPosting: { select: { title: true, employerId: true } },
      ratings: true,
    },
  });

  if (!engagement) {
    throw new AppError("Engagement not found.", 404);
  }

  const isWorker = engagement.workerId === userId;
  const isEmployer = engagement.gigPosting.employerId === userId;

  if (!isWorker && !isEmployer) {
    throw new AppError("You are not a party to this engagement.", 403);
  }

  // FR-RATE-05: Rating applicability by outcome
  // Allowed on COMPLETED, ENDED, or CANCELLED engagements
  const allowedStatuses = ["COMPLETED", "ENDED", "CANCELLED"];
  if (!allowedStatuses.includes(engagement.status)) {
    throw new AppError("Rating is not available until the engagement is finished.", 400);
  }

  // Check 14-day auto-reveal first
  await checkAndApplyFourteenDayReveal(engagementId);

  // Refresh ratings list
  const existingRatings = await prisma.rating.findMany({
    where: { engagementId },
  });

  // Check if user already rated
  const userExisting = existingRatings.find((r) => r.raterId === userId);
  if (userExisting) {
    throw new AppError("You have already submitted a rating for this engagement.", 400);
  }

  // FR-RATE-02 Amendment: Submission closes at reveal
  const alreadyRevealed = existingRatings.some((r) => r.revealedAt !== null);
  if (alreadyRevealed) {
    throw new AppError(
      "Rating submission is closed because ratings for this engagement have already been revealed.",
      400,
    );
  }

  const rateeId = isWorker ? engagement.gigPosting.employerId : engagement.workerId;
  const counterpartyRating = existingRatings.find((r) => r.raterId === rateeId);

  return prisma.$transaction(async (tx) => {
    // If the counterparty already submitted, both ratings reveal simultaneously (FR-RATE-02)
    const willRevealNow = Boolean(counterpartyRating);
    const now = new Date();

    const newRating = await tx.rating.create({
      data: {
        engagementId,
        raterId: userId,
        rateeId,
        score: parsedScore,
        submittedAt: now,
        revealedAt: willRevealNow ? now : null,
      },
    });

    if (willRevealNow && counterpartyRating) {
      await tx.rating.update({
        where: { id: counterpartyRating.id },
        data: { revealedAt: now },
      });
    }

    return {
      rating: newRating,
      revealed: willRevealNow,
    };
  });
}

/**
 * Gets the rating state for an engagement (FR-RATE-02 double-blind view).
 */
export async function getEngagementRatings({ engagementId, userId }) {
  if (!engagementId) throw new AppError("Engagement ID is required.", 400);

  const engagement = await prisma.engagement.findUnique({
    where: { id: engagementId },
    include: {
      gigPosting: { select: { title: true, employerId: true } },
      worker: { select: { id: true, legalName: true } },
    },
  });

  if (!engagement) {
    throw new AppError("Engagement not found.", 404);
  }

  const isWorker = engagement.workerId === userId;
  const isEmployer = engagement.gigPosting.employerId === userId;

  if (!isWorker && !isEmployer) {
    throw new AppError("You are not a party to this engagement.", 403);
  }

  // Check 14-day expiry
  await checkAndApplyFourteenDayReveal(engagementId);

  const ratings = await prisma.rating.findMany({
    where: { engagementId },
    include: {
      rater: { select: { id: true, legalName: true } },
      ratee: { select: { id: true, legalName: true } },
    },
  });

  const openedAt = engagement.ratingOpenedAt || engagement.completedAt || engagement.endedAt || engagement.updatedAt;
  const deadlineDate = openedAt ? new Date(new Date(openedAt).getTime() + REVEAL_WINDOW_DAYS * MS_PER_DAY) : null;

  const myRating = ratings.find((r) => r.raterId === userId);
  const counterpartyRating = ratings.find((r) => r.raterId !== userId);

  const isRevealed = ratings.some((r) => r.revealedAt !== null);

  // If not revealed, counterparty's score is hidden (double-blind)
  return {
    isRevealed,
    revealDeadline: deadlineDate,
    ratingOpenedAt: openedAt,
    myRating: myRating
      ? {
          id: myRating.id,
          score: myRating.score,
          submittedAt: myRating.submittedAt,
          publicResponse: myRating.publicResponse,
          revealedAt: myRating.revealedAt,
        }
      : null,
    counterpartyRating: counterpartyRating
      ? {
          id: counterpartyRating.id,
          submitted: true,
          score: isRevealed ? counterpartyRating.score : null,
          publicResponse: isRevealed ? counterpartyRating.publicResponse : null,
          revealedAt: counterpartyRating.revealedAt,
          raterName: counterpartyRating.rater.legalName,
        }
      : {
          submitted: false,
          score: null,
          publicResponse: null,
          revealedAt: null,
        },
    isClosed: isRevealed && !myRating,
  };
}

/**
 * Posts a public response to a received, revealed rating (FR-RATE-06).
 * Max 300 characters.
 */
export async function postPublicResponse({ ratingId, userId, response }) {
  if (!ratingId) throw new AppError("Rating ID is required.", 400);

  const text = (response || "").trim();
  if (!text) throw new AppError("Response text cannot be empty.", 400);
  if (text.length > 300) {
    throw new AppError("Public response is capped at 300 characters.", 400);
  }

  const rating = await prisma.rating.findUnique({
    where: { id: ratingId },
  });

  if (!rating) throw new AppError("Rating not found.", 404);

  // Only the rated party (ratee) can respond
  if (rating.rateeId !== userId) {
    throw new AppError("Only the recipient of this rating can post a public response.", 403);
  }

  if (!rating.revealedAt) {
    throw new AppError("Cannot respond to a rating that has not been revealed yet.", 400);
  }

  if (rating.removedAt) {
    throw new AppError("Cannot respond to a removed rating.", 400);
  }

  return prisma.rating.update({
    where: { id: ratingId },
    data: { publicResponse: text },
  });
}

/**
 * Calculates user completion rate (FR-RATE-03) and star rating average.
 * Distinct statistics.
 */
export async function getUserRatingSummary(userId) {
  if (!userId) throw new AppError("User ID is required.", 400);

  // 1. Star ratings received (revealed, non-removed only)
  const ratings = await prisma.rating.findMany({
    where: {
      rateeId: userId,
      revealedAt: { not: null },
      removedAt: null,
    },
    select: { score: true },
  });

  const ratingCount = ratings.length;
  const averageRating =
    ratingCount > 0
      ? Number((ratings.reduce((acc, r) => acc + r.score, 0) / ratingCount).toFixed(1))
      : null;

  // 2. Completion rate (FR-RATE-03)
  // Kept as a distinct stat capturing reliability separately from work quality
  const records = await prisma.completionRecord.findMany({
    where: { userId },
    select: { outcome: true },
  });

  let completionRate = null;
  if (records.length > 0) {
    const completed = records.filter(
      (r) => r.outcome === "COMPLETED" || r.outcome === "NO_SHOW_RELIABLE_CREDIT",
    ).length;
    completionRate = Math.round((completed / records.length) * 100);
  } else {
    // Fallback: check finished engagements directly if records table wasn't populated
    const engagements = await prisma.engagement.findMany({
      where: { workerId: userId },
      select: { status: true },
    });
    const finished = engagements.filter((e) => ["COMPLETED", "ENDED", "CANCELLED"].includes(e.status));
    if (finished.length > 0) {
      const successful = finished.filter((e) => e.status === "COMPLETED" || e.status === "ENDED").length;
      completionRate = Math.round((successful / finished.length) * 100);
    }
  }

  return {
    userId,
    averageRating,
    ratingCount,
    completionRate, // e.g. 95 (for 95%)
  };
}

export default {
  submitRating,
  getEngagementRatings,
  postPublicResponse,
  getUserRatingSummary,
};
