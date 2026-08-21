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
        // Limit exceeded: batch into daily digest (FR-NOTIF-01)
        await prisma.notification.create({
          data: {
            userId: worker.id,
            type: "URGENT_DIGEST",
            payload: {
              gigPostingId: posting.id,
              title: posting.title,
              area: posting.locationAreaLabel,
              message: "Daily urgent gigs summary",
            },
          },
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
