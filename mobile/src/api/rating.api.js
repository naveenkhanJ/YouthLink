/**
 * Ratings & Reputation API calls (FR-RATE) — Pawan.
 */
import { request } from "./client.js";

/**
 * Submits a 1-5 star rating for an engagement (FR-RATE-01, FR-RATE-02).
 */
export function submitRating({ engagementId, score }) {
  return request("/api/ratings", {
    method: "POST",
    body: { engagementId, score },
  });
}

/**
 * Gets the double-blind ratings state for an engagement (FR-RATE-02).
 */
export function getEngagementRatings(engagementId) {
  return request(`/api/ratings/engagement/${engagementId}`, {
    method: "GET",
  });
}

/**
 * Posts a public response to a revealed rating (FR-RATE-06).
 */
export function postPublicResponse({ ratingId, response }) {
  return request(`/api/ratings/${ratingId}/response`, {
    method: "POST",
    body: { response },
  });
}

/**
 * Gets a user's average rating and completion rate summary (FR-RATE-03).
 */
export function getUserRatingSummary(userId) {
  return request(`/api/ratings/user/${userId}/summary`, {
    method: "GET",
  });
}
