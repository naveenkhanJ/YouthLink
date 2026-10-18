/**
 * Reports & Disputes controllers — the HTTP layer.
 *
 * Epic: FR-DISPUTE (user side)
 *
 * A controller reads the request, calls the service and shapes the response. Who may act on a
 * specific case (its two parties) is a business rule and lives in the service.
 */
import service from "./dispute.service.js";

// FR-DISPUTE-01 — any signed-in actor ("All actor types") may report.
async function fileReport(req, res) {
  const { targetType, targetId, reason, detail } = req.body || {};
  const result = await service.fileReport({ reporterId: req.user.id, targetType, targetId, reason, detail });
  res.status(result.alreadyReported ? 200 : 201).json(result);
}

// FR-DISPUTE-07 — the current case of one engagement (?engagementId=…), or null.
async function caseForEngagement(req, res) {
  const disputeCase = await service.getCaseForEngagement({ engagementId: req.query.engagementId, userId: req.user.id });
  res.json({ case: disputeCase });
}

// FR-DISPUTE-07 — one case.
async function getCase(req, res) {
  const disputeCase = await service.getCase({ caseId: req.params.id, userId: req.user.id });
  res.json({ case: disputeCase });
}

// FR-DISPUTE-04 / 05 — the respondent's answer (9.3).
async function respond(req, res) {
  const { statement, images } = req.body || {};
  const disputeCase = await service.respondToCase({ caseId: req.params.id, userId: req.user.id, statement, images });
  res.json({ case: disputeCase });
}

// FR-DISPUTE-05 — either party attaches evidence while the window is open.
async function addEvidence(req, res) {
  const { images } = req.body || {};
  const disputeCase = await service.addEvidence({ caseId: req.params.id, userId: req.user.id, images });
  res.json({ case: disputeCase });
}

// FR-DISPUTE-05 — one of the viewer's own evidence images.
async function evidenceFile(req, res) {
  const { absolutePath, contentType } = await service.getEvidenceFile({
    evidenceId: req.params.evidenceId,
    userId: req.user.id,
  });
  res.type(contentType);
  res.set("Cache-Control", "private, no-store");
  await new Promise((resolve, reject) => {
    res.sendFile(absolutePath, (err) => (err ? reject(err) : resolve()));
  }).catch((err) => {
    // The row exists but the file is gone: a 404, not a server error.
    if (err.code === "ENOENT" || err.status === 404) {
      if (!res.headersSent) res.status(404).json({ error: "This photo could not be found." });
      return;
    }
    throw err;
  });
}

export default {
  fileReport,
  caseForEngagement,
  getCase,
  respond,
  addEvidence,
  evidenceFile,
};
