/**
 * Discovery & Search services — business rules and geospatial queries.
 *
 * Epic: FR-DISC  ·  Owner: Pawan
 * Requirements:
 *   - FR-DISC-01: Radius-based browsing (default 5km, +5km auto-expansion up to 50km if <5 results, pay figure and basis visible on result)
 *   - FR-DISC-02: Manual location fallback
 *   - FR-DISC-03: Category and arrangement-type filters
 *   - FR-DISC-04: Keyword search
 *   - FR-DISC-05: Sort order (urgent-first then nearest-first; alternate: pay, recency)
 */
import prisma from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";
import { haversineDistance, roundToAboutOneKm } from "./geo.js";

// Mirrors the GigCategory and ArrangementType enums in schema.prisma. Checked here so an
// unknown value is a clear 400 instead of a Prisma validation error (a 500).
const CATEGORIES = ["RETAIL", "DELIVERY", "EVENT_SETUP", "MOVING", "FOOD_SERVICE", "TUTORING", "CLEANING"];
const ARRANGEMENT_TYPES = ["GIG", "PART_TIME", "INTERNSHIP"];
const SORT_OPTIONS = ["default", "pay", "recency"];

/**
 * Remembers where this youth last browsed (FR-DISC-01 / FR-POST-10 amendments, 2026-09-25):
 * the centre of the search, rounded to about 1 km and overwritten every time — never a
 * history. The gig notification fan-out measures its 5 km radius from this point.
 */
async function recordBrowseCentre(userId, lat, lng) {
  await prisma.user.update({
    where: { id: userId },
    data: {
      lastBrowseLat: roundToAboutOneKm(lat),
      lastBrowseLng: roundToAboutOneKm(lng),
      lastBrowseAt: new Date(),
    },
  });
}

/**
 * Browses open gigs within a radius, applying filters, auto-expansion, and sorting.
 *
 * `browser` is the signed-in user ({ id, role }); only a Youth Job-Seeker's browse centre
 * is recorded, because only youth receive gig notifications.
 */
async function browseGigs({
  browser,
  lat,
  lng,
  radius = 5,
  category,
  arrangementType,
  keyword,
  sortBy = "default",
  autoExpand = true,
}) {
  if (category && !CATEGORIES.includes(category)) {
    throw AppError.badRequest("Unknown category.", { category: "Choose one of the listed categories." });
  }
  if (arrangementType && !ARRANGEMENT_TYPES.includes(arrangementType)) {
    throw AppError.badRequest("Unknown arrangement type.", {
      arrangementType: "Choose gig, part-time or internship.",
    });
  }
  if (!SORT_OPTIONS.includes(sortBy)) {
    throw AppError.badRequest("Unknown sort option.", { sortBy: "Choose default, pay or recency." });
  }

  // Both coordinates or neither: half a location is treated as no location.
  const hasLocation = Number.isFinite(lat) && Number.isFinite(lng);
  const userLat = hasLocation ? Number(lat) : null;
  const userLng = hasLocation ? Number(lng) : null;
  const initialRadius = Math.max(1, Math.min(Number(radius) || 5, 50));

  // Build Prisma where clause
  const where = {
    status: "OPEN",
  };

  if (category) {
    where.category = category;
  }

  if (arrangementType) {
    where.arrangementType = arrangementType;
  }

  if (keyword && keyword.trim()) {
    const term = keyword.trim();
    where.OR = [
      { title: { contains: term, mode: "insensitive" } },
      { description: { contains: term, mode: "insensitive" } },
      { locationAreaLabel: { contains: term, mode: "insensitive" } },
      { postedBusinessName: { contains: term, mode: "insensitive" } },
    ];
  }

  // Fetch candidate open postings with general-area fields only (FR-POST-08)
  const candidatePostings = await prisma.gigPosting.findMany({
    where,
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      arrangementType: true,
      payKind: true,
      payAmount: true,
      payRateUnit: true,
      postedAsType: true,
      postedBusinessName: true,
      postedBusinessBio: true,
      locationAreaLabel: true,
      locationLat: true,
      locationLng: true,
      workersNeeded: true,
      filledCount: true,
      isUrgent: true,
      startAt: true,
      createdAt: true,
      employer: {
        select: {
          id: true,
          legalName: true,
          phoneVerifiedAt: true,
        },
      },
    },
  });

  // Calculate distance for each posting if user location is available
  const withDistance = candidatePostings.map((p) => {
    let distanceInKm = null;
    if (userLat != null && userLng != null) {
      distanceInKm = haversineDistance(userLat, userLng, p.locationLat, p.locationLng);
    }
    return {
      ...p,
      distanceInKm: distanceInKm != null ? Math.round(distanceInKm * 10) / 10 : null,
    };
  });

  // Auto-expansion logic (FR-DISC-01):
  // Default radius = 5km. If < 5 results, expand in 5km steps up to 50km.
  let effectiveRadius = initialRadius;
  let results = [];

  if (userLat != null && userLng != null) {
    if (autoExpand) {
      while (effectiveRadius <= 50) {
        results = withDistance.filter((p) => p.distanceInKm <= effectiveRadius);
        if (results.length >= 5 || effectiveRadius >= 50) {
          break;
        }
        effectiveRadius = Math.min(effectiveRadius + 5, 50);
      }
    } else {
      results = withDistance.filter((p) => p.distanceInKm <= initialRadius);
    }
  } else {
    // Location permission denied / manual fallback mode
    results = withDistance;
  }

  // Sorting (FR-DISC-05)
  results.sort((a, b) => {
    if (sortBy === "pay") {
      // Pay high to low
      const aPay = a.payAmount ? Number(a.payAmount) : 0;
      const bPay = b.payAmount ? Number(b.payAmount) : 0;
      if (bPay !== aPay) return bPay - aPay;
      return new Date(b.createdAt) - new Date(a.createdAt);
    }

    if (sortBy === "recency") {
      // Recency: most recently posted first
      return new Date(b.createdAt) - new Date(a.createdAt);
    }

    // Default sort: urgent first, then nearest first (or recency if no location)
    if (a.isUrgent !== b.isUrgent) {
      return a.isUrgent ? -1 : 1;
    }
    if (a.distanceInKm != null && b.distanceInKm != null) {
      if (a.distanceInKm !== b.distanceInKm) return a.distanceInKm - b.distanceInKm;
    }
    return new Date(a.startAt) - new Date(b.startAt);
  });

  if (browser?.role === "YOUTH_JOB_SEEKER" && userLat != null) {
    await recordBrowseCentre(browser.id, userLat, userLng);
  }

  return {
    postings: results,
    totalCount: results.length,
    effectiveRadius: userLat != null ? effectiveRadius : null,
    autoExpanded: effectiveRadius > initialRadius,
  };
}

export default {
  browseGigs,
};
