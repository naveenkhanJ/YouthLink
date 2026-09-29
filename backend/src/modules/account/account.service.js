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
import crypto from "crypto";
import { generateOtp, verifyOtp } from "./otpService.js";

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
const LOCKED_MESSAGE =
  "Too many attempts — password login is paused for 15 minutes. You can log in with a code instead.";
const CLEARED_LOCKOUT = { failedLoginAttempts: 0, lockedUntil: null };

// Not a real account's hash — a fixed bcrypt hash of an arbitrary string,
// compared against on an unregistered-phone login attempt so the response
// takes roughly the same time as a real wrong-password attempt (which runs
// a real bcrypt.compare). Without this, response latency alone would let a
// caller enumerate registered phone numbers even though the error message
// is identical either way — caught in self-review.
const DUMMY_PASSWORD_HASH =
  "$2b$12$M5aYuTGsgzTQZq0ATSNOBuhbJmRM7dgpCEhSo/Byd2XJedYLlRX3S";

// Shared by loginWithOtp and (indirectly, see its own inline version)
// loginWithPassword's success case. Runs inside its own row-locked
// transaction rather than a plain conditional update — a conditional
// update only guarantees ITS OWN write is atomic; it says nothing about
// whether the "should I clear this?" decision is still accurate by the
// time the write actually runs. Without the lock, this call could land
// between a *different*, concurrent request's own read and write — e.g.
// that request's 5th failed attempt, mid-flight, about to set a fresh
// lockout — and this call would see "something's set, clear it" and wipe
// out a lock that request was still in the middle of applying. Confirmed
// live before this fix existed: a successful login and a concurrent
// locking failure could land in the same instant, and the lock vanished.
// `FOR UPDATE` forces any other request touching this same row to wait
// until this transaction finishes, so nothing can change the row between
// the read and the write here.
async function clearLockout(userId) {
  await prisma.$transaction(async (tx) => {
    const [row] = await tx.$queryRaw`
      SELECT "failedLoginAttempts", "lockedUntil"
      FROM "User"
      WHERE "id" = ${userId}
      FOR UPDATE
    `;
    if (row.failedLoginAttempts !== 0 || row.lockedUntil) {
      await tx.user.update({ where: { id: userId }, data: CLEARED_LOCKOUT });
    }
  });
}

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
const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateFields({
  role,
  idToken,
  password,
  email,
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
  } else if (password.length < 8 || password.length > 64) {
    fields.password = "Must be between 8 and 64 characters";
  }
  // email is optional (User.email is nullable) — only checked if provided.
  if (email && (typeof email !== "string" || !EMAIL_FORMAT.test(email))) {
    fields.email = "Must be a valid email address";
  }
  const NIC_FORMAT = /^(\d{12}|\d{9}[vVxX])$/;
  if (!nic || typeof nic !== "string" || !NIC_FORMAT.test(nic.trim())) {
    fields.nic = "Must be 12 digits, or 9 digits followed by V or X";
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
 * FR-ACC-05: pre-check for a friendly, field-level error before OTP is sent.
 * @param {object} input
 * @param {string} [input.phone]
 * @param {string} [input.email]
 * @returns {Promise<{ phoneTaken: boolean, emailTaken: boolean }>}
 */
async function checkAvailability({ phone, email }) {
  const result = { phoneTaken: false, emailTaken: false };

  if (phone) {
    const normalizedPhone = normalizePhoneForLookup(phone);
    const existingPhone = await prisma.user.findFirst({
      where: {
        phone: normalizedPhone,
        phoneVerifiedAt: { not: null },
        deletedAt: null,
      },
      select: { id: true },
    });
    if (existingPhone) {
      result.phoneTaken = true;
    }
  }

  if (email) {
    const existingEmail = await prisma.user.findFirst({
      where: { email: email.trim(), deletedAt: null },
      select: { id: true },
    });
    if (existingEmail) {
      result.emailTaken = true;
    }
  }

  return result;
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
  const [existingPhone, existingNic, existingEmail] = await Promise.all([
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
    email ? prisma.user.findFirst({
      where: { email: email.trim(), deletedAt: null },
      select: { id: true },
    }) : Promise.resolve(null),
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
  if (existingEmail) {
    throw AppError.conflict("That email address is already in use.", {
      email: "Already in use",
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
  const invalidCredentials = (remaining) => {
    let msg = "We couldn't log you in with those details. Check your number and password, or reset your password.";
    if (remaining !== undefined && remaining > 0) {
      msg += ` You have ${remaining} attempt${remaining === 1 ? '' : 's'} left.`;
    }
    return AppError.unauthorized(msg);
  };

  if (!user) {
    // Burn roughly the same time a real password check would take, so an
    // unregistered phone isn't distinguishable from a wrong password by
    // response latency alone.
    await verifyPassword(password, DUMMY_PASSWORD_HASH);
    throw invalidCredentials();
  }

  // Verified before any lockout decision, deliberately, even though the
  // result is discarded when locked — this is what makes a locked account
  // take the same time to reject as every other case. Checking the lock
  // first and skipping this call for a locked account made a locked
  // account answer faster than any other rejection, since it alone never
  // paid bcrypt's cost — a real, exploitable timing side-channel: an
  // attacker who already suspects a phone number is registered can lock it
  // with 5 wrong passwords, then time a 6th request; a fast response
  // confirms the account exists and is locked, something an unregistered
  // phone could never produce, despite an identical error message either
  // way. The same trade-off DUMMY_PASSWORD_HASH already makes for an
  // unregistered phone above — pay bcrypt's cost to keep two different
  // rejection reasons looking identical from the outside — applied here to
  // a locked account instead of a nonexistent one. Run here, outside the row lock below, on purpose — bcrypt is slow
  // by design, and holding a row lock across it would serialize every
  // concurrent login attempt against the same account behind that delay,
  // including the multiple-simultaneous-logins case this product
  // explicitly supports.
  const passwordCorrect = await verifyPassword(password, user.passwordHash);

  // Every read and write of failedLoginAttempts/lockedUntil for this
  // attempt happens inside one transaction that holds a row lock
  // (`SELECT ... FOR UPDATE`) on this user for its whole duration. Two
  // earlier fixes here — an atomic increment, a conditional updateMany —
  // each made their own single write safe, but neither closed this: a
  // *decision* made from a value read outside any lock (e.g. "is this
  // account currently locked?") could still go stale if a different,
  // concurrent request changed the row in between the read and the write.
  // Confirmed live before this fix existed: a successful login here could
  // land in the same instant as a concurrent request's 5th failed attempt,
  // and this function's own success-path clear would wipe out the lock the
  // other request had just set — a free bypass of a 15-minute lockout. The
  // row lock forces concurrent requests against this same account to run
  // one at a time for this whole decide-and-write step, closing the gap
  // structurally rather than reasoning about every possible interleaving
  // by hand. `FOR UPDATE` has no equivalent in Prisma's query API, which is
  // why this one step drops to raw SQL — the same reasoning as the
  // partial unique indexes in the initial migration: Prisma's abstraction
  // genuinely can't express this, so raw SQL is the correct, minimal
  // escape hatch, not a stylistic choice.
  const outcome = await prisma.$transaction(async (tx) => {
    const [row] = await tx.$queryRaw`
      SELECT "failedLoginAttempts", "lockedUntil"
      FROM "User"
      WHERE "id" = ${user.id}
      FOR UPDATE
    `;

    const now = new Date();
    // A lockout window that has already elapsed is treated as cleared
    // before evaluating this attempt, giving a fresh 5-attempt window
    // rather than re-locking on the very next failure.
    const lockExpired = row.lockedUntil && row.lockedUntil <= now;
    const failedLoginAttempts = lockExpired ? 0 : row.failedLoginAttempts;
    const currentlyLocked = row.lockedUntil && row.lockedUntil > now;

    if (currentlyLocked) {
      return { status: "locked" };
    }

    if (!passwordCorrect) {
      const attempts = failedLoginAttempts + 1;
      const lockingNow = attempts >= LOCKOUT_THRESHOLD;
      // Still covered by the row lock acquired above — this write, and the
      // read that decided it, run inside the same transaction, so nothing
      // else can touch this row in between.
      await tx.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: lockingNow ? 0 : attempts,
          lockedUntil: lockingNow
            ? new Date(now.getTime() + LOCKOUT_DURATION_MS)
            : null,
        },
      });
      return lockingNow ? { status: "locked" } : { status: "invalid", remaining: LOCKOUT_THRESHOLD - attempts };
    }

    if (failedLoginAttempts !== 0 || row.lockedUntil) {
      await tx.user.update({ where: { id: user.id }, data: CLEARED_LOCKOUT });
    }
    return { status: "success" };
  });

  if (outcome.status === "locked") {
    throw AppError.locked(LOCKED_MESSAGE);
  }
  if (outcome.status === "invalid") {
    throw invalidCredentials(outcome.remaining);
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

  await clearLockout(user.id);

  return { token: signToken({ sub: user.id }), user };
}

async function resetPasswordChannels({ phone }) {
  if (!phone) {
    throw AppError.badRequest("Phone is required.", { phone: "Required" });
  }
  const normalizedPhone = normalizePhoneForLookup(phone);
  const user = await prisma.user.findFirst({
    where: { phone: normalizedPhone, deletedAt: null },
  });
  if (!user) {
    // "enumeration weakness FR-ENDORSE-03's deliberately generic 'no eligible match found' already guards against"
    throw AppError.notFound("No eligible match found");
  }

  return {
    phone: user.phone,
    email: user.email,
    emailVerified: !!user.emailVerifiedAt,
  };
}

async function resetPasswordRequest({ phone, channel }) {
  if (!phone || !channel) {
    throw AppError.badRequest("Phone and channel are required.");
  }
  const normalizedPhone = normalizePhoneForLookup(phone);
  const user = await prisma.user.findFirst({
    where: { phone: normalizedPhone, deletedAt: null },
  });
  if (!user) {
    // Prevent enumeration by returning success blindly
    return { success: true };
  }

  if (channel === "PHONE") {
    const code = await generateOtp({
      phone: user.phone,
      purpose: "PASSWORD_RESET",
      userId: user.id,
    });
    console.log(`[Mock SMS] Password reset code for ${user.phone}: ${code}`);
  } else if (channel === "EMAIL") {
    if (!user.email || !user.emailVerifiedAt) {
      return { success: true };
    }
    const token = crypto.randomBytes(32).toString("hex");
    await prisma.emailVerificationToken.create({
      data: {
        userId: user.id,
        email: user.email,
        token,
        purpose: "PASSWORD_RESET",
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 mins
      },
    });
    console.log(
      `[Mock Email] Password reset link for ${user.email}: https://youthlink.example.com/reset?token=${token}`
    );
  } else {
    throw AppError.badRequest("Invalid channel");
  }

  return { success: true };
}

async function resetPasswordVerify({ phone, code }) {
  if (!phone || !code) {
    throw AppError.badRequest("Phone and code are required.");
  }
  const normalizedPhone = normalizePhoneForLookup(phone);
  const user = await prisma.user.findFirst({
    where: { phone: normalizedPhone, deletedAt: null },
  });
  if (!user) {
    throw AppError.unauthorized("Invalid or expired code.");
  }
  
  const isValid = await verifyOtp({
    phone: normalizedPhone,
    code,
    purpose: "PASSWORD_RESET",
  });
  if (!isValid) {
    throw AppError.unauthorized("Invalid or expired code.");
  }

  // Code was valid and has been consumed. Issue a short-lived token 
  // so the client can submit the new password in a subsequent step.
  const token = crypto.randomBytes(32).toString("hex");
  await prisma.emailVerificationToken.create({
    data: {
      userId: user.id,
      email: user.email || user.phone, // fallback to phone if no email
      token,
      purpose: "PASSWORD_RESET",
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 mins
    },
  });

  return { success: true, token };
}

async function resetPasswordConfirm({ token, newPassword }) {
  if (!newPassword || newPassword.length < 8 || newPassword.length > 64) {
    throw AppError.badRequest("Password must be between 8 and 64 characters.");
  }
  if (!token) {
    throw AppError.badRequest("Must provide a reset token.");
  }

  const emailToken = await prisma.emailVerificationToken.findFirst({
    where: {
      token,
      purpose: "PASSWORD_RESET",
      consumedAt: null,
      expiresAt: { gt: new Date() },
    },
    include: { user: true },
  });
  if (!emailToken || !emailToken.user || emailToken.user.deletedAt) {
    throw AppError.unauthorized("Invalid or expired token.");
  }
  const user = emailToken.user;
  
  await prisma.emailVerificationToken.update({
    where: { id: emailToken.id },
    data: { consumedAt: new Date() },
  });

  const hash = await hashPassword(newPassword);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: hash,
      passwordChangedAt: new Date(),
      failedLoginAttempts: 0,
      lockedUntil: null,
    },
  });

  return { success: true };
}

async function recoveryRequest({ nic, birthdate, legalName, deviceId }) {
  if (!nic || !birthdate || !legalName || !deviceId) {
    throw AppError.badRequest("All fields are required.");
  }
  // The system matches the NIC against the account record using the deterministic encryption
  const encryptedNic = encryptNic(nic);
  const user = await prisma.user.findFirst({
    where: {
      nicEncrypted: encryptedNic,
      legalName,
      birthdate: new Date(birthdate),
      deletedAt: null,
    },
  });

  await prisma.accountRecoveryRequest.create({
    data: {
      userId: user ? user.id : null,
      nicSubmittedEncrypted: encryptedNic,
      legalNameSubmitted: legalName,
      birthdateSubmitted: new Date(birthdate),
      deviceId,
    },
  });

  return { success: true };
}

async function recoveryStatus({ deviceId }) {
  if (!deviceId) {
    throw AppError.badRequest("deviceId is required.");
  }
  const req = await prisma.accountRecoveryRequest.findFirst({
    where: { deviceId },
    orderBy: { createdAt: "desc" },
  });
  if (!req) {
    throw AppError.notFound("No request found.");
  }
  return { status: req.status };
}

async function recoveryConfirm({ deviceId, newPassword }) {
  if (!deviceId) {
    throw AppError.badRequest("deviceId is required.");
  }
  if (!newPassword || newPassword.length < 8 || newPassword.length > 64) {
    throw AppError.badRequest("Password must be between 8 and 64 characters.");
  }

  const req = await prisma.accountRecoveryRequest.findFirst({
    where: { deviceId, status: "APPROVED", completedAt: null },
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });

  if (!req || !req.user || req.user.deletedAt) {
    throw AppError.unauthorized("No approved, unused recovery request found for this device.");
  }

  const hash = await hashPassword(newPassword);
  
  await prisma.$transaction([
    prisma.accountRecoveryRequest.update({
      where: { id: req.id },
      data: { completedAt: new Date() },
    }),
    prisma.user.update({
      where: { id: req.user.id },
      data: {
        passwordHash: hash,
        passwordChangedAt: new Date(),
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    }),
  ]);

  return { success: true };
}

  /**
   * FR-ACC-12 Phone Number Change
   */
  async function changePhone({ userId, password, idToken }) {
    if (!password) {
      throw AppError.badRequest("Password is required.", { password: "Required" });
    }
    if (!idToken) {
      throw AppError.badRequest("Phone verification token is required.");
    }

    const user = await prisma.user.findUnique({ where: { id: userId, deletedAt: null } });
    if (!user) throw AppError.unauthorized("User not found");

    const validPassword = await verifyPassword(password, user.passwordHash);
    if (!validPassword) {
      throw AppError.unauthorized("That password doesn't match your account. Please try again.", { password: "Incorrect password" });
    }

    let newPhone;
    try {
      ({ phoneNumber: newPhone } = await verifyFirebaseIdToken(idToken));
    } catch (err) {
      throw AppError.unauthorized("Phone verification failed or has expired. Verify your phone again.");
    }

    if (newPhone === user.phone) {
      throw AppError.badRequest("This is already your registered phone number.");
    }

    const existingPhone = await prisma.user.findFirst({
      where: { phone: newPhone, phoneVerifiedAt: { not: null }, deletedAt: null },
    });
    if (existingPhone) {
      throw AppError.conflict("That phone number is already registered.", { phone: "Already registered" });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { phone: newPhone },
    });

    return { success: true, phone: newPhone };
  }
export default {
  register,
  loginWithPassword,
  loginWithOtp,
  checkAvailability,
  resetPasswordChannels,
  resetPasswordRequest,
  resetPasswordVerify,
  resetPasswordConfirm,
  recoveryRequest,
  recoveryStatus,
  recoveryConfirm,
  changePhone,
};

