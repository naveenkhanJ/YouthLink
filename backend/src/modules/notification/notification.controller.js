/**
 * Notifications controllers — HTTP layer.
 *
 * Epic: FR-NOTIF  ·  Owner: Pawan
 */
import service from "./notification.service.js";

export default {
  async getPreferences(req, res) {
    const preferences = await service.getPreferences({ userId: req.user.id });
    res.json(preferences);
  },

  async updatePreferences(req, res) {
    const { notifyUrgentOptIn, notifyNewGigOptOut } = req.body;
    const preferences = await service.updatePreferences({
      userId: req.user.id,
      notifyUrgentOptIn,
      notifyNewGigOptOut,
    });
    res.json(preferences);
  },

  async getNotifications(req, res) {
    const notifications = await service.getNotifications({ userId: req.user.id });
    res.json(notifications);
  },

  async markAsRead(req, res) {
    await service.markAsRead({ notificationId: req.params.id, userId: req.user.id });
    res.json({ status: "ok" });
  },
};
