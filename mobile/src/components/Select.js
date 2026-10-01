/**
 * Input/Select — real Figma component (node 28:43, "Components / Inputs"
 * page, found 2026-09-28). New — nothing existed for this before.
 *
 * Category (2.2) / sort (3.6) picker row. The real "Open" state draws its
 * options list pushed inline below the field, not as a floating overlay —
 * built the same way (local open/closed state, options rendered inline),
 * rather than an absolutely-positioned dropdown, since that's what the
 * actual component shows.
 */
import { useState } from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";
import { colors, spacing, radius, typography } from "../theme/tokens";

/**
 * @param {string} label
 * @param {{ value: string, label: string }[]} options
 * @param {string} [value] - The selected option's value.
 * @param {(value: string) => void} onChange
 * @param {string} [placeholder] - Defaults to "Select an option".
 */
export default function Select({ label, options, value, onChange, placeholder = "Select an option" }) {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((o) => o.value === value);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        onPress={() => setOpen((prev) => !prev)}
        style={styles.field}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ expanded: open }}
      >
        <Text style={[styles.value, selectedOption && styles.valueFilled]}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        {/* Figma 28:13 / 28:23: a 10 x 5 chevron, stroke text/secondary 1.8; the
            open state is the same path flipped. */}
        <Svg width={10} height={5} viewBox="0 0 10 5" fill="none" overflow="visible">
          <Path
            d={open ? "M0 5L5 0L10 5" : "M0 0L5 5L10 0"}
            stroke={colors.text.secondary}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </Pressable>
      {open ? (
        <View style={styles.options}>
          {options.map((option) => (
            <Pressable
              key={option.value}
              onPress={() => {
                onChange(option.value);
                setOpen(false);
              }}
              style={[styles.option, option.value === value && styles.optionSelected]}
              accessibilityRole="button"
            >
              <Text style={styles.optionLabel}>{option.label}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // 6px — a literal in the real component, not a named spacing token.
    gap: 6,
  },
  label: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.md - 1, // Figma pads 12 with the 1px stroke inside the 48px field
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: radius.input,
    backgroundColor: colors.bg.default,
  },
  value: {
    ...typography.body,
    color: colors.text.secondary,
  },
  valueFilled: {
    color: colors.text.primary,
  },
  options: {
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: radius.input,
    backgroundColor: colors.bg.default,
    paddingVertical: spacing.xs - 1, // Figma pads 4 with the stroke inside (316px for 7 options)
    overflow: "hidden",
  },
  option: {
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  optionSelected: {
    backgroundColor: colors.bg.subtle,
  },
  optionLabel: {
    ...typography.body,
    color: colors.text.primary,
  },
});
