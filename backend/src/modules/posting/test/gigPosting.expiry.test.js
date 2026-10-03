// gigPosting.expiry.test.js
// FR-POST-13 (posting expiry) — the expiry sweep, with Prisma and the applicants seam mocked
// so no database is needed.
import { jest } from '@jest/globals';

const prismaMock = { $queryRaw: jest.fn() };
jest.unstable_mockModule('../../../lib/prisma.js', () => ({ default: prismaMock }));
const resolvePendingApplicants = jest.fn();
jest.unstable_mockModule('../posting.applicants.js', () => ({ resolvePendingApplicants }));

const { expireDuePostings, startPostingExpirySweep } = await import('../posting.expiry.js');

beforeEach(() => jest.resetAllMocks());

describe('FR-POST-13: expireDuePostings', () => {
  test("returns the ids the statement expired and resolves each one's Pending applicants once", async () => {
    prismaMock.$queryRaw.mockResolvedValue([{ id: 'a' }, { id: 'b' }]);

    await expect(expireDuePostings()).resolves.toEqual(['a', 'b']);

    expect(resolvePendingApplicants).toHaveBeenCalledTimes(2);
    expect(resolvePendingApplicants).toHaveBeenCalledWith('a', 'EXPIRED');
    expect(resolvePendingApplicants).toHaveBeenCalledWith('b', 'EXPIRED');
  });

  test('returns [] and resolves nobody when nothing is due', async () => {
    prismaMock.$queryRaw.mockResolvedValue([]);

    await expect(expireDuePostings()).resolves.toEqual([]);
    expect(resolvePendingApplicants).not.toHaveBeenCalled();
  });

  test('the sweep timer never keeps the process alive', () => {
    const timer = startPostingExpirySweep(60_000);
    expect(timer.hasRef()).toBe(false);
    clearInterval(timer);
  });
});
