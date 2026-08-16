/**
 * Thin fetch wrapper used by every API module.
 *
 * Centralised so that the base URL, auth header and error shape are defined
 * once. When login lands, the token is attached here — not in each caller.
 */
import { API_BASE_URL } from "../config";

let authToken = null;

/** Called after login so subsequent requests carry the token. */
export function setAuthToken(token) {
  authToken = token;
}

/**
 * @param {string} path - Path beginning with "/", e.g. "/api/account/register".
 * @param {object} [options] - fetch options; `body` may be a plain object.
 * @returns {Promise<any>} Parsed JSON response.
 * @throws {Error} With `.status` and `.fields` copied from the API's error shape.
 */
export async function request(path, options = {}) {
  const { body, headers, ...rest } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const error = new Error(
      data?.error || `Request failed (${response.status})`,
    );
    error.status = response.status;
    error.fields = data?.fields; // per-field messages, e.g. { phone: "..." }
    throw error;
  }

  return data;
}
