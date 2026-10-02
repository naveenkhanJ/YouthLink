import app from "./src/app.js";
import config from "./src/config/index.js";
import { startPostingExpirySweep } from "./src/modules/posting/posting.expiry.js";

async function startServer() {
  app.listen(config.port, () => {
    console.log(`API listening on http://localhost:${config.port}`);
  });

  // FR-POST-13: close postings whose window has ended even when nobody opens them. Reads already
  // expire what they touch; this timer (every 5 minutes, unref'd so it never holds the process
  // open) covers postings nobody reads. Owned by the posting module, started here because this
  // file is the shared bootstrap.
  startPostingExpirySweep();
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});