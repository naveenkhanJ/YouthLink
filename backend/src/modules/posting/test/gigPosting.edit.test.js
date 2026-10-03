// gigPosting.edit.test.js
// FR-POST-11 (posting editing) — the service rules, with the Prisma client mocked so no
// database is needed.
import { jest } from '@jest/globals';

const prismaMock = {
  gigPosting: {
    findUnique: jest.fn(),
    updateMany: jest.fn(),
  },
  $executeRaw: jest.fn(),
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

  test('after a fill a material change is refused, never applied silently', async () => {
    givenPosting(stored({ filledCount: 1 }));
    await expect(updateGigPosting(OWNER, ID, { payAmount: 9000 })).rejects.toThrow(
      EDIT_REFUSED_MESSAGES.needsReconfirmation,
    );
    expect(prismaMock.gigPosting.updateMany).not.toHaveBeenCalled();
  });

  test('after a fill a title change (minor) still applies', async () => {
    givenPosting(stored({ filledCount: 1 }));
    await updateGigPosting(OWNER, ID, { title: 'New title', payAmount: 6000 }); // pay unchanged
    expect(prismaMock.gigPosting.updateMany.mock.calls[0][0].data).toEqual({ title: 'New title' });
  });

  test('lowering Workers needed after a fill is also a material change, so it is refused for now', async () => {
    givenPosting(stored({ filledCount: 1 }));
    await expect(updateGigPosting(OWNER, ID, { workersNeeded: 1 })).rejects.toThrow(
      EDIT_REFUSED_MESSAGES.needsReconfirmation,
    );
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
