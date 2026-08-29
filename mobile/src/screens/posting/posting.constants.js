/**
 * Gig Posting Constants & Helper Utilities (FR-POST)
 * Curated allow-lists, field limits, and business rule validators.
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
export const MIN_LEAD_TIME_LABEL = '2 hours';

// FR-POST-07: Urgency window (24h to 48h from now)
export const URGENCY_WINDOW_MIN_MS = 24 * 60 * 60 * 1000;
export const URGENCY_WINDOW_MAX_MS = 48 * 60 * 60 * 1000;

// FR-POST-02: Curated 7 task categories (Strict allow-list, no free text)
export const GIG_CATEGORIES = [
  {
    id: 'RETAIL',
    label: 'Retail / Shop Assistant',
    icon: '🛍️',
    description: 'Cashiering, shelf stocking, sales assistance, customer support',
  },
  {
    id: 'DELIVERY',
    label: 'Delivery & Errands',
    icon: '🛵',
    description: 'Local dispatch, grocery/document runs, package courier',
  },
  {
    id: 'EVENT_SETUP',
    label: 'Event Setup',
    icon: '🎪',
    description: 'Stage rigging, booth assembly, chairs & audiovisual assistance',
  },
  {
    id: 'MOVING',
    label: 'Moving & Manual Labor',
    icon: '📦',
    description: 'Loading/unloading goods, furniture moving, packing',
  },
  {
    id: 'FOOD_SERVICE',
    label: 'Food Service',
    icon: '🍽️',
    description: 'Kitchen prep, table waiting, dishwashing, catering crew',
  },
  {
    id: 'TUTORING',
    label: 'Tutoring',
    icon: '📚',
    description: 'School subjects, languages, foundational IT, homework help',
  },
  {
    id: 'CLEANING',
    label: 'Cleaning',
    icon: '🧹',
    description: 'Commercial/residential cleaning, post-event sweeping, sanitizing',
  },
];

// FR-POST-01 & FR-POST-04: Arrangement Types
export const ARRANGEMENT_TYPES = [
  {
    id: 'GIG',
    label: 'One-off Gig',
    description: 'Single discrete task with fixed pay upon completion',
    badgeColor: '#3B82F6',
  },
  {
    id: 'PART_TIME',
    label: 'Part-time Job',
    description: 'Ongoing recurring shifts (requires regular schedule & rate)',
    badgeColor: '#10B981',
  },
  {
    id: 'INTERNSHIP',
    label: 'Internship',
    description: 'Structured youth training & apprenticeship placement',
    badgeColor: '#8B5CF6',
  },
];

// FR-POST-04: Pay Kinds
export const PAY_KINDS = {
  FIXED_TOTAL: 'FIXED_TOTAL',
  RATE: 'RATE',
  UNPAID: 'UNPAID',
  STIPEND: 'STIPEND',
  PAID: 'PAID',
};

// FR-POST-04: Pay Rate Units
export const PAY_RATE_UNITS = [
  { id: 'DAY', label: 'Per Day', short: '/day' },
  { id: 'WEEK', label: 'Per Week', short: '/week' },
  { id: 'MONTH', label: 'Per Month', short: '/month' },
];

// FR-ACC-02 / FR-POST-16: Posting As Types
export const POSTED_AS_TYPES = [
  { id: 'INDIVIDUAL', label: 'Individual / Household', icon: '👤' },
  { id: 'BUSINESS', label: 'Registered Business', icon: '🏢' },
];

// Popular Sri Lankan locations for fast map coordinate presets (FR-POST-08)
export const PRESET_LOCATIONS = [
  {
    areaLabel: 'Bambalapitiya, Colombo 04',
    address: 'No. 128, Galle Road, Bambalapitiya, Colombo 04',
    lat: 6.8912,
    lng: 79.8567,
  },
  {
    areaLabel: 'Kollupitiya, Colombo 03',
    address: 'No. 45, Dharmapala Mawatha, Kollupitiya, Colombo 03',
    lat: 6.9147,
    lng: 79.8516,
  },
  {
    areaLabel: 'Nugegoda, Western Province',
    address: 'No. 82, High Level Road, Nugegoda',
    lat: 6.8649,
    lng: 79.8997,
  },
  {
    areaLabel: 'Dehiwala, Western Province',
    address: 'No. 15, Station Road, Dehiwala',
    lat: 6.8511,
    lng: 79.8659,
  },
  {
    areaLabel: 'Kandy City Center, Central Province',
    address: 'No. 5, Dalada Veediya, Kandy',
    lat: 7.2906,
    lng: 80.6337,
  },
  {
    areaLabel: 'Galle Fort, Southern Province',
    address: 'No. 22, Church Street, Fort, Galle',
    lat: 6.0305,
    lng: 80.2170,
  },
  {
    areaLabel: 'Gampaha Town, Western Province',
    address: 'No. 64, Yakkala Road, Gampaha',
    lat: 7.0840,
    lng: 79.9939,
  },
  {
    areaLabel: 'Negombo, Western Province',
    address: 'No. 110, Main Street, Negombo',
    lat: 7.2008,
    lng: 79.8736,
  },
];

/**
 * Computes whether a gig posting is urgent (FR-POST-07).
 * Urgent if start time is within 24–48 hours from now.
 * @param {string|Date} startAt
 * @param {number} [nowMs]
 * @returns {boolean}
 */
export function computeIsUrgent(startAt, nowMs = Date.now()) {
  if (!startAt) return false;
  const startMs = new Date(startAt).getTime();
  if (isNaN(startMs)) return false;

  const diffMs = startMs - nowMs;
  return diffMs >= URGENCY_WINDOW_MIN_MS && diffMs <= URGENCY_WINDOW_MAX_MS;
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
      message: `Start time must be at least ${MIN_LEAD_TIME_LABEL} from now, so youth workers have sufficient time to discover and apply.`,
    };
  }

  return { valid: true };
}

/**
 * Formats a currency amount in Sri Lankan Rupees (LKR)
 * @param {number|string} amount
 * @returns {string} e.g. "Rs. 3,500"
 */
export function formatLKR(amount) {
  if (amount == null || amount === '') return 'Rs. 0';
  const num = Number(amount);
  if (isNaN(num)) return 'Rs. 0';
  return `Rs. ${num.toLocaleString('en-US')}`;
}

/**
 * Formats a Date object or ISO string to a human-readable date & time
 * @param {string|Date} dateVal
 * @returns {string}
 */
export function formatDateTime(dateVal) {
  if (!dateVal) return '';
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return '';

  return d.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}
