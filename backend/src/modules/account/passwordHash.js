/**
 * Password hashing for FR-ACC-09 / NFR-SEC-01.
 *
 * Epic: FR-ACC · Owner: Afham
 *
 * Hashing only — the 5-attempt/15-minute lockout is a login-path concern
 * and belongs with FR-ACC-07 (Slice A, later).
 *
 * bcrypt over argon2 — both are permitted by the requirement. bcrypt has one
 * tuning parameter (cost factor); argon2id has three (memory, iterations,
 * parallelism), and getting one of those wrong silently weakens the hash
 * rather than just costing extra compute. bcryptjs specifically over the
 * native `bcrypt` package: pure JavaScript, no node-gyp/native build step
 * across four different dev machines.
 */
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

/**
 * @param {string} password - Plaintext password.
 * @returns {Promise<string>} The bcrypt hash — safe to store in User.passwordHash.
 */
async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * @param {string} password - Plaintext password to check.
 * @param {string} hash - The stored User.passwordHash value.
 * @returns {Promise<boolean>}
 */
async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export { hashPassword, verifyPassword };
