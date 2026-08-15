/**
 * Account Management routes — mounted at /api/account by src/app.js.
 *
 * Epic: FR-ACC  ·  Owner: Afham
 * Requirements: see docs/requirements.md, module FR-ACC
 *
 * Keep this file thin. It maps URLs to controller functions and applies
 * middleware; it contains no logic of its own.
 */
const express = require("express");
const asyncHandler = require("../../utils/asyncHandler");
const controller = require("./account.controller");

const router = express.Router();

// Example of the shape to follow — delete once you add a real route:
// router.post("/", asyncHandler(controller.create));
// router.get("/:id", asyncHandler(controller.getById));

module.exports = router;
