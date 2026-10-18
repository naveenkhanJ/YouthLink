/**
 * Community Endorsement controllers — the HTTP layer. Reads the request, calls the service,
 * shapes the response. No business rules and no Prisma calls here: those are in
 * endorsement.service.js, so the rules stay testable on their own.
 *
 * Epic: FR-ENDORSE
 * Requirements: FR-ENDORSE-02, -03, -04, -05, -07, -08, -09, -11, -13, -14
 *
 * `req.user` ({ id, role, … }) is set by requireAuth, which re-reads the account on every request;
 * the service makes the role checks (Verifier vs job-seeker) from it.
 */
import service from "./endorsement.service.js";

/** GET /api/endorsements/me/code — the worker's own code (8.1 / 8.1b). FR-ENDORSE-02, -05. */
export async function getMyCode(req, res) {
  res.json(await service.getMyCode({ user: req.user }));
}

/** POST /api/endorsements/lookup-code — body { code }. Verifier, 8.2. FR-ENDORSE-02. */
export async function lookupCode(req, res) {
  res.json(await service.lookupCode({ user: req.user, code: req.body?.code }));
}

/** POST /api/endorsements/search-phone — body { phone }. Verifier, 8.3. FR-ENDORSE-03. */
export async function searchByPhone(req, res) {
  res.json(await service.searchByPhone({ user: req.user, phone: req.body?.phone }));
}

/**
 * POST /api/endorsements — body { workerId, entryPoint, attributes?, reason? }. Verifier, 8.4.
 * FR-ENDORSE-04, -08, -09.
 */
export async function createEndorsement(req, res) {
  const { workerId, attributes, reason, entryPoint } = req.body ?? {};
  const result = await service.createEndorsement({ user: req.user, workerId, attributes, reason, entryPoint });
  res.status(201).json(result);
}

/** GET /api/endorsements/given — the Verifier's own list and track record (8.5). FR-ENDORSE-11. */
export async function listGiven(req, res) {
  res.json(await service.listGiven({ user: req.user }));
}

/** POST /api/endorsements/:id/revoke — Verifier, 8.5c. FR-ENDORSE-07. */
export async function revokeEndorsement(req, res) {
  res.json(await service.revokeEndorsement({ user: req.user, endorsementId: req.params.id }));
}

/** GET /api/endorsements/me/prompts — the worker's one-time prompts. FR-ENDORSE-13, -14. */
export async function getPrompts(req, res) {
  res.json(await service.getPrompts({ user: req.user }));
}

/**
 * PATCH /api/endorsements/me/prompts — body { bioPromptShown?: true, endorsementSuggestionShown?: true }.
 * FR-ENDORSE-13, -14.
 */
export async function setPromptsShown(req, res) {
  const { bioPromptShown, endorsementSuggestionShown } = req.body ?? {};
  res.json(await service.setPromptsShown({ user: req.user, bioPromptShown, endorsementSuggestionShown }));
}

export default {
  getMyCode,
  lookupCode,
  searchByPhone,
  createEndorsement,
  listGiven,
  revokeEndorsement,
  getPrompts,
  setPromptsShown,
};
