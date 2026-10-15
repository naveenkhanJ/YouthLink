/**
 * Action/ListRowAction — real Figma component (node 34:29, "Components /
 * Actions" page, found 2026-09-28). New — a distinct, smaller pair from
 * `Action/Button`: 14px regular label (not 16px medium), height 48,
 * px-16 (not px-24). Select/Decline pair on applicant rows (4.5) —
 * Decline is styled neutral, not destructive, per the component's own
 * note: "it is ordinary flow," not a warning-worthy action. Both act
 * only on Pending applications.
 */
import { Pressable, Text, View, StyleSheet } from "react-native";
import { colors, spacing, radius, pressed } from "../theme/tokens";

/**
 * @param {() => void} onSelect
 * @param {() => void} onDecline
 * @param {string} [selectLabel] - Defaults to "Select".
 * @param {string} [declineLabel] - Defaults to "Decline".
 */
export default function ListRowAction({ onSelect, onDecline, selectLabel = "Select", declineLabel = "Decline" }) {
  return (
    <View style={styles.row}>
      <Pressable onPress={onSelect} style={({ pressed: isPressed }) => [styles.button, styles.select, isPressed && styles.pressedFill]} accessibilityRole="button">
        <Text style={styles.selectLabel}>{selectLabel}</Text>
      </Pressable>
      <Pressable onPress={onDecline} style={({ pressed: isPressed }) => [styles.button, styles.decline, isPressed && styles.pressedSurface]} accessibilityRole="button">
        <Text style={styles.declineLabel}>{declineLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  // While a finger is on it (theme/tokens.js `pressed`): follows the rounded corners.
  pressedSurface: { backgroundColor: pressed.surface },
  pressedFill: { opacity: pressed.fillOpacity },
  row: {
    flexDirection: "row",
    gap: spacing.md,
  },
  button: {
    height: 48,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.input,
    alignItems: "center",
    justifyContent: "center",
  },
  select: {
    backgroundColor: colors.brand.primary,
  },
  decline: {
    backgroundColor: colors.bg.default,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  selectLabel: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.text.inverse,
  },
  declineLabel: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.text.primary,
  },
});
