// gigPosting.areas.test.js
// FR-POST-08 (round 4, L-1): the server's list of areas (posting.areas.js), the
// GET /api/postings/areas endpoint, and a create request with an area that isn't listed.
// Prisma is mocked (the controller imports the service, which imports the client).
import { jest } from '@jest/globals';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const prismaMock = {
  $queryRaw: jest.fn().mockResolvedValue([]),
  user: { findUnique: jest.fn() },
  gigPosting: { create: jest.fn() },
};
jest.unstable_mockModule('../../../lib/prisma.js', () => ({ default: prismaMock }));

const { AREAS, ALIASES, findArea, listAreas } = await import('../posting.areas.js');
const { createGigPostingValidators } = await import('../posting.validators.js');
const controller = await import('../posting.controller.js');

// Sri Lanka's bounding box, generously rounded (round 4, L-1 item 7).
const LAT = { min: 5.85, max: 9.9 };
const LNG = { min: 79.5, max: 81.95 };

describe('the area list', () => {
  test('every entry is inside Sri Lanka and has a name, a district and 4-decimal coordinates', () => {
    expect(AREAS.length).toBeGreaterThan(80);
    for (const area of AREAS) {
      expect(typeof area.name).toBe('string');
      expect(area.name.trim()).toBe(area.name);
      expect(area.district).toMatch(/^[A-Z][A-Za-z ]+$/);
      expect(area.district).not.toMatch(/District$/);
      expect(area.lat).toBeGreaterThanOrEqual(LAT.min);
      expect(area.lat).toBeLessThanOrEqual(LAT.max);
      expect(area.lng).toBeGreaterThanOrEqual(LNG.min);
      expect(area.lng).toBeLessThanOrEqual(LNG.max);
      expect(Math.round(area.lat * 1e4) / 1e4).toBe(area.lat);
      expect(Math.round(area.lng * 1e4) / 1e4).toBe(area.lng);
    }
  });

  test('no two names are equal, even ignoring case and spacing', () => {
    const keys = AREAS.map((a) => a.name.toLowerCase().replace(/\s+/g, ' '));
    expect(new Set(keys).size).toBe(keys.length);
  });

  test('every alias points at a listed area and is not itself an area name', () => {
    for (const [alias, target] of Object.entries(ALIASES)) {
      expect(findArea(target)?.name).toBe(target);
      expect(AREAS.some((a) => a.name.toLowerCase() === alias)).toBe(false);
    }
  });

  test('every district capital is listed (25 districts)', () => {
    const districts = new Set(AREAS.map((a) => a.district));
    expect(districts.size).toBe(25);
  });

  test('every area label the development seed uses is found', () => {
    const seed = fs.readFileSync(fileURLToPath(new URL('../../../../prisma/seed.js', import.meta.url)), 'utf8');
    const labels = [...seed.matchAll(/locationAreaLabel: "([^"]*)"/g)].map((m) => m[1]);
    expect(labels.length).toBeGreaterThan(0);
    for (const label of labels) {
      expect(findArea(label)?.name).toBe(label);
    }
  });
});

describe('findArea', () => {
  test('ignores case, extra spaces and a trailing " area"', () => {
    expect(findArea('  dehiwala   AREA ')?.name).toBe('Dehiwala');
    expect(findArea('Nuwara   Eliya')?.name).toBe('Nuwara Eliya');
  });

  test('pads "Colombo 4" to "Colombo 04"', () => {
    expect(findArea('Colombo 4')?.name).toBe('Colombo 04');
    expect(findArea('colombo 7 area')?.name).toBe('Colombo 07');
  });

  test('resolves aliases to their area', () => {
    expect(findArea('Kollupitiya')?.name).toBe('Colombo 03');
    expect(findArea('bambalapitiya area')?.name).toBe('Colombo 04');
  });

  test('returns null for anything not listed, including a street address', () => {
    for (const text of ['Nowhere', '', null, undefined, '23 Temple Road, Colombo 04', 'Colombo 16']) {
      expect(findArea(text)).toBeNull();
    }
  });

  test('keeps the values of the entries kept from the app (the seed points)', () => {
    expect(findArea('Colombo 01')).toMatchObject({ lat: 6.9271, lng: 79.8612 });
    expect(findArea('Colombo 04')).toMatchObject({ lat: 6.9147, lng: 79.8553 });
  });
});

describe('GET /api/postings/areas', () => {
  test('answers name, district and aliases sorted by name, and no coordinates', async () => {
    const res = { json: jest.fn() };
    await new Promise((resolve, reject) => {
      res.json.mockImplementation(resolve);
      controller.listPostingAreas({ user: { id: 'any-user', role: 'WORKER' } }, res, reject);
    });
    const { areas } = res.json.mock.calls[0][0];
    expect(areas).toHaveLength(AREAS.length);
    const names = areas.map((a) => a.name);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
    for (const area of areas) expect(Object.keys(area).sort()).toEqual(['aliases', 'district', 'name']);
    expect(areas.find((a) => a.name === 'Colombo 03').aliases).toEqual(['kollupitiya']);
    expect(listAreas()).toEqual(areas);
  });
});

describe('POST /api/postings with an area that is not listed', () => {
  test('is a 400 with the field message on locationArea, and nothing is created', async () => {
    const req = {
      user: { id: 'employer-1', role: 'EMPLOYER' },
      body: {
        title: 'Event setup crew',
        description: 'Help set up staging.',
        category: 'EVENT_SETUP',
        arrangementType: 'GIG',
        payKind: 'FIXED_TOTAL',
        payAmount: 6000,
        locationAddress: '23 Temple Road',
        locationArea: 'Nowhere',
        workersNeeded: 1,
        startAt: new Date(Date.now() + 30 * 3600e3).toISOString(),
      },
    };
    for (const middleware of createGigPostingValidators) await middleware.run(req);
    const error = await new Promise((resolve) => {
      controller.createGigPosting(req, { status: () => ({ json: () => resolve(null) }) }, resolve);
    });
    expect(error).toMatchObject({ status: 400, fields: { locationArea: 'Choose an area from the list.' } });
    expect(Object.keys(error.fields)).toEqual(['locationArea']);
    expect(prismaMock.gigPosting.create).not.toHaveBeenCalled();
  });
});
