/**
 * Shared account-status checks (FR-ADM-03) — used by requireAuth.js on every
 * request and by account.service.js's two login paths. Factored out after a
 * self-review pass flagged the same condition being hand-duplicated in three
 * places, risking drift if the suspension rule ever changes.
 */

/**
 * @param {{ accountStatus: string, suspendedAt: Date | null }} user
 * @returns {boolean}
 */
function isSuspended(user) {
  return user.accountStatus === "SUSPENDED" || Boolean(user.suspendedAt);
}

export { isSuspended };
