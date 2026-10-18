/**
 * Community Endorsement routes — mounted at /api/endorsements by src/app.js, behind the shared
 * requireAuth (applied there, so every route here has req.user).
 *
 * Epic: FR-ENDORSE
 * Requirements: see docs/requirements.md, module FR-ENDORSE; screens docs/prototype/M8-endorsement.md
 *
 * Keep this file thin. It maps URLs to controller functions; it contains no logic of its own.
 *
 * There is deliberately no "look up anyone's endorsements" route: a worker's endorsements reach
 * other people through the profile and the applicant pool (FR-ENDORSE-10), and a Verifier's track
 * record reaches no one but the Verifier (FR-ENDORSE-11).
 */
import express from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import controller from "./endorsement.controller.js";

const router = express.Router();

// The worker's side (8.1 / 8.1b) and their one-time prompts (8.6 / 8.7).
router.get("/me/code", asyncHandler(controller.getMyCode));
router.get("/me/prompts", asyncHandler(controller.getPrompts));
router.patch("/me/prompts", asyncHandler(controller.setPromptsShown));

// The Verifier's side: find the person (8.2 by code, 8.3 by phone), vouch (8.4), manage (8.5).
router.post("/lookup-code", asyncHandler(controller.lookupCode));
router.post("/search-phone", asyncHandler(controller.searchByPhone));
router.post("/", asyncHandler(controller.createEndorsement));
router.get("/given", asyncHandler(controller.listGiven));
router.post("/:id/revoke", asyncHandler(controller.revokeEndorsement));

export default router;
