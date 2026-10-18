// gigPosting.editFields.test.js
// FR-POST-11 "edit any field": the PATCH validators for description, category and location, and
// FR-APPLY-10's notification to pending applicants when the category or location changes
// (posting.applicants.js). Prisma and Applying & Selection's service are mocked; no database.
import { jest } from '@jest/globals';
import { validationResult } from 'express-validator';

const prismaMock = {
  gigPosting: { findUnique: jest.fn() },
  application: { findMany: jest.fn() },
  notification: { createMany: jest.fn() },
};
jest.unstable_mockModule('../../../lib/prisma.js', () => ({ default: prismaMock }));
const notifyThroughApplying = jest.fn().mockResolvedValue({ notified: 2 });
jest.unstable_mockModule('../../application/application.service.js', () => ({
  resolvePendingApplicants: jest.fn(),
  notifyPendingApplicantsOfChange: notifyThroughApplying,
}));

const { updateGigPostingValidators, AREA_NOT_LISTED_MESSAGE } = await import('../posting.validators.js');
const { notifyPendingApplicantsOfChange } = await import('../posting.applicants.js');
const { describeChanges } = await import('../../application/application.notifications.js');

async function validate(body) {
  const req = { body };
  for (const middleware of updateGigPostingValidators) await middleware.run(req);
  return validationResult(req).mapped();
}

beforeEach(() => jest.clearAllMocks());

describe('FR-POST-11: PATCH validators for the newly editable fields', () => {
  test('a valid description, category, address and listed area pass', async () => {
    const errors = await validate({
      description: 'Carry chairs.',
      category: 'MOVING',
      locationAddress: '5 Galle Road, Dehiwala',
      locationArea: 'Dehiwala',
    });
    expect(errors).toEqual({});
  });

  test('an empty or over-long description is refused', async () => {
    expect((await validate({ description: '   ' })).description).toBeDefined();
    expect((await validate({ description: 'x'.repeat(1001) })).description).toBeDefined();
  });

  test('a category outside the FR-POST-02 allow-list is refused', async () => {
    expect((await validate({ category: 'CHILDCARE' })).category).toBeDefined();
  });

  test('an area that is not on the list is refused with the picker message', async () => {
    expect((await validate({ locationArea: 'Atlantis' })).locationArea.msg).toBe(AREA_NOT_LISTED_MESSAGE);
  });

  test('an empty address is refused', async () => {
    expect((await validate({ locationAddress: '' })).locationAddress).toBeDefined();
  });

  test('fields that are not sent are not checked', async () => {
    expect(await validate({ title: 'New title' })).toEqual({});
  });
});

describe('FR-APPLY-10: pending applicants hear about every material field', () => {
  test('pay, start, workers needed and schedule go through Applying & Selection unchanged', async () => {
    await notifyPendingApplicantsOfChange('p1', ['payAmount', 'startAt']);
    expect(notifyThroughApplying).toHaveBeenCalledWith('p1', ['payAmount', 'startAt']);
    expect(prismaMock.notification.createMany).not.toHaveBeenCalled();
  });

  test('a category or location change writes one APPLICATION_TERMS_CHANGED per pending applicant', async () => {
    prismaMock.gigPosting.findUnique.mockResolvedValue({
      id: 'p1',
      title: 'Weekend event crew (3 needed)',
      payKind: 'FIXED_TOTAL',
      payAmount: 6000,
      category: 'MOVING',
      locationAreaLabel: 'Dehiwala',
    });
    prismaMock.application.findMany.mockResolvedValue([
      { id: 'a1', workerId: 'w1' },
      { id: 'a2', workerId: 'w2' },
    ]);

    const result = await notifyPendingApplicantsOfChange('p1', ['payAmount', 'category', 'locationAreaLabel']);

    expect(result).toEqual({ notified: 2 });
    expect(notifyThroughApplying).not.toHaveBeenCalled(); // one notification each, not two
    expect(prismaMock.application.findMany.mock.calls[0][0].where).toEqual({ gigPostingId: 'p1', status: 'PENDING' });
    const rows = prismaMock.notification.createMany.mock.calls[0][0].data;
    expect(rows).toHaveLength(2);
    expect(rows[0]).toMatchObject({
      userId: 'w1',
      type: 'APPLICATION_TERMS_CHANGED',
      payload: {
        gigPostingId: 'p1',
        title: 'Weekend event crew (3 needed) changed',
        body:
          'The pay changed to Rs 6,000 for the job · The category changed to Moving · ' +
          'The location changed to Dehiwala area · you can withdraw if it no longer suits you',
      },
    });
  });

  test('no pending applicants, no notifications', async () => {
    prismaMock.gigPosting.findUnique.mockResolvedValue({ id: 'p1', title: 't', category: 'RETAIL' });
    prismaMock.application.findMany.mockResolvedValue([]);
    await expect(notifyPendingApplicantsOfChange('p1', ['category'])).resolves.toEqual({ notified: 0 });
    expect(prismaMock.notification.createMany).not.toHaveBeenCalled();
  });
});

describe('describeChanges: the sentences for the new material fields', () => {
  test('category uses the picker label (2.2)', () => {
    expect(describeChanges({ category: 'FOOD_SERVICE' }, ['category'])).toBe('The category changed to Food service');
  });

  test('an address-only change still names only the public area (FR-POST-08)', () => {
    const posting = { locationAreaLabel: 'Colombo 04', locationAddress: '23 Temple Road, Colombo 04' };
    expect(describeChanges(posting, ['locationAddress'])).toBe('The location changed to Colombo 04 area');
  });

  test('an address and area change together give one sentence', () => {
    const posting = { locationAreaLabel: 'Dehiwala' };
    expect(describeChanges(posting, ['locationAddress', 'locationAreaLabel'])).toBe('The location changed to Dehiwala area');
  });
});
