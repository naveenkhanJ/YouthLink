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

const URGENT_PUSH_DAILY_LIMIT = 5;

/**
 * Triggers notifications when a new gig posting is published (FR-NOTIF-01 & FR-NOTIF-02).
 */
async function notifyNewGigPosted({ gigPostingId }) {
  const posting = await prisma.gigPosting.findUnique({
    where: { id: gigPostingId },
  });

  if (!posting || posting.status !== "OPEN") {
    return;
  }

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  if (posting.isUrgent) {
    // FR-NOTIF-01: Proactive push to opted-in youth job-seekers
    const eligibleWorkers = await prisma.user.findMany({
      where: {
        role: "YOUTH_JOB_SEEKER",
        accountStatus: "ACTIVE",
        notifyUrgentOptIn: true,
      },
      select: { id: true },
    });

    for (const worker of eligibleWorkers) {
      // Check rate limit: count urgent notifications today
      const todayUrgentCount = await prisma.notification.count({
        where: {
          userId: worker.id,
          type: "URGENT_GIG",
          createdAt: { gte: startOfDay },
        },
      });

      if (todayUrgentCount < URGENT_PUSH_DAILY_LIMIT) {
        // Direct urgent push notification
        await prisma.notification.create({
          data: {
            userId: worker.id,
            type: "URGENT_GIG",
            payload: {
              gigPostingId: posting.id,
              title: posting.title,
              area: posting.locationAreaLabel,
              urgent: true,
            },
            pushSentAt: new Date(),
          },
        });
      } else {
        // Limit exceeded: batch into today's digest (FR-NOTIF-01).
        //
        // This used to create a standalone URGENT_DIGEST row per posting,
        // which is not a digest — a worker over the limit got exactly as many
        // notifications as before, just relabelled, and the whole point of the
        // 5/day cap was lost. Notification.batchedDigestId exists in the
        // schema for precisely this and was never set.
        //
        // Now: one digest row per worker per day acts as the parent, and each
        // further urgent gig is attached to it via batchedDigestId. The
        // client renders the parent as "N urgent gigs today" and can expand
        // its batchedItems — see getNotifications, which returns only
        // top-level rows so the children don't also appear on their own.
        //
        // The find-or-create has to be atomic. This function is fired un-awaited
        // from createGigPosting, so two urgent postings seconds apart would
        // otherwise both find no digest and both create one, splitting the
        // day's children across two parents. Locking the worker's own User row
        // serialises digest creation per worker without blocking anyone else.
        await prisma.$transaction(async (tx) => {
          await tx.$queryRaw`SELECT "id" FROM "User" WHERE "id" = ${worker.id} FOR UPDATE`;

          const digest =
            (await tx.notification.findFirst({
              where: {
                userId: worker.id,
                type: "URGENT_DIGEST",
                batchedDigestId: null,
                createdAt: { gte: startOfDay },
              },
            })) ??
            (await tx.notification.create({
              data: {
                userId: worker.id,
                type: "URGENT_DIGEST",
                payload: { message: "Daily urgent gigs summary" },
              },
            }));

          await tx.notification.create({
            data: {
              userId: worker.id,
              type: "URGENT_GIG",
              payload: {
                gigPostingId: posting.id,
                title: posting.title,
                area: posting.locationAreaLabel,
                urgent: true,
              },
              // Batched, so deliberately no pushSentAt — it rolls up into the
              // digest instead of being pushed on its own.
              batchedDigestId: digest.id,
            },
          });
        });
      }
    }
  } else {
    // FR-NOTIF-02: Non-urgent gig notification (opt-out by default)
    const eligibleWorkers = await prisma.user.findMany({
      where: {
        role: "YOUTH_JOB_SEEKER",
        accountStatus: "ACTIVE",
        notifyNewGigOptOut: false, // Default is false (meaning they have not opted out)
      },
      select: { id: true },
    });

    if (eligibleWorkers.length > 0) {
      await prisma.notification.createMany({
        data: eligibleWorkers.map((worker) => ({
          userId: worker.id,
          type: "NEW_GIG",
          payload: {
            gigPostingId: posting.id,
            title: posting.title,
            area: posting.locationAreaLabel,
          },
          pushSentAt: new Date(),
        })),
      });
    }
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
  // Only top-level rows. Without the batchedDigestId filter the batched
  // children came back alongside their own digest parent, so a worker over
  // the 5/day cap saw MORE rows than before batching existed — the digest
  // has to actually replace its children in history to mean anything.
  const notifications = await prisma.notification.findMany({
    where: { userId, batchedDigestId: null },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      batchedItems: {
        orderBy: { createdAt: "desc" },
        select: { id: true, type: true, payload: true, createdAt: true },
      },
    },
  });

  // Surface the roll-up count so the client can render "N more urgent gigs
  // today" without having to walk batchedItems itself.
  return notifications.map((n) => ({ ...n, batchedCount: n.batchedItems.length }));
}

/**
 * Marks a notification as read.
 */
async function markAsRead({ notificationId, userId }) {
  // updateMany is the right call — it scopes to userId so one user can't mark
  // another's notification read — but its count was discarded and the
  // controller always answered { status: "ok" }, so a nonexistent or someone
  // else's id looked like success. Surface the miss as a 404 instead.
  const { count } = await prisma.notification.updateMany({
    where: { id: notificationId, userId },
    data: { readAt: new Date() },
  });
  if (count === 0) {
    throw AppError.notFound("Notification not found");
  }
  return { id: notificationId, readAt: new Date() };
}

export default {
  notifyNewGigPosted,
  getPreferences,
  updatePreferences,
  getNotifications,
  markAsRead,
};
