/**
 * Engagement Lifecycle controllers — the HTTP layer.
 *
 * Epic: FR-ENG  ·  Owner: Naveenkhan
 */
import service from "./engagement.service.js";

async function list(req, res) {
  const result = await service.listEngagements({
    userId: req.user.id,
    role: req.user.role,
  });
  res.json({ engagements: result });
}

async function getById(req, res) {
  const result = await service.getEngagementById({
    engagementId: req.params.id,
    userId: req.user.id,
  });
  res.json({ engagement: result });
}

async function end(req, res) {
  const { didSomethingGoWrong, issueDetails } = req.body || {};
  const result = await service.endEngagement({
    engagementId: req.params.id,
    userId: req.user.id,
    didSomethingGoWrong: Boolean(didSomethingGoWrong),
    issueDetails,
  });
  res.json(result);
}

async function verifyCheckpoint(req, res) {
  const { checkpoint, code } = req.body || {};
  const result = await service.verifyCheckpointCode({
    engagementId: req.params.id,
    userId: req.user.id,
    checkpoint,
    code,
  });
  res.json(result);
}

async function unableToConfirm(req, res) {
  const { checkpoint, reason } = req.body || {};
  const result = await service.unableToConfirm({
    engagementId: req.params.id,
    userId: req.user.id,
    checkpoint,
    reason,
  });
  res.json(result);
}

async function cancel(req, res) {
  const { reason } = req.body || {};
  const result = await service.cancelEngagement({
    engagementId: req.params.id,
    userId: req.user.id,
    reason,
  });
  res.json(result);
}

async function reconfirm(req, res) {
  const { accept } = req.body || {};
  const result = await service.reconfirmMaterialChange({
    engagementId: req.params.id,
    workerId: req.user.id,
    accept: Boolean(accept),
  });
  res.json(result);
}

export default {
  list,
  getById,
  end,
  verifyCheckpoint,
  unableToConfirm,
  cancel,
  reconfirm,
};
