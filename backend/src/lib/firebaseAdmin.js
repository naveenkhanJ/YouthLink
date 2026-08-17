/**
 * The single shared Firebase Admin app instance.
 *
 * Shared infrastructure, not account-scoped — Account Management uses it for
 * Phone Auth ID-token verification (FR-ACC-08), and Notifications (FR-NOTIF)
 * will use the same instance later for FCM push. Import this everywhere;
 * don't call admin.initializeApp() a second time anywhere else, it throws.
 */
const admin = require("firebase-admin");
const path = require("path");
const config = require("../config");

let serviceAccount;
try {
  serviceAccount = require(path.resolve(config.firebaseServiceAccountPath));
} catch (err) {
  if (err.code === "MODULE_NOT_FOUND") {
    throw new Error(
      `Firebase Admin service-account key not found at ${config.firebaseServiceAccountPath}.\n` +
        "Download it from Firebase Console -> Project Settings -> Service Accounts -> " +
        "Generate New Private Key, save it in backend/ (its default filename contains " +
        '"firebase-adminsdk", already covered by .gitignore), and point ' +
        "FIREBASE_SERVICE_ACCOUNT_PATH at it in your .env.",
    );
  }
  throw err;
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
