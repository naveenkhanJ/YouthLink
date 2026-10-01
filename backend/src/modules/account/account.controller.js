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
import { messagePage, resetPasswordPage } from "./pages.js";

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
    // Settings (FR-ACC-18) shows the employer's posting type and business name.
    postingAsType: user.postingAsType ?? null,
    businessName: user.businessName ?? null,
    accountStatus: user.accountStatus,
    createdAt: user.createdAt,
  };
}

async function changePhone(req, res) {
  const result = await service.changePhone({
    userId: req.user.id,
    password: req.body.password,
    idToken: req.body.idToken,
  });
  res.status(200).json(result);
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

  async checkAvailability(req, res) {
    const result = await service.checkAvailability(req.body);
    res.status(200).json(result);
  },

  async resetPasswordChannels(req, res) {
    const result = await service.resetPasswordChannels(req.body);
    res.status(200).json(result);
  },

  async resetPasswordRequest(req, res) {
    const result = await service.resetPasswordRequest(req.body);
    res.status(200).json(result);
  },

  async resetPasswordVerify(req, res) {
    const result = await service.resetPasswordVerify(req.body);
    res.status(200).json(result);
  },

  async resetPasswordConfirm(req, res) {
    const result = await service.resetPasswordConfirm(req.body);
    res.status(200).json(result);
  },

  async recoveryRequest(req, res) {
    const result = await service.recoveryRequest(req.body);
    res.status(200).json(result);
  },

  async recoveryStatus(req, res) {
    // A GET has no body (req.body is undefined under Express 5), so the device id travels in
    // the query string. Reading req.body here used to throw and answer 500.
    const result = await service.recoveryStatus({ deviceId: req.query.deviceId });
    res.status(200).json(result);
  },

  // The pages below are opened from links in emails, in a browser — so they answer HTML,
  // not JSON, and never throw to the JSON error handler for an ordinary bad link.
  async verifyEmailPage(req, res) {
    const { status } = await service.verifyEmail({ token: req.query.token });
    const pages = {
      confirmed: ["Email confirmed", "Your email address is now confirmed. You can close this page."],
      taken: ["Email already in use", "That email address is already confirmed on another YouthLink account."],
      invalid: ["Link no longer valid", "This confirmation link has expired or was already used."],
    };
    res.status(status === "confirmed" ? 200 : 400).type("html").send(messagePage(...pages[status]));
  },

  resetPasswordPage(req, res) {
    res.status(200).type("html").send(resetPasswordPage(req.query.token));
  },

  async recoveryConfirm(req, res) {
    const result = await service.recoveryConfirm(req.body);
    res.status(200).json(result);
  },

  changePhone,
};

