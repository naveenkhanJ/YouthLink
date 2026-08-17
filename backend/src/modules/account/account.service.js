/**
 * Account Management services — business rules and data access.
 *
 * Epic: FR-ACC  ·  Owner: Afham
 *
 * This is where the acceptance criteria in docs/requirements.md are actually
 * enforced. Import the shared Prisma client from ../../lib/prisma — never
 * construct your own.
 */
import prisma from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";
import { encryptNic, getNicLast4 } from "./nicCrypto.js";
import { hashPassword } from "./passwordHash.js";
import { verifyFirebaseIdToken } from "./firebaseAuth.js";

const MIN_AGE = 18;
const VALID_ROLES = ["YOUTH_JOB_SEEKER", "EMPLOYER", "COMMUNITY_ENDORSER"];

function calculateAge(birthdate) {
  const today = new Date();
  let age = today.getUTCFullYear() - birthdate.getUTCFullYear();
  const monthDiff = today.getUTCMonth() - birthdate.getUTCMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getUTCDate() < birthdate.getUTCDate())
  ) {
    age--;
  }
  return age;
}

/**
 * Required-field and shape checks. Deliberately separate from the
 * requirement checks below (age gate, ToS, phone verification, duplicate
 * prevention) — this is "was the request well-formed at all", not
 * business rules.
 */
function validateFields({
  role,
  idToken,
  password,
  nic,
  birthdate,
  legalName,
  tosAccepted,
}) {
  const fields = {};

  if (!VALID_ROLES.includes(role)) {
    fields.role = `Must be one of: ${VALID_ROLES.join(", ")}`;
  }
  if (!idToken || typeof idToken !== "string") {
    fields.idToken = "Required";
  }
  if (!password || typeof password !== "string") {
    fields.password = "Required";
  }
  if (!nic || typeof nic !== "string" || nic.trim().length < 4) {
    // At least 4 chars so getNicLast4 never receives something too short
    // to mask (see nicCrypto.js) — a malformed NIC should fail here as a
    // clean 400, not later as an opaque 500 after a wasted Firebase call.
    fields.nic = "Required, must be at least 4 characters";
  }
  if (!birthdate || Number.isNaN(new Date(birthdate).getTime())) {
    fields.birthdate = "Required, must be a valid date";
  }
  if (
    !legalName ||
    typeof legalName !== "string" ||
    legalName.trim().length === 0
  ) {
    fields.legalName = "Required";
  } else if (legalName.length > 100) {
    fields.legalName = "Must be 100 characters or fewer";
  }
  if (typeof tosAccepted !== "boolean") {
    fields.tosAccepted = "Required";
  }

  if (Object.keys(fields).length > 0) {
    throw AppError.badRequest(
      "Registration form is incomplete or invalid.",
      fields,
    );
  }
}

/**
 * FR-ACC-01. Registration is a single atomic submission — see
 * docs/decisions.md for why. The client completes Firebase phone
 * verification first; this function takes the resulting ID token
 * alongside every other field and either creates one complete, ACTIVE
 * account or fails entirely. No partial/pending row is ever created.
 *
 * @param {object} input
 * @param {"YOUTH_JOB_SEEKER"|"EMPLOYER"|"COMMUNITY_ENDORSER"} input.role
 * @param {string} input.idToken - Firebase ID token from client-side phone verification.
 * @param {string} input.password
 * @param {string} [input.email]
 * @param {string} input.nic
 * @param {string} input.birthdate - ISO date string.
 * @param {string} input.legalName
 * @param {boolean} input.tosAccepted
 * @returns {Promise<object>} The created User row.
 */
async function register(input) {
  validateFields(input);
  const {
    role,
    idToken,
    password,
    email,
    nic,
    birthdate,
    legalName,
    tosAccepted,
  } = input;

  // Cheap, no-I/O checks first — fail fast before spending a Firebase call
  // or a DB round trip on a request that was never going to succeed.

  if (!tosAccepted) {
    throw AppError.badRequest(
      "You must accept the Terms of Service and Privacy Policy.",
      {
        tosAccepted: "Required",
      },
    );
  }

  const birthdateValue = new Date(birthdate);

  // FR-ACC-03/FR-ACC-04: age gate reads only the self-declared birthdate,
  // never the NIC — no exceptions, no override path.
  if (calculateAge(birthdateValue) < MIN_AGE) {
    throw AppError.badRequest("You must be 18 or older to register.", {
      birthdate: "Must indicate an age of 18 or older",
    });
  }

  // FR-ACC-01 AC1 / FR-ACC-08: the phone is only treated as verified once
  // the Firebase ID token itself is validated server-side.
  let phoneNumber;
  try {
    ({ phoneNumber } = await verifyFirebaseIdToken(idToken));
  } catch (err) {
    // Log the real cause server-side — this catch also covers Firebase
    // Admin misconfiguration or an outage, not just a bad/expired token,
    // and those need to be diagnosable even though the client only ever
    // sees one generic message either way.
    console.error("verifyFirebaseIdToken failed during registration:", err);
    throw AppError.unauthorized(
      "Phone verification failed or has expired. Verify your phone again.",
    );
  }

  const nicEncrypted = encryptNic(nic);

  // FR-ACC-05: pre-check for a friendly, field-level error. The partial
  // unique indexes on User.phone/User.nicEncrypted (see
  // docs/database-schema.md) are the actual enforcement and still apply
  // as a safety net in the create() below, in case of a race between
  // this check and the insert.
  const [existingPhone, existingNic] = await Promise.all([
    prisma.user.findFirst({
      where: {
        phone: phoneNumber,
        phoneVerifiedAt: { not: null },
        deletedAt: null,
      },
      select: { id: true },
    }),
    prisma.user.findFirst({
      where: { nicEncrypted, deletedAt: null },
      select: { id: true },
    }),
  ]);

  if (existingPhone) {
    throw AppError.conflict("That phone number is already registered.", {
      phone: "Already registered",
    });
  }
  if (existingNic) {
    throw AppError.conflict("That NIC is already registered.", {
      nic: "Already registered",
    });
  }

  const passwordHashValue = await hashPassword(password);
  const nicLast4 = getNicLast4(nic);

  try {
    return await prisma.user.create({
      data: {
        role,
        phone: phoneNumber,
        phoneVerifiedAt: new Date(),
        passwordHash: passwordHashValue,
        email: email || null,
        nicEncrypted,
        nicLast4,
        legalName,
        birthdate: birthdateValue,
        tosAcceptedAt: new Date(),
        accountStatus: "ACTIVE",
      },
    });
  } catch (err) {
    // Safety net for a race between the pre-check above and this insert —
    // the partial unique indexes are the real enforcement either way.
    if (err.code === "P2002") {
      throw AppError.conflict(
        "That phone number or NIC is already registered.",
      );
    }
    throw err;
  }
}

export default { register };
