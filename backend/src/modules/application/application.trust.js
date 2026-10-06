/**
 * Applying & Selection — the trust signals an employer sees in the applicant pool,
 * and the pool's three-tier order (FR-APPLY-04, FR-APPLY-05).
 *
 * Epic: FR-APPLY  ·  Owner: Naveenkhan
 *
 * Pure functions, no Prisma: the service loads the rows, these turn them into numbers and an
 * order. Keeping them apart means the sort — the mechanism that gives an endorsement its value
 * (docs/product-overview.md, "The applicant pool sort") — can be checked on its own.
 */

// Endorsement attribute -> the label the prototype prints (4.6 "Endorsed by K. Rathnayake
// (Reliability) …"). The same labels the Profile module uses for its endorsement chips.
export const ATTRIBUTE_LABELS = {
  PUNCTUALITY: "Punctuality",
  HONESTY: "Honesty",
  RELIABILITY: "Reliability",
  SPECIFIC_SKILL: "Specific skill",
  LENGTH_OF_ACQUAINTANCE: "Long acquaintance",
};

// Completion rate (FR-RATE-03) is not computed here: the Ratings module owns its one definition
// (rating.service.js completionRateFromRecords), so the pool and the profile can never disagree.

/**
 * The star average over the ratings that count: revealed (double-blind, FR-RATE-02) and not
 * removed by an Admin (FR-RATE-06 — a removed rating is excluded from every aggregate, the pool
 * tiers included). The caller's query already filters on both (rating.service.js
 * revealedRatingsWhere); this only does the arithmetic.
 *
 * @param {{ score: number }[]} ratings
 * @returns {{ ratingAverage: number|null, exactAverage: number|null, ratingCount: number }}
 *   `ratingAverage` is rounded to one decimal for display ("4.6"); the sort uses `exactAverage`
 */
export function ratingStats(ratings = []) {
  const ratingCount = ratings.length;
  if (ratingCount === 0) return { ratingAverage: null, exactAverage: null, ratingCount: 0 };
  const exactAverage = ratings.reduce((sum, r) => sum + r.score, 0) / ratingCount;
  return { ratingAverage: Math.round(exactAverage * 10) / 10, exactAverage, ratingCount };
}

/**
 * FR-APPLY-04's tier for one applicant, named as Display/ApplicantRow names its variants:
 *   "history"     — has rating history (tier 1)
 *   "endorsedNew" — no history, at least one active endorsement (tier 2)
 *   "new"         — no history, no endorsement (tier 3)
 */
export function tierFor({ ratingCount, endorsementCount }) {
  if (ratingCount > 0) return "history";
  return endorsementCount > 0 ? "endorsedNew" : "new";
}

const TIER_RANK = { history: 1, endorsedNew: 2, new: 3 };

/**
 * The pool order (FR-APPLY-04, amended 2026-09-23 — YL-173):
 *   1. tier 1 before tier 2 before tier 3;
 *   2. inside tier 1, the higher average rating first, then the higher completion rate
 *      (no completion record at all counts as the lowest);
 *   3. inside tiers 2 and 3 — and, as a last resort, between two tier-1 applicants who are equal
 *      on both figures — the earlier application first.
 * The last rule makes the order stable: two developers sorting the same pool get the same list.
 *
 * @param {object} a - a pool row: { tier, exactAverage, completionRate, appliedAt }
 * @param {object} b
 * @returns {number} negative when `a` comes first
 */
export function compareApplicants(a, b) {
  if (a.tier !== b.tier) return TIER_RANK[a.tier] - TIER_RANK[b.tier];
  if (a.tier === "history") {
    if (b.exactAverage !== a.exactAverage) return b.exactAverage - a.exactAverage;
    const aRate = a.completionRate ?? -1;
    const bRate = b.completionRate ?? -1;
    if (bRate !== aRate) return bRate - aRate;
  }
  return new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime();
}

/**
 * The active endorsements as the detail screen names them: who vouched, and only the attributes
 * they actually selected (database-schema.md, Endorsement.attributes — an unselected attribute is
 * never displayed, or an optional field would turn into a negative signal).
 *
 * @param {{ endorser: { legalName: string }, attributes: string[] }[]} endorsements
 * @returns {{ name: string, attributes: string[] }[]}
 */
export function describeEndorsers(endorsements = []) {
  return endorsements.map((e) => ({
    name: e.endorser?.legalName ?? "",
    attributes: (e.attributes ?? []).map((a) => ATTRIBUTE_LABELS[a]).filter(Boolean),
  }));
}
