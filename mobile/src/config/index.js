/**
 * Mobile app configuration.
 *
 * API_BASE_URL — where the backend is. Set it per machine in `mobile/.env`
 * (git-ignored; copy `mobile/.env.example`), never in this file:
 *
 *   EXPO_PUBLIC_API_URL=http://10.0.2.2:3000        Android emulator → your computer
 *   EXPO_PUBLIC_API_URL=http://192.168.1.20:3000    physical phone → your computer's LAN IP
 *
 * Expo inlines EXPO_PUBLIC_* variables into the JavaScript bundle when Metro
 * builds it (https://docs.expo.dev/guides/environment-variables/), so the
 * same development build works for everyone — only each person's .env
 * differs. After changing .env, reload the app fully. The reference must stay
 * written as `process.env.EXPO_PUBLIC_API_URL` (dot notation) or Expo will
 * not inline it.
 *
 * The fallback is the emulator address, so an emulator works with no .env.
 * A LAN IP committed here only works on the network it was written on.
 */
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:3000";

// No FIREBASE_CONFIG export here (FR-ACC-08) — @react-native-firebase's
// native modules auto-initialize from the native config files
// (google-services.json / GoogleService-Info.plist, see mobile/.gitignore),
// not a JS-side config object. Phone auth specifically needs the native
// modules — see mobile/src/README.md.
