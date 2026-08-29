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

/**
 * Parses an optional coordinate, rejecting anything that isn't a real number
 * in range. Returns null when the value is absent (the manual-fallback path
 * of FR-DISC-02), and throws a 400 when it is present but unusable.
 */
function toCoordinate(value, field, min, max) {
  if (value == null || value === "") return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < min || parsed > max) {
    throw AppError.badRequest(`Invalid ${field}`, { [field]: "Must be a number in range" });
  }
  return parsed;
}

/**
 * Calculates the great-circle distance between two points on the Earth
 * using the Haversine formula (returns distance in kilometers).
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Browses open gigs within a radius, applying filters, auto-expansion, and sorting.
 */
async function browseGigs({
  lat,
  lng,
  radius = 5,
  category,
  arrangementType,
  keyword,
  sortBy = "default",
  autoExpand = true,
}) {
  // Number("abc") is NaN, and NaN != null passes a loose null check — so an
  // unparseable lat/lng used to sail through, make every haversine distance
  // NaN, filter every posting out, and return 200 with an empty list plus a
  // bogus "auto-expanded to 50km" flag. A bad coordinate is a client error.
  const userLat = toCoordinate(lat, "lat", -90, 90);
  const userLng = toCoordinate(lng, "lng", -180, 180);
  if ((userLat == null) !== (userLng == null)) {
    throw AppError.badRequest("lat and lng must be provided together");
  }
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
      // FR-DISC-05 lists recency and soonest-start as different things: this
      // is "most recently posted", so it sorts on createdAt descending.
      // It previously sorted on startAt ascending, which is soonest-start —
      // leaving recency unavailable and createdAt selected but unused.
      return new Date(b.createdAt) - new Date(a.createdAt);
    }

    if (sortBy === "soonest") {
      return new Date(a.startAt) - new Date(b.startAt);
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
