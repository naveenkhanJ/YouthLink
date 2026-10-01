/**
 * Engagement Lifecycle services — business rules and data access.
 *
 * Epic: FR-ENG  ·  Owner: Naveenkhan
 *
 * Implements:
 *   - FR-ENG-14: the engagements list — status and the viewer's owed action kept separate, and
 *                finished engagements kept for 30 days after their rating window closes
 *   - FR-ENG-01: check-in code checkpoints, in order, with the custody flip at payment
 *   - FR-ENG-02: no payment checkpoint for an unpaid internship
 *   - FR-ENG-04: every code and counter belongs to one Engagement, never to the posting
 *   - FR-ENG-12: Part-time End Engagement ("did something go wrong?": no → rating; yes → the
 *                dispute route, a clearly marked STUB because the Disputes module is not built)
 *   - FR-ENG-09: the worker's answer to a material change (accept, or decline → cancelled at
 *                once as the employer's change)
 *   - FR-ENG-03: unable to confirm → Disputed (the dispute case itself is the M9 stub)
 *
 * Cancellation (FR-ENG-05..08) and every deadline that ends in one live in
 * engagement.cancellation.js; reads here first settle any window that has closed (resolveOverdue).
 *
 * The decisions themselves (which checkpoint is live, who holds which code, what the viewer
 * owes, whether a row is still listed) live in engagement.rules.js, so the list, the detail and
 * the code check can never disagree.
 */
import prisma from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";
import { cancelForMaterialChange, resolveOverdue } from "./engagement.cancellation.js";
import {
  CHECKPOINTS,
  CODE_HOLDER,
  cancellationPreview,
  checkpointFields,
  codeHeldBy,
  employerDisplayName,
  hasPaymentCheckpoint,
  hasRated,
  hasStarted,
  isListed,
  lateReason,
  liveCheckpoint,
  nextActionFor,
  nextCheckpoint,
  partyOf,
  ratingWindow,
} from "./engagement.rules.js";

// The posting fields every engagement screen needs. Location is limited to the coarse area: the
// precise address was already revealed to the selected worker in Applying (FR-APPLY-07) and no
// engagement screen draws it.
const POSTING_SUMMARY = {
  id: true,
  title: true,
  arrangementType: true,
  payKind: true,
  payAmount: true,
  payRateUnit: true,
  workersNeeded: true,
  schedule: true,
  startAt: true,
  isUrgent: true,
  locationAreaLabel: true,
  postedAsType: true,
  postedBusinessName: true,
};

const PARTY_SELECT = {
  id: true,
  legalName: true,
  businessName: true,
  phone: true,
  phoneVerifiedAt: true,
};

// Everything the rules in engagement.rules.js read, for the list and the detail alike.
const ENGAGEMENT_INCLUDE = {
  gigPosting: { select: POSTING_SUMMARY },
  worker: { select: PARTY_SELECT },
  employer: { select: PARTY_SELECT },
  // ALL ratings of the engagement (both sides), but only who rated and whether it was revealed —
  // never the score, which stays hidden until the reveal (FR-RATE-02, the rating module's job).
  ratings: { select: { raterId: true, revealedAt: true } },
  materialChangeRequests: {
    select: { id: true, status: true, deadline: true, changeSummary: true, proposedAt: true, respondedAt: true },
    orderBy: { proposedAt: "desc" },
  },
  // Every request, newest first: the pending one drives the owed action, the settled one the
  // detail's cancel note.
  cancellationRequests: {
    select: {
      id: true,
      status: true,
      requestedByUserId: true,
      reason: true,
      deadline: true,
      requestedAt: true,
      respondedAt: true,
    },
    orderBy: { requestedAt: "desc" },
  },
};

/** The other party, as the viewer sees them. */
function counterpartyOf(eng, party) {
  if (party === "WORKER") {
    return {
      id: eng.employer.id,
      name: employerDisplayName(eng.gigPosting, eng.employer),
      phone: eng.employer.phone,
      phoneVerified: Boolean(eng.employer.phoneVerifiedAt),
    };
  }
  return {
    id: eng.worker.id,
    name: eng.worker.legalName,
    phone: eng.worker.phone,
    phoneVerified: Boolean(eng.worker.phoneVerifiedAt),
  };
}

/** One notification row. Payloads carry ids plus the few strings a history row shows (FR-NOTIF-08, A11). */
function notify(db, userId, type, payload) {
  return db.notification.create({ data: { userId, type, payload } });
}

/**
 * FR-NOTIF-11 — both parties are told the rating window has opened (RATING_WINDOW_OPEN, A11:
 * "counterparty · closes in 14 days"). Called in the same transaction that completes the engagement.
 * The row is worded from the two names and the party it is for, so each side reads its own version.
 */
function notifyRatingOpen(tx, eng, posting, workerName, employerName) {
  const base = { engagementId: eng.id, gigPostingId: eng.gigPostingId, postingTitle: posting.title };
  return tx.notification.createMany({
    data: [
      { userId: eng.workerId, type: "RATING_WINDOW_OPEN", payload: { ...base, party: "WORKER", counterpartName: employerName } },
      { userId: eng.employerId, type: "RATING_WINDOW_OPEN", payload: { ...base, party: "EMPLOYER", counterpartName: workerName } },
    ],
  });
}

/** Load an engagement the user is a party to, or throw 404 / 403. */
async function loadForParty(db, engagementId, userId, include = ENGAGEMENT_INCLUDE) {
  const eng = await db.engagement.findUnique({ where: { id: engagementId }, include });
  if (!eng) throw AppError.notFound("Engagement not found.");
  const party = partyOf(eng, userId);
  if (!party) throw AppError.forbidden();
  return { eng, party };
}

// ---------------------------------------------------------------------------
// FR-ENG-14 — Engagements list
// ---------------------------------------------------------------------------

/**
 * Every engagement the user is a party to that still belongs on their list, newest first, each
 * with its counterparty, posting, status and the viewer's own next action (or none).
 */
async function listEngagements({ userId, role, now = new Date() }) {
  await resolveOverdue({ userId, now }); // windows that closed since the last look
  const where = role === "YOUTH_JOB_SEEKER" ? { workerId: userId } : { employerId: userId };
  const rows = await prisma.engagement.findMany({
    where,
    include: ENGAGEMENT_INCLUDE,
    orderBy: [{ createdAt: "desc" }],
  });

  return rows
    .filter((eng) => isListed(eng, eng.gigPosting, userId, now))
    .map((eng) => {
      const party = partyOf(eng, userId);
      return {
        id: eng.id,
        status: eng.status,
        counterpartyName: counterpartyOf(eng, party).name,
        postingTitle: eng.gigPosting.title,
        gigPostingId: eng.gigPostingId,
        // A change waiting on the worker: the employer's row then opens Change responses (5.12).
        hasPendingChange: eng.materialChangeRequests.some((r) => r.status === "PENDING"),
        // e.g. { kind: "CODE", checkpoint: "arrival", role: "ENTERER" } — the screen words it.
        nextAction: nextActionFor(eng, eng.gigPosting, userId, now),
      };
    });
}

// ---------------------------------------------------------------------------
// One engagement, as the viewer may see it
// ---------------------------------------------------------------------------

/**
 * The engagement detail. Built field by field rather than by spreading the row, because the row
 * holds all three check-in codes and each party may see ONLY the code it holds (FR-ENG-01):
 * returning the row let the worker read the employer's codes and the reverse.
 */
async function getEngagementById({ engagementId, userId, now = new Date() }) {
  await resolveOverdue({ engagementId, now });
  const { eng, party } = await loadForParty(prisma, engagementId, userId);
  return presentEngagement(eng, party, userId, now);
}

/** The detail's response body. Exported through the service for the tests. */
function presentEngagement(eng, party, userId, now = new Date()) {
  const posting = eng.gigPosting;
  const live = liveCheckpoint(eng, posting, now);
  const window = ratingWindow(eng, now);
  const checkpoint = (name) => ({
    status: eng[checkpointFields(name).status] ?? "PENDING",
    confirmedAt: eng[checkpointFields(name).confirmedAt] ?? null,
  });

  const pendingChange = eng.materialChangeRequests.find((r) => r.status === "PENDING") ?? null;
  const declinedChange =
    eng.materialChangeRequests.find((r) => r.status === "DECLINED_ROUTED_TO_CANCELLATION") ?? null;
  const pendingCancellation = eng.cancellationRequests.find((r) => r.status === "PENDING") ?? null;
  // The request that settled a cancellation (ACCEPTED, AUTO_RESOLVED…), for the cancel note.
  const settledCancellation =
    eng.status === "CANCELLED" ? eng.cancellationRequests.find((r) => r.status !== "PENDING") ?? null : null;
  const canCancel = eng.status === "ACTIVE" && !hasStarted(eng, posting, now) && !pendingCancellation;

  // A code can only be shown once it exists. Engagements created before selection generated
  // codes have none: say so instead of showing nothing, and never fall back to a fixed code.
  const heldCode = codeHeldBy(eng, posting, party, now);
  const codesMissing = Boolean(live) && !eng[checkpointFields(live).code];

  return {
    id: eng.id,
    status: eng.status,
    viewerRole: party, // "WORKER" | "EMPLOYER"
    counterparty: counterpartyOf(eng, party),
    posting,
    hasStarted: hasStarted(eng, posting, now),
    checkpoints: {
      arrival: checkpoint("arrival"),
      completion: checkpoint("completion"),
      // FR-ENG-02: an unpaid internship has no payment checkpoint at all, so none is sent.
      payment: hasPaymentCheckpoint(posting) ? checkpoint("payment") : null,
    },
    liveCheckpoint: live,
    // What the viewer does at the live checkpoint: show their code, or enter the other's.
    liveRole: live ? (CODE_HOLDER[live] === party ? "HOLDER" : "ENTERER") : null,
    myCode: heldCode,
    codesMissing,
    nextAction: nextActionFor(eng, posting, userId, now),
    // End Engagement is part-time only, and only once it has started (FR-ENG-12).
    canEnd: eng.status === "ACTIVE" && posting.arrangementType === "PART_TIME" && hasStarted(eng, posting, now),
    pendingChange: pendingChange
      ? { id: pendingChange.id, changeSummary: pendingChange.changeSummary, deadline: pendingChange.deadline }
      : null,
    // respondedAt is null when the window closed without an answer (FR-ENG-09 rule 4).
    declinedChange: declinedChange
      ? { changeSummary: declinedChange.changeSummary, respondedAt: declinedChange.respondedAt, deadline: declinedChange.deadline }
      : null,
    // FR-ENG-05/06: whether "Cancel engagement" is offered, and what it would mean right now.
    canCancel,
    cancelPreview: canCancel ? cancellationPreview(eng, posting, now) : null,
    pendingCancellation: pendingCancellation
      ? {
          id: pendingCancellation.id,
          requestedByMe: pendingCancellation.requestedByUserId === userId,
          reason: pendingCancellation.reason,
          deadline: pendingCancellation.deadline,
          requestedAt: pendingCancellation.requestedAt,
        }
      : null,
    cancellation:
      eng.status === "CANCELLED"
        ? {
            at: eng.cancelledAt,
            byMe: Boolean(eng.cancelledByUserId) && eng.cancelledByUserId === userId,
            reason: eng.cancellationReason,
            isLate: Boolean(eng.isLateCancellation),
            lateReason: eng.isLateCancellation
              ? lateReason({ startAt: posting.startAt, engagementCreatedAt: eng.createdAt, now: new Date(eng.cancelledAt) })
              : null,
            // How it was settled: IMMEDIATE, ACCEPTED, AUTO_RESOLVED_NO_RESPONSE (null on old rows).
            via: settledCancellation?.status ?? null,
            requestedByMe: settledCancellation ? settledCancellation.requestedByUserId === userId : null,
            deadline: settledCancellation?.deadline ?? null,
          }
        : null,
    cancelledAt: eng.cancelledAt,
    cancelledByMe: Boolean(eng.cancelledByUserId) && eng.cancelledByUserId === userId,
    endedAt: eng.endedAt,
    endedByMe: Boolean(eng.endedByUserId) && eng.endedByUserId === userId,
    rating: {
      openedAt: window.openedAt,
      closesAt: window.closesAt,
      isOpen: window.isOpen,
      revealed: window.revealed,
      enforced: eng.ratingEnforced !== false,
      submitted: hasRated(eng, userId),
    },
  };
}

// ---------------------------------------------------------------------------
// FR-ENG-01 / 02 / 04 — Check-in codes
// ---------------------------------------------------------------------------

const ENTERER_LABEL = { arrival: "worker", completion: "worker", payment: "employer" };

// Shown under the code boxes for a wrong code. Naveenkhan's wording, kept; the payment line now
// names the worker, who holds that code.
const WRONG_CODE = {
  WORKER: "Incorrect code. Please ask the employer to check their screen.",
  EMPLOYER: "Incorrect code. Please ask the worker to show their payment code.",
};

/** The `where` that matches a checkpoint still waiting to be confirmed. Payment starts out null. */
function stillPending(checkpoint) {
  const { status } = checkpointFields(checkpoint);
  if (checkpoint === "payment") return { OR: [{ [status]: null }, { [status]: "PENDING" }] };
  return { [status]: "PENDING" };
}

/**
 * Confirm a checkpoint by entering the other party's code.
 *
 *  - Only the party who does NOT hold the code may enter it: the worker at arrival and
 *    completion, the employer at payment (the custody flip, FR-ENG-01).
 *  - The checkpoints run in order; a later one cannot be entered first.
 *  - Each code is single-use, and is compared only with THIS checkpoint's code of THIS
 *    engagement — so a code from another checkpoint, or another worker's engagement on the same
 *    posting, is simply a wrong code (FR-ENG-01, FR-ENG-04).
 *  - A wrong code is recorded, never locked out (batch A17): the attempt counter is incremented
 *    and that write is COMMITTED before the 400 goes back. (Throwing inside the transaction, as
 *    this function used to, rolled the increment back, so no attempt was ever recorded.)
 *  - The last checkpoint of a gig or internship completes the engagement and opens rating
 *    (FR-RATE-05). A part-time job does not complete by its codes: it closes through End
 *    Engagement (FR-ENG-01 as amended 2026-09-24, FR-ENG-12).
 */
async function verifyCheckpointCode({ engagementId, userId, checkpoint, code, now = new Date() }) {
  if (!CHECKPOINTS.includes(checkpoint)) {
    throw AppError.badRequest("Unknown checkpoint.");
  }
  const entered = typeof code === "string" ? code.trim() : "";
  if (!/^\d{6}$/.test(entered)) {
    throw AppError.badRequest("Enter the 6-digit code.");
  }

  const result = await prisma.$transaction(async (tx) => {
    const { eng, party } = await loadForParty(tx, engagementId, userId, {
      gigPosting: { select: POSTING_SUMMARY },
      worker: { select: PARTY_SELECT },
      employer: { select: PARTY_SELECT },
    });
    const posting = eng.gigPosting;
    const fields = checkpointFields(checkpoint);

    if (eng.status !== "ACTIVE") {
      throw AppError.conflict("This engagement is no longer active.");
    }
    if (checkpoint === "payment" && !hasPaymentCheckpoint(posting)) {
      throw AppError.conflict("An unpaid internship has no payment checkpoint.");
    }
    if (CODE_HOLDER[checkpoint] === party) {
      throw AppError.forbidden(`This code is entered by the ${ENTERER_LABEL[checkpoint]}.`);
    }
    if (eng[fields.status] === "CONFIRMED") {
      throw AppError.conflict("This checkpoint has already been confirmed.");
    }
    if (eng[fields.status] === "UNABLE_TO_CONFIRM") {
      throw AppError.conflict("This checkpoint is waiting on a dispute.");
    }
    const due = nextCheckpoint(eng, posting);
    if (due !== checkpoint) {
      throw AppError.conflict(`Confirm ${due} first.`);
    }

    const expected = eng[fields.code];
    if (!expected) {
      // Engagements created before codes were generated at selection: fail safely.
      throw AppError.conflict("No check-in codes were issued for this engagement, so this checkpoint can't be confirmed by code.");
    }

    if (entered !== expected) {
      // Recorded, never locked (FR-ENG-01 batch A17): an atomic increment, committed with the
      // transaction because we RETURN here rather than throw.
      await tx.engagement.update({
        where: { id: engagementId },
        data: { [fields.failedAttempts]: { increment: 1 } },
      });
      return { ok: false, party };
    }

    // Is this the engagement's last checkpoint, and does it close by codes?
    const isLast = nextCheckpoint({ ...eng, [fields.status]: "CONFIRMED" }, posting) === null;
    const completes = isLast && posting.arrangementType !== "PART_TIME";

    const data = { [fields.status]: "CONFIRMED", [fields.confirmedAt]: now };
    if (checkpoint === "arrival" && !eng.startedAt) data.startedAt = now;
    if (checkpoint === "completion" && hasPaymentCheckpoint(posting)) data.paymentStatus = "PENDING";
    if (completes) {
      data.status = "COMPLETED";
      data.ratingOpenedAt = now;
    }

    // Single use under concurrency: only the request that finds the checkpoint still pending
    // writes it; a second identical entry a moment later gets the 409.
    const { count } = await tx.engagement.updateMany({
      where: { id: engagementId, status: "ACTIVE", ...stillPending(checkpoint) },
      data,
    });
    if (count === 0) throw AppError.conflict("This checkpoint has already been confirmed.");

    if (completes) {
      // FR-ENG-07: a completed engagement counts fully towards the worker's completion rate.
      await tx.completionRecord.create({
        data: { userId: eng.workerId, engagementId, outcome: "COMPLETED", weight: 1.0 },
      });
      // FR-NOTIF-11: rating opens now, so both parties are told.
      await notifyRatingOpen(tx, eng, posting, eng.worker.legalName, employerDisplayName(posting, eng.employer));
    }

    return {
      ok: true,
      checkpoint,
      engagementStatus: completes ? "COMPLETED" : "ACTIVE",
      completed: completes,
      nextCheckpoint: isLast ? null : nextCheckpoint({ ...eng, [fields.status]: "CONFIRMED" }, posting),
    };
  });

  if (!result.ok) throw AppError.badRequest(WRONG_CODE[result.party]);
  const { ok, ...body } = result; // eslint-disable-line no-unused-vars
  return body;
}

// ---------------------------------------------------------------------------
// FR-ENG-12 — Part-time End Engagement
// ---------------------------------------------------------------------------

/**
 * Either party ends a part-time engagement that has started.
 *
 *  - "No, nothing went wrong" → Ended, rating opens for both (FR-RATE-01/05), the worker's
 *    completion record is written however short the engagement was (no minimum duration).
 *  - "Yes" → the dispute route. STUB: the Disputes module (M9, FR-DISPUTE-03) is not built, so no
 *    DisputeCase is created. The engagement is set Disputed with endIssueFlag, which keeps rating
 *    closed, and the case can be created from that flag once M9 exists.
 *  - Before the start it is a cancellation instead (code ROUTE_TO_CANCEL).
 *  - The other party is notified either way (END_ENGAGEMENT, FR-NOTIF-05). Only this one
 *    engagement changes, never the posting's other engagements.
 */
async function endEngagement({ engagementId, userId, somethingWentWrong, now = new Date() }) {
  if (typeof somethingWentWrong !== "boolean") {
    throw AppError.badRequest("Say whether something went wrong.");
  }

  return prisma.$transaction(async (tx) => {
    const { eng, party } = await loadForParty(tx, engagementId, userId, {
      gigPosting: { select: POSTING_SUMMARY },
      worker: { select: PARTY_SELECT },
      employer: { select: PARTY_SELECT },
    });
    const posting = eng.gigPosting;

    if (eng.status !== "ACTIVE") {
      throw AppError.conflict("This engagement is no longer active.");
    }
    if (posting.arrangementType !== "PART_TIME") {
      throw AppError.conflict("End Engagement is only for part-time jobs.");
    }
    if (!hasStarted(eng, posting, now)) {
      throw new AppError(409, "This engagement hasn't started yet, so it can be cancelled instead.", undefined, "ROUTE_TO_CANCEL");
    }

    const data = somethingWentWrong
      ? { status: "DISPUTED", endedAt: now, endedByUserId: userId, endIssueFlag: true }
      : { status: "ENDED", endedAt: now, endedByUserId: userId, endIssueFlag: false, ratingOpenedAt: now };

    const { count } = await tx.engagement.updateMany({ where: { id: engagementId, status: "ACTIVE" }, data });
    if (count === 0) throw AppError.conflict("This engagement is no longer active.");

    const otherUserId = party === "WORKER" ? eng.employerId : eng.workerId;
    const endedByName = party === "WORKER" ? eng.worker.legalName : employerDisplayName(posting, eng.employer);
    await notify(tx, otherUserId, "END_ENGAGEMENT", {
      engagementId,
      gigPostingId: eng.gigPostingId,
      title: posting.title,
      endedByName,
      somethingWentWrong,
    });

    if (!somethingWentWrong) {
      await tx.completionRecord.create({
        data: { userId: eng.workerId, engagementId, outcome: "COMPLETED", weight: 1.0 },
      });
      // FR-NOTIF-11: rating opens now, so both parties are told.
      await notifyRatingOpen(tx, eng, posting, eng.worker.legalName, employerDisplayName(posting, eng.employer));
    }

    return {
      engagementStatus: data.status,
      // "rating": open the rating step now; "dispute": the dispute route (stubbed, see above).
      next: somethingWentWrong ? "dispute" : "rating",
    };
  });
}

// ---------------------------------------------------------------------------
// FR-ENG-09 — the worker's answer to a material change
// ---------------------------------------------------------------------------

/**
 * Accept or decline the pending material change on the worker's engagement.
 *
 *  - Accept: the request is marked Accepted; the engagement carries on with the new terms.
 *    An answer after the window has closed is refused — the window is the rule (FR-ENG-09).
 *  - Decline ("Can't make it", rule 5): the engagement is cancelled at once, recorded as the
 *    EMPLOYER's change (cancelledByUserId = the employer), with no completion record against the
 *    worker (rule 4). Rating stays available but unenforced (FR-RATE-05), and the one place
 *    reopens (FR-ENG-08) through the posting module's syncPostingStatus.
 *
 * No notification is written: no requirement names one for the worker's answer (the employer
 * follows the answers on Change responses, 5.12). See "Questions for Afham".
 */
async function reconfirmMaterialChange({ engagementId, userId, accept, now = new Date() }) {
  if (typeof accept !== "boolean") {
    throw AppError.badRequest("Say whether you accept the change.");
  }
  // A window that has already closed is settled first (rule 4), so a late answer finds nothing.
  await resolveOverdue({ engagementId, now });

  return prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT "id" FROM "Engagement" WHERE "id" = ${engagementId} FOR UPDATE`;
    const eng = await tx.engagement.findUnique({
      where: { id: engagementId },
      include: { gigPosting: { select: { id: true, title: true, startAt: true } } },
    });
    if (!eng) throw AppError.notFound("Engagement not found.");
    if (eng.workerId !== userId) throw AppError.forbidden(); // the worker's answer alone
    if (eng.status !== "ACTIVE") throw AppError.conflict("This engagement is no longer active.");

    const request = await tx.materialChangeRequest.findFirst({
      where: { engagementId, status: "PENDING" },
      orderBy: { proposedAt: "desc" },
    });
    if (!request) throw AppError.conflict("There is no change waiting for your answer.");

    if (accept) {
      if (now.getTime() > new Date(request.deadline).getTime()) {
        throw AppError.conflict("The time to re-confirm this change has passed.");
      }
      const { count } = await tx.materialChangeRequest.updateMany({
        where: { id: request.id, status: "PENDING" },
        data: { status: "ACCEPTED", respondedAt: now },
      });
      if (count === 0) throw AppError.conflict("This change has already been answered.");
      return { accepted: true, engagementStatus: "ACTIVE" };
    }

    // Rule 5: cancelled at once as the employer's change — no record against the worker, rating
    // available but unenforced, the place reopened (engagement.cancellation.js).
    await cancelForMaterialChange(tx, { engagement: eng, request, at: now, declined: true });
    return { accepted: false, engagementStatus: "CANCELLED" };
  });
}

/**
 * Change responses (prototype 5.12): the employer's view of the latest material change on one
 * posting — one row per engaged worker, each answering separately (FR-ENG-11).
 */
async function getChangeResponses({ gigPostingId, userId }) {
  const posting = await prisma.gigPosting.findUnique({
    where: { id: gigPostingId },
    select: { id: true, title: true, employerId: true, payKind: true, payRateUnit: true },
  });
  if (!posting) throw AppError.notFound("Posting not found.");
  if (posting.employerId !== userId) throw AppError.forbidden();

  const requests = await prisma.materialChangeRequest.findMany({
    where: { gigPostingId },
    orderBy: { proposedAt: "desc" },
    include: { engagement: { select: { id: true, worker: { select: { legalName: true } } } } },
  });
  const summary = { id: posting.id, title: posting.title, payKind: posting.payKind, payRateUnit: posting.payRateUnit };
  if (requests.length === 0) return { posting: summary, change: null, responses: [] };

  // The latest change: every request created by the same save shares its proposedAt.
  const latest = new Date(requests[0].proposedAt).getTime();
  const round = requests.filter((r) => new Date(r.proposedAt).getTime() === latest);

  return {
    posting: summary,
    change: { changeSummary: round[0].changeSummary, proposedAt: round[0].proposedAt },
    responses: round.map((r) => ({
      engagementId: r.engagement.id,
      workerName: r.engagement.worker.legalName,
      status: r.status,
      deadline: r.deadline,
      respondedAt: r.respondedAt,
    })),
  };
}

// ---------------------------------------------------------------------------
// FR-ENG-03 — Unable to confirm
// ---------------------------------------------------------------------------

/**
 * Either party reports that the live checkpoint's code could not be exchanged. The checkpoint is
 * marked UNABLE_TO_CONFIRM and the engagement Disputed, so it is never left stuck; the other
 * party is told a case was opened (DISPUTE_OPENED, FR-NOTIF-12 / A11 "A case was opened").
 *
 * DISPUTE STUB (Afham's ruling E4): the DisputeCase row itself belongs to the Disputes module
 * (M9, FR-DISPUTE-03), which is not built — none is created here.
 */
async function unableToConfirm({ engagementId, userId, checkpoint, now = new Date() }) {
  if (!CHECKPOINTS.includes(checkpoint)) throw AppError.badRequest("Unknown checkpoint.");

  return prisma.$transaction(async (tx) => {
    const { eng, party } = await loadForParty(tx, engagementId, userId, {
      gigPosting: { select: POSTING_SUMMARY },
      worker: { select: PARTY_SELECT },
      employer: { select: PARTY_SELECT },
    });
    if (eng.status !== "ACTIVE") throw AppError.conflict("This engagement is no longer active.");
    // Only the checkpoint that is live now: not one already confirmed, nor one not yet reached.
    if (liveCheckpoint(eng, eng.gigPosting, now) !== checkpoint) {
      throw AppError.conflict("This checkpoint can't be reported right now.");
    }

    const { count } = await tx.engagement.updateMany({
      where: { id: engagementId, status: "ACTIVE" },
      data: { [checkpointFields(checkpoint).status]: "UNABLE_TO_CONFIRM", status: "DISPUTED" },
    });
    if (count === 0) throw AppError.conflict("This engagement is no longer active.");

    const otherUserId = party === "WORKER" ? eng.employerId : eng.workerId;
    await notify(tx, otherUserId, "DISPUTE_OPENED", {
      engagementId,
      gigPostingId: eng.gigPostingId,
      title: eng.gigPosting.title,
      checkpoint,
      openedByName: party === "WORKER" ? eng.worker.legalName : employerDisplayName(eng.gigPosting, eng.employer),
    });
    return { engagementStatus: "DISPUTED" };
  });
}

export default {
  listEngagements,
  getEngagementById,
  presentEngagement,
  verifyCheckpointCode,
  endEngagement,
  reconfirmMaterialChange,
  getChangeResponses,
  unableToConfirm,
};
