// notification.fanout.test.js
// FR-POST-10, FR-NOTIF-01, FR-NOTIF-02, FR-NOTIF-03, FR-NOTIF-08 — the gig notification fan-out,
// the preferences and the history query, with the Prisma client mocked so no database is needed.
//
// The posting sits at (7.00, 80.00). Youth browse centres due north of it: 0.01 degree of latitude
// is 1.1 km, so 7.04 is 4.4 km away (inside the 5 km radius) and 7.05 is 5.6 km (outside).
import { jest } from '@jest/globals';

const tx = {
  $queryRaw: jest.fn(),
  notification: { count: jest.fn(), create: jest.fn(), findFirst: jest.fn() },
};
const prismaMock = {
  gigPosting: { findUnique: jest.fn(), findMany: jest.fn() },
  user: { findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
  notification: { createMany: jest.fn(), findMany: jest.fn(), count: jest.fn(), updateMany: jest.fn() },
  $transaction: jest.fn(),
};
jest.unstable_mockModule('../../../lib/prisma.js', () => ({ default: prismaMock }));

const {
  default: service,
  notifyNewGigPosted,
  notifyUrgentGig,
  startOfColomboDay,
  URGENT_PUSH_DAILY_LIMIT,
} = await import('../notification.service.js');

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

function storedPosting(overrides = {}) {
  return {
    id: 'posting-1',
    status: 'OPEN',
    autoHiddenAt: null,
    title: 'Event setup crew (3 needed)',
    locationAreaLabel: 'Colombo 04',
    locationLat: 7.0,
    locationLng: 80.0,
    payKind: 'FIXED_TOTAL',
    payAmount: '6000',
    payRateUnit: null,
    workersNeeded: 3,
    isUrgent: false,
    startAt: new Date(Date.now() + 5 * DAY), // not urgent
    ...overrides,
  };
}

const urgentPosting = (overrides) => storedPosting({ startAt: new Date(Date.now() + 30 * HOUR), ...overrides });

/** Youth the database "finds" in the bounding box; the service still checks the exact distance. */
function givenYouth(...youth) {
  prismaMock.user.findMany.mockResolvedValue(youth);
}

/** Runs the urgent path's transaction callback against `tx`, as Prisma would. */
function givenTransactions({ pushedToday = 0, digest = null } = {}) {
  prismaMock.$transaction.mockImplementation((callback) => callback(tx));
  tx.$queryRaw.mockResolvedValue([]);
  tx.notification.count.mockResolvedValue(pushedToday);
  tx.notification.findFirst.mockResolvedValue(digest);
  tx.notification.create.mockImplementation(({ data }) =>
    Promise.resolve({ id: data.type === 'URGENT_DIGEST' ? 'digest-1' : 'row-1' }),
  );
}

let consoleError;
beforeEach(() => {
  jest.resetAllMocks();
  consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => consoleError.mockRestore());

describe('FR-POST-10 / FR-NOTIF-02: a non-urgent posting', () => {
  test('notifies every youth within 5 km of their last browse who has not opted out', async () => {
    prismaMock.gigPosting.findUnique.mockResolvedValue(storedPosting());
    givenYouth(
      { id: 'near', lastBrowseLat: 7.04, lastBrowseLng: 80.0 },
      { id: 'far', lastBrowseLat: 7.05, lastBrowseLng: 80.0 }, // in the box, outside the circle
    );
    prismaMock.notification.createMany.mockResolvedValue({ count: 1 });

    const result = await notifyNewGigPosted('posting-1');

    const { where } = prismaMock.user.findMany.mock.calls[0][0];
    expect(where).toMatchObject({
      role: 'YOUTH_JOB_SEEKER',
      accountStatus: 'ACTIVE',
      deletedAt: null,
      suspendedAt: null,
      notifyNewGigOptOut: false,
    });
    expect(where.notifyUrgentOptIn).toBeUndefined();

    const { data } = prismaMock.notification.createMany.mock.calls[0][0];
    expect(data).toHaveLength(1);
    expect(data[0]).toMatchObject({ userId: 'near', type: 'NEW_GIG', pushSentAt: expect.any(Date) });
    expect(data[0].payload).toMatchObject({
      gigPostingId: 'posting-1',
      title: 'Event setup crew (3 needed)',
      payAmount: 6000,
      payKind: 'FIXED_TOTAL',
      distanceKm: 4.4,
    });
    expect(result).toEqual({ notified: 1 });
  });

  test('only youth whose browse location is at most 30 days old are asked for', async () => {
    prismaMock.gigPosting.findUnique.mockResolvedValue(storedPosting());
    givenYouth();
    await notifyNewGigPosted('posting-1');

    const { lastBrowseAt } = prismaMock.user.findMany.mock.calls[0][0].where;
    const age = Date.now() - lastBrowseAt.gte.getTime();
    expect(age).toBeGreaterThan(30 * DAY - 1000);
    expect(age).toBeLessThan(30 * DAY + 1000);
  });

  test('nobody nearby: no rows and nothing written', async () => {
    prismaMock.gigPosting.findUnique.mockResolvedValue(storedPosting());
    givenYouth();
    expect(await notifyNewGigPosted('posting-1')).toEqual({ notified: 0 });
    expect(prismaMock.notification.createMany).not.toHaveBeenCalled();
  });

  test('a posting that is not OPEN, or missing, notifies nobody', async () => {
    prismaMock.gigPosting.findUnique.mockResolvedValue(storedPosting({ status: 'WITHDRAWN' }));
    expect(await notifyNewGigPosted('posting-1')).toEqual({ notified: 0 });
    prismaMock.gigPosting.findUnique.mockResolvedValue(null);
    expect(await notifyNewGigPosted('posting-1')).toEqual({ notified: 0 });
    expect(prismaMock.user.findMany).not.toHaveBeenCalled();
  });
});

describe('FR-POST-10 / FR-NOTIF-01: an urgent posting', () => {
  test('only opted-in youth within radius are asked for, and each gets a push', async () => {
    prismaMock.gigPosting.findUnique.mockResolvedValue(urgentPosting());
    givenYouth({ id: 'near', lastBrowseLat: 7.04, lastBrowseLng: 80.0 });
    givenTransactions({ pushedToday: 0 });

    const result = await notifyNewGigPosted('posting-1');

    const { where } = prismaMock.user.findMany.mock.calls[0][0];
    expect(where.notifyUrgentOptIn).toBe(true);
    expect(where.notifyNewGigOptOut).toBeUndefined();
    expect(tx.notification.create).toHaveBeenCalledTimes(1);
    expect(tx.notification.create.mock.calls[0][0].data).toMatchObject({
      userId: 'near',
      type: 'URGENT_GIG',
      pushSentAt: expect.any(Date),
    });
    expect(result).toEqual({ notified: 1 });
  });

  test('urgency comes from the start time, not the stored flag (FR-POST-07)', async () => {
    prismaMock.gigPosting.findUnique.mockResolvedValue(urgentPosting({ isUrgent: false }));
    givenYouth();
    await notifyNewGigPosted('posting-1');
    expect(prismaMock.user.findMany.mock.calls[0][0].where.notifyUrgentOptIn).toBe(true);
  });

  test('one youth failing does not stop the others, and nothing is thrown', async () => {
    prismaMock.gigPosting.findUnique.mockResolvedValue(urgentPosting());
    givenYouth(
      { id: 'a', lastBrowseLat: 7.01, lastBrowseLng: 80.0 },
      { id: 'b', lastBrowseLat: 7.02, lastBrowseLng: 80.0 },
    );
    givenTransactions();
    prismaMock.$transaction
      .mockImplementationOnce(() => Promise.reject(new Error('deadlock')))
      .mockImplementationOnce((callback) => callback(tx));

    expect(await notifyNewGigPosted('posting-1')).toEqual({ notified: 1 });
    expect(consoleError).toHaveBeenCalled();
  });
});

describe('FR-NOTIF-01: five pushes a day, then one digest', () => {
  const payload = { gigPostingId: 'posting-1', title: 'Gig' };

  test(`the ${URGENT_PUSH_DAILY_LIMIT}th urgent gig of the day is still pushed`, async () => {
    givenTransactions({ pushedToday: URGENT_PUSH_DAILY_LIMIT - 1 });
    expect(await notifyUrgentGig('youth-1', payload)).toBe('pushed');
    expect(tx.notification.findFirst).not.toHaveBeenCalled();
  });

  test('the 6th starts the day’s digest and is batched into it, not pushed', async () => {
    givenTransactions({ pushedToday: URGENT_PUSH_DAILY_LIMIT, digest: null });
    expect(await notifyUrgentGig('youth-1', payload)).toBe('batched');

    const [digestCall, gigCall] = tx.notification.create.mock.calls.map(([args]) => args.data);
    expect(digestCall).toMatchObject({ userId: 'youth-1', type: 'URGENT_DIGEST', pushSentAt: expect.any(Date) });
    expect(gigCall).toMatchObject({ userId: 'youth-1', type: 'URGENT_GIG', batchedDigestId: 'digest-1' });
    expect(gigCall.pushSentAt).toBeUndefined();
  });

  test('the 7th joins the existing digest — still one digest a day', async () => {
    givenTransactions({ pushedToday: URGENT_PUSH_DAILY_LIMIT, digest: { id: 'digest-9' } });
    await notifyUrgentGig('youth-1', payload);

    expect(tx.notification.create).toHaveBeenCalledTimes(1);
    expect(tx.notification.create.mock.calls[0][0].data).toMatchObject({ batchedDigestId: 'digest-9' });
  });

  test('the count is taken under a row lock on the youth (SELECT … FOR UPDATE)', async () => {
    givenTransactions();
    await notifyUrgentGig('youth-1', payload);
    const sql = tx.$queryRaw.mock.calls[0][0].join('?');
    expect(sql).toMatch(/FOR UPDATE/);
    expect(tx.$queryRaw.mock.calls[0][1]).toBe('youth-1');
  });

  test('only today’s pushes count, "today" being the Colombo calendar day', async () => {
    const now = new Date('2026-10-06T20:00:00Z'); // 01:30 on 7 Oct in Colombo
    givenTransactions();
    await notifyUrgentGig('youth-1', payload, now);

    const { where } = tx.notification.count.mock.calls[0][0];
    expect(where).toMatchObject({ type: 'URGENT_GIG', pushSentAt: { not: null } });
    expect(where.createdAt.gte.toISOString()).toBe('2026-10-06T18:30:00.000Z');
    expect(startOfColomboDay(new Date('2026-10-06T18:29:00Z')).toISOString()).toBe('2026-10-05T18:30:00.000Z');
  });
});

describe('notifyNewGigPosted never throws into the posting module', () => {
  test('a database failure is logged and reported as nobody notified', async () => {
    prismaMock.gigPosting.findUnique.mockRejectedValue(new Error('connection lost'));
    await expect(notifyNewGigPosted('posting-1')).resolves.toEqual({ notified: 0 });
    expect(consoleError).toHaveBeenCalled();
  });

  test('also accepts the older { gigPostingId } argument', async () => {
    prismaMock.gigPosting.findUnique.mockResolvedValue(null);
    await notifyNewGigPosted({ gigPostingId: 'posting-7' });
    expect(prismaMock.gigPosting.findUnique).toHaveBeenCalledWith({ where: { id: 'posting-7' } });
  });
});

describe('FR-NOTIF-03: preferences', () => {
  const worker = { id: 'youth-1', role: 'YOUTH_JOB_SEEKER' };

  test('employers and verifiers have none (403)', async () => {
    await expect(service.getPreferences({ user: { id: 'e', role: 'EMPLOYER' } })).rejects.toMatchObject({ status: 403 });
    await expect(
      service.updatePreferences({ user: { id: 'v', role: 'COMMUNITY_ENDORSER' }, notifyUrgentOptIn: true }),
    ).rejects.toMatchObject({ status: 403 });
  });

  test('each toggle changes on its own', async () => {
    prismaMock.user.update.mockResolvedValue({ notifyUrgentOptIn: true, notifyNewGigOptOut: false });
    await service.updatePreferences({ user: worker, notifyUrgentOptIn: true });
    expect(prismaMock.user.update.mock.calls[0][0].data).toEqual({ notifyUrgentOptIn: true });
  });

  test('a value that is not true/false is a 400; an empty change is a 400', async () => {
    await expect(service.updatePreferences({ user: worker, notifyNewGigOptOut: 'yes' })).rejects.toMatchObject({
      status: 400,
      fields: { notifyNewGigOptOut: expect.any(String) },
    });
    await expect(service.updatePreferences({ user: worker })).rejects.toMatchObject({ status: 400 });
  });
});

describe('FR-NOTIF-08: the history', () => {
  test('shows 30 days (90 for warnings), and batched gigs only inside their digest', async () => {
    prismaMock.notification.findMany.mockResolvedValue([
      { id: 'd', type: 'URGENT_DIGEST', batchedItems: [{ id: 'g7' }, { id: 'g6' }] },
      { id: 'n', type: 'NEW_GIG', batchedItems: [] },
    ]);
    const now = new Date('2026-10-06T12:00:00Z');
    const rows = await service.getNotifications({ userId: 'youth-1', now });

    const { where } = prismaMock.notification.findMany.mock.calls[0][0];
    expect(where.userId).toBe('youth-1');
    expect(where.batchedDigestId).toBeNull();
    expect(where.OR[0].createdAt.gte.toISOString()).toBe('2026-09-06T12:00:00.000Z');
    expect(where.OR[1]).toMatchObject({ type: 'WARNING_RECORDED' });
    expect(where.OR[1].createdAt.gte.toISOString()).toBe('2026-07-08T12:00:00.000Z');

    expect(rows[0]).toEqual({ id: 'd', type: 'URGENT_DIGEST', children: [{ id: 'g7' }, { id: 'g6' }] });
    expect(rows[1]).toEqual({ id: 'n', type: 'NEW_GIG' });
  });

  test('rows from other modules that only carry a gigPostingId get the posting title, in one query', async () => {
    prismaMock.notification.findMany.mockResolvedValue([
      { id: 'a', type: 'APPLICATION_SELECTED', payload: { gigPostingId: 'p1' }, batchedItems: [] },
      { id: 'b', type: 'APPLICATION_DECLINED', payload: { gigPostingId: 'p1' }, batchedItems: [] },
      { id: 'c', type: 'NEW_GIG', payload: { gigPostingId: 'p2', title: 'Own title' }, batchedItems: [] },
    ]);
    prismaMock.gigPosting.findMany.mockResolvedValue([{ id: 'p1', title: 'Shop assistant — weekend' }]);

    const rows = await service.getNotifications({ userId: 'youth-1' });

    expect(prismaMock.gigPosting.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.gigPosting.findMany.mock.calls[0][0].where).toEqual({ id: { in: ['p1'] } });
    expect(rows.map((r) => r.gigTitle)).toEqual(['Shop assistant — weekend', 'Shop assistant — weekend', undefined]);
  });

  test('marking someone else’s notification read is a 404', async () => {
    prismaMock.notification.updateMany.mockResolvedValue({ count: 0 });
    prismaMock.notification.count.mockResolvedValue(0);
    await expect(service.markAsRead({ notificationId: 'x', userId: 'youth-1' })).rejects.toMatchObject({ status: 404 });
  });
});
