// gigPosting.validators.test.js
// Tests for FR-POST-01, FR-POST-02, FR-POST-04, FR-POST-05, FR-POST-06, FR-POST-08 backend validators.

import { validationResult } from 'express-validator';
import { createGigPostingValidators, MIN_LEAD_TIME_MS, AREA_NOT_LISTED_MESSAGE } from '../posting.validators.js';

async function validate(body) {
  const req = { body };
  for (const middleware of createGigPostingValidators) {
    await middleware.run(req);
  }
  return validationResult(req);
}

describe('Posting Validators (FR-POST-01, 02, 04, 05, 06)', () => {
  const validPosting = {
    title: 'Retail Helper for Weekend Sale',
    description: 'Looking for a reliable assistant to help organize shelves and assist customers.',
    category: 'RETAIL',
    arrangementType: 'GIG',
    payKind: 'FIXED_TOTAL',
    payAmount: 3500,
    postedAsType: 'INDIVIDUAL',
    locationAddress: 'No. 120, Galle Road, Colombo 03',
    // FR-POST-08: the area chosen from the server's list; the label and point come from it.
    locationArea: 'Colombo 03',
    workersNeeded: 2,
    startAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };

  test('valid standard GIG posting passes all validations', async () => {
    const result = await validate(validPosting);
    expect(result.isEmpty()).toBe(true);
  });

  describe('FR-POST-01: Field sequencing & caps', () => {
    test('fails when title exceeds 80 characters', async () => {
      const invalid = { ...validPosting, title: 'A'.repeat(81) };
      const result = await validate(invalid);
      expect(result.isEmpty()).toBe(false);
      expect(result.mapped().title).toBeDefined();
    });

    test('fails when description exceeds 1000 characters', async () => {
      const invalid = { ...validPosting, description: 'A'.repeat(1001) };
      const result = await validate(invalid);
      expect(result.isEmpty()).toBe(false);
      expect(result.mapped().description).toBeDefined();
    });

    test('fails when title or description is missing', async () => {
      const invalid = { ...validPosting, title: '', description: '' };
      const result = await validate(invalid);
      expect(result.mapped().title).toBeDefined();
      expect(result.mapped().description).toBeDefined();
    });
  });

  describe('FR-POST-02: Task category allow-list', () => {
    test('passes for allow-listed categories', async () => {
      const categories = ['RETAIL', 'DELIVERY', 'EVENT_SETUP', 'MOVING', 'FOOD_SERVICE', 'TUTORING', 'CLEANING'];
      for (const category of categories) {
        const result = await validate({ ...validPosting, category });
        expect(result.mapped().category).toBeUndefined();
      }
    });

    test('fails for categories outside allow-list (e.g. CHILDCARE, OTHER)', async () => {
      const invalid1 = await validate({ ...validPosting, category: 'CHILDCARE' });
      expect(invalid1.mapped().category).toBeDefined();

      const invalid2 = await validate({ ...validPosting, category: 'SOFTWARE_DEV' });
      expect(invalid2.mapped().category).toBeDefined();
    });
  });

  describe('FR-POST-04: pay kind must match the arrangement (YL-169)', () => {
    test('a Gig accepts a fixed total and needs no rate unit', async () => {
      const result = await validate({ ...validPosting, payRateUnit: undefined });
      expect(result.isEmpty()).toBe(true);
    });

    test('a Gig rejects a rate, stipend, paid or unpaid pay kind', async () => {
      for (const payKind of ['RATE', 'STIPEND', 'PAID', 'UNPAID']) {
        const result = await validate({ ...validPosting, payKind, payRateUnit: 'DAY' });
        expect(result.mapped().payKind).toBeDefined();
      }
    });

    test('a Part-time job rejects a fixed total', async () => {
      const result = await validate({
        ...validPosting,
        arrangementType: 'PART_TIME',
        payKind: 'FIXED_TOTAL',
        schedule: 'Mon, Wed, Fri',
      });
      expect(result.mapped().payKind).toBeDefined();
    });

    test('an Internship accepts Unpaid, Stipend and Paid', async () => {
      for (const payKind of ['UNPAID', 'STIPEND', 'PAID']) {
        const result = await validate({
          ...validPosting,
          arrangementType: 'INTERNSHIP',
          payKind,
          payAmount: payKind === 'UNPAID' ? undefined : 15000,
          schedule: 'Weekdays, 9 to 1',
        });
        expect(result.mapped().payKind).toBeUndefined();
        expect(result.mapped().payAmount).toBeUndefined();
      }
    });

    test('a Stipend or Paid internship still needs an amount', async () => {
      const result = await validate({
        ...validPosting,
        arrangementType: 'INTERNSHIP',
        payKind: 'STIPEND',
        payAmount: undefined,
        schedule: 'Weekdays, 9 to 1',
      });
      expect(result.mapped().payAmount).toBeDefined();
    });
  });

  describe('FR-POST-04: Pay format by arrangement type', () => {
    test('validates RATE requires payRateUnit (DAY/WEEK/MONTH)', async () => {
      const validPartTime = {
        ...validPosting,
        arrangementType: 'PART_TIME',
        payKind: 'RATE',
        payAmount: 1500,
        payRateUnit: 'DAY',
        schedule: 'Mon-Wed 9am-1pm',
      };
      const result = await validate(validPartTime);
      expect(result.isEmpty()).toBe(true);

      const invalidPartTime = {
        ...validPartTime,
        payRateUnit: undefined,
      };
      const badResult = await validate(invalidPartTime);
      expect(badResult.mapped().payRateUnit).toBeDefined();
    });

    test('UNPAID internship does not require payAmount', async () => {
      const validUnpaidInternship = {
        ...validPosting,
        arrangementType: 'INTERNSHIP',
        payKind: 'UNPAID',
        schedule: 'Full-time 1 month',
      };
      const result = await validate(validUnpaidInternship);
      expect(result.mapped().payAmount).toBeUndefined();
      expect(result.mapped().payRateUnit).toBeUndefined();
      expect(result.isEmpty()).toBe(true);
    });
  });

  describe('FR-POST-05: Minimum lead time (>= 2 hours)', () => {
    test('fails when startAt is less than 2 hours in the future', async () => {
      const tooSoon = {
        ...validPosting,
        startAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 mins
      };
      const result = await validate(tooSoon);
      expect(result.mapped().startAt).toBeDefined();
      expect(result.mapped().startAt.msg).toContain('2 hours');
    });

    test('passes when startAt is >= 2 hours', async () => {
      const validTime = {
        ...validPosting,
        startAt: new Date(Date.now() + MIN_LEAD_TIME_MS + 60 * 1000).toISOString(),
      };
      const result = await validate(validTime);
      expect(result.mapped().startAt).toBeUndefined();
    });
  });

  describe('FR-POST-06: Workers needed field (1-20)', () => {
    test('passes with workersNeeded in range 1-20', async () => {
      for (const count of [1, 5, 20]) {
        const result = await validate({ ...validPosting, workersNeeded: count });
        expect(result.mapped().workersNeeded).toBeUndefined();
      }
    });

    test('fails when workersNeeded is 0 or > 20', async () => {
      const zeroResult = await validate({ ...validPosting, workersNeeded: 0 });
      expect(zeroResult.mapped().workersNeeded).toBeDefined();

      const tooManyResult = await validate({ ...validPosting, workersNeeded: 21 });
      expect(tooManyResult.mapped().workersNeeded).toBeDefined();
    });
  });
  describe('FR-POST-08: the area must be one from the list (round 4, L-1)', () => {
    test('an area that is not on the list is a field error with the drawn message', async () => {
      for (const locationArea of ['Nowhere', '77 Palm Grove Road Colombo 05', '', 42, ['Colombo 03']]) {
        const result = await validate({ ...validPosting, locationArea });
        expect(result.mapped().locationArea?.msg).toBe(AREA_NOT_LISTED_MESSAGE);
      }
    });

    test('a missing area is the same field error', async () => {
      const { locationArea, ...withoutArea } = validPosting;
      const result = await validate(withoutArea);
      expect(result.mapped().locationArea?.msg).toBe('Choose an area from the list.');
    });

    test('a listed area passes however it is written (case, spaces, "area", Colombo 4, an alias)', async () => {
      for (const locationArea of ['colombo 03', '  Colombo   3 ', 'Colombo 03 area', 'Kollupitiya', 'Hambantota']) {
        const result = await validate({ ...validPosting, locationArea });
        expect(result.mapped().locationArea).toBeUndefined();
      }
    });

    test('the old client-sent label and coordinates are no longer asked for', async () => {
      const result = await validate(validPosting); // no locationAreaLabel / locationLat / locationLng
      expect(result.isEmpty()).toBe(true);
    });
  });
});
