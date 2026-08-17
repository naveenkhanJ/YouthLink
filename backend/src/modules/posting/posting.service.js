/**
 * Gig Posting services — business rules and data access.
 *
 * Epic: FR-POST  ·  Owner: Lahiru
 *
 * This is where the acceptance criteria in docs/requirements.md are actually
 * enforced. Import the shared Prisma client from ../../lib/prisma — never
 * construct your own.
 */
const prisma = require("../../lib/prisma");
const AppError = require("../../utils/AppError");

const ALLOWED_CATEGORIES = [
  "RETAIL",
  "DELIVERY",
  "EVENT_SETUP",
  "MOVING",
  "FOOD_SERVICE",
  "TUTORING",
  "CLEANING",
];

const ALLOWED_ARRANGEMENT_TYPES = ["GIG", "PART_TIME", "INTERNSHIP"];
const ALLOWED_PAY_KINDS = ["FIXED_TOTAL", "RATE", "UNPAID", "STIPEND", "PAID"];
const ALLOWED_PAY_RATE_UNITS = ["DAY", "WEEK", "MONTH"];
const ALLOWED_POSTING_AS_TYPES = ["INDIVIDUAL", "BUSINESS"];

function trimRequiredString(value, fieldName, maxLength) {
  if (value === undefined || value === null || String(value).trim() === "") {
    throw AppError.badRequest(`${fieldName} is required.`);
  }

  const str = String(value).trim();
  if (str.length > maxLength) {
    throw AppError.badRequest(`${fieldName} must be ${maxLength} characters or fewer.`);
  }

  return str;
}

function parseEnumValue(value, fieldName, allowed) {
  const normalized = String(value ?? "").trim();

  if (!normalized) {
    throw AppError.badRequest(`${fieldName} is required.`);
  }

  if (!allowed.includes(normalized)) {
    throw AppError.badRequest(`${fieldName} is invalid.`);
  }

  return normalized;
}

function parseNumber(value, fieldName, { min, max, required = true } = {}) {
  if (value === undefined || value === null || value === "") {
    if (required) {
      throw AppError.badRequest(`${fieldName} is required.`);
    }
    return null;
  }

  const parsed = Number(value);

  if (Number.isNaN(parsed)) {
    throw AppError.badRequest(`${fieldName} must be a number.`);
  }

  if (min !== undefined && parsed < min) {
    throw AppError.badRequest(`${fieldName} must be at least ${min}.`);
  }

  if (max !== undefined && parsed > max) {
    throw AppError.badRequest(`${fieldName} must be at most ${max}.`);
  }

  return parsed;
}

function parseDate(value, fieldName) {
  if (!value) {
    throw AppError.badRequest(`${fieldName} is required.`);
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw AppError.badRequest(`${fieldName} is not a valid date.`);
  }

  return date;
}

function computeUrgency(postedAt, startAt) {
  const diffHours = (new Date(startAt).getTime() - new Date(postedAt).getTime()) / (1000 * 60 * 60);
  return diffHours >= 24 && diffHours <= 48;
}

function normalisePostingPayload(input = {}) {
  const title = trimRequiredString(input.title, "Title", 80);
  const description = trimRequiredString(input.description, "Description", 1000);
  const category = parseEnumValue(input.category, "Category", ALLOWED_CATEGORIES);
  const arrangementType = parseEnumValue(
    input.arrangementType,
    "Arrangement type",
    ALLOWED_ARRANGEMENT_TYPES,
  );
  const payKind = parseEnumValue(input.payKind, "Pay kind", ALLOWED_PAY_KINDS);

  const payAmount =
    payKind === "UNPAID"
      ? null
      : parseNumber(input.payAmount, "Pay amount", { min: 0.01 });

  const payRateUnit =
    payKind === "RATE"
      ? parseEnumValue(input.payRateUnit, "Pay rate unit", ALLOWED_PAY_RATE_UNITS)
      : input.payRateUnit
        ? parseEnumValue(input.payRateUnit, "Pay rate unit", ALLOWED_PAY_RATE_UNITS)
        : null;

  if (arrangementType !== "GIG") {
    if (input.schedule === undefined || String(input.schedule).trim() === "") {
      throw AppError.badRequest("Schedule is required for Part-time and Internship postings.");
    }
  }

  const schedule =
    arrangementType === "GIG"
      ? input.schedule ? String(input.schedule).trim().slice(0, 200) : null
      : trimRequiredString(input.schedule, "Schedule", 200);

  const locationAddress = trimRequiredString(input.locationAddress, "Location address", 500);
  const locationLat = parseNumber(input.locationLat, "Location latitude", { min: -90, max: 90 });
  const locationLng = parseNumber(input.locationLng, "Location longitude", { min: -180, max: 180 });
  const locationAreaLabel = trimRequiredString(input.locationAreaLabel, "Location area label", 100);
  const workersNeeded = parseNumber(input.workersNeeded, "Workers needed", {
    min: 1,
    max: 20,
    required: true,
  });

  const startAt = parseDate(input.startAt, "Start date/time");
  const now = new Date();
  const minimumStartAt = new Date(now.getTime() + 2 * 60 * 60 * 1000);

  if (startAt.getTime() < minimumStartAt.getTime()) {
    throw AppError.badRequest("Start date/time must be at least 2 hours from the moment of posting.");
  }

  const employerId = String(input.employerId || "").trim();
  if (!employerId) {
    throw AppError.badRequest("Employer id is required.");
  }

  const postedAsType = parseEnumValue(
    input.postedAsType ?? "INDIVIDUAL",
    "Posting-as type",
    ALLOWED_POSTING_AS_TYPES,
  );

  const postedBusinessName =
    postedAsType === "BUSINESS"
      ? trimRequiredString(input.postedBusinessName ?? input.businessName, "Business name", 100)
      : null;

  const postedBusinessBio =
    postedAsType === "BUSINESS"
      ? input.postedBusinessBio !== undefined && input.postedBusinessBio !== null
        ? String(input.postedBusinessBio).trim().slice(0, 300)
        : null
      : null;

  return {
    employerId,
    title,
    description,
    category,
    arrangementType,
    payKind,
    payAmount,
    payRateUnit,
    postedAsType,
    postedBusinessName,
    postedBusinessBio,
    locationAddress,
    locationLat,
    locationLng,
    locationAreaLabel,
    workersNeeded: Math.round(workersNeeded),
    startAt: startAt.toISOString(),
    schedule,
    isUrgent: computeUrgency(now, startAt),
  };
}

async function loadEmployerProfile(employerId) {
  const employer = await prisma.user.findUnique({
    where: { id: employerId },
    select: {
      id: true,
      role: true,
      postingAsType: true,
      businessName: true,
      businessBio: true,
      accountStatus: true,
      suspendedAt: true,
      lockedUntil: true,
    },
  });

  if (!employer) {
    throw AppError.notFound("Employer not found.");
  }

  if (employer.role !== "EMPLOYER") {
    throw AppError.forbidden("Only employers can create gig postings.");
  }

  if (employer.accountStatus !== "ACTIVE") {
    throw AppError.forbidden("This account is not active and cannot post gigs.");
  }

  return employer;
}

async function createPosting(input, employerIdOverride) {
  const employerId = employerIdOverride || input?.employerId;

  if (!employerId) {
    throw AppError.badRequest("Employer id is required.");
  }

  const employer = await loadEmployerProfile(employerId);
  const payload = normalisePostingPayload({
    ...input,
    employerId,
    postedAsType: input?.postedAsType ?? employer.postingAsType ?? "INDIVIDUAL",
    postedBusinessName:
      input?.postedBusinessName ?? input?.businessName ?? employer.businessName ?? null,
    postedBusinessBio: input?.postedBusinessBio ?? employer.businessBio ?? null,
  });

  const created = await prisma.gigPosting.create({
    data: {
      employerId: payload.employerId,
      title: payload.title,
      description: payload.description,
      category: payload.category,
      arrangementType: payload.arrangementType,
      payKind: payload.payKind,
      payAmount: payload.payAmount,
      payRateUnit: payload.payRateUnit,
      postedAsType: payload.postedAsType,
      postedBusinessName: payload.postedBusinessName,
      postedBusinessBio: payload.postedBusinessBio,
      locationAddress: payload.locationAddress,
      locationLat: payload.locationLat,
      locationLng: payload.locationLng,
      locationAreaLabel: payload.locationAreaLabel,
      workersNeeded: payload.workersNeeded,
      filledCount: 0,
      startAt: payload.startAt,
      schedule: payload.schedule,
      isUrgent: payload.isUrgent,
      status: "OPEN",
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      withdrawnAt: null,
      noApplicantNudgeSentAt: null,
      autoHiddenAt: null,
    },
  });

  return created;
}

async function getPostingById(id) {
  const posting = await prisma.gigPosting.findUnique({
    where: { id },
    include: {
      employer: {
        select: {
          id: true,
          legalName: true,
          businessName: true,
          postingAsType: true,
        },
      },
      applications: true,
      engagements: true,
    },
  });

  if (!posting) {
    throw AppError.notFound("Gig posting not found.");
  }

  return posting;
}

async function listPostings(filters = {}) {
  const {
    status,
    category,
    arrangementType,
    employerId,
    limit = 20,
    skip = 0,
  } = filters;

  const where = {};

  if (status) where.status = status;
  if (category) where.category = category;
  if (arrangementType) where.arrangementType = arrangementType;
  if (employerId) where.employerId = employerId;

  const [items, total] = await Promise.all([
    prisma.gigPosting.findMany({
      where,
      orderBy: [{ isUrgent: "desc" }, { createdAt: "desc" }],
      take: Number(limit) || 20,
      skip: Number(skip) || 0,
      include: {
        employer: {
          select: {
            id: true,
            legalName: true,
            businessName: true,
            postingAsType: true,
          },
        },
      },
    }),
    prisma.gigPosting.count({ where }),
  ]);

  return {
    items,
    total,
    limit: Number(limit) || 20,
    skip: Number(skip) || 0,
  };
}

module.exports = {
  createPosting,
  getPostingById,
  listPostings,
  computeUrgency,
  normalisePostingPayload,
};
