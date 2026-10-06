/**
 * Discovery & Search services — the browse query and its rules.
 *
 * Epic: FR-DISC  ·  Owner: Pawan
 * Requirements:
 *   - FR-DISC-01: radius browsing — 5 km by default, widened in 5 km steps up to 50 km while fewer
 *     than 5 gigs are found; every result carries its pay figure and basis. Each browse records its
 *     centre on the youth (amendment 2026-09-25, used by the gig notification fan-out).
 *   - FR-DISC-02: the search centre is the device's position, or the centre of a manually chosen
 *     area (the same area list postings are placed in — posting.areas.js).
 *   - FR-DISC-03: category and arrangement-type filters, combinable with the radius.
 *   - FR-DISC-04: keyword search over title and description, inside the same radius.
 *   - FR-DISC-05: sort — urgent first then nearest (default); alternates closest, newest, highest pay.
 *   - FR-POST-07: urgency is worked out from the start time at the moment of browsing.
 *   - FR-POST-08: a browsing worker only ever learns the coarse area — never the address or pin.
 */
import prisma from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";
import { AREAS, findArea } from "../posting/posting.areas.js";
import { computeIsUrgent } from "../posting/posting.urgency.js";
import { boundingBox, haversineDistance, roundToAboutOneKm } from "./geo.js";

// FR-DISC-01's numbers, named so the loop below reads like the requirement.
export const DEFAULT_RADIUS_KM = 5;
export const RADIUS_STEP_KM = 5;
export const MAX_RADIUS_KM = 50;
export const ENOUGH_RESULTS = 5;

// Mirror the GigCategory and ArrangementType enums in schema.prisma. Checked here so an unknown
// value is a clear 400 instead of silently matching nothing.
export const CATEGORIES = ["RETAIL", "DELIVERY", "EVENT_SETUP", "MOVING", "FOOD_SERVICE", "TUTORING", "CLEANING"];
export const ARRANGEMENT_TYPES = ["GIG", "PART_TIME", "INTERNSHIP"];

// The four options of the Sort sheet (prototype 3.6), in its order. "urgent" is FR-DISC-05's default.
export const SORT_OPTIONS = ["urgent", "closest", "newest", "pay"];

/**
 * Works out where the search is centred (FR-DISC-02).
 *
 * - `area` (a name from the area list) wins when given: the manual fallback.
 * - Otherwise `lat`/`lng` from the device, both or neither.
 *
 * `label` is what the Browse screen calls the centre ("within 5 km of Nugegoda"): the chosen
 * area's name, or for a device position the nearest listed area — the device's own coordinates
 * are never named or sent back.
 *
 * @returns {{ lat: number, lng: number, label: string }}
 */
export function resolveCentre({ area, lat, lng }) {
  if (area != null && String(area).trim() !== "") {
    const found = findArea(area);
    if (!found) {
      throw AppError.badRequest("Unknown area.", { area: "Choose an area from the list." });
    }
    return { lat: found.lat, lng: found.lng, label: found.name };
  }

  const hasPosition = Number.isFinite(lat) && Number.isFinite(lng);
  if (!hasPosition) {
    throw AppError.badRequest("Choose your area or allow location to browse gigs.", {
      area: "Choose your area.",
    });
  }
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    throw AppError.badRequest("That location isn't valid.");
  }
  return { lat, lng, label: nearestAreaName(lat, lng) };
}

/** The listed area whose centre is closest to a point — how a device position gets a place name. */
export function nearestAreaName(lat, lng) {
  let best = null;
  let bestKm = Infinity;
  for (const area of AREAS) {
    const km = haversineDistance(lat, lng, area.lat, area.lng);
    if (km < bestKm) {
      best = area;
      bestKm = km;
    }
  }
  return best ? best.name : null;
}

/**
 * Distance from the search centre to a posting, in km to one decimal ("4.5 km away").
 *
 * FR-POST-08: measured to the posting's COARSE point (rounded to about 1 km, the same rounding
 * posting.location.js gives browsing workers), not its exact pin. Measuring to the exact pin
 * would let someone who browses from a few different places triangulate the doorstep from the
 * "x km away" figures alone.
 */
export function coarseDistanceKm(centre, posting) {
  const km = haversineDistance(
    centre.lat,
    centre.lng,
    roundToAboutOneKm(posting.locationLat),
    roundToAboutOneKm(posting.locationLng),
  );
  return Math.round(km * 10) / 10;
}

/**
 * FR-DISC-01's auto-expansion: start at 5 km and widen 5 km at a time until at least 5 gigs are
 * inside the radius or 50 km is reached. Done in one pass over distances the server already has,
 * so the app sees one continuous load, not one wait per step (NFR-PERF-03).
 *
 * @param {number[]} distances - distance of every candidate gig, in km
 * @returns {number} the radius to show results for
 */
export function effectiveRadiusFor(distances) {
  let radius = DEFAULT_RADIUS_KM;
  while (radius < MAX_RADIUS_KM && distances.filter((km) => km <= radius).length < ENOUGH_RESULTS) {
    radius += RADIUS_STEP_KM;
  }
  return radius;
}

/** Keyword match for FR-DISC-04: title or description, ignoring case. */
function matchesKeyword(posting, keyword) {
  const term = keyword.toLowerCase();
  return posting.title.toLowerCase().includes(term) || posting.description.toLowerCase().includes(term);
}

/** The pay figure used by "Highest pay first": the stated amount, Unpaid as 0 (FR-DISC-05). */
function statedPay(posting) {
  return posting.payAmount == null ? 0 : Number(posting.payAmount);
}

/**
 * Orders results (FR-DISC-05). Every option falls back to nearest-first for ties, so the order is
 * always stable and explainable.
 */
export function sortResults(results, sortBy) {
  const nearestFirst = (a, b) => a.distanceKm - b.distanceKm;
  const comparators = {
    // Default: urgent postings first, then non-urgent; nearest first inside each group.
    urgent: (a, b) => (a.isUrgent === b.isUrgent ? nearestFirst(a, b) : a.isUrgent ? -1 : 1),
    closest: nearestFirst,
    newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt) || nearestFirst(a, b),
    pay: (a, b) => statedPay(b) - statedPay(a) || nearestFirst(a, b),
  };
  return [...results].sort(comparators[sortBy]);
}

/**
 * What a browsing worker receives for one posting: the card's facts and nothing more. The address,
 * the coordinates, the description and the employer's identity stay on the server (FR-POST-08;
 * the listing detail, 3.12, is where the rest is shown, by the Applying module).
 */
function toResult(posting, distanceKm, now) {
  return {
    id: posting.id,
    title: posting.title,
    category: posting.category,
    arrangementType: posting.arrangementType,
    payKind: posting.payKind,
    payAmount: posting.payAmount == null ? null : Number(posting.payAmount),
    payRateUnit: posting.payRateUnit,
    workersNeeded: posting.workersNeeded,
    filledCount: posting.filledCount,
    startAt: posting.startAt,
    createdAt: posting.createdAt,
    areaLabel: posting.locationAreaLabel,
    distanceKm,
    // FR-POST-07: urgency is a fact about time, so it is worked out now — a posting created five
    // days ahead becomes urgent once its start is 48 hours away, without anyone editing it.
    isUrgent: computeIsUrgent(posting.startAt, now),
  };
}

/**
 * Remembers where this youth last browsed (FR-DISC-01 / FR-POST-10 amendments, 2026-09-25): the
 * centre of the search, rounded to about 1 km and overwritten every time — never a history. The
 * gig notification fan-out measures its 5 km radius from this point.
 */
async function recordBrowseCentre(userId, centre, now) {
  await prisma.user.update({
    where: { id: userId },
    data: {
      lastBrowseLat: roundToAboutOneKm(centre.lat),
      lastBrowseLng: roundToAboutOneKm(centre.lng),
      lastBrowseAt: now,
    },
  });
}

/**
 * Browse open gigs around a centre (FR-DISC-01..05).
 *
 * Order of work, which is what the prototype's frames show:
 *   1. the radius is decided on ALL open gigs nearby (3.1f: one filtered result "within 5 km" — the
 *      filters never widen the search, they narrow what the radius already holds);
 *   2. the category / arrangement / keyword filters are applied inside that radius;
 *   3. the results are sorted.
 *
 * @param {object} params
 * @param {{ id: string, role: string }} params.browser - the signed-in youth
 * @returns {Promise<object>} { centreLabel, radiusKm, widened, postings }
 */
async function browseGigs({ browser, lat, lng, area, category, arrangementType, keyword, sortBy = "urgent" }) {
  if (category && !CATEGORIES.includes(category)) {
    throw AppError.badRequest("Unknown category.", { category: "Choose one of the listed categories." });
  }
  if (arrangementType && !ARRANGEMENT_TYPES.includes(arrangementType)) {
    throw AppError.badRequest("Unknown arrangement type.", {
      arrangementType: "Choose one-off gig, part-time job or internship.",
    });
  }
  if (!SORT_OPTIONS.includes(sortBy)) {
    throw AppError.badRequest("Unknown sort option.", { sortBy: `Choose one of: ${SORT_OPTIONS.join(", ")}.` });
  }

  const centre = resolveCentre({ area, lat, lng });
  const now = new Date();

  // Only gigs a worker could still apply for: open, not hidden after reports (FR-DISPUTE auto-hide),
  // and not past their expiry (FR-POST-13 — a one-off gig expires when it starts). The box is a
  // cheap pre-filter on the location index; the exact distance check trims its corners.
  const box = boundingBox(centre.lat, centre.lng, MAX_RADIUS_KM + 2); // +2: room for the ~1 km rounding
  const candidates = await prisma.gigPosting.findMany({
    where: {
      status: "OPEN",
      autoHiddenAt: null,
      OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
      locationLat: { gte: box.minLat, lte: box.maxLat },
      locationLng: { gte: box.minLng, lte: box.maxLng },
    },
    select: {
      id: true,
      title: true,
      description: true, // keyword matching only; never sent back
      category: true,
      arrangementType: true,
      payKind: true,
      payAmount: true,
      payRateUnit: true,
      workersNeeded: true,
      filledCount: true,
      startAt: true,
      createdAt: true,
      locationAreaLabel: true,
      locationLat: true, // distance only; never sent back
      locationLng: true,
    },
  });

  const nearby = candidates
    .map((posting) => ({ posting, distanceKm: coarseDistanceKm(centre, posting) }))
    .filter(({ distanceKm }) => distanceKm <= MAX_RADIUS_KM);

  const radiusKm = effectiveRadiusFor(nearby.map(({ distanceKm }) => distanceKm));
  const term = keyword ? String(keyword).trim() : "";

  const matching = nearby.filter(
    ({ posting, distanceKm }) =>
      distanceKm <= radiusKm &&
      (!category || posting.category === category) &&
      (!arrangementType || posting.arrangementType === arrangementType) &&
      (!term || matchesKeyword(posting, term)),
  );

  const postings = sortResults(
    matching.map(({ posting, distanceKm }) => toResult(posting, distanceKm, now)),
    sortBy,
  );

  // Every browse is a fresh centre for the youth's gig notifications (FR-POST-10 amendment).
  await recordBrowseCentre(browser.id, centre, now);

  return {
    centreLabel: centre.label,
    radiusKm,
    widened: radiusKm > DEFAULT_RADIUS_KM,
    postings,
  };
}

export default {
  browseGigs,
};
