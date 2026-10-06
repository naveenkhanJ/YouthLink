/**
 * Screen manifest for the FR-NOTIF module — Pawan.
 *
 * Every screen draws its own chrome, so the navigator's header is off for all of them.
 */
import NotificationHistoryScreen from "./NotificationHistoryScreen";
import NotificationPreferencesScreen from "./NotificationPreferencesScreen";
import NotificationAppearanceScreen from "./NotificationAppearanceScreen";

export default [
  {
    // 3.10x family — every role's Notifications tab (tab key "notifications").
    name: "NotificationHistory",
    component: NotificationHistoryScreen,
    options: { headerShown: false },
  },
  {
    // 3.11 / 3.11e / 3.11v — also opened from Settings (M1 1.10) by this name.
    name: "NotificationPreferences",
    component: NotificationPreferencesScreen,
    options: { headerShown: false },
  },
  {
    // 3.13 — how the two gig notifications look.
    name: "NotificationAppearance",
    component: NotificationAppearanceScreen,
    options: { headerShown: false },
  },
];
