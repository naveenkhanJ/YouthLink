// posting.validators.js
// Validation chain for POST /api/gig-postings.
// Keep this independent of @prisma/client so it works with the repo's custom
// generated Prisma output and avoids the '.prisma/client/default' import error.

const { body } = require('express-validator');

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

const LIMITS = {
  TITLE_MAX: 80,
  DESCRIPTION_MAX: 1000,
  BUSINESS_NAME_MAX: 100,
  BUSINESS_BIO_MAX: 300,
  SCHEDULE_MAX: 200,
  WORKERS_MIN: 1,
  WORKERS_MAX: 20,
};

const MIN_LEAD_TIME_MS = 2 * 60 * 60 * 1000;
const MIN_LEAD_TIME_LABEL = '2 hours';
const BUSINESS_POSTING_TYPE = 'BUSINESS';
const PAY_KINDS_WITHOUT_AMOUNT = [];

const createGigPostingValidators = [
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
    .withMessage('Pay type is not a recognized option.'),

  body('payAmount')
    .if((value, { req }) => !PAY_KINDS_WITHOUT_AMOUNT.includes(req.body.payKind))
    .notEmpty().withMessage('Pay amount is required.')
    .bail()
    .isFloat({ min: 0.01 }).withMessage('Enter a valid pay amount.'),

  body('payRateUnit')
    .if((value, { req }) => !PAY_KINDS_WITHOUT_AMOUNT.includes(req.body.payKind))
    .notEmpty().withMessage('Pay rate unit is required.')
    .bail()
    .isIn(ALLOWED_PAY_RATE_UNITS)
    .withMessage('Pay rate unit is not a recognized option.'),

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

  body('schedule')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: LIMITS.SCHEDULE_MAX })
    .withMessage(`Schedule must be ${LIMITS.SCHEDULE_MAX} characters or fewer.`),
];

module.exports = {
  createGigPostingValidators,
  LIMITS,
  BUSINESS_POSTING_TYPE,
  MIN_LEAD_TIME_MS,
  MIN_LEAD_TIME_LABEL,
};