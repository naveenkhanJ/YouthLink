/**
 * Stateless JWT signing/verification (FR-ACC-07).
 *
 * The sole authentication mechanism for every module — no Session/RefreshToken
 * table exists (see docs/database-schema.md's Design Decisions). Verifying a
 * token here only proves it was signed by this server and hasn't expired;
 * requireAuth.js still re-reads accountStatus/suspendedAt/lockedUntil from the
 * database on every request, since none of that can be trusted from the token
 * itself once issued.
 *
 * 30-day expiry: chosen because there is deliberately no refresh-token flow,
 * so this is the de facto session length for the whole app, not just this
 * module — confirmed with Afham before picking a value, since nothing in
 * requirements.md/database-schema.md specifies one.
 */
import jwt from "jsonwebtoken";
import config from "../config/index.js";

const EXPIRES_IN = "30d";

/**
 * @param {object} payload - Must include `sub` (the User.id).
 * @returns {string}
 */
function signToken(payload) {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: EXPIRES_IN });
}

/**
 * @param {string} token
 * @returns {object} The decoded payload.
 * @throws {Error} If the token is missing, malformed, unsigned by this
 *   server, or expired — callers don't need to distinguish which.
 */
function verifyToken(token) {
  return jwt.verify(token, config.jwtSecret);
}

export { signToken, verifyToken };
