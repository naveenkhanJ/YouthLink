/**
 * Engagement Lifecycle — the pure rules, with no database access.
 *
 * Epic: FR-ENG  ·  Owner: Naveenkhan
 *
 * Everything here takes plain objects (an Engagement row with its posting, ratings and open
 * requests) and a `now`, and returns a decision. Keeping the rules out of the service means each
 * one can be explained and unit-tested on its own, and the list, the detail and the code check
 * can never disagree about what state an engagement is in.
 *
 * The rules, and where they come from:
 *   - FR-ENG-01: three checkpoints run in order — arrival, completion, payment. The employer
 *     holds the arrival and completion codes, the worker holds the payment code ("custody flips
 *     at the payment step", product-overview.md §6).
 *   - FR-ENG-02: an unpaid internship has no payment checkpoint at all.
 *   - FR-ENG-12 / the 2026-09-24 ruling: a part-time job reaches closure through End Engagement,
 *     not through its checkpoints; End Engagement is part-time only.
 *   - FR-ENG-14 (amended 2026-09-24): the status and the owed action are separate; the action is
 *     only what the VIEWER owes; a finished engagement stays listed until 30 days after its
 *     rating window closes.
 */

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

/** FR-RATE-02: the double-blind window is 14 days from ratingOpenedAt (rating.service.js). */
export const RATING_WINDOW_DAYS = 14;
/** FR-ENG-14 (retention): a finished engagement stays 30 days after its rating window closes. */
export const RETENTION_DAYS_AFTER_RATING = 30;

/** The three checkpoints, in the order they must be confirmed (FR-ENG-01 as amended). */
export const CHECKPOINTS = ["arrival", "completion", "payment"];

/** Who holds (shows) each checkpoint's code. The other party enters it. */
export const CODE_HOLDER = {
  arrival: "EMPLOYER",
  completion: "EMPLOYER",
  payment: "WORKER", // the custody flip
};

/** FR-ENG-02: an Internship with pay type Unpaid has no payment checkpoint. */
export function hasPaymentCheckpoint(posting) {
  return !(posting.arrangementType === "INTERNSHIP" && posting.payKind === "UNPAID");
}

/**
 * Has the arrangement actually started? Either its start time has passed or the arrival code
 * has already been confirmed (a worker who turned up early and had the code entered).
 */
export function hasStarted(engagement, posting, now = new Date()) {
  if (engagement.arrivalStatus === "CONFIRMED" || engagement.startedAt) return true;
  return Boolean(posting.startAt) && now.getTime() >= new Date(posting.startAt).getTime();
}

/** The status column and the confirmed-at column of a checkpoint. */
export function checkpointFields(checkpoint) {
  return {
    status: `${checkpoint}Status`,
    confirmedAt: `${checkpoint}ConfirmedAt`,
    code: `${checkpoint}Code`,
    failedAttempts: `${checkpoint}FailedAttempts`,
  };
}

/** True when a checkpoint is finished (nothing more can be entered there). */
function isResolved(status) {
  return status === "CONFIRMED" || status === "SETTLED_BY_RULING";
}

/**
 * The earliest checkpoint not yet confirmed, or null when every one this engagement has is done.
 * Payment counts only when the arrangement has a payment checkpoint (FR-ENG-02).
 */
export function nextCheckpoint(engagement, posting) {
  for (const checkpoint of CHECKPOINTS) {
    if (checkpoint === "payment" && !hasPaymentCheckpoint(posting)) continue;
    if (!isResolved(engagement[checkpointFields(checkpoint).status])) return checkpoint;
  }
  return null;
}

/**
 * The checkpoint that can be acted on right now, or null. It is the earliest unresolved one,
 * but only while the engagement is Active and only once the arrival checkpoint has been
 * reached — the arrival code is "issued at the start" (prototype 5.3t), so before the start
 * nobody is shown a code and nothing is owed.
 */
export function liveCheckpoint(engagement, posting, now = new Date()) {
  if (engagement.status !== "ACTIVE") return null;
  if (!hasStarted(engagement, posting, now)) return null;
  const checkpoint = nextCheckpoint(engagement, posting);
  if (!checkpoint) return null;
  // A checkpoint where someone already said "unable to confirm" is held by the dispute.
  if (engagement[checkpointFields(checkpoint).status] === "UNABLE_TO_CONFIRM") return null;
  return checkpoint;
}

/** "WORKER" or "EMPLOYER": which side of the engagement a user is on, or null for neither. */
export function partyOf(engagement, userId) {
  if (engagement.workerId === userId) return "WORKER";
  if (engagement.employerId === userId) return "EMPLOYER";
  return null;
}

/**
 * The code the viewer holds and may show right now (FR-ENG-01 custody), or null. A party is
 * never given the code they have to ENTER — that is the whole mechanism.
 */
export function codeHeldBy(engagement, posting, party, now = new Date()) {
  const checkpoint = liveCheckpoint(engagement, posting, now);
  if (!checkpoint || CODE_HOLDER[checkpoint] !== party) return null;
  return engagement[checkpointFields(checkpoint).code] ?? null;
}

/**
 * The rating window (FR-RATE-02, FR-RATE-05). Rating eligibility is decided by ratingOpenedAt
 * alone (rating.service.js). The window closes at the reveal, or 14 days after it opened,
 * whichever is first.
 *
 * @returns {{ openedAt: Date|null, closesAt: Date|null, isOpen: boolean, revealed: boolean }}
 */
export function ratingWindow(engagement, now = new Date()) {
  const openedAt = engagement.ratingOpenedAt ? new Date(engagement.ratingOpenedAt) : null;
  if (!openedAt) return { openedAt: null, closesAt: null, isOpen: false, revealed: false };
  const deadline = new Date(openedAt.getTime() + RATING_WINDOW_DAYS * DAY_MS);
  // Any rating carrying revealedAt means the pair has been revealed (both rated, or the deadline
  // was recorded by the rating module); ratings here are ALL ratings of the engagement.
  const revealTimes = (engagement.ratings ?? [])
    .map((r) => (r.revealedAt ? new Date(r.revealedAt).getTime() : null))
    .filter((t) => t !== null);
  const revealedAt = revealTimes.length > 0 ? new Date(Math.min(...revealTimes)) : null;
  const closesAt = revealedAt && revealedAt < deadline ? revealedAt : deadline;
  return {
    openedAt,
    closesAt,
    isOpen: now < closesAt,
    revealed: Boolean(revealedAt) || now >= deadline,
  };
}

/** True when the viewer has already submitted their rating of this engagement. */
export function hasRated(engagement, userId) {
  return (engagement.ratings ?? []).some((r) => r.raterId === userId);
}

/**
 * What the VIEWER owes on this engagement right now (FR-ENG-14 as amended 2026-09-24), or null.
 * The screen turns the kind into its copy ("Enter arrival code", "Re-confirm the new start — by
 * …", "Rate Saman Stores"). Order matters: a pending re-confirmation or cancellation response is
 * what the engagement is waiting on, so it comes before a code.
 *
 * @returns {null | { kind: "CODE", checkpoint: string, role: "HOLDER"|"ENTERER" }
 *               | { kind: "RECONFIRM", deadline: Date, changedFields: string[] }
 *               | { kind: "RESPOND_CANCELLATION", deadline: Date|null }
 *               | { kind: "RATE" }}
 */
export function nextActionFor(engagement, posting, userId, now = new Date()) {
  const party = partyOf(engagement, userId);
  if (!party) return null;

  if (engagement.status === "ACTIVE") {
    // FR-ENG-09: a re-confirmation is the worker's to give.
    const change = (engagement.materialChangeRequests ?? []).find((r) => r.status === "PENDING");
    if (change && party === "WORKER") {
      return {
        kind: "RECONFIRM",
        deadline: change.deadline,
        changedFields: Object.keys(change.changeSummary ?? {}),
      };
    }
    // FR-ENG-05: an open cancellation request is the OTHER party's to answer.
    const request = (engagement.cancellationRequests ?? []).find((r) => r.status === "PENDING");
    if (request && request.requestedByUserId !== userId) {
      return { kind: "RESPOND_CANCELLATION", deadline: request.deadline ?? null };
    }
    // FR-ENG-01: an unresolved checkpoint — the holder shows, the other party enters.
    const checkpoint = liveCheckpoint(engagement, posting, now);
    if (checkpoint) {
      return { kind: "CODE", checkpoint, role: CODE_HOLDER[checkpoint] === party ? "HOLDER" : "ENTERER" };
    }
    return null;
  }

  // An enforced rating not yet given, while its window is open (FR-RATE-05: a cancelled
  // engagement's rating stays available but is never an owed action).
  if ((engagement.status === "COMPLETED" || engagement.status === "ENDED") && engagement.ratingEnforced !== false) {
    const window = ratingWindow(engagement, now);
    if (window.isOpen && !hasRated(engagement, userId)) return { kind: "RATE" };
  }
  return null;
}

/**
 * FR-ENG-14 retention (amended 2026-09-24): does this engagement still belong on the viewer's
 * list? Active and Disputed always; anything owing the viewer an action always; a finished one
 * (Completed, Cancelled, Ended) until 30 days after its rating window closes.
 */
export function isListed(engagement, posting, userId, now = new Date()) {
  if (engagement.status === "ACTIVE" || engagement.status === "DISPUTED") return true;
  if (nextActionFor(engagement, posting, userId, now)) return true;

  // When the rating window opened. A cancelled engagement's optional rating opens at the
  // cancellation (FR-RATE-05), so an older cancelled row without ratingOpenedAt uses that.
  const openedAt =
    engagement.ratingOpenedAt ?? engagement.cancelledAt ?? engagement.endedAt ?? engagement.updatedAt;
  const { closesAt } = ratingWindow({ ...engagement, ratingOpenedAt: openedAt }, now);
  if (!closesAt) return true;
  return now.getTime() <= closesAt.getTime() + RETENTION_DAYS_AFTER_RATING * DAY_MS;
}

// ---------------------------------------------------------------------------
// Cancellation — FR-ENG-05 / 06 / 07 (all as amended 2026-09-24)
// ---------------------------------------------------------------------------

/** FR-ENG-05: the other party's response window on a regular request. */
export const CANCELLATION_WINDOW_MS = 48 * HOUR_MS;
/** FR-ENG-05/06: more than this to the start → a request; this or less → immediate. */
export const URGENT_THRESHOLD_MS = 48 * HOUR_MS;
/** FR-ENG-07: weight of a Late cancellation against an early one. */
export const LATE_WEIGHT = 2.0;
export const EARLY_WEIGHT = 1.0;

/** FR-ENG-05's fixed reasons, in the order the prototype lists them (5.7t). */
export const CANCELLATION_REASONS = [
  "SCHEDULE_CONFLICT",
  "DETAILS_NO_LONGER_SUITABLE",
  "FOUND_OTHER_WORK",
  "PERSONAL_EMERGENCY",
  "OTHER",
];

/**
 * Which rule a cancellation falls under, decided at the moment it is made (FR-ENG-05/06 as
 * amended): more than 48 hours to the start is REGULAR (a request with a 48-hour window);
 * 48 hours or less is URGENT (immediate, no approval step).
 */
export function cancellationRegime(startAt, now = new Date()) {
  const msToStart = new Date(startAt).getTime() - now.getTime();
  return msToStart > URGENT_THRESHOLD_MS ? "REGULAR" : "URGENT";
}

/**
 * FR-ENG-06: is an urgent cancellation Late? Within 6 hours of the start — or within 24 hours
 * when the engagement was agreed more than 48 hours before the start. A regular cancellation is
 * never Late (FR-ENG-05), so callers only ask this for the urgent regime.
 *
 * @returns {null | "UNDER_6_HOURS" | "BOOKED_AHEAD"} why it is late, or null when it is not
 */
export function lateReason({ startAt, engagementCreatedAt, now = new Date() }) {
  const start = new Date(startAt).getTime();
  const msToStart = start - now.getTime();
  if (msToStart < 6 * HOUR_MS) return "UNDER_6_HOURS";
  const bookedAhead = start - new Date(engagementCreatedAt).getTime() > URGENT_THRESHOLD_MS;
  if (bookedAhead && msToStart < 24 * HOUR_MS) return "BOOKED_AHEAD";
  return null;
}

/**
 * What cancelling right now would mean, for the screen to word it before the person commits
 * (5.7t, 5.10, 5.7e). The server decides again when the cancellation is actually sent.
 */
export function cancellationPreview(engagement, posting, now = new Date()) {
  const regime = cancellationRegime(posting.startAt, now);
  const late = regime === "URGENT" ? lateReason({ startAt: posting.startAt, engagementCreatedAt: engagement.createdAt, now }) : null;
  return {
    regime,
    isLate: Boolean(late),
    lateReason: late,
    hoursToStart: Math.max(0, (new Date(posting.startAt).getTime() - now.getTime()) / HOUR_MS),
  };
}

/** The employer's name as the worker sees it: the business the posting was published as, or their own name. */
export function employerDisplayName(posting, employer) {
  if (posting?.postedAsType === "BUSINESS") {
    return posting.postedBusinessName || employer?.businessName || employer?.legalName;
  }
  return employer?.legalName;
}
