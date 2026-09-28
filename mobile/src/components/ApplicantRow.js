/**
 * Display/ApplicantRow — real Figma component (node 40:49, "Components /
 * Display" page, found 2026-09-28). New — nothing existed for this
 * before. Applicant pool row (4.5).
 *
 * EXACTLY FR-APPLY-05's fields, nothing else, per the component's own
 * note: display name · phone-verified badge · rating avg + completion
 * rate OR "New to YouthLink" (+ an endorsed badge only if endorsed AND
 * zero-history) · the applicant's own note · Select/Decline. No
 * individual dispute history ever renders here — aggregate only.
 *
 * Three tiers (FR-APPLY-04's own pool sort, not this component's
 * concern to compute): "history" shows the rating/completion trust row,
 * with an optional endorsed badge alongside it; "endorsedNew" and "new"
 * both show "New to YouthLink" — "endorsedNew" additionally shows the
 * endorsed badge, "new" doesn't.
 */
import { Text, View, StyleSheet } from "react-native";
import { colors, spacing, radius, elevation, typography } from "../theme/tokens";
import Badge from "./Badge";
import ListRowAction from "./ListRowAction";

/**
 * @param {"history"|"endorsedNew"|"new"} tier
 * @param {string} name
 * @param {number} [ratingAverage] - "history" tier only.
 * @param {number} [ratingCount] - "history" tier only.
 * @param {number} [completionRate] - "history" tier only, 0-100.
 * @param {boolean} [endorsed] - Shows the endorsed badge on "history"/"endorsedNew" tiers.
 * @param {string} note
 * @param {() => void} onSelect
 * @param {() => void} onDecline
 */
export default function ApplicantRow({
  tier,
  name,
  ratingAverage,
  ratingCount,
  completionRate,
  endorsed = false,
  note,
  onSelect,
  onDecline,
}) {
  const isHistory = tier === "history";
  return (
    <View style={[styles.card, elevation.card]}>
      <View style={styles.nameRow}>
        <Text style={styles.name}>{name}</Text>
        <Badge family="verified" />
      </View>
      <View style={isHistory ? styles.trustRowHistory : styles.trustRowNew}>
        {isHistory ? (
          <Text style={styles.trustText}>
            {ratingAverage.toFixed(1)} from {ratingCount} ratings · {completionRate}% completion
          </Text>
        ) : (
          <Text style={styles.trustText}>New to YouthLink</Text>
        )}
        {(isHistory || tier === "endorsedNew") && endorsed ? <Badge family="endorsed" /> : null}
      </View>
      <Text style={styles.note}>{note}</Text>
      <ListRowAction onSelect={onSelect} onDecline={onDecline} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.input,
    backgroundColor: colors.bg.default,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  name: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  trustRowHistory: {
    gap: 6,
  },
  trustRowNew: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  trustText: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  note: {
    ...typography.secondary,
    color: colors.text.primary,
  },
});
