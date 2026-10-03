/**
 * Engagement Lifecycle routes — mounted at /api/engagements by src/app.js (behind requireAuth).
 *
 * Epic: FR-ENG  ·  Owner: Naveenkhan
 */
import express from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import controller from "./engagement.controller.js";

const router = express.Router();

router.get("/", asyncHandler(controller.list));
// Before "/:id", so "change-responses" is never read as an engagement id.
router.get("/change-responses/:postingId", asyncHandler(controller.changeResponses));
router.get("/:id", asyncHandler(controller.getById));
router.post("/:id/checkpoints/verify", asyncHandler(controller.verifyCheckpoint));
router.post("/:id/end", asyncHandler(controller.end));
router.post("/:id/reconfirm", asyncHandler(controller.reconfirm));
router.post("/:id/checkpoints/unable-to-confirm", asyncHandler(controller.unableToConfirm));
router.post("/:id/cancel", asyncHandler(controller.cancel));
router.post("/:id/cancellation/respond", asyncHandler(controller.respondToRequest));

export default router;
