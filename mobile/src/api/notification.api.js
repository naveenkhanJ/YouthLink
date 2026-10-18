/**
 * Notification API calls (FR-NOTIF) — Pawan.
 */
import { request } from "./client.js";

/** The job-seeker's two preferences (FR-NOTIF-03): { notifyUrgentOptIn, notifyNewGigOptOut }. */
export function getNotificationPreferences() {
  return request("/api/notifications/preferences", { method: "GET" });
}

/** Changes one or both preferences; returns both as stored. */
export function updateNotificationPreferences(payload) {
  return request("/api/notifications/preferences", { method: "PATCH", body: payload });
}

/** The history, newest first (FR-NOTIF-08): { notifications: [...] }; a digest has `children`. */
export function getNotifications() {
  return request("/api/notifications", { method: "GET" });
}

/** { count } of unread rows — the tab bar's notification dot. */
export function getUnreadNotificationCount() {
  return request("/api/notifications/unread-count", { method: "GET" });
}

/** Marks one notification read. */
export function markNotificationAsRead(id) {
  return request(`/api/notifications/${id}/read`, { method: "PATCH" });
}

/** Registers this phone's FCM token for push (FR-NOTIF-01/02/09). */
export function registerDeviceToken(token) {
  return request("/api/notifications/device-token", { method: "PUT", body: { token } });
}

/** Removes this phone's token on sign-out. */
export function unregisterDeviceToken(token) {
  return request("/api/notifications/device-token", { method: "DELETE", body: { token } });
}
