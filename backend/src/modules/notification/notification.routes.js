/**
 * Notifications routes — mounted at /api/notifications by src/app.js, behind the shared
 * requireAuth (so req.user is always the signed-in account here).
 *
 * Epic: FR-NOTIF  ·  Owner: Pawan
 *
 * The history is for every role (FR-NOTIF-08: "All actor types"). The two preferences are a
 * job-seeker's only (FR-NOTIF-03); the service refuses anyone else with a 403.
 */
import express from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import controller from "./notification.controller.js";

const router = express.Router();

router.get("/preferences", asyncHandler(controller.getPreferences));
router.patch("/preferences", asyncHandler(controller.updatePreferences));
// Fixed paths before "/:id", so "unread-count" is never read as an id.
router.get("/unread-count", asyncHandler(controller.countUnread));
router.get("/", asyncHandler(controller.getNotifications));
router.patch("/:id/read", asyncHandler(controller.markAsRead));

export default router;
