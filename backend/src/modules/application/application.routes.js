/**
 * Applying & Selection routes — mounted at /api/applications by src/app.js.
 *
 * Epic: FR-APPLY  ·  Owner: Naveenkhan
 * Requirements: see docs/requirements.md, module FR-APPLY
 *
 * Keep this file thin. It maps URLs to controller functions and applies
 * middleware; it contains no logic of its own.
 */
import express from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import requireAuth from "../../middleware/requireAuth.js";
import controller from "./application.controller.js";

const router = express.Router();

// Every route below needs a known, authenticated user — worker identity for
// apply/withdraw, employer identity for the pool/select/decline actions.
router.use(requireAuth);

router.post("/", asyncHandler(controller.apply));
router.get("/", asyncHandler(controller.getPool));
router.get("/mine", asyncHandler(controller.getMine));
router.post("/:id/withdraw", asyncHandler(controller.withdraw));
router.post("/:id/select", asyncHandler(controller.select));
router.post("/:id/decline", asyncHandler(controller.decline));

export default router;
