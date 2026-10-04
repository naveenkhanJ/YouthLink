// gigPosting.review.test.js
// Unit tests for FR-POST-09 (Review screen computed preview logic) & FR-POST-07 (Urgency preview).

import { computeIsUrgent, URGENCY_MAX_MS } from '../posting.urgency.js';

import {
  sanitizePostingLocation,
} from '../posting.location.js';

describe('FR-POST-09: Review Screen Computed Previews & Helpers', () => {
  const MOCK_NOW = new Date('2026-08-19T12:00:00.000Z').getTime();
  const ONE_HOUR = 60 * 60 * 1000;

  describe('Urgency Computation for Review Screen (FR-POST-07 / FR-POST-09)', () => {
    test('marks as urgent at +30 hours', () => {
      const startAt = new Date(MOCK_NOW + 30 * ONE_HOUR).toISOString();
      expect(computeIsUrgent(startAt, MOCK_NOW)).toBe(true);
    });

    test('marks as urgent exactly at the 48h boundary', () => {
      const startAt = new Date(MOCK_NOW + URGENCY_MAX_MS).toISOString();
      expect(computeIsUrgent(startAt, MOCK_NOW)).toBe(true);
    });

    test('marks as urgent when starting soon (+5 hours) — no lower bound', () => {
      const startAt = new Date(MOCK_NOW + 5 * ONE_HOUR).toISOString();
      expect(computeIsUrgent(startAt, MOCK_NOW)).toBe(true);
    });

    test('marks as NOT urgent when starting in 3 days (e.g. +72 hours)', () => {
      const startAt = new Date(MOCK_NOW + 72 * ONE_HOUR).toISOString();
      expect(computeIsUrgent(startAt, MOCK_NOW)).toBe(false);
    });

    test('fails safe (returns false) for invalid date strings', () => {
      expect(computeIsUrgent('not-a-valid-date', MOCK_NOW)).toBe(false);
      expect(computeIsUrgent(null, MOCK_NOW)).toBe(false);
      expect(computeIsUrgent(undefined, MOCK_NOW)).toBe(false);
    });
  });

  describe('Non-editable Public Location Preview on Review Screen (FR-POST-09)', () => {
    test('renders coarse area preview with exact address hidden for public browser perspective', () => {
      const formData = {
        title: 'Event Helper',
        locationAddress: 'No. 128, Galle Road, Bambalapitiya, Colombo 04',
        locationAreaLabel: 'Bambalapitiya, Colombo 04',
        locationLat: 6.8912,
        locationLng: 79.8567,
      };

      // Review screen displays what public browsers will see before selection
      const publicPreview = sanitizePostingLocation(formData, null);

      expect(publicPreview.locationAddress).toBeNull();
      expect(publicPreview.isPreciseLocationReleased).toBe(false);
      expect(publicPreview.locationAreaLabel).toBe('Bambalapitiya, Colombo 04');
      // Browsing workers get coordinates rounded to 2 decimals, about 1 km (FR-POST-08).
      expect(publicPreview.locationLat).toBe(6.89);
      expect(publicPreview.locationLng).toBe(79.86);
    });
  });
});
