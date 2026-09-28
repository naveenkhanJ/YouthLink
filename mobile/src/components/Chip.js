/**
 * Input/Chip — real Figma component (node 28:50, "Components / Inputs"
 * page, found 2026-09-28). New — nothing existed for this before.
 *
 * Kind=Select (attribute pick / filter toggle, 8.4 / 3.5) vs Kind=Display
 * (endorsed-purple, read-only — M8 constraint: ONLY selected attributes
 * ever render, never a greyed-out "not attested" chip, so there is no
 * Display+Selected variant to build). Select-selected has a genuinely
 * different, larger label size (`body-medium`, 16px) than Select-default
 * (`secondary`, 14px) in the real component — not a guess, both sizes are
 * drawn explicitly.
 */
import { Pressable, Text, StyleSheet } from "react-native";
import { colors, spacing, radius, typography } from "../theme/tokens";

/**
 * @param {string} label
 * @param {"select"|"display"} [kind]
 * @param {boolean} [selected] - Select kind only; ignored for Display.
 * @param {() => void} [onPress] - Select kind only.
 */
export default function Chip({ label, kind = "select", selected = false, onPress }) {
  if (kind === "display") {
    return (
      <Text style={[styles.base, styles.displayChip]} accessibilityRole="text">
        {label}
      </Text>
    );
  }
  return (
    <Pressable
      onPress={onPress}
      style={[styles.base, selected ? styles.selectSelected : styles.selectDefault]}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      <Text style={selected ? styles.labelSelected : styles.labelDefault}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
    // 14/6 — literals in the real component, not named spacing tokens.
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  selectDefault: {
    backgroundColor: colors.bg.default,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  selectSelected: {
    backgroundColor: colors.brand.primary,
  },
  displayChip: {
    borderWidth: 1,
    borderColor: colors.badge.endorsed,
    color: colors.badge.endorsed,
    ...typography.secondary,
  },
  labelDefault: {
    ...typography.secondary,
    color: colors.text.primary,
  },
  labelSelected: {
    ...typography.bodyMedium,
    color: colors.text.inverse,
  },
});
