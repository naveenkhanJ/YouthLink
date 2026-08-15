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

module.exports = {
  env: optional("NODE_ENV", "development"),
  port: Number(optional("PORT", "3000")),
  databaseUrl: required("DATABASE_URL"),

  // Add new variables here AND to .env.example. Never commit real values.
  // Slice A will add: NIC_ENCRYPTION_KEY, NIC_IV_KEY, JWT_SECRET,
  // and the Firebase Admin service-account credentials.
};
