// rating.service.test.js
// FR-RATE-01 (1–5 whole stars), FR-RATE-02 (double-blind: hidden until both rate or 14 days
// pass; submission closes at reveal) and FR-RATE-03 (completion rate, weighted, kept apart from
// the star rating) — the service rules, with the Prisma client mocked so no database is needed.
import { jest } from '@jest/globals';

const prismaMock = {
  $transaction: jest.fn(),
  $queryRaw: jest.fn(),
  engagement: { findUnique: jest.fn() },
  rating: {
    create: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    findUnique: jest.fn(),
    aggregate: jest.fn(),
  },
  notification: { createMany: jest.fn() },
  completionRecord: { findMany: jest.fn() },
};
jest.unstable_mockModule('../../../lib/prisma.js', () => ({ default: prismaMock }));

const {
  isValidScore,
  revealDeadline,
  revealState,
  revealedRatingsWhere,
  completionRateFromRecords,
  computeCompletionRate,
  getRatingSummary,
  getEngagementRatings,
  submitRating,
} = await import('../rating.service.js');

const DAY = 24 * 60 * 60 * 1000;
const WORKER = 'worker-1';
const EMPLOYER = 'employer-1';
const ENGAGEMENT_ID = 'eng-1';

/** An engagement as ENGAGEMENT_FOR_RATING selects it. */
function engagement({ openedDaysAgo = 1, ratings = [], status = 'COMPLETED' } = {}) {
  return {
    id: ENGAGEMENT_ID,
    workerId: WORKER,
    employerId: EMPLOYER,
    gigPostingId: 'posting-1',
    status,
    ratingOpenedAt: openedDaysAgo === null ? null : new Date(Date.now() - openedDaysAgo * DAY),
    gigPosting: { title: 'Shop assistant — weekend', postedAsType: 'BUSINESS', postedBusinessName: 'Saman Stores' },
    worker: { legalName: 'Kavindu Perera' },
    employer: { legalName: 'Saman Kumara' },
    ratings,
  };
}

function rating(raterId, score, revealedAt = null) {
  return {
    id: `rating-${raterId}`,
    raterId,
    rateeId: raterId === WORKER ? EMPLOYER : WORKER,
    score,
    submittedAt: new Date(),
    revealedAt,
    publicResponse: null,
  };
}

beforeEach(() => {
  jest.resetAllMocks();
  // Run the transaction callback against the same mock, as Prisma would with a tx client.
  prismaMock.$transaction.mockImplementation((fn) => fn(prismaMock));
  prismaMock.$queryRaw.mockResolvedValue([{ id: ENGAGEMENT_ID }]);
  prismaMock.rating.create.mockImplementation(({ data }) =>
    Promise.resolve({ id: 'new-rating', score: data.score, submittedAt: data.submittedAt }),
  );
});

describe('FR-RATE-01: isValidScore', () => {
  test('accepts the whole numbers 1 through 5', () => {
    for (const score of [1, 2, 3, 4, 5]) expect(isValidScore(score)).toBe(true);
  });

  test('refuses anything else: 0, 6, half stars, strings, booleans, missing', () => {
    for (const score of [0, 6, -1, 3.5, '3', true, null, undefined, NaN]) {
      expect(isValidScore(score)).toBe(false);
    }
  });
});

describe('FR-RATE-01: submitRating validation', () => {
  test('a half star is refused with 400 before the database is touched', async () => {
    await expect(submitRating({ engagementId: ENGAGEMENT_ID, userId: WORKER, score: 3.5 })).rejects.toMatchObject({
      status: 400,
    });
    expect(prismaMock.$transaction).not.toHaveBeenCalled();
  });

  test('a string "4" is refused, not coerced', async () => {
    await expect(submitRating({ engagementId: ENGAGEMENT_ID, userId: WORKER, score: '4' })).rejects.toMatchObject({
      status: 400,
    });
  });

  test('only the score is stored — no free-text field reaches the database', async () => {
    prismaMock.engagement.findUnique.mockResolvedValue(engagement());
    await submitRating({ engagementId: ENGAGEMENT_ID, userId: WORKER, score: 4, review: 'great' });
    const { data } = prismaMock.rating.create.mock.calls[0][0];
    expect(Object.keys(data).sort()).toEqual(
      ['engagementId', 'raterId', 'rateeId', 'revealedAt', 'score', 'submittedAt'].sort(),
    );
  });

  test('someone who is not a party gets 403', async () => {
    prismaMock.engagement.findUnique.mockResolvedValue(engagement());
    await expect(submitRating({ engagementId: ENGAGEMENT_ID, userId: 'stranger', score: 4 })).rejects.toMatchObject({
      status: 403,
    });
  });

  test('an engagement whose rating never opened (e.g. a no-show ruling) cannot be rated', async () => {
    prismaMock.engagement.findUnique.mockResolvedValue(engagement({ openedDaysAgo: null, status: 'ACTIVE' }));
    await expect(submitRating({ engagementId: ENGAGEMENT_ID, userId: WORKER, score: 4 })).rejects.toMatchObject({
      status: 409,
    });
  });

  test('a second rating by the same party is refused', async () => {
    prismaMock.engagement.findUnique.mockResolvedValue(engagement({ ratings: [rating(WORKER, 3)] }));
    await expect(submitRating({ engagementId: ENGAGEMENT_ID, userId: WORKER, score: 5 })).rejects.toMatchObject({
      status: 409,
      message: "You've already rated this engagement.",
    });
  });
});

describe('FR-RATE-02: the double-blind rule on submission', () => {
  test('the first rating is stored hidden (revealedAt null) and nothing is revealed', async () => {
    prismaMock.engagement.findUnique.mockResolvedValue(engagement());
    const result = await submitRating({ engagementId: ENGAGEMENT_ID, userId: WORKER, score: 3 });

    expect(result.revealed).toBe(false);
    expect(prismaMock.rating.create.mock.calls[0][0].data).toMatchObject({
      raterId: WORKER,
      rateeId: EMPLOYER,
      score: 3,
      revealedAt: null,
    });
    expect(prismaMock.rating.update).not.toHaveBeenCalled();
    expect(prismaMock.notification.createMany).not.toHaveBeenCalled();
  });

  test('the second rating reveals both at the same instant, and both parties are told', async () => {
    prismaMock.engagement.findUnique.mockResolvedValue(engagement({ ratings: [rating(WORKER, 3)] }));
    const result = await submitRating({ engagementId: ENGAGEMENT_ID, userId: EMPLOYER, score: 5 });

    expect(result.revealed).toBe(true);
    const created = prismaMock.rating.create.mock.calls[0][0].data;
    const updated = prismaMock.rating.update.mock.calls[0][0];
    expect(created.revealedAt).toBeInstanceOf(Date);
    expect(updated).toEqual({ where: { id: `rating-${WORKER}` }, data: { revealedAt: created.revealedAt } });

    const { data } = prismaMock.notification.createMany.mock.calls[0][0];
    expect(data.map((n) => n.userId).sort()).toEqual([EMPLOYER, WORKER].sort());
    expect(data.every((n) => n.type === 'RATING_REVEALED')).toBe(true);
  });

  test('the engagement row is locked before the decision is made', async () => {
    prismaMock.engagement.findUnique.mockResolvedValue(engagement());
    await submitRating({ engagementId: ENGAGEMENT_ID, userId: WORKER, score: 3 });
    const sql = prismaMock.$queryRaw.mock.calls[0][0].join('?');
    expect(sql).toMatch(/FOR UPDATE/);
    // The lock comes first: the engagement is read only after it.
    expect(prismaMock.$queryRaw.mock.invocationCallOrder[0]).toBeLessThan(
      prismaMock.engagement.findUnique.mock.invocationCallOrder[0],
    );
  });

  test('submission closes at reveal: after 14 days the non-submitter can no longer rate', async () => {
    prismaMock.engagement.findUnique.mockResolvedValue(
      engagement({ openedDaysAgo: 15, ratings: [rating(EMPLOYER, 1)] }),
    );
    await expect(submitRating({ engagementId: ENGAGEMENT_ID, userId: WORKER, score: 5 })).rejects.toMatchObject({
      status: 409,
    });
    expect(prismaMock.rating.create).not.toHaveBeenCalled();
  });

  test('the window closes at 14 days even when nobody has rated', async () => {
    prismaMock.engagement.findUnique.mockResolvedValue(engagement({ openedDaysAgo: 14 }));
    await expect(submitRating({ engagementId: ENGAGEMENT_ID, userId: WORKER, score: 4 })).rejects.toMatchObject({
      status: 409,
    });
  });
});

describe('FR-RATE-02: reveal timing (revealState, revealDeadline)', () => {
  const opened = new Date('2026-09-04T10:00:00Z');

  test('the deadline is ratingOpenedAt + 14 days (6.2: opened 4 Sep -> 18 Sep 2026)', () => {
    expect(revealDeadline(opened).toISOString()).toBe('2026-09-18T10:00:00.000Z');
    expect(revealDeadline(null)).toBeNull();
  });

  test('one rating, inside the window: hidden', () => {
    const state = revealState({ ratingOpenedAt: opened, ratings: [{ revealedAt: null }], now: new Date('2026-09-10') });
    expect(state).toMatchObject({ isOpen: true, revealed: false, windowClosed: false });
  });

  test('one rating, one millisecond before the deadline: still hidden', () => {
    const now = new Date(revealDeadline(opened).getTime() - 1);
    expect(revealState({ ratingOpenedAt: opened, ratings: [{ revealedAt: null }], now }).revealed).toBe(false);
  });

  test('one rating, at the deadline: revealed without any job having run', () => {
    const now = revealDeadline(opened);
    expect(revealState({ ratingOpenedAt: opened, ratings: [{ revealedAt: null }], now })).toMatchObject({
      revealed: true,
      windowClosed: true,
    });
  });

  test('both submitted: revealed at once, whatever the date', () => {
    const state = revealState({
      ratingOpenedAt: opened,
      ratings: [{ revealedAt: null }, { revealedAt: null }],
      now: new Date('2026-09-05'),
    });
    expect(state.revealed).toBe(true);
  });

  test('rating not opened: nothing is open or revealed', () => {
    expect(revealState({ ratingOpenedAt: null, ratings: [], now: new Date() })).toMatchObject({
      isOpen: false,
      revealed: false,
    });
  });

  test('aggregates count a closed-but-unrecorded window as revealed, and never a removed rating', () => {
    const now = new Date('2026-09-20T00:00:00Z');
    expect(revealedRatingsWhere(now)).toEqual({
      removedAt: null,
      OR: [
        { revealedAt: { not: null } },
        { engagement: { ratingOpenedAt: { lte: new Date('2026-09-06T00:00:00Z') } } },
      ],
    });
  });
});

describe('FR-RATE-02: what each party is shown (getEngagementRatings)', () => {
  test('while hidden, the other party is told nothing about the rating — not even that it exists', async () => {
    prismaMock.engagement.findUnique.mockResolvedValue(engagement({ ratings: [rating(EMPLOYER, 5)] }));
    const view = await getEngagementRatings({ engagementId: ENGAGEMENT_ID, userId: WORKER });
    expect(view.stage).toBe('OPEN');
    expect(view.canSubmit).toBe(true);
    expect(view.theirRating).toBeNull();
    expect(JSON.stringify(view)).not.toContain(`rating-${EMPLOYER}`);
  });

  test('the rater sees their own rating and the unlock date while waiting (6.2)', async () => {
    const eng = engagement({ ratings: [rating(WORKER, 3)] });
    prismaMock.engagement.findUnique.mockResolvedValue(eng);
    const view = await getEngagementRatings({ engagementId: ENGAGEMENT_ID, userId: WORKER });
    expect(view.stage).toBe('AWAITING_REVEAL');
    expect(view.myRating.score).toBe(3);
    expect(view.revealAt).toEqual(revealDeadline(eng.ratingOpenedAt));
    expect(view.counterpartyName).toBe('Saman Stores');
  });

  test('both rated: both see both scores', async () => {
    const both = [rating(WORKER, 3, new Date()), rating(EMPLOYER, 5, new Date())];
    prismaMock.engagement.findUnique.mockResolvedValue(engagement({ ratings: both }));

    const worker = await getEngagementRatings({ engagementId: ENGAGEMENT_ID, userId: WORKER });
    expect(worker).toMatchObject({ stage: 'REVEALED', myRating: { score: 3 }, theirRating: { score: 5 } });

    const employer = await getEngagementRatings({ engagementId: ENGAGEMENT_ID, userId: EMPLOYER });
    expect(employer).toMatchObject({ stage: 'REVEALED', myRating: { score: 5 }, theirRating: { score: 3 } });
    expect(employer.counterpartyName).toBe('Kavindu Perera');
  });

  test('after 14 days with one rating: it is revealed, written down at the deadline, and the non-submitter is closed out (6.1f / 6.3s)', async () => {
    const eng = engagement({ openedDaysAgo: 20, ratings: [rating(EMPLOYER, 1)] });
    prismaMock.engagement.findUnique.mockResolvedValue(eng);
    prismaMock.rating.updateMany.mockResolvedValue({ count: 1 });

    const view = await getEngagementRatings({ engagementId: ENGAGEMENT_ID, userId: WORKER });

    expect(view).toMatchObject({ stage: 'REVEALED', canSubmit: false, myRating: null, theirRating: { score: 1 } });
    expect(prismaMock.rating.updateMany).toHaveBeenCalledWith({
      where: { engagementId: ENGAGEMENT_ID, revealedAt: null },
      data: { revealedAt: revealDeadline(eng.ratingOpenedAt) },
    });
    expect(prismaMock.notification.createMany).toHaveBeenCalledTimes(1);
  });

  test('a concurrent read that finds the reveal already written sends no second notification', async () => {
    prismaMock.engagement.findUnique.mockResolvedValue(engagement({ openedDaysAgo: 20, ratings: [rating(EMPLOYER, 1)] }));
    prismaMock.rating.updateMany.mockResolvedValue({ count: 0 });
    await getEngagementRatings({ engagementId: ENGAGEMENT_ID, userId: WORKER });
    expect(prismaMock.notification.createMany).not.toHaveBeenCalled();
  });

  test('a stranger gets 403 and a missing engagement 404', async () => {
    prismaMock.engagement.findUnique.mockResolvedValueOnce(engagement());
    await expect(getEngagementRatings({ engagementId: ENGAGEMENT_ID, userId: 'stranger' })).rejects.toMatchObject({
      status: 403,
    });
    prismaMock.engagement.findUnique.mockResolvedValueOnce(null);
    await expect(getEngagementRatings({ engagementId: 'nope', userId: WORKER })).rejects.toMatchObject({ status: 404 });
  });
});

describe('FR-RATE-03: completion rate', () => {
  const completed = (n) => Array.from({ length: n }, () => ({ outcome: 'COMPLETED', weight: '1.00' }));

  test('no record at all: null, not 0% (zero history)', () => {
    expect(completionRateFromRecords([])).toEqual({ completionRate: null, jobCount: 0 });
  });

  test('12 completions and one early cancellation: 12 of 13 = 92% (prototype 4.5)', () => {
    const records = [...completed(12), { outcome: 'EARLY_CANCELLATION', weight: '1.00' }];
    expect(completionRateFromRecords(records)).toEqual({ completionRate: 92, jobCount: 12 });
  });

  test('a late cancellation weighs 2.0: 12 of 15 = 80% (prototype 1.18nc)', () => {
    const records = [
      ...completed(12),
      { outcome: 'EARLY_CANCELLATION', weight: '1.00' },
      { outcome: 'LATE_CANCELLATION', weight: '2.00' },
    ];
    expect(completionRateFromRecords(records)).toEqual({ completionRate: 80, jobCount: 12 });
  });

  test('a no-show ruling credits the reliable party and marks the other (FR-ADM-08)', () => {
    expect(completionRateFromRecords([{ outcome: 'NO_SHOW_RELIABLE_CREDIT', weight: 1 }]).completionRate).toBe(100);
    expect(completionRateFromRecords([{ outcome: 'NO_SHOW_UNRELIABLE_MARK', weight: 1 }]).completionRate).toBe(0);
  });

  test('computeCompletionRate reads only that person\'s ledger', async () => {
    prismaMock.completionRecord.findMany.mockResolvedValue(completed(3));
    await expect(computeCompletionRate(WORKER)).resolves.toEqual({ completionRate: 100, jobCount: 3 });
    expect(prismaMock.completionRecord.findMany).toHaveBeenCalledWith({
      where: { userId: WORKER },
      select: { outcome: true, weight: true },
    });
  });

  test('getRatingSummary keeps the star average and the completion rate as two separate figures', async () => {
    prismaMock.rating.aggregate.mockResolvedValue({ _avg: { score: 4.5833 }, _count: { _all: 12 } });
    prismaMock.completionRecord.findMany.mockResolvedValue([
      ...completed(12),
      { outcome: 'EARLY_CANCELLATION', weight: '1.00' },
    ]);
    await expect(getRatingSummary(WORKER)).resolves.toEqual({
      ratingAverage: 4.6,
      ratingCount: 12,
      completionRate: 92,
      jobCount: 12,
    });
    // The average counts revealed, non-removed ratings only.
    expect(prismaMock.rating.aggregate.mock.calls[0][0].where).toMatchObject({ rateeId: WORKER, removedAt: null });
  });
});
