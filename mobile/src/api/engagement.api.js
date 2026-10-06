/**
 * Engagement Lifecycle API client.
 *
 * Epic: FR-ENG  ·  Owner: Naveenkhan
 */
import { request } from "./client";

/**
 * FR-ENG-14 — every engagement still on the signed-in user's list.
 * @returns {Promise<{engagements: Array<{id, status, counterpartyName, postingTitle, gigPostingId,
 *   hasPendingChange, nextAction}>}>}
 */
export function listEngagements() {
  return request("/api/engagements");
}

/**
 * One engagement as the viewer may see it — including `myCode`, the one check-in code the viewer
 * holds right now (never the other party's).
 * @param {string} engagementId
 * @returns {Promise<{engagement: object}>}
 */
export function getEngagement(engagementId) {
  return request(`/api/engagements/${engagementId}`);
}

/**
 * FR-ENG-01 — confirm a checkpoint by entering the other party's code.
 * @param {string} engagementId
 * @param {{checkpoint: "arrival"|"completion"|"payment", code: string}} payload
 */
export function verifyCheckpoint(engagementId, payload) {
  return request(`/api/engagements/${engagementId}/checkpoints/verify`, { method: "POST", body: payload });
}

/**
 * FR-ENG-12 — end a part-time engagement.
 * @param {string} engagementId
 * @param {{somethingWentWrong: boolean}} payload
 * @returns {Promise<{engagementStatus: string, next: "rating"|"dispute"}>}
 */
export function endEngagement(engagementId, payload) {
  return request(`/api/engagements/${engagementId}/end`, { method: "POST", body: payload });
}

/**
 * FR-ENG-09 — the worker's answer to a material change.
 * @param {string} engagementId
 * @param {{accept: boolean}} payload
 */
export function reconfirmMaterialChange(engagementId, payload) {
  return request(`/api/engagements/${engagementId}/reconfirm`, { method: "POST", body: payload });
}

/**
 * FR-ENG-09 / FR-ENG-11 — the employer's view of each worker's answer to the latest change (5.12).
 * @param {string} gigPostingId
 */
export function getChangeResponses(gigPostingId) {
  return request(`/api/engagements/change-responses/${gigPostingId}`);
}

/**
 * FR-ENG-03 — unable to confirm a checkpoint (opens the dispute route).
 * @param {string} engagementId
 * @param {{checkpoint: "arrival"|"completion"|"payment"}} payload - the live checkpoint
 */
export function unableToConfirmCheckpoint(engagementId, payload) {
  return request(`/api/engagements/${engagementId}/checkpoints/unable-to-confirm`, { method: "POST", body: payload });
}

/**
 * FR-ENG-05 / FR-ENG-06 — cancel an engagement. More than 48 hours to the start sends a request;
 * 48 hours or less cancels at once. The server decides which.
 * @param {string} engagementId
 * @param {{reason: string}} payload - one of FR-ENG-05's fixed reasons, e.g. "SCHEDULE_CONFLICT"
 * @returns {Promise<{mode: "REQUESTED", deadline: string} | {mode: "CANCELLED", isLate: boolean, lateReason: string|null}>}
 */
export function cancelEngagement(engagementId, payload) {
  return request(`/api/engagements/${engagementId}/cancel`, { method: "POST", body: payload });
}

/**
 * FR-ENG-05 — accept or reject the other party's pending cancellation request.
 * @param {string} engagementId
 * @param {{accept: boolean}} payload
 * @returns {Promise<{outcome: "ACCEPTED"|"REJECTED", engagementStatus: string}>}
 */
export function respondToCancellation(engagementId, payload) {
  return request(`/api/engagements/${engagementId}/cancellation/respond`, { method: "POST", body: payload });
}
