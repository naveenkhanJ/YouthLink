/**
 * Account Management routes — mounted at /api/account by src/app.js.
 *
 * Epic: FR-ACC  ·  Owner: Afham
 * Requirements: see docs/requirements.md, module FR-ACC
 *
 * Keep this file thin. It maps URLs to controller functions and applies
 * middleware; it contains no logic of its own.
 */
import express from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import controller from "./account.controller.js";
import requireAuth from "../../middleware/requireAuth.js";

const router = express.Router();

router.post("/register", asyncHandler(controller.register));
router.post("/login/password", asyncHandler(controller.loginPassword));
router.post("/login/otp", asyncHandler(controller.loginOtp));
router.post("/check-availability", asyncHandler(controller.checkAvailability));

router.post("/reset-password/channels", asyncHandler(controller.resetPasswordChannels));
router.post("/reset-password/request", asyncHandler(controller.resetPasswordRequest));
router.post("/reset-password/verify", asyncHandler(controller.resetPasswordVerify));
router.post("/reset-password/confirm", asyncHandler(controller.resetPasswordConfirm));

router.post("/recovery/request", asyncHandler(controller.recoveryRequest));
router.get("/recovery/status", asyncHandler(controller.recoveryStatus));
router.post("/recovery/confirm", asyncHandler(controller.recoveryConfirm));

router.post("/phone/change", requireAuth, asyncHandler(controller.changePhone));

export default router;

