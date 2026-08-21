/**
 * NIC encryption, decryption, and masking.
 *
 * Epic: FR-ACC · Owner: Afham
 * Requirements: FR-ACC-04, FR-ACC-05, NFR-SEC-03
 *
 * Scoped to this module rather than src/lib, since only Account Management
 * requirements touch the NIC.
 *
 * Deterministic AES-256-CBC, per the User-indexes note in
 * docs/database-schema.md: the IV is HMAC-SHA256(ivKey, normalizedNic),
 * truncated to 16 bytes. The same NIC always produces the same ciphertext,
 * which is what lets the partial unique index on User.nicEncrypted
 * (FR-ACC-05) actually catch duplicates — random-IV AES-GCM, the usual
 * correct default, would let duplicates through with no visible symptom.
 * This deliberately leaks equality between identical NICs; that is exactly
 * the trade-off the uniqueness check needs, the same one a blind index makes.
 */
import crypto from "crypto";
import config from "../../config/index.js";

const ALGORITHM = "aes-256-cbc";
const IV_HEX_PATTERN = /^[0-9a-f]{32}$/i; // 16 bytes
const CIPHERTEXT_HEX_PATTERN = /^([0-9a-f]{2})+$/i; // non-empty, even-length hex

/**
 * NICs must collide regardless of case or surrounding whitespace, so
 * "200012345v" and "200012345V" are treated as the same NIC. FR-ACC-04 says
 * the NIC is stored "as entered" — read here as "not reformatted to a
 * canonical shape, not parsed, not verified," not as byte-for-byte case
 * preservation, since without this normalization FR-ACC-05's uniqueness
 * check would miss case-different duplicates.
 * @param {string} nic - As entered by the user.
 * @returns {string}
 */
function normalizeNic(nic) {
  if (typeof nic !== "string" || nic.trim().length === 0) {
    throw new Error("normalizeNic requires a non-empty string");
  }
  return nic.trim().toUpperCase();
}

function deriveIv(normalizedNic) {
  return crypto
    .createHmac("sha256", config.nicIvKey)
    .update(normalizedNic)
    .digest()
    .subarray(0, 16);
}

/**
 * @param {string} nic - As entered by the user, not yet normalized.
 * @returns {string} `${ivHex}:${ciphertextHex}` — store this in User.nicEncrypted.
 */
function encryptNic(nic) {
  const normalized = normalizeNic(nic);
  const iv = deriveIv(normalized);
  const cipher = crypto.createCipheriv(ALGORITHM, config.nicEncryptionKey, iv);
  const ciphertext = Buffer.concat([
    cipher.update(normalized, "utf8"),
    cipher.final(),
  ]);
  return `${iv.toString("hex")}:${ciphertext.toString("hex")}`;
}

/**
 * @param {string} nicEncrypted - The stored `${ivHex}:${ciphertextHex}` value.
 * @returns {string} The normalized NIC.
 */
function decryptNic(nicEncrypted) {
  const parts = String(nicEncrypted).split(":");
  const [ivHex, ciphertextHex] = parts;
  const isWellFormed =
    parts.length === 2 &&
    IV_HEX_PATTERN.test(ivHex) &&
    CIPHERTEXT_HEX_PATTERN.test(ciphertextHex) &&
    // AES-256-CBC output is always a whole number of 16-byte blocks.
    (ciphertextHex.length / 2) % 16 === 0;
  if (!isWellFormed) {
    throw new Error("decryptNic received a malformed nicEncrypted value");
  }
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    config.nicEncryptionKey,
    iv,
  );
  try {
    const plaintext = Buffer.concat([
      decipher.update(Buffer.from(ciphertextHex, "hex")),
      decipher.final(),
    ]);
    return plaintext.toString("utf8");
  } catch {
    // Wrap the raw OpenSSL error (e.g. "bad decrypt") so callers see one
    // consistent error type for every way a stored value can be invalid.
    throw new Error("decryptNic could not decrypt the provided value");
  }
}

/**
 * The value shown back to the entering user after initial entry (NFR-SEC-03)
 * — also what User.nicLast4 stores.
 * @param {string} nic - As entered by the user, not yet normalized.
 * @returns {string} The last 4 characters of the normalized NIC.
 */
function getNicLast4(nic) {
  const normalized = normalizeNic(nic);
  if (normalized.length < 4) {
    throw new Error("getNicLast4 requires a NIC of at least 4 characters");
  }
  return normalized.slice(-4);
}

export { normalizeNic, encryptNic, decryptNic, getNicLast4 };
