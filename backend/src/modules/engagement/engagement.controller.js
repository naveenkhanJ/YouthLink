/**
 * Engagement Lifecycle controllers — the HTTP layer.
 *
 * Epic: FR-ENG  ·  Owner: Naveenkhan
 *
 * A controller reads the request, checks the actor's role, calls the service and shapes the
 * response. Whether the user is a party to the specific engagement is a business rule and lives
 * in the service.
 */
import AppError from "../../utils/AppError.js";
import service from "./engagement.service.js";
import { cancelEngagement, respondToCancellation } from "./engagement.cancellation.js";

// FR-ENG's actors are the Employer and the Youth Job-Seeker; a verifier is never a party.
const PARTY_ROLES = ["YOUTH_JOB_SEEKER", "EMPLOYER"];

function requireParty(req) {
  if (!PARTY_ROLES.includes(req.user.role)) throw AppError.forbidden();
}

function requireRole(req, role) {
  if (req.user.role !== role) throw AppError.forbidden();
}

// FR-ENG-14
async function list(req, res) {
  requireParty(req);
  const engagements = await service.listEngagements({ userId: req.user.id, role: req.user.role });
  res.json({ engagements });
}

async function getById(req, res) {
  requireParty(req);
  const engagement = await service.getEngagementById({ engagementId: req.params.id, userId: req.user.id });
  res.json({ engagement });
}

// FR-ENG-01 / 02 / 04
async function verifyCheckpoint(req, res) {
  requireParty(req);
  const { checkpoint, code } = req.body || {};
  const result = await service.verifyCheckpointCode({
    engagementId: req.params.id,
    userId: req.user.id,
    checkpoint,
    code,
  });
  res.json(result);
}

// FR-ENG-12
async function end(req, res) {
  requireParty(req);
  const { somethingWentWrong } = req.body || {};
  const result = await service.endEngagement({
    engagementId: req.params.id,
    userId: req.user.id,
    somethingWentWrong,
  });
  res.json(result);
}

// FR-ENG-09 — the worker's answer
async function reconfirm(req, res) {
  requireRole(req, "YOUTH_JOB_SEEKER");
  const { accept } = req.body || {};
  const result = await service.reconfirmMaterialChange({
    engagementId: req.params.id,
    userId: req.user.id,
    accept,
  });
  res.json(result);
}

// FR-ENG-09 / FR-ENG-11 — the employer's view of the answers (5.12)
async function changeResponses(req, res) {
  requireRole(req, "EMPLOYER");
  const result = await service.getChangeResponses({ gigPostingId: req.params.postingId, userId: req.user.id });
  res.json(result);
}

// FR-ENG-03
async function unableToConfirm(req, res) {
  requireParty(req);
  const { checkpoint } = req.body || {};
  const result = await service.unableToConfirm({ engagementId: req.params.id, userId: req.user.id, checkpoint });
  res.json(result);
}

// FR-ENG-05 / 06 — a request (more than 48 h to the start) or an immediate cancellation
async function cancel(req, res) {
  requireParty(req);
  const { reason } = req.body || {};
  const result = await cancelEngagement({ engagementId: req.params.id, userId: req.user.id, reason });
  res.json(result);
}

// FR-ENG-05 — the other party accepts or rejects a pending request
async function respondToRequest(req, res) {
  requireParty(req);
  const { accept } = req.body || {};
  const result = await respondToCancellation({ engagementId: req.params.id, userId: req.user.id, accept });
  res.json(result);
}

export default {
  list,
  getById,
  verifyCheckpoint,
  end,
  reconfirm,
  changeResponses,
  unableToConfirm,
  cancel,
  respondToRequest,
};
