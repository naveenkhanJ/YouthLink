/**
 * Engagement Lifecycle — cancellation, and every deadline that ends in one.
 *
 * Epic: FR-ENG  ·  Owner: Naveenkhan
 *
 *   - FR-ENG-05: more than 48 hours to the start → a REQUEST, with a reason from the fixed list
 *     and 48 hours for the other party to accept or reject. Silence resolves it against the
 *     non-responder: the cancellation takes effect (prototype 5.8t "If she doesn't, the
 *     cancellation takes effect"; 5.9 "the request resolves against you"). Never Late.
 *   - FR-ENG-06: 48 hours or less → IMMEDIATE, still with a reason; Late within 6 hours of the
 *     start, or within 24 hours when the engagement was agreed more than 48 hours ahead.
 *   - FR-ENG-07: a CompletionRecord against the responsible party — weight 2.0 Late, 1.0 early.
 *   - FR-ENG-08: one cancellation reopens one place on the posting, nothing else.
 *   - FR-RATE-05: rating opens at the cancellation but is not enforced.
 *   - FR-ENG-09 rules 4 and 5: a material change the worker declines, or does not accept before
 *     its window closes, cancels the engagement as the EMPLOYER's change, with no record against
 *     the worker.
 *
 * Deadlines are enforced twice over, so nothing depends on one mechanism: lazily, whenever an
 * engagement is read or answered (resolveOverdue), and by a timer (startEngagementDeadlineSweep),
 * the same pattern as the posting module's expiry sweep.
 */
import prisma from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";
import { syncPostingStatus } from "../posting/posting.service.js";
import {
  CANCELLATION_REASONS,
  CANCELLATION_WINDOW_MS,
  EARLY_WEIGHT,
  LATE_WEIGHT,
  cancellationRegime,
  employerDisplayName,
  hasStarted,
  lateReason,
  partyOf,
} from "./engagement.rules.js";

export const SWEEP_INTERVAL_MS = 5 * 60 * 1000;

// ---------------------------------------------------------------------------
// Building blocks, all run inside the caller's transaction (`tx`)
// ---------------------------------------------------------------------------

/**
 * Lock the engagement row until the transaction ends, so two people cancelling, answering or a
 * sweep running at the same moment cannot both decide from the same stale read (AGENTS.md:
 * `$transaction` alone does not lock rows).
 */
async function lockEngagement(tx, engagementId) {
  await tx.$queryRaw`SELECT "id" FROM "Engagement" WHERE "id" = ${engagementId} FOR UPDATE`;
}

/**
 * FR-ENG-08: reopen ONE place. The posting row is locked first so a selection running at the same
 * moment cannot read a stale fill count; the count never goes below zero; then the posting
 * module's own rule turns Filled back into Open (a Withdrawn or Expired posting stays as it is).
 */
export async function reopenSlot(tx, gigPostingId) {
  await tx.$queryRaw`SELECT "id" FROM "GigPosting" WHERE "id" = ${gigPostingId} FOR UPDATE`;
  await tx.gigPosting.updateMany({
    where: { id: gigPostingId, filledCount: { gt: 0 } },
    data: { filledCount: { decrement: 1 } },
  });
  await syncPostingStatus(gigPostingId, tx);
}

/**
 * Write a cancellation's settled outcome on the engagement: Cancelled, who it is attributed to,
 * the reason, Late or not, and rating opened but unenforced (FR-RATE-05). Then reopen the place.
 * Only an Active engagement can be cancelled; anything else is a 409.
 */
export async function applyCancellation(tx, { engagement, at, cancelledByUserId, reason, isLate }) {
  const { count } = await tx.engagement.updateMany({
    where: { id: engagement.id, status: "ACTIVE" },
    data: {
      status: "CANCELLED",
      cancelledAt: at,
      cancelledByUserId,
      cancellationReason: reason,
      isLateCancellation: isLate,
      ratingOpenedAt: at,
      ratingEnforced: false,
    },
  });
  if (count === 0) throw AppError.conflict("This engagement is no longer active.");
  await reopenSlot(tx, engagement.gigPostingId);
}

/** FR-ENG-07: one completion-rate entry against the responsible party. */
function recordCancellation(tx, { userId, engagementId, late, at }) {
  return tx.completionRecord.create({
    data: {
      userId,
      engagementId,
      outcome: late ? "LATE_CANCELLATION" : "EARLY_CANCELLATION",
      weight: late ? LATE_WEIGHT : EARLY_WEIGHT,
      recordedAt: at,
    },
  });
}

function notify(tx, userId, type, payload) {
  return tx.notification.create({ data: { userId, type, payload } });
}

/** The name a party is known by in the other's notifications. */
function nameOf(engagement, userId) {
  return userId === engagement.workerId
    ? engagement.worker?.legalName
    : employerDisplayName(engagement.gigPosting, engagement.employer);
}

const ENGAGEMENT_FOR_CANCELLING = {
  gigPosting: { select: { id: true, title: true, startAt: true, postedAsType: true, postedBusinessName: true } },
  worker: { select: { legalName: true } },
  employer: { select: { legalName: true, businessName: true } },
};

/**
 * FR-ENG-09 rules 4 and 5: cancel because the worker did not take the employer's change —
 * declined (`declined: true`) or let the window close. Recorded as the employer's change: the
 * engagement's cancelledByUserId is the employer, a CancellationRequest row is written straight
 * as IMMEDIATE (database-schema.md, CancellationRequest), and NO CompletionRecord is written.
 */
export async function cancelForMaterialChange(tx, { engagement, request, at, declined }) {
  const answered = await tx.materialChangeRequest.updateMany({
    where: { id: request.id, status: "PENDING" },
    data: { status: "DECLINED_ROUTED_TO_CANCELLATION", respondedAt: declined ? at : null },
  });
  if (answered.count === 0) throw AppError.conflict("This change has already been answered.");

  // The request row needs a reason from the fixed list; the change made the details unsuitable.
  const reason = "DETAILS_NO_LONGER_SUITABLE";
  await tx.cancellationRequest.create({
    data: {
      engagementId: engagement.id,
      requestedByUserId: engagement.employerId,
      reason,
      isUrgentEngagement: cancellationRegime(engagement.gigPosting.startAt, at) === "URGENT",
      deadline: null,
      status: "IMMEDIATE",
      requestedAt: at,
    },
  });
  await applyCancellation(tx, { engagement, at, cancelledByUserId: engagement.employerId, reason, isLate: false });
}

// ---------------------------------------------------------------------------
// FR-ENG-05 / 06 — cancelling, or asking to
// ---------------------------------------------------------------------------

/**
 * Either party cancels a not-yet-started engagement. The regime is decided now, from how far
 * away the start is now (FR-ENG-05/06 as amended 2026-09-24).
 *
 * @returns {Promise<{ mode: "REQUESTED", deadline: Date } | { mode: "CANCELLED", isLate: boolean, lateReason: string|null }>}
 */
export async function cancelEngagement({ engagementId, userId, reason, now = new Date() }) {
  if (!CANCELLATION_REASONS.includes(reason)) {
    throw AppError.badRequest("Choose a reason from the list.");
  }
  // A request whose window has already closed is settled before anything else is decided.
  await resolveOverdue({ engagementId, now });

  return prisma.$transaction(async (tx) => {
    await lockEngagement(tx, engagementId);
    const engagement = await tx.engagement.findUnique({
      where: { id: engagementId },
      include: { ...ENGAGEMENT_FOR_CANCELLING, cancellationRequests: { where: { status: "PENDING" } } },
    });
    if (!engagement) throw AppError.notFound("Engagement not found.");
    const party = partyOf(engagement, userId);
    if (!party) throw AppError.forbidden();
    if (engagement.status !== "ACTIVE") throw AppError.conflict("This engagement is no longer active.");
    if (hasStarted(engagement, engagement.gigPosting, now)) {
      throw AppError.conflict("This engagement has already started, so it can't be cancelled.");
    }
    if (engagement.cancellationRequests.length > 0) {
      throw AppError.conflict("A cancellation request is already waiting for an answer.");
    }

    const otherUserId = party === "WORKER" ? engagement.employerId : engagement.workerId;
    const base = {
      engagementId,
      gigPostingId: engagement.gigPostingId,
      title: engagement.gigPosting.title,
      reason,
      fromName: nameOf(engagement, userId),
    };

    if (cancellationRegime(engagement.gigPosting.startAt, now) === "REGULAR") {
      // FR-ENG-05: a request. The regime is stored with it and never recomputed.
      const deadline = new Date(now.getTime() + CANCELLATION_WINDOW_MS);
      await tx.cancellationRequest.create({
        data: {
          engagementId,
          requestedByUserId: userId,
          reason,
          isUrgentEngagement: false,
          deadline,
          status: "PENDING",
          requestedAt: now,
        },
      });
      // FR-NOTIF-05: the responding party, whose 48-hour window runs from this.
      await notify(tx, otherUserId, "CANCELLATION_REQUEST", { ...base, deadline });
      return { mode: "REQUESTED", deadline };
    }

    // FR-ENG-06: immediate. Late is decided now too.
    const late = lateReason({ startAt: engagement.gigPosting.startAt, engagementCreatedAt: engagement.createdAt, now });
    await tx.cancellationRequest.create({
      data: {
        engagementId,
        requestedByUserId: userId,
        reason,
        isUrgentEngagement: true,
        deadline: null,
        status: "IMMEDIATE",
        requestedAt: now,
      },
    });
    await applyCancellation(tx, { engagement, at: now, cancelledByUserId: userId, reason, isLate: Boolean(late) });
    // FR-ENG-07: against the party who cancelled.
    await recordCancellation(tx, { userId, engagementId, late: Boolean(late), at: now });
    // The other party is told at once (5.10 "Lanka Events is told now"): the outcome type.
    await notify(tx, otherUserId, "CANCELLATION_RESOLVED", { ...base, outcome: "IMMEDIATE", isLate: Boolean(late) });
    return { mode: "CANCELLED", isLate: Boolean(late), lateReason: late };
  });
}

/**
 * FR-ENG-05: the other party answers a pending request.
 *   - Accept → cancelled, attributed to the requester, early (weight 1.0) against the requester
 *     — "no penalty to you" for the one who accepted (5.9, 5.9b).
 *   - Don't agree → the engagement stands as agreed (5.9r).
 * Either way the requester is told (CANCELLATION_RESOLVED, FR-NOTIF-05).
 */
export async function respondToCancellation({ engagementId, userId, accept, now = new Date() }) {
  if (typeof accept !== "boolean") throw AppError.badRequest("Say whether you accept the cancellation.");
  await resolveOverdue({ engagementId, now });

  return prisma.$transaction(async (tx) => {
    await lockEngagement(tx, engagementId);
    const engagement = await tx.engagement.findUnique({
      where: { id: engagementId },
      include: ENGAGEMENT_FOR_CANCELLING,
    });
    if (!engagement) throw AppError.notFound("Engagement not found.");
    if (!partyOf(engagement, userId)) throw AppError.forbidden();

    const request = await tx.cancellationRequest.findFirst({
      where: { engagementId, status: "PENDING" },
      orderBy: { requestedAt: "desc" },
    });
    if (!request) throw AppError.conflict("There is no cancellation request waiting for your answer.");
    if (request.requestedByUserId === userId) {
      throw AppError.forbidden("You sent this request — the other party answers it.");
    }

    const status = accept ? "ACCEPTED" : "REJECTED";
    const answered = await tx.cancellationRequest.updateMany({
      where: { id: request.id, status: "PENDING" },
      data: { status, respondedAt: now },
    });
    if (answered.count === 0) throw AppError.conflict("This request has already been answered.");

    if (accept) {
      await applyCancellation(tx, {
        engagement,
        at: now,
        cancelledByUserId: request.requestedByUserId,
        reason: request.reason,
        isLate: false, // FR-ENG-05: a regular cancellation is never Late
      });
      await recordCancellation(tx, { userId: request.requestedByUserId, engagementId, late: false, at: now });
    }

    await notify(tx, request.requestedByUserId, "CANCELLATION_RESOLVED", {
      engagementId,
      gigPostingId: engagement.gigPostingId,
      title: engagement.gigPosting.title,
      outcome: status,
      fromName: nameOf(engagement, userId),
    });
    return { outcome: status, engagementStatus: accept ? "CANCELLED" : "ACTIVE" };
  });
}

// ---------------------------------------------------------------------------
// Deadlines: unanswered cancellation requests and material changes
// ---------------------------------------------------------------------------

/**
 * Settle every window that has closed, for one engagement, one user's engagements, or all.
 *
 *   - A cancellation request nobody answered → AUTO_RESOLVED_NO_RESPONSE: the cancellation takes
 *     effect at the deadline, attributed to the requester, never Late; the early-cancellation
 *     record goes against the NON-RESPONDER ("resolves against whoever did not respond",
 *     FR-ENG-05 — see the report's question on this); the requester is told.
 *   - A material change not accepted in time → the same path as declining it (FR-ENG-09 rule 4).
 *
 * Each one runs in its own transaction, so one failure never blocks the others.
 *
 * @returns {Promise<{ cancellations: number, changes: number }>} how many were settled
 */
export async function resolveOverdue({ now = new Date(), engagementId = null, userId = null } = {}) {
  const engagementFilter = { status: "ACTIVE" };
  if (engagementId) engagementFilter.id = engagementId;
  if (userId) engagementFilter.OR = [{ workerId: userId }, { employerId: userId }];

  const dueCancellations = await prisma.cancellationRequest.findMany({
    where: { status: "PENDING", deadline: { lte: now }, engagement: engagementFilter },
    select: { id: true, engagementId: true },
  });
  const dueChanges = await prisma.materialChangeRequest.findMany({
    where: { status: "PENDING", deadline: { lte: now }, engagement: engagementFilter },
    select: { id: true, engagementId: true },
  });

  let cancellations = 0;
  for (const due of dueCancellations) {
    const settled = await prisma.$transaction(async (tx) => {
      await lockEngagement(tx, due.engagementId);
      const request = await tx.cancellationRequest.findUnique({ where: { id: due.id } });
      const engagement = await tx.engagement.findUnique({ where: { id: due.engagementId }, include: ENGAGEMENT_FOR_CANCELLING });
      if (!request || request.status !== "PENDING" || engagement?.status !== "ACTIVE") return false;

      const at = request.deadline; // it took effect when the window closed, however late we notice
      const { count } = await tx.cancellationRequest.updateMany({
        where: { id: request.id, status: "PENDING" },
        data: { status: "AUTO_RESOLVED_NO_RESPONSE" },
      });
      if (count === 0) return false;

      const nonResponder = request.requestedByUserId === engagement.workerId ? engagement.employerId : engagement.workerId;
      await applyCancellation(tx, {
        engagement,
        at,
        cancelledByUserId: request.requestedByUserId,
        reason: request.reason,
        isLate: false,
      });
      await recordCancellation(tx, { userId: nonResponder, engagementId: engagement.id, late: false, at });
      await notify(tx, request.requestedByUserId, "CANCELLATION_RESOLVED", {
        engagementId: engagement.id,
        gigPostingId: engagement.gigPostingId,
        title: engagement.gigPosting.title,
        outcome: "AUTO_RESOLVED_NO_RESPONSE",
        fromName: nameOf(engagement, nonResponder),
      });
      return true;
    });
    if (settled) cancellations += 1;
  }

  let changes = 0;
  for (const due of dueChanges) {
    const settled = await prisma.$transaction(async (tx) => {
      await lockEngagement(tx, due.engagementId);
      const request = await tx.materialChangeRequest.findUnique({ where: { id: due.id } });
      const engagement = await tx.engagement.findUnique({ where: { id: due.engagementId }, include: ENGAGEMENT_FOR_CANCELLING });
      if (!request || request.status !== "PENDING" || engagement?.status !== "ACTIVE") return false;
      await cancelForMaterialChange(tx, { engagement, request, at: request.deadline, declined: false });
      return true;
    });
    if (settled) changes += 1;
  }

  return { cancellations, changes };
}

/**
 * Run resolveOverdue on a timer, so a window closes even when nobody opens the app. The timer is
 * unref()'d: it never keeps the process alive on its own. Start it once, at server start-up,
 * beside startPostingExpirySweep (backend/index.js).
 */
export function startEngagementDeadlineSweep(intervalMs = SWEEP_INTERVAL_MS) {
  const timer = setInterval(() => {
    resolveOverdue().catch((error) => console.error("Engagement deadline sweep failed:", error));
  }, intervalMs);
  timer.unref();
  return timer;
}
