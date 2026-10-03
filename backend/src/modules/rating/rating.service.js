/**
 * Ratings & Reputation services — business rules and data access.
 *
 * Epic: FR-RATE  ·  Owner: Pawan (Sprint 4)
 * Requirements:
 *   - FR-RATE-01: Rating scale (1 to 5 whole stars only, no free-text review).
 *   - FR-RATE-02: Double-blind — each party's rating is withheld from the other until both have
 *     submitted, or 14 days pass from Engagement.ratingOpenedAt, whichever comes first.
 *     Submission closes at reveal (amended 2026-08-27, batch A22).
 *   - FR-RATE-03: Completion rate, a statistic kept apart from the star rating.
 *
 * How the 14-day reveal works without a background job: whether the window has closed is
 * COMPUTED every time it matters (ratingOpenedAt + 14 days <= now), so a rating is effectively
 * revealed the moment the window closes even if no code runs at that moment. When a read finds a
 * closed window whose ratings still carry `revealedAt = null`, it writes the reveal down
 * (`revealedAt` = the deadline itself, the moment the reveal actually happened) so the database
 * catches up with what the rule already says. Aggregates (average rating) never depend on that
 * write having happened: they use `revealedRatingsWhere()`, which applies the same rule in the query.
 *
 * The clock lives on Engagement, not on Rating, because the case that matters is the one where a
 * party never submits at all — there is no Rating row to hang a deadline on
 * (docs/database-schema.md, "Why the 14-day clock lives on Engagement").
 */
import prisma from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";

export const REVEAL_WINDOW_DAYS = 14;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Rating eligibility is decided by Engagement.ratingOpenedAt alone, never by status.
// The engagement module sets it when a gig's checkpoints complete, a part-time engagement ends
// with "no problem", a ruling confirms the work happened, or the engagement is cancelled
// (FR-RATE-05). A confirmed no-show ruling leaves it null: rating is skipped entirely (FR-ADM-08).

// A completion record counts FOR the person when it is a completion, or the credit the reliable
// party gets when a ruling confirms the other side's no-show (FR-ADM-08). Every other outcome
// (early or late cancellation, the unreliable party's no-show mark) counts against them.
const CREDIT_OUTCOMES = ["COMPLETED", "NO_SHOW_RELIABLE_CREDIT"];

// ---------------------------------------------------------------------------
// Pure rules — no database, so they can be unit-tested directly and explained in isolation.
// ---------------------------------------------------------------------------

/**
 * FR-RATE-01: only a whole number of stars from 1 to 5. The value must already be a JSON number:
 * "3" (a string) and true (which Number() would turn into 1) are refused rather than coerced.
 * @param {unknown} score
 * @returns {boolean}
 */
export function isValidScore(score) {
  return typeof score === "number" && Number.isInteger(score) && score >= 1 && score <= 5;
}

/**
 * FR-RATE-02: the moment the double-blind window closes — ratingOpenedAt + 14 days.
 * This is also the date 6.2 prints ("Ratings unlock … or on 18 Sep 2026.").
 * @param {Date|null} ratingOpenedAt
 * @returns {Date|null} null when rating has not opened.
 */
export function revealDeadline(ratingOpenedAt) {
  if (!ratingOpenedAt) return null;
  return new Date(new Date(ratingOpenedAt).getTime() + REVEAL_WINDOW_DAYS * MS_PER_DAY);
}

/**
 * FR-RATE-02: the double-blind state of one engagement's rating pair.
 *
 * Revealed when any of these holds:
 *   - a rating already carries revealedAt (the reveal was recorded earlier), or
 *   - both parties have submitted, or
 *   - the 14-day window has closed — even if only one rating, or none, exists.
 *
 * @param {{ ratingOpenedAt: Date|null, ratings: Array<{ revealedAt: Date|null }>, now?: Date }} input
 * @returns {{ isOpen: boolean, windowClosed: boolean, bothSubmitted: boolean, revealed: boolean }}
 */
export function revealState({ ratingOpenedAt, ratings, now = new Date() }) {
  const deadline = revealDeadline(ratingOpenedAt);
  const isOpen = deadline !== null;
  const windowClosed = isOpen && now.getTime() >= deadline.getTime();
  const bothSubmitted = ratings.length >= 2;
  const revealed = isOpen && (windowClosed || bothSubmitted || ratings.some((r) => r.revealedAt));
  return { isOpen, windowClosed, bothSubmitted, revealed };
}

/**
 * Prisma `where` for "ratings received that count toward an average": revealed by either route
 * and not removed by an Admin (FR-RATE-06 amendment A19 — a removed rating leaves every aggregate).
 * "Revealed" includes a 14-day window that has closed but has not been written down yet, so no
 * aggregate depends on someone having opened the rating screen first.
 * @param {Date} [now]
 */
export function revealedRatingsWhere(now = new Date()) {
  const openedOnOrBefore = new Date(now.getTime() - REVEAL_WINDOW_DAYS * MS_PER_DAY);
  return {
    removedAt: null,
    OR: [
      { revealedAt: { not: null } },
      { engagement: { ratingOpenedAt: { lte: openedOnOrBefore } } },
    ],
  };
}

/**
 * FR-RATE-03 / FR-ENG-07: completion rate from a person's CompletionRecord rows.
 *
 * Weighted: rate = credited weight / total weight. A late cancellation is written with weight
 * 2.0 and an early one with 1.0 (FR-ENG-07, amended batch A16), so a late cancellation pulls the
 * rate down twice as far. Worked example from the prototype (M1 1.18nc): 12 completions and one
 * early cancellation is 12/13 = 92%; after a late cancellation it is 12/15 = 80%.
 *
 * @param {Array<{ outcome: string, weight: unknown }>} records - weight may be a Prisma Decimal.
 * @returns {{ completionRate: number|null, jobCount: number }} completionRate is a whole
 *   percentage 0–100, or null when there is no record at all (zero history, nothing to show).
 *   jobCount is the number of COMPLETED records — the "12 jobs" in "92% completion · 12 jobs".
 */
export function completionRateFromRecords(records) {
  let credited = 0;
  let total = 0;
  let jobCount = 0;
  for (const record of records) {
    const weight = Number(record.weight ?? 1); // Decimal -> number; the column defaults to 1.0
    total += weight;
    if (CREDIT_OUTCOMES.includes(record.outcome)) credited += weight;
    if (record.outcome === "COMPLETED") jobCount += 1;
  }
  return {
    completionRate: total > 0 ? Math.round((credited / total) * 100) : null,
    jobCount,
  };
}

// ---------------------------------------------------------------------------
// Shared helpers other modules call (profile, applicant pool). One definition, so a profile and
// an applicant row can never show two different completion rates for the same person.
// ---------------------------------------------------------------------------

/**
 * FR-RATE-03: a person's completion rate, computed from their CompletionRecord ledger.
 * @param {string} userId
 * @param {object} [client] - a Prisma client or transaction client; defaults to the shared one.
 * @returns {Promise<{ completionRate: number|null, jobCount: number }>}
 */
export async function computeCompletionRate(userId, client = prisma) {
  const records = await client.completionRecord.findMany({
    where: { userId },
    select: { outcome: true, weight: true },
  });
  return completionRateFromRecords(records);
}

/**
 * FR-RATE-03: the two trust figures, kept separate — average star rating (work quality) and
 * completion rate (reliability). They are never combined into one number.
 * @param {string} userId
 * @returns {Promise<{ ratingAverage: number|null, ratingCount: number,
 *   completionRate: number|null, jobCount: number }>}
 */
export async function getRatingSummary(userId) {
  const [ratings, completion] = await Promise.all([
    prisma.rating.aggregate({
      where: { rateeId: userId, ...revealedRatingsWhere() },
      _avg: { score: true },
      _count: { _all: true },
    }),
    computeCompletionRate(userId),
  ]);
  const ratingCount = ratings._count._all;
  return {
    ratingAverage: ratingCount > 0 ? Math.round(ratings._avg.score * 10) / 10 : null,
    ratingCount,
    completionRate: completion.completionRate,
    jobCount: completion.jobCount,
  };
}

// ---------------------------------------------------------------------------
// Engagement-level rating flow (screens 6.1, 6.1f, 6.2, 6.3, 6.3s)
// ---------------------------------------------------------------------------

// What every rating read needs about the engagement: the parties, the names the screens print,
// the clock, and the pair of ratings.
const ENGAGEMENT_FOR_RATING = {
  id: true,
  workerId: true,
  employerId: true,
  gigPostingId: true,
  status: true,
  ratingOpenedAt: true,
  gigPosting: { select: { title: true, postedAsType: true, postedBusinessName: true } },
  worker: { select: { legalName: true } },
  employer: { select: { legalName: true } },
  ratings: {
    select: { id: true, raterId: true, rateeId: true, score: true, submittedAt: true, revealedAt: true, publicResponse: true },
  },
};

/**
 * The name the other party is shown by (FR-PROF-01): a Business employer by the business name it
 * posted under — snapshotted on the posting, so an old engagement keeps the name it was agreed
 * under (database-schema.md, judgement call 5) — everyone else by their legal name.
 */
function counterpartyNameFor(engagement, userId) {
  if (engagement.workerId === userId) {
    const posting = engagement.gigPosting;
    if (posting.postedAsType === "BUSINESS" && posting.postedBusinessName) {
      return posting.postedBusinessName;
    }
    return engagement.employer.legalName;
  }
  return engagement.worker.legalName;
}

/** 404 if missing, 403 if the caller is neither the worker nor the employer. */
function assertParty(engagement, userId) {
  if (!engagement) throw AppError.notFound("This engagement could not be found.");
  if (engagement.workerId !== userId && engagement.employerId !== userId) {
    throw AppError.forbidden("Only the two people in this engagement can rate it.");
  }
}

/**
 * FR-RATE-02: when the window has closed but the reveal was never written down, write it now.
 * revealedAt is set to the deadline — when the reveal actually happened — not to "now".
 * Both parties are told the ratings are in (FR-NOTIF-11, RATING_REVEALED), once: the guard
 * `revealedAt: null` means only the request that actually flips the rows sees count > 0.
 * @returns {Promise<void>}
 */
async function recordWindowReveal(engagement, deadline) {
  await prisma.$transaction(async (tx) => {
    const { count } = await tx.rating.updateMany({
      where: { engagementId: engagement.id, revealedAt: null },
      data: { revealedAt: deadline },
    });
    if (count > 0) await notifyReveal(tx, engagement);
  });
}

/** FR-NOTIF-11: "Ratings are in" (RATING_REVEALED, M3 3.10) to both parties. */
function notifyReveal(tx, engagement) {
  const base = { engagementId: engagement.id, gigPostingId: engagement.gigPostingId };
  // Each party is told who the other is: the row reads "You and Saman Stores have both rated".
  return tx.notification.createMany({
    data: [engagement.workerId, engagement.employerId].map((userId) => ({
      userId,
      type: "RATING_REVEALED",
      payload: { ...base, counterpartName: counterpartyNameFor(engagement, userId) },
    })),
  });
}

/**
 * FR-RATE-02: the rating state of one engagement, as the caller is allowed to see it.
 *
 * `stage` tells the app which screen to show:
 *   NOT_OPEN         rating has not opened (or was skipped by a no-show ruling) — nothing to rate
 *   OPEN             the caller can rate (6.1)
 *   AWAITING_REVEAL  the caller has rated, the other party's rating stays hidden (6.2)
 *   REVEALED         both ratings, or whatever exists after the window closed, are visible (6.3);
 *                    if the caller never rated, submission is closed (6.1f / 6.3s)
 *
 * Before the reveal the other party's rating is not sent at all — not its score, and not even
 * whether it exists — so nothing about it can leak through the API.
 *
 * @param {{ engagementId: string, userId: string }} input
 */
export async function getEngagementRatings({ engagementId, userId }) {
  const engagement = await prisma.engagement.findUnique({
    where: { id: engagementId },
    select: ENGAGEMENT_FOR_RATING,
  });
  assertParty(engagement, userId);

  const now = new Date();
  const { isOpen, windowClosed, revealed } = revealState({
    ratingOpenedAt: engagement.ratingOpenedAt,
    ratings: engagement.ratings,
    now,
  });
  const deadline = revealDeadline(engagement.ratingOpenedAt);

  if (windowClosed && engagement.ratings.some((r) => !r.revealedAt)) {
    await recordWindowReveal(engagement, deadline);
  }

  const mine = engagement.ratings.find((r) => r.raterId === userId) ?? null;
  const theirs = engagement.ratings.find((r) => r.raterId !== userId) ?? null;

  let stage;
  if (!isOpen) stage = "NOT_OPEN";
  else if (revealed) stage = "REVEALED";
  else if (mine) stage = "AWAITING_REVEAL";
  else stage = "OPEN";

  return {
    engagementId: engagement.id,
    postingTitle: engagement.gigPosting.title,
    counterpartyName: counterpartyNameFor(engagement, userId),
    // A cancelled engagement is rated the same way, but its screen says so (6.6, FR-RATE-05).
    isCancelled: engagement.status === "CANCELLED",
    stage,
    canSubmit: stage === "OPEN",
    ratingOpenedAt: engagement.ratingOpenedAt,
    revealAt: deadline,
    myRating: mine ? { id: mine.id, score: mine.score, submittedAt: mine.submittedAt } : null,
    theirRating:
      revealed && theirs
        ? { id: theirs.id, score: theirs.score, publicResponse: theirs.publicResponse }
        : null,
  };
}

/**
 * FR-RATE-01 + FR-RATE-02: submit the caller's rating for one engagement.
 *
 * The engagement row is locked (SELECT … FOR UPDATE) for the whole decision. Without it, both
 * parties submitting at the same moment would each read "the other hasn't rated yet", both store a
 * hidden rating, and the pair would stay hidden until day 14 — breaking "both ratings become
 * visible … when the second submission completes". With the lock the second request waits, then
 * sees the first rating and reveals both (AGENTS.md: $transaction alone does not lock rows).
 *
 * @param {{ engagementId: string, userId: string, score: unknown }} input
 * @returns {Promise<{ rating: { id: string, score: number, submittedAt: Date }, revealed: boolean }>}
 */
export async function submitRating({ engagementId, userId, score }) {
  if (typeof engagementId !== "string" || engagementId.length === 0) {
    throw AppError.badRequest("Say which engagement you are rating.");
  }
  // FR-RATE-01: whole stars, 1 to 5. Nothing else is read from the request — there is no
  // free-text review to store.
  if (!isValidScore(score)) {
    throw AppError.badRequest("A rating is a whole number of stars from 1 to 5.");
  }

  return prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT "id" FROM "Engagement" WHERE "id" = ${engagementId} FOR UPDATE`;

    const engagement = await tx.engagement.findUnique({
      where: { id: engagementId },
      select: ENGAGEMENT_FOR_RATING,
    });
    assertParty(engagement, userId);

    const now = new Date();
    const { isOpen, revealed } = revealState({
      ratingOpenedAt: engagement.ratingOpenedAt,
      ratings: engagement.ratings,
      now,
    });

    if (!isOpen) {
      throw AppError.conflict("Rating isn't open for this engagement.");
    }
    // One rating per party per engagement (also enforced by unique(engagementId, raterId)).
    if (engagement.ratings.some((r) => r.raterId === userId)) {
      throw AppError.conflict("You've already rated this engagement.");
    }
    // FR-RATE-02, amended: submission closes at reveal — by either route.
    if (revealed) {
      throw AppError.conflict(
        "Rating is closed. The reveal date passed, so ratings for this engagement are final.",
      );
    }

    const rateeId = engagement.workerId === userId ? engagement.employerId : engagement.workerId;
    const counterpart = engagement.ratings.find((r) => r.raterId === rateeId);
    // The second submission reveals both, at the same instant (FR-RATE-02, criterion 2).
    const revealNow = Boolean(counterpart);

    const rating = await tx.rating.create({
      data: {
        engagementId,
        raterId: userId,
        rateeId,
        score,
        submittedAt: now,
        revealedAt: revealNow ? now : null,
      },
      select: { id: true, score: true, submittedAt: true },
    });

    if (revealNow) {
      await tx.rating.update({ where: { id: counterpart.id }, data: { revealedAt: now } });
      await notifyReveal(tx, engagement);
    }

    return { rating, revealed: revealNow };
  });
}

/**
 * FR-RATE-06 (kept from the earlier slice; no screen in this sprint): the rated party's public
 * response to a revealed rating, capped at 300 characters.
 * @param {{ ratingId: string, userId: string, response: unknown }} input
 */
export async function postPublicResponse({ ratingId, userId, response }) {
  const text = typeof response === "string" ? response.trim() : "";
  if (!text) throw AppError.badRequest("Write a response first.");
  if (text.length > 300) throw AppError.badRequest("A response can be up to 300 characters.");

  const rating = await prisma.rating.findUnique({
    where: { id: ratingId },
    include: { engagement: { select: { ratingOpenedAt: true } } },
  });
  if (!rating) throw AppError.notFound("This rating could not be found.");
  if (rating.rateeId !== userId) {
    throw AppError.forbidden("Only the person who was rated can respond.");
  }
  // Revealed by either route, including a closed window not yet written down.
  const windowClosed =
    rating.engagement.ratingOpenedAt !== null &&
    Date.now() >= revealDeadline(rating.engagement.ratingOpenedAt).getTime();
  if (!rating.revealedAt && !windowClosed) {
    throw AppError.conflict("You can respond once the ratings are revealed.");
  }
  if (rating.removedAt) throw AppError.conflict("This rating has been removed.");

  const updated = await prisma.rating.update({
    where: { id: ratingId },
    data: { publicResponse: text },
    select: { id: true, publicResponse: true },
  });
  return updated;
}

export default {
  submitRating,
  getEngagementRatings,
  postPublicResponse,
  getRatingSummary,
  computeCompletionRate,
};
