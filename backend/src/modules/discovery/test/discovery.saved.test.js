// discovery.saved.test.js
// FR-DISC-06 (saved gigs, 3.8) — bookmark, un-bookmark, and the saved list keeping a posting that
// no longer appears in Browse. Prisma mocked.
import { jest } from '@jest/globals';

const prismaMock = {
  gigPosting: { findUnique: jest.fn() },
  savedGig: { upsert: jest.fn(), deleteMany: jest.fn(), findUnique: jest.fn(), findMany: jest.fn() },
  user: { findUnique: jest.fn() },
};
jest.unstable_mockModule('../../../lib/prisma.js', () => ({ default: prismaMock }));

const { saveGig, unsaveGig, isSaved, listSaved, savedStatus } = await import('../discovery.saved.js');

const NOW = new Date('2026-08-31T04:00:00Z');

function posting(overrides = {}) {
  return {
    id: 'p1',
    title: 'Café service crew — evenings',
    category: 'FOOD_SERVICE',
    arrangementType: 'GIG',
    payKind: 'FIXED_TOTAL',
    payAmount: 6000,
    payRateUnit: null,
    workersNeeded: 2,
    filledCount: 0,
    startAt: new Date('2026-09-04T12:30:00Z'),
    createdAt: new Date('2026-08-26T00:00:00Z'),
    expiresAt: new Date('2026-09-04T12:30:00Z'),
    status: 'OPEN',
    locationAreaLabel: 'Nugegoda',
    locationLat: 6.8649,
    locationLng: 79.8997,
    ...overrides,
  };
}

beforeEach(() => jest.resetAllMocks());

describe('FR-DISC-06: bookmarking', () => {
  test('saving a posting upserts one row — saving twice is harmless', async () => {
    prismaMock.gigPosting.findUnique.mockResolvedValue({ id: 'p1' });
    await expect(saveGig({ userId: 'u1', gigPostingId: 'p1' })).resolves.toEqual({ saved: true });
    expect(prismaMock.savedGig.upsert).toHaveBeenCalledWith({
      where: { userId_gigPostingId: { userId: 'u1', gigPostingId: 'p1' } },
      create: { userId: 'u1', gigPostingId: 'p1' },
      update: {},
    });
  });

  test('saving a posting that does not exist is a 404', async () => {
    prismaMock.gigPosting.findUnique.mockResolvedValue(null);
    await expect(saveGig({ userId: 'u1', gigPostingId: 'nope' })).rejects.toMatchObject({ status: 404 });
  });

  test("un-saving removes only the caller's row", async () => {
    await expect(unsaveGig({ userId: 'u1', gigPostingId: 'p1' })).resolves.toEqual({ saved: false });
    expect(prismaMock.savedGig.deleteMany).toHaveBeenCalledWith({ where: { userId: 'u1', gigPostingId: 'p1' } });
  });

  test('isSaved reports the bookmark state', async () => {
    prismaMock.savedGig.findUnique.mockResolvedValue({ id: 's1' });
    await expect(isSaved({ userId: 'u1', gigPostingId: 'p1' })).resolves.toEqual({ saved: true });
  });
});

describe('FR-DISC-06: the saved list', () => {
  test('a saved posting appears even when it no longer appears in Browse (expired), as a dead row', async () => {
    prismaMock.savedGig.findMany.mockResolvedValue([
      { savedAt: NOW, gigPosting: posting({ id: 'dead', status: 'EXPIRED' }) },
      { savedAt: NOW, gigPosting: posting() },
    ]);
    prismaMock.user.findUnique.mockResolvedValue({ lastBrowseLat: 6.8649, lastBrowseLng: 79.8997 });
    const rows = await listSaved({ userId: 'u1', now: NOW });
    expect(rows.map((r) => [r.id, r.status, r.live])).toEqual([
      ['dead', 'EXPIRED', false],
      ['p1', 'OPEN', true],
    ]);
  });

  test('the list is not filtered by radius, status or expiry', async () => {
    prismaMock.savedGig.findMany.mockResolvedValue([]);
    prismaMock.user.findUnique.mockResolvedValue(null);
    await listSaved({ userId: 'u1', now: NOW });
    expect(prismaMock.savedGig.findMany.mock.calls[0][0].where).toEqual({ userId: 'u1' });
  });

  test('FR-POST-08: a saved card never carries the address or exact coordinates', async () => {
    prismaMock.savedGig.findMany.mockResolvedValue([{ savedAt: NOW, gigPosting: posting() }]);
    prismaMock.user.findUnique.mockResolvedValue({ lastBrowseLat: 6.9, lastBrowseLng: 79.9 });
    const [row] = await listSaved({ userId: 'u1', now: NOW });
    expect(row).not.toHaveProperty('locationLat');
    expect(row).not.toHaveProperty('locationAddress');
    expect(typeof row.distanceKm).toBe('number');
  });

  test('without a browse centre there is no distance', async () => {
    prismaMock.savedGig.findMany.mockResolvedValue([{ savedAt: NOW, gigPosting: posting() }]);
    prismaMock.user.findUnique.mockResolvedValue({ lastBrowseLat: null, lastBrowseLng: null });
    const [row] = await listSaved({ userId: 'u1', now: NOW });
    expect(row.distanceKm).toBeNull();
  });

  test('an Open posting past its expiry reads Expired before the sweep catches up', () => {
    expect(savedStatus(posting({ expiresAt: new Date(NOW.getTime() - 1000) }), NOW)).toBe('EXPIRED');
    expect(savedStatus(posting({ status: 'FILLED' }), NOW)).toBe('FILLED');
  });
});
