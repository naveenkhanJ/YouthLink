/**
 * Reports & Disputes API client (FR-DISPUTE, user side) — the endpoints under /api/disputes.
 *
 * One function per endpoint. Errors arrive as request()'s Error with the server's sentence in
 * `.message` (e.g. "You've already responded to this case.") and `.offline` when the server could
 * not be reached at all.
 *
 * Evidence travels as base64 inside JSON — the backend has no multipart parser — as
 * `{ mimeType: "image/jpeg"|"image/png"|"image/webp", dataBase64 }` with no "data:" prefix. The
 * picking, the 5 MB check and the three-photo cap happen before upload, in
 * screens/dispute/dispute.evidence.js (FR-DISPUTE-05: "the system blocks it").
 */
import { request } from "./client";

/**
 * FR-DISPUTE-01 — file a report on a posting, a person or an active engagement. The reporter stays
 * anonymous to the reported party (NFR-PRIV-05). Filing the same report twice is not an error: the
 * server answers 200 with `alreadyReported: true` and keeps the first one.
 *
 * @param {{ targetType: "POSTING"|"USER"|"ENGAGEMENT", targetId: string,
 *   reason: "FRAUD_SCAM"|"INAPPROPRIATE_CONTENT"|"SAFETY_CONCERN"|"HARASSMENT"|"OTHER", detail?: string }} payload
 * @returns {Promise<{ report: object, alreadyReported: boolean }>}
 */
export function fileReport(payload) {
  return request("/api/disputes/reports", { method: "POST", body: payload });
}

/**
 * FR-DISPUTE-07 — one dispute case as the viewer may see it (the 9.2 family).
 * @param {string} disputeCaseId
 * @returns {Promise<{ case: object }>} - CaseView: status, triggerType, checkpoint, viewerRole,
 *   postingTitle, counterpartName, respondentDeadline, hasResponded, canRespond, evidence,
 *   clarificationRequest, outcome…
 */
export function getCase(disputeCaseId) {
  return request(`/api/disputes/cases/${encodeURIComponent(disputeCaseId)}`);
}

/**
 * FR-DISPUTE-07 — an engagement's current case (the open one, else the latest), or null.
 * @param {string} engagementId
 * @returns {Promise<{ case: object|null }>}
 */
export function getCaseForEngagement(engagementId) {
  return request(`/api/disputes/cases?engagementId=${encodeURIComponent(engagementId)}`);
}

/**
 * FR-DISPUTE-04 / 05 — the respondent's side (9.3): a statement of up to 300 characters and/or up
 * to 3 photos. Once only, while the 48-hour window is open. The case comes back under review.
 * @param {string} disputeCaseId
 * @param {{ statement?: string, images?: Array<{ mimeType: string, dataBase64: string }> }} payload
 * @returns {Promise<{ case: object }>}
 */
export function respondToCase(disputeCaseId, payload) {
  return request(`/api/disputes/cases/${encodeURIComponent(disputeCaseId)}/respond`, { method: "POST", body: payload });
}

/**
 * FR-DISPUTE-05 — evidence from either party while the response window is open. No mobile screen
 * calls this yet: no frame draws the opener adding photos (see the M9 build notes).
 * @param {string} disputeCaseId
 * @param {{ images: Array<{ mimeType: string, dataBase64: string }> }} payload
 * @returns {Promise<{ case: object }>}
 */
export function addEvidence(disputeCaseId, payload) {
  return request(`/api/disputes/cases/${encodeURIComponent(disputeCaseId)}/evidence`, { method: "POST", body: payload });
}

/**
 * The path of one of the viewer's own evidence images (served to its submitter only, with the
 * Bearer header). Returned as a path rather than fetched: an <Image> needs the URL and headers.
 * @param {string} evidenceId
 * @returns {string}
 */
export function evidencePath(evidenceId) {
  return `/api/disputes/evidence/${encodeURIComponent(evidenceId)}`;
}
