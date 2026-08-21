// gigPosting.location.test.js
// Tests for FR-POST-08 (Location precision display) & FR-APPLY-07 (Precise address release on selection).

import {
  canAccessPreciseLocation,
  sanitizePostingLocation,
  sanitizePostingList,
} from '../posting.location.js';

describe('FR-POST-08: Location precision and release logic', () => {
  const samplePosting = {
    id: 'post-123',
    employerId: 'emp-999',
    title: 'Weekend Retail Assistant',
    description: 'Help with shop inventory',
    locationAddress: 'No. 45, Duplication Road, Colombo 03',
    locationAreaLabel: 'Kollupitiya, Colombo 03',
    locationLat: 6.9012,
    locationLng: 79.8541,
    engagements: [
      {
        workerId: 'worker-selected-1',
        status: 'ACTIVE',
      },
      {
        workerId: 'worker-cancelled-2',
        status: 'CANCELLED',
      },
    ],
  };

  describe('canAccessPreciseLocation', () => {
    test('returns false for unauthenticated / anonymous viewer (null viewerUserId)', () => {
      expect(canAccessPreciseLocation(samplePosting, null)).toBe(false);
      expect(canAccessPreciseLocation(samplePosting, undefined)).toBe(false);
    });

    test('returns false for browsing worker who is not selected', () => {
      expect(canAccessPreciseLocation(samplePosting, 'worker-random-user')).toBe(false);
    });

    test('returns false for worker whose engagement is CANCELLED', () => {
      expect(canAccessPreciseLocation(samplePosting, 'worker-cancelled-2')).toBe(false);
    });

    test('returns true for the posting Employer (owner)', () => {
      expect(canAccessPreciseLocation(samplePosting, 'emp-999')).toBe(true);
    });

    test('returns false for another employer viewing the posting', () => {
      expect(canAccessPreciseLocation(samplePosting, 'other-employer-888')).toBe(false);
    });

    test('returns true for the specifically selected worker with an ACTIVE engagement', () => {
      expect(canAccessPreciseLocation(samplePosting, 'worker-selected-1')).toBe(true);
    });

    test('handles missing or empty engagements safely', () => {
      const postingNoEngagements = {
        id: 'post-456',
        employerId: 'emp-999',
        locationAddress: '123 Main St',
        locationAreaLabel: 'Colombo 01',
      };
      expect(canAccessPreciseLocation(postingNoEngagements, 'worker-1')).toBe(false);
      expect(canAccessPreciseLocation(postingNoEngagements, 'emp-999')).toBe(true);
    });

    test('returns false for null / undefined posting', () => {
      expect(canAccessPreciseLocation(null, 'worker-1')).toBe(false);
    });
  });

  describe('sanitizePostingLocation', () => {
    test('redacts precise address and sets isPreciseLocationReleased=false for public/unselected viewers', () => {
      const sanitized = sanitizePostingLocation(samplePosting, 'worker-random');

      expect(sanitized).toBeDefined();
      expect(sanitized.locationAddress).toBeNull();
      expect(sanitized.isPreciseLocationReleased).toBe(false);
      // Coarse suburb-level label and coordinates remain intact for map rendering
      expect(sanitized.locationAreaLabel).toBe('Kollupitiya, Colombo 03');
      expect(sanitized.locationLat).toBe(6.9012);
      expect(sanitized.locationLng).toBe(79.8541);
      // Ensure other fields are preserved
      expect(sanitized.title).toBe('Weekend Retail Assistant');
    });

    test('reveals precise address and sets isPreciseLocationReleased=true for the selected worker', () => {
      const sanitized = sanitizePostingLocation(samplePosting, 'worker-selected-1');

      expect(sanitized).toBeDefined();
      expect(sanitized.locationAddress).toBe('No. 45, Duplication Road, Colombo 03');
      expect(sanitized.isPreciseLocationReleased).toBe(true);
      expect(sanitized.locationAreaLabel).toBe('Kollupitiya, Colombo 03');
    });

    test('reveals precise address and sets isPreciseLocationReleased=true for the employer', () => {
      const sanitized = sanitizePostingLocation(samplePosting, 'emp-999');

      expect(sanitized).toBeDefined();
      expect(sanitized.locationAddress).toBe('No. 45, Duplication Road, Colombo 03');
      expect(sanitized.isPreciseLocationReleased).toBe(true);
    });

    test('returns null if posting is null', () => {
      expect(sanitizePostingLocation(null, 'worker-1')).toBeNull();
    });
  });

  describe('sanitizePostingList', () => {
    test('sanitizes a list of postings according to viewer permissions', () => {
      const postings = [
        samplePosting,
        {
          id: 'post-second',
          employerId: 'worker-selected-1', // worker is employer here
          title: 'Second Gig',
          locationAddress: '789 High Level Rd, Nugegoda',
          locationAreaLabel: 'Nugegoda',
          locationLat: 6.87,
          locationLng: 79.89,
          engagements: [],
        },
      ];

      const sanitizedList = sanitizePostingList(postings, 'worker-selected-1');

      expect(sanitizedList).toHaveLength(2);
      // In first posting, user is selected worker -> precise released
      expect(sanitizedList[0].locationAddress).toBe('No. 45, Duplication Road, Colombo 03');
      expect(sanitizedList[0].isPreciseLocationReleased).toBe(true);

      // In second posting, user is employer -> precise released
      expect(sanitizedList[1].locationAddress).toBe('789 High Level Rd, Nugegoda');
      expect(sanitizedList[1].isPreciseLocationReleased).toBe(true);
    });

    test('returns empty array when input is not an array', () => {
      expect(sanitizePostingList(null)).toEqual([]);
    });
  });
});
