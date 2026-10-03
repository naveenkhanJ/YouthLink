// posting.applicants.js
// The seam between Gig Posting and Applying & Selection (YL-174 / FR-APPLY-09, FR-APPLY-10).
//
// When a posting stops accepting applications — withdrawn (FR-POST-12), expired
// (FR-POST-13) or filled (FR-POST-18) — its Pending applicants must be set to
// "Not selected" and told; when its pay, time or size changes, its Pending applicants
// are told what changed. That logic belongs to Applying & Selection (Naveenkhan), who
// exposes the two functions; Gig Posting only calls them, through this file, so every
// call site in this module stays exactly as it was while the seam was a no-op.
//
//   resolvePendingApplicants(postingId, "WITHDRAWN" | "EXPIRED" | "FILLED") → { resolved }
//   notifyPendingApplicantsOfChange(postingId, changedFields)             → { notified }
//
// Wired on integration/viva-demo (docs/workflow/agent-protocol.md §8.4). The import is a
// cycle (application.service imports posting.service); it is safe because neither side
// calls the other while the modules are still loading.
export {
  resolvePendingApplicants,
  notifyPendingApplicantsOfChange,
} from '../application/application.service.js';
