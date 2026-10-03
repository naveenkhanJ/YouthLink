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
 * @param {boolean} [touch] - Select kind only: the 44-tall instance M3's Browse and Filters draw
 *   (3.1, 3.5 — pad 12/14, selected 10/14, a 44dp touch target) instead of the component's 32.
 */
export default function Chip({ label, kind = "select", selected = false, onPress, touch = false }) {
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
      style={[
        styles.base,
        selected ? styles.selectSelected : styles.selectDefault,
        touch ? (selected ? styles.touchSelected : styles.touchDefault) : null,
      ]}
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
  // Default and display chips have a 1px stroke INSIDE a 32px pill in Figma;
  // RN's border is outside the padding, so they subtract it (selected has none).
  selectDefault: {
    backgroundColor: colors.bg.default,
    borderWidth: 1,
    borderColor: colors.border.default,
    paddingHorizontal: 13,
    paddingVertical: 5,
  },
  selectSelected: {
    backgroundColor: colors.brand.primary,
  },
  // The 44-tall instances (M3 3.1/3.5): default pad 12 inside its 1px stroke, selected pad 10 around
  // its larger body-medium label — both come out 44 tall.
  touchDefault: {
    paddingVertical: 11,
  },
  touchSelected: {
    paddingVertical: 10,
  },
  displayChip: {
    paddingHorizontal: 13,
    paddingVertical: 5,
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
