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
const PAY_KINDS_WITHOUT_AMOUNT = ['UNPAID'];

// Technical bounds, not product rules. GigPosting.payAmount is Decimal(12,2), so anything
// above this overflows the column and would surface as a 500; the address and area label
// are unbounded text columns, so they get a generous cap rather than none.
export const PAY_AMOUNT_MAX = 9999999999.99;
export const ADDRESS_MAX = 500;
export const AREA_LABEL_MAX = 100;

// FR-POST-04: the pay format is determined by the arrangement type. A Gig
// accepts a fixed total only; a Part-time job a rate (with a unit); an
// Internship Unpaid / Stipend / Paid. Enforced here as well as in the UI so a
// crafted request can't post, say, a Gig with a stipend.
export const PAY_KINDS_BY_ARRANGEMENT = {
  GIG: ['FIXED_TOTAL'],
  PART_TIME: ['RATE'],
  INTERNSHIP: ['UNPAID', 'STIPEND', 'PAID'],
};

export const createGigPostingValidators = [
  body('title')
    .isString().withMessage('Title must be text.')
    .bail()
    .trim()
    .notEmpty().withMessage('Title is required.')
    .bail()
    .isLength({ max: LIMITS.TITLE_MAX })
    .withMessage(`Title must be ${LIMITS.TITLE_MAX} characters or fewer.`),

  body('description')
    .isString().withMessage('Description must be text.')
    .bail()
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
    .custom((value, { req }) => {
      const allowed = PAY_KINDS_BY_ARRANGEMENT[req.body.arrangementType];
      // An unknown arrangement type is already reported on its own field.
      return !allowed || allowed.includes(value);
    })
    .withMessage('This pay type is not available for the chosen arrangement.'),

  body('payAmount')
    .if((value, { req }) => !PAY_KINDS_WITHOUT_AMOUNT.includes(req.body.payKind))
    .notEmpty().withMessage('Pay amount is required.')
    .bail()
    .isFloat({ min: 0.01, max: PAY_AMOUNT_MAX }).withMessage('Enter a valid pay amount.'),

  body('payRateUnit')
    .if((value, { req }) => req.body.payKind === 'RATE')
    .notEmpty().withMessage('Pay rate unit is required for rate-based pay.')
    .bail()
    .isIn(ALLOWED_PAY_RATE_UNITS)
    .withMessage('Pay rate unit is not a recognized option.'),

  body('locationAddress')
    .isString().withMessage('Location address must be text.')
    .bail()
    .trim()
    .notEmpty().withMessage('Location address is required.')
    .bail()
    .isLength({ max: ADDRESS_MAX })
    .withMessage(`Location address must be ${ADDRESS_MAX} characters or fewer.`),

  body('locationLat')
    .notEmpty().withMessage('Location coordinates are required.')
    .bail()
    .isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude.'),

  body('locationLng')
    .notEmpty().withMessage('Location coordinates are required.')
    .bail()
    .isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude.'),

  body('locationAreaLabel')
    .isString().withMessage('Location area label must be text.')
    .bail()
    .trim()
    .notEmpty().withMessage('Location area label is required.')
    .bail()
    .isLength({ max: AREA_LABEL_MAX })
    .withMessage(`Location area label must be ${AREA_LABEL_MAX} characters or fewer.`),

  body('workersNeeded')
    .optional({ nullable: true })
    .isInt({ min: LIMITS.WORKERS_MIN, max: LIMITS.WORKERS_MAX })
    .withMessage(`Workers needed must be a whole number between ${LIMITS.WORKERS_MIN} and ${LIMITS.WORKERS_MAX}.`),

  body('startAt')
    .notEmpty().withMessage('Start time is required.')
    .bail()
    .isISO8601().withMessage('Start time must be a valid date/time.')
    .bail()
    .custom((value) => new Date(value).getTime() >= Date.now() + MIN_LEAD_TIME_MS)
    .withMessage(`Start time must be at least ${MIN_LEAD_TIME_LABEL} from now, so workers have time to apply.`),

  body('schedule')
    .if((value, { req }) => ['PART_TIME', 'INTERNSHIP'].includes(req.body.arrangementType))
    .isString().withMessage('Schedule must be text.')
    .bail()
    .trim()
    .notEmpty().withMessage('Schedule is required for part-time and internship arrangements.')
    .bail()
    .isLength({ max: LIMITS.SCHEDULE_MAX })
    .withMessage(`Schedule must be ${LIMITS.SCHEDULE_MAX} characters or fewer.`),
];

// FR-POST-11: PATCH /api/postings/:id. Only the fields the Edit posting screen offers,
// each optional — a field that isn't sent is left alone. The rules that depend on the
// stored posting (no pay on an unpaid posting, workers needed not below the fill count,
// what may change after a fill) are the service's, which has the row.
export const updateGigPostingValidators = [
  body('title')
    .optional()
    .isString().withMessage('Title must be text.')
    .bail()
    .trim()
    .notEmpty().withMessage('Title is required.')
    .bail()
    .isLength({ max: LIMITS.TITLE_MAX })
    .withMessage(`Title must be ${LIMITS.TITLE_MAX} characters or fewer.`),

  body('payAmount')
    .optional()
    .isFloat({ min: 0.01, max: PAY_AMOUNT_MAX }).withMessage('Enter a valid pay amount.'),

  body('workersNeeded')
    .optional()
    .isInt({ min: LIMITS.WORKERS_MIN, max: LIMITS.WORKERS_MAX })
    .withMessage(`Workers needed must be a whole number between ${LIMITS.WORKERS_MIN} and ${LIMITS.WORKERS_MAX}.`),

  body('startAt')
    .optional()
    .isISO8601().withMessage('Start time must be a valid date/time.')
    .bail()
    .custom((value) => new Date(value).getTime() >= Date.now() + MIN_LEAD_TIME_MS)
    .withMessage(`Start time must be at least ${MIN_LEAD_TIME_LABEL} from now, so workers have time to apply.`),

  body('schedule')
    .optional()
    .isString().withMessage('Schedule must be text.')
    .bail()
    .trim()
    .notEmpty().withMessage('Schedule is required for part-time and internship arrangements.')
    .bail()
    .isLength({ max: LIMITS.SCHEDULE_MAX })
    .withMessage(`Schedule must be ${LIMITS.SCHEDULE_MAX} characters or fewer.`),
];