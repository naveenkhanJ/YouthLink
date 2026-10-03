/**
 * Ratings & Reputation controllers — the HTTP layer.
 *
 * Epic: FR-RATE  ·  Owner: Pawan (Sprint 4)
 * Requirements: FR-RATE-01, FR-RATE-02, FR-RATE-03, FR-RATE-06
 */
import ratingService from "./rating.service.js";

export async function submitRating(req, res) {
  const { engagementId, score } = req.body;
  const userId = req.user.id;

  const result = await ratingService.submitRating({
    engagementId,
    userId,
    score,
  });

  return res.status(201).json({
    status: "ok",
    rating: result.rating,
    revealed: result.revealed,
  });
}

export async function getEngagementRatings(req, res) {
  const { engagementId } = req.params;
  const userId = req.user.id;

  const data = await ratingService.getEngagementRatings({
    engagementId,
    userId,
  });

  return res.status(200).json({
    status: "ok",
    data,
  });
}

export async function postPublicResponse(req, res) {
  const { ratingId } = req.params;
  const { response } = req.body;
  const userId = req.user.id;

  const updatedRating = await ratingService.postPublicResponse({
    ratingId,
    userId,
    response,
  });

  return res.status(200).json({
    status: "ok",
    rating: updatedRating,
  });
}

export async function getUserRatingSummary(req, res) {
  const { userId } = req.params;

  const summary = await ratingService.getUserRatingSummary(userId);

  return res.status(200).json({
    status: "ok",
    summary,
  });
}

export default {
  submitRating,
  getEngagementRatings,
  postPublicResponse,
  getUserRatingSummary,
};
