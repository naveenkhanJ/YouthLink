/**
 * Applying & Selection controllers — the HTTP layer.
 *
 * Epic: FR-APPLY  ·  Owner: Naveenkhan
 *
 * A controller reads the request, calls the service, and shapes the response.
 * It should contain no business rules and no Prisma calls — those belong in
 * application.service.js, so the rules stay testable and reusable.
 *
 * Throw AppError for expected failures; asyncHandler forwards it to the error
 * handler, which turns it into the right status code.
 */
import AppError from "../../utils/AppError.js";
import service from "./application.service.js";

// Which actor may call an action, per each requirement's Actor(s) — an access check, not a
// business rule, so it stays here. Whether an employer owns the posting involved is a business
// rule and lives in the service. Messages are full sentences (docs/decisions.md, 2026-08-27).
const WORKER_ONLY = "Only a job-seeker account can do that.";
const EMPLOYER_ONLY = "Only an employer account can do that.";

function requireRole(req, role, message) {
  if (req.user.role !== role) {
    throw AppError.forbidden(message);
  }
}

export default {
  // FR-APPLY-01 — GET /api/applications/listing/:gigPostingId (3.12)
  async getListing(req, res) {
    requireRole(req, "YOUTH_JOB_SEEKER", WORKER_ONLY);
    const detail = await service.getListingDetail({
      gigPostingId: req.params.gigPostingId,
      workerId: req.user.id,
    });
    res.json(detail);
  },

  // FR-APPLY-02 — POST /api/applications
  async apply(req, res) {
    requireRole(req, "YOUTH_JOB_SEEKER", WORKER_ONLY);
    const { gigPostingId, note } = req.body ?? {};
    if (!gigPostingId || typeof gigPostingId !== "string") {
      throw AppError.badRequest("Choose a posting to apply to.");
    }
    const application = await service.apply({ workerId: req.user.id, gigPostingId, note });
    res.status(201).json(application);
  },

  // FR-APPLY-03 — POST /api/applications/:id/withdraw
  async withdraw(req, res) {
    requireRole(req, "YOUTH_JOB_SEEKER", WORKER_ONLY);
    const application = await service.withdraw({
      applicationId: req.params.id,
      workerId: req.user.id,
    });
    res.json(application);
  },

  // FR-APPLY-12 — GET /api/applications/mine
  async getMine(req, res) {
    requireRole(req, "YOUTH_JOB_SEEKER", WORKER_ONLY);
    const applications = await service.getMyApplications({ workerId: req.user.id });
    res.json(applications);
  },

  // FR-APPLY-04 / FR-APPLY-05 — GET /api/applications?gigPostingId=...
  async getPool(req, res) {
    requireRole(req, "EMPLOYER", EMPLOYER_ONLY);
    const { gigPostingId } = req.query;
    if (!gigPostingId || typeof gigPostingId !== "string") {
      throw AppError.badRequest("Choose a posting to see its applicants.");
    }
    const pool = await service.getApplicantPool({ gigPostingId, employerId: req.user.id });
    res.json(pool);
  },

  // FR-APPLY-06 / FR-APPLY-07 / FR-APPLY-09 — POST /api/applications/:id/select
  async select(req, res) {
    requireRole(req, "EMPLOYER", EMPLOYER_ONLY);
    const selection = await service.select({
      applicationId: req.params.id,
      employerId: req.user.id,
    });
    res.status(201).json(selection);
  },

  // FR-APPLY-08 — POST /api/applications/:id/decline
  async decline(req, res) {
    requireRole(req, "EMPLOYER", EMPLOYER_ONLY);
    const application = await service.decline({
      applicationId: req.params.id,
      employerId: req.user.id,
    });
    res.json(application);
  },
};
