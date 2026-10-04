/**
 * Notifications routes — mounted at /api/notifications by src/app.js.
 *
 * Epic: FR-NOTIF  ·  Owner: Pawan
 */
import express from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import requireAuth from "../../middleware/requireAuth.js";
import controller from "./notification.controller.js";

const router = express.Router();

// All notification routes require authentication
router.use(requireAuth);

router.get("/preferences", asyncHandler(controller.getPreferences));
router.patch("/preferences", asyncHandler(controller.updatePreferences));
router.get("/", asyncHandler(controller.getNotifications));
router.patch("/:id/read", asyncHandler(controller.markAsRead));

export default router;
