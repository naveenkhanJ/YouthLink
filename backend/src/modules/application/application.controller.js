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

// Which actor is allowed to call an action — an access check, not a
// business rule, so it stays here rather than in the service. Whether an
// employer owns the specific posting/application involved is a business
// rule and lives in the service instead.
function requireRole(req, role) {
  if (req.user.role !== role) {
    throw AppError.forbidden();
  }
}

export default {
  // FR-APPLY-02
  async apply(req, res) {
    requireRole(req, "YOUTH_JOB_SEEKER");
    const { gigPostingId, note } = req.body;
    if (!gigPostingId) {
      throw AppError.badRequest("gigPostingId is required");
    }
    const application = await service.apply({ workerId: req.user.id, gigPostingId, note });
    res.status(201).json(application);
  },

  // FR-APPLY-03
  async withdraw(req, res) {
    requireRole(req, "YOUTH_JOB_SEEKER");
    const application = await service.withdraw({
      applicationId: req.params.id,
      workerId: req.user.id,
    });
    res.json(application);
  },

  // Worker's own application list — supports FR-APPLY-01/03/07 on the mobile side
  async getMine(req, res) {
    requireRole(req, "YOUTH_JOB_SEEKER");
    const applications = await service.getMyApplications({ workerId: req.user.id });
    res.json(applications);
  },

  // FR-APPLY-04 / FR-APPLY-05 — GET /api/applications?gigPostingId=...
  async getPool(req, res) {
    requireRole(req, "EMPLOYER");
    const { gigPostingId } = req.query;
    if (!gigPostingId) {
      throw AppError.badRequest("gigPostingId query parameter is required");
    }
    const pool = await service.getApplicantPool({ gigPostingId, employerId: req.user.id });
    res.json(pool);
  },

  // FR-APPLY-06 / FR-APPLY-07 / FR-APPLY-09
  async select(req, res) {
    requireRole(req, "EMPLOYER");
    const engagement = await service.select({
      applicationId: req.params.id,
      employerId: req.user.id,
    });
    res.status(201).json(engagement);
  },

  // FR-APPLY-08
  async decline(req, res) {
    requireRole(req, "EMPLOYER");
    const application = await service.decline({
      applicationId: req.params.id,
      employerId: req.user.id,
    });
    res.json(application);
  },
};
