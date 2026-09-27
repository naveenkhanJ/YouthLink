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
        <Text style={styles.chevron}>{open ? "▲" : "▼"}</Text>
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
    padding: spacing.md,
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
  chevron: {
    fontSize: 10,
    color: colors.text.secondary,
  },
  options: {
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: radius.input,
    backgroundColor: colors.bg.default,
    paddingVertical: spacing.xs,
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
