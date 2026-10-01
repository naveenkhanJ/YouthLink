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
// Opened from the confirmation link in an email, in a browser (FR-ACC-01 AC4).
router.get("/verify-email", asyncHandler(controller.verifyEmailPage));

router.post("/reset-password/channels", asyncHandler(controller.resetPasswordChannels));
// The minimal web page the emailed reset link opens (FR-ACC-10).
router.get("/reset-password/page", controller.resetPasswordPage);
router.post("/reset-password/request", asyncHandler(controller.resetPasswordRequest));
router.post("/reset-password/verify", asyncHandler(controller.resetPasswordVerify));
router.post("/reset-password/confirm", asyncHandler(controller.resetPasswordConfirm));

router.post("/recovery/request", asyncHandler(controller.recoveryRequest));
router.get("/recovery/status", asyncHandler(controller.recoveryStatus));
router.post("/recovery/confirm", asyncHandler(controller.recoveryConfirm));

router.post("/phone/change", requireAuth, asyncHandler(controller.changePhone));
router.post("/password/change", requireAuth, asyncHandler(controller.changePassword));
router.get("/me", requireAuth, asyncHandler(controller.getMe));
router.post("/email/change", requireAuth, asyncHandler(controller.requestEmailChange));
router.post("/email/cancel", requireAuth, asyncHandler(controller.cancelEmailChange));
router.get("/deletion", requireAuth, asyncHandler(controller.getDeletionStatus));
router.post("/delete", requireAuth, asyncHandler(controller.deleteAccount));
router.patch("/posting-as", requireAuth, asyncHandler(controller.updatePostingAs));
router.put("/nic", requireAuth, asyncHandler(controller.changeNic));
router.patch("/display-name", requireAuth, asyncHandler(controller.updateDisplayName));

export default router;

