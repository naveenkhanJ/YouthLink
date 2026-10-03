// posting.urgency.js
// FR-POST-07: urgency is always derived from startAt, never accepted as
// client input. A posting is "urgent" when its start is 48 hours or less
// away, with NO lower bound (amended 2026-08-27).
//
// The earlier reading was a 24-48h band, which made a gig starting in 3 hours
// not urgent while one starting in 40 hours was — so the shortest-notice gigs
// got the least reach from FR-NOTIF-01's urgent push. That was backwards.
//
// Boundary rule: inclusive at 48h, i.e. urgent when (startAt - now) <= 48h.

const HOUR_MS = 60 * 60 * 1000;

export const URGENCY_MAX_MS = 48 * HOUR_MS;

/**
 * @param {Date|string} startAt - the posting's scheduled start time
 * @param {number} [now] - epoch ms, defaults to Date.now(); pass explicitly in tests
 * @returns {boolean}
 */
export function computeIsUrgent(startAt, now = Date.now()) {
  // new Date(null) is the epoch, which with no lower bound would read as
  // "urgent" — a missing start time must fail safe instead.
  if (startAt == null || startAt === '') return false;
  const startMs = new Date(startAt).getTime();
  if (Number.isNaN(startMs)) return false;

  return startMs - now <= URGENCY_MAX_MS;
}
