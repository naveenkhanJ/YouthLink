// gigPosting.urgency.test.js
// Run with: npx jest gigPosting.urgency.test.js
import { computeIsUrgent, URGENCY_WINDOW_MIN_MS, URGENCY_WINDOW_MAX_MS } from '../posting.urgency.js';

const H = 60 * 60 * 1000;
const NOW = Date.now();

describe('computeIsUrgent', () => {
  test('not urgent when far in the future', () => {
    expect(computeIsUrgent(NOW + 5 * 24 * H, NOW)).toBe(false);
  });

  test('not urgent when starting soon (under 24h)', () => {
    expect(computeIsUrgent(NOW + 3 * H, NOW)).toBe(false);
  });

  test('not urgent just under the 24h boundary', () => {
    expect(computeIsUrgent(NOW + 23 * H + 59 * 60 * 1000, NOW)).toBe(false);
  });

  test('urgent exactly at the 24h boundary', () => {
    expect(computeIsUrgent(NOW + URGENCY_WINDOW_MIN_MS, NOW)).toBe(true);
  });

  test('urgent in the middle of the window', () => {
    expect(computeIsUrgent(NOW + 36 * H, NOW)).toBe(true);
  });

  test('urgent exactly at the 48h boundary', () => {
    expect(computeIsUrgent(NOW + URGENCY_WINDOW_MAX_MS, NOW)).toBe(true);
  });

  test('not urgent just over the 48h boundary', () => {
    expect(computeIsUrgent(NOW + 48 * H + 60 * 1000, NOW)).toBe(false);
  });

  test('fails safe (false) on an invalid date', () => {
    expect(computeIsUrgent('not-a-date', NOW)).toBe(false);
  });
});