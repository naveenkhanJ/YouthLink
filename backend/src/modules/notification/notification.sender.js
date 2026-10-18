/**
 * Push delivery — sends committed Notification rows to the person's phones through Firebase Cloud
 * Messaging (FCM).
 *
 * Epic: FR-NOTIF  ·  Added 2026-10-18
 * Requirements: FR-NOTIF-01, FR-NOTIF-02 (and every other user notification: FR-NOTIF-04, -05, -07,
 * -11, -12, FR-POST-10), FR-NOTIF-09 (a denied permission only stops the phone showing it — the row
 * is in the history either way), FR-NOTIF-10 (urgent vs regular channel, notification.push.js).
 *
 * How it works — an "outbox" sweep, not a send inside each module:
 *   Notifications are written in many places, mostly inside database transactions. Sending a push
 *   from inside a transaction would push something that might still roll back, and calling a sender
 *   after every transaction would touch every module. So every module keeps writing rows as it
 *   always has, and this sweep (every 5 seconds) picks up rows that are committed and not yet
 *   processed (`pushDispatchedAt` null), sends them, and stamps `pushDispatchedAt`.
 *
 * Which rows are pushed: every row addressed to a user, except an URGENT_GIG row that was batched
 * into the day's digest (it has no `pushSentAt` — FR-NOTIF-01's sixth gig "is queued into a batched
 * digest rather than sent individually"). Rows older than PUSH_MAX_AGE_MS are stamped without being
 * sent, so a backlog (seeded rows, a server that was down) never arrives as a burst of stale alerts.
 *
 * Push is best effort. A row is stamped before it is sent, so it is never sent twice; if FCM fails
 * the row is not retried — it is still in the in-app history, which is the guarantee FR-NOTIF-08/09
 * make. Tokens FCM reports as no longer registered are deleted.
 */
import prisma from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";
import { pushContent } from "./notification.push.js";

export const PUSH_SWEEP_INTERVAL_MS = 5 * 1000;
export const PUSH_MAX_AGE_MS = 10 * 60 * 1000;
const BATCH_SIZE = 50;

// FCM error codes that mean the token will never work again (uninstalled app, revoked token).
const DEAD_TOKEN_CODES = new Set([
  "messaging/registration-token-not-registered",
  "messaging/invalid-registration-token",
]);

/**
 * The FCM sender, loaded on first use. Imported lazily so that loading this module (in tests, or
 * from index.js) never reads the service-account file by itself.
 * @type {null | { sendEachForMulticast: Function }}
 */
let messaging = null;
async function getMessagingClient() {
  if (!messaging) {
    const [{ default: app }, { getMessaging }] = await Promise.all([
      import("../../lib/firebaseAdmin.js"),
      import("firebase-admin/messaging"),
    ]);
    messaging = getMessaging(app);
  }
  return messaging;
}

/** Tests replace the FCM client here instead of loading Firebase. */
export function setMessagingClientForTests(client) {
  messaging = client;
}

/** True for rows the person should get a push for (see the header). */
export function isPushable(row) {
  if (!row.userId) return false; // staff rows (adminAccountId) belong to the dashboard
  if (row.type === "URGENT_GIG" && !row.pushSentAt) return false; // batched into the digest
  return true;
}

/**
 * The message FCM receives. `data` lets the app open the same screen the history row opens
 * (values must be strings). `android.priority` is "high" for urgent alerts so they arrive at once
 * on a phone in Doze; the channel decides how they look and sound (FR-NOTIF-10).
 */
export function buildMessage(row, content, tokens) {
  return {
    tokens,
    notification: { title: content.title, body: content.body },
    data: {
      notificationId: row.id,
      type: row.type,
      payload: JSON.stringify(row.payload ?? {}),
    },
    android: {
      priority: content.channelId === "urgent_gigs" ? "high" : "normal",
      notification: { channelId: content.channelId, tag: row.id },
    },
  };
}

/** Removes the tokens FCM rejected for good. */
async function pruneDeadTokens(tokens, response) {
  const dead = [];
  response.responses.forEach((result, index) => {
    if (!result.success && DEAD_TOKEN_CODES.has(result.error?.code)) dead.push(tokens[index]);
  });
  if (dead.length > 0) await prisma.deviceToken.deleteMany({ where: { token: { in: dead } } });
}

/**
 * One pass of the sweep: claim, word and send every pending row.
 * @returns {Promise<{ sent: number, skipped: number }>}
 */
export async function dispatchPendingPushes(now = new Date()) {
  const rows = await prisma.notification.findMany({
    where: { pushDispatchedAt: null, userId: { not: null } },
    orderBy: { createdAt: "asc" },
    take: BATCH_SIZE,
    select: {
      id: true,
      userId: true,
      type: true,
      payload: true,
      pushSentAt: true,
      createdAt: true,
      _count: { select: { batchedItems: true } },
      user: { select: { accountStatus: true, deletedAt: true, suspendedAt: true } },
    },
  });

  let sent = 0;
  let skipped = 0;
  for (const row of rows) {
    // Claim the row first. updateMany with the null guard means two overlapping sweeps can never
    // both send it.
    const claim = await prisma.notification.updateMany({
      where: { id: row.id, pushDispatchedAt: null },
      data: { pushDispatchedAt: now },
    });
    if (claim.count === 0) continue;

    const stale = now.getTime() - new Date(row.createdAt).getTime() > PUSH_MAX_AGE_MS;
    const inactive = row.user?.accountStatus !== "ACTIVE" || row.user?.deletedAt || row.user?.suspendedAt;
    if (stale || inactive || !isPushable(row)) {
      skipped += 1;
      continue;
    }

    try {
      const tokens = (
        await prisma.deviceToken.findMany({ where: { userId: row.userId }, select: { token: true } })
      ).map((t) => t.token);
      if (tokens.length === 0) {
        skipped += 1;
        continue;
      }

      let postingTitle;
      if (row.payload?.gigPostingId && !row.payload?.postingTitle && !row.payload?.title) {
        const posting = await prisma.gigPosting.findUnique({
          where: { id: row.payload.gigPostingId },
          select: { title: true },
        });
        postingTitle = posting?.title;
      }

      const content = pushContent(row, { postingTitle, digestCount: row._count.batchedItems, now });
      if (!content) {
        skipped += 1;
        continue;
      }

      const client = await getMessagingClient();
      const response = await client.sendEachForMulticast(buildMessage(row, content, tokens));
      await pruneDeadTokens(tokens, response);
      if (response.successCount > 0) sent += 1;
    } catch (error) {
      console.error(`Push for notification ${row.id} failed:`, error?.message ?? error);
    }
  }
  return { sent, skipped };
}

let running = false;

/**
 * Starts the sweep (called once from index.js). unref'd so it never holds the process open; a pass
 * that is still running when the next tick comes is not overlapped.
 */
export function startPushSweep() {
  const timer = setInterval(async () => {
    if (running) return;
    running = true;
    try {
      await dispatchPendingPushes();
    } catch (error) {
      console.error("Push sweep failed:", error?.message ?? error);
    } finally {
      running = false;
    }
  }, PUSH_SWEEP_INTERVAL_MS);
  timer.unref();
  return timer;
}

// ---------------------------------------------------------------------------
// Device tokens (FR-NOTIF-09: the app registers once permission is granted)
// ---------------------------------------------------------------------------

const MAX_TOKEN_LENGTH = 4096;

function assertToken(token) {
  if (typeof token !== "string" || token.trim().length === 0 || token.length > MAX_TOKEN_LENGTH) {
    throw AppError.badRequest("A device token is required.");
  }
}

/**
 * Registers this phone for the signed-in user. A token already held by another account moves to
 * this one: the phone changed hands (or accounts), and only whoever is signed in now should get
 * its pushes.
 */
export async function registerDeviceToken({ userId, token }) {
  assertToken(token);
  await prisma.deviceToken.upsert({
    where: { token },
    create: { userId, token },
    update: { userId },
  });
}

/** Unregisters this phone (sign-out). Only the signed-in user's own token is removed. */
export async function unregisterDeviceToken({ userId, token }) {
  assertToken(token);
  await prisma.deviceToken.deleteMany({ where: { token, userId } });
}
