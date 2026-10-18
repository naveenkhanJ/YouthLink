/**
 * The worker's bio — FR-PROF-03 (screen 7.1 "Edit bio").
 *
 * Epic: FR-PROF  ·  Added 2026-10-18 (full build on integration/viva-demo)
 *
 * FR-PROF-03 gives every profile a free-text bio of at most 300 characters: experience and
 * languages for a Youth Job-Seeker, a business description for a Business employer. The employer's
 * half already exists as `businessBio`, edited with the business name (FR-ACC-16, 1.15eb), so this
 * file is the job-seeker's half: `User.bio`. It also feeds FR-PROF-04 — the application note is
 * pre-filled from it (applying module) — and FR-ENDORSE-13, whose one-time prompt stops once a bio
 * exists.
 *
 * 7.1 enforces the cap in the field (input stops at 300) and "on the server" — here a longer value
 * is refused rather than silently cut, so nothing the worker typed is lost without them seeing it.
 */
import prisma from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";

export const BIO_MAX_LENGTH = 300;

/**
 * Sets (or clears, with an empty string) the signed-in job-seeker's bio.
 * @param {{ user: { id: string, role: string }, bio: unknown }} input
 * @returns {Promise<{ bio: string|null }>}
 */
export async function updateBio({ user, bio }) {
  if (user.role !== "YOUTH_JOB_SEEKER") {
    throw AppError.forbidden("Only job-seekers have a profile bio. A business describes itself with its business name.");
  }
  if (typeof bio !== "string") {
    throw AppError.badRequest("Some details need fixing.", { bio: "Write your bio as text." });
  }
  const text = bio.trim();
  if (text.length > BIO_MAX_LENGTH) {
    throw AppError.badRequest("Some details need fixing.", { bio: `Your bio can be up to ${BIO_MAX_LENGTH} characters.` });
  }
  return prisma.user.update({
    where: { id: user.id },
    data: { bio: text.length > 0 ? text : null },
    select: { bio: true },
  });
}

export default { updateBio };
