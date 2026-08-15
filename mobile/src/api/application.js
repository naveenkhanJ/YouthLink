/**
 * Applying & Selection API calls (FR-APPLY) — Naveenkhan.
 *
 * One file per backend module. Screens import from here rather than calling
 * `request` directly, so an endpoint change touches one place. Mirrors
 * backend/src/modules/application/application.routes.js exactly.
 */
import { request } from "./client";

/** FR-APPLY-02 — apply to a posting. Note is optional, capped at 300 chars server-side. */
export function applyToPosting({ gigPostingId, note }) {
  return request("/api/applications", {
    method: "POST",
    body: { gigPostingId, note },
  });
}

/** FR-APPLY-03 — withdraw one's own Pending application. */
export function withdrawApplication(applicationId) {
  return request(`/api/applications/${applicationId}/withdraw`, {
    method: "POST",
  });
}

/**
 * A worker's own applications — status, and (once SELECTED) the revealed
 * employer contact + precise address via the nested `engagement` (FR-APPLY-07).
 */
export function getMyApplications() {
  return request("/api/applications/mine", { method: "GET" });
}

/** FR-APPLY-04 / FR-APPLY-05 — the Employer's three-tier sorted applicant pool. */
export function getApplicantPool(gigPostingId) {
  return request(`/api/applications?gigPostingId=${gigPostingId}`, {
    method: "GET",
  });
}

/** FR-APPLY-06 / FR-APPLY-07 — select an applicant, creating an Engagement. */
export function selectApplicant(applicationId) {
  return request(`/api/applications/${applicationId}/select`, {
    method: "POST",
  });
}

/** FR-APPLY-08 — explicit decline, no reason attached. */
export function declineApplicant(applicationId) {
  return request(`/api/applications/${applicationId}/decline`, {
    method: "POST",
  });
}
