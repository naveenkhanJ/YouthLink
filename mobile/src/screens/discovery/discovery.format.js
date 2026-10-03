/**
 * Display strings for Browse and Search — Pawan.
 *
 * Pure functions, no React, so each rule can be read and checked on its own.
 *
 * Pay, start times and the category / arrangement names come from the Gig Posting module's own
 * formatters (posting.format.js, posting.constants.js), not a second copy: design-system.md §9 asks
 * for "one format everywhere", and a listing must read the same on its card here as on the
 * employer's screens.
 */
import { payBasis, payLine, formatStartShort } from "../posting/posting.format.js";
import { GIG_CATEGORIES, ARRANGEMENT_TYPES } from "../posting/posting.constants.js";

const CATEGORY_LABEL = Object.fromEntries(GIG_CATEGORIES.map((c) => [c.id, c.label]));
const ARRANGEMENT_LABEL = Object.fromEntries(ARRANGEMENT_TYPES.map((a) => [a.id, a.label]));

/** Filter chips (3.5), in the prototype's order: { value, label }. */
export const CATEGORY_OPTIONS = GIG_CATEGORIES.map((c) => ({ value: c.id, label: c.label }));
export const ARRANGEMENT_OPTIONS = ARRANGEMENT_TYPES.map((a) => ({ value: a.id, label: a.label }));

/** The Sort sheet's options (3.6), in its order. The server takes the same values. */
export const SORT_OPTIONS = [
  { value: "urgent", label: "Urgent first" },
  { value: "closest", label: "Closest first" },
  { value: "newest", label: "Newest first" },
  { value: "pay", label: "Highest pay first" },
];

export function sortLabel(sortBy) {
  return SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? SORT_OPTIONS[0].label;
}

/** "4.5" — one decimal, a whole number without its ".0". */
function km(value) {
  return String(Math.round(Number(value) * 10) / 10);
}

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

// ---------------------------------------------------------------------------
// The result card (Display/ListingCard on 3.1, 3.2, 3.7)
// ---------------------------------------------------------------------------

/** meta: "Event setup · Colombo 04 · 4.5 km away" */
export function cardMeta(p) {
  return [CATEGORY_LABEL[p.category], p.areaLabel, `${km(p.distanceKm)} km away`].filter(Boolean).join(" · ");
}

/**
 * pay: the figure and its basis on the card itself (FR-DISC-01, amended 2026-08-27):
 * "Rs 6,000 for the job", and with more than one worker "Rs 6,000 for the job · per worker"
 * (design-system.md §9 — on a card the basis joins the line).
 */
export function cardPay(p) {
  return [payLine(p), payBasis(p)].filter(Boolean).join(" · ");
}

/**
 * fill: "0 of 3 filled · Starts Sat 5:00 AM" — the fill count in FR-POST-14's own words, then the
 * start: a weekday alone inside the coming week, the date written out for anything later.
 */
export function cardFill(p, now = Date.now()) {
  return `${p.filledCount ?? 0} of ${p.workersNeeded ?? 1} filled · Starts ${formatStartShort(p.startAt, now)}`;
}

// ---------------------------------------------------------------------------
// Browse's radiusLine (3.1, 3.1f, 3.2, 3.1ofl)
// ---------------------------------------------------------------------------

/**
 * The one line under "Browse" that says what is shown:
 *   3.1   "Showing gigs within 5 km of Nugegoda"
 *   3.2   "Fewer than 5 gigs within 5 km of Homagama — widened to 20 km. 5 found."
 *   3.1f  "1 gig within 5 km of Nugegoda · 2 filters on"
 * Widened AND filtered is not drawn; it keeps 3.2's sentence and adds 3.1f's filter count.
 */
export function radiusLine({ centreLabel, radiusKm, widened, count, filterCount }) {
  const filtersOn = filterCount > 0 ? ` · ${plural(filterCount, "filter", "filters")} on` : "";
  if (widened) {
    return `Fewer than 5 gigs within 5 km of ${centreLabel} — widened to ${radiusKm} km. ${count} found${filtersOn ? filtersOn : "."}`;
  }
  if (filterCount > 0) {
    return `${plural(count, "gig", "gigs")} within ${radiusKm} km of ${centreLabel}${filtersOn}`;
  }
  return `Showing gigs within ${radiusKm} km of ${centreLabel}`;
}

/** 3.1ofl: "1 gig saved on this phone · within 5 km of Nugegoda" */
export function offlineRadiusLine({ centreLabel, radiusKm, count }) {
  return `${plural(count, "gig", "gigs")} saved on this phone · within ${radiusKm} km of ${centreLabel}`;
}

/** 3.7's resultCount: "1 result within 5 km" */
export function searchResultCount({ count, radiusKm }) {
  return `${plural(count, "result", "results")} within ${radiusKm} km`;
}

/** The "Filters" chip: "Filters", or "Filters · 2" while any are on (3.1f). */
export function filtersChipLabel(filterCount) {
  return filterCount > 0 ? `Filters · ${filterCount}` : "Filters";
}
