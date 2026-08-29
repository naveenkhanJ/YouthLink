/**
 * The closed sets and derived rules the posting form runs on — FR-POST.
 *
 * Kept in one file rather than inline in the screen so the form, the review
 * step and the detail screen all read the same definitions, and so the
 * client-side copies of the backend's rules sit next to each other where a
 * drift is obvious. `backend/src/modules/posting/posting.validators.js` is
 * still authoritative — everything here is a pre-submit convenience so the
 * Employer isn't told about a problem only after a round trip.
 */

/**
 * FR-POST-02's curated allow-list. Seven categories, no free-text option.
 * Values must match the GigCategory enum in schema.prisma exactly.
 */
export const CATEGORIES = [
  { value: "RETAIL", label: "Retail / shop assistant" },
  { value: "DELIVERY", label: "Delivery and errands" },
  { value: "EVENT_SETUP", label: "Event setup" },
  { value: "MOVING", label: "Moving and manual labour" },
  { value: "FOOD_SERVICE", label: "Food service" },
  { value: "TUTORING", label: "Tutoring" },
  { value: "CLEANING", label: "Cleaning" },
];

export const ARRANGEMENTS = [
  { value: "GIG", label: "Gig" },
  { value: "PART_TIME", label: "Part-time job" },
  { value: "INTERNSHIP", label: "Internship" },
];

export const POSTING_AS = [
  { value: "INDIVIDUAL", label: "An individual" },
  { value: "BUSINESS", label: "A business" },
];

export const RATE_UNITS = [
  { value: "DAY", label: "per day" },
  { value: "WEEK", label: "per week" },
  { value: "MONTH", label: "per month" },
];

/**
 * FR-POST-04 — the pay shape is decided by the arrangement type, not chosen
 * freely. A Gig is a single fixed total; a Part-time job is a rate with a
 * day/week/month unit; an Internship offers Unpaid, Stipend or Paid.
 *
 * @param {string} arrangementType
 * @returns {Array<{value: string, label: string}>} Selectable pay kinds.
 */
export function payKindsFor(arrangementType) {
  if (arrangementType === "GIG") {
    return [{ value: "FIXED_TOTAL", label: "Fixed total" }];
  }
  if (arrangementType === "PART_TIME") {
    return [{ value: "RATE", label: "Rate" }];
  }
  if (arrangementType === "INTERNSHIP") {
    return [
      { value: "UNPAID", label: "Unpaid" },
      { value: "STIPEND", label: "Stipend" },
      { value: "PAID", label: "Paid" },
    ];
  }
  return [];
}

/** Whether this pay kind carries a figure at all. Unpaid does not. */
export function payKindNeedsAmount(payKind) {
  return Boolean(payKind) && payKind !== "UNPAID";
}

/** Only a rate is expressed per day/week/month; a total or a stipend is not. */
export function payKindNeedsRateUnit(payKind) {
  return payKind === "RATE";
}

/** FR-POST-03 — a schedule is required for the two ongoing arrangements. */
export function needsSchedule(arrangementType) {
  return arrangementType === "PART_TIME" || arrangementType === "INTERNSHIP";
}

export const LIMITS = {
  TITLE_MAX: 80,
  DESCRIPTION_MAX: 1000,
  SCHEDULE_MAX: 200,
  BUSINESS_NAME_MAX: 100,
  BUSINESS_BIO_MAX: 300,
  WORKERS_MIN: 1,
  WORKERS_MAX: 20,
};

/** FR-POST-05 — a posting must start at least two hours after it is made. */
export const MIN_LEAD_TIME_MS = 2 * 60 * 60 * 1000;

/**
 * FR-POST-07 — urgency is computed from the start time, never set by the
 * Employer. Mirrored here only so the review screen (FR-POST-09) can show the
 * computed value as a non-editable preview; the server recomputes it on
 * create and ignores anything the client sends.
 *
 * @param {Date|string} startAt
 * @returns {boolean} True when the start falls in the 24–48 hour window.
 */
export function computeIsUrgent(startAt) {
  const ms = new Date(startAt).getTime() - Date.now();
  const hours = ms / (60 * 60 * 1000);
  return hours >= 24 && hours <= 48;
}

/**
 * Formats a stored pay triple for display. Shared by the review step, the
 * postings list and the detail screen so one posting reads identically
 * wherever it appears.
 */
export function formatPay({ payKind, payAmount, payRateUnit }) {
  if (payKind === "UNPAID") return "Unpaid";
  if (payAmount == null || payAmount === "") return "—";
  const amount = `Rs ${Number(payAmount).toLocaleString("en-LK")}`;
  if (payKind === "RATE") {
    const unit = RATE_UNITS.find((u) => u.value === payRateUnit);
    return `${amount} ${unit ? unit.label : ""}`.trim();
  }
  if (payKind === "STIPEND") return `${amount} stipend`;
  return `${amount} total`;
}

/** Turns an enum value into something readable, e.g. FOOD_SERVICE -> Food service. */
export function labelFor(options, value) {
  return options.find((o) => o.value === value)?.label ?? value ?? "—";
}
