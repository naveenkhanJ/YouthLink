/**
 * Distance helpers shared by Discovery (FR-DISC-01) and the gig notification
 * fan-out (FR-NOTIF-01/02, FR-POST-10), so "within radius" means exactly the
 * same thing in both places.
 *
 * Epic: FR-DISC  ·  Owner: Pawan
 */

const EARTH_RADIUS_KM = 6371;

/** Kilometres in one degree of latitude (roughly constant everywhere). */
export const KM_PER_DEGREE_LAT = 111.32;

/**
 * Great-circle distance between two points using the Haversine formula, in km.
 */
export function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * A latitude/longitude box that fully contains the circle of `radiusKm` around
 * a point. Used as a cheap database pre-filter (it can use the lat/lng index);
 * the exact Haversine check is applied afterwards to trim the box's corners.
 */
export function boundingBox(lat, lng, radiusKm) {
  const latDelta = radiusKm / KM_PER_DEGREE_LAT;
  // A degree of longitude shrinks towards the poles; Sri Lanka is near the equator,
  // but compute it properly rather than assume.
  const lngDelta = radiusKm / (KM_PER_DEGREE_LAT * Math.cos((lat * Math.PI) / 180));
  return {
    minLat: lat - latDelta,
    maxLat: lat + latDelta,
    minLng: lng - lngDelta,
    maxLng: lng + lngDelta,
  };
}

/**
 * Rounds a coordinate to two decimal places (about 1 km). FR-POST-10's
 * 2026-09-25 amendment stores the browse centre only at this precision.
 */
export function roundToAboutOneKm(coordinate) {
  return Math.round(coordinate * 100) / 100;
}
