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
import controller from "./application.controller.js";

const router = express.Router();

// Every route below needs a known, authenticated user. src/app.js mounts this router behind the
// shared requireAuth, so it is not applied a second time here (that re-read the user twice per
// request); each controller then checks the role its requirement names.

router.post("/", asyncHandler(controller.apply)); // FR-APPLY-02
router.get("/", asyncHandler(controller.getPool)); // FR-APPLY-04/05, ?gigPostingId=
router.get("/mine", asyncHandler(controller.getMine)); // FR-APPLY-12
router.get("/listing/:gigPostingId", asyncHandler(controller.getListing)); // FR-APPLY-01
router.post("/:id/withdraw", asyncHandler(controller.withdraw)); // FR-APPLY-03
router.post("/:id/select", asyncHandler(controller.select)); // FR-APPLY-06/07
router.post("/:id/decline", asyncHandler(controller.decline)); // FR-APPLY-08

export default router;
