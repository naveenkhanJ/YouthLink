/**
 * Screen manifest for the FR-NOTIF module — Pawan.
 */
import NotificationPreferencesScreen from "./NotificationPreferencesScreen";

export default [
  {
    name: "NotificationPreferences",
    component: NotificationPreferencesScreen,
    // 3.11 draws its own ScreenHeader.
    options: { headerShown: false },
  },
];
