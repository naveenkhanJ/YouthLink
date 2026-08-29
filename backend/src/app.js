/**
 * Express application assembly.
 *
 * Kept separate from index.js so the app can be imported without starting a
 * server — useful for testing later, and it keeps the bootstrap file trivial.
 *
 * Order matters here and is the usual cause of confusing bugs:
 *   1. Global middleware (cors, json parsing)
 *   2. Routes
 *   3. notFound  — only reached when nothing above matched
 *   4. errorHandler — must be LAST, and must take four arguments
 */
import express from "express";
import cors from "cors";

import errorHandler from "./middleware/errorHandler.js";
import notFound from "./middleware/notFound.js";

import accountRoutes from "./modules/account/account.routes.js";
import postingRoutes from "./modules/posting/posting.routes.js";
import discoveryRoutes from "./modules/discovery/discovery.routes.js";
import applicationRoutes from "./modules/application/application.routes.js";
import notificationRoutes from "./modules/notification/notification.routes.js";
import engagementRoutes from "./modules/engagement/engagement.routes.js";
import ratingRoutes from "./modules/rating/rating.routes.js";
import profileRoutes from "./modules/profile/profile.routes.js";
import endorsementRoutes from "./modules/endorsement/endorsement.routes.js";

// DEMO-ONLY — remove with the rest of src/demo/ before this branch goes
// anywhere near develop. See DEMO.md.
import demoRoutes from "./demo/demo.routes.js";

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
app.use("/api/account", accountRoutes);
app.use("/api/postings", postingRoutes);
app.use("/api/discovery", discoveryRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/notifications", notificationRoutes);

// Sprint 2 epics — folders exist so nobody has to invent the layout later.
app.use("/api/engagements", engagementRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/endorsements", endorsementRoutes);

// DEMO-ONLY — stands in for the not-yet-built Discovery browse and a
// notifications read, so the post -> apply -> select loop can be shown end to
// end. Delete this line with src/demo/. See DEMO.md.
app.use("/api/demo", demoRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
