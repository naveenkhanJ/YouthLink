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
 */
const admin = require("../../lib/firebaseAdmin");

/**
 * @param {string} idToken - The Firebase ID token from the client.
 * @returns {Promise<{ phoneNumber: string, uid: string }>}
 */
async function verifyFirebaseIdToken(idToken) {
  const decoded = await admin.auth().verifyIdToken(idToken);
  if (!decoded.phone_number) {
    throw new Error("Firebase ID token has no verified phone number");
  }
  return { phoneNumber: decoded.phone_number, uid: decoded.uid };
}

module.exports = { verifyFirebaseIdToken };
