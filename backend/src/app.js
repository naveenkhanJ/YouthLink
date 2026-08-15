/**
 * Express application assembly.
 *
 * Kept separate from index.js so the app can be required without starting a
 * server — useful for testing later, and it keeps the bootstrap file trivial.
 *
 * Order matters here and is the usual cause of confusing bugs:
 *   1. Global middleware (cors, json parsing)
 *   2. Routes
 *   3. notFound  — only reached when nothing above matched
 *   4. errorHandler — must be LAST, and must take four arguments
 */
const express = require("express");
const cors = require("cors");

const errorHandler = require("./middleware/errorHandler");
const notFound = require("./middleware/notFound");

const app = express();

app.use(cors());
app.use(express.json());

/**
 * Health check. Confirms the server is up and the environment loaded.
 * Deliberately unauthenticated and outside /api.
 */
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    database: process.env.DATABASE_URL ? "configured" : "missing DATABASE_URL",
  });
});

// ---------------------------------------------------------------------------
// Module routers. One line per epic; the module owns everything below its path.
// Add yours here when you create your module folder, then leave it alone.
// ---------------------------------------------------------------------------
app.use("/api/account", require("./modules/account/account.routes"));
app.use("/api/postings", require("./modules/posting/posting.routes"));
app.use("/api/discovery", require("./modules/discovery/discovery.routes"));
app.use(
  "/api/applications",
  require("./modules/application/application.routes"),
);
app.use(
  "/api/notifications",
  require("./modules/notification/notification.routes"),
);

// Sprint 2 epics — folders exist so nobody has to invent the layout later.
app.use("/api/engagements", require("./modules/engagement/engagement.routes"));
app.use("/api/ratings", require("./modules/rating/rating.routes"));
app.use("/api/profiles", require("./modules/profile/profile.routes"));
app.use(
  "/api/endorsements",
  require("./modules/endorsement/endorsement.routes"),
);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
