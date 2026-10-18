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
  // The "is a re-confirmation waiting?" check that runs before any edit (2.11c, round 4 L-7).
  materialChangeRequest: { count: jest.fn() },
  // How many engagements are still ACTIVE — only those are asked to re-confirm (FR-ENG-09).
  engagement: { count: jest.fn() },
  $executeRaw: jest.fn(),
  $transaction: jest.fn(),
};
jest.unstable_mockModule('../../../lib/prisma.js', () => ({ default: prismaMock }));
// The cross-module seams are mocked: these tests cover the posting rules, not what Applying &
// Selection or Notifications do when called (their own tests cover that).
const resolvePendingApplicants = jest.fn().mockResolvedValue({ resolved: 0 });
const notifyPendingApplicantsOfChange = jest.fn().mockResolvedValue({ notified: 0 });
jest.unstable_mockModule('../posting.applicants.js', () => ({ resolvePendingApplicants, notifyPendingApplicantsOfChange }));
jest.unstable_mockModule('../posting.notify.js', () => ({ notifyNewGigPosted: jest.fn().mockResolvedValue({ notified: 0 }) }));

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
    description: 'Set up chairs and the stage.',
    category: 'EVENT_SETUP',
    locationAddress: '23 Temple Road, Colombo 04',
    locationAreaLabel: 'Colombo 04',
    locationLat: 6.9147,
    locationLng: 79.8553,
    ...overrides,
  };
}

// First findUnique is the edit's own read; the last one is the returned posting.
function givenPosting(row, { waiting = 0 } = {}) {
  prismaMock.gigPosting.findUnique.mockResolvedValue(row);
  prismaMock.gigPosting.updateMany.mockResolvedValue({ count: 1 });
  prismaMock.materialChangeRequest.count.mockResolvedValue(waiting);
}

// A posting with a place filled, edited inside a transaction. `tx` is the client the service's
// $transaction callback receives, so a test can see exactly what was written through it.
function givenTransaction(row, { engagements = [{ id: 'eng-1' }], waiting = 0 } = {}) {
  prismaMock.gigPosting.findUnique.mockResolvedValue(stored(row));
  prismaMock.materialChangeRequest.count.mockResolvedValue(waiting);
  prismaMock.engagement.count.mockResolvedValue(engagements.length);
  const tx = {
    gigPosting: { updateMany: jest.fn().mockResolvedValue({ count: 1 }) },
    materialChangeRequest: { count: jest.fn().mockResolvedValue(waiting), create: jest.fn() },
    notification: { create: jest.fn() },
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
    expect(call.where).toMatchObject({ id: ID, employerId: OWNER, status: { in: ['OPEN', 'FILLED'] }, filledCount: 0 });
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

  test('a withdrawn or an expired posting cannot be edited', async () => {
    givenPosting(stored({ status: 'WITHDRAWN' }));
    await expect(updateGigPosting(OWNER, ID, { title: 'x' })).rejects.toThrow(EDIT_REFUSED_MESSAGES.closed);
    givenPosting(stored({ status: 'EXPIRED' }));
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
    expect(tx.engagement.findMany.mock.calls[0][0].where).toEqual({ gigPostingId: ID, status: 'ACTIVE' });
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

  // Round 4, L-7 (POST-E2E-09): 2.11c says "Editing is paused until the re-confirmation is
  // answered", so the server refuses every edit while one is waiting — a title too.
  test('while a re-confirmation is waiting even a title-only edit is refused, with the same message', async () => {
    givenPosting(stored({ filledCount: 1 }), { waiting: 1 });
    await expect(updateGigPosting(OWNER, ID, { title: 'New title' })).rejects.toMatchObject({
      status: 409,
      message: 'An earlier change is still waiting for the engaged worker to re-confirm. You can edit again once they respond.',
    });
    expect(prismaMock.materialChangeRequest.count.mock.calls[0][0].where).toEqual({
      gigPostingId: ID,
      status: 'PENDING',
      engagement: { status: 'ACTIVE' },
    });
    expect(prismaMock.gigPosting.updateMany).not.toHaveBeenCalled();
    expect(prismaMock.$transaction).not.toHaveBeenCalled();
  });

  test('a waiting re-confirmation pauses every edit, even on a posting whose slot has since reopened', async () => {
    givenPosting(stored({ filledCount: 0 }), { waiting: 1 });
    await expect(updateGigPosting(OWNER, ID, { payAmount: 7000 })).rejects.toThrow(EDIT_REFUSED_MESSAGES.reconfirmPending);
    expect(prismaMock.gigPosting.updateMany).not.toHaveBeenCalled();
  });

  // FR-POST-08: the area label and the point come from the server's list, never the request.
  test('a location edit takes the label and the coordinates from the area list, not the request', async () => {
    givenPosting(stored());
    await updateGigPosting(OWNER, ID, {
      title: 'Crew',
      locationAddress: '  1 Other Street, Jaffna ',
      locationArea: 'jaffna',
      locationAreaLabel: '99 Secret Lane',
      locationLat: 1.23,
      locationLng: 4.56,
    });
    expect(prismaMock.gigPosting.updateMany.mock.calls[0][0].data).toEqual({
      title: 'Crew',
      locationAddress: '1 Other Street, Jaffna',
      locationAreaLabel: 'Jaffna',
      locationLat: 9.6685,
      locationLng: 80.0074,
    });
  });

  test('an area that is not on the list is refused', async () => {
    givenPosting(stored());
    await expect(updateGigPosting(OWNER, ID, { locationArea: 'Atlantis' })).rejects.toMatchObject({ status: 400 });
    expect(prismaMock.gigPosting.updateMany).not.toHaveBeenCalled();
  });

  test('choosing the area the posting already has is no change', async () => {
    givenPosting(stored());
    await updateGigPosting(OWNER, ID, { locationArea: 'Colombo 4' });
    expect(prismaMock.gigPosting.updateMany).not.toHaveBeenCalled();
  });

  test('arrangement type and pay kind are not editable: they are ignored', async () => {
    givenPosting(stored());
    await updateGigPosting(OWNER, ID, { arrangementType: 'PART_TIME', payKind: 'RATE', title: 'Crew' });
    expect(prismaMock.gigPosting.updateMany.mock.calls[0][0].data).toEqual({ title: 'Crew' });
  });

  test('a PATCH carrying only the derived location fields writes nothing', async () => {
    givenPosting(stored());
    await updateGigPosting(OWNER, ID, { locationAreaLabel: 'Galle', locationLat: 6.03, locationLng: 80.21 });
    expect(prismaMock.gigPosting.updateMany).not.toHaveBeenCalled();
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

// FR-POST-11 "edit any field", FR-ENG-09 (rules 2 and 3) and FR-ENG-11 (a Filled posting).
describe('FR-POST-11 / FR-ENG-09 / FR-ENG-11: what an edit after a fill asks for', () => {
  const HOUR = 3600e3;

  test('a description-only edit with a worker engaged applies at once and asks no one (minor change)', async () => {
    givenPosting(stored({ filledCount: 1 }));
    prismaMock.engagement.count.mockResolvedValue(1);
    await updateGigPosting(OWNER, ID, { description: '  Bring gloves.  ' });

    expect(prismaMock.gigPosting.updateMany.mock.calls[0][0].data).toEqual({ description: 'Bring gloves.' });
    expect(prismaMock.$transaction).not.toHaveBeenCalled();
    expect(notifyPendingApplicantsOfChange).not.toHaveBeenCalled(); // nothing material changed
  });

  test('a category edit with a worker engaged is a material change: re-confirmation requested', async () => {
    const tx = givenTransaction({ filledCount: 1 });
    await updateGigPosting(OWNER, ID, { category: 'MOVING' });

    expect(tx.gigPosting.updateMany.mock.calls[0][0].data).toEqual({ category: 'MOVING' });
    expect(tx.materialChangeRequest.create).toHaveBeenCalledTimes(1);
    expect(tx.materialChangeRequest.create.mock.calls[0][0].data.changeSummary).toEqual({
      category: { from: 'EVENT_SETUP', to: 'MOVING' },
    });
    expect(notifyPendingApplicantsOfChange).toHaveBeenCalledWith(ID, ['category']); // FR-APPLY-10
  });

  test('a location edit with a worker engaged is a material change: re-confirmation requested', async () => {
    const tx = givenTransaction({ filledCount: 1 });
    await updateGigPosting(OWNER, ID, { locationAddress: '5 Galle Road, Dehiwala', locationArea: 'Dehiwala' });

    expect(tx.gigPosting.updateMany.mock.calls[0][0].data).toEqual({
      locationAddress: '5 Galle Road, Dehiwala',
      locationAreaLabel: 'Dehiwala',
      locationLat: 6.8513,
      locationLng: 79.8659,
    });
    expect(tx.materialChangeRequest.create.mock.calls[0][0].data.changeSummary).toEqual({
      locationAddress: { from: '23 Temple Road, Colombo 04', to: '5 Galle Road, Dehiwala' },
      locationAreaLabel: { from: 'Colombo 04', to: 'Dehiwala' },
    });
    // The worker's notification names the public area only (FR-POST-08).
    const { body } = tx.notification.create.mock.calls[0][0].data.payload;
    expect(body).toMatch(/^The location changed to Dehiwala area · respond by /);
    expect(body).not.toContain('Galle Road');
    expect(notifyPendingApplicantsOfChange).toHaveBeenCalledWith(ID, ['locationAddress', 'locationAreaLabel']);
  });

  test('a Filled posting can be edited, and every ACTIVE engagement gets its own request (3 of 3)', async () => {
    const tx = givenTransaction(
      { status: 'FILLED', filledCount: 3, workersNeeded: 3 },
      { engagements: [{ id: 'e1', workerId: 'w1' }, { id: 'e2', workerId: 'w2' }, { id: 'e3', workerId: 'w3' }] },
    );
    await updateGigPosting(OWNER, ID, { payAmount: 7000 });

    const { where } = tx.gigPosting.updateMany.mock.calls[0][0];
    expect(where).toMatchObject({ status: { in: ['OPEN', 'FILLED'] }, filledCount: 3 });
    expect(tx.engagement.findMany.mock.calls[0][0].where).toEqual({ gigPostingId: ID, status: 'ACTIVE' });
    expect(tx.materialChangeRequest.create).toHaveBeenCalledTimes(3);
    expect(tx.materialChangeRequest.create.mock.calls.map((c) => c[0].data.engagementId)).toEqual(['e1', 'e2', 'e3']);
    // FR-ENG-11 (amended 2026-09-23): the same deadline for every worker.
    const deadlines = tx.materialChangeRequest.create.mock.calls.map((c) => c[0].data.deadline.getTime());
    expect(new Set(deadlines).size).toBe(1);
    expect(tx.notification.create.mock.calls.map((c) => c[0].data.userId)).toEqual(['w1', 'w2', 'w3']);
  });

  test('raising Workers needed on a Filled posting reopens it (FR-POST-18) and re-confirms', async () => {
    const tx = givenTransaction({ status: 'FILLED', filledCount: 1, workersNeeded: 1 });
    await updateGigPosting(OWNER, ID, { workersNeeded: 2 });
    expect(tx.materialChangeRequest.create).toHaveBeenCalledTimes(1);
    expect(prismaMock.$executeRaw).toHaveBeenCalledTimes(1); // syncPostingStatus -> OPEN
    expect(resolvePendingApplicants).not.toHaveBeenCalled();
  });

  test('a filled place whose engagement is completed (none ACTIVE) creates no request', async () => {
    givenPosting(stored({ filledCount: 1 }));
    prismaMock.engagement.count.mockResolvedValue(0);
    await updateGigPosting(OWNER, ID, { payAmount: 7000 });

    expect(prismaMock.engagement.count.mock.calls[0][0].where).toEqual({ gigPostingId: ID, status: 'ACTIVE' });
    expect(prismaMock.$transaction).not.toHaveBeenCalled();
    expect(prismaMock.gigPosting.updateMany.mock.calls[0][0].data).toEqual({ payAmount: 7000 });
  });

  test('rule 2: a pay change within 2 hours of the start is refused when a worker is engaged', async () => {
    const tx = givenTransaction({ filledCount: 1, startAt: new Date(Date.now() + 1 * HOUR) });
    await expect(updateGigPosting(OWNER, ID, { payAmount: 9000 })).rejects.toMatchObject({
      status: 409,
      message: EDIT_REFUSED_MESSAGES.tooCloseToStart,
    });
    expect(tx.gigPosting.updateMany).not.toHaveBeenCalled();
    expect(tx.materialChangeRequest.create).not.toHaveBeenCalled();
    expect(prismaMock.gigPosting.updateMany).not.toHaveBeenCalled();
  });

  test('rule 2 covers every material field: category, location and workers needed too', async () => {
    for (const edit of [{ category: 'MOVING' }, { locationArea: 'Dehiwala' }, { workersNeeded: 2 }]) {
      jest.resetAllMocks();
      givenTransaction({ filledCount: 1, startAt: new Date(Date.now() + 90 * 60 * 1000) });
      await expect(updateGigPosting(OWNER, ID, edit)).rejects.toMatchObject({ status: 409 });
    }
  });

  test('rule 2: a material change after the start (an ongoing part-time job) is refused too', async () => {
    givenTransaction({ filledCount: 1, arrangementType: 'PART_TIME', schedule: 'Mon', startAt: new Date(Date.now() - 24 * HOUR) });
    await expect(updateGigPosting(OWNER, ID, { payAmount: 9000 })).rejects.toThrow(EDIT_REFUSED_MESSAGES.tooCloseToStart);
  });

  test('rule 2 leaves minor changes alone: title and description inside 2 hours still save', async () => {
    givenPosting(stored({ filledCount: 1, startAt: new Date(Date.now() + 1 * HOUR) }));
    prismaMock.engagement.count.mockResolvedValue(1);
    await updateGigPosting(OWNER, ID, { title: 'Crew', description: 'Bring gloves.' });
    expect(prismaMock.gigPosting.updateMany.mock.calls[0][0].data).toEqual({ title: 'Crew', description: 'Bring gloves.' });
  });

  test('before any fill, a pay change inside 2 hours of the start still applies (FR-POST-11 criterion 1)', async () => {
    givenPosting(stored({ startAt: new Date(Date.now() + 1 * HOUR) }));
    await updateGigPosting(OWNER, ID, { payAmount: 7000 });
    expect(prismaMock.gigPosting.updateMany.mock.calls[0][0].data).toEqual({ payAmount: 7000 });
  });

  test('before any fill, category and location edits apply at once and pending applicants are told', async () => {
    givenPosting(stored());
    await updateGigPosting(OWNER, ID, { category: 'CLEANING', locationArea: 'Dehiwala' });
    expect(prismaMock.$transaction).not.toHaveBeenCalled();
    expect(prismaMock.engagement.count).not.toHaveBeenCalled();
    expect(notifyPendingApplicantsOfChange).toHaveBeenCalledWith(ID, ['category', 'locationAreaLabel']);
  });

  test('Workers needed cannot go below the places already filled', async () => {
    givenPosting(stored({ filledCount: 2 }));
    await expect(updateGigPosting(OWNER, ID, { workersNeeded: 1 })).rejects.toMatchObject({ status: 400 });
    expect(prismaMock.gigPosting.updateMany).not.toHaveBeenCalled();
  });
});
