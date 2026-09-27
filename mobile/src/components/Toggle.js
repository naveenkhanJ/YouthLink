/**
 * Input/Toggle — real Figma component (node 28:59, "Components / Inputs"
 * page, found 2026-09-28). New — nothing existed for this before. Built
 * on RN's own `Switch` rather than a hand-drawn track — a pill track with
 * a circular thumb is exactly what `Switch` already renders, recoloured
 * to the real tokens (`bg/subtle` off-track, `brand/primary` on-track,
 * white thumb).
 *
 * G9 rule (real component's own note): the `label` must describe the
 * OUTCOME, never the raw field name — the two real rows are "Notify me
 * about urgent gigs nearby" (default off) and "Notify me about new gigs
 * nearby" (an inverted field, default on). Two identical-looking toggles
 * can behave oppositely; that's the caller's copy to get right, not
 * something this component can enforce.
 */
import { Platform, Switch, Text, View, StyleSheet } from "react-native";
import { colors, spacing, typography } from "../theme/tokens";

/**
 * @param {string} label
 * @param {boolean} value
 * @param {(value: boolean) => void} onValueChange
 */
export default function Toggle({ label, value, onValueChange }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.bg.subtle, true: colors.brand.primary }}
        thumbColor={colors.bg.default}
        ios_backgroundColor={colors.bg.subtle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
    paddingVertical: spacing.sm,
  },
  label: {
    flex: 1,
    ...typography.body,
    color: colors.text.primary,
  },
});
