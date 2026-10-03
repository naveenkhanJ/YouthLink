// posting.applicants.js
// The seam between Gig Posting and Applying & Selection (YL-174 / FR-APPLY-09).
//
// When a posting stops accepting applications — withdrawn (FR-POST-12), expired
// (FR-POST-13) or filled (FR-POST-18) — its Pending applicants must be set to
// "Not selected" and told. That logic belongs to Applying & Selection
// (Naveenkhan), who exposes a function for it; Gig Posting only calls it.
//
// That function is not on `develop` yet (docs/workflow/agent-protocol.md §4.4:
// neither side waits). Until it lands this is a clearly marked NO-OP, so the
// withdrawal flow is complete and the call site is already in place.
//
// TODO(YL-174): when application.service.js exports the resolver, import it
// here and delete the no-op body — nothing else in this module changes.

/**
 * Resolve a posting's Pending applicants because the posting closed.
 *
 * @param {string} postingId
 * @param {"WITHDRAWN"|"EXPIRED"|"FILLED"} reason - why the posting stopped accepting applications
 * @returns {Promise<{ resolved: number }>} how many applications were resolved
 */
export async function resolvePendingApplicants(postingId, reason) { // eslint-disable-line no-unused-vars
  // NO-OP until YL-174 is on develop: Pending applicants are left as they are.
  return { resolved: 0 };
}

/**
 * Tell a posting's Pending applicants that its pay, time or size changed
 * (FR-POST-11 / FR-APPLY-10: "anyone who has applied is told what changed").
 * Same seam, same status as above: a NO-OP until Applying & Selection exposes the
 * notifier. The edit flow already calls it, so nothing else here changes later.
 *
 * @param {string} postingId
 * @param {string[]} changedFields - e.g. ["payAmount", "startAt"]
 * @returns {Promise<{ notified: number }>}
 */
export async function notifyPendingApplicantsOfChange(postingId, changedFields) { // eslint-disable-line no-unused-vars
  // TODO(YL-174): call the Applying & Selection notifier.
  return { notified: 0 };
}
