/**
 * Gig Posting controllers — the HTTP layer.
 *
 * Epic: FR-POST  ·  Owner: Lahiru
 *
 * A controller reads the request, calls the service, and shapes the response.
 * It should contain no business rules and no Prisma calls — those belong in
 * posting.service.js, so the rules stay testable and reusable.
 *
 * Throw AppError for expected failures; asyncHandler forwards it to the error
 * handler, which turns it into the right status code.
 */
const service = require("./posting.service");

module.exports = {
  async create(req, res) {
    const employerId = req.user?.id || req.body.employerId;
    const result = await service.createPosting(req.body, employerId);
    res.status(201).json(result);
  },

  async getById(req, res) {
    const result = await service.getPostingById(req.params.id);
    res.json(result);
  },

  async list(req, res) {
    const result = await service.listPostings(req.query);
    res.json(result);
  },
};
