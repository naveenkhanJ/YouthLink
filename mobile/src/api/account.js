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

// Registration screen hasn't been built yet (backend endpoint exists —
// POST /api/account/register). Uncomment and finish when that screen lands.
// export function register(payload) {
//   return request("/api/account/register", { method: "POST", body: payload });
// }
