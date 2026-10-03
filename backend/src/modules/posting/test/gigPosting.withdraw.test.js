// gigPosting.withdraw.test.js
// FR-POST-12 (withdrawal), FR-POST-14 (fill count on the owner's list) and
// FR-POST-18 (Open/Filled) — the service rules, with the Prisma client mocked
// so no database is needed.
import { jest } from '@jest/globals';

const prismaMock = {
  gigPosting: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    updateMany: jest.fn(),
  },
  $executeRaw: jest.fn(),
};
jest.unstable_mockModule('../../../lib/prisma.js', () => ({ default: prismaMock }));

const {
  withdrawGigPosting,
  listGigPostingsByEmployer,
  getGigPostingById,
  computeFillStatus,
  syncPostingStatus,
  WITHDRAW_AFTER_FILL_MESSAGE,
} = await import('../posting.service.js');

const OWNER = 'employer-1';
const POSTING_ID = 'posting-1';

beforeEach(() => jest.resetAllMocks());

describe('FR-POST-18: computeFillStatus', () => {
  test('Open while any slot is unfilled', () => {
    expect(computeFillStatus(0, 3)).toBe('OPEN');
    expect(computeFillStatus(2, 3)).toBe('OPEN');
  });

  test('Filled once every slot has a selected worker', () => {
    expect(computeFillStatus(3, 3)).toBe('FILLED');
    expect(computeFillStatus(1, 1)).toBe('FILLED');
  });

  test('a slot reopening takes a Filled posting back to Open', () => {
    expect(computeFillStatus(2, 3)).toBe('OPEN'); // was 3 of 3
  });
});

describe('FR-POST-18: syncPostingStatus', () => {
  test('runs one UPDATE and can run on a caller-supplied transaction client', async () => {
    const tx = { $executeRaw: jest.fn().mockResolvedValue(1) };
    await syncPostingStatus(POSTING_ID, tx);
    expect(tx.$executeRaw).toHaveBeenCalledTimes(1);
    expect(prismaMock.$executeRaw).not.toHaveBeenCalled();
  });
});

describe('FR-POST-12: withdrawGigPosting', () => {
  test('withdraws an Open posting with no filled slots', async () => {
    prismaMock.gigPosting.findUnique
      .mockResolvedValueOnce({ employerId: OWNER }) // ownership check
      .mockResolvedValueOnce({
        id: POSTING_ID,
        employerId: OWNER,
        status: 'WITHDRAWN',
        filledCount: 0,
        workersNeeded: 3,
        applications: [],
        engagements: [],
      });
    prismaMock.gigPosting.updateMany.mockResolvedValue({ count: 1 });

    const posting = await withdrawGigPosting(OWNER, POSTING_ID);

    // The guard is part of the UPDATE itself, not a separate read.
    expect(prismaMock.gigPosting.updateMany).toHaveBeenCalledWith({
      where: { id: POSTING_ID, employerId: OWNER, status: 'OPEN', filledCount: 0 },
      data: { status: 'WITHDRAWN', withdrawnAt: expect.any(Date) },
    });
    expect(posting.status).toBe('WITHDRAWN');
  });

  test('refuses once a slot is filled, naming the two actions that do apply', async () => {
    prismaMock.gigPosting.findUnique
      .mockResolvedValueOnce({ employerId: OWNER })
      .mockResolvedValueOnce({ status: 'OPEN', filledCount: 1 });
    prismaMock.gigPosting.updateMany.mockResolvedValue({ count: 0 });

    await expect(withdrawGigPosting(OWNER, POSTING_ID)).rejects.toMatchObject({
      status: 409,
      message: WITHDRAW_AFTER_FILL_MESSAGE,
    });
    expect(WITHDRAW_AFTER_FILL_MESSAGE).toMatch(/lower Workers needed/);
    expect(WITHDRAW_AFTER_FILL_MESSAGE).toMatch(/cancel it from Engagements/);
  });

  test('refuses a posting that is already closed', async () => {
    prismaMock.gigPosting.findUnique
      .mockResolvedValueOnce({ employerId: OWNER })
      .mockResolvedValueOnce({ status: 'EXPIRED', filledCount: 0 });
    prismaMock.gigPosting.updateMany.mockResolvedValue({ count: 0 });

    await expect(withdrawGigPosting(OWNER, POSTING_ID)).rejects.toMatchObject({ status: 409 });
  });

  test("reports someone else's posting as not found", async () => {
    prismaMock.gigPosting.findUnique.mockResolvedValueOnce({ employerId: 'someone-else' });

    await expect(withdrawGigPosting(OWNER, POSTING_ID)).rejects.toMatchObject({ status: 404 });
    expect(prismaMock.gigPosting.updateMany).not.toHaveBeenCalled();
  });

  test('reports a missing posting as not found', async () => {
    prismaMock.gigPosting.findUnique.mockResolvedValueOnce(null);

    await expect(withdrawGigPosting(OWNER, POSTING_ID)).rejects.toMatchObject({ status: 404 });
  });
});

describe('FR-POST-14: the owner list carries the fill count and waiting applicants', () => {
  test('flattens the pending-applicant count and keeps filledCount / workersNeeded', async () => {
    prismaMock.gigPosting.findMany.mockResolvedValue([
      {
        id: 'a',
        filledCount: 1,
        workersNeeded: 3,
        status: 'OPEN',
        applications: [{ status: 'PENDING' }, { status: 'PENDING' }, { status: 'SELECTED' }],
      },
    ]);

    const [posting] = await listGigPostingsByEmployer(OWNER);

    expect(posting).toMatchObject({
      filledCount: 1,
      workersNeeded: 3,
      pendingApplicantCount: 2, // "2 applicants waiting"
      applicantCount: 3, // everyone who ever applied
    });
    expect(posting.applications).toBeUndefined(); // the rows never reach the client
  });
});

describe('FR-POST-08: the detail endpoint redacts the address for non-owners', () => {
  const row = {
    id: POSTING_ID,
    employerId: OWNER,
    locationAddress: '23 Temple Road, Colombo 04',
    locationAreaLabel: 'Colombo 04',
    locationLat: 6.9,
    locationLng: 79.8,
    applications: [{ status: 'PENDING' }, { status: 'PENDING' }, { status: 'PENDING' }, { status: 'PENDING' }],
    engagements: [],
  };

  test('the owner sees the address and the applicant counts', async () => {
    prismaMock.gigPosting.findUnique.mockResolvedValue(row);
    const posting = await getGigPostingById(POSTING_ID, OWNER);
    expect(posting.locationAddress).toBe('23 Temple Road, Colombo 04');
    expect(posting.pendingApplicantCount).toBe(4);
  });

  test('anyone else gets the area only, and no applicant count', async () => {
    prismaMock.gigPosting.findUnique.mockResolvedValue(row);
    const posting = await getGigPostingById(POSTING_ID, 'a-worker');
    expect(posting.locationAddress).toBeNull();
    expect(posting.locationAreaLabel).toBe('Colombo 04');
    expect(posting.pendingApplicantCount).toBeUndefined();
    expect(posting.applicantCount).toBeUndefined();
  });
});
