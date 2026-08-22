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
 * FR-ACC-01 registration. `payload.idToken` must be a Firebase ID token
 * from a client-side phone verification already confirmed successfully —
 * see RegisterScreen.js.
 * @param {object} payload
 * @returns {Promise<object>} The created (public-shape) User row — no
 *   token; registration doesn't log the user in, unlike login.
 */
export function register(payload) {
  return request("/api/account/register", { method: "POST", body: payload });
}
