/**
 * Discovery & Search routes — mounted at /api/discovery by src/app.js.
 *
 * Epic: FR-DISC  ·  Owner: Pawan
 */
import express from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import requireAuth from "../../middleware/requireAuth.js";
import controller from "./discovery.controller.js";

const router = express.Router();

// Browse gigs with location radius, filters, and sorting (FR-DISC-01..05).
// Signed-in only: browsing records the youth's browse centre for gig notifications
// (FR-POST-10 amendment), so the server has to know who is browsing.
router.get("/", requireAuth, asyncHandler(controller.browse));

export default router;
