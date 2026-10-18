// account.recoveryPurge.test.js
// FR-ACC-10 (batch E8) — rejected or completed recovery requests lose their identity details after
// 90 days; open and recently decided ones keep them. Prisma mocked.
import { jest } from '@jest/globals';

const prismaMock = { accountRecoveryRequest: { updateMany: jest.fn() } };
jest.unstable_mockModule('../../../lib/prisma.js', () => ({ default: prismaMock }));

const { purgeOldRecoveryRequests, PURGED } = await import('../recoveryPurge.js');

const NOW = new Date('2026-12-01T00:00:00Z');
const CUTOFF = new Date(NOW.getTime() - 90 * 24 * 60 * 60 * 1000);

beforeEach(() => {
  jest.resetAllMocks();
  prismaMock.accountRecoveryRequest.updateMany.mockResolvedValue({ count: 2 });
});

test('purges rejected requests reviewed, and completed ones finished, 90 or more days ago', async () => {
  await expect(purgeOldRecoveryRequests(NOW)).resolves.toBe(2);
  const { where, data } = prismaMock.accountRecoveryRequest.updateMany.mock.calls[0][0];
  expect(where.OR).toEqual([
    { status: 'REJECTED', reviewedAt: { lte: CUTOFF } },
    { completedAt: { lte: CUTOFF } },
  ]);
  expect(data).toEqual(PURGED);
});

test('open (awaiting review) and approved-but-unused requests are not matched', async () => {
  await purgeOldRecoveryRequests(NOW);
  const { where } = prismaMock.accountRecoveryRequest.updateMany.mock.calls[0][0];
  // Neither OR branch can match AWAITING_REVIEW, or an APPROVED request with no completedAt.
  expect(JSON.stringify(where)).not.toContain('AWAITING_REVIEW');
  expect(where.OR.some((c) => c.status === 'APPROVED')).toBe(false);
});

test('already-purged rows are skipped, so the count is only new purges', async () => {
  await purgeOldRecoveryRequests(NOW);
  expect(prismaMock.accountRecoveryRequest.updateMany.mock.calls[0][0].where.nicSubmittedEncrypted).toEqual({
    not: 'purged',
  });
});
