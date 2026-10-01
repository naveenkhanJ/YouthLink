/**
 * Ratings & Reputation routes — mounted at /api/ratings by src/app.js, behind the shared
 * requireAuth (applied there, so every route here has req.user).
 *
 * Epic: FR-RATE  ·  Owner: Pawan (Sprint 4)
 *
 * Actors: FR-RATE-01 names Employer and Youth Job-Seeker; the service allows exactly the two
 * parties of the engagement (403 for anyone else), which is that actor rule made specific.
 *
 * FR-RATE-03 (completion rate) has no route of its own: the figures appear on profiles and in
 * the applicant pool, whose modules call computeCompletionRate / getRatingSummary from
 * rating.service.js. A standalone "look up anyone's stats by id" endpoint would work as the
 * public directory FR-PROF-05 rules out.
 */
import express from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import controller from "./rating.controller.js";

const router = express.Router();

// Submit a 1–5 star rating for an engagement (FR-RATE-01, FR-RATE-02).
router.post("/", asyncHandler(controller.submitRating));

// The engagement's double-blind rating state, as the caller may see it (FR-RATE-02).
router.get("/engagement/:engagementId", asyncHandler(controller.getEngagementRatings));

// Public response to a revealed rating (FR-RATE-06; no screen yet).
router.post("/:ratingId/response", asyncHandler(controller.postPublicResponse));

export default router;
