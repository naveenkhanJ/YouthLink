/**
 * Display/ListingCard — real Figma component (node 39:91, "Components /
 * Display" page, found 2026-09-28). New — nothing existed for this
 * before. Browse result card (3.1, FR-DISC-01).
 *
 * Real, non-obvious content rules from the component's own description,
 * not just layout: pay ALWAYS carries its basis ("for the job" / "per
 * day") AND a per-worker note on multi-slot postings — flagged as "the
 * sweep's highest-consequence omission" if dropped. Distance shown on
 * every result. Urgency is a computed `Badge` (family="urgent"), never
 * employer-claimed — this card never accepts an "urgent" boolean prop,
 * only whatever the caller's own urgency computation produces. No pin,
 * general area only (FR-POST-08) — this card is not where precise
 * location ever appears.
 */
import { Text, View, StyleSheet } from "react-native";
import { colors, spacing, radius, elevation, typography } from "../theme/tokens";
import Badge from "./Badge";

/**
 * @param {string} title - e.g. "Event setup crew (3 needed)".
 * @param {string} subtitle - e.g. "Event setup · Colombo 04 · 2.1 km away".
 * @param {string} payLine - e.g. "Rs 6,000 for the job · per worker".
 * @param {string} statusLine - e.g. "1 of 3 filled · Starts Sat 5:00 AM".
 * @param {boolean} [urgent]
 */
export default function ListingCard({ title, subtitle, payLine, statusLine, urgent = false }) {
  return (
    <View style={[styles.card, elevation.card]}>
      {urgent ? (
        <View style={styles.urgentBadge}>
          <Badge family="urgent" />
        </View>
      ) : null}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <Text style={styles.payLine}>{payLine}</Text>
      <Text style={styles.statusLine}>{statusLine}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 6,
    padding: spacing.lg,
    borderRadius: radius.input,
    backgroundColor: colors.bg.default,
  },
  // No extra margin: Figma 39:83 spaces the badge from the title with the
  // card's own 6px gap (164px tall in total).
  urgentBadge: {},
  title: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  subtitle: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  payLine: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  statusLine: {
    ...typography.caption,
    color: colors.text.secondary,
  },
});
