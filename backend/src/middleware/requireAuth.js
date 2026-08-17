/**
 * Authentication middleware — the ONE place every protected route checks identity.
 *
 * Epic: FR-ACC · Owner: Afham — see the cross-cutting authentication section
 * in docs/module-ownership.md. Do not write your own version.
 *
 * Re-reads accountStatus and suspendedAt from the database on EVERY
 * request — never trusts the token for these — which is what delivers
 * NFR-REL-02's "a suspension takes effect on the account's very next
 * request." A token issued before a suspension must stop working
 * immediately.
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
    return next(AppError.unauthorized("Missing or malformed Authorization header."));
  }

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    return next(AppError.unauthorized("Invalid or expired token."));
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: {
      id: true,
      role: true,
      accountStatus: true,
      suspendedAt: true,
      deletedAt: true,
    },
  });

  if (!user || user.deletedAt || user.accountStatus === "DELETED") {
    return next(AppError.unauthorized("Account no longer exists."));
  }
  if (isSuspended(user)) {
    return next(AppError.forbidden("This account has been suspended."));
  }

  req.user = user;
  next();
}

export default requireAuth;
