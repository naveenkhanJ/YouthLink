/**
 * Display strings for the Applying & Selection screens — Naveenkhan.
 *
 * Every sentence these screens show about an application or an applicant is built here, once, so
 * the list, the pool, the detail and the dialogs can never word the same fact two ways. Pay, fill
 * and date formats are not re-implemented: they come from the Gig Posting module's own formatter
 * (screens/posting/posting.format.js, design-system.md §9), so a posting reads the same on the
 * employer's screens and the worker's.
 *
 * Copy marked "drawn" is verbatim from docs/prototype (M3 3.12, M4). Copy marked "derived" applies
 * a drawn sentence's pattern to a case the prototype does not draw — each is listed in the
 * module's report for confirmation.
 *
 * Pure functions, no React — so they can be checked on their own.
 */
import { formatDate, formatStartFull, fillText } from "../posting/posting.format.js";
import { GIG_CATEGORIES, ARRANGEMENT_TYPES } from "../posting/posting.constants.js";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** "Sat 26 Sep 2026" — a date with its weekday and no time (4.3t "Closes Sat 26 Sep 2026"). */
export function formatDayDate(value) {
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  return `${WEEKDAYS[d.getDay()]} ${formatDate(d)}`;
}

/** First name for a button label ("Select Nethmi", 4.7). */
export function firstName(name) {
  return String(name ?? "").trim().split(/\s+/)[0] ?? "";
}

/** "+94 76 234 5678" (4.8) from the stored E.164 "+94762345678"; anything else is shown as stored. */
export function formatPhone(phone) {
  const match = /^\+94(\d{2})(\d{3})(\d{4})$/.exec(String(phone ?? ""));
  return match ? `+94 ${match[1]} ${match[2]} ${match[3]}` : String(phone ?? "");
}

// ---------------------------------------------------------------------------
// Listing detail (3.12)
// ---------------------------------------------------------------------------

const labelOf = (list, id) => list.find((item) => item.id === id)?.label ?? "";

/** "Event setup · One-off gig" (3.12 meta). */
export function listingMeta(posting) {
  return [labelOf(GIG_CATEGORIES, posting.category), labelOf(ARRANGEMENT_TYPES, posting.arrangementType)]
    .filter(Boolean)
    .join(" · ");
}

/**
 * 3.12 `fillStart`: a one-off gig — "0 of 3 filled · Starts Sat 29 Aug 2026, 5:00 AM"; a part-time
 * job or internship — "2 of 2 filled · Mon–Sat 6–10 am · Starts Mon 7 Sep 2026" (its schedule, and a
 * start date without a time, as 3.12d draws it).
 */
export function listingFillStart(posting) {
  if (posting.arrangementType === "GIG") {
    return `${fillText(posting)} · Starts ${formatStartFull(posting.startAt)}`;
  }
  return [fillText(posting), posting.schedule, `Starts ${formatDayDate(posting.startAt)}`].filter(Boolean).join(" · ");
}

/**
 * 3.12 `businessBio`: "Business · Event staffing across Colombo." for a business, and
 * "Individual/Household · Colombo 05." (the area) for someone posting as themselves.
 */
export function employerLine(employer, posting) {
  if (employer.postedAsType === "BUSINESS") {
    return employer.businessBio ? `Business · ${employer.businessBio}` : "Business";
  }
  return `Individual/Household · ${posting.locationAreaLabel}.`;
}

// ---------------------------------------------------------------------------
// My applications (4.3*)
// ---------------------------------------------------------------------------

/** The Display/Badge `value` for an application's state ("NOT_SELECTED" → "notselected"). */
export function applicationBadgeValue(status) {
  return String(status ?? "PENDING").replace(/_/g, "").toLowerCase();
}

/**
 * A pending row's meta (FR-APPLY-12): when its posting closes and, on a multi-slot posting, how
 * full it is. A one-off gig closes at its start, so the time is shown ("Closes Sat 29 Aug 2026,
 * 8:00 AM · 0 of 3 filled"); a part-time job or internship closes on a day ("Closes Sat 26 Sep 2026").
 */
export function pendingMeta(row) {
  const { posting } = row;
  const closes =
    posting.arrangementType === "GIG" ? formatStartFull(posting.closesAt) : formatDayDate(posting.closesAt);
  const fill = posting.workersNeeded > 1 ? ` · ${fillText(posting)}` : "";
  return `Closes ${closes}${fill}`;
}

/** Why a Not-selected application closed, as a clause (4.3r drawn; the others derived). */
function notSelectedClause(row) {
  switch (row.notSelectedReason) {
    case "WITHDRAWN":
      return "the employer withdrew the posting"; // derived — design-system "States not drawn" (M4)
    case "EXPIRED":
      // drawn for a one-off gig, which closes at its start; a part-time job closes 30 days after posting
      return row.posting?.arrangementType === "GIG" || row.arrangementType === "GIG"
        ? "the posting closed at its start"
        : "the posting closed"; // derived
    default:
      return "the posting filled"; // derived — M4 "States not drawn"
  }
}

/** A resolved row's meta line (4.3sw, 4.3n, 4.3r, 4.3nj, 4.3njc). */
export function resolvedMeta(row) {
  switch (row.status) {
    case "WITHDRAWN":
      // 4.3*w draw "Withdrawn by you — the employer has been told", but no requirement or notification
      // type tells the employer of a withdrawal. Ruled 2026-10-06 (Afham, viva-demo A2): the row says
      // only what is true.
      return "Withdrawn by you";
    case "DECLINED":
      return "Declined by the employer";
    case "NOT_SELECTED":
      return `Not selected — ${notSelectedClause(row)}`;
    case "SELECTED":
      if (row.engagement?.status === "CANCELLED") {
        return row.engagement.cancelledByYou
          ? "Engagement cancelled by you — see engagement" // drawn (4.3njc)
          : "Engagement cancelled by the employer — see engagement"; // derived
      }
      return "Contact shared — see engagement";
    default:
      return "";
  }
}

// The list footer (every 4.3*), word for word.
export const ORDER_NOTE =
  "Pending first, soonest closing first. Decided and withdrawn applications show for 30 days.";

// ---------------------------------------------------------------------------
// Applicant pool and detail (4.5*, 4.6*, 4.7*, 4.8*, 4.9*)
// ---------------------------------------------------------------------------

export const TIER_NOTE = "Sorted by trust tier — history, endorsed, new.";

// The decline dialog's body (4.9, 4.9p). The prototype writes "She'll"/"He'll"; the product stores
// no gender, so the gender-neutral form the prototype itself uses on 4.5x ("they have been told")
// is used (see report).
export const DECLINE_DIALOG_BODY = "They'll be notified, and this can't be undone for this posting.";

/**
 * The pool's context line: "Event setup crew (3 needed) · 0 of 3 filled" (4.5), and once a gig has
 * closed at its start "… · 1 of 3 filled · closed at its start, Sat 29 Aug 2026, 7:00 AM" (4.5x).
 */
export function poolContext(posting) {
  const base = `${posting.title} · ${fillText(posting)}`;
  if (posting.status === "EXPIRED" && posting.arrangementType === "GIG") {
    return `${base} · closed at its start, ${formatStartFull(posting.expiresAt ?? posting.startAt)}`;
  }
  return base;
}

/** The empty pool's context: "0 of 3 filled · posted today" (4.5b); an older posting gives its date (derived). */
export function emptyPoolContext(posting, now = new Date()) {
  const posted = new Date(posting.createdAt);
  const sameDay = posted.toDateString() === now.toDateString();
  return `${fillText(posting)} · posted ${sameDay ? "today" : formatDate(posted)}`;
}

/**
 * A decided applicant's row note in the pool, in place of their own note (4.5s, 4.5d, 4.5x).
 * The prototype writes "she/he has been told" in 4.5d and "they have been told" in 4.5x; the
 * product stores no gender, so the gender-neutral form of 4.5x is used throughout (see report).
 */
export function poolResolvedNote(row) {
  switch (row.status) {
    case "SELECTED":
      return "Selected — an engagement is created; contact shared both ways.";
    case "DECLINED":
      return "Declined — they have been told; kept here for your records.";
    case "NOT_SELECTED":
      return `Not selected — ${notSelectedClause(row)}; they have been told.`;
    default:
      return row.note ?? "";
  }
}

/**
 * 4.6's `endorsersNote`: "Endorsed by K. Rathnayake (Reliability) and M. Perera (Punctuality,
 * Honesty)." — an endorser who selected no attribute is named alone.
 */
export function endorsersSentence(endorsers = []) {
  const parts = endorsers.map((e) => (e.attributes?.length ? `${e.name} (${e.attributes.join(", ")})` : e.name));
  if (parts.length === 0) return "";
  const joined = parts.length === 1 ? parts[0] : `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;
  return `Endorsed by ${joined}.`;
}

/** 4.6t's trust-block line: "1 endorsement" (plural derived). */
export function endorsementCountLine(count) {
  return `${count} endorsement${count === 1 ? "" : "s"}`;
}

/** 4.7's third bullet: "• Takes one of the 3 places on this posting" (one place: derived, see report). */
export function placesBullet(workersNeeded) {
  return workersNeeded === 1
    ? "• Takes the one place on this posting"
    : `• Takes one of the ${workersNeeded} places on this posting`;
}

/** 4.8's context: "Event setup crew (3 needed) · engagement active". */
export function contactContext(title, engagementStatus) {
  return `${title} · engagement ${String(engagementStatus ?? "ACTIVE").toLowerCase()}`;
}
