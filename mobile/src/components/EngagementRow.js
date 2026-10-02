/**
 * Display/EngagementRow — real Figma component (node 40:65, "Components
 * / Display" page, found 2026-09-28). New — nothing existed for this
 * before. Engagements list row (5.1, FR-ENG-14/A14).
 *
 * Real behavioural rule, not just layout, from the component's own
 * description: an engagement that requires something from the viewer
 * MUST surface the next required action as its own line — never just a
 * status label with nothing else. `actionLabel` is that line
 * ("Enter arrival code" is the real component's own sample; other real
 * action kinds per its description are re-confirmation, a cancellation
 * response, and an unclaimed rating) — omit it only when the engagement
 * genuinely needs nothing from the viewer right now.
 */
import { Pressable, Text, View, StyleSheet } from "react-native";
import { colors, spacing, radius, elevation, typography } from "../theme/tokens";
import Badge from "./Badge";

/**
 * @param {string} counterpartyName
 * @param {"active"|"completed"|"cancelled"|"ended"|"disputed"} status
 * @param {string} postingTitle
 * @param {string} [actionLabel] - e.g. "Enter arrival code"; omit if nothing is required.
 * @param {() => void} [onPressAction]
 */
export default function EngagementRow({ counterpartyName, status, postingTitle, actionLabel, onPressAction }) {
  return (
    <View style={[styles.card, elevation.card]}>
      <View style={styles.topRow}>
        <Text style={styles.name}>{counterpartyName}</Text>
        <Badge family="engagement" value={status} />
      </View>
      <Text style={styles.posting}>{postingTitle}</Text>
      {actionLabel ? (
        <Pressable onPress={onPressAction} accessibilityRole="button">
          <Text style={styles.action}>{actionLabel}</Text>
        </Pressable>
      ) : null}
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
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  name: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  posting: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  action: {
    ...typography.bodyMedium,
    color: colors.brand.primary,
  },
});
