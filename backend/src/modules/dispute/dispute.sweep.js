/**
 * Reports & Disputes — the timers.
 *
 * Epic: FR-DISPUTE (user side), with FR-ENG-13's stalled-engagement sweep
 *
 * Two things happen on a clock rather than on a request:
 *   - FR-DISPUTE-04: a respondent's 48-hour window closes with no response → the case moves to
 *     Under review ("review proceeds on whatever evidence is available"). Reads of a case already
 *     settle it lazily (dispute.service.js); this covers cases nobody opens.
 *   - FR-ENG-13 / NFR-REL-01: the 24-hour "Did this happen?" prompt and the 7-day auto-flag
 *     (engagement.stalled.js), which ends in a STALLED_AUTO_FLAG dispute case.
 *
 * Same pattern as startEngagementDeadlineSweep: setInterval, unref()'d so it never keeps the
 * process alive on its own, started once from backend/index.js.
 */
import { settleLapsedResponseWindows } from "./dispute.service.js";
import { runStalledSweep } from "../engagement/engagement.stalled.js";

export const DISPUTE_SWEEP_INTERVAL_MS = 5 * 60 * 1000;

/** One pass of both sweeps. Exported for the tests and for a manual run during a demo. */
export async function runDisputeSweeps(now = new Date()) {
  const lapsed = await settleLapsedResponseWindows({ now });
  const stalled = await runStalledSweep(now);
  return { lapsed, ...stalled };
}

export function startDisputeSweeps(intervalMs = DISPUTE_SWEEP_INTERVAL_MS) {
  const timer = setInterval(() => {
    runDisputeSweeps().catch((error) => console.error("Dispute sweep failed:", error));
  }, intervalMs);
  timer.unref();
  return timer;
}
