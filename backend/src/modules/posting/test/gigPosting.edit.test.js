// gigPosting.edit.test.js
// FR-POST-11 (posting editing) — the service rules, with the Prisma client mocked so no
// database is needed.
import { jest } from '@jest/globals';

const prismaMock = {
  $queryRaw: jest.fn().mockResolvedValue([]), // expireDuePostings() runs a raw statement on every read
  gigPosting: {
    findUnique: jest.fn(),
    updateMany: jest.fn(),
  },
  $executeRaw: jest.fn(),
  $transaction: jest.fn(),
};
jest.unstable_mockModule('../../../lib/prisma.js', () => ({ default: prismaMock }));

const { updateGigPosting, EDIT_REFUSED_MESSAGES } = await import('../posting.service.js');

const OWNER = 'employer-1';
const ID = 'posting-1';
const START = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000); // well beyond 48 hours

function stored(overrides = {}) {
  return {
    id: ID,
    employerId: OWNER,
    status: 'OPEN',
    autoHiddenAt: null,
    title: 'Event setup crew',
    payKind: 'FIXED_TOTAL',
    payAmount: 6000,
    arrangementType: 'GIG',
    workersNeeded: 3,
    filledCount: 0,
    startAt: START,
    schedule: null,
    ...overrides,
  };
}

// First findUnique is the edit's own read; the last one is the returned posting.
function givenPosting(row) {
  prismaMock.gigPosting.findUnique.mockResolvedValue(row);
  prismaMock.gigPosting.updateMany.mockResolvedValue({ count: 1 });
}

// A posting with a place filled, edited inside a transaction. `tx` is the client the service's
// $transaction callback receives, so a test can see exactly what was written through it.
function givenTransaction(row, { engagements = [{ id: 'eng-1' }], waiting = 0 } = {}) {
  prismaMock.gigPosting.findUnique.mockResolvedValue(stored(row));
  const tx = {
    gigPosting: { updateMany: jest.fn().mockResolvedValue({ count: 1 }) },
    materialChangeRequest: { count: jest.fn().mockResolvedValue(waiting), create: jest.fn() },
    engagement: { findMany: jest.fn().mockResolvedValue(engagements) },
  };
  prismaMock.$transaction.mockImplementation((callback) => callback(tx));
  return tx;
}

beforeEach(() => jest.resetAllMocks());

describe('FR-POST-11: updateGigPosting', () => {
  test('applies any change at once when no slot has filled', async () => {
    givenPosting(stored());
    await updateGigPosting(OWNER, ID, { payAmount: 7000, workersNeeded: 4, title: 'Crew' });

    const call = prismaMock.gigPosting.updateMany.mock.calls[0][0];
    expect(call.data).toEqual({ payAmount: 7000, workersNeeded: 4, title: 'Crew' });
    // Guarded on the fill count that was read, so a fill in between can't slip through.
    expect(call.where).toMatchObject({ id: ID, employerId: OWNER, status: 'OPEN', filledCount: 0 });
  });

  test('re-derives urgency from a new start (FR-POST-07), ignoring any client value', async () => {
    givenPosting(stored());
    const soon = new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString();
    await updateGigPosting(OWNER, ID, { startAt: soon, isUrgent: false });

    const { data } = prismaMock.gigPosting.updateMany.mock.calls[0][0];
    expect(data.isUrgent).toBe(true);
    expect(data.startAt).toEqual(new Date(soon));
  });

  test('a posting that is not the caller\'s is reported as not found', async () => {
    givenPosting(stored({ employerId: 'someone-else' }));
    await expect(updateGigPosting(OWNER, ID, { title: 'x' })).rejects.toMatchObject({ status: 404 });
    expect(prismaMock.gigPosting.updateMany).not.toHaveBeenCalled();
  });

  test('only an Open posting can be edited', async () => {
    givenPosting(stored({ status: 'WITHDRAWN' }));
    await expect(updateGigPosting(OWNER, ID, { title: 'x' })).rejects.toThrow(EDIT_REFUSED_MESSAGES.closed);
  });

  test('editing is paused while the posting is hidden pending review', async () => {
    givenPosting(stored({ autoHiddenAt: new Date() }));
    await expect(updateGigPosting(OWNER, ID, { title: 'x' })).rejects.toThrow(EDIT_REFUSED_MESSAGES.hidden);
  });

  test('after a fill a pay change is saved together with one re-confirmation request per active engagement', async () => {
    const tx = givenTransaction({ filledCount: 1 }, { engagements: [{ id: 'eng-1' }, { id: 'eng-2' }] });
    await updateGigPosting(OWNER, ID, { payAmount: 9000 });

    // The edit and the requests commit or fail together: one transaction.
    expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
    expect(tx.gigPosting.updateMany.mock.calls[0][0].data).toEqual({ payAmount: 9000 });
    expect(tx.engagement.findMany.mock.calls[0][0].where).toEqual({ gigPostingId: ID, status: { not: 'CANCELLED' } });
    expect(tx.materialChangeRequest.create).toHaveBeenCalledTimes(2);
    const { data } = tx.materialChangeRequest.create.mock.calls[0][0];
    expect(data).toMatchObject({ gigPostingId: ID, engagementId: 'eng-1', status: 'PENDING' });
    expect(data.changeSummary).toEqual({ payAmount: { from: 6000, to: 9000 } });
    // The posting is 5 days away, so the 48-hour cap applies to the worker's window.
    const windowMs = data.deadline.getTime() - Date.now();
    expect(windowMs).toBeGreaterThan(47.9 * 3600e3);
    expect(windowMs).toBeLessThanOrEqual(48 * 3600e3);
  });

  test('a second material edit while one re-confirmation is waiting is refused (one at a time)', async () => {
    const tx = givenTransaction({ filledCount: 1 }, { waiting: 1 });
    await expect(updateGigPosting(OWNER, ID, { payAmount: 9000 })).rejects.toMatchObject({
      status: 409,
      message: EDIT_REFUSED_MESSAGES.reconfirmPending,
    });
    expect(tx.gigPosting.updateMany).not.toHaveBeenCalled();
    expect(tx.materialChangeRequest.create).not.toHaveBeenCalled();
  });

  test('after a fill a title change (minor) still applies and asks no one to re-confirm', async () => {
    givenPosting(stored({ filledCount: 1 }));
    await updateGigPosting(OWNER, ID, { title: 'New title', payAmount: 6000 }); // pay unchanged
    expect(prismaMock.gigPosting.updateMany.mock.calls[0][0].data).toEqual({ title: 'New title' });
    expect(prismaMock.$transaction).not.toHaveBeenCalled(); // no re-confirmation request, no transaction
  });

  test('lowering Workers needed to the fill count after a fill re-confirms and makes the posting Filled', async () => {
    const tx = givenTransaction({ filledCount: 1 });
    await updateGigPosting(OWNER, ID, { workersNeeded: 1 });
    expect(tx.materialChangeRequest.create).toHaveBeenCalledTimes(1);
    expect(tx.materialChangeRequest.create.mock.calls[0][0].data.changeSummary).toEqual({
      workersNeeded: { from: 3, to: 1 },
    });
    expect(prismaMock.$executeRaw).toHaveBeenCalledTimes(1); // syncPostingStatus -> FILLED (FR-POST-18)
  });

  test("moving a Gig's start moves its expiry with it (FR-POST-13)", async () => {
    givenPosting(stored());
    const later = new Date(Date.now() + 9 * 24 * 3600e3).toISOString();
    await updateGigPosting(OWNER, ID, { startAt: later });
    expect(prismaMock.gigPosting.updateMany.mock.calls[0][0].data.expiresAt).toEqual(new Date(later));
  });

  test("a part-time job's expiry (30 days after posting) does not move when its start is edited", async () => {
    givenPosting(stored({ arrangementType: 'PART_TIME', schedule: 'Mon' }));
    const later = new Date(Date.now() + 9 * 24 * 3600e3).toISOString();
    await updateGigPosting(OWNER, ID, { startAt: later });
    expect(prismaMock.gigPosting.updateMany.mock.calls[0][0].data.expiresAt).toBeUndefined();
  });

  test('an unchanged form writes nothing', async () => {
    givenPosting(stored());
    await updateGigPosting(OWNER, ID, { title: 'Event setup crew', payAmount: 6000, workersNeeded: 3 });
    expect(prismaMock.gigPosting.updateMany).not.toHaveBeenCalled();
  });

  test('a fill landing between the read and the write is refused', async () => {
    givenPosting(stored());
    prismaMock.gigPosting.updateMany.mockResolvedValue({ count: 0 });
    await expect(updateGigPosting(OWNER, ID, { payAmount: 7000 })).rejects.toThrow(
      EDIT_REFUSED_MESSAGES.changedMeanwhile,
    );
  });

  test('changing Workers needed re-syncs Open/Filled (FR-POST-18)', async () => {
    givenPosting(stored());
    await updateGigPosting(OWNER, ID, { workersNeeded: 2 });
    expect(prismaMock.$executeRaw).toHaveBeenCalledTimes(1);
  });
});
