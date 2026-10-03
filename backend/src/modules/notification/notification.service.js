/**
 * Notifications services — the gig fan-out, preferences and the history.
 *
 * Epic: FR-NOTIF  ·  Owner: Pawan
 * Requirements:
 *   - FR-POST-10: fan-out on posting submission — urgent → FR-NOTIF-01, otherwise FR-NOTIF-02.
 *   - FR-NOTIF-01: urgent gigs reach OPTED-IN youth within radius; at most 5 pushes per youth per
 *     day, anything beyond that batched into one digest.
 *   - FR-NOTIF-02: non-urgent gigs reach every youth within radius who has NOT opted out.
 *   - FR-NOTIF-03: the two preferences (urgent opt-in, new-gig opt-out), job-seekers only.
 *   - FR-NOTIF-08 (as amended 2026-09-24): the history keeps a row 30 days, 90 for WARNING_RECORDED.
 *
 * About "push": the app has no push-delivery library yet, so a notification is a `Notification`
 * row. `pushSentAt` records that this row is the one that would have gone to the phone; a gig that
 * went into the day's digest has no `pushSentAt` and points at the digest through `batchedDigestId`.
 * The in-app history (FR-NOTIF-08/09) shows every row either way.
 */
import prisma from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";
import { computeIsUrgent } from "../posting/posting.urgency.js";
import { boundingBox, haversineDistance, roundToAboutOneKm } from "../discovery/geo.js";

export const URGENT_PUSH_DAILY_LIMIT = 5;

// FR-POST-10 amendment (2026-09-25): the notification radius is FR-DISC-01's 5 km default, with no
// auto-expansion, measured from the youth's last browse centre — and only if that browse is at most
// 30 days old.
export const NOTIFY_RADIUS_KM = 5;
export const BROWSE_LOCATION_MAX_AGE_DAYS = 30;

// FR-NOTIF-08 amendment (2026-09-24): how long the history shows a row.
export const HISTORY_DAYS = 30;
export const WARNING_HISTORY_DAYS = 90;

// "Per day" means the team's calendar day (docs/workflow/team.json timezone, Asia/Colombo), not the
// server's. Sri Lanka is UTC+05:30 with no daylight saving, so a fixed offset is exact.
const COLOMBO_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

/** Midnight at the start of today in Colombo, as a UTC Date. */
export function startOfColomboDay(now = new Date()) {
  const colomboNow = now.getTime() + COLOMBO_OFFSET_MS;
  return new Date(Math.floor(colomboNow / DAY_MS) * DAY_MS - COLOMBO_OFFSET_MS);
}

/**
 * Distance from a youth's browse centre to a posting, in km to one decimal. Measured to the
 * posting's coarse point (about 1 km), exactly as Browse measures it, so the "4.5 km" in a
 * notification and the "4.5 km away" on the card agree — and neither reveals the exact pin
 * (FR-POST-08).
 */
function distanceKm(youth, posting) {
  const km = haversineDistance(
    youth.lastBrowseLat,
    youth.lastBrowseLng,
    roundToAboutOneKm(posting.locationLat),
    roundToAboutOneKm(posting.locationLng),
  );
  return Math.round(km * 10) / 10;
}

/**
 * Youth who should hear about a posting at this location: active (not pending, deleted or
 * suspended), browsed within the last 30 days, and last browsed within 5 km of the gig.
 * `preference` is the extra opt-in/opt-out condition for the kind of gig.
 *
 * @returns {Promise<Array<{ id: string, distanceKm: number }>>}
 */
export async function findYouthNear(posting, preference, now = new Date()) {
  const box = boundingBox(posting.locationLat, posting.locationLng, NOTIFY_RADIUS_KM + 2); // +2: rounding room
  const freshSince = new Date(now.getTime() - BROWSE_LOCATION_MAX_AGE_DAYS * DAY_MS);

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
  return candidates
    .map((youth) => ({ id: youth.id, distanceKm: distanceKm(youth, posting) }))
    .filter((youth) => youth.distanceKm <= NOTIFY_RADIUS_KM);
}

/**
 * What a gig notification row carries: a snapshot of the facts its body shows — A11's
 * "title · pay + basis · distance · starts" — as they were when it was sent, plus the posting id
 * the row opens.
 */
export function gigPayload(posting, distance) {
  return {
    gigPostingId: posting.id,
    title: posting.title,
    areaLabel: posting.locationAreaLabel,
    payKind: posting.payKind,
    payAmount: posting.payAmount == null ? null : Number(posting.payAmount),
    payRateUnit: posting.payRateUnit,
    workersNeeded: posting.workersNeeded,
    startAt: new Date(posting.startAt).toISOString(),
    distanceKm: distance,
  };
}

/**
 * FR-NOTIF-01 for one youth: an individual push for the first 5 urgent gigs of their day; from the
 * 6th on, the gig joins that day's single digest instead.
 *
 * Every urgent gig is stored as its own URGENT_GIG row. A pushed one has `pushSentAt`; a batched
 * one has none and points at the day's URGENT_DIGEST row through `batchedDigestId`. The digest is
 * created (and "pushed") once, by the 6th gig; later ones only join it.
 *
 * The count-then-decide is done inside a transaction holding a row lock on the youth
 * (SELECT … FOR UPDATE). Without it, two urgent gigs posted at the same moment could both read
 * "4 pushed today" and send a 6th push, or both create a digest (see AGENTS.md: $transaction alone
 * does not lock a row).
 *
 * @returns {Promise<"pushed"|"batched">}
 */
export async function notifyUrgentGig(youthId, payload, now = new Date()) {
  const startOfDay = startOfColomboDay(now);

  return prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT "id" FROM "User" WHERE "id" = ${youthId} FOR UPDATE`;

    const pushedToday = await tx.notification.count({
      where: { userId: youthId, type: "URGENT_GIG", pushSentAt: { not: null }, createdAt: { gte: startOfDay } },
    });

    if (pushedToday < URGENT_PUSH_DAILY_LIMIT) {
      await tx.notification.create({
        data: { userId: youthId, type: "URGENT_GIG", payload, pushSentAt: now },
      });
      return "pushed";
    }

    let digest = await tx.notification.findFirst({
      where: { userId: youthId, type: "URGENT_DIGEST", createdAt: { gte: startOfDay } },
      select: { id: true },
    });
    if (!digest) {
      digest = await tx.notification.create({
        data: {
          userId: youthId,
          type: "URGENT_DIGEST",
          // The digest's own row needs no copy: its title and body come from the gigs batched
          // into it ("{n} more urgent gigs today" — FR-NOTIF-08 A11), counted when it is read.
          payload: { day: startOfDay.toISOString() },
          pushSentAt: now,
        },
        select: { id: true },
      });
    }

    await tx.notification.create({
      data: { userId: youthId, type: "URGENT_GIG", payload, batchedDigestId: digest.id },
    });
    return "batched";
  });
}

/**
 * The notification fan-out when a gig posting goes live (FR-POST-10, FR-NOTIF-01, FR-NOTIF-02).
 * Called by the Gig Posting module right after a posting is created (posting.notify.js).
 *
 *   urgent gig (starts in 48 hours or less, FR-POST-07)
 *       → only youth who opted IN to urgent alerts (off by default), with the 5-a-day cap.
 *   any other gig
 *       → every youth who has NOT opted out of new-gig alerts (on by default). Never batched.
 *   both
 *       → only youth whose last browse centre is within 5 km and at most 30 days old.
 *
 * NEVER throws. The posting is already saved when this runs, and a failed alert must not turn a
 * successful post into an error for the employer (FR-POST-10: "immediately on posting submission";
 * the posting module wraps the call the same way). Failures are logged instead. One youth's failure
 * does not stop the others.
 *
 * @param {string} gigPostingId - the new posting's id. (An object `{ gigPostingId }` is also
 *   accepted, the shape an earlier version of this function took.)
 * @returns {Promise<{ notified: number }>} how many youth got a row
 */
export async function notifyNewGigPosted(gigPostingId) {
  const id = typeof gigPostingId === "object" && gigPostingId !== null ? gigPostingId.gigPostingId : gigPostingId;
  let notified = 0;

  try {
    const posting = await prisma.gigPosting.findUnique({ where: { id } });
    if (!posting || posting.status !== "OPEN" || posting.autoHiddenAt) {
      return { notified };
    }

    const now = new Date();
    // FR-POST-07: urgency is decided from the start time now, not trusted from a stored flag.
    const urgent = computeIsUrgent(posting.startAt, now.getTime());

    if (urgent) {
      const recipients = await findYouthNear(posting, { notifyUrgentOptIn: true }, now);
      // One youth at a time: each one's daily count must be read before deciding push vs digest.
      for (const youth of recipients) {
        try {
          await notifyUrgentGig(youth.id, gigPayload(posting, youth.distanceKm), now);
          notified += 1;
        } catch (error) {
          console.error(`Urgent gig notification failed for one youth (posting ${id}):`, error);
        }
      }
      return { notified };
    }

    const recipients = await findYouthNear(posting, { notifyNewGigOptOut: false }, now);
    if (recipients.length > 0) {
      const result = await prisma.notification.createMany({
        data: recipients.map((youth) => ({
          userId: youth.id,
          type: "NEW_GIG",
          payload: gigPayload(posting, youth.distanceKm),
          pushSentAt: now,
        })),
      });
      notified = result.count;
    }
    return { notified };
  } catch (error) {
    console.error(`Gig notification fan-out failed for posting ${id}:`, error);
    return { notified };
  }
}

/** FR-NOTIF-03: only a Youth Job-Seeker has these two preferences (3.11e / 3.11v have none). */
function assertJobSeeker(user) {
  if (user.role !== "YOUTH_JOB_SEEKER") {
    throw AppError.forbidden("Only job-seekers have gig notification preferences.");
  }
}

/** The signed-in job-seeker's two preferences (FR-NOTIF-03). */
async function getPreferences({ user }) {
  assertJobSeeker(user);
  const found = await prisma.user.findUnique({
    where: { id: user.id },
    select: { notifyUrgentOptIn: true, notifyNewGigOptOut: true },
  });
  if (!found) throw AppError.notFound("User not found.");
  return found;
}

/**
 * Changes either preference, independently of the other (FR-NOTIF-03). Only booleans are accepted;
 * a field left out is left as it is.
 */
async function updatePreferences({ user, notifyUrgentOptIn, notifyNewGigOptOut }) {
  assertJobSeeker(user);

  const data = {};
  const fields = {};
  for (const [name, value] of Object.entries({ notifyUrgentOptIn, notifyNewGigOptOut })) {
    if (value === undefined) continue;
    if (typeof value === "boolean") data[name] = value;
    else fields[name] = "Must be true or false.";
  }
  if (Object.keys(fields).length > 0) throw AppError.badRequest("Some details need fixing.", fields);
  if (Object.keys(data).length === 0) throw AppError.badRequest("Nothing to change.");

  return prisma.user.update({
    where: { id: user.id },
    data,
    select: { notifyUrgentOptIn: true, notifyNewGigOptOut: true },
  });
}

/**
 * Which rows the history shows (FR-NOTIF-08 amendment): the last 30 days, and the last 90 for a
 * WARNING_RECORDED row. Batched gigs are not rows of their own — they belong to their digest.
 */
function visibleRowsWhere(userId, now) {
  return {
    userId,
    batchedDigestId: null,
    OR: [
      { createdAt: { gte: new Date(now.getTime() - HISTORY_DAYS * DAY_MS) } },
      { type: "WARNING_RECORDED", createdAt: { gte: new Date(now.getTime() - WARNING_HISTORY_DAYS * DAY_MS) } },
    ],
  };
}

/**
 * The signed-in user's notification history, newest first (FR-NOTIF-08). A digest carries the gigs
 * batched into it as `children`, newest first, because the digest row expands in place to them.
 *
 * Many A11 titles name the posting ("You're selected for {title}"), but other modules store only
 * its id in the payload. Where a row has a `gigPostingId` and no title of its own, the posting's
 * current title is attached as `gigTitle` — read in one query for the whole page, not one per row.
 */
async function getNotifications({ userId, now = new Date() }) {
  const rows = await prisma.notification.findMany({
    where: visibleRowsWhere(userId, now),
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { batchedItems: { orderBy: { createdAt: "desc" } } },
  });

  const untitledIds = [
    ...new Set(rows.filter((r) => r.payload?.gigPostingId && !r.payload?.title).map((r) => r.payload.gigPostingId)),
  ];
  const titles = new Map();
  if (untitledIds.length > 0) {
    const postings = await prisma.gigPosting.findMany({
      where: { id: { in: untitledIds } },
      select: { id: true, title: true },
    });
    postings.forEach((p) => titles.set(p.id, p.title));
  }

  return rows.map(({ batchedItems, ...row }) => {
    const shaped = row.type === "URGENT_DIGEST" ? { ...row, children: batchedItems } : row;
    const gigTitle = titles.get(row.payload?.gigPostingId);
    return gigTitle ? { ...shaped, gigTitle } : shaped;
  });
}

/** How many visible rows are unread — drives the tab bar's notification dot. */
async function countUnread({ userId, now = new Date() }) {
  const count = await prisma.notification.count({
    where: { ...visibleRowsWhere(userId, now), readAt: null },
  });
  return { count };
}

/** Marks one of the user's own notifications read. Someone else's row is a 404, not a quiet no-op. */
async function markAsRead({ notificationId, userId }) {
  const result = await prisma.notification.updateMany({
    where: { id: notificationId, userId, readAt: null },
    data: { readAt: new Date() },
  });
  if (result.count === 0) {
    const own = await prisma.notification.count({ where: { id: notificationId, userId } });
    if (own === 0) throw AppError.notFound("Notification not found.");
  }
}

export default {
  notifyNewGigPosted,
  getPreferences,
  updatePreferences,
  getNotifications,
  countUnread,
  markAsRead,
};
