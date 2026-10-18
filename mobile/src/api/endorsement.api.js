/**
 * Community Endorsement API (FR-ENDORSE) — every call the M8 screens make, one function per
 * endpoint under /api/endorsements. Errors arrive through request() as an Error with `.status`,
 * `.fields` and `.code` (NO_ELIGIBLE_MATCH | ALREADY_VOUCHED), and `.offline` when the server could
 * not be reached at all.
 */
import { request } from "./client";

/**
 * FR-ENDORSE-02 (8.1 / 8.1b): the job-seeker's own code. `code` is the unspaced value ("K7XA2B");
 * the screen spaces it for display only. `eligible: false` once the first rating has landed.
 * @returns {Promise<{ eligible: boolean, code: string|null, shareText: string|null }>}
 */
export function getMyEndorsementCode() {
  return request("/api/endorsements/me/code");
}

/**
 * FR-ENDORSE-02 (8.2): a Verifier checks a code. 404 NO_ELIGIBLE_MATCH for a wrong or closed code
 * (one message for both, NFR-PRIV-04); 409 ALREADY_VOUCHED.
 * @param {string} code - Unspaced, e.g. "K7XA2B".
 * @returns {Promise<{ workerId: string, name: string }>}
 */
export function lookupEndorsementCode(code) {
  return request("/api/endorsements/lookup-code", { method: "POST", body: { code } });
}

/**
 * FR-ENDORSE-03 (8.3): a Verifier looks up one person by phone. 404 NO_ELIGIBLE_MATCH whether the
 * number has no account or an ineligible one.
 * @param {string} phone - "+94771234567" (the backend also accepts 0…, 9-digit and 94… forms).
 * @returns {Promise<{ workerId: string, name: string, phone: string, alreadyVouched: boolean }>}
 */
export function searchEndorseeByPhone(phone) {
  return request("/api/endorsements/search-phone", { method: "POST", body: { phone } });
}

/**
 * FR-ENDORSE-04 (8.4): the single vouch action. Live on submit, no review step.
 * @param {{ workerId: string, entryPoint: "CODE"|"PHONE_SEARCH", attributes?: string[], reason?: string }} input
 *   attributes: PUNCTUALITY | HONESTY | RELIABILITY | SPECIFIC_SKILL | LENGTH_OF_ACQUAINTANCE;
 *   reason: at most 300 characters.
 * @returns {Promise<{ endorsement: { id: string, workerId: string, workerName: string, reason: string|null,
 *   attributes: string[], entryPoint: string, createdAt: string, revokedAt: null, active: true } }>}
 */
export function createEndorsement({ workerId, entryPoint, attributes, reason }) {
  return request("/api/endorsements", {
    method: "POST",
    body: {
      workerId,
      entryPoint,
      ...(attributes && attributes.length > 0 ? { attributes } : {}),
      ...(reason ? { reason } : {}),
    },
  });
}

/**
 * FR-ENDORSE-11 (8.5): the Verifier's own endorsements, newest first, revoked ones included, and
 * their live track record ("N endorsed, M went on to build a good rating").
 * @returns {Promise<{ trackRecord: { endorsedCount: number, goodRatingCount: number },
 *   endorsements: Array<{ id: string, workerId: string, workerName: string, reason: string|null,
 *   attributes: string[], entryPoint: string, createdAt: string, revokedAt: string|null,
 *   active: boolean, countsTowardGoodRating: boolean }> }>}
 */
export function getGivenEndorsements() {
  return request("/api/endorsements/given");
}

/**
 * FR-ENDORSE-07 (8.5c → 8.5d): revoke one of the Verifier's own endorsements. The worker is told.
 * @param {string} id
 * @returns {Promise<{ endorsement: { id: string, revokedAt: string } }>}
 */
export function revokeEndorsement(id) {
  return request(`/api/endorsements/${id}/revoke`, { method: "POST" });
}

/**
 * FR-ENDORSE-13 / -14 (8.6, 8.7): whether either one-time prompt is due for the signed-in
 * job-seeker. Always false for other roles.
 * @returns {Promise<{ showBioPrompt: boolean, showEndorsementSuggestion: boolean }>}
 */
export function getEndorsementPrompts() {
  return request("/api/endorsements/me/prompts");
}

/**
 * Records that a one-time prompt has been shown, so it never shows again.
 * @param {{ bioPromptShown?: true, endorsementSuggestionShown?: true }} flags
 * @returns {Promise<{ showBioPrompt: boolean, showEndorsementSuggestion: boolean }>}
 */
export function markEndorsementPromptsShown(flags) {
  return request("/api/endorsements/me/prompts", { method: "PATCH", body: flags });
}
