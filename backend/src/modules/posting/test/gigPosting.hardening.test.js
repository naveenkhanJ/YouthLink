// gigPosting.hardening.test.js
// Regression tests for defects found by running the posting service against a real database
// (2026-10-03): each test pins one fix so it can't quietly come back.
//   - FR-POST-16: "Posted as" is the employer's ACCOUNT setting, never the request body.
//   - A pay amount above the column's range, or a text field sent as an array/object, used to
//     pass validation and crash with a 500 instead of a 400.
//   - FR-DISPUTE-02: a posting hidden for review is visible to its owner only.
//   - FR-POST-08 (round 4): the public area and coordinates come from the server's area list.
import { jest } from '@jest/globals';
import { validationResult } from 'express-validator';

const prismaMock = {
  $queryRaw: jest.fn().mockResolvedValue([]), // expireDuePostings() runs a raw statement on every read
  user: { findUnique: jest.fn() },
  gigPosting: { create: jest.fn(), findUnique: jest.fn() },
};
jest.unstable_mockModule('../../../lib/prisma.js', () => ({ default: prismaMock }));

const { createGigPosting, getGigPostingById } = await import('../posting.service.js');
const {
  createGigPostingValidators,
  updateGigPostingValidators,
  PAY_AMOUNT_MAX,
  ADDRESS_MAX,
  AREA_NOT_LISTED_MESSAGE,
} = await import('../posting.validators.js');
const { findArea } = await import('../posting.areas.js');

const OWNER = 'employer-1';

const validBody = () => ({
  title: 'Event setup crew',
  description: 'Help set up staging.',
  category: 'EVENT_SETUP',
  arrangementType: 'GIG',
  payKind: 'FIXED_TOTAL',
  payAmount: 6000,
  locationAddress: '23 Temple Road, Colombo 04',
  locationArea: 'Colombo 04',
  workersNeeded: 3,
  startAt: new Date(Date.now() + 30 * 3600e3).toISOString(),
});

async function validate(chain, body) {
  const req = { body };
  for (const middleware of chain) await middleware.run(req);
  return validationResult(req).mapped();
}

beforeEach(() => {
  jest.resetAllMocks();
  prismaMock.gigPosting.create.mockImplementation(async ({ data }) => ({ id: 'p1', ...data }));
});

describe('FR-POST-16: posted-as comes from the account', () => {
  const created = () => prismaMock.gigPosting.create.mock.calls[0][0].data;

  test('a business account posts as that business, with its own name and bio', async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      postingAsType: 'BUSINESS',
      businessName: ' Lanka Events (Pvt) Ltd ',
      businessBio: 'Event crews.',
    });
    await createGigPosting(OWNER, validBody());
    expect(created()).toMatchObject({
      postedAsType: 'BUSINESS',
      postedBusinessName: 'Lanka Events (Pvt) Ltd',
      postedBusinessBio: 'Event crews.',
    });
  });

  test('a request claiming to be someone else is ignored', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ postingAsType: 'INDIVIDUAL', businessName: null, businessBio: null });
    await createGigPosting(OWNER, {
      ...validBody(),
      postedAsType: 'BUSINESS',
      postedBusinessName: 'Fake Corp (not my business)',
      postedBusinessBio: 'spoofed',
    });
    expect(created()).toMatchObject({ postedAsType: 'INDIVIDUAL', postedBusinessName: null, postedBusinessBio: null });
  });

  test('an individual account never carries a leftover business name onto a posting', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ postingAsType: 'INDIVIDUAL', businessName: 'Old Name', businessBio: 'Old' });
    await createGigPosting(OWNER, validBody());
    expect(created()).toMatchObject({ postedAsType: 'INDIVIDUAL', postedBusinessName: null, postedBusinessBio: null });
  });

  test('an employer with no setting posts as an individual', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ postingAsType: null, businessName: null, businessBio: null });
    await createGigPosting(OWNER, validBody());
    expect(created().postedAsType).toBe('INDIVIDUAL');
  });

  test('the create validators no longer ask the request for posted-as at all', async () => {
    const errors = await validate(createGigPostingValidators, validBody()); // no postedAsType sent
    expect(errors).toEqual({});
  });
});

describe('FR-POST-13: expiresAt is set when a posting is created', () => {
  const MINUTE = 60e3;
  const DAY = 24 * 3600e3;
  const expiryOf = async (body) => {
    await createGigPosting(OWNER, body);
    return prismaMock.gigPosting.create.mock.calls[0][0].data;
  };

  test('a Gig expires when it starts', async () => {
    const body = validBody();
    const data = await expiryOf(body);
    expect(data.expiresAt).toEqual(new Date(body.startAt));
  });

  test.each(['PART_TIME', 'INTERNSHIP'])('a %s expires 30 days after it was posted', async (arrangementType) => {
    const body = { ...validBody(), arrangementType, payKind: arrangementType === 'PART_TIME' ? 'RATE' : 'UNPAID',
      payRateUnit: 'DAY', schedule: 'Mon, Wed, Fri', startAt: new Date(Date.now() + 10 * DAY).toISOString() };
    const before = Date.now();
    const data = await expiryOf(body);
    expect(Math.abs(data.expiresAt.getTime() - (before + 30 * DAY))).toBeLessThan(MINUTE);
  });
});

describe('inputs that used to crash instead of being rejected', () => {
  test('a pay amount beyond the Decimal(12,2) column is a validation error, not a DB error', async () => {
    for (const payAmount of [99999999999999, '1e12', PAY_AMOUNT_MAX + 1]) {
      const errors = await validate(createGigPostingValidators, { ...validBody(), payAmount });
      expect(errors.payAmount).toBeDefined();
    }
    const edit = await validate(updateGigPostingValidators, { payAmount: 99999999999999 });
    expect(edit.payAmount).toBeDefined();
  });

  test('the largest storable pay amount is still accepted', async () => {
    const errors = await validate(createGigPostingValidators, { ...validBody(), payAmount: PAY_AMOUNT_MAX });
    expect(errors.payAmount).toBeUndefined();
  });

  test('a text field sent as an array or object is rejected (it used to crash .trim())', async () => {
    for (const bad of [['a', 'b'], { x: 1 }, 42]) {
      const errors = await validate(createGigPostingValidators, {
        ...validBody(),
        title: bad,
        description: bad,
        locationAddress: bad,
        locationArea: bad,
      });
      expect(Object.keys(errors).sort()).toEqual(['description', 'locationAddress', 'locationArea', 'title']);
    }
    const edit = await validate(updateGigPostingValidators, { title: ['a'], schedule: { x: 1 } });
    expect(Object.keys(edit).sort()).toEqual(['schedule', 'title']);
  });

  test('a schedule sent as an array is rejected for a part-time job', async () => {
    const errors = await validate(createGigPostingValidators, {
      ...validBody(),
      arrangementType: 'PART_TIME',
      payKind: 'RATE',
      payRateUnit: 'DAY',
      schedule: ['Mon'],
    });
    expect(errors.schedule).toBeDefined();
  });

  test('the address has a cap instead of being unbounded', async () => {
    const tooLong = await validate(createGigPostingValidators, {
      ...validBody(),
      locationAddress: 'x'.repeat(ADDRESS_MAX + 1),
    });
    expect(Object.keys(tooLong)).toEqual(['locationAddress']);

    const atCap = await validate(createGigPostingValidators, {
      ...validBody(),
      locationAddress: 'x'.repeat(ADDRESS_MAX),
    });
    expect(atCap).toEqual({});
  });

  test('a one-off gig still needs no schedule, even though schedule is now type-checked', async () => {
    const errors = await validate(createGigPostingValidators, validBody()); // no schedule sent
    expect(errors.schedule).toBeUndefined();
  });
});

// Round 4, L-1 (POST-E2E-01 / 02): the public area and the point come from the server's list.
describe('FR-POST-08: the area label and coordinates come from the area list, never the request', () => {
  const created = () => prismaMock.gigPosting.create.mock.calls[0][0].data;
  beforeEach(() => {
    prismaMock.user.findUnique.mockResolvedValue({ postingAsType: 'INDIVIDUAL', businessName: null, businessBio: null });
  });

  test('a label and coordinates sent by the client are ignored: the stored values are the chosen entry', async () => {
    await createGigPosting(OWNER, {
      ...validBody(),
      locationArea: 'Hambantota',
      locationAreaLabel: '99 Secret Lane',
      locationLat: 6.9271,
      locationLng: 79.8612,
    });
    const hambantota = findArea('Hambantota');
    expect(created()).toMatchObject({
      locationAreaLabel: 'Hambantota',
      locationLat: hambantota.lat,
      locationLng: hambantota.lng,
    });
    // Not Colombo's centre, which an unknown area used to fall back to (POST-E2E-02).
    expect(created().locationLat).not.toBe(6.9271);
  });

  test("the stored label is the list's spelling, however the area was typed", async () => {
    await createGigPosting(OWNER, { ...validBody(), locationArea: 'colombo 5 area' });
    expect(created().locationAreaLabel).toBe('Colombo 05');
  });

  test('a street address never becomes the public area label', async () => {
    const address = '77 Palm Grove Road Colombo 05'; // no comma: the case that leaked before
    await createGigPosting(OWNER, { ...validBody(), locationAddress: address, locationArea: 'Colombo 05' });
    expect(created().locationAddress).toBe(address); // kept for the owner and the selected worker
    expect(created().locationAreaLabel).toBe('Colombo 05');
    expect(created().locationAreaLabel).not.toContain('Palm Grove');
  });

  test('an area not on the list is refused with the field message, and nothing is written', async () => {
    await expect(createGigPosting(OWNER, { ...validBody(), locationArea: 'Nowhere' })).rejects.toMatchObject({
      status: 400,
      fields: { locationArea: AREA_NOT_LISTED_MESSAGE },
    });
    expect(prismaMock.gigPosting.create).not.toHaveBeenCalled();
  });
});

describe('FR-DISPUTE-02: a posting hidden for review is visible to its owner only', () => {
  const row = (over = {}) => ({
    id: 'p1',
    employerId: OWNER,
    autoHiddenAt: null,
    locationAddress: '23 Temple Road',
    locationAreaLabel: 'Colombo 04',
    locationLat: 6.9,
    locationLng: 79.8,
    applications: [],
    engagements: [],
    materialChangeRequests: [],
    ...over,
  });

  test('the owner can still open it', async () => {
    prismaMock.gigPosting.findUnique.mockResolvedValue(row({ autoHiddenAt: new Date() }));
    expect(await getGigPostingById('p1', OWNER)).toMatchObject({ id: 'p1' });
  });

  test('anyone else gets nothing, as if it did not exist', async () => {
    prismaMock.gigPosting.findUnique.mockResolvedValue(row({ autoHiddenAt: new Date() }));
    expect(await getGigPostingById('p1', 'a-worker')).toBeNull();
    expect(await getGigPostingById('p1', null)).toBeNull();
  });

  test('a normal posting is still readable by other users', async () => {
    prismaMock.gigPosting.findUnique.mockResolvedValue(row());
    expect(await getGigPostingById('p1', 'a-worker')).toMatchObject({ id: 'p1', locationAddress: null });
  });

  test('a withdrawn posting stays readable by id, so an applicant can see what happened', async () => {
    prismaMock.gigPosting.findUnique.mockResolvedValue(row({ status: 'WITHDRAWN' }));
    expect(await getGigPostingById('p1', 'a-worker')).toMatchObject({ status: 'WITHDRAWN' });
  });
});
