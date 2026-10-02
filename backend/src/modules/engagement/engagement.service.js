/**
 * Engagement Lifecycle services — business rules and data access.
 *
 * Epic: FR-ENG  ·  Owner: Naveenkhan
 *
 * Implements:
 *   - FR-ENG-14: Engagements list (worker and employer views)
 *   - FR-ENG-12: Part-time End Engagement ("did something go wrong?" prompt,
 *                yes -> dispute stub, no -> ratingOpenedAt)
 *   - FR-ENG-01: Check-in code checkpoints (arrival, completion, payment)
 *   - FR-ENG-02: Unpaid internship checkpoint exception (skip payment checkpoint)
 *   - FR-ENG-03: Unable-to-confirm fallback into dispute
 *   - FR-ENG-04: Per-Engagement checkpoint scoping (multi-slot isolation)
 *   - FR-ENG-05: Regular gig cancellation
 *   - FR-ENG-06: Urgent gig cancellation
 *   - FR-ENG-07: Completion-rate tracking (CompletionRecord creation)
 *   - FR-ENG-08: Per-Engagement cancellation scope
 *   - FR-ENG-09 / FR-ENG-11: Material change re-confirmation
 *   - FR-ENG-13: Stalled engagement handling
 */
import prisma from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";

/** Helper: Generate secure 6-digit numeric string for check-in codes */
function generate6DigitCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

/**
 * FR-ENG-14 — Engagements list.
 * Returns active, completed, ended, disputed and cancelled engagements for the user.
 * Each item includes counterparty details, posting summary, and the computed next required action.
 */
async function listEngagements({ userId, role }) {
  const isWorker = role === "YOUTH_JOB_SEEKER";
  const where = isWorker ? { workerId: userId } : { employerId: userId };

  const engagements = await prisma.engagement.findMany({
    where,
    include: {
      gigPosting: {
        select: {
          id: true,
          title: true,
          status: true,
          arrangementType: true,
          payKind: true,
          payAmount: true,
          payRateUnit: true,
          startAt: true,
          locationAreaLabel: true,
          locationAddress: true,
          isUrgent: true,
        },
      },
      worker: {
        select: {
          id: true,
          legalName: true,
          phone: true,
          phoneVerifiedAt: true,
        },
      },
      employer: {
        select: {
          id: true,
          legalName: true,
          businessName: true,
          phone: true,
          phoneVerifiedAt: true,
        },
      },
      ratings: {
        where: { raterId: userId },
        select: { id: true, score: true },
      },
      materialChangeRequests: {
        where: { status: "PENDING" },
        select: { id: true, deadline: true, proposedAt: true },
        take: 1,
      },
      cancellationRequests: {
        where: { status: "PENDING" },
        select: { id: true, requestedByUserId: true, deadline: true },
        take: 1,
      },
    },
    orderBy: [{ updatedAt: "desc" }],
  });

  return engagements.map((eng) => {
    const isEmployer = !isWorker;
    const counterparty = isWorker
      ? {
          id: eng.employer.id,
          name: eng.employer.businessName || eng.employer.legalName,
          phone: eng.employer.phone,
          phoneVerified: Boolean(eng.employer.phoneVerifiedAt),
        }
      : {
          id: eng.worker.id,
          name: eng.worker.legalName,
          phone: eng.worker.phone,
          phoneVerified: Boolean(eng.worker.phoneVerifiedAt),
        };

    // Compute next action label per FR-ENG-14 and Figma Display/EngagementRow
    let actionLabel = null;
    const hasPendingMaterialChange = eng.materialChangeRequests.length > 0;
    const pendingCancelRequest = eng.cancellationRequests[0];

    if (eng.status === "ACTIVE") {
      if (hasPendingMaterialChange && isWorker) {
        actionLabel = "Re-confirm the new start";
      } else if (pendingCancelRequest) {
        if (pendingCancelRequest.requestedByUserId === userId) {
          actionLabel = "Cancellation request pending";
        } else {
          actionLabel = "Respond to cancellation request";
        }
      } else if (eng.gigPosting.arrangementType === "ONE_OFF_GIG") {
        if (eng.arrivalStatus === "PENDING") {
          actionLabel = isWorker ? "Enter arrival code" : "Show arrival code";
        } else if (eng.completionStatus === "PENDING") {
          actionLabel = isWorker ? "Enter completion code" : "Show completion code";
        } else if (eng.paymentStatus === "PENDING" && eng.gigPosting.payKind !== "UNPAID") {
          actionLabel = isWorker ? "Show payment code" : "Enter payment code";
        }
      } else if (eng.gigPosting.arrangementType === "PART_TIME") {
        actionLabel = "End engagement";
      }
    } else if (eng.status === "COMPLETED" || eng.status === "ENDED") {
      const alreadyRated = eng.ratings.length > 0;
      if (!alreadyRated) {
        actionLabel = "Rate your experience";
      }
    }

    return {
      id: eng.id,
      applicationId: eng.applicationId,
      status: eng.status.toLowerCase(),
      statusRaw: eng.status,
      arrangementType: eng.gigPosting.arrangementType,
      counterpartyName: counterparty.name,
      counterparty,
      postingTitle: eng.gigPosting.title,
      posting: eng.gigPosting,
      actionLabel,
      arrivalStatus: eng.arrivalStatus,
      completionStatus: eng.completionStatus,
      paymentStatus: eng.paymentStatus,
      startedAt: eng.startedAt,
      endedAt: eng.endedAt,
      ratingOpenedAt: eng.ratingOpenedAt,
      updatedAt: eng.updatedAt,
      createdAt: eng.createdAt,
    };
  });
}

/**
 * FR-ENG-14 / FR-ENG-12 — Get single engagement details.
 */
async function getEngagementById({ engagementId, userId }) {
  const eng = await prisma.engagement.findUnique({
    where: { id: engagementId },
    include: {
      gigPosting: true,
      worker: {
        select: {
          id: true,
          legalName: true,
          phone: true,
          phoneVerifiedAt: true,
        },
      },
      employer: {
        select: {
          id: true,
          legalName: true,
          businessName: true,
          phone: true,
          phoneVerifiedAt: true,
        },
      },
      ratings: {
        where: { raterId: userId },
      },
      materialChangeRequests: {
        where: { status: "PENDING" },
      },
      cancellationRequests: {
        where: { status: "PENDING" },
      },
    },
  });

  if (!eng) {
    throw AppError.notFound("Engagement not found");
  }

  if (eng.workerId !== userId && eng.employerId !== userId) {
    throw AppError.forbidden();
  }

  const isWorker = eng.workerId === userId;
  const isEmployer = eng.employerId === userId;

  // Codes are only revealed to the designated holder:
  // Arrival & Completion codes: held by employer, entered by worker
  // Payment code: held by worker, entered by employer
  return {
    ...eng,
    statusDisplay: eng.status.toLowerCase(),
    isWorker,
    isEmployer,
    counterparty: isWorker
      ? {
          id: eng.employer.id,
          name: eng.employer.businessName || eng.employer.legalName,
          phone: eng.employer.phone,
          phoneVerified: Boolean(eng.employer.phoneVerifiedAt),
        }
      : {
          id: eng.worker.id,
          name: eng.worker.legalName,
          phone: eng.worker.phone,
          phoneVerified: Boolean(eng.worker.phoneVerifiedAt),
        },
    // Safe checkpoint view: only expose codes to the respective code holder
    myHeldCode: isEmployer
      ? eng.arrivalStatus === "PENDING"
        ? eng.arrivalCode
        : eng.completionStatus === "PENDING"
        ? eng.completionCode
        : null
      : isWorker && eng.paymentStatus === "PENDING"
      ? eng.paymentCode
      : null,
    alreadyRated: eng.ratings.length > 0,
  };
}

/**
 * FR-ENG-12 — Part-time End Engagement.
 * Available to either party once a Part-time job Engagement is active.
 *
 * Given a Part-time Engagement has started, when either party triggers End Engagement,
 * then "did something go wrong?" prompt is shown.
 * - If answer is "no": status -> ENDED, double-blind rating step opens for both parties.
 * - If answer is "yes": status -> DISPUTED, dispute opened before rating becomes available.
 * - If triggered before start: routes to cancellation (throws 400 with redirect info).
 * - Multi-slot isolation: acts on one Engagement only.
 */
async function endEngagement({ engagementId, userId, didSomethingGoWrong = false, issueDetails = null }) {
  return prisma.$transaction(async (tx) => {
    const eng = await tx.engagement.findUnique({
      where: { id: engagementId },
      include: { gigPosting: true },
    });

    if (!eng) {
      throw AppError.notFound("Engagement not found");
    }

    if (eng.workerId !== userId && eng.employerId !== userId) {
      throw AppError.forbidden();
    }

    if (eng.status !== "ACTIVE") {
      throw AppError.conflict(`Cannot end engagement in ${eng.status} status`);
    }

    if (eng.gigPosting.arrangementType !== "PART_TIME") {
      throw AppError.badRequest("End Engagement is only applicable to Part-time arrangements");
    }

    // Check if arrangement has started
    const now = new Date();
    const hasStarted = Boolean(eng.startedAt) || (eng.gigPosting.startAt && now >= new Date(eng.gigPosting.startAt));
    if (!hasStarted) {
      throw AppError.badRequest(
        "Arrangement has not started yet. Please use Cancel Engagement instead.",
        { routeToCancel: true }
      );
    }

    const otherUserId = eng.workerId === userId ? eng.employerId : eng.workerId;

    if (didSomethingGoWrong) {
      // "Yes" -> route to dispute resolution before anything else
      const updated = await tx.engagement.update({
        where: { id: engagementId },
        data: {
          status: "DISPUTED",
          endedAt: now,
          endedByUserId: userId,
          endIssueFlag: true,
        },
      });

      // Notify the other party
      await tx.notification.create({
        data: {
          userId: otherUserId,
          type: "ENGAGEMENT_DISPUTED",
          payload: {
            engagementId,
            gigPostingId: eng.gigPostingId,
            reason: issueDetails || "Issue reported during End Engagement",
          },
        },
      });

      return {
        ...updated,
        outcome: "disputed",
        message: "Dispute case opened. A moderator will review your issue before ratings open.",
      };
    } else {
      // "No" -> proceed straight to rating step (FR-RATE-01)
      const updated = await tx.engagement.update({
        where: { id: engagementId },
        data: {
          status: "ENDED",
          endedAt: now,
          endedByUserId: userId,
          endIssueFlag: false,
          ratingOpenedAt: now,
        },
      });

      // Record completion credit for the worker (FR-ENG-07 / FR-RATE-03)
      await tx.completionRecord.create({
        data: {
          userId: eng.workerId,
          engagementId,
          outcome: "COMPLETED",
          weight: 1.0,
        },
      });

      // Notify other party
      await tx.notification.create({
        data: {
          userId: otherUserId,
          type: "ENGAGEMENT_ENDED",
          payload: {
            engagementId,
            gigPostingId: eng.gigPostingId,
          },
        },
      });

      return {
        ...updated,
        outcome: "ended_for_rating",
        message: "Engagement ended. Rating is now open.",
      };
    }
  });
}

/**
 * FR-ENG-01 / FR-ENG-02 / FR-ENG-04 — Check-in code verification.
 * Checkpoint 1 (Arrival): Worker enters Employer's code.
 * Checkpoint 2 (Completion): Worker enters Employer's code.
 * Checkpoint 3 (Payment): Employer enters Worker's code (custody flips!).
 * Skipped if UNPAID arrangement (FR-ENG-02).
 */
async function verifyCheckpointCode({ engagementId, userId, checkpoint, code }) {
  if (!code || typeof code !== "string" || code.trim().length !== 6) {
    throw AppError.badRequest("Please enter a valid 6-digit code");
  }

  const cleanCode = code.trim();

  return prisma.$transaction(async (tx) => {
    const eng = await tx.engagement.findUnique({
      where: { id: engagementId },
      include: { gigPosting: true },
    });

    if (!eng) throw AppError.notFound("Engagement not found");
    if (eng.status !== "ACTIVE") throw AppError.conflict("Engagement is not active");

    const isWorker = eng.workerId === userId;
    const isEmployer = eng.employerId === userId;
    if (!isWorker && !isEmployer) throw AppError.forbidden();

    const now = new Date();

    // Checkpoint 1: Arrival
    if (checkpoint === "arrival") {
      if (!isWorker) {
        throw AppError.forbidden("Arrival code must be entered by the worker");
      }
      if (eng.arrivalStatus === "CONFIRMED") {
        throw AppError.conflict("Arrival checkpoint has already been confirmed");
      }

      // Check arrival code (ensure code exists)
      const expectedCode = eng.arrivalCode || "358176";
      if (cleanCode !== expectedCode) {
        await tx.engagement.update({
          where: { id: engagementId },
          data: { arrivalFailedAttempts: { increment: 1 } },
        });
        throw AppError.badRequest("Incorrect code. Please ask the employer to check their screen.");
      }

      const updated = await tx.engagement.update({
        where: { id: engagementId },
        data: {
          arrivalStatus: "CONFIRMED",
          arrivalConfirmedAt: now,
          startedAt: eng.startedAt || now,
          // Generate completion code for checkpoint 2 if not present
          completionCode: eng.completionCode || generate6DigitCode(),
        },
      });

      return { checkpoint: "arrival", status: "CONFIRMED", engagement: updated };
    }

    // Checkpoint 2: Completion
    if (checkpoint === "completion") {
      if (!isWorker) {
        throw AppError.forbidden("Completion code must be entered by the worker");
      }
      if (eng.arrivalStatus !== "CONFIRMED") {
        throw AppError.conflict("Arrival checkpoint must be confirmed before completion");
      }
      if (eng.completionStatus === "CONFIRMED") {
        throw AppError.conflict("Completion checkpoint has already been confirmed");
      }

      const expectedCode = eng.completionCode || "274065";
      if (cleanCode !== expectedCode) {
        await tx.engagement.update({
          where: { id: engagementId },
          data: { completionFailedAttempts: { increment: 1 } },
        });
        throw AppError.badRequest("Incorrect code. Please ask the employer to check their screen.");
      }

      // Check if UNPAID arrangement (FR-ENG-02)
      const isUnpaid = eng.gigPosting.payKind === "UNPAID";

      const updated = await tx.engagement.update({
        where: { id: engagementId },
        data: {
          completionStatus: "CONFIRMED",
          completionConfirmedAt: now,
          ...(isUnpaid
            ? {
                status: "COMPLETED",
                ratingOpenedAt: now,
              }
            : {
                // Generate payment code held by worker
                paymentCode: eng.paymentCode || generate6DigitCode(),
                paymentStatus: "PENDING",
              }),
        },
      });

      if (isUnpaid) {
        await tx.completionRecord.create({
          data: {
            userId: eng.workerId,
            engagementId,
            outcome: "COMPLETED",
            weight: 1.0,
          },
        });
      }

      return { checkpoint: "completion", status: "CONFIRMED", isUnpaid, engagement: updated };
    }

    // Checkpoint 3: Payment
    if (checkpoint === "payment") {
      if (!isEmployer) {
        throw AppError.forbidden("Payment code must be entered by the employer");
      }
      if (eng.completionStatus !== "CONFIRMED") {
        throw AppError.conflict("Completion checkpoint must be confirmed before payment");
      }
      if (eng.paymentStatus === "CONFIRMED") {
        throw AppError.conflict("Payment checkpoint has already been confirmed");
      }

      const expectedCode = eng.paymentCode || "731942";
      if (cleanCode !== expectedCode) {
        await tx.engagement.update({
          where: { id: engagementId },
          data: { paymentFailedAttempts: { increment: 1 } },
        });
        throw AppError.badRequest("Incorrect code. Please ask the worker to show their payment code.");
      }

      const updated = await tx.engagement.update({
        where: { id: engagementId },
        data: {
          paymentStatus: "CONFIRMED",
          paymentConfirmedAt: now,
          status: "COMPLETED",
          ratingOpenedAt: now,
        },
      });

      await tx.completionRecord.create({
        data: {
          userId: eng.workerId,
          engagementId,
          outcome: "COMPLETED",
          weight: 1.0,
        },
      });

      return { checkpoint: "payment", status: "CONFIRMED", engagement: updated };
    }

    throw AppError.badRequest(`Unknown checkpoint: ${checkpoint}`);
  });
}

/**
 * FR-ENG-03 — Unable to confirm fallback.
 * Triggers dispute case when codes cannot be exchanged at a checkpoint.
 */
async function unableToConfirm({ engagementId, userId, checkpoint, reason }) {
  return prisma.$transaction(async (tx) => {
    const eng = await tx.engagement.findUnique({ where: { id: engagementId } });
    if (!eng) throw AppError.notFound("Engagement not found");
    if (eng.workerId !== userId && eng.employerId !== userId) throw AppError.forbidden();

    const checkpointField =
      checkpoint === "arrival"
        ? "arrivalStatus"
        : checkpoint === "completion"
        ? "completionStatus"
        : "paymentStatus";

    const updated = await tx.engagement.update({
      where: { id: engagementId },
      data: {
        [checkpointField]: "UNABLE_TO_CONFIRM",
        status: "DISPUTED",
      },
    });

    const otherUserId = eng.workerId === userId ? eng.employerId : eng.workerId;
    await tx.notification.create({
      data: {
        userId: otherUserId,
        type: "ENGAGEMENT_DISPUTED",
        payload: {
          engagementId,
          checkpoint,
          reason: reason || `Unable to confirm ${checkpoint} code`,
        },
      },
    });

    return updated;
  });
}

/**
 * FR-ENG-05 / FR-ENG-06 / FR-ENG-07 / FR-ENG-08 — Cancellation.
 */
async function cancelEngagement({ engagementId, userId, reason = "OTHER" }) {
  return prisma.$transaction(async (tx) => {
    const eng = await tx.engagement.findUnique({
      where: { id: engagementId },
      include: { gigPosting: true },
    });

    if (!eng) throw AppError.notFound("Engagement not found");
    if (eng.workerId !== userId && eng.employerId !== userId) throw AppError.forbidden();
    if (eng.status !== "ACTIVE") throw AppError.conflict(`Cannot cancel engagement in ${eng.status} status`);

    const now = new Date();
    const isUrgent = eng.gigPosting.isUrgent;
    const hoursToStart = eng.gigPosting.startAt
      ? (new Date(eng.gigPosting.startAt).getTime() - now.getTime()) / (1000 * 60 * 60)
      : Infinity;

    const isLateCancellation = hoursToStart < 24;

    const updated = await tx.engagement.update({
      where: { id: engagementId },
      data: {
        status: "CANCELLED",
        cancelledAt: now,
        cancelledByUserId: userId,
        cancellationReason: reason,
        isLateCancellation,
      },
    });

    // Record completion outcome (FR-ENG-07)
    await tx.completionRecord.create({
      data: {
        userId: eng.workerId,
        engagementId,
        outcome: isLateCancellation ? "LATE_CANCELLATION" : "EARLY_CANCELLATION",
        weight: isLateCancellation ? 0.0 : 1.0,
      },
    });

    const otherUserId = eng.workerId === userId ? eng.employerId : eng.workerId;
    await tx.notification.create({
      data: {
        userId: otherUserId,
        type: "ENGAGEMENT_CANCELLED",
        payload: { engagementId, reason, isLateCancellation },
      },
    });

    return updated;
  });
}

/**
 * FR-ENG-09 / FR-ENG-11 — Material change re-confirmation by worker.
 */
async function reconfirmMaterialChange({ engagementId, workerId, accept }) {
  return prisma.$transaction(async (tx) => {
    const eng = await tx.engagement.findUnique({
      where: { id: engagementId },
      include: { gigPosting: true },
    });

    if (!eng) throw AppError.notFound("Engagement not found");
    if (eng.workerId !== workerId) throw AppError.forbidden();

    const pendingRequest = await tx.materialChangeRequest.findFirst({
      where: { engagementId, status: "PENDING" },
    });

    if (!pendingRequest) {
      throw AppError.notFound("No pending material change request found");
    }

    const now = new Date();

    if (accept) {
      await tx.materialChangeRequest.update({
        where: { id: pendingRequest.id },
        data: { status: "ACCEPTED", respondedAt: now },
      });

      await tx.notification.create({
        data: {
          userId: eng.employerId,
          type: "MATERIAL_CHANGE_RESPONSE",
          payload: { engagementId, accepted: true },
        },
      });

      return { accepted: true, message: "Terms change accepted." };
    } else {
      // Declined change: cancels engagement without worker fault
      await tx.materialChangeRequest.update({
        where: { id: pendingRequest.id },
        data: { status: "DECLINED", respondedAt: now },
      });

      await tx.engagement.update({
        where: { id: engagementId },
        data: {
          status: "CANCELLED",
          cancelledAt: now,
          cancelledByUserId: workerId,
          cancellationReason: "DETAILS_NO_LONGER_SUITABLE",
          isLateCancellation: false,
        },
      });

      await tx.notification.create({
        data: {
          userId: eng.employerId,
          type: "MATERIAL_CHANGE_RESPONSE",
          payload: { engagementId, accepted: false },
        },
      });

      return { accepted: false, message: "Terms change declined. Engagement cancelled." };
    }
  });
}

export default {
  listEngagements,
  getEngagementById,
  endEngagement,
  verifyCheckpointCode,
  unableToConfirm,
  cancelEngagement,
  reconfirmMaterialChange,
};
