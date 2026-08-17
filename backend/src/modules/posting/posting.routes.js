/**
 * Gig Posting routes — mounted at /api/postings by src/app.js.
 *
 * Epic: FR-POST  ·  Owner: Lahiru
 * Requirements: see docs/requirements.md, module FR-POST
 *
 * Keep this file thin. It maps URLs to controller functions and applies
 * middleware; it contains no logic of its own.
 */
const express = require("express");
const asyncHandler = require("../../utils/asyncHandler");
const controller = require("./posting.controller");

const router = express.Router();

router.get("/", asyncHandler(controller.list));
router.post("/", asyncHandler(controller.create));
router.get("/:id", asyncHandler(controller.getById));

module.exports = router;
