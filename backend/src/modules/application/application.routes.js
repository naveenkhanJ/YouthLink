/**
 * Applying & Selection routes — mounted at /api/applications by src/app.js.
 *
 * Epic: FR-APPLY  ·  Owner: Naveenkhan
 * Requirements: see docs/requirements.md, module FR-APPLY
 *
 * Keep this file thin. It maps URLs to controller functions and applies
 * middleware; it contains no logic of its own.
 */
const express = require("express");
const asyncHandler = require("../../utils/asyncHandler");
const controller = require("./application.controller");

const router = express.Router();

// Example of the shape to follow — delete once you add a real route:
// router.post("/", asyncHandler(controller.create));
// router.get("/:id", asyncHandler(controller.getById));

module.exports = router;
