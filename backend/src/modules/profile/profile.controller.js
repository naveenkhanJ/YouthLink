/**
 * Profile & Trust Signals controllers — the HTTP layer.
 *
 * Epic: FR-PROF  ·  Owner: Afham (minimal slice: the person's own profile)
 *
 * A controller reads the request, calls the service, and shapes the response.
 * It contains no business rules and no Prisma calls — those are in profile.service.js.
 */
import service from "./profile.service.js";
import { updateBio } from "./profile.bio.js";

export default {
  async getOwnProfile(req, res) {
    res.status(200).json(await service.getOwnProfile({ userId: req.user.id }));
  },

  // PATCH /api/profiles/me/bio — body { bio } (FR-PROF-03)
  async updateBio(req, res) {
    res.json(await updateBio({ user: req.user, bio: req.body?.bio }));
  },
};
