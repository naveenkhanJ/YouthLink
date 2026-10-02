/**
 * Account Management API calls (FR-ACC) — Afham.
 *
 * One file per backend module. Screens import from here rather than calling
 * `request` directly, so an endpoint change touches one place.
 */
import { request } from "./client";

/**
 * FR-ACC-07 password login path.
 * @param {{ phone: string, password: string }} payload
 * @returns {Promise<{ token: string, user: object }>}
 */
export function loginPassword(payload) {
  return request("/api/account/login/password", {
    method: "POST",
    body: payload,
  });
}

/**
 * FR-ACC-07 OTP login path. `payload.idToken` must be a Firebase ID token
 * from a client-side phone verification already confirmed successfully —
 * see LoginScreen.js.
 * @param {{ idToken: string }} payload
 * @returns {Promise<{ token: string, user: object }>}
 */
export function loginOtp(payload) {
  return request("/api/account/login/otp", {
    method: "POST",
    body: payload,
  });
}

/**
 * FR-ACC-01 registration. `payload.idToken` must be a Firebase ID token
 * from a client-side phone verification already confirmed successfully —
 * see RegisterScreen.js.
 * @param {object} payload
 * @returns {Promise<{ token: string, user: object }>} A session token and the created
 *   (public-shape) user: the person is signed in as soon as the account exists.
 */
export function register(payload) {
  return request("/api/account/register", { method: "POST", body: payload });
}

export function checkAvailability(payload) {
  return request("/api/account/check-availability", { method: "POST", body: payload });
}

/**
 * FR-ACC-10: which reset channels this phone can use. The email comes back masked, and an
 * unknown number looks the same as one with no verified email.
 * @param {{ phone: string }} payload - E.164, e.g. "+94771234567".
 * @returns {Promise<{ phone: string, email: string|null, emailVerified: boolean }>}
 */
export function getResetChannels(payload) {
  return request("/api/account/reset-password/channels", { method: "POST", body: payload });
}

/** @param {{ phone: string, channel: "PHONE"|"EMAIL" }} payload */
export function requestPasswordReset(payload) {
  return request("/api/account/reset-password/request", { method: "POST", body: payload });
}

/**
 * Checks the 6-digit reset code.
 * @param {{ phone: string, code: string }} payload
 * @returns {Promise<{ success: true, token: string }>} The token for the new-password step.
 */
export function verifyPasswordResetCode(payload) {
  return request("/api/account/reset-password/verify", { method: "POST", body: payload });
}

/** @param {{ token: string, newPassword: string }} payload */
export function confirmPasswordReset(payload) {
  return request("/api/account/reset-password/confirm", { method: "POST", body: payload });
}

/** FR-ACC-10 E8. @param {{ nic: string, birthdate: string, legalName: string, deviceId: string }} payload */
export function requestAccountRecovery(payload) {
  return request("/api/account/recovery/request", { method: "POST", body: payload });
}

/** @returns {Promise<{ status: "pending"|"approved"|"rejected"|"used" }>} */
export function getRecoveryStatus(deviceId) {
  return request(`/api/account/recovery/status?deviceId=${encodeURIComponent(deviceId)}`);
}

/** @param {{ deviceId: string, newPassword: string }} payload */
export function confirmRecovery(payload) {
  return request("/api/account/recovery/confirm", { method: "POST", body: payload });
}

/** FR-ACC-12. @param {{ password: string, idToken: string }} payload */
export function changePhone(payload) {
  return request("/api/account/phone/change", { method: "POST", body: payload });
}

/**
 * FR-ACC-11: change the password with the current one. Every other device is signed out; the
 * response carries a fresh token for THIS device (its old one is rejected like the rest).
 * @param {{ currentPassword: string, newPassword: string }} payload
 * @returns {Promise<{ success: true, token: string }>}
 */
export function changePassword(payload) {
  return request("/api/account/password/change", { method: "POST", body: payload });
}

/**
 * FR-ACC-15: edit the display (legal) name.
 * @param {{ legalName: string }} payload
 * @returns {Promise<{ legalName: string }>} The saved (trimmed) name.
 */
export function updateDisplayName(payload) {
  return request("/api/account/display-name", { method: "PATCH", body: payload });
}

/**
 * FR-ACC-13: correct the NIC, gated behind password re-entry only.
 * @param {{ password: string, nic: string }} payload
 * @returns {Promise<{ nicLast4: string }>}
 */
export function changeNic(payload) {
  return request("/api/account/nic", { method: "PUT", body: payload });
}

/**
 * The signed-in person's current account plus the email change still waiting for its
 * confirmation link, if any.
 * @returns {Promise<object>} The public user fields and `pendingEmail`.
 */
export function getMe() {
  return request("/api/account/me");
}

/**
 * FR-ACC-14: ask to add or change the email. The old address stays active until the link sent
 * to the new one is opened.
 * @param {{ email: string }} payload
 * @returns {Promise<{ pendingEmail: string }>}
 */
export function requestEmailChange(payload) {
  return request("/api/account/email/change", { method: "POST", body: payload });
}

/** FR-ACC-14: "Cancel this change" — the waiting link stops working. */
export function cancelEmailChange() {
  return request("/api/account/email/cancel", { method: "POST", body: {} });
}

/**
 * FR-ACC-17: can this person delete their account now? When an engagement blocks it, the
 * answer names it so the screen can say which one.
 * @returns {Promise<{ blocked: boolean, engagement: { title: string, withName: string }|null }>}
 */
export function getDeletionStatus() {
  return request("/api/account/deletion");
}

/**
 * FR-ACC-17: delete the account, gated behind the password and blocked while an engagement is
 * active. The identifying details are removed; ratings and engagements stay, anonymised.
 * @param {{ password: string }} payload
 */
export function deleteAccount(payload) {
  return request("/api/account/delete", { method: "POST", body: payload });
}

/**
 * FR-ACC-02 / FR-ACC-16: how an employer's account posts. Business needs a name (up to 100) and
 * may carry a bio (up to 300); Individual/Household clears both. The same call edits the business
 * name and bio of an account that already posts as Business.
 * @param {{ postingAsType: "INDIVIDUAL"|"BUSINESS", businessName?: string, businessBio?: string }} payload
 * @returns {Promise<{ postingAsType: string, businessName: string|null, businessBio: string|null }>}
 */
export function updatePostingAs(payload) {
  return request("/api/account/posting-as", { method: "PATCH", body: payload });
}
