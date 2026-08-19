/**
 * The single shared Firebase Admin app instance.
 *
 * Shared infrastructure, not account-scoped — Account Management uses it for
 * Phone Auth ID-token verification (FR-ACC-08), and Notifications (FR-NOTIF)
 * will use the same instance later for FCM push. Import this everywhere;
 * don't call initializeApp() a second time anywhere else, it throws.
 *
 * Uses firebase-admin's modular API (initializeApp/cert from
 * "firebase-admin/app"), not the older namespaced admin.credential.cert()
 * style — under ESM, firebase-admin's default export doesn't expose a
 * `.credential` namespace at all (confirmed directly: Object.keys() on the
 * default import lists `cert`, `initializeApp`, etc. flat, with no
 * `credential` property), so the namespaced style silently breaks here.
 *
 * Loads the service-account JSON via dynamic import(), not a static import —
 * the path is a runtime value (FIREBASE_SERVICE_ACCOUNT_PATH), and static
 * import specifiers must be literal strings. pathToFileURL is required on
 * Windows, where a raw filesystem path isn't a valid import specifier.
 * JSON imports need the `with { type: "json" }` attribute under ESM.
 */
import { initializeApp, cert } from "firebase-admin/app";
import path from "path";
import { pathToFileURL } from "url";
import config from "../config/index.js";

let serviceAccount;
try {
  const absolutePath = path.resolve(config.firebaseServiceAccountPath);
  const serviceAccountModule = await import(pathToFileURL(absolutePath).href, {
    with: { type: "json" },
  });
  serviceAccount = serviceAccountModule.default;
} catch (err) {
  if (err.code === "ERR_MODULE_NOT_FOUND") {
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

const app = initializeApp({
  credential: cert(serviceAccount),
});

export default app;
