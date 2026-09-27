/**
 * Display/StarsDisplay — real Figma component (node 39:69, "Components /
 * Display" page, found 2026-09-28). New — nothing existed for this
 * before. Average rating display (1.18, 4.5, 6.3): one filled star glyph
 * (`color/badge/rating`, the same token `StarInput` uses), the average to
 * one decimal, and the rating count spelled out in text — per the
 * component's own N-rule, the count is the non-colour signal, never
 * implied by the star alone.
 *
 * DATA RULE from the real component, not a UI concern this file can
 * enforce: the average must exclude Admin-removed ratings (filter
 * `removedAt: null`) before it ever reaches this component — that's the
 * caller's aggregation query to get right, not something this
 * presentational component can check.
 */
import { Text, View, StyleSheet } from "react-native";
import { colors, typography } from "../theme/tokens";

/**
 * @param {number} average - e.g. 4.6.
 * @param {number} count - e.g. 12.
 */
export default function StarsDisplay({ average, count }) {
  return (
    <View style={styles.row}>
      <Text style={styles.star}>★</Text>
      <Text style={styles.average}>{average.toFixed(1)}</Text>
      <Text style={styles.count}>from {count} rating{count === 1 ? "" : "s"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  star: {
    fontSize: 16,
    color: colors.badge.rating,
  },
  average: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  count: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
});
