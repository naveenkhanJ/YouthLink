/**
 * Profile & Trust Signals routes — mounted at /api/profiles by src/app.js.
 *
 * Epic: FR-PROF  ·  Owner: Afham (minimal slice: the person's own profile)
 * Requirements: see docs/requirements.md, module FR-PROF
 *
 * Keep this file thin. It maps URLs to controller functions and applies
 * middleware; it contains no logic of its own.
 */
import express from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import controller from "./profile.controller.js";

const router = express.Router();

// FR-PROF-01/02/06: the signed-in person's own profile (M1 1.18). requireAuth is applied where
// src/app.js mounts this router.
router.get("/me", asyncHandler(controller.getOwnProfile));

export default router;
