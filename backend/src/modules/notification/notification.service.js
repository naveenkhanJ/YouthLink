/**
 * Notifications services — business rules and triggers.
 *
 * Epic: FR-NOTIF  ·  Owner: Pawan
 * Requirements:
 *   - FR-NOTIF-01: Urgent gig push notifications (opted-in users, 5 pushes/day rate limit + digest batching)
 *   - FR-NOTIF-02: Non-urgent gig notifications (opt-out by default)
 *   - FR-NOTIF-03: Notification preferences (independent toggles for urgent opt-in & general opt-out)
 *   - FR-NOTIF-08: Notification history
 */
import prisma from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";
import { boundingBox, haversineDistance } from "../discovery/geo.js";

const URGENT_PUSH_DAILY_LIMIT = 5;

// FR-POST-10 amendment (2026-09-25): the notification radius is FR-DISC-01's 5 km default,
// with no auto-expansion, measured from the youth's last browse centre — and only if that
// browse is at most 30 days old.
const NOTIFY_RADIUS_KM = 5;
const BROWSE_LOCATION_MAX_AGE_DAYS = 30;

// "Per day" means the team's calendar day (docs/workflow/team.json timezone, Asia/Colombo),
// not the server's. Sri Lanka is UTC+05:30 with no daylight saving, so a fixed offset is exact.
const COLOMBO_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

/** Midnight at the start of today in Colombo, as a UTC Date. */
function startOfColomboDay(now = new Date()) {
  const colomboNow = now.getTime() + COLOMBO_OFFSET_MS;
  return new Date(Math.floor(colomboNow / DAY_MS) * DAY_MS - COLOMBO_OFFSET_MS);
}

/**
 * Youth who should hear about a posting at this location: active, not deleted or
 * suspended, browsed within the last 30 days, and whose last browse centre is within
 * 5 km of the gig. `preference` is the extra opt-in/opt-out condition for the gig type.
 */
async function findYouthNear(posting, preference) {
  const box = boundingBox(posting.locationLat, posting.locationLng, NOTIFY_RADIUS_KM);
  const freshSince = new Date(Date.now() - BROWSE_LOCATION_MAX_AGE_DAYS * DAY_MS);

  const candidates = await prisma.user.findMany({
    where: {
      role: "YOUTH_JOB_SEEKER",
      accountStatus: "ACTIVE",
      deletedAt: null,
      suspendedAt: null,
      lastBrowseAt: { gte: freshSince },
      // The box is a cheap pre-filter that can use the lastBrowse index...
      lastBrowseLat: { gte: box.minLat, lte: box.maxLat },
      lastBrowseLng: { gte: box.minLng, lte: box.maxLng },
      ...preference,
    },
    select: { id: true, lastBrowseLat: true, lastBrowseLng: true },
  });

  // ...and the exact distance check trims the box's corners down to the circle.
  return candidates.filter(
    (user) =>
      haversineDistance(user.lastBrowseLat, user.lastBrowseLng, posting.locationLat, posting.locationLng) <=
      NOTIFY_RADIUS_KM,
  );
}

function gigPayload(posting) {
  return {
    gigPostingId: posting.id,
    title: posting.title,
    area: posting.locationAreaLabel,
    urgent: posting.isUrgent,
  };
}

/**
 * FR-NOTIF-01 for one youth: an individual push for the first 5 urgent gigs of the day;
 * after that, the gig is attached to that day's single digest instead of pushed on its own.
 *
 * Every urgent gig is stored as its own URGENT_GIG row (so it appears in the in-app list);
 * pushed ones have pushSentAt set, batched ones point at the day's URGENT_DIGEST row via
 * batchedDigestId and have no pushSentAt. The digest itself is one row per youth per day.
 */
async function notifyUrgentGig(userId, posting, startOfDay) {
  const pushedToday = await prisma.notification.count({
    where: {
      userId,
      type: "URGENT_GIG",
      pushSentAt: { not: null },
      createdAt: { gte: startOfDay },
    },
  });

  if (pushedToday < URGENT_PUSH_DAILY_LIMIT) {
    await prisma.notification.create({
      data: { userId, type: "URGENT_GIG", payload: gigPayload(posting), pushSentAt: new Date() },
    });
    return;
  }

  // Over the limit: reuse today's digest, or start it with this gig. Two urgent gigs posted
  // in the same instant could each create one; that only means two digests that day, never a
  // lost notification, so no row lock is taken for it.
  let digest = await prisma.notification.findFirst({
    where: { userId, type: "URGENT_DIGEST", createdAt: { gte: startOfDay } },
    select: { id: true },
  });
  if (!digest) {
    digest = await prisma.notification.create({
      data: {
        userId,
        type: "URGENT_DIGEST",
        payload: { day: startOfDay.toISOString(), message: "More urgent gigs near you today" },
      },
      select: { id: true },
    });
  }

  await prisma.notification.create({
    data: { userId, type: "URGENT_GIG", payload: gigPayload(posting), batchedDigestId: digest.id },
  });
}

/**
 * Notification fan-out when a gig posting goes live (FR-POST-10, FR-NOTIF-01, FR-NOTIF-02).
 * Called by the Gig Posting module right after a posting is created.
 *
 * Urgent gig   → only youth who opted IN to urgent alerts (off by default).
 * Normal gig   → every youth who has NOT opted out of new-gig notifications (on by default).
 * Both are limited to youth within 5 km of their last browse centre (see findYouthNear).
 */
async function notifyNewGigPosted({ gigPostingId }) {
  const posting = await prisma.gigPosting.findUnique({
    where: { id: gigPostingId },
  });

  if (!posting || posting.status !== "OPEN") {
    return;
  }

  if (posting.isUrgent) {
    const recipients = await findYouthNear(posting, { notifyUrgentOptIn: true });
    const startOfDay = startOfColomboDay();
    // One youth at a time: each one's daily count must be read before deciding push vs digest.
    for (const youth of recipients) {
      await notifyUrgentGig(youth.id, posting, startOfDay);
    }
    return;
  }

  const recipients = await findYouthNear(posting, { notifyNewGigOptOut: false });
  if (recipients.length > 0) {
    const sentAt = new Date();
    await prisma.notification.createMany({
      data: recipients.map((youth) => ({
        userId: youth.id,
        type: "NEW_GIG",
        payload: gigPayload(posting),
        pushSentAt: sentAt,
      })),
    });
  }
}

/**
 * Gets user's current notification preferences (FR-NOTIF-03).
 */
async function getPreferences({ userId }) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      notifyUrgentOptIn: true,
      notifyNewGigOptOut: true,
    },
  });

  if (!user) {
    throw AppError.notFound("User not found");
  }

  return user;
}

/**
 * Updates user's notification preferences (FR-NOTIF-03).
 */
async function updatePreferences({ userId, notifyUrgentOptIn, notifyNewGigOptOut }) {
  const data = {};
  if (typeof notifyUrgentOptIn === "boolean") {
    data.notifyUrgentOptIn = notifyUrgentOptIn;
  }
  if (typeof notifyNewGigOptOut === "boolean") {
    data.notifyNewGigOptOut = notifyNewGigOptOut;
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      notifyUrgentOptIn: true,
      notifyNewGigOptOut: true,
    },
  });

  return updated;
}

/**
 * Gets in-app notification history (FR-NOTIF-08).
 */
async function getNotifications({ userId }) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

/**
 * Marks a notification as read.
 */
async function markAsRead({ notificationId, userId }) {
  return prisma.notification.updateMany({
    where: { id: notificationId, userId },
    data: { readAt: new Date() },
  });
}

export default {
  notifyNewGigPosted,
  getPreferences,
  updatePreferences,
  getNotifications,
  markAsRead,
};
