/**
 * Display/BottomSheet — real Figma component (node 112:43, "Components /
 * Display" page, found 2026-09-28). New — nothing existed for this
 * before. Sort/picker sheet (3.6 sort, and other pickers reusing the
 * same shape with different option rows).
 *
 * Real default from the component's own note: "Urgent first" is
 * FR-DISC-05's MANDATED default sort — not just this sample's first
 * option, an actual product rule. The scrim (dimmed backdrop) is at
 * screen level, same convention as `ConfirmDialog` — this is only the
 * sheet card itself.
 */
import { Pressable, Text, View, StyleSheet } from "react-native";
import { colors, spacing, radius, elevation, typography } from "../theme/tokens";

/**
 * @param {string} title - e.g. "Sort by".
 * @param {{ value: string, label: string }[]} options
 * @param {string} value - The selected option's value.
 * @param {(value: string) => void} onChange
 */
export default function BottomSheet({ title, options, value, onChange }) {
  return (
    <View style={[styles.sheet, elevation.sheet]}>
      <View style={styles.handle} />
      <Text style={styles.title}>{title}</Text>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[styles.option, selected && styles.optionSelected]}
            accessibilityRole="button"
            accessibilityState={{ selected }}
          >
            <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    width: "100%",
    alignItems: "center",
    gap: 4,
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: spacing.lg,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    backgroundColor: colors.bg.default,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 999,
    backgroundColor: colors.border.default,
  },
  title: {
    ...typography.title,
    color: colors.text.primary,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  option: {
    width: "100%",
    padding: spacing.md,
    borderRadius: radius.input,
  },
  optionSelected: {
    backgroundColor: colors.bg.subtle,
  },
  optionLabel: {
    ...typography.body,
    color: colors.text.primary,
  },
  optionLabelSelected: {
    color: colors.brand.primary,
  },
});
