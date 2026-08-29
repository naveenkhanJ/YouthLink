// posting.validators.js
// Validation chain for POST /api/gig-postings.
// Keep this independent of @prisma/client so it works with the repo's custom
// generated Prisma output and avoids the '.prisma/client/default' import error.

import { body } from 'express-validator';

const ALLOWED_GIG_CATEGORIES = [
  'RETAIL',
  'DELIVERY',
  'EVENT_SETUP',
  'MOVING',
  'FOOD_SERVICE',
  'TUTORING',
  'CLEANING',
];

const ALLOWED_ARRANGEMENT_TYPES = ['GIG', 'PART_TIME', 'INTERNSHIP'];
const ALLOWED_PAY_KINDS = ['FIXED_TOTAL', 'RATE', 'UNPAID', 'STIPEND', 'PAID'];
const ALLOWED_PAY_RATE_UNITS = ['DAY', 'WEEK', 'MONTH'];
const ALLOWED_POSTING_AS_TYPES = ['INDIVIDUAL', 'BUSINESS'];

export const LIMITS = {
  TITLE_MAX: 80,
  DESCRIPTION_MAX: 1000,
  BUSINESS_NAME_MAX: 100,
  BUSINESS_BIO_MAX: 300,
  SCHEDULE_MAX: 200,
  WORKERS_MIN: 1,
  WORKERS_MAX: 20,
};

export const MIN_LEAD_TIME_MS = 2 * 60 * 60 * 1000;
export const MIN_LEAD_TIME_LABEL = '2 hours';
export const BUSINESS_POSTING_TYPE = 'BUSINESS';

// FR-POST-04 gives each arrangement type its own pay shape:
//   Gig          -> FIXED_TOTAL, a single total, no rate unit
//   Part-time    -> RATE, an amount plus a day/week/month unit
//   Internship   -> UNPAID (no figure at all), or STIPEND / PAID
//
// PAY_KINDS_WITHOUT_AMOUNT was an empty array, so every pay kind was required
// to carry BOTH an amount and a rate unit. That made two of the three
// arrangement types impossible to submit: an Unpaid internship was rejected
// for having no amount, and a Gig was rejected for having no rate unit even
// though "fixed total" means precisely that there isn't one.
const PAY_KINDS_WITHOUT_AMOUNT = ['UNPAID'];
const PAY_KINDS_WITH_RATE_UNIT = ['RATE'];

// FR-POST-04 doesn't just say which fields a pay kind carries — it says which
// pay kinds each arrangement type may use at all. Without this, {GIG, RATE}
// and {PART_TIME, UNPAID} both pass the field-shape checks above and are
// stored, leaving the rule enforced only by whichever client happens to be
// asking. The mobile form already offers the right options; this makes the
// API agree rather than trust it.
const PAY_KINDS_BY_ARRANGEMENT = {
  GIG: ['FIXED_TOTAL'],
  PART_TIME: ['RATE'],
  INTERNSHIP: ['UNPAID', 'STIPEND', 'PAID'],
};

// FR-POST-03: a free-text Schedule is required for the two ongoing
// arrangements and deliberately not for a one-off Gig, where the single start
// time already says when the work happens. It was optional for all three.
const ARRANGEMENTS_REQUIRING_SCHEDULE = ['PART_TIME', 'INTERNSHIP'];

export const createGigPostingValidators = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required.')
    .bail()
    .isLength({ max: LIMITS.TITLE_MAX })
    .withMessage(`Title must be ${LIMITS.TITLE_MAX} characters or fewer.`),

  body('description')
    .trim()
    .notEmpty().withMessage('Description is required.')
    .bail()
    .isLength({ max: LIMITS.DESCRIPTION_MAX })
    .withMessage(`Description must be ${LIMITS.DESCRIPTION_MAX} characters or fewer.`),

  body('category')
    .notEmpty().withMessage('Category is required.')
    .bail()
    .isIn(ALLOWED_GIG_CATEGORIES)
    .withMessage('Category is not a recognized option.'),

  body('arrangementType')
    .notEmpty().withMessage('Arrangement type is required.')
    .bail()
    .isIn(ALLOWED_ARRANGEMENT_TYPES)
    .withMessage('Arrangement type is not a recognized option.'),

  body('payKind')
    .notEmpty().withMessage('Pay type is required.')
    .bail()
    .isIn(ALLOWED_PAY_KINDS)
    .withMessage('Pay type is not a recognized option.')
    .bail()
    // FR-POST-04 — the pay kind has to be one this arrangement type allows.
    .custom((value, { req }) => {
      const allowed = PAY_KINDS_BY_ARRANGEMENT[req.body.arrangementType];
      // Arrangement type has its own validator; don't double-report it here.
      return !allowed || allowed.includes(value);
    })
    .withMessage('That pay type is not available for this arrangement type.'),

  body('payAmount')
    .if((value, { req }) => !PAY_KINDS_WITHOUT_AMOUNT.includes(req.body.payKind))
    .notEmpty().withMessage('Pay amount is required.')
    .bail()
    .isFloat({ min: 0.01 }).withMessage('Enter a valid pay amount.'),

  // The mirror of the payRateUnit guard below: an unpaid internship has no
  // figure, so storing one would leave a pay amount in the row that every
  // screen correctly refuses to show.
  body('payAmount')
    .if((value, { req }) => PAY_KINDS_WITHOUT_AMOUNT.includes(req.body.payKind))
    .optional({ nullable: true, checkFalsy: true })
    .custom(() => false)
    .withMessage('An unpaid arrangement cannot carry a pay amount.'),

  body('payRateUnit')
    .if((value, { req }) => PAY_KINDS_WITH_RATE_UNIT.includes(req.body.payKind))
    .notEmpty().withMessage('Pay rate unit is required.')
    .bail()
    .isIn(ALLOWED_PAY_RATE_UNITS)
    .withMessage('Pay rate unit is not a recognized option.'),

  // A rate unit on a fixed total or an unpaid internship is meaningless, so
  // reject it outright rather than silently storing a value the pay shape
  // says nothing about.
  body('payRateUnit')
    .if((value, { req }) => !PAY_KINDS_WITH_RATE_UNIT.includes(req.body.payKind))
    .optional({ nullable: true, checkFalsy: true })
    .custom(() => false)
    .withMessage('A pay rate unit only applies to a rate-based arrangement.'),

  body('postedAsType')
    .notEmpty().withMessage('Posting-as type is required.')
    .bail()
    .isIn(ALLOWED_POSTING_AS_TYPES)
    .withMessage('Posting-as type is not a recognized option.'),

  body('postedBusinessName')
    .if((value, { req }) => req.body.postedAsType === BUSINESS_POSTING_TYPE)
    .trim()
    .notEmpty().withMessage('Business name is required when posting as a business.')
    .bail()
    .isLength({ max: LIMITS.BUSINESS_NAME_MAX })
    .withMessage(`Business name must be ${LIMITS.BUSINESS_NAME_MAX} characters or fewer.`),

  body('postedBusinessBio')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: LIMITS.BUSINESS_BIO_MAX })
    .withMessage(`Business bio must be ${LIMITS.BUSINESS_BIO_MAX} characters or fewer.`),

  body('locationAddress')
    .trim()
    .notEmpty().withMessage('Location address is required.'),

  body('locationLat')
    .notEmpty().withMessage('Location coordinates are required.')
    .bail()
    .isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude.'),

  body('locationLng')
    .notEmpty().withMessage('Location coordinates are required.')
    .bail()
    .isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude.'),

  body('locationAreaLabel')
    .trim()
    .notEmpty().withMessage('Location area label is required.'),

  body('workersNeeded')
    .optional({ checkFalsy: true })
    .isInt({ min: LIMITS.WORKERS_MIN, max: LIMITS.WORKERS_MAX })
    .withMessage(`Workers needed must be a whole number between ${LIMITS.WORKERS_MIN} and ${LIMITS.WORKERS_MAX}.`),

  body('startAt')
    .notEmpty().withMessage('Start time is required.')
    .bail()
    .isISO8601().withMessage('Start time must be a valid date/time.')
    .bail()
    .custom((value) => new Date(value).getTime() >= Date.now() + MIN_LEAD_TIME_MS)
    .withMessage(`Start time must be at least ${MIN_LEAD_TIME_LABEL} from now, so workers have time to apply.`),

  // FR-POST-03: required for Part-time and Internship, optional for a Gig.
  body('schedule')
    .if((value, { req }) => ARRANGEMENTS_REQUIRING_SCHEDULE.includes(req.body.arrangementType))
    .trim()
    .notEmpty()
    .withMessage('A schedule is required for a part-time job or internship.')
    .bail()
    .isLength({ max: LIMITS.SCHEDULE_MAX })
    .withMessage(`Schedule must be ${LIMITS.SCHEDULE_MAX} characters or fewer.`),

  body('schedule')
    .if((value, { req }) => !ARRANGEMENTS_REQUIRING_SCHEDULE.includes(req.body.arrangementType))
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: LIMITS.SCHEDULE_MAX })
    .withMessage(`Schedule must be ${LIMITS.SCHEDULE_MAX} characters or fewer.`),
];