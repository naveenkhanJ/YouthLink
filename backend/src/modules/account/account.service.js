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
import { hashPassword, verifyPassword } from "./passwordHash.js";
import { verifyFirebaseIdToken } from "./firebaseAuth.js";
import { signToken } from "../../lib/jwt.js";
import { isSuspended } from "../../lib/accountStatus.js";

const MIN_AGE = 18;
const VALID_ROLES = ["YOUTH_JOB_SEEKER", "EMPLOYER", "COMMUNITY_ENDORSER"];

// Registration never needs this — the phone comes straight from a
// Firebase-verified ID token, always clean E.164. Password login is the
// one place a phone number is hand-typed (or pasted from Contacts) into a
// text field, so "+94 77 123 4567" needs to match the "+94771234567"
// stored from registration. Strips whitespace/dashes/parens only — not a
// full phone-parsing library, since the actual failure this fixes is
// formatting noise around an otherwise-correct number, not arbitrary
// input correction.
function normalizePhoneForLookup(phone) {
  return phone.replace(/[\s\-()]/g, "");
}

// FR-ACC-09 / NFR-SEC-02: 5 consecutive failed password attempts locks the
// password path for 15 minutes. Only the password path — FR-ACC-07 deliberately
// keeps OTP login independent so it stays available when password login doesn't.
const LOCKOUT_THRESHOLD = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000;

// Not a real account's hash — a fixed bcrypt hash of an arbitrary string,
// compared against on an unregistered-phone login attempt so the response
// takes roughly the same time as a real wrong-password attempt (which runs
// a real bcrypt.compare). Without this, response latency alone would let a
// caller enumerate registered phone numbers even though the error message
// is identical either way — caught in self-review.
const DUMMY_PASSWORD_HASH =
  "$2b$12$M5aYuTGsgzTQZq0ATSNOBuhbJmRM7dgpCEhSo/Byd2XJedYLlRX3S";

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

/**
 * FR-ACC-07 password login path. Kept deliberately independent of the OTP
 * path below — a working password must log a user in even if SMS delivery
 * is failing (FR-ACC-07 AC2).
 *
 * @param {object} input
 * @param {string} input.phone
 * @param {string} input.password
 * @returns {Promise<{ token: string, user: object }>}
 */
async function loginWithPassword({ phone, password }) {
  if (!phone || typeof phone !== "string") {
    throw AppError.badRequest("Phone is required.", { phone: "Required" });
  }
  if (!password || typeof password !== "string") {
    throw AppError.badRequest("Password is required.", {
      password: "Required",
    });
  }

  const user = await prisma.user.findFirst({
    where: { phone: normalizePhoneForLookup(phone), deletedAt: null },
  });

  // Same generic message whether the phone isn't registered or the password
  // is wrong — telling the two apart would let a caller enumerate registered
  // phone numbers.
  const invalidCredentials = () =>
    AppError.unauthorized("Incorrect phone number or password.");

  if (!user) {
    // Burn roughly the same time a real password check would take, so an
    // unregistered phone isn't distinguishable from a wrong password by
    // response latency alone.
    await verifyPassword(password, DUMMY_PASSWORD_HASH);
    throw invalidCredentials();
  }

  // A lockout window that has already elapsed is treated as cleared before
  // evaluating this attempt, giving a fresh 5-attempt window rather than
  // re-locking on the very next failure — NFR-SEC-02 says a lockout lasts
  // 15 minutes, which only makes sense if attempts resume normally after.
  let failedLoginAttempts = user.failedLoginAttempts;
  let lockedUntil = user.lockedUntil;
  if (lockedUntil && lockedUntil <= new Date()) {
    failedLoginAttempts = 0;
    lockedUntil = null;
  }

  if (lockedUntil && lockedUntil > new Date()) {
    throw AppError.locked(
      "Too many failed attempts. Try again in 15 minutes, or log in with OTP instead.",
    );
  }

  const passwordCorrect = await verifyPassword(password, user.passwordHash);

  if (!passwordCorrect) {
    const attempts = failedLoginAttempts + 1;
    const lockingNow = attempts >= LOCKOUT_THRESHOLD;
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: lockingNow ? 0 : attempts,
        lockedUntil: lockingNow
          ? new Date(Date.now() + LOCKOUT_DURATION_MS)
          : null,
      },
    });
    if (lockingNow) {
      throw AppError.locked(
        "Too many failed attempts. Try again in 15 minutes, or log in with OTP instead.",
      );
    }
    throw invalidCredentials();
  }

  // Correct password clears any prior failure count/lockout.
  if (failedLoginAttempts !== 0 || user.lockedUntil) {
    await prisma.user.update({
      where: { id: user.id },
      data: { failedLoginAttempts: 0, lockedUntil: null },
    });
  }

  // Suspension is revealed only after the password is proven correct — doing
  // it earlier would let a caller learn account status without knowing the
  // password.
  if (isSuspended(user)) {
    throw AppError.forbidden("This account has been suspended.");
  }

  return { token: signToken({ sub: user.id }), user };
}

/**
 * FR-ACC-07 OTP login path, via Firebase Phone Authentication — same
 * server-side ID-token verification as registration (FR-ACC-08 AC3). Lets a
 * user log in without their password (FR-ACC-07 AC1), fully unaffected by
 * an active password lockout (product-overview.md: "the OTP path is
 * unaffected by that lock") — nothing in this function even reads
 * lockedUntil.
 *
 * Also clears any active password lockout on success — not required to
 * make this path work (requireAuth.js no longer enforces lockedUntil at
 * all, and this function never checked it), but proving phone ownership
 * via a fresh Firebase OTP is reasonable grounds to lift the password
 * lockout too, so the user isn't left waiting out the remaining 15
 * minutes on the password path after already proving who they are a
 * different way. Same as what a correct password does in
 * loginWithPassword above.
 *
 * @param {object} input
 * @param {string} input.idToken - Firebase ID token from client-side phone verification.
 * @returns {Promise<{ token: string, user: object }>}
 */
async function loginWithOtp({ idToken }) {
  if (!idToken || typeof idToken !== "string") {
    throw AppError.badRequest("idToken is required.", { idToken: "Required" });
  }

  let phoneNumber;
  try {
    ({ phoneNumber } = await verifyFirebaseIdToken(idToken));
  } catch (err) {
    console.error("verifyFirebaseIdToken failed during OTP login:", err);
    throw AppError.unauthorized(
      "Phone verification failed or has expired. Verify your phone again.",
    );
  }

  const user = await prisma.user.findFirst({
    where: { phone: phoneNumber, deletedAt: null },
  });
  if (!user) {
    throw AppError.unauthorized("No account found for this phone number.");
  }
  if (isSuspended(user)) {
    throw AppError.forbidden("This account has been suspended.");
  }

  if (user.failedLoginAttempts !== 0 || user.lockedUntil) {
    await prisma.user.update({
      where: { id: user.id },
      data: { failedLoginAttempts: 0, lockedUntil: null },
    });
  }

  return { token: signToken({ sub: user.id }), user };
}

export default { register, loginWithPassword, loginWithOtp };
