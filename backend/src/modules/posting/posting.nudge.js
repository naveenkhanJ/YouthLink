// posting.nudge.js
// FR-POST-17 — the no-applicant nudge. Added 2026-10-18 (full build on integration/viva-demo).
//
// An Employer whose posting still has zero applicants is told once, suggesting they review the pay
// or details (NO_APPLICANT_NUDGE, A11 "No applicants yet on {title}", drawn on 3.10eg):
//
//   regular posting   at 24 hours live
//   urgent posting    at the halfway point between posting and its start
//
// "Urgent" here is FR-POST-07's rule applied at the moment it was posted: a gig posted 30 hours
// before its start is urgent, so its nudge comes at 15 hours, while a regular one would never get a
// nudge before it started. A posting that is no longer live (filled, withdrawn, expired, hidden
// pending review) is never nudged, and `noApplicantNudgeSentAt` makes it once only.
// "Zero applicants" counts every application ever made, withdrawn ones included: someone did apply,
// so the posting's details evidently were not the problem.

import prisma from '../../lib/prisma.js';
import { computeIsUrgent } from './posting.urgency.js';

export const NUDGE_SWEEP_INTERVAL_MS = 5 * 60 * 1000;
export const REGULAR_NUDGE_AFTER_MS = 24 * 60 * 60 * 1000;

/**
 * When a posting's nudge is due.
 * @param {{ createdAt: Date|string, startAt: Date|string }} posting
 * @returns {Date}
 */
export function nudgeDueAt(posting) {
  const created = new Date(posting.createdAt).getTime();
  const start = new Date(posting.startAt).getTime();
  if (computeIsUrgent(posting.startAt, created)) {
    return new Date(created + Math.max(0, start - created) / 2);
  }
  return new Date(created + REGULAR_NUDGE_AFTER_MS);
}

/**
 * Sends every nudge that is due. The claim (updateMany with the null guard) and the notification
 * are one transaction, so a nudge is never sent twice and never claimed without being sent.
 * @param {Date} [now]
 * @returns {Promise<string[]>} ids of the postings nudged
 */
export async function sendDueNudges(now = new Date()) {
  const candidates = await prisma.gigPosting.findMany({
    where: {
      status: 'OPEN',
      autoHiddenAt: null,
      noApplicantNudgeSentAt: null,
      startAt: { gt: now },
      OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
      applications: { none: {} },
    },
    select: { id: true, title: true, employerId: true, createdAt: true, startAt: true },
  });

  const nudged = [];
  for (const posting of candidates) {
    if (nudgeDueAt(posting) > now) continue;
    const sent = await prisma.$transaction(async (tx) => {
      const claim = await tx.gigPosting.updateMany({
        where: { id: posting.id, noApplicantNudgeSentAt: null, applications: { none: {} } },
        data: { noApplicantNudgeSentAt: now },
      });
      if (claim.count === 0) return false;
      await tx.notification.create({
        data: {
          userId: posting.employerId,
          type: 'NO_APPLICANT_NUDGE',
          payload: { gigPostingId: posting.id, postingTitle: posting.title },
        },
      });
      return true;
    });
    if (sent) nudged.push(posting.id);
  }
  return nudged;
}

/** Runs sendDueNudges on a timer; unref()'d like the expiry sweep. */
export function startNoApplicantNudgeSweep(intervalMs = NUDGE_SWEEP_INTERVAL_MS) {
  const timer = setInterval(() => {
    sendDueNudges().catch((error) => console.error('No-applicant nudge sweep failed:', error));
  }, intervalMs);
  timer.unref();
  return timer;
}
