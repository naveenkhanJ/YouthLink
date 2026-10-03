// posting.expiry.js
// FR-POST-13 — an Open posting expires on its own, whether or not it is partly filled.
//
//   Gig                       expires when its start date/time passes.
//   Part-time job/Internship  expires 30 days after it was posted.
//
// CONTRACT FOR OTHER MODULES: treat a posting as live only when
//   status === 'OPEN' and (expiresAt is null or expiresAt > now).
// A posting can be past its expiry for a few minutes before the sweep or a read
// flips its status, so checking `status` alone is not enough.
//
// Expiry closes only the unfilled slots. It never touches `filledCount`,
// Engagements or Applications directly: Engagements already created carry on, and
// the Pending applicants are resolved through the Applying & Selection seam
// (FR-APPLY-09). A FILLED posting has no open slots, so it is never expired.

import prisma from '../../lib/prisma.js';
import { resolvePendingApplicants } from './posting.applicants.js';

export const SWEEP_INTERVAL_MS = 5 * 60 * 1000;

/**
 * Flip every due Open posting to Expired. Prisma's query API can't add 30 days to a
 * column, so this is one raw statement (the same technique syncPostingStatus uses). It
 * also covers older rows whose `expiresAt` was never set, and fills the column in.
 *
 * @param {Date} [now]
 * @returns {Promise<string[]>} ids of the postings that were expired
 */
export async function expireDuePostings(now = new Date()) {
  const rows = await prisma.$queryRaw`
    UPDATE "GigPosting"
    SET "status" = 'EXPIRED'::"GigStatus",
        "expiresAt" = COALESCE("expiresAt", CASE WHEN "arrangementType" = 'GIG' THEN "startAt" ELSE "createdAt" + interval '30 days' END),
        "updatedAt" = now()
    WHERE "status" = 'OPEN'
      AND COALESCE("expiresAt", CASE WHEN "arrangementType" = 'GIG' THEN "startAt" ELSE "createdAt" + interval '30 days' END) <= ${now}
    RETURNING "id"`;
  const ids = (rows ?? []).map((row) => row.id);
  for (const id of ids) await resolvePendingApplicants(id, 'EXPIRED');
  return ids;
}

/**
 * Run expireDuePostings on a timer so postings close even when nobody opens them.
 * The timer is unref()'d: it never keeps the process alive on its own.
 */
export function startPostingExpirySweep(intervalMs = SWEEP_INTERVAL_MS) {
  const timer = setInterval(() => {
    expireDuePostings().catch((error) => console.error('Posting expiry sweep failed:', error));
  }, intervalMs);
  timer.unref();
  return timer;
}
