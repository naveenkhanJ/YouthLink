/**
 * Ratings & Reputation API calls (FR-RATE) — Pawan.
 *
 * Every call goes through the shared request() helper, so errors arrive as thrown Errors that a
 * screen turns into copy with parseApiError (never raw text).
 */
import { request } from "./client.js";

/**
 * FR-RATE-02: the engagement's rating state as this person may see it.
 * @param {string} engagementId
 * @returns {Promise<{ ratings: {
 *   engagementId: string, postingTitle: string, counterpartyName: string, isCancelled: boolean,
 *   stage: "NOT_OPEN"|"OPEN"|"AWAITING_REVEAL"|"REVEALED", canSubmit: boolean,
 *   ratingOpenedAt: string|null, revealAt: string|null,
 *   myRating: { id: string, score: number, submittedAt: string }|null,
 *   theirRating: { id: string, score: number, publicResponse: string|null }|null,
 * } }>}
 */
export function getEngagementRatings(engagementId) {
  return request(`/api/ratings/engagement/${encodeURIComponent(engagementId)}`);
}

/**
 * FR-RATE-01 / FR-RATE-02: submit a 1–5 whole-star rating. `revealed` is true when this was the
 * second rating, which reveals both at once.
 * @param {{ engagementId: string, score: number }} input
 * @returns {Promise<{ rating: { id: string, score: number, submittedAt: string }, revealed: boolean }>}
 */
export function submitRating({ engagementId, score }) {
  return request("/api/ratings", {
    method: "POST",
    body: { engagementId, score },
  });
}
