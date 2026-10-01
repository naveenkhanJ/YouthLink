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
import requireAuth from "./middleware/requireAuth.js";

import accountRoutes from "./modules/account/account.routes.js";
import postingRoutes from "./modules/posting/posting.routes.js";
import discoveryRoutes from "./modules/discovery/discovery.routes.js";
import applicationRoutes from "./modules/application/application.routes.js";
import notificationRoutes from "./modules/notification/notification.routes.js";
import engagementRoutes from "./modules/engagement/engagement.routes.js";
import ratingRoutes from "./modules/rating/rating.routes.js";
import profileRoutes from "./modules/profile/profile.routes.js";
import endorsementRoutes from "./modules/endorsement/endorsement.routes.js";

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
//
// Every router except account is mounted behind requireAuth, so "every endpoint
// requires sign-in" (docs/module-ownership.md, ruled 2026-09-25) holds even if a
// module forgets to protect a route, and req.user is always set for handlers.
// Account is the exception because it contains the endpoints that get a person
// signed in (register, login, password reset, recovery); it applies requireAuth
// per route itself. Role checks (the actor table) stay in each module.
// ---------------------------------------------------------------------------
app.use("/api/account", accountRoutes);
app.use("/api/postings", requireAuth, postingRoutes);
app.use("/api/discovery", requireAuth, discoveryRoutes);
app.use("/api/applications", requireAuth, applicationRoutes);
app.use("/api/notifications", requireAuth, notificationRoutes);
app.use("/api/engagements", requireAuth, engagementRoutes);
app.use("/api/ratings", requireAuth, ratingRoutes);
app.use("/api/profiles", requireAuth, profileRoutes);
app.use("/api/endorsements", requireAuth, endorsementRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
