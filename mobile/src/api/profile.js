/**
 * Profile & Trust Signals API (FR-PROF) — Afham (minimal slice: the person's own profile).
 */
import { request } from "./client";

/**
 * FR-PROF-01/02/06: the signed-in person's own profile, with every trust signal computed on the
 * server (rating average and count, completion rate, jobs, endorsements).
 * @returns {Promise<{
 *   role: string, displayName: string, phoneVerified: boolean, bio: string|null,
 *   trust: { tier: "history"|"zeroHistory", ratingAverage: number|null, ratingCount: number,
 *            completionRate: number|null, jobCount: number },
 *   endorsements?: { endorserName: string, reason: string, attributes: string[] }[],
 *   endorsedBy?: string|null, endorsementCodeClosed?: boolean,
 *   verifier?: { since: string, endorsedCount: number },
 *   employer?: { completedEngagements: number },
 * }>}
 */
export function getOwnProfile() {
  return request("/api/profiles/me");
}
