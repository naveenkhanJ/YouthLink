/**
 * Applying & Selection services — business rules and data access.
 *
 * Epic: FR-APPLY  ·  Owner: Naveenkhan
 *
 * This is where the acceptance criteria in docs/requirements.md are actually
 * enforced. Import the shared Prisma client from ../../lib/prisma — never
 * construct your own.
 */
import prisma from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";

const NOTE_MAX_LENGTH = 300;

/**
 * FR-APPLY-02 — Apply action.
 * One application per worker per posting, but a prior WITHDRAWN application
 * doesn't count against that (FR-APPLY-03 explicitly allows reapplying).
 */
async function apply({ workerId, gigPostingId, note }) {
  if (note && note.length > NOTE_MAX_LENGTH) {
    throw AppError.badRequest(`Note must be ${NOTE_MAX_LENGTH} characters or fewer`, {
      note: "Too long",
    });
  }

  const gigPosting = await prisma.gigPosting.findUnique({ where: { id: gigPostingId } });
  if (!gigPosting) {
    throw AppError.notFound("Posting not found");
  }
  if (gigPosting.status !== "OPEN") {
    throw AppError.conflict("This posting is no longer accepting applications");
  }

  const existing = await prisma.application.findFirst({
    where: { gigPostingId, workerId, status: { not: "WITHDRAWN" } },
  });
  if (existing) {
    throw AppError.conflict("You have already applied to this posting");
  }

  return prisma.application.create({
    data: { gigPostingId, workerId, note: note || null },
  });
}

/**
 * FR-APPLY-03 — Application withdrawal.
 * Only the applicant themselves, and only while still Pending — once
 * selected or declined, the decision has already been acted on.
 */
async function withdraw({ applicationId, workerId }) {
  const application = await prisma.application.findUnique({ where: { id: applicationId } });
  if (!application || application.workerId !== workerId) {
    throw AppError.notFound("Application not found");
  }
  if (application.status !== "PENDING") {
    throw AppError.conflict("Only a Pending application can be withdrawn");
  }

  return prisma.application.update({
    where: { id: applicationId },
    data: { status: "WITHDRAWN", withdrawnAt: new Date() },
  });
}

/**
 * FR-APPLY-04 / FR-APPLY-05 — the three-tier applicant pool, for the
 * Employer who owns the posting.
 *
 * Completion rate has no finalised formula yet — FR-RATE-03 (Ratings &
 * Reputation) owns that and is deferred/unowned this sprint, and
 * database-schema.md says the exact CompletionRecord weight values are
 * still an open Design Decision. What's below (COMPLETED and
 * NO_SHOW_RELIABLE_CREDIT count as "credited", everything else doesn't) is
 * a reasonable placeholder so the tier-1 tiebreaker has a number to sort
 * on, not a confirmed spec. Flag this with the team before relying on it
 * — and either way, expect tier 1 to be empty in practice this sprint:
 * nothing yet creates a Rating or CompletionRecord row, since both the
 * Engagement Lifecycle and Ratings slices are deferred.
 */
async function getApplicantPool({ gigPostingId, employerId }) {
  const gigPosting = await prisma.gigPosting.findUnique({ where: { id: gigPostingId } });
  if (!gigPosting) {
    throw AppError.notFound("Posting not found");
  }
  if (gigPosting.employerId !== employerId) {
    throw AppError.forbidden();
  }

  const applications = await prisma.application.findMany({
    where: { gigPostingId, status: { not: "WITHDRAWN" } },
    orderBy: { appliedAt: "asc" },
    include: {
      worker: {
        select: {
          id: true,
          legalName: true,
          phoneVerifiedAt: true,
          ratingsReceived: {
            where: { revealedAt: { not: null } },
            select: { score: true },
          },
          completionRecords: { select: { outcome: true, weight: true } },
          endorsementsReceived: { where: { revokedAt: null }, select: { id: true } },
        },
      },
    },
  });

  const pool = applications.map(({ worker, ...application }) => {
    const ratingCount = worker.ratingsReceived.length;
    const hasHistory = ratingCount > 0;
    const avgRating = hasHistory
      ? worker.ratingsReceived.reduce((sum, r) => sum + r.score, 0) / ratingCount
      : null;

    const totalWeight = worker.completionRecords.reduce((sum, r) => sum + Number(r.weight), 0);
    const creditedWeight = worker.completionRecords
      .filter((r) => r.outcome === "COMPLETED" || r.outcome === "NO_SHOW_RELIABLE_CREDIT")
      .reduce((sum, r) => sum + Number(r.weight), 0);
    const completionRate = totalWeight > 0 ? creditedWeight / totalWeight : null;

    const isEndorsed = worker.endorsementsReceived.length > 0;

    return {
      applicationId: application.id,
      status: application.status,
      note: application.note,
      appliedAt: application.appliedAt,
      worker: {
        id: worker.id,
        displayName: worker.legalName,
        phoneVerified: Boolean(worker.phoneVerifiedAt),
      },
      // tier 1 = rating history, tier 2 = zero-history + endorsed, tier 3 = neither
      tier: hasHistory ? 1 : isEndorsed ? 2 : 3,
      avgRating,
      completionRate,
      isEndorsed: !hasHistory && isEndorsed,
      isNewToYouthLink: !hasHistory,
    };
  });

  pool.sort((a, b) => {
    if (a.tier !== b.tier) return a.tier - b.tier;
    if (a.tier !== 1) return 0; // tiers 2/3 aren't ordered further — keep application order
    if (b.avgRating !== a.avgRating) return b.avgRating - a.avgRating;
    return (b.completionRate ?? 0) - (a.completionRate ?? 0);
  });

  return pool;
}

/**
 * FR-APPLY-09 — resolves every application still Pending on a posting that
 * has just stopped accepting applications, however it stopped: Filled
 * (handled below, in select()), Expired (FR-POST-13), or Withdrawn
 * (FR-POST-12). Amended 2026-08-27: this used to be inline in select() and
 * fired on Filled only, leaving expiry and withdrawal with no effect on
 * Pending applications at all.
 *
 * This module owns the resolution rule (FR-APPLY-09 is an FR-APPLY story)
 * but not the expiry/withdrawal events that trigger it — those are
 * Lahiru's FR-POST endpoints/jobs, so this is exported for them to call.
 * Pass `tx` when calling from inside an existing transaction (select()
 * does); omit it to run standalone against the plain client.
 */
async function resolvePendingApplications({ gigPostingId, tx = prisma }) {
  const stillPending = await tx.application.findMany({
    where: { gigPostingId, status: "PENDING" },
    select: { id: true, workerId: true },
  });
  if (stillPending.length === 0) return;

  await tx.application.updateMany({
    where: { id: { in: stillPending.map((a) => a.id) } },
    data: { status: "NOT_SELECTED", decidedAt: new Date() },
  });

  await tx.notification.createMany({
    data: stillPending.map((a) => ({
      userId: a.workerId,
      type: "APPLICATION_NOT_SELECTED",
      payload: { applicationId: a.id, gigPostingId },
    })),
  });
}

/**
 * FR-APPLY-06 — Selection and Engagement creation.
 * FR-APPLY-07 — contact reveal happens as a side effect of creating the
 * Engagement, not as a separate step: `contactRevealedAt` defaults to
 * now() in the schema.
 * FR-APPLY-09 — if this selection fills the last slot, every applicant
 * still Pending is resolved via resolvePendingApplications() above, in
 * the same transaction.
 */
async function select({ applicationId, employerId }) {
  return prisma.$transaction(async (tx) => {
    const application = await tx.application.findUnique({
      where: { id: applicationId },
      include: { gigPosting: true },
    });
    if (!application) {
      throw AppError.notFound("Application not found");
    }
    if (application.gigPosting.employerId !== employerId) {
      throw AppError.forbidden();
    }
    if (application.status !== "PENDING") {
      throw AppError.conflict("Only a Pending application can be selected");
    }
    if (application.gigPosting.filledCount >= application.gigPosting.workersNeeded) {
      throw AppError.conflict("This posting has no open slots left");
    }

    await tx.application.update({
      where: { id: applicationId },
      data: { status: "SELECTED", decidedAt: new Date() },
    });

    const engagement = await tx.engagement.create({
      data: {
        applicationId,
        gigPostingId: application.gigPostingId,
        workerId: application.workerId,
        employerId,
      },
    });

    const filledCount = application.gigPosting.filledCount + 1;
    const nowFilled = filledCount >= application.gigPosting.workersNeeded;

    await tx.gigPosting.update({
      where: { id: application.gigPostingId },
      data: { filledCount, status: nowFilled ? "FILLED" : application.gigPosting.status },
    });

    await tx.notification.create({
      data: {
        userId: application.workerId,
        type: "APPLICATION_SELECTED",
        payload: { applicationId, gigPostingId: application.gigPostingId },
      },
    });

    if (nowFilled) {
      await resolvePendingApplications({ gigPostingId: application.gigPostingId, tx });
    }

    return engagement;
  });
}

/**
 * FR-APPLY-08 — Explicit decline. No reason attached, notifies immediately.
 */
async function decline({ applicationId, employerId }) {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { gigPosting: true },
  });
  if (!application) {
    throw AppError.notFound("Application not found");
  }
  if (application.gigPosting.employerId !== employerId) {
    throw AppError.forbidden();
  }
  if (application.status !== "PENDING") {
    throw AppError.conflict("Only a Pending application can be declined");
  }

  const [updated] = await prisma.$transaction([
    prisma.application.update({
      where: { id: applicationId },
      data: { status: "DECLINED", decidedAt: new Date() },
    }),
    prisma.notification.create({
      data: {
        userId: application.workerId,
        type: "APPLICATION_DECLINED",
        payload: { applicationId, gigPostingId: application.gigPostingId },
      },
    }),
  ]);

  return updated;
}

/**
 * FR-APPLY-12 — a worker's own application list. Added 2026-08-27; this
 * used to be untracked plumbing for FR-APPLY-01/07 and is now a real story
 * with its own acceptance criteria: posting expiry alongside any Pending
 * application, fill status on multi-slot postings, and Pending
 * applications ordered by soonest expiry.
 *
 * `expiresAt` sorting/display only means something once FR-POST-13's
 * expiry logic actually sets it — until Lahiru's side does, every posting
 * has expiresAt = null and Pending applications simply sort last (treated
 * as "not yet known to expire soon"), which is the safe default.
 */
async function getMyApplications({ workerId }) {
  const applications = await prisma.application.findMany({
    where: { workerId },
    include: {
      gigPosting: {
        select: {
          id: true,
          title: true,
          status: true,
          expiresAt: true,
          workersNeeded: true,
          filledCount: true,
        },
      },
      engagement: {
        select: {
          id: true,
          contactRevealedAt: true,
          employer: { select: { phone: true, legalName: true, businessName: true } },
          gigPosting: { select: { locationAddress: true } },
        },
      },
    },
  });

  // Pending first, soonest posting-expiry first (no known expiry sorts
  // last); everything else follows, most recently decided first.
  applications.sort((a, b) => {
    const aPending = a.status === "PENDING";
    const bPending = b.status === "PENDING";
    if (aPending !== bPending) return aPending ? -1 : 1;

    if (aPending) {
      const aExpiry = a.gigPosting.expiresAt ? new Date(a.gigPosting.expiresAt).getTime() : Infinity;
      const bExpiry = b.gigPosting.expiresAt ? new Date(b.gigPosting.expiresAt).getTime() : Infinity;
      return aExpiry - bExpiry;
    }

    const aDate = new Date(a.decidedAt ?? a.appliedAt).getTime();
    const bDate = new Date(b.decidedAt ?? b.appliedAt).getTime();
    return bDate - aDate;
  });

  return applications;
}

/**
 * FR-APPLY-10 — Pending-applicant notification on material change.
 *
 * This module doesn't own the posting-edit endpoint (Lahiru's FR-POST
 * does), so this is exported for his posting.service.js to call once it
 * decides an edit counts as "material" (pay or start time, per the
 * acceptance criteria) — not called from anywhere in this file itself.
 */
async function notifyPendingApplicantsOfMaterialChange({ gigPostingId }) {
  const pending = await prisma.application.findMany({
    where: { gigPostingId, status: "PENDING" },
    select: { id: true, workerId: true },
  });
  if (pending.length === 0) return;

  await prisma.notification.createMany({
    data: pending.map((a) => ({
      userId: a.workerId,
      type: "MATERIAL_CHANGE",
      payload: { applicationId: a.id, gigPostingId },
    })),
  });
}

export default {
  apply,
  withdraw,
  getApplicantPool,
  select,
  decline,
  getMyApplications,
  resolvePendingApplications,
  notifyPendingApplicantsOfMaterialChange,
};
