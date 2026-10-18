/**
 * Reports & Disputes routes — mounted at /api/disputes by src/app.js (behind requireAuth).
 *
 * Epic: FR-DISPUTE (user side)
 *
 * Evidence images arrive as base64 inside JSON (there is no multipart parser in this project), so
 * the two upload routes need a larger body limit than the app's global express.json() default of
 * 100kb: three 5 MB images are about 20 MB once base64-encoded. The global parser runs BEFORE this
 * router, so a limit set only here would come too late — app.js mounts
 * `disputeUploadBodyParser` (below) ahead of its global parser, and that one reads the body of the
 * two upload routes only. The per-route `uploadJson` here is a no-op once a body has been read
 * (body-parser skips a request it has already finished), and keeps the routes correct on their own.
 */
import express from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import controller from "./dispute.controller.js";

/** 3 images × 5 MB, base64-encoded (×4/3), plus the statement and JSON overhead. */
export const UPLOAD_BODY_LIMIT = "25mb";

const uploadJson = express.json({ limit: UPLOAD_BODY_LIMIT });

// Relative to the /api/disputes mount point.
const UPLOAD_PATH = /^\/cases\/[^/]+\/(respond|evidence)\/?$/;

/**
 * For app.js, mounted at /api/disputes BEFORE the global `app.use(express.json())`: parses the
 * body of the two evidence-upload routes with the larger limit, and leaves every other request to
 * the global parser untouched.
 */
export function disputeUploadBodyParser(req, res, next) {
  if (req.method === "POST" && UPLOAD_PATH.test(req.path)) return uploadJson(req, res, next);
  return next();
}

const router = express.Router();

// FR-DISPUTE-01 / 02 — file a report.
router.post("/reports", asyncHandler(controller.fileReport));

// FR-DISPUTE-07 — the case screen (9.2 family). "/cases" (with ?engagementId=) before "/cases/:id".
router.get("/cases", asyncHandler(controller.caseForEngagement));
router.get("/cases/:id", asyncHandler(controller.getCase));

// FR-DISPUTE-04 / 05 — respond (9.3), and evidence from either party.
router.post("/cases/:id/respond", uploadJson, asyncHandler(controller.respond));
router.post("/cases/:id/evidence", uploadJson, asyncHandler(controller.addEvidence));

// FR-DISPUTE-05 — one of the viewer's own evidence images.
router.get("/evidence/:evidenceId", asyncHandler(controller.evidenceFile));

export default router;
