/**
 * Ratings & Reputation controllers — the HTTP layer. Reads the request, calls the service,
 * shapes the response. No business rules here.
 *
 * Epic: FR-RATE  ·  Owner: Pawan (Sprint 4)
 * Requirements: FR-RATE-01, FR-RATE-02, FR-RATE-06
 */
import ratingService from "./rating.service.js";

/** POST /api/ratings — body { engagementId, score }. FR-RATE-01, FR-RATE-02. */
export async function submitRating(req, res) {
  const { engagementId, score } = req.body ?? {};
  const result = await ratingService.submitRating({ engagementId, userId: req.user.id, score });
  res.status(201).json(result);
}

/** GET /api/ratings/engagement/:engagementId — the double-blind state. FR-RATE-02. */
export async function getEngagementRatings(req, res) {
  const ratings = await ratingService.getEngagementRatings({
    engagementId: req.params.engagementId,
    userId: req.user.id,
  });
  res.json({ ratings });
}

/** POST /api/ratings/:ratingId/response — body { response }. FR-RATE-06. */
export async function postPublicResponse(req, res) {
  const rating = await ratingService.postPublicResponse({
    ratingId: req.params.ratingId,
    userId: req.user.id,
    response: req.body?.response,
  });
  res.json({ rating });
}

export default {
  submitRating,
  getEngagementRatings,
  postPublicResponse,
};
