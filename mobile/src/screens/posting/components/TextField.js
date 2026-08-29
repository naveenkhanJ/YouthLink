/**
 * Labelled text input for the Gig Posting module — FR-POST.
 *
 * maxLength is passed straight to TextInput, which is what makes FR-POST-01's
 * "input is blocked or truncated at the cap" true at the point of typing
 * rather than only at submit. The counter makes the cap visible before it's
 * reached.
 */
import { View, Text, TextInput, StyleSheet } from "react-native";
import { colors, spacing, radius, typography } from "../theme";

export default function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  hint,
  multiline,
  maxLength,
  ...rest
}) {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textPlaceholder}
        multiline={multiline}
        maxLength={maxLength}
        accessibilityLabel={label}
        style={[styles.input, multiline && styles.multiline, error && styles.inputError]}
        {...rest}
      />
      <View style={styles.footer}>
        <Text style={styles.hint}>{error ? "" : hint || ""}</Text>
        {maxLength ? (
          <Text style={styles.counter}>
            {(value || "").length}/{maxLength}
          </Text>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.md },
  label: {
    fontSize: typography.label.fontSize,
    fontWeight: typography.label.fontWeight,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.body.fontSize,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
  },
  multiline: { minHeight: 100, textAlignVertical: "top" },
  inputError: { borderColor: colors.danger },
  footer: { flexDirection: "row", alignItems: "center", marginTop: spacing.xs },
  hint: { flex: 1, fontSize: typography.caption.fontSize, color: colors.textPlaceholder },
  counter: { fontSize: typography.caption.fontSize, color: colors.textPlaceholder },
  error: {
    fontSize: typography.caption.fontSize,
    color: colors.danger,
    marginTop: spacing.xs,
  },
});
