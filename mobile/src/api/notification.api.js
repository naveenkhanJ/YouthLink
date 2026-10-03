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
