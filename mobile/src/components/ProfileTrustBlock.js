/**
 * Display/ProfileTrustBlock — real Figma component (node 40:107,
 * "Components / Display" page, found 2026-09-28). New — nothing existed
 * for this before. Profile trust block (1.18/1.19).
 *
 * Real, non-obvious ordering rule from the component's own description:
 * ZeroHistory is drawn FIRST because it's this product's DEFAULT worker
 * state, not an edge case — the whole endorsement-bootstrap mechanism
 * exists specifically for this person. Don't treat "history" as the
 * primary case with zero-history as a fallback; it's the other way
 * round. History tier shows rating and completion rate as two SEPARATE
 * figures (FR-RATE-03) — never merge them into one stat.
 */
import { Text, View, StyleSheet } from "react-native";
import { colors, spacing, radius, elevation, typography } from "../theme/tokens";
import Badge from "./Badge";
import StarsDisplay from "./StarsDisplay";

/**
 * @param {"zeroHistory"|"history"} tier
 * @param {string} [endorserName] - "zeroHistory" tier only, e.g. "Sunil Bandara". Without it the
 *   block is just the headline (1.18z, 56px tall): no Endorsed badge, no "Endorsed by" line.
 * @param {string} [headline] - "zeroHistory" tier only; defaults to "New to YouthLink". A Community
 *   Verifier's block reads "Community Verifier" (1.18v).
 * @param {string} [subtext] - Replaces the second line: a verifier's "Vouching since May 2026 · 3
 *   endorsed", or an employer's "23 engagements completed" in the history tier.
 * @param {number} [ratingAverage] - "history" tier only.
 * @param {number} [ratingCount] - "history" tier only.
 * @param {number} [completionRate] - "history" tier only, 0-100.
 * @param {number} [jobCount] - "history" tier only.
 */
export default function ProfileTrustBlock({
  tier,
  endorserName,
  headline = "New to YouthLink",
  subtext,
  ratingAverage,
  ratingCount,
  completionRate,
  jobCount,
}) {
  return (
    <View style={[styles.card, elevation.card]}>
      {tier === "zeroHistory" ? (
        <>
          <View style={styles.headline}>
            <Text style={styles.headlineText}>{headline}</Text>
            {endorserName ? <Badge family="endorsed" /> : null}
          </View>
          {endorserName || subtext ? (
            <Text style={styles.subtext}>{subtext ?? `Endorsed by ${endorserName}`}</Text>
          ) : null}
        </>
      ) : (
        <>
          <StarsDisplay average={ratingAverage} count={ratingCount} />
          <Text style={styles.subtext}>
            {subtext ?? historySubtext(completionRate, jobCount)}
          </Text>
        </>
      )}
    </View>
  );
}

/**
 * "92% completion · 12 jobs" (1.18). With no completion record yet (completionRate null) only the
 * job count is shown, rather than "null% completion".
 */
function historySubtext(completionRate, jobCount) {
  const jobs = `${jobCount ?? 0} job${jobCount === 1 ? "" : "s"}`;
  return completionRate == null ? jobs : `${completionRate}% completion · ${jobs}`;
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.input,
    backgroundColor: colors.bg.default,
  },
  headline: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  headlineText: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  subtext: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
});
