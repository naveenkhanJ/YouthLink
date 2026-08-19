/**
 * Account Management controllers — the HTTP layer.
 *
 * Epic: FR-ACC  ·  Owner: Afham
 *
 * A controller reads the request, calls the service, and shapes the response.
 * It should contain no business rules and no Prisma calls — those belong in
 * account.service.js, so the rules stay testable and reusable.
 *
 * Throw AppError for expected failures; asyncHandler forwards it to the error
 * handler, which turns it into the right status code.
 */
import service from "./account.service.js";

// Never return passwordHash or nicEncrypted — only the masked last 4 digits
// (NFR-SEC-03) reach the client. Shared by register and both login paths so
// there's only one place this list can go stale.
function publicUser(user) {
  return {
    id: user.id,
    role: user.role,
    phone: user.phone,
    email: user.email,
    legalName: user.legalName,
    birthdate: user.birthdate,
    nicLast4: user.nicLast4,
    accountStatus: user.accountStatus,
    createdAt: user.createdAt,
  };
}

export default {
  async register(req, res) {
    const user = await service.register(req.body);
    res.status(201).json(publicUser(user));
  },

  async loginPassword(req, res) {
    const { token, user } = await service.loginWithPassword(req.body);
    res.status(200).json({ token, user: publicUser(user) });
  },

  async loginOtp(req, res) {
    const { token, user } = await service.loginWithOtp(req.body);
    res.status(200).json({ token, user: publicUser(user) });
  },
};
