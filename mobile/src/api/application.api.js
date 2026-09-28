/**
 * Applying & Selection API calls (FR-APPLY) — Naveenkhan.
 *
 * One file per backend module. Screens import from here rather than calling
 * `request` directly, so an endpoint change touches one place. Mirrors
 * backend/src/modules/application/application.routes.js exactly.
 */
import { request } from "./client";

/**
 * FR-APPLY-01 — the job-seeker's listing detail (3.12): the posting at area precision, the
 * employer's trust signals, and this worker's live application on it, if any.
 * @returns {Promise<{ posting: object, employer: { displayName: string, postedAsType: string,
 *   businessBio: string|null, phoneVerified: boolean }, myApplication: { id: string, status: string }|null }>}
 */
export function getListingDetail(gigPostingId) {
  return request(`/api/applications/listing/${encodeURIComponent(gigPostingId)}`);
}

/** FR-APPLY-02 — apply to a posting. The note is optional, at most 300 characters. */
export function applyToPosting({ gigPostingId, note }) {
  return request("/api/applications", {
    method: "POST",
    body: { gigPostingId, note },
  });
}

/** FR-APPLY-03 — withdraw one's own Pending application. */
export function withdrawApplication(applicationId) {
  return request(`/api/applications/${encodeURIComponent(applicationId)}/withdraw`, {
    method: "POST",
  });
}

/**
 * FR-APPLY-12 — the worker's own list: every pending application and every one decided or
 * withdrawn in the last 30 days, already in display order.
 */
export function getMyApplications() {
  return request("/api/applications/mine");
}

/**
 * FR-APPLY-04 / FR-APPLY-05 — the employer's pool for one posting, sorted by trust tier.
 * @returns {Promise<{ posting: object, applicants: object[] }>}
 */
export function getApplicantPool(gigPostingId) {
  return request(`/api/applications?gigPostingId=${encodeURIComponent(gigPostingId)}`);
}

/**
 * FR-APPLY-06 / FR-APPLY-07 — select an applicant. Creates the Engagement and returns the
 * worker's phone (now revealed to the employer) — never a check-in code.
 */
export function selectApplicant(applicationId) {
  return request(`/api/applications/${encodeURIComponent(applicationId)}/select`, {
    method: "POST",
  });
}

/** FR-APPLY-08 — explicit decline, no reason attached; the applicant is told at once. */
export function declineApplicant(applicationId) {
  return request(`/api/applications/${encodeURIComponent(applicationId)}/decline`, {
    method: "POST",
  });
}
