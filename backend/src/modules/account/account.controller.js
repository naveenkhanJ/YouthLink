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

export default {
  async register(req, res) {
    const user = await service.register(req.body);
    // Never return passwordHash or nicEncrypted — only the masked last 4
    // digits (NFR-SEC-03) reach the client.
    res.status(201).json({
      id: user.id,
      role: user.role,
      phone: user.phone,
      email: user.email,
      legalName: user.legalName,
      birthdate: user.birthdate,
      nicLast4: user.nicLast4,
      accountStatus: user.accountStatus,
      createdAt: user.createdAt,
    });
  },
};
