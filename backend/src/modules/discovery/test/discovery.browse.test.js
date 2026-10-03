// discovery.browse.test.js
// FR-DISC-01..05 and FR-POST-08 — the browse query's rules, with the Prisma client mocked so no
// database is needed.
//
// Positions: the search centre is (7.00, 80.00) and every posting sits due north of it on a
// latitude with two decimals, so the coarse rounding (FR-POST-08) changes nothing and each
// distance is exact: 0.01 degree of latitude is 1.1 km.
//   7.01 → 1.1 km · 7.02 → 2.2 · 7.03 → 3.3 · 7.04 → 4.4 · 7.08 → 8.9 · 7.12 → 13.3
//   7.13 → 14.5 · 7.17 → 18.9 · 7.30 → 33.4 · 7.50 → 55.6 (outside 50 km)
import { jest } from '@jest/globals';

const prismaMock = {
  gigPosting: { findMany: jest.fn() },
  user: { update: jest.fn() },
};
jest.unstable_mockModule('../../../lib/prisma.js', () => ({ default: prismaMock }));

const { default: service, effectiveRadiusFor, nearestAreaName, resolveCentre, sortResults } = await import(
  '../discovery.service.js'
);

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
const YOUTH = { id: 'youth-1', role: 'YOUTH_JOB_SEEKER' };
const CENTRE = { lat: 7.0, lng: 80.0 };

let nextId = 1;
/** A stored posting `lat` degrees north of the centre, starting in a week unless told otherwise. */
function posting(lat, overrides = {}) {
  const id = `posting-${nextId++}`;
  return {
    id,
    title: `Gig ${id}`,
    description: 'Some work',
    category: 'RETAIL',
    arrangementType: 'GIG',
    payKind: 'FIXED_TOTAL',
    payAmount: '5000', // Prisma returns Decimal; a string stands in for it
    payRateUnit: null,
    workersNeeded: 1,
    filledCount: 0,
    startAt: new Date(Date.now() + 7 * DAY),
    createdAt: new Date(Date.now() - DAY),
    locationAreaLabel: 'Somewhere',
    locationLat: lat,
    locationLng: 80.0,
    ...overrides,
  };
}

function given(...rows) {
  prismaMock.gigPosting.findMany.mockResolvedValue(rows);
  prismaMock.user.update.mockResolvedValue({});
}

function browse(params = {}) {
  return service.browseGigs({ browser: YOUTH, ...CENTRE, ...params });
}

beforeEach(() => {
  jest.resetAllMocks();
  nextId = 1;
});

describe('FR-DISC-01: radius and auto-expansion', () => {
  test('stays at 5 km when 5 or more gigs are inside it', () => {
    expect(effectiveRadiusFor([1.1, 2.2, 3.3, 4.4, 4.4, 30])).toBe(5);
  });

  test('widens in 5 km steps to the first radius holding 5 gigs (the Homagama case, 3.2)', () => {
    // 1 gig within 10 km, 3 within 15, 5 within 20.
    expect(effectiveRadiusFor([8.9, 13.3, 14.5, 18.9, 18.9])).toBe(20);
  });

  test('stops at 50 km however few gigs there are', () => {
    expect(effectiveRadiusFor([])).toBe(50);
    expect(effectiveRadiusFor([33.4])).toBe(50);
  });

  test('returns only gigs inside the widened radius, and says it widened', async () => {
    given(posting(7.08), posting(7.12), posting(7.13), posting(7.17), posting(7.17), posting(7.3));
    const result = await browse();

    expect(result.radiusKm).toBe(20);
    expect(result.widened).toBe(true);
    expect(result.postings.map((p) => p.distanceKm)).toEqual([8.9, 13.3, 14.5, 18.9, 18.9]);
  });

  test('never returns a gig beyond 50 km', async () => {
    given(posting(7.3), posting(7.5));
    const result = await browse();
    expect(result.radiusKm).toBe(50);
    expect(result.postings.map((p) => p.distanceKm)).toEqual([33.4]);
  });

  test('every result carries its pay figure and basis fields (amended 2026-08-27)', async () => {
    given(posting(7.01, { payKind: 'RATE', payAmount: '2500', payRateUnit: 'DAY', workersNeeded: 2 }));
    const [result] = (await browse()).postings;
    expect(result).toMatchObject({ payKind: 'RATE', payAmount: 2500, payRateUnit: 'DAY', workersNeeded: 2 });
  });
});

describe('FR-DISC-01 amendment 2026-09-25: the browse centre is recorded', () => {
  test('rounded to two decimals (about 1 km) and stamped with the time', async () => {
    given();
    await service.browseGigs({ browser: YOUTH, lat: 6.864912, lng: 79.899734 });

    const { where, data } = prismaMock.user.update.mock.calls[0][0];
    expect(where).toEqual({ id: 'youth-1' });
    expect(data.lastBrowseLat).toBe(6.86);
    expect(data.lastBrowseLng).toBe(79.9);
    expect(data.lastBrowseAt).toBeInstanceOf(Date);
  });

  test('a manually chosen area records that area’s centre', async () => {
    given();
    const result = await service.browseGigs({ browser: YOUTH, area: 'Homagama' });

    expect(result.centreLabel).toBe('Homagama');
    const { data } = prismaMock.user.update.mock.calls[0][0];
    expect(data.lastBrowseLat).toBe(6.84);
    expect(data.lastBrowseLng).toBe(80);
  });
});

describe('FR-DISC-02: where the search is centred', () => {
  test('an area name resolves through the posting area list, ignoring case', () => {
    expect(resolveCentre({ area: 'nugegoda' })).toMatchObject({ label: 'Nugegoda' });
  });

  test('an unknown area is a 400, not a search around nowhere', () => {
    expect(() => resolveCentre({ area: 'Atlantis' })).toThrow(expect.objectContaining({ status: 400 }));
  });

  test('no area and no position is a 400', () => {
    expect(() => resolveCentre({})).toThrow(expect.objectContaining({ status: 400 }));
    expect(() => resolveCentre({ lat: 7 })).toThrow(expect.objectContaining({ status: 400 }));
  });

  test('a device position is named after the nearest listed area', () => {
    expect(nearestAreaName(6.8701, 79.8885)).toBe('Nugegoda');
    expect(resolveCentre({ lat: 6.8441, lng: 80.0025 }).label).toBe('Homagama');
  });
});

describe('Which postings can appear', () => {
  test('only OPEN, not auto-hidden, not expired postings are queried', async () => {
    given();
    await browse();
    const { where } = prismaMock.gigPosting.findMany.mock.calls[0][0];
    expect(where.status).toBe('OPEN');
    expect(where.autoHiddenAt).toBeNull();
    expect(where.OR).toEqual([{ expiresAt: null }, { expiresAt: { gt: expect.any(Date) } }]);
  });

  test('FR-POST-08: no address, coordinates, description or employer reach the worker', async () => {
    given(posting(7.01, { locationAddress: '12 Temple Road' }));
    const [result] = (await browse()).postings;

    for (const field of ['locationAddress', 'locationLat', 'locationLng', 'description', 'employer', 'employerId']) {
      expect(result).not.toHaveProperty(field);
    }
    expect(result.areaLabel).toBe('Somewhere');
    // ...and the query never even reads the address.
    const { select } = prismaMock.gigPosting.findMany.mock.calls[0][0];
    expect(select.locationAddress).toBeUndefined();
  });

  test('FR-POST-08: distance is measured to the coarse (about 1 km) point, not the exact pin', async () => {
    // 7.0449 is 4.99 km north; its coarse point 7.04 is 4.4 km.
    given(posting(7.0449));
    const [result] = (await browse()).postings;
    expect(result.distanceKm).toBe(4.4);
  });
});

describe('FR-DISC-03: category and arrangement filters', () => {
  const rows = () => [
    posting(7.01, { category: 'EVENT_SETUP', arrangementType: 'GIG' }),
    posting(7.02, { category: 'EVENT_SETUP', arrangementType: 'PART_TIME' }),
    posting(7.03, { category: 'RETAIL', arrangementType: 'GIG' }),
    posting(7.04, { category: 'CLEANING', arrangementType: 'GIG' }),
    posting(7.04, { category: 'DELIVERY', arrangementType: 'PART_TIME' }),
    posting(7.08, { category: 'EVENT_SETUP', arrangementType: 'GIG' }), // outside 5 km
  ];

  test('a category filter shows only that category', async () => {
    given(...rows());
    const result = await browse({ category: 'EVENT_SETUP' });
    expect(result.postings.every((p) => p.category === 'EVENT_SETUP')).toBe(true);
  });

  test('category, arrangement and radius combine (3.1f: Event setup · One-off)', async () => {
    given(...rows());
    const result = await browse({ category: 'EVENT_SETUP', arrangementType: 'GIG' });
    expect(result.postings.map((p) => p.distanceKm)).toEqual([1.1]);
  });

  test('filters never widen the radius: it is decided on all open gigs nearby', async () => {
    given(...rows());
    const result = await browse({ category: 'EVENT_SETUP', arrangementType: 'GIG' });
    expect(result.radiusKm).toBe(5);
    expect(result.widened).toBe(false);
  });

  test('an unknown category or arrangement is a 400', async () => {
    await expect(browse({ category: 'OTHER' })).rejects.toMatchObject({ status: 400 });
    await expect(browse({ arrangementType: 'FULL_TIME' })).rejects.toMatchObject({ status: 400 });
  });
});

describe('FR-DISC-04: keyword search', () => {
  test('matches the title or the description, ignoring case, inside the radius', async () => {
    given(
      posting(7.01, { title: 'Event setup crew' }),
      posting(7.02, { title: 'Stage work', description: 'Help with EVENT SETUP on Saturday' }),
      posting(7.03, { title: 'Shop assistant', locationAreaLabel: 'Event Street' }),
      posting(7.04),
      posting(7.04),
    );
    const result = await browse({ keyword: '  event setup ' });
    expect(result.postings.map((p) => p.distanceKm)).toEqual([1.1, 2.2]);
  });
});

describe('FR-DISC-05: sort order', () => {
  const now = Date.now();
  const rows = () => [
    posting(7.04, { title: 'far urgent', startAt: new Date(now + 30 * HOUR), payAmount: '6000', createdAt: new Date(now - 3 * HOUR) }),
    posting(7.01, { title: 'near', payAmount: '4500', createdAt: new Date(now - 5 * HOUR) }),
    posting(7.03, { title: 'mid', payAmount: '7000', createdAt: new Date(now - 1 * HOUR) }),
    posting(7.02, { title: 'unpaid', payKind: 'UNPAID', payAmount: null, arrangementType: 'INTERNSHIP', createdAt: new Date(now - 9 * HOUR) }),
    posting(7.03, { title: 'near urgent', startAt: new Date(now + 10 * HOUR), payAmount: '2500', createdAt: new Date(now - 2 * HOUR) }),
  ];
  const titles = (result) => result.postings.map((p) => p.title);

  test('default: urgent first, then non-urgent, each nearest first', async () => {
    given(...rows());
    expect(titles(await browse())).toEqual(['near urgent', 'far urgent', 'near', 'unpaid', 'mid']);
  });

  test('"Pay": high to low by stated pay, Unpaid last', async () => {
    given(...rows());
    expect(titles(await browse({ sortBy: 'pay' }))).toEqual(['mid', 'far urgent', 'near', 'near urgent', 'unpaid']);
  });

  test('"Newest first" and "Closest first"', async () => {
    given(...rows());
    expect(titles(await browse({ sortBy: 'newest' }))).toEqual(['mid', 'near urgent', 'far urgent', 'near', 'unpaid']);
    given(...rows());
    expect(titles(await browse({ sortBy: 'closest' }))).toEqual(['near', 'unpaid', 'mid', 'near urgent', 'far urgent']);
  });

  test('an unknown sort is a 400', async () => {
    await expect(browse({ sortBy: 'random' })).rejects.toMatchObject({ status: 400 });
  });

  test('FR-POST-07: urgency is worked out from the start time now, not from a stored flag', async () => {
    given(posting(7.01, { isUrgent: false, startAt: new Date(now + 20 * HOUR) }), posting(7.02, { isUrgent: true }));
    const result = await browse();
    expect(result.postings.map((p) => p.isUrgent)).toEqual([true, false]);
  });

  test('sortResults does not change the array it is given', () => {
    const list = [{ distanceKm: 2, isUrgent: false }, { distanceKm: 1, isUrgent: false }];
    sortResults(list, 'closest');
    expect(list[0].distanceKm).toBe(2);
  });
});

describe('Who may browse (FR-DISC-01..05 actor: Youth Job-Seeker)', () => {
  // The route's first handler is the role check; call it the way Express would.
  async function roleCheck(role) {
    const { default: router } = await import('../discovery.routes.js');
    const layer = router.stack.find((l) => l.route?.path === '/');
    const check = layer.route.stack[0].handle;
    const next = jest.fn();
    check({ user: { id: 'u', role } }, {}, next);
    return next.mock.calls[0][0];
  }

  test('a job-seeker passes', async () => {
    expect(await roleCheck('YOUTH_JOB_SEEKER')).toBeUndefined();
  });

  test('an employer or a verifier gets a 403', async () => {
    expect(await roleCheck('EMPLOYER')).toMatchObject({ status: 403 });
    expect(await roleCheck('COMMUNITY_ENDORSER')).toMatchObject({ status: 403 });
  });
});
