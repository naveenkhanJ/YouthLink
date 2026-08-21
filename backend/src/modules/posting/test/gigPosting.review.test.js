// gigPosting.review.test.js
// Unit tests for FR-POST-09 (Review screen computed preview logic) & FR-POST-07 (Urgency preview).

import {
  computeIsUrgent,
  URGENCY_WINDOW_MIN_MS,
  URGENCY_WINDOW_MAX_MS,
} from '../posting.urgency.js';

import {
  sanitizePostingLocation,
} from '../posting.location.js';

describe('FR-POST-09: Review Screen Computed Previews & Helpers', () => {
  const MOCK_NOW = new Date('2026-08-19T12:00:00.000Z').getTime();
  const ONE_HOUR = 60 * 60 * 1000;

  describe('Urgency Computation for Review Screen (FR-POST-07 / FR-POST-09)', () => {
    test('marks as urgent when start time is in the middle of 24h–48h window (e.g. +30 hours)', () => {
      const startAt = new Date(MOCK_NOW + 30 * ONE_HOUR).toISOString();
      expect(computeIsUrgent(startAt, MOCK_NOW)).toBe(true);
    });

    test('marks as urgent exactly at the 24h lower boundary', () => {
      const startAt = new Date(MOCK_NOW + URGENCY_WINDOW_MIN_MS).toISOString();
      expect(computeIsUrgent(startAt, MOCK_NOW)).toBe(true);
    });

    test('marks as urgent exactly at the 48h upper boundary', () => {
      const startAt = new Date(MOCK_NOW + URGENCY_WINDOW_MAX_MS).toISOString();
      expect(computeIsUrgent(startAt, MOCK_NOW)).toBe(true);
    });

    test('marks as NOT urgent when starting in less than 24 hours (e.g. +5 hours)', () => {
      const startAt = new Date(MOCK_NOW + 5 * ONE_HOUR).toISOString();
      expect(computeIsUrgent(startAt, MOCK_NOW)).toBe(false);
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
      expect(publicPreview.locationLat).toBe(6.8912);
      expect(publicPreview.locationLng).toBe(79.8567);
    });
  });
});
