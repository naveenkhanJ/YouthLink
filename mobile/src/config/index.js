/**
 * Mobile app configuration.
 *
 * API_BASE_URL note: on an Android emulator, "localhost" means the emulator
 * itself, not your machine. Use 10.0.2.2 to reach a server running on your
 * computer. On a physical device, use your machine's LAN IP address.
 *
 * Reverted to 10.0.2.2 on demo/integration-showcase (was 192.168.43.94, a
 * developer's own LAN address committed in 4f13daa). A hardcoded LAN IP only
 * resolves on the network it was written on — on the emulator and on every
 * other machine it fails with "Failed to connect", which is what it did here.
 * 10.0.2.2 is the emulator's fixed alias for the host, so it works for anyone
 * running the standard Android emulator setup this project documents.
 * Flag to the FR-APPLY owner: this needs reverting on his branch too, or the
 * next person to pull develop hits the same wall.
 */
export const API_BASE_URL = "http://10.0.2.2:3000";

// No FIREBASE_CONFIG export here (FR-ACC-08) — @react-native-firebase's
// native modules auto-initialize from the native config files
// (google-services.json / GoogleService-Info.plist, see mobile/.gitignore),
// not a JS-side config object. That's a different integration path than the
// Firebase JS SDK, which is what this placeholder originally assumed;
// phone auth specifically needs the native modules — see
// .worklog/progress.md's Firebase setup entry for why.
