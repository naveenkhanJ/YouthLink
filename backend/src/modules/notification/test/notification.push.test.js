// notification.push.test.js
// Real push delivery (added 2026-10-18): what each push says (FR-NOTIF-08's A11 table — the push
// and its history row say the same thing), which channel it uses (FR-NOTIF-10), which rows are
// pushed at all (FR-NOTIF-01's digest rule), and the outbox sweep that sends them (stale rows,
// inactive accounts, no devices, dead tokens). Prisma and FCM are mocked.
import { jest } from '@jest/globals';

const prismaMock = {
  notification: { findMany: jest.fn(), updateMany: jest.fn() },
  deviceToken: { findMany: jest.fn(), deleteMany: jest.fn(), upsert: jest.fn() },
  gigPosting: { findUnique: jest.fn() },
};
jest.unstable_mockModule('../../../lib/prisma.js', () => ({ default: prismaMock }));

const { pushContent, CHANNEL_URGENT, CHANNEL_REGULAR } = await import('../notification.push.js');
const {
  isPushable,
  dispatchPendingPushes,
  setMessagingClientForTests,
  registerDeviceToken,
  unregisterDeviceToken,
} = await import('../notification.sender.js');

const NOW = new Date('2026-08-27T14:30:00Z'); // Thu 27 Aug 2026, 8:00 PM in Colombo

const gig = {
  gigPostingId: 'p1',
  title: 'Event setup crew (3 needed)',
  payKind: 'FIXED_TOTAL',
  payAmount: 6000,
  payRateUnit: null,
  startAt: '2026-08-28T23:30:00Z', // Sat 29 Aug, 5:00 AM Colombo
  distanceKm: 4.5,
};

describe('FR-NOTIF-08/10: what a push says and how it arrives', () => {
  test('an urgent gig reads as drawn on 3.13, on the urgent channel', () => {
    expect(pushContent({ type: 'URGENT_GIG', payload: gig }, { now: NOW })).toEqual({
      title: 'Urgent gig near you',
      body: 'Event setup crew (3 needed) · Rs 6,000 for the job · 4.5 km · starts Sat 5:00 AM',
      channelId: CHANNEL_URGENT,
    });
  });

  test('a regular new gig writes the date out and uses the regular channel', () => {
    const content = pushContent(
      {
        type: 'NEW_GIG',
        payload: { ...gig, title: 'Grade 8 maths tutoring', payKind: 'RATE', payAmount: 1800, payRateUnit: 'DAY', startAt: '2026-09-07T10:30:00Z', distanceKm: 3.6 },
      },
      { now: NOW },
    );
    expect(content).toEqual({
      title: 'New gig near you',
      body: 'Grade 8 maths tutoring · Rs 1,800 per day · 3.6 km · starts Mon 7 Sep 2026, 4:00 PM',
      channelId: CHANNEL_REGULAR,
    });
  });

  test('urgent and regular gig pushes never share a channel (FR-NOTIF-10)', () => {
    expect(CHANNEL_URGENT).not.toBe(CHANNEL_REGULAR);
  });

  test('the urgent digest counts the gigs batched into it', () => {
    expect(pushContent({ type: 'URGENT_DIGEST', payload: {} }, { digestCount: 1 }).title).toBe('1 more urgent gig today');
    expect(pushContent({ type: 'URGENT_DIGEST', payload: {} }, { digestCount: 3 }).channelId).toBe(CHANNEL_URGENT);
  });

  test("other modules' rows use A11's titles with the posting's title", () => {
    expect(pushContent({ type: 'APPLICATION_SELECTED', payload: {} }, { postingTitle: 'Stage crew' }).title).toBe(
      "You're selected for Stage crew",
    );
    expect(pushContent({ type: 'NO_APPLICANT_NUDGE', payload: { postingTitle: 'House move helpers' } })).toEqual({
      title: 'No applicants yet on House move helpers',
      body: 'Still no applicants after 24 hours. Consider reviewing the pay or details.',
      channelId: CHANNEL_REGULAR,
    });
  });

  test('endorsement rows name the person (FR-NOTIF-07)', () => {
    expect(pushContent({ type: 'ENDORSEMENT_RECEIVED', payload: { endorserName: 'Sunil Bandara' } }).title).toBe(
      'Sunil Bandara vouched for you',
    );
    expect(pushContent({ type: 'ENDORSEMENT_REVOKED', payload: { endorserName: 'Sunil Bandara' } }).body).toBe(
      "Sunil Bandara's endorsement no longer shows on your profile · work you already got isn't affected",
    );
    expect(pushContent({ type: 'ENDORSEMENT_PAYOFF', payload: { workerName: 'Kavindu Perera' } }).body).toBe(
      'Kavindu Perera went on to build a good rating.',
    );
  });

  test('a row that cannot be worded is left to the history (null)', () => {
    expect(pushContent({ type: 'APPLICATION_SELECTED', payload: {} })).toBeNull();
    expect(pushContent({ type: 'NOT_A_TYPE', payload: {} })).toBeNull();
  });
});

describe('FR-NOTIF-01: which rows are pushed', () => {
  test('a batched urgent gig (no pushSentAt) is not pushed on its own; the digest is', () => {
    expect(isPushable({ userId: 'u', type: 'URGENT_GIG', pushSentAt: null })).toBe(false);
    expect(isPushable({ userId: 'u', type: 'URGENT_GIG', pushSentAt: NOW })).toBe(true);
    expect(isPushable({ userId: 'u', type: 'URGENT_DIGEST', pushSentAt: NOW })).toBe(true);
  });

  test('staff rows are never pushed to a phone', () => {
    expect(isPushable({ userId: null, type: 'NEW_DISPUTE_CASE' })).toBe(false);
  });

  test('every other user row is pushed', () => {
    expect(isPushable({ userId: 'u', type: 'APPLICATION_RECEIVED', pushSentAt: null })).toBe(true);
  });
});

describe('the push sweep', () => {
  const fcm = { sendEachForMulticast: jest.fn() };

  function row(overrides = {}) {
    return {
      id: 'n1',
      userId: 'youth-1',
      type: 'URGENT_GIG',
      payload: gig,
      pushSentAt: NOW,
      createdAt: new Date(NOW.getTime() - 1000),
      _count: { batchedItems: 0 },
      user: { accountStatus: 'ACTIVE', deletedAt: null, suspendedAt: null },
      ...overrides,
    };
  }

  beforeEach(() => {
    jest.resetAllMocks();
    setMessagingClientForTests(fcm);
    prismaMock.notification.updateMany.mockResolvedValue({ count: 1 });
    prismaMock.deviceToken.findMany.mockResolvedValue([{ token: 'tok-a' }, { token: 'tok-b' }]);
    fcm.sendEachForMulticast.mockResolvedValue({ successCount: 2, responses: [{ success: true }, { success: true }] });
  });

  test('sends a pending row to every device of the person, on its channel, and stamps it first', async () => {
    prismaMock.notification.findMany.mockResolvedValue([row()]);
    const result = await dispatchPendingPushes(NOW);
    expect(result).toEqual({ sent: 1, skipped: 0 });
    expect(prismaMock.notification.updateMany).toHaveBeenCalledWith({
      where: { id: 'n1', pushDispatchedAt: null },
      data: { pushDispatchedAt: NOW },
    });
    const message = fcm.sendEachForMulticast.mock.calls[0][0];
    expect(message.tokens).toEqual(['tok-a', 'tok-b']);
    expect(message.android).toEqual({ priority: 'high', notification: { channelId: 'urgent_gigs', tag: 'n1' } });
    expect(message.data).toMatchObject({ notificationId: 'n1', type: 'URGENT_GIG' });
    expect(JSON.parse(message.data.payload)).toMatchObject({ gigPostingId: 'p1' });
  });

  test('a row another sweep already claimed is not sent twice', async () => {
    prismaMock.notification.findMany.mockResolvedValue([row()]);
    prismaMock.notification.updateMany.mockResolvedValue({ count: 0 });
    await dispatchPendingPushes(NOW);
    expect(fcm.sendEachForMulticast).not.toHaveBeenCalled();
  });

  test('a stale row (older than 10 minutes) is stamped but not sent', async () => {
    prismaMock.notification.findMany.mockResolvedValue([row({ createdAt: new Date(NOW.getTime() - 11 * 60 * 1000) })]);
    expect(await dispatchPendingPushes(NOW)).toEqual({ sent: 0, skipped: 1 });
    expect(fcm.sendEachForMulticast).not.toHaveBeenCalled();
  });

  test('a suspended account gets no push', async () => {
    prismaMock.notification.findMany.mockResolvedValue([row({ user: { accountStatus: 'ACTIVE', deletedAt: null, suspendedAt: NOW } })]);
    expect(await dispatchPendingPushes(NOW)).toEqual({ sent: 0, skipped: 1 });
  });

  test('FR-NOTIF-09: no registered device (permission denied) — skipped, the row stays in the history', async () => {
    prismaMock.notification.findMany.mockResolvedValue([row()]);
    prismaMock.deviceToken.findMany.mockResolvedValue([]);
    expect(await dispatchPendingPushes(NOW)).toEqual({ sent: 0, skipped: 1 });
    expect(fcm.sendEachForMulticast).not.toHaveBeenCalled();
  });

  test('tokens FCM reports as unregistered are deleted', async () => {
    prismaMock.notification.findMany.mockResolvedValue([row()]);
    fcm.sendEachForMulticast.mockResolvedValue({
      successCount: 1,
      responses: [{ success: true }, { success: false, error: { code: 'messaging/registration-token-not-registered' } }],
    });
    await dispatchPendingPushes(NOW);
    expect(prismaMock.deviceToken.deleteMany).toHaveBeenCalledWith({ where: { token: { in: ['tok-b'] } } });
  });

  test("a row that stored only the posting's id gets its current title", async () => {
    prismaMock.notification.findMany.mockResolvedValue([row({ type: 'APPLICATION_SELECTED', payload: { gigPostingId: 'p1' } })]);
    prismaMock.gigPosting.findUnique.mockResolvedValue({ title: 'Stage crew' });
    await dispatchPendingPushes(NOW);
    expect(fcm.sendEachForMulticast.mock.calls[0][0].notification.title).toBe("You're selected for Stage crew");
  });

  test('an FCM failure is logged, not thrown, and the sweep carries on', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    prismaMock.notification.findMany.mockResolvedValue([row(), row({ id: 'n2' })]);
    fcm.sendEachForMulticast.mockRejectedValueOnce(new Error('network')).mockResolvedValueOnce({ successCount: 1, responses: [{ success: true }] });
    expect(await dispatchPendingPushes(NOW)).toEqual({ sent: 1, skipped: 0 });
    spy.mockRestore();
  });
});

describe('device tokens', () => {
  beforeEach(() => jest.resetAllMocks());

  test('registering moves a token to whoever is signed in now', async () => {
    await registerDeviceToken({ userId: 'u2', token: 'tok' });
    expect(prismaMock.deviceToken.upsert).toHaveBeenCalledWith({
      where: { token: 'tok' },
      create: { userId: 'u2', token: 'tok' },
      update: { userId: 'u2' },
    });
  });

  test("signing out removes only the caller's own token", async () => {
    await unregisterDeviceToken({ userId: 'u1', token: 'tok' });
    expect(prismaMock.deviceToken.deleteMany).toHaveBeenCalledWith({ where: { token: 'tok', userId: 'u1' } });
  });

  test('an empty token is refused with 400', async () => {
    await expect(registerDeviceToken({ userId: 'u1', token: '' })).rejects.toMatchObject({ status: 400 });
  });
});
