/**
 * Community Endorsement routes — mounted at /api/endorsements by src/app.js.
 *
 * Epic: FR-ENDORSE  ·  Owner: TBD (Sprint 2)
 * Requirements: see docs/requirements.md, module FR-ENDORSE
 *
 * Keep this file thin. It maps URLs to controller functions and applies
 * middleware; it contains no logic of its own.
 */
import express from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import controller from "./endorsement.controller.js";

const router = express.Router();

// Example of the shape to follow — delete once you add a real route:
// router.post("/", asyncHandler(controller.create));
// router.get("/:id", asyncHandler(controller.getById));

export default router;
