/**
 * What each notification row says — Pawan.
 *
 * FR-NOTIF-08 (amendment A11) defines every row as title · one body line · tap target, per
 * NotificationType. Pure functions, no React, so each rule can be read and checked on its own.
 *
 * Fully built here: the three gig types this module creates (FR-NOTIF-01, FR-NOTIF-02):
 *   URGENT_GIG     "Urgent gig near you"  · title · pay + basis · distance · starts → the listing
 *   NEW_GIG        "New gig near you"     · same body                               → the listing
 *   URGENT_DIGEST  "{n} more urgent gigs today" · top title + count                 → expands in place
 *
 * The other types are created by the Applying, Engagement, Posting and Rating modules. Their rows
 * follow A11's table (requirements.md, FR-NOTIF-08) — the title, one body line and the place a tap
 * opens — worded here from what the sending module put in the payload, so every row reads the same
 * whichever module wrote it. Where a module draws its own words (Applying's rows on 3.10x/3.10ea/
 * 3.10n) it writes them as `payload.body`, and that is used as it stands.
 */
import { payLine, formatStartFull, formatStartShort, formatDate } from "../posting/posting.format.js";
import { reasonLabel } from "../engagement/engagement.format.js";

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/**
 * Display/NotificationRow's `time`: relative up to seven days ("2h ago", "7d ago"), a date with its
 * year beyond that ("2 Aug 2026") — design-system.md §5.
 */
export function timeAgo(createdAt, now = Date.now()) {
  const age = Math.max(0, now - new Date(createdAt).getTime());
  if (age < HOUR) return `${Math.max(1, Math.floor(age / MINUTE))}m ago`;
  if (age < DAY) return `${Math.floor(age / HOUR)}h ago`;
  const days = Math.floor(age / DAY);
  if (days <= 7) return `${days}d ago`;
  return formatDate(createdAt);
}

/** "4.5" — one decimal, a whole number without its ".0". */
function km(value) {
  return String(Math.round(Number(value) * 10) / 10);
}

/**
 * A gig row's body, from the snapshot the fan-out stored (A11: title · pay + basis · distance ·
 * starts), as drawn on 3.10x:
 *   urgent  "Event setup crew (3 needed) · Rs 6,000 for the job · 4.5 km · starts Sat 5:00 AM"
 *   new gig "Grade 8 maths tutoring · Rs 1,800 per day · 3.6 km · starts Mon 7 Sep 2026, 4:00 PM"
 * An urgent gig starts within 48 hours, so its weekday is enough; a new-gig row writes the date out,
 * as every drawn one does.
 */
export function gigBody(payload, { urgent }) {
  const starts = urgent ? formatStartShort(payload.startAt) : formatStartFull(payload.startAt);
  return [payload.title, payLine(payload), `${km(payload.distanceKm)} km`, `starts ${starts}`].join(" · ");
}

// A11's titles for the types other modules send. `{title}` is the posting's title.
const OTHER_TITLES = {
  APPLICATION_RECEIVED: "New applicant for {title}",
  APPLICATION_SELECTED: "You're selected for {title}",
  APPLICATION_DECLINED: "Update on {title}",
  APPLICATION_NOT_SELECTED: "Update on {title}",
  APPLICATION_TERMS_CHANGED: "{title} changed",
  MATERIAL_CHANGE: "{title} changed",
  NO_APPLICANT_NUDGE: "No applicants yet on {title}",
  CANCELLATION_REQUEST: "Cancellation requested",
  STALLED_ENGAGEMENT_PROMPT: "Did this happen?",
  CLARIFICATION_REQUEST: "Question about your case",
  DISPUTE_OPENED: "A case was opened",
  DISPUTE_RESOLVED: "Your case is resolved",
  FLAGGED_CONTENT_OUTCOME: "Update on your posting",
  ENDORSEMENT_PAYOFF: "Your endorsement paid off",
  RATING_WINDOW_OPEN: "Rate your engagement",
  RATING_REVEALED: "Ratings are in",
  WARNING_RECORDED: "A warning was recorded on your account",
};

/**
 * A11 `Cancellation {outcome}` (accepted / rejected / auto-resolved). A cancellation that took
 * effect at once (an urgent gig, FR-ENG-06) has no one to accept it, so its row names who cancelled.
 */
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

const lowerFirst = (text) => (text ? text.charAt(0).toLowerCase() + text.slice(1) : text);

/** A11's body line for a type whose module wrote data rather than words. */
function otherBody(type, payload, postingTitle) {
  if (typeof payload.body === "string" && payload.body) return payload.body;
  const who = payload.fromName ?? "The other party";
  switch (type) {
    case "APPLICATION_DECLINED":
      return "You weren't selected this time";
    case "APPLICATION_NOT_SELECTED":
      return "The posting has closed";
    case "CANCELLATION_REQUEST":
      // As drawn on 3.10: "Grade 8 maths tutoring · Dilrukshi Herath: schedule conflict · respond within 48 hours".
      return `${postingTitle} · ${who}: ${lowerFirst(reasonLabel(payload.reason))} · respond within 48 hours`;
    case "CANCELLATION_RESOLVED":
      if (payload.outcome === "ACCEPTED") return `${who} accepted. ${postingTitle} is cancelled, with no penalty to you.`;
      if (payload.outcome === "REJECTED") return `${who} didn't agree to cancel ${postingTitle}. It stands as agreed.`;
      if (payload.outcome === "AUTO_RESOLVED_NO_RESPONSE") return `${who} didn't respond in time, so ${postingTitle} is cancelled.`;
      return `${postingTitle} · ${lowerFirst(reasonLabel(payload.reason))}`;
    case "RATING_WINDOW_OPEN":
      // 3.10 draws two wordings: the worker's is "counterparty · title · closes in 14 days", the
      // employer's says the work is complete and when ratings unlock.
      return payload.party === "EMPLOYER"
        ? `${postingTitle} with ${payload.counterpartName} is complete. Ratings unlock when you have both rated, or after 14 days.`
        : `${payload.counterpartName} · ${postingTitle} · closes in 14 days`;
    case "RATING_REVEALED":
      return payload.counterpartName
        ? `You and ${payload.counterpartName} have both rated — see the pair.`
        : "Both ratings are now visible — see the pair.";
    default:
      return "";
  }
}

/** A11's "Opens" column, as a route and its params; null where no screen is built or none is named. */
function otherTarget(type, payload) {
  const { gigPostingId, engagementId } = payload;
  switch (type) {
    case "APPLICATION_RECEIVED":
      return { screen: "ApplicationApplicantPool", params: { gigPostingId } };
    case "APPLICATION_SELECTED":
    case "CANCELLATION_RESOLVED":
      return engagementId ? { screen: "EngagementDetail", params: { engagementId } } : null;
    case "APPLICATION_DECLINED":
    case "APPLICATION_NOT_SELECTED":
    case "APPLICATION_TERMS_CHANGED":
      return { screen: "ApplicationMine", params: {} };
    case "MATERIAL_CHANGE":
      return { screen: "EngagementReconfirm", params: { engagementId } };
    case "CANCELLATION_REQUEST":
      return { screen: "EngagementCancelRequest", params: { engagementId } };
    case "RATING_WINDOW_OPEN":
      return { screen: "RatingRate", params: { engagementId } };
    case "RATING_REVEALED":
      return { screen: "RatingRevealed", params: { engagementId } };
    case "NO_APPLICANT_NUDGE":
      return { screen: "PostingDetail", params: { postingId: gigPostingId } };
    default:
      return null;
  }
}

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

/**
 * How one history row is shown.
 *
 * @param {object} row - a Notification from GET /api/notifications (a digest has `children`;
 *   other modules' rows may have `gigTitle`, attached by the server from their gigPostingId)
 * @returns {{ type: "standard"|"digest", title: string, body: string, opens: object|null } | null}
 *   `opens` is { gigPostingId } for a gig row, "expand" for the digest, null for no target.
 *   null when the row can't be worded from what it carries.
 */
export function presentRow(row) {
  const payload = row.payload ?? {};

  switch (row.type) {
    case "URGENT_GIG":
      return {
        type: "standard",
        title: "Urgent gig near you",
        body: gigBody(payload, { urgent: true }),
        opens: { gigPostingId: payload.gigPostingId },
      };
    case "NEW_GIG":
      return {
        type: "standard",
        title: "New gig near you",
        body: gigBody(payload, { urgent: false }),
        opens: { gigPostingId: payload.gigPostingId },
      };
    case "URGENT_DIGEST": {
      const children = row.children ?? [];
      if (children.length === 0) return null;
      const top = children[0].payload?.title ?? "";
      return {
        type: "digest",
        title: `${plural(children.length, "more urgent gig", "more urgent gigs")} today`,
        body: children.length > 1 ? `${top} and ${children.length - 1} more` : top,
        opens: "expand",
      };
    }
    default: {
      // The posting's own title: the one the sender stored, else the current one the server
      // attached. (`payload.title` is the posting title for some senders, the whole drawn title
      // for others, so it is only a last resort.)
      const postingTitle = payload.postingTitle ?? row.gigTitle ?? payload.title;
      const template = row.type === "CANCELLATION_RESOLVED" ? "" : OTHER_TITLES[row.type];
      if (template === undefined) return null;
      if (template.includes("{title}") && !postingTitle) return null;
      const title =
        row.type === "CANCELLATION_RESOLVED" ? cancellationResolvedTitle(payload) : template.replace("{title}", postingTitle);
      return {
        type: "standard",
        title,
        body: otherBody(row.type, payload, postingTitle),
        opens: otherTarget(row.type, payload),
      };
    }
  }
}
