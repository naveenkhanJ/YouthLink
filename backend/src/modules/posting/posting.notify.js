// posting.notify.js
// The seam between Gig Posting and Discovery & Notifications (FR-POST-10).
//
// After a posting is created, matching workers get an alert (urgent push or new-gig
// notice, FR-NOTIF-01/02). That fan-out belongs to Discovery & Notifications (Pawan);
// Gig Posting only calls it, through this file.
//
//   notifyNewGigPosted(postingId) → { notified }
//
// It never throws: a failed notification is logged by the notification module and the
// posting stays created. Wired on integration/viva-demo (agent-protocol.md §8.4).
export { notifyNewGigPosted } from '../notification/notification.service.js';
