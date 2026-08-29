/**
 * DEMO-ONLY ROUTES — integration showcase branch. NOT part of any epic.
 *
 * ===========================================================================
 * This file exists only on `demo/integration-showcase` and must never be
 * merged into `develop`. See DEMO.md at the repo root for the removal steps.
 * ===========================================================================
 *
 * Why it exists: the four modules were built to an agreed contract but nothing
 * yet connects them, and two gaps block a demo of the core loop
 * (post -> discover -> apply -> select):
 *
 *   1. There is no "list all open postings" endpoint anywhere. Browsing is
 *      Discovery's job (FR-DISC, Pawan) and that module is an empty stub, so a
 *      worker has no way to reach a posting in order to apply to it.
 *   2. Nothing surfaces the Notification rows that Applying & Selection writes
 *      on select/decline/auto-not-selected, so FR-APPLY-08/09 are invisible.
 *
 * These are deliberately NOT implemented inside modules/discovery/ or
 * modules/notification/. Those belong to Pawan; squatting in them would create
 * a merge conflict with his real work and blur who wrote what at the viva.
 * When his slice lands, delete this folder and repoint the mobile hub.
 *
 * What this is NOT: FR-DISC-01's radius browsing, auto-expansion, filters or
 * sort order. This is an unfiltered list ordered newest-first. It is scaffolding
 * to connect two other people's finished modules, not an implementation of a
 * third person's requirements.
 */
import express from "express";

import prisma from "../lib/prisma.js";
import asyncHandler from "../utils/asyncHandler.js";
import requireAuth from "../middleware/requireAuth.js";
import { sanitizePostingList } from "../modules/posting/posting.location.js";

const router = express.Router();

// Same shared middleware every real module uses — the demo always runs logged in.
router.use(requireAuth);

/**
 * GET /api/demo/postings — every posting still accepting applications.
 *
 * Stands in for Discovery so a worker can find something to apply to. Runs
 * through Lahiru's own sanitizePostingList, so the FR-POST-08 privacy rule
 * still holds here: a browsing worker sees the coarse area label only.
 */
router.get(
  "/postings",
  asyncHandler(async (req, res) => {
    const postings = await prisma.gigPosting.findMany({
      where: { status: "OPEN" },
      orderBy: [{ isUrgent: "desc" }, { createdAt: "desc" }],
      include: {
        employer: { select: { legalName: true, businessName: true } },
        engagements: { select: { workerId: true, status: true } },
        // Counts live applications only. Withdrawn and declined ones are gone
        // from the employer's pool (getApplicantPool excludes WITHDRAWN), so
        // counting them here would make browse and the pool disagree on screen.
        _count: {
          select: {
            applications: { where: { status: { in: ["PENDING", "SELECTED"] } } },
          },
        },
      },
    });

    // Strip the employer/_count extras off before sanitizing, then put them
    // back — sanitizePostingList only knows about the location fields.
    const sanitized = sanitizePostingList(
      postings.map(({ employer, _count, ...posting }) => posting),
      req.user.id,
    );

    res.json(
      sanitized.map((posting, i) => ({
        ...posting,
        employerName:
          postings[i].employer.businessName || postings[i].employer.legalName,
        applicantCount: postings[i]._count.applications,
      })),
    );
  }),
);

/**
 * GET /api/demo/notifications — the signed-in user's notifications.
 *
 * Makes FR-APPLY-08 (explicit decline) and FR-APPLY-09 (automatic
 * not-selected when a posting fills) visible during the demo. Naveenkhan's
 * service already writes these rows; nothing read them back.
 */
router.get(
  "/notifications",
  asyncHandler(async (req, res) => {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    res.json(notifications);
  }),
);

export default router;
