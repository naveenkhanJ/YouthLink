/**
 * Mobile app configuration.
 *
 * API_BASE_URL note: on an Android emulator, "localhost" means the emulator
 * itself, not your machine. Use 10.0.2.2 to reach a server running on your
 * computer. On a physical device, use your machine's LAN IP address.
 */
export const API_BASE_URL = "http://192.168.43.94:3000";

// No FIREBASE_CONFIG export here (FR-ACC-08) — @react-native-firebase's
// native modules auto-initialize from the native config files
// (google-services.json / GoogleService-Info.plist, see mobile/.gitignore),
// not a JS-side config object. That's a different integration path than the
// Firebase JS SDK, which is what this placeholder originally assumed;
// phone auth specifically needs the native modules — see
// .worklog/progress.md's Firebase setup entry for why.
