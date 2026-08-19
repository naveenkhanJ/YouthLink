// gigPosting.urgency.js
// FR-POST-07: urgency is always derived from startAt, never accepted as
// client input. A posting is "urgent" when it starts within a 24-48 hour
// window from now — soon enough to need attention, far enough out that the
// 2-hour minimum lead time (FR-POST-05) postings aren't automatically urgent.
//
// Boundary rule: inclusive at 24h, inclusive at 48h.
// i.e. urgent when  24h <= (startAt - now) <= 48h
// Adjust here if product wants a different edge treatment.

// gigPosting.urgency.js
// FR-POST-07: urgency is always derived from startAt, never accepted as
// client input. A posting is "urgent" when it starts within a 24-48 hour
// window from now — soon enough to need attention, far enough out that the
// 2-hour minimum lead time (FR-POST-05) postings aren't automatically urgent.
//
// Boundary rule: inclusive at 24h, inclusive at 48h.
// i.e. urgent when  24h <= (startAt - now) <= 48h
// Adjust here if product wants a different edge treatment.

const HOUR_MS = 60 * 60 * 1000;

export const URGENCY_WINDOW_MIN_MS = 24 * HOUR_MS;
export const URGENCY_WINDOW_MAX_MS = 48 * HOUR_MS;

/**
 * @param {Date|string} startAt - the posting's scheduled start time
 * @param {number} [now] - epoch ms, defaults to Date.now(); pass explicitly in tests
 * @returns {boolean}
 */
export function computeIsUrgent(startAt, now = Date.now()) {
  const startMs = new Date(startAt).getTime();
  if (Number.isNaN(startMs)) return false;

  const msUntilStart = startMs - now;
  return msUntilStart >= URGENCY_WINDOW_MIN_MS && msUntilStart <= URGENCY_WINDOW_MAX_MS;
}