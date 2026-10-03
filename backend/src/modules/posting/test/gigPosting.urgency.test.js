// gigPosting.urgency.test.js
// Run with: npx jest gigPosting.urgency.test.js
// FR-POST-07 (amended 2026-08-27): urgent means the start is 48 hours or less
// away, with NO lower bound. Earlier versions asserted a 24-48h band; that
// reading is withdrawn.
import { computeIsUrgent, URGENCY_MAX_MS } from '../posting.urgency.js';

const H = 60 * 60 * 1000;
const NOW = Date.now();

describe('computeIsUrgent', () => {
  test('not urgent when far in the future (5 days)', () => {
    expect(computeIsUrgent(NOW + 5 * 24 * H, NOW)).toBe(false);
  });

  test('urgent when starting soon (3 hours) — no lower bound', () => {
    expect(computeIsUrgent(NOW + 3 * H, NOW)).toBe(true);
  });

  test('urgent at 30 hours (acceptance criterion 1)', () => {
    expect(computeIsUrgent(NOW + 30 * H, NOW)).toBe(true);
  });

  test('urgent just under the old 24h edge', () => {
    expect(computeIsUrgent(NOW + 23 * H + 59 * 60 * 1000, NOW)).toBe(true);
  });

  test('urgent exactly at the 48h boundary', () => {
    expect(computeIsUrgent(NOW + URGENCY_MAX_MS, NOW)).toBe(true);
  });

  test('not urgent just over the 48h boundary', () => {
    expect(computeIsUrgent(NOW + 48 * H + 60 * 1000, NOW)).toBe(false);
  });

  test('fails safe (false) on an invalid date', () => {
    expect(computeIsUrgent('not-a-date', NOW)).toBe(false);
  });
});
