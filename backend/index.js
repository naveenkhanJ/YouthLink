import app from "./src/app.js";
import config from "./src/config/index.js";
import { startPostingExpirySweep } from "./src/modules/posting/posting.expiry.js";
import { startEngagementDeadlineSweep } from "./src/modules/engagement/engagement.cancellation.js";
import { startNoApplicantNudgeSweep } from "./src/modules/posting/posting.nudge.js";
import { startRecoveryPurgeSweep } from "./src/modules/account/recoveryPurge.js";
import { startRatingRevealSweep } from "./src/modules/rating/rating.service.js";
import { startDisputeSweeps } from "./src/modules/dispute/dispute.sweep.js";
import { startPushSweep } from "./src/modules/notification/notification.sender.js";

async function startServer() {
  app.listen(config.port, () => {
    console.log(`API listening on http://localhost:${config.port}`);
  });

  // FR-POST-13: close postings whose window has ended even when nobody opens them. Reads already
  // expire what they touch; this timer (every 5 minutes, unref'd so it never holds the process
  // open) covers postings nobody reads. Owned by the posting module, started here because this
  // file is the shared bootstrap.
  startPostingExpirySweep();

  // FR-ENG-05 / FR-ENG-09: a cancellation request nobody answered within 48 hours resolves against
  // the non-responder, and a re-confirmation whose window closed routes to cancellation. Reads of
  // engagements already settle what they touch; this timer (same pattern as above) covers the rest,
  // so a posting's edit lock lifts even if nobody opens the engagement. Owned by the engagement module.
  startEngagementDeadlineSweep();

  // FR-DISPUTE-04 / FR-ENG-13: a dispute whose 48-hour response window lapsed goes to review, and a
  // one-off gig whose start passed without completion gets the stalled prompt (24 h) and, after 7
  // silent days, the auto-flag. Owned by the dispute and engagement modules.
  startDisputeSweeps();

  // FR-POST-17: nudge an employer once when a posting still has no applicants (24 hours live, or
  // halfway to the start for an urgent gig). Owned by the posting module.
  startNoApplicantNudgeSweep();

  // FR-ACC-10 (batch E8): rejected or completed recovery requests lose their identity details after
  // 90 days. Owned by the account module.
  startRecoveryPurgeSweep();

  // FR-NOTIF-11 / FR-RATE-02: a 14-day rating window that ran out is revealed (and both parties told)
  // even if nobody opens the rating screen. Owned by the rating module.
  startRatingRevealSweep();

  // FR-NOTIF-01/02 and every other user notification: send committed Notification rows to the
  // person's phones through FCM (every 5 seconds). Rows are written by each module as before; this
  // outbox sweep is the only place a push is sent. Owned by the notification module.
  startPushSweep();
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});