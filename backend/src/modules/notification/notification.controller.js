/**
 * Notifications controllers — HTTP layer.
 *
 * Epic: FR-NOTIF  ·  Owner: Pawan
 */
import service from "./notification.service.js";
import { registerDeviceToken, unregisterDeviceToken } from "./notification.sender.js";

export default {
  // GET /api/notifications/preferences — FR-NOTIF-03 (job-seekers only)
  async getPreferences(req, res) {
    res.json(await service.getPreferences({ user: req.user }));
  },

  // PATCH /api/notifications/preferences — FR-NOTIF-03 (job-seekers only)
  async updatePreferences(req, res) {
    const { notifyUrgentOptIn, notifyNewGigOptOut } = req.body ?? {};
    res.json(await service.updatePreferences({ user: req.user, notifyUrgentOptIn, notifyNewGigOptOut }));
  },

  // GET /api/notifications — the history, newest first (FR-NOTIF-08)
  async getNotifications(req, res) {
    res.json({ notifications: await service.getNotifications({ userId: req.user.id }) });
  },

  // GET /api/notifications/unread-count — for the tab bar's dot
  async countUnread(req, res) {
    res.json(await service.countUnread({ userId: req.user.id }));
  },

  // PUT /api/notifications/device-token — body { token } (FR-NOTIF-01/02/09)
  async registerDeviceToken(req, res) {
    await registerDeviceToken({ userId: req.user.id, token: req.body?.token });
    res.json({ status: "ok" });
  },

  // DELETE /api/notifications/device-token — body { token }, on sign-out
  async unregisterDeviceToken(req, res) {
    await unregisterDeviceToken({ userId: req.user.id, token: req.body?.token });
    res.json({ status: "ok" });
  },

  // PATCH /api/notifications/:id/read
  async markAsRead(req, res) {
    await service.markAsRead({ notificationId: req.params.id, userId: req.user.id });
    res.json({ status: "ok" });
  },
};
