/**
 * One tappable row of the Settings screen (prototype 1.10 `row-*`): 328×48, padding 12/0,
 * gap 12 — a label that fills the row (mobile/body), an optional current value on the right
 * (mobile/secondary, text/secondary) and a 6×12 chevron (stroke text/secondary 1.8).
 * "Delete account" draws its label in state/danger.
 *
 * Local to Account Management: no other screen in the prototype uses this row.
 */
import { Pressable, Text, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";
import { colors, spacing, typography } from "../../../theme/tokens";

/**
 * @param {string} label
 * @param {string} [value] - The current value shown before the chevron.
 * @param {boolean} [danger] - Draw the label in state/danger.
 * @param {() => void} onPress
 */
export default function SettingsRow({ label, value, danger = false, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.row} accessibilityRole="button">
      <Text style={[styles.label, danger && styles.danger]}>{label}</Text>
      {value ? (
        <Text style={styles.value} numberOfLines={1}>
          {value}
        </Text>
      ) : null}
      <Svg width={6} height={12} viewBox="0 0 6 12" fill="none">
        <Path
          d="M1 1L5 6L1 11"
          stroke={colors.text.secondary}
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  label: {
    flex: 1,
    ...typography.body,
    color: colors.text.primary,
  },
  danger: {
    color: colors.state.danger,
  },
  value: {
    flexShrink: 1,
    ...typography.secondary,
    color: colors.text.secondary,
  },
});
