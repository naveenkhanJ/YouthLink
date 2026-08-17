/**
 * The system's own OTP mechanism for FR-ACC-08 — covers PASSWORD_RESET,
 * PHONE_CHANGE, and ADMIN_LOGIN only. SIGNUP and LOGIN are vestigial
 * OtpPurpose values; those two paths go through Firebase Phone Auth instead
 * (see firebaseAuth.js and FR-ACC-08's amendment note).
 *
 * 6-digit, 5-minute, single-use, per FR-ACC-08's acceptance criteria.
 *
 * Requesting a new code invalidates any previous unconsumed code for the
 * same phone+purpose — industry standard for OTP systems (Twilio Verify,
 * AWS Cognito, etc. all behave this way): only the latest code should ever
 * work, closing the window where an intercepted-but-unused old code stays
 * valid. The schema has no separate "invalidated" state, so this reuses
 * consumedAt to mean "no longer valid," whether by verification or by
 * being superseded.
 */
const crypto = require("crypto");
const prisma = require("../../lib/prisma");

const SUPPORTED_PURPOSES = ["PASSWORD_RESET", "PHONE_CHANGE", "ADMIN_LOGIN"];
const CODE_LENGTH = 6;
const EXPIRY_MINUTES = 5;

function assertSupportedPurpose(purpose) {
  if (!SUPPORTED_PURPOSES.includes(purpose)) {
    throw new Error(
      `otpService does not handle purpose "${purpose}" — SIGNUP and LOGIN ` +
        "go through Firebase Phone Auth instead (see FR-ACC-08's amendment note).",
    );
  }
}

function generateCode() {
  return crypto
    .randomInt(0, 10 ** CODE_LENGTH)
    .toString()
    .padStart(CODE_LENGTH, "0");
}

/**
 * @param {object} params
 * @param {string} params.phone
 * @param {"PASSWORD_RESET"|"PHONE_CHANGE"|"ADMIN_LOGIN"} params.purpose
 * @param {string} [params.userId]
 * @param {string} [params.adminAccountId]
 * @returns {Promise<string>} The generated 6-digit code, for the caller to send via SMS.
 */
async function generateOtp({
  phone,
  purpose,
  userId = null,
  adminAccountId = null,
}) {
  assertSupportedPurpose(purpose);
  const code = generateCode();

  await prisma.$transaction([
    // Supersede any still-live code from an earlier request for the same
    // phone+purpose before issuing the new one.
    prisma.otpCode.updateMany({
      where: {
        phone,
        purpose,
        consumedAt: null,
        expiresAt: { gt: new Date() },
      },
      data: { consumedAt: new Date() },
    }),
    prisma.otpCode.create({
      data: {
        phone,
        purpose,
        code,
        userId,
        adminAccountId,
        expiresAt: new Date(Date.now() + EXPIRY_MINUTES * 60 * 1000),
      },
    }),
  ]);

  return code;
}

/**
 * Atomically consumes a matching, unexpired, unused code via a single
 * UPDATE, so two concurrent verify attempts can't both succeed against the
 * same code.
 * @param {object} params
 * @param {string} params.phone
 * @param {string} params.code
 * @param {"PASSWORD_RESET"|"PHONE_CHANGE"|"ADMIN_LOGIN"} params.purpose
 * @returns {Promise<boolean>} Whether a matching code was found and consumed.
 */
async function verifyOtp({ phone, code, purpose }) {
  assertSupportedPurpose(purpose);
  const result = await prisma.otpCode.updateMany({
    where: {
      phone,
      code,
      purpose,
      consumedAt: null,
      expiresAt: { gt: new Date() },
    },
    data: { consumedAt: new Date() },
  });
  return result.count > 0;
}

module.exports = { generateOtp, verifyOtp };
