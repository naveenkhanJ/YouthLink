/**
 * Gig Posting constants and rule helpers (FR-POST) — Lahiru.
 * Field limits, the category / arrangement / rate-unit allow-lists (labels exact per the
 * prototype), and the two start-time rules. These mirror
 * backend/src/modules/posting/posting.validators.js, which is the authority — the app
 * checks early for a better experience, the server checks for real.
 */

// FR-POST-01 & FR-POST-06 Field Caps
export const LIMITS = {
  TITLE_MAX: 80,
  DESCRIPTION_MAX: 1000,
  SCHEDULE_MAX: 200,
  BUSINESS_NAME_MAX: 100,
  BUSINESS_BIO_MAX: 300,
  WORKERS_MIN: 1,
  WORKERS_MAX: 20,
};

// FR-POST-05: Minimum 2-hour lead time in milliseconds
export const MIN_LEAD_TIME_MS = 2 * 60 * 60 * 1000;

// FR-POST-07 (amended 2026-08-27): urgent = starts 48 hours or less from now,
// with no lower bound. Mirrors backend/src/modules/posting/posting.urgency.js.
export const URGENCY_MAX_MS = 48 * 60 * 60 * 1000;

// FR-POST-02: the seven allow-listed categories, nothing else (no "Other"). Labels are exact per
// prototype screen 2.2.
export const GIG_CATEGORIES = [
  { id: 'RETAIL', label: 'Retail' },
  { id: 'DELIVERY', label: 'Delivery' },
  { id: 'EVENT_SETUP', label: 'Event setup' },
  { id: 'MOVING', label: 'Moving' },
  { id: 'FOOD_SERVICE', label: 'Food service' },
  { id: 'TUTORING', label: 'Tutoring' },
  { id: 'CLEANING', label: 'Cleaning' },
];

// FR-POST-01: arrangement types. Labels exact per prototype screens 2.3 / 2.3t.
export const ARRANGEMENT_TYPES = [
  { id: 'GIG', label: 'One-off gig' },
  { id: 'PART_TIME', label: 'Part-time job' },
  { id: 'INTERNSHIP', label: 'Internship' },
];

// FR-POST-04: rate units for a part-time job. Chip labels exact per prototype screen 2.4t.
export const PAY_RATE_UNITS = [
  { id: 'DAY', label: 'Per day' },
  { id: 'WEEK', label: 'Per week' },
  { id: 'MONTH', label: 'Per month' },
];

/**
 * Computes whether a gig posting is urgent (FR-POST-07).
 * Urgent if the start is 48 hours or less from now, with no lower bound.
 * @param {string|Date} startAt
 * @param {number} [nowMs]
 * @returns {boolean}
 */
export function computeIsUrgent(startAt, nowMs = Date.now()) {
  if (!startAt) return false;
  const startMs = new Date(startAt).getTime();
  if (isNaN(startMs)) return false;

  return startMs - nowMs <= URGENCY_MAX_MS;
}

/**
 * Validates whether the start time meets the ≥2-hour minimum lead time (FR-POST-05).
 * @param {string|Date} startAt
 * @param {number} [nowMs]
 * @returns {{ valid: boolean, message?: string }}
 */
export function validateLeadTime(startAt, nowMs = Date.now()) {
  if (!startAt) {
    return { valid: false, message: 'Start date and time is required.' };
  }
  const startMs = new Date(startAt).getTime();
  if (isNaN(startMs)) {
    return { valid: false, message: 'Invalid start date and time format.' };
  }

  const diffMs = startMs - nowMs;
  if (diffMs < MIN_LEAD_TIME_MS) {
    return {
      valid: false,
      // Exact copy of prototype screen 2.8err.
      message: "Gigs need at least 2 hours' notice. Please choose a later start time.",
    };
  }

  return { valid: true };
}

/**
 * Formats a currency amount in Sri Lankan Rupees, per design-system.md §9 and
 * NFR-LOC-04: "Rs" + a space + the amount with thousands separators and no
 * decimals — e.g. "Rs 6,000". No period after "Rs", never a decimal.
 * @param {number|string} amount
 * @returns {string} e.g. "Rs 6,000"
 */
export function formatLKR(amount) {
  if (amount == null || amount === '') return 'Rs 0';
  const num = Number(amount);
  if (isNaN(num)) return 'Rs 0';
  return `Rs ${Math.round(num).toLocaleString('en-US')}`;
}

