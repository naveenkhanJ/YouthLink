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
 * Fetches the employer's own gig postings.
 * @returns {Promise<Object>} List of postings.
 */
export function getMyGigPostings() {
  return request('/api/postings/mine', {
    method: 'GET',
  });
}
