// posting.notify.js
// The seam between Gig Posting and Discovery & Notifications (FR-POST-10).
//
// After a posting is created, matching workers get an alert (urgent push or new-gig
// notice). That fan-out belongs to Discovery & Notifications; Gig Posting only calls it.
// The function is not on `develop` yet (docs/workflow/agent-protocol.md §4.4), so this is
// a clearly marked NO-OP.
//
// TODO(FR-POST-10): when backend/src/modules/notification/notification.service.js exports
// notifyNewGigPosted({ gigPostingId }), import it here and delete the no-op body.

/**
 * Tell the right workers about a newly created posting.
 *
 * @param {string} postingId
 * @returns {Promise<{ notified: number }>}
 */
export async function notifyNewGigPosted(postingId) { // eslint-disable-line no-unused-vars
  // NO-OP until Discovery & Notifications is on develop.
  return { notified: 0 };
}
