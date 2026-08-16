/**
 * Discovery & Search routes — mounted at /api/discovery by src/app.js.
 *
 * Epic: FR-DISC  ·  Owner: Pawan
 */
import express from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import controller from "./discovery.controller.js";

const router = express.Router();

// Browse gigs with location radius, filters, and sorting (FR-DISC-01..05)
router.get("/", asyncHandler(controller.browse));

export default router;
