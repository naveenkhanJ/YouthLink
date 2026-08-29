/**
 * A single-select group of chips — FR-POST.
 *
 * Used for every closed set on the posting form: task category (FR-POST-02),
 * arrangement type, pay kind and rate unit (FR-POST-04), and posting-as type.
 *
 * Chips rather than a native picker, deliberately: FR-POST-02 requires that
 * "only the seven allow-listed categories are selectable, with no free-text
 * option", and a visible set of chips makes that true and inspectable on
 * screen rather than hidden behind a dropdown the reviewer has to open.
 */
import { View, Text, Pressable, StyleSheet } from "react-native";
import { colors, spacing, radius, typography } from "../theme";

export default function OptionGroup({ label, options, value, onChange, error, hint }) {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.options}>
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <Pressable
              key={option.value}
              onPress={() => onChange(option.value)}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityLabel={option.label}
              style={[styles.chip, selected && styles.chipSelected, error && styles.chipError]}
            >
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {hint && !error ? <Text style={styles.hint}>{hint}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.lg },
  label: {
    fontSize: typography.label.fontSize,
    fontWeight: typography.label.fontWeight,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  options: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
  },
  chipSelected: { borderColor: colors.primary, backgroundColor: colors.primaryTint },
  chipError: { borderColor: colors.danger },
  chipText: { fontSize: typography.caption.fontSize, color: colors.textPrimary },
  chipTextSelected: { color: colors.primary, fontWeight: "700" },
  hint: { fontSize: typography.caption.fontSize, color: colors.textPlaceholder, marginTop: spacing.xs },
  error: { fontSize: typography.caption.fontSize, color: colors.danger, marginTop: spacing.xs },
});
