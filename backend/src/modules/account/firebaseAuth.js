/**
 * Firebase Phone Authentication ID-token verification for FR-ACC-08.
 *
 * Epic: FR-ACC · Owner: Afham
 *
 * Signup and OTP-login phone verification are delivered by Firebase Phone
 * Auth on the client; the backend only ever sees the resulting ID token and
 * must validate it server-side before treating the phone number as verified
 * (FR-ACC-08's third acceptance criterion). This module never generates or
 * checks an OTP itself — that's Firebase's job for these two paths. See
 * otpService.js for the three purposes the system generates its own codes for.
 *
 * Uses firebase-admin's modular API (getAuth from "firebase-admin/auth"),
 * not the older admin.auth() style — see the note in lib/firebaseAdmin.js.
 */
import { getAuth } from "firebase-admin/auth";
import app from "../../lib/firebaseAdmin.js";

const auth = getAuth(app);

// How recently the person must have completed the SMS check. Firebase ID tokens stay
// valid for an hour, so without this a token captured earlier could be replayed to
// log in or register. The app's own code-entry window is 5 minutes (FR-ACC-08 E4);
// this is deliberately a little longer so a slow connection never trips it.
const MAX_AUTH_AGE_SECONDS = 10 * 60;

/**
 * @param {string} idToken - The Firebase ID token from the client.
 * @returns {Promise<{ phoneNumber: string, uid: string }>}
 */
async function verifyFirebaseIdToken(idToken) {
  const decoded = await auth.verifyIdToken(idToken);
  if (!decoded.phone_number) {
    throw new Error("Firebase ID token has no verified phone number");
  }
  if (Date.now() / 1000 - decoded.auth_time > MAX_AUTH_AGE_SECONDS) {
    throw new Error("Firebase ID token is too old: phone verification must be recent");
  }
  return { phoneNumber: decoded.phone_number, uid: decoded.uid };
}

export { verifyFirebaseIdToken };
