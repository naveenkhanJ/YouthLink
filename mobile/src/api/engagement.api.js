/**
 * Engagement Lifecycle API client.
 *
 * Epic: FR-ENG  ·  Owner: Naveenkhan
 */
import { request } from "./client";

/**
 * List all engagements for the signed-in user.
 * @returns {Promise<{engagements: Array}>}
 */
export async function listEngagements() {
  return request("/api/engagements");
}

/**
 * Get single engagement details.
 * @param {string} engagementId
 * @returns {Promise<{engagement: Object}>}
 */
export async function getEngagement(engagementId) {
  return request(`/api/engagements/${engagementId}`);
}

/**
 * End a part-time engagement (FR-ENG-12).
 * @param {string} engagementId
 * @param {{didSomethingGoWrong: boolean, issueDetails?: string}} payload
 * @returns {Promise<Object>}
 */
export async function endEngagement(engagementId, payload) {
  return request(`/api/engagements/${engagementId}/end`, {
    method: "POST",
    body: payload,
  });
}

/**
 * Verify checkpoint code (FR-ENG-01).
 * @param {string} engagementId
 * @param {{checkpoint: "arrival"|"completion"|"payment", code: string}} payload
 * @returns {Promise<Object>}
 */
export async function verifyCheckpoint(engagementId, payload) {
  return request(`/api/engagements/${engagementId}/checkpoints/verify`, {
    method: "POST",
    body: payload,
  });
}

/**
 * Fallback when unable to confirm code (FR-ENG-03).
 * @param {string} engagementId
 * @param {{checkpoint: string, reason?: string}} payload
 * @returns {Promise<Object>}
 */
export async function unableToConfirmCheckpoint(engagementId, payload) {
  return request(`/api/engagements/${engagementId}/checkpoints/unable-to-confirm`, {
    method: "POST",
    body: payload,
  });
}

/**
 * Cancel engagement (FR-ENG-05, FR-ENG-06).
 * @param {string} engagementId
 * @param {{reason?: string}} payload
 * @returns {Promise<Object>}
 */
export async function cancelEngagement(engagementId, payload) {
  return request(`/api/engagements/${engagementId}/cancel`, {
    method: "POST",
    body: payload,
  });
}

/**
 * Re-confirm material change (FR-ENG-09).
 * @param {string} engagementId
 * @param {{accept: boolean}} payload
 * @returns {Promise<Object>}
 */
export async function reconfirmMaterialChange(engagementId, payload) {
  return request(`/api/engagements/${engagementId}/reconfirm`, {
    method: "POST",
    body: payload,
  });
}
