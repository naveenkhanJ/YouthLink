// posting.location.js
// Location precision and privacy logic for FR-POST-08 & FR-APPLY-07.
//
// Browsing workers and applicants who have not yet been selected see only the
// coarse area label (e.g. "Bambalapitiya, Colombo 04") and coordinates for
// general map area display.
// The precise street address (locationAddress) is released ONLY to:
//   1. The Employer who created the posting
//   2. A Worker who has actually been selected (active Engagement for this gig)

/**
 * Checks if a given viewerUserId has permission to view the precise locationAddress.
 *
 * @param {Object} posting - The gig posting record, optionally including engagements.
 * @param {string|null} [viewerUserId] - The ID of the authenticated user requesting the posting.
 * @returns {boolean} True if the viewer is allowed to see the precise address.
 */
export function canAccessPreciseLocation(posting, viewerUserId) {
  if (!posting || !viewerUserId) {
    return false;
  }

  // 1. Employer who created the gig always sees precise address
  if (posting.employerId && posting.employerId === viewerUserId) {
    return true;
  }

  // 2. Selected worker with an active / valid engagement
  if (Array.isArray(posting.engagements) && posting.engagements.length > 0) {
    const isSelectedWorker = posting.engagements.some(
      (eng) => eng.workerId === viewerUserId && eng.status !== 'CANCELLED'
    );
    if (isSelectedWorker) {
      return true;
    }
  }

  return false;
}

/**
 * Sanitizes a gig posting's location fields based on who is viewing it.
 *
 * @param {Object} posting - The gig posting object from Prisma.
 * @param {string|null} [viewerUserId] - The ID of the requesting user (if authenticated).
 * @returns {Object|null} The sanitized posting with locationAddress redacted if unprivileged.
 */
export function sanitizePostingLocation(posting, viewerUserId = null) {
  if (!posting) {
    return null;
  }

  const isPreciseReleased = canAccessPreciseLocation(posting, viewerUserId);

  // Exclude raw engagements array from standard posting response if present,
  // or keep it if caller needs it, but ensure locationAddress is strictly protected.
  const { engagements, ...cleanPosting } = posting;

  return {
    ...cleanPosting,
    // Redact precise street address unless permitted
    locationAddress: isPreciseReleased ? posting.locationAddress : null,
    // Coarse area label is always public
    locationAreaLabel: posting.locationAreaLabel,
    locationLat: posting.locationLat,
    locationLng: posting.locationLng,
    // Metadata flag informing clients whether exact location has been released
    isPreciseLocationReleased: isPreciseReleased,
  };
}

/**
 * Sanitizes an array of gig postings (e.g. for discovery / browse endpoints).
 *
 * @param {Array<Object>} postings - List of gig postings.
 * @param {string|null} [viewerUserId] - The ID of the requesting user.
 * @returns {Array<Object>} Sanitized list of gig postings.
 */
export function sanitizePostingList(postings, viewerUserId = null) {
  if (!Array.isArray(postings)) {
    return [];
  }
  return postings.map((posting) => sanitizePostingLocation(posting, viewerUserId));
}
