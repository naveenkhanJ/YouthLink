/**
 * Profile & Trust Signals services — business rules and data access.
 *
 * Epic: FR-PROF  ·  Owner: Afham (minimal slice: the person's OWN profile, screen 1.18)
 *
 * Every trust signal is computed from Rating / CompletionRecord / Endorsement when asked and never
 * stored on User (docs/database-schema.md, "Trust signals"), so there is no copy to go stale.
 */
import prisma from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";

// Endorsement attribute -> the label the prototype draws on its chips (M8).
const ATTRIBUTE_LABELS = {
  PUNCTUALITY: "Punctuality",
  HONESTY: "Honesty",
  RELIABILITY: "Reliability",
  SPECIFIC_SKILL: "Specific skill",
  LENGTH_OF_ACQUAINTANCE: "Long acquaintance",
};

// A completion record counts FOR the person when it is a completion or the credit a reliable party
// gets for a confirmed no-show by the other side (FR-ADM-08); every other outcome counts against.
const CREDIT_OUTCOMES = ["COMPLETED", "NO_SHOW_RELIABLE_CREDIT"];

/**
 * FR-PROF-01: the name other people see. A Business employer is shown by its business name; the
 * legal name stays on the account (Settings). Everyone else is shown by their legal name.
 */
function displayNameFor(user) {
  if (user.role === "EMPLOYER" && user.postingAsType === "BUSINESS" && user.businessName) {
    return user.businessName;
  }
  return user.legalName;
}

/**
 * FR-RATE-03: completion rate, kept apart from the star rating. Weighted: a late cancellation
 * weighs 2.0 against 1.0 for an early one (CompletionRecord.weight), so the rate is
 * credited weight / all weight, as a whole percentage.
 * @returns {Promise<{ completionRate: number|null, jobCount: number }>}
 */
async function completionStats(userId) {
  const rows = await prisma.completionRecord.groupBy({
    by: ["outcome"],
    where: { userId },
    _sum: { weight: true },
    _count: { _all: true },
  });
  let credited = 0;
  let total = 0;
  let jobs = 0;
  for (const row of rows) {
    const weight = Number(row._sum.weight ?? 0);
    total += weight;
    if (CREDIT_OUTCOMES.includes(row.outcome)) credited += weight;
    if (row.outcome === "COMPLETED") jobs += row._count._all;
  }
  return { completionRate: total > 0 ? Math.round((credited / total) * 100) : null, jobCount: jobs };
}

/**
 * FR-PROF-01 / FR-PROF-02 / FR-PROF-06: what a person sees on their own profile (M1 1.18).
 *
 * - Rating: only ratings that have been revealed (double-blind, FR-RATE-02) and not removed count.
 * - Tier: "history" once there is a revealed rating, otherwise "zeroHistory" ("New to YouthLink"
 *   plus the endorsement badge when an active endorsement exists, FR-ENDORSE-10).
 * - Phone verified is true for every account; no badge ever implies NIC verification (FR-PROF-02).
 * @param {{ userId: string }} input
 */
async function getOwnProfile({ userId }) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.deletedAt) throw AppError.sessionEnded();

  const [ratings, completion] = await Promise.all([
    prisma.rating.aggregate({
      where: { rateeId: userId, revealedAt: { not: null }, removedAt: null },
      _avg: { score: true },
      _count: { _all: true },
    }),
    completionStats(userId),
  ]);
  const ratingCount = ratings._count._all;
  const hasHistory = ratingCount > 0;
  const trust = {
    tier: hasHistory ? "history" : "zeroHistory",
    ratingAverage: hasHistory ? Math.round(ratings._avg.score * 10) / 10 : null,
    ratingCount,
    completionRate: completion.completionRate,
    jobCount: completion.jobCount,
  };

  const profile = {
    role: user.role,
    displayName: displayNameFor(user),
    phoneVerified: Boolean(user.phoneVerifiedAt),
    // An employer's bio is its business bio, and exists only while it posts as Business.
    bio:
      user.role === "EMPLOYER"
        ? user.postingAsType === "BUSINESS"
          ? user.businessBio
          : null
        : user.bio,
    trust,
  };

  if (user.role === "YOUTH_JOB_SEEKER") {
    const endorsements = await prisma.endorsement.findMany({
      where: { workerId: userId, revokedAt: null },
      orderBy: { createdAt: "desc" },
      include: { endorser: { select: { legalName: true } } },
    });
    profile.endorsements = endorsements.map((e) => ({
      endorserName: e.endorser.legalName,
      reason: e.reason ?? "",
      attributes: e.attributes.map((a) => ATTRIBUTE_LABELS[a]).filter(Boolean),
    }));
    profile.endorsedBy = endorsements.length > 0 ? endorsements[0].endorser.legalName : null;
    // FR-ENDORSE-05: eligibility for endorsement closes for good when the first rating lands.
    const received = await prisma.rating.count({ where: { rateeId: userId, removedAt: null } });
    profile.endorsementCodeClosed = received > 0;
  } else if (user.role === "COMMUNITY_ENDORSER") {
    profile.verifier = {
      since: user.createdAt,
      endorsedCount: await prisma.endorsement.count({ where: { endorserId: userId, revokedAt: null } }),
    };
  } else if (user.role === "EMPLOYER") {
    profile.employer = {
      completedEngagements: await prisma.engagement.count({
        where: { employerId: userId, status: "COMPLETED" },
      }),
    };
  }
  return profile;
}

export default { getOwnProfile };
