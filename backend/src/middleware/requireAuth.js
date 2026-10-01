/**
 * Authentication middleware — the ONE place every protected route checks identity.
 *
 * Epic: FR-ACC · Owner: Afham — see the cross-cutting authentication section
 * in docs/module-ownership.md. Do not write your own version.
 *
 * Re-reads accountStatus, suspendedAt and passwordChangedAt from the database
 * on EVERY request — never trusts the token for these:
 *   - suspension takes effect on the account's very next request (NFR-REL-02);
 *   - a completed password reset or change invalidates every session issued
 *     before it (FR-ACC-10 amendment A3/A5, FR-ACC-11 A4): a token whose `iat`
 *     predates User.passwordChangedAt is rejected, so a stolen token does not
 *     outlive a password change. `iat` is whole seconds, so it is compared with
 *     passwordChangedAt rounded DOWN to whole seconds: a token issued in the
 *     same second as the change (the login that follows a reset) stays valid,
 *     and only tokens from an earlier second are rejected.
 *
 * Every way a session can end between requests answers with the same code,
 * `SESSION_ENDED` (FR-ACC-07 amendment A32), so the app can return to login
 * with one neutral message instead of three different failure screens. Other
 * 401/403 responses (a wrong password on a signed-in screen, a role refusal)
 * carry no such code and must NOT sign the user out.
 *
 * Deliberately does NOT check lockedUntil here. NFR-SEC-02 locks "the
 * password-login path" specifically, and product-overview.md is explicit
 * that "the OTP path is unaffected by that lock" — an earlier version of
 * this middleware enforced lockedUntil globally, which meant a no-
 * credential attacker could fail someone's password 5 times and knock out
 * every one of that user's already-authenticated sessions on every device
 * (multiple simultaneous logins are an explicit product decision) until
 * they specifically thought to log back in via OTP. That contradicted
 * product-overview.md and NFR-REL-02 doesn't ask for it — see
 * docs/decisions.md. lockedUntil is enforced only where FR-ACC-09/
 * NFR-SEC-02 actually put it: account.service.js's loginWithPassword.
 *
 * There is deliberately no Session or RefreshToken table; see the Design
 * Decisions section of docs/database-schema.md.
 */
import AppError from "../utils/AppError.js";
import prisma from "../lib/prisma.js";
import { verifyToken } from "../lib/jwt.js";
import { isSuspended } from "../lib/accountStatus.js";

async function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) {
    // No token was presented at all — not an ended session, just not signed in.
    return next(AppError.unauthorized("Missing or malformed Authorization header."));
  }

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    return next(AppError.sessionEnded());
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: {
      id: true,
      role: true,
      accountStatus: true,
      suspendedAt: true,
      deletedAt: true,
      passwordChangedAt: true,
    },
  });

  if (!user || user.deletedAt || user.accountStatus === "DELETED") {
    return next(AppError.sessionEnded());
  }
  if (isSuspended(user)) {
    return next(AppError.sessionEnded("This account has been suspended.", 403));
  }
  if (
    user.passwordChangedAt &&
    payload.iat < Math.floor(user.passwordChangedAt.getTime() / 1000)
  ) {
    return next(AppError.sessionEnded());
  }

  req.user = user;
  next();
}

export default requireAuth;
