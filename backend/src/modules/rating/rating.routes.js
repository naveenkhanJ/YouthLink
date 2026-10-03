/**
 * Ratings & Reputation routes — mounted at /api/ratings by src/app.js.
 *
 * Epic: FR-RATE  ·  Owner: Pawan (Sprint 4)
 * Requirements: FR-RATE-01, FR-RATE-02, FR-RATE-03, FR-RATE-04, FR-RATE-05, FR-RATE-06
 */
import express from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import requireAuth from "../../middleware/requireAuth.js";
import controller from "./rating.controller.js";

const router = express.Router();

router.use(requireAuth);

// Submit 1-5 star rating for engagement (FR-RATE-01, FR-RATE-02, FR-RATE-04, FR-RATE-05)
router.post("/", asyncHandler(controller.submitRating));

// Get double-blind ratings state for engagement (FR-RATE-02)
router.get("/engagement/:engagementId", asyncHandler(controller.getEngagementRatings));

// Post public response to a revealed rating (FR-RATE-06)
router.post("/:ratingId/response", asyncHandler(controller.postPublicResponse));

// Get user rating summary and completion rate (FR-RATE-03)
router.get("/user/:userId/summary", asyncHandler(controller.getUserRatingSummary));

export default router;
