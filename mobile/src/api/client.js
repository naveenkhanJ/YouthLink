/**
 * Thin fetch wrapper used by every API module.
 *
 * Centralised so that the base URL, auth header and error shape are defined
 * once. When login lands, the token is attached here — not in each caller.
 */
import { API_BASE_URL } from "../config";

let authToken = null;
let authFailureCallback = null;

export function setAuthFailureCallback(fn) {
  authFailureCallback = fn;
}

/** Called after login so subsequent requests carry the token. */
export function setAuthToken(token) {
  authToken = token;
}

// Shown when the request never reached the server (no signal, wrong address, server down).
// There is no drawn offline frame for the account forms, so this follows the wording of the
// ones the prototype does draw (2.9 and 4.1: "You're offline, so ... couldn't be ...").
const OFFLINE_MESSAGE = "You're offline, so this couldn't be sent. Try again once you reconnect.";

/**
 * @param {string} path - Path beginning with "/", e.g. "/api/account/register".
 * @param {object} [options] - fetch options; `body` may be a plain object.
 * @returns {Promise<any>} Parsed JSON response.
 * @throws {Error} With `.status`, `.fields` and `.code` copied from the API's error shape;
 *   `.offline` is true when the server could not be reached at all.
 */
export async function request(path, options = {}) {
  const { body, headers, ...rest } = options;
  const sentToken = Boolean(authToken);

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      headers: {
        "Content-Type": "application/json",
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...headers,
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
  } catch {
    const error = new Error(OFFLINE_MESSAGE);
    error.offline = true;
    throw error;
  }

  // A proxy or crashed server can answer with HTML; that must not surface as a JSON
  // SyntaxError on the screen.
  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error = new Error(data?.error || `Request failed (${response.status})`);
    error.status = response.status;
    error.fields = data?.fields; // per-field messages, e.g. { phone: "..." }
    error.code = data?.code;

    // A session has ended ONLY when the server says so with SESSION_ENDED (expired or
    // invalid token, password changed, suspended, deleted — FR-ACC-07 amendment A32) and
    // this request was actually signed in. Any other 401/403 — a wrong password on login
    // or phone change, a role refusal — is an ordinary error and must not sign anyone out.
    if (sentToken && error.code === "SESSION_ENDED" && authFailureCallback) {
      authFailureCallback();
    }

    throw error;
  }

  return data;
}

/**
 * Splits a request() error into form-level and field-level messages for a
 * screen to render. Shared here (not per-screen) because `.fields` is a
 * general part of the API error shape every module's forms will hit, not
 * an Account-specific concern — the first screen using it shouldn't leave
 * every later screen to hand-roll the same split.
 *
 * @param {Error} err - An error thrown by request(), with optional `.fields`.
 * @returns {{ formError: string | null, fieldErrors: object }}
 */
export function parseApiError(err) {
  return {
    formError: err.fields ? null : err.message,
    fieldErrors: err.fields || {},
  };
}
