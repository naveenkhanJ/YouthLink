/**
 * What a push notification says, and which Android channel it arrives on.
 *
 * Epic: FR-NOTIF  ·  Added 2026-10-18 (real push delivery)
 * Requirements:
 *   - FR-NOTIF-08: the history is "a chronological log of past pushes", so a push and its history row
 *     say the same thing. The words follow A11's table (title · one body line), exactly as the app's
 *     history formatter writes them (mobile/src/screens/notification/notification.format.js). The
 *     two are kept in step by hand: the app formats in the phone's clock, this file in Sri Lanka time
 *     (NFR-LOC-04), and they share no code because they live in different packages.
 *   - FR-NOTIF-10: urgent gig alerts use their own channel ("urgent_gigs", high importance); every
 *     other notification uses the regular channel ("updates"). The app creates both channels with
 *     the same ids at start-up.
 *
 * Pure functions, no database, so each wording can be tested on its own.
 */
import { formatStartFull, payLine } from "../application/application.notifications.js";

export const CHANNEL_URGENT = "urgent_gigs";
export const CHANNEL_REGULAR = "updates";

const TIME_ZONE = "Asia/Colombo";
const DAY_MS = 24 * 60 * 60 * 1000;

/** "Sat 5:00 AM" — the weekday is enough inside the coming week (the app's formatStartShort). */
function formatStartShort(value, now) {
  const date = new Date(value);
  const ahead = date.getTime() - now.getTime();
  if (ahead < 0 || ahead >= 7 * DAY_MS) return formatStartFull(date);
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, weekday: "short", hour: "numeric", minute: "2-digit", hour12: true })
      .formatToParts(date)
      .map((p) => [p.type, p.value]),
  );
  return `${parts.weekday} ${parts.hour}:${parts.minute} ${parts.dayPeriod.toUpperCase()}`;
}

/** "4.5" — one decimal, a whole number without its ".0". */
const km = (value) => String(Math.round(Number(value) * 10) / 10);

/** A11 gig body: title · pay + basis · distance · starts (as drawn on 3.10x). */
function gigBody(payload, urgent, now) {
  const starts = urgent ? formatStartShort(payload.startAt, now) : formatStartFull(payload.startAt);
  return [payload.title, payLine(payload), `${km(payload.distanceKm)} km`, `starts ${starts}`].join(" · ");
}

const lowerFirst = (text) => (text ? text.charAt(0).toLowerCase() + text.slice(1) : text);

const CANCELLATION_REASONS = {
  SCHEDULE_CONFLICT: "Schedule conflict",
  DETAILS_NO_LONGER_SUITABLE: "Details no longer suitable",
  FOUND_OTHER_WORK: "Found other work",
  PERSONAL_EMERGENCY: "Personal emergency",
  OTHER: "Other",
};

// A11's titles. `{title}` is the posting's title, `{name}` a person's display name.
const TITLES = {
  APPLICATION_RECEIVED: "New applicant for {title}",
  APPLICATION_SELECTED: "You're selected for {title}",
  APPLICATION_DECLINED: "Update on {title}",
  APPLICATION_NOT_SELECTED: "Update on {title}",
  APPLICATION_TERMS_CHANGED: "{title} changed",
  MATERIAL_CHANGE: "{title} changed",
  NO_APPLICANT_NUDGE: "No applicants yet on {title}",
  CANCELLATION_REQUEST: "Cancellation requested",
  END_ENGAGEMENT: "{name} ended the engagement",
  STALLED_ENGAGEMENT_PROMPT: "Did this happen?",
  CLARIFICATION_REQUEST: "Question about your case",
  DISPUTE_OPENED: "A case was opened",
  DISPUTE_RESOLVED: "Your case is resolved",
  FLAGGED_CONTENT_OUTCOME: "Update on your posting",
  ENDORSEMENT_RECEIVED: "{name} vouched for you",
  ENDORSEMENT_REVOKED: "{name} revoked their endorsement",
  ENDORSEMENT_PAYOFF: "Your endorsement paid off",
  RATING_WINDOW_OPEN: "Rate your engagement",
  RATING_REVEALED: "Ratings are in",
  WARNING_RECORDED: "A warning was recorded on your account",
};

/** The person a row is about, whichever field its sending module stored the name in. */
function nameIn(type, payload) {
  switch (type) {
    case "END_ENGAGEMENT":
      return payload.endedByName;
    case "ENDORSEMENT_RECEIVED":
    case "ENDORSEMENT_REVOKED":
      return payload.endorserName;
    default:
      return payload.fromName ?? payload.counterpartName;
  }
}

function cancellationResolvedTitle(payload) {
  switch (payload.outcome) {
    case "ACCEPTED":
      return "Cancellation accepted";
    case "REJECTED":
      return "Cancellation rejected";
    case "AUTO_RESOLVED_NO_RESPONSE":
      return "Cancellation auto-resolved";
    default:
      return `${payload.fromName ?? "The other party"} cancelled`;
  }
}

/** "Arrival dispute" / "Completion dispute" — the wording 3.10r's ruling row uses. */
function disputeLabel(payload) {
  if (payload.stalled) return "Stalled engagement";
  const checkpoint = String(payload.checkpoint ?? "").toLowerCase(); // "arrival" | "completion" | "payment"
  if (checkpoint === "completion") return "Completion dispute";
  if (checkpoint === "arrival") return "Arrival dispute";
  if (checkpoint === "payment") return "Payment dispute";
  return "Dispute";
}

/** A11's body line for every type other than the three gig types. */
function otherBody(type, payload, postingTitle) {
  if (typeof payload.body === "string" && payload.body) return payload.body;
  const who = payload.fromName ?? "The other party";
  switch (type) {
    case "APPLICATION_DECLINED":
      return "You weren't selected this time";
    case "APPLICATION_NOT_SELECTED":
      return "The posting has closed";
    case "CANCELLATION_REQUEST":
      return `${postingTitle} · ${who}: ${lowerFirst(CANCELLATION_REASONS[payload.reason] ?? "Other")} · respond within 48 hours`;
    case "CANCELLATION_RESOLVED":
      if (payload.outcome === "ACCEPTED") return `${who} accepted. ${postingTitle} is cancelled, with no penalty to you.`;
      if (payload.outcome === "REJECTED") return `${who} didn't agree to cancel ${postingTitle}. It stands as agreed.`;
      if (payload.outcome === "AUTO_RESOLVED_NO_RESPONSE") return `${who} didn't respond in time, so ${postingTitle} is cancelled.`;
      return `${postingTitle} · ${lowerFirst(CANCELLATION_REASONS[payload.reason] ?? "Other")}`;
    case "RATING_WINDOW_OPEN":
      return payload.party === "EMPLOYER"
        ? `${postingTitle} with ${payload.counterpartName} is complete. Ratings unlock when you have both rated, or after 14 days.`
        : `${payload.counterpartName} · ${postingTitle} · closes in 14 days`;
    case "RATING_REVEALED":
      return payload.counterpartName
        ? `You and ${payload.counterpartName} have both rated — see the pair.`
        : "Both ratings are now visible — see the pair.";
    case "END_ENGAGEMENT":
      return payload.somethingWentWrong
        ? `${postingTitle} · a dispute case is open — you can respond`
        : `${postingTitle} · you can rate the engagement now`;
    case "STALLED_ENGAGEMENT_PROMPT":
      return payload.startAt ? `${postingTitle} · started ${formatStartFull(payload.startAt)}` : postingTitle;
    case "DISPUTE_OPENED":
      return payload.stalled
        ? `${disputeLabel(payload)} — ${postingTitle}: sent for review`
        : `${disputeLabel(payload)} — ${postingTitle} · respond within 48 hours`;
    case "NO_APPLICANT_NUDGE":
      return "Still no applicants after 24 hours. Consider reviewing the pay or details.";
    case "ENDORSEMENT_RECEIVED":
      return "Your endorsement badge now shows on your applications";
    case "ENDORSEMENT_REVOKED":
      return `${payload.endorserName}'s endorsement no longer shows on your profile · work you already got isn't affected`;
    case "ENDORSEMENT_PAYOFF":
      return `${payload.workerName} went on to build a good rating.`;
    default:
      return "";
  }
}

/**
 * The push for one Notification row.
 *
 * @param {{ type: string, payload: object }} row
 * @param {{ postingTitle?: string, digestCount?: number, now?: Date }} [context] - the posting's
 *   current title when the row stored only its id; the number of gigs in an urgent digest.
 * @returns {{ title: string, body: string, channelId: string } | null} null when the row cannot be
 *   worded from what it carries — it is then left to the in-app history alone.
 */
export function pushContent(row, { postingTitle: currentTitle, digestCount = 0, now = new Date() } = {}) {
  const payload = row.payload ?? {};
  switch (row.type) {
    case "URGENT_GIG":
      return { title: "Urgent gig near you", body: gigBody(payload, true, now), channelId: CHANNEL_URGENT };
    case "NEW_GIG":
      return { title: "New gig near you", body: gigBody(payload, false, now), channelId: CHANNEL_REGULAR };
    case "URGENT_DIGEST": {
      // The digest is created by the 6th urgent gig of the day, which is already batched into it.
      const n = Math.max(1, digestCount);
      return {
        title: `${n} more urgent ${n === 1 ? "gig" : "gigs"} today`,
        body: "Open YouthLink to see them all.",
        channelId: CHANNEL_URGENT,
      };
    }
    default: {
      const postingTitle = payload.postingTitle ?? currentTitle ?? payload.title;
      if (row.type === "CANCELLATION_RESOLVED") {
        return { title: cancellationResolvedTitle(payload), body: otherBody(row.type, payload, postingTitle), channelId: CHANNEL_REGULAR };
      }
      const template = TITLES[row.type];
      if (template === undefined) return null;
      if (template.includes("{title}") && !postingTitle) return null;
      const name = nameIn(row.type, payload);
      if (template.includes("{name}") && !name) return null;
      const title = template.replace("{title}", postingTitle).replace("{name}", name);
      return { title, body: otherBody(row.type, payload, postingTitle), channelId: CHANNEL_REGULAR };
    }
  }
}

export default { pushContent, CHANNEL_URGENT, CHANNEL_REGULAR };
