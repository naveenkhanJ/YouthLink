// gigPosting.nudge.test.js
// FR-POST-17 (no-applicant nudge) — when it is due, and that the sweep sends it once, with Prisma
// mocked so no database is needed.
import { jest } from '@jest/globals';

const prismaMock = {
  $transaction: jest.fn(),
  gigPosting: { findMany: jest.fn(), updateMany: jest.fn() },
  notification: { create: jest.fn() },
};
jest.unstable_mockModule('../../../lib/prisma.js', () => ({ default: prismaMock }));

const { nudgeDueAt, sendDueNudges, startNoApplicantNudgeSweep } = await import('../posting.nudge.js');

const HOUR = 60 * 60 * 1000;
const POSTED = new Date('2026-08-27T02:00:00Z');

beforeEach(() => {
  jest.resetAllMocks();
  prismaMock.$transaction.mockImplementation((fn) => fn(prismaMock));
  prismaMock.gigPosting.updateMany.mockResolvedValue({ count: 1 });
});

describe('FR-POST-17: nudgeDueAt', () => {
  test('a regular posting is nudged at 24 hours live', () => {
    const posting = { createdAt: POSTED, startAt: new Date(POSTED.getTime() + 10 * 24 * HOUR) };
    expect(nudgeDueAt(posting)).toEqual(new Date(POSTED.getTime() + 24 * HOUR));
  });

  test('an urgent posting is nudged halfway between posting and its start', () => {
    const posting = { createdAt: POSTED, startAt: new Date(POSTED.getTime() + 30 * HOUR) };
    expect(nudgeDueAt(posting)).toEqual(new Date(POSTED.getTime() + 15 * HOUR));
  });
});

describe('FR-POST-17: sendDueNudges', () => {
  const regular = {
    id: 'p1',
    title: 'House move helpers',
    employerId: 'emp-1',
    createdAt: POSTED,
    startAt: new Date(POSTED.getTime() + 5 * 24 * HOUR),
  };

  test('only live postings with no application at all are considered', async () => {
    prismaMock.gigPosting.findMany.mockResolvedValue([]);
    await sendDueNudges(new Date(POSTED.getTime() + 25 * HOUR));
    const { where } = prismaMock.gigPosting.findMany.mock.calls[0][0];
    expect(where).toMatchObject({
      status: 'OPEN',
      autoHiddenAt: null,
      noApplicantNudgeSentAt: null,
      applications: { none: {} },
    });
  });

  test('a regular gig with zero applicants at 24 hours: the employer gets NO_APPLICANT_NUDGE', async () => {
    prismaMock.gigPosting.findMany.mockResolvedValue([regular]);
    await expect(sendDueNudges(new Date(POSTED.getTime() + 25 * HOUR))).resolves.toEqual(['p1']);
    expect(prismaMock.notification.create).toHaveBeenCalledWith({
      data: {
        userId: 'emp-1',
        type: 'NO_APPLICANT_NUDGE',
        payload: { gigPostingId: 'p1', postingTitle: 'House move helpers' },
      },
    });
  });

  test('before 24 hours nothing is sent', async () => {
    prismaMock.gigPosting.findMany.mockResolvedValue([regular]);
    await expect(sendDueNudges(new Date(POSTED.getTime() + 23 * HOUR))).resolves.toEqual([]);
    expect(prismaMock.notification.create).not.toHaveBeenCalled();
  });

  test('an urgent gig at its halfway point with zero applicants is nudged', async () => {
    const urgent = { ...regular, id: 'p2', startAt: new Date(POSTED.getTime() + 30 * HOUR) };
    prismaMock.gigPosting.findMany.mockResolvedValue([urgent]);
    await expect(sendDueNudges(new Date(POSTED.getTime() + 16 * HOUR))).resolves.toEqual(['p2']);
  });

  test('a posting another sweep already nudged (or that got an applicant) is not nudged again', async () => {
    prismaMock.gigPosting.findMany.mockResolvedValue([regular]);
    prismaMock.gigPosting.updateMany.mockResolvedValue({ count: 0 });
    await expect(sendDueNudges(new Date(POSTED.getTime() + 25 * HOUR))).resolves.toEqual([]);
    expect(prismaMock.notification.create).not.toHaveBeenCalled();
  });

  test('the sweep timer never keeps the process alive', () => {
    const timer = startNoApplicantNudgeSweep(60_000);
    expect(timer.hasRef()).toBe(false);
    clearInterval(timer);
  });
});
