/**
 * Saved gigs — FR-DISC-06 (screen 3.8).
 *
 * Epic: FR-DISC  ·  Added 2026-10-18 (full build on integration/viva-demo)
 * Requirement: a Youth Job-Seeker bookmarks a listing to a saved list, revisitable without
 * re-searching; a saved posting appears there "regardless of whether it still appears in default
 * browse results". So the list is NOT filtered by radius, status or expiry: a posting that has since
 * filled, expired or been withdrawn stays on the list as a dead row (3.8's "Expired · No longer
 * accepting applications"), and the person removes it themselves.
 *
 * Like Browse, a saved card shows only the coarse area and a distance to the coarse point
 * (FR-POST-08) — measured from the youth's last browse centre, when there is one.
 */
import prisma from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";
import { computeIsUrgent } from "../posting/posting.urgency.js";
import { coarseDistanceKm } from "./discovery.service.js";

/** Whether a worker could still apply: open, and not past its expiry (FR-POST-13). */
function isLive(posting, now) {
  return posting.status === "OPEN" && (!posting.expiresAt || new Date(posting.expiresAt) > now);
}

/**
 * The status a dead row's badge shows (3.8: `Display/Badge {Family=Posting}`). A posting whose
 * expiry has passed reads Expired even if the expiry sweep has not written EXPIRED yet.
 */
export function savedStatus(posting, now = new Date()) {
  if (isLive(posting, now)) return "OPEN";
  if (posting.status === "OPEN") return "EXPIRED";
  return posting.status; // FILLED, WITHDRAWN or EXPIRED
}

async function assertPostingExists(gigPostingId) {
  if (typeof gigPostingId !== "string" || gigPostingId.length === 0) {
    throw AppError.badRequest("Say which gig to save.");
  }
  const posting = await prisma.gigPosting.findUnique({ where: { id: gigPostingId }, select: { id: true } });
  if (!posting) throw AppError.notFound("This gig could not be found.");
}

/** Bookmarks a posting. Saving one already saved is a no-op, not an error. */
export async function saveGig({ userId, gigPostingId }) {
  await assertPostingExists(gigPostingId);
  await prisma.savedGig.upsert({
    where: { userId_gigPostingId: { userId, gigPostingId } },
    create: { userId, gigPostingId },
    update: {},
  });
  return { saved: true };
}

/** Removes a bookmark. Removing one that isn't there is a no-op too. */
export async function unsaveGig({ userId, gigPostingId }) {
  await prisma.savedGig.deleteMany({ where: { userId, gigPostingId } });
  return { saved: false };
}

/** Whether the caller has saved this posting (the listing detail's Save / Saved action). */
export async function isSaved({ userId, gigPostingId }) {
  const found = await prisma.savedGig.findUnique({
    where: { userId_gigPostingId: { userId, gigPostingId } },
    select: { id: true },
  });
  return { saved: Boolean(found) };
}

/**
 * The saved list, most recently saved first. Each row carries the card's facts (the same fields a
 * Browse result has) plus `status` and `live`, so the app can draw a dead row for a posting nobody
 * can apply to any more.
 */
export async function listSaved({ userId, now = new Date() }) {
  const [rows, user] = await Promise.all([
    prisma.savedGig.findMany({
      where: { userId },
      orderBy: { savedAt: "desc" },
      include: {
        gigPosting: {
          select: {
            id: true,
            title: true,
            category: true,
            arrangementType: true,
            payKind: true,
            payAmount: true,
            payRateUnit: true,
            workersNeeded: true,
            filledCount: true,
            startAt: true,
            createdAt: true,
            expiresAt: true,
            status: true,
            locationAreaLabel: true,
            locationLat: true, // distance only; never sent back
            locationLng: true,
          },
        },
      },
    }),
    prisma.user.findUnique({ where: { id: userId }, select: { lastBrowseLat: true, lastBrowseLng: true } }),
  ]);

  const centre =
    user?.lastBrowseLat != null && user?.lastBrowseLng != null ? { lat: user.lastBrowseLat, lng: user.lastBrowseLng } : null;

  return rows.map(({ gigPosting: p, savedAt }) => {
    const status = savedStatus(p, now);
    return {
      id: p.id,
      title: p.title,
      category: p.category,
      arrangementType: p.arrangementType,
      payKind: p.payKind,
      payAmount: p.payAmount == null ? null : Number(p.payAmount),
      payRateUnit: p.payRateUnit,
      workersNeeded: p.workersNeeded,
      filledCount: p.filledCount,
      startAt: p.startAt,
      createdAt: p.createdAt,
      areaLabel: p.locationAreaLabel,
      distanceKm: centre ? coarseDistanceKm(centre, p) : null,
      isUrgent: computeIsUrgent(p.startAt, now),
      status,
      live: status === "OPEN",
      savedAt,
    };
  });
}

export default { saveGig, unsaveGig, isSaved, listSaved };
