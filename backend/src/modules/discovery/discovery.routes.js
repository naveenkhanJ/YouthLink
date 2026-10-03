/**
 * Discovery & Search routes — mounted at /api/discovery by src/app.js, behind the shared
 * requireAuth (so req.user is always the signed-in account here).
 *
 * Epic: FR-DISC  ·  Owner: Pawan
 */
import express from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import AppError from "../../utils/AppError.js";
import controller from "./discovery.controller.js";

const router = express.Router();

// FR-DISC-01..05 name one actor, the Youth Job-Seeker. requireAuth proves who is calling, not what
// they may do — and browsing also records the caller's browse centre for gig notifications, which
// only means something for a youth — so anyone else stops here.
function requireJobSeeker(req, res, next) {
  if (req.user.role !== "YOUTH_JOB_SEEKER") {
    return next(AppError.forbidden("Only job-seekers can browse gigs."));
  }
  next();
}

// Browse gigs around a centre, with filters, keyword and sort (FR-DISC-01..05).
router.get("/", requireJobSeeker, asyncHandler(controller.browse));

export default router;
