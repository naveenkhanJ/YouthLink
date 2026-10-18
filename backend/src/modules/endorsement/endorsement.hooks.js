/**
 * Community Endorsement — what happens to endorsement when a rating is revealed.
 *
 * Epic: FR-ENDORSE
 * Requirements:
 *   - FR-ENDORSE-05: eligibility closes permanently the moment the worker's first rating lands.
 *   - FR-ENDORSE-12 / FR-NOTIF-07: every Verifier with an active endorsement of the worker is told
 *     when the worker's first rated Engagement comes in at 4.0 or higher (ENDORSEMENT_PAYOFF).
 *
 * The Ratings module calls onRatingsRevealed() inside the same transaction that reveals a rating
 * pair, so the rule lives here (in the endorsement module) while the moment it fires is decided
 * there. This file deliberately imports nothing from rating.service.js: rating.service.js imports
 * this file, and an import going back the other way would be an ES-module cycle. What "revealed"
 * means is owned by the Ratings module, so it is handed in as `revealedWhere` instead.
 *
 * "Lands" means "is revealed": under the double-blind rule (FR-RATE-02) a hidden rating has not
 * reached the worker yet, so it cannot be what closes their window.
 */

// FR-ENDORSE-11 / FR-ENDORSE-12: "a good rating" is an average of 4.0 or higher.
export const GOOD_RATING_THRESHOLD = 4.0;

/**
 * Prisma `where` for "every rating that has been revealed, removed or not", built from the Ratings
 * module's revealedRatingsWhere(). The removedAt filter is dropped on purpose: FR-ENDORSE-05 closes
 * the window "permanently — not reopening — even if their history later returns to zero", so an
 * Admin later removing the first rating (FR-RATE-06) does not reopen it.
 * @param {object} revealedWhere - rating.service.js revealedRatingsWhere(now)
 */
export function everRevealedWhere(revealedWhere) {
  // eslint-disable-next-line no-unused-vars
  const { removedAt, ...rest } = revealedWhere;
  return rest;
}

/**
 * Called by rating.service.js, inside its transaction, whenever an engagement's ratings are
 * revealed (the second submission, or the 14-day window being written down).
 *
 * 1. FR-ENDORSE-05: if the worker received a rating in this engagement, stamp
 *    User.firstRatingReceivedAt — once. The `firstRatingReceivedAt: null` guard makes it set-once,
 *    so a later reveal can never move it, and the row write also takes the worker's row lock, which
 *    is what a concurrent vouch (endorsement.service.js createEndorsement) waits on.
 * 2. FR-ENDORSE-12: if this is the worker's first rated Engagement and its rating is 4.0 or higher,
 *    notify every Verifier whose endorsement of the worker is still active.
 *
 * @param {object} tx - the Prisma transaction client.
 * @param {{
 *   engagementId: string,
 *   workerId: string,
 *   workerName: string,
 *   ratings: Array<{ rateeId: string, score: number }>,  // the pair just revealed
 *   revealedAt: Date,
 *   revealedWhere: object,                               // rating.service.js revealedRatingsWhere()
 * }} input
 * @returns {Promise<{ firstRating: boolean, payoffNotified: number }>}
 */
export async function onRatingsRevealed(tx, { engagementId, workerId, workerName, ratings, revealedAt, revealedWhere }) {
  // Only a rating the WORKER received counts. If the employer never rated and the window closed,
  // the worker has still not been rated, and their window stays open.
  const received = ratings.find((r) => r.rateeId === workerId);
  if (!received) return { firstRating: false, payoffNotified: 0 };

  const { count } = await tx.user.updateMany({
    where: { id: workerId, role: "YOUTH_JOB_SEEKER", firstRatingReceivedAt: null },
    data: { firstRatingReceivedAt: revealedAt },
  });
  // Already stamped: an earlier engagement was their first, so this one cannot pay off.
  if (count === 0) return { firstRating: false, payoffNotified: 0 };

  // The stamp can still be missing while an earlier rating exists: a 14-day window that closed but
  // was never written down (rating.service.js records it only when someone opens the screen), or
  // data loaded before this hook existed. That earlier engagement was the first, not this one.
  const earlier = await tx.rating.count({
    where: { rateeId: workerId, engagementId: { not: engagementId }, ...everRevealedWhere(revealedWhere) },
  });
  if (earlier > 0) return { firstRating: false, payoffNotified: 0 };

  // One engagement gives the worker one rating, so its score IS the first engagement's average.
  if (received.score < GOOD_RATING_THRESHOLD) return { firstRating: true, payoffNotified: 0 };

  const active = await tx.endorsement.findMany({
    where: { workerId, revokedAt: null },
    select: { endorserId: true },
  });
  if (active.length === 0) return { firstRating: true, payoffNotified: 0 };

  // FR-NOTIF-08 row: "Your endorsement paid off" · "{name} went on to build a good rating" ·
  // opens My endorsements. The worker's name is the one the Verifier vouched for (legal name).
  await tx.notification.createMany({
    data: active.map((e) => ({
      userId: e.endorserId,
      type: "ENDORSEMENT_PAYOFF",
      payload: { workerId, workerName },
    })),
  });
  return { firstRating: true, payoffNotified: active.length };
}
