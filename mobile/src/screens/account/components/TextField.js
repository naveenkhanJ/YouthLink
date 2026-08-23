/**
 * Labeled text input with an optional field-level error — Account
 * Management module only. The border/fill/error treatment here is
 * extrapolated, not observed in the source prototypes (which had no form
 * fields) — see .worklog/progress.md's design-system section.
 */
import { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { colors, spacing, radius, typography } from "../theme";

/**
 * @param {string} label
 * @param {string} value
 * @param {(text: string) => void} onChangeText
 * @param {string} [error] - Field-level error message, e.g. from the API's `fields`.
 * @param {boolean} [secureTextEntry]
 * @param {string} [placeholder]
 * @param {string} [keyboardType] - React Native TextInput keyboardType.
 * @param {string} [autoCapitalize]
 * @param {number} [maxLength]
 */
export default function TextField({
  label,
  value,
  onChangeText,
  error,
  secureTextEntry = false,
  placeholder,
  keyboardType = "default",
  autoCapitalize = "none",
  maxLength,
}) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          focused && styles.inputFocused,
          error && styles.inputError,
        ]}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        placeholderTextColor={colors.textPlaceholder}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        maxLength={maxLength}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.label.fontSize,
    fontWeight: typography.label.fontWeight,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  input: {
    minHeight: 54,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    fontSize: typography.body.fontSize,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
  },
  inputFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  inputError: {
    borderColor: colors.danger,
  },
  errorText: {
    marginTop: spacing.xs,
    fontSize: typography.caption.fontSize,
    color: colors.danger,
  },
});
