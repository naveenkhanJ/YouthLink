/**
 * Authentication middleware — the ONE place every protected route checks identity.
 *
 * ============================================================================
 * NOT IMPLEMENTED YET. Owned by the Account Management epic (FR-ACC-07, Slice A).
 * Do not write your own version — see the cross-cutting authentication section
 * in docs/module-ownership.md.
 * ============================================================================
 *
 * When implemented it must:
 *   1. Read the Bearer token from the Authorization header.
 *   2. Verify the JWT signature and expiry.
 *   3. Re-read accountStatus, suspendedAt and lockedUntil from the database on
 *      EVERY request — not from the token. This is what delivers NFR-REL-02's
 *      "a suspension takes effect on the account's very next request." A token
 *      issued before a suspension must stop working immediately.
 *   4. Attach the user to req.user.
 *
 * There is deliberately no Session or RefreshToken table; see the Design
 * Decisions section of docs/database-schema.md.
 */
import AppError from "../utils/AppError.js";

function requireAuth(req, res, next) {
  return next(
    AppError.unauthorized(
      "Authentication is not implemented yet — see FR-ACC-07, Account Management epic",
    ),
  );
}

export default requireAuth;
