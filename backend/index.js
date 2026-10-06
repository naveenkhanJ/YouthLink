import app from "./src/app.js";
import config from "./src/config/index.js";
import { startPostingExpirySweep } from "./src/modules/posting/posting.expiry.js";
import { startEngagementDeadlineSweep } from "./src/modules/engagement/engagement.cancellation.js";

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
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});