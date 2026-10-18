/**
 * Engagement Lifecycle — stalled engagements (FR-ENG-13, NFR-REL-01).
 *
 * Epic: FR-ENG
 *
 *   - 24 hours after a one-off Gig's start with the completion checkpoint still unresolved, both
 *     parties get the "Did this happen?" prompt (STALLED_ENGAGEMENT_PROMPT, FR-NOTIF-05; 5.14).
 *   - The prompt offers "Still running" (dismiss: closes it for that party and changes nothing
 *     else) and "Update status" (the app opens the earliest unresolved checkpoint — no server
 *     call). Amended 2026-09-24.
 *   - After a further 7 days of total silence from both sides, the engagement is auto-flagged to
 *     Admin: stalledFlaggedAt is set, the engagement becomes Disputed, and a STALLED_AUTO_FLAG
 *     dispute case opens Under review (FR-DISPUTE-03, database-schema.md DisputeCase).
 *   - Part-time and Internship engagements are never touched: they close through End Engagement
 *     (FR-ENG-12).
 *
 * "Total silence" is decided from what the schema can actually date: the last thing either party
 * did on the engagement after the prompt — a checkpoint confirmed (arrivalConfirmedAt), a
 * cancellation request made or answered, a material change proposed or answered. The 7 days run
 * from the latest of those and the prompt itself. Not counted:
 *   - "Still running" (dismissing the prompt): the amendment says it changes nothing, and if it
 *     restarted the clock, dismissing every week would keep a gig open indefinitely — the very
 *     thing NFR-REL-01 forbids.
 *   - Wrong code entries: the failed-attempt counters carry no time, so one entered before the
 *     prompt cannot be told apart from one after it; and a wrong code moves nothing forward.
 *
 * Run by a timer (runStalledSweep, started from dispute.sweep.js) every few minutes.
 */
import prisma from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";
import { openDisputeCase } from "../dispute/dispute.service.js";
import { partyOf } from "./engagement.rules.js";

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

/** FR-ENG-13: the prompt fires this long after the posting's start. */
export const STALLED_PROMPT_AFTER_MS = 24 * HOUR_MS;
/** FR-ENG-13: then this long of total silence before the auto-flag. */
export const STALLED_FLAG_AFTER_MS = 7 * DAY_MS;

// ---------------------------------------------------------------------------
// Pure rules
// ---------------------------------------------------------------------------

/** FR-ENG-13 applies to one-off Gigs only. */
export function isOneOffGig(posting) {
  return posting?.arrangementType === "GIG";
}

/** The column holding one party's "Still running". */
export function dismissalField(party) {
  return party === "WORKER" ? "stalledDismissedByWorkerAt" : "stalledDismissedByEmployerAt";
}

/**
 * Should the viewer see the "Did this happen?" prompt (5.14) on the engagement right now? Only
 * once it has fired, while the gig is still Active with completion unresolved and not yet
 * flagged, and only until the viewer dismissed it.
 */
export function stalledPromptVisible(engagement, posting, party) {
  if (!party || !engagement.stalledPromptSentAt) return false;
  if (!isOneOffGig(posting)) return false;
  if (engagement.status !== "ACTIVE" || engagement.completionStatus !== "PENDING") return false;
  if (engagement.stalledFlaggedAt) return false;
  return !engagement[dismissalField(party)];
}

/**
 * When either party last did something on the engagement, from the prompt onwards. The prompt
 * itself is the floor: the 7 days never start before it.
 */
export function lastPartyActivity(engagement) {
  const times = [engagement.stalledPromptSentAt, engagement.arrivalConfirmedAt, engagement.completionConfirmedAt];
  for (const r of engagement.cancellationRequests ?? []) times.push(r.requestedAt, r.respondedAt);
  for (const r of engagement.materialChangeRequests ?? []) times.push(r.proposedAt, r.respondedAt);
  const stamps = times.filter(Boolean).map((t) => new Date(t).getTime());
  return stamps.length ? new Date(Math.max(...stamps)) : null;
}

/** Has the engagement been silent long enough to be auto-flagged? */
export function dueForStalledFlag(engagement, posting, now = new Date()) {
  if (!isOneOffGig(posting) || !engagement.stalledPromptSentAt || engagement.stalledFlaggedAt) return false;
  if (engagement.status !== "ACTIVE" || engagement.completionStatus !== "PENDING") return false;
  const last = lastPartyActivity(engagement);
  return now.getTime() - last.getTime() >= STALLED_FLAG_AFTER_MS;
}

// ---------------------------------------------------------------------------
// The sweep
// ---------------------------------------------------------------------------

const FOR_STALLED = {
  gigPosting: { select: { id: true, title: true, startAt: true, arrangementType: true, postedAsType: true, postedBusinessName: true } },
  worker: { select: { legalName: true } },
  employer: { select: { legalName: true, businessName: true } },
  cancellationRequests: { select: { requestedAt: true, respondedAt: true } },
  materialChangeRequests: { select: { proposedAt: true, respondedAt: true } },
};

async function lockEngagement(tx, engagementId) {
  await tx.$queryRaw`SELECT "id" FROM "Engagement" WHERE "id" = ${engagementId} FOR UPDATE`;
}

/** Fire the 24-hour prompt on every engagement that has reached it. @returns how many were prompted */
export async function sendStalledPrompts(now = new Date()) {
  const due = await prisma.engagement.findMany({
    where: {
      status: "ACTIVE",
      completionStatus: "PENDING",
      stalledPromptSentAt: null,
      gigPosting: { arrangementType: "GIG", startAt: { lte: new Date(now.getTime() - STALLED_PROMPT_AFTER_MS) } },
    },
    select: { id: true },
  });

  let prompted = 0;
  for (const { id } of due) {
    const sent = await prisma.$transaction(async (tx) => {
      // Only the request that finds the prompt unsent writes it, so it fires exactly once.
      const { count } = await tx.engagement.updateMany({
        where: { id, status: "ACTIVE", completionStatus: "PENDING", stalledPromptSentAt: null },
        data: { stalledPromptSentAt: now },
      });
      if (count === 0) return false;
      const eng = await tx.engagement.findUnique({ where: { id }, include: FOR_STALLED });
      const posting = eng.gigPosting;
      // FR-NOTIF-05 / A11: "Did this happen?" · gig title · start date → the stalled prompt.
      const payload = {
        engagementId: id,
        gigPostingId: eng.gigPostingId,
        postingTitle: posting.title,
        title: posting.title,
        startAt: posting.startAt,
      };
      await tx.notification.createMany({
        data: [eng.workerId, eng.employerId].map((userId) => ({ userId, type: "STALLED_ENGAGEMENT_PROMPT", payload })),
      });
      return true;
    });
    if (sent) prompted += 1;
  }
  return prompted;
}

/** Auto-flag every prompted engagement that has stayed silent for 7 days. @returns how many were flagged */
export async function flagStalledEngagements(now = new Date()) {
  const candidates = await prisma.engagement.findMany({
    where: {
      status: "ACTIVE",
      completionStatus: "PENDING",
      stalledFlaggedAt: null,
      stalledPromptSentAt: { lte: new Date(now.getTime() - STALLED_FLAG_AFTER_MS) },
      gigPosting: { arrangementType: "GIG" },
    },
    select: { id: true },
  });

  let flagged = 0;
  for (const { id } of candidates) {
    const done = await prisma.$transaction(async (tx) => {
      // Locked, then decided from a fresh read: a code entered a moment ago must win.
      await lockEngagement(tx, id);
      const eng = await tx.engagement.findUnique({ where: { id }, include: FOR_STALLED });
      if (!eng || !dueForStalledFlag(eng, eng.gigPosting, now)) return false;

      const { count } = await tx.engagement.updateMany({
        where: { id, status: "ACTIVE", stalledFlaggedAt: null },
        data: { stalledFlaggedAt: now, status: "DISPUTED" },
      });
      if (count === 0) return false;
      await openDisputeCase(tx, { engagement: eng, triggerType: "STALLED_AUTO_FLAG", now });
      return true;
    });
    if (done) flagged += 1;
  }
  return flagged;
}

/** Both steps, prompt first. Each engagement runs in its own transaction. */
export async function runStalledSweep(now = new Date()) {
  const prompted = await sendStalledPrompts(now);
  const flagged = await flagStalledEngagements(now);
  return { prompted, flagged };
}

// ---------------------------------------------------------------------------
// "Still running"
// ---------------------------------------------------------------------------

/**
 * A party dismisses the prompt (FR-ENG-13 as amended: "the Engagement is unchanged"). Only that
 * party's dismissal time is written; status, checkpoints and the 7-day clock are untouched.
 * Dismissing twice is harmless.
 */
export async function dismissStalledPrompt({ engagementId, userId, now = new Date() }) {
  const eng = await prisma.engagement.findUnique({
    where: { id: engagementId },
    include: { gigPosting: { select: { arrangementType: true } } },
  });
  if (!eng) throw AppError.notFound("Engagement not found.");
  const party = partyOf(eng, userId);
  if (!party) throw AppError.forbidden();
  if (!eng.stalledPromptSentAt || eng.status !== "ACTIVE" || !isOneOffGig(eng.gigPosting)) {
    throw AppError.conflict("There is no prompt to dismiss.");
  }
  const field = dismissalField(party);
  await prisma.engagement.updateMany({ where: { id: engagementId, [field]: null }, data: { [field]: now } });
  return { stalledPrompt: { show: false } };
}

