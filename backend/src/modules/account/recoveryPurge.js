/**
 * FR-ACC-10 (amended 2026-09-16, batch E8) — retention of account-recovery identity details.
 *
 * Epic: FR-ACC  ·  Added 2026-10-18 (full build on integration/viva-demo)
 *
 * "Requests that are rejected or completed shall be purged of those details after 90 days, which
 * bounds how long identity data about a person who may hold no account is retained at all."
 *
 * The row itself is kept — its status and review time are the record that an Admin acted
 * (NFR-SEC-06) — but the three submitted identity fields are overwritten with neutral placeholders
 * (the columns are NOT NULL). A request still awaiting review, or approved but not yet used, keeps
 * its details: the Admin adjudicates the claim itself, and the requester may still return.
 */
import prisma from "../../lib/prisma.js";

export const RETENTION_DAYS = 90;
export const PURGE_SWEEP_INTERVAL_MS = 6 * 60 * 60 * 1000; // four times a day is plenty for a 90-day rule
const DAY_MS = 24 * 60 * 60 * 1000;

// What a purged row holds instead. Recognisable, so a purged row is never mistaken for a submission.
export const PURGED = {
  nicSubmittedEncrypted: "purged",
  legalNameSubmitted: "",
  birthdateSubmitted: new Date("1900-01-01"),
};

/**
 * Purges every rejected request reviewed, and every completed request finished, at least 90 days ago.
 * @param {Date} [now]
 * @returns {Promise<number>} how many requests were purged
 */
export async function purgeOldRecoveryRequests(now = new Date()) {
  const cutoff = new Date(now.getTime() - RETENTION_DAYS * DAY_MS);
  const { count } = await prisma.accountRecoveryRequest.updateMany({
    where: {
      nicSubmittedEncrypted: { not: PURGED.nicSubmittedEncrypted },
      OR: [
        { status: "REJECTED", reviewedAt: { lte: cutoff } },
        { completedAt: { lte: cutoff } },
      ],
    },
    data: PURGED,
  });
  return count;
}

/** Runs the purge on a timer; unref()'d so it never keeps the process alive. */
export function startRecoveryPurgeSweep(intervalMs = PURGE_SWEEP_INTERVAL_MS) {
  const run = () =>
    purgeOldRecoveryRequests().catch((error) => console.error("Recovery-request purge failed:", error));
  run();
  const timer = setInterval(run, intervalMs);
  timer.unref();
  return timer;
}
