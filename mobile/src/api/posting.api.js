/**
 * Gig Posting API calls (FR-POST) — Lahiru.
 */
import { request } from './client.js';

/**
 * Creates a new gig posting.
 * @param {Object} payload - Validated posting fields.
 * @returns {Promise<Object>} The created posting response { status: 'ok', posting: {...} }
 */
export function createGigPosting(payload) {
  return request('/api/postings', {
    method: 'POST',
    body: payload,
  });
}

/**
 * Fetches a single gig posting by ID (with viewer-appropriate location privacy applied).
 * @param {string} id - Gig posting ID.
 * @returns {Promise<Object>} Posting details.
 */
export function getGigPosting(id) {
  return request(`/api/postings/${id}`, {
    method: 'GET',
  });
}

/**
 * Withdraws a posting (FR-POST-12). Allowed only while Open with nothing filled;
 * the server refuses with a 409 and the "lower Workers needed / cancel an
 * engagement" explanation otherwise.
 * @param {string} id - Gig posting ID.
 * @returns {Promise<Object>} { posting } — the posting, now Withdrawn.
 */
export function withdrawGigPosting(id) {
  return request(`/api/postings/${id}/withdraw`, {
    method: 'POST',
  });
}

/**
 * Edits a posting (FR-POST-11). Send only the fields that changed: title, payAmount,
 * workersNeeded, startAt, schedule. The server refuses with a 409 and a plain-language
 * reason when the posting can't be edited now (withdrawn, hidden for review, or a
 * material change after a place is filled).
 * @param {string} id - Gig posting ID.
 * @param {Object} changes - The changed fields.
 * @returns {Promise<Object>} { posting } — the posting as it now is.
 */
export function updateGigPosting(id, changes) {
  return request(`/api/postings/${id}`, {
    method: 'PATCH',
    body: changes,
  });
}

/**
 * Fetches the employer's own gig postings.
 * @returns {Promise<Object>} List of postings.
 */
export function getMyGigPostings() {
  return request('/api/postings/mine', {
    method: 'GET',
  });
}

/**
 * The areas a posting can be placed in (FR-POST-08), for the Location step's area picker.
 * Open to any signed-in user. The server keeps the list and takes a posting's coordinates
 * from it, so the app sends only the chosen name (`locationArea`).
 * @returns {Promise<Object>} { areas: [{ name, district, aliases }] }, sorted by name.
 */
export function getAreas() {
  return request('/api/postings/areas', {
    method: 'GET',
  });
}
