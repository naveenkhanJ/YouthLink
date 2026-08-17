/**
 * Central environment configuration.
 *
 * Read environment variables HERE and nowhere else. Scattering process.env
 * across the codebase makes it impossible to tell what the app actually needs,
 * and a missing variable then fails somewhere deep at request time instead of
 * at startup.
 */
require("dotenv/config");

/**
 * Reads a required variable, failing fast at startup if it is missing.
 * @param {string} name - Environment variable name.
 * @returns {string}
 */
function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
        `Copy backend/.env.example to backend/.env and fill it in.`,
    );
  }
  return value;
}

/**
 * Reads an optional variable with a fallback.
 * @param {string} name
 * @param {string} fallback
 * @returns {string}
 */
function optional(name, fallback) {
  return process.env[name] || fallback;
}

/**
 * Reads a required variable and decodes it as a fixed-length hex-encoded key,
 * failing fast at startup if it is missing, not valid hex, or the wrong length.
 * Validates the string shape itself rather than the decoded byte length,
 * since Buffer.from(str, "hex") silently truncates at the first invalid
 * character instead of throwing — checking only the decoded length would
 * let a corrupted-but-truncatable value slip through undetected.
 * @param {string} name
 * @param {number} byteLength
 * @returns {Buffer}
 */
function requiredHexKey(name, byteLength) {
  const value = required(name);
  const hexLength = byteLength * 2;
  if (!new RegExp(`^[0-9a-f]{${hexLength}}$`, "i").test(value)) {
    throw new Error(
      `Environment variable ${name} must be exactly ${hexLength} hex characters ` +
        `(0-9, a-f) — a ${byteLength}-byte key, hex-encoded.`,
    );
  }
  return Buffer.from(value, "hex");
}

const nicEncryptionKey = requiredHexKey("NIC_ENCRYPTION_KEY", 32);
const nicIvKey = requiredHexKey("NIC_IV_KEY", 32);

// Deliberately separate keys (see docs/database-schema.md's deterministic-
// encryption note) — catch the easy mistake of reusing one generated value
// for both at startup, rather than letting it silently weaken the scheme.
if (nicEncryptionKey.equals(nicIvKey)) {
  throw new Error(
    "NIC_ENCRYPTION_KEY and NIC_IV_KEY must be different values. " +
      "Generate two separate keys — see backend/.env.example.",
  );
}

module.exports = {
  env: optional("NODE_ENV", "development"),
  port: Number(optional("PORT", "3000")),
  databaseUrl: required("DATABASE_URL"),

  // AES-256-CBC key and separate HMAC key for deterministic NIC encryption
  // (FR-ACC-04, FR-ACC-05, NFR-SEC-03) — see backend/src/modules/account/nicCrypto.js.
  nicEncryptionKey,
  nicIvKey,

  // Path to the downloaded Firebase Admin service-account JSON (FR-ACC-08) —
  // see backend/src/lib/firebaseAdmin.js.
  firebaseServiceAccountPath: required("FIREBASE_SERVICE_ACCOUNT_PATH"),

  // Add new variables here AND to .env.example. Never commit real values.
  // Slice A will add: JWT_SECRET.
};
