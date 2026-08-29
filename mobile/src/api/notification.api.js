/**
 * Notification API calls (FR-NOTIF) — Pawan.
 */
import { request } from "./client.js";

/**
 * Gets user's notification preferences.
 */
export function getNotificationPreferences() {
  return request("/api/notifications/preferences", { method: "GET" });
}

/**
 * Updates user's notification preferences.
 */
export function updateNotificationPreferences(payload) {
  return request("/api/notifications/preferences", {
    method: "PATCH",
    body: payload,
  });
}

/**
 * Gets user's notification history.
 */
export function getNotifications() {
  return request("/api/notifications", { method: "GET" });
}

/**
 * Marks a notification as read.
 */
export function markNotificationAsRead(id) {
  return request(`/api/notifications/${id}/read`, { method: "PATCH" });
}
