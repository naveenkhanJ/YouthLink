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

const router = express.Router();

router.post("/register", asyncHandler(controller.register));
router.post("/login/password", asyncHandler(controller.loginPassword));
router.post("/login/otp", asyncHandler(controller.loginOtp));

export default router;
