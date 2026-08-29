import { View, Text, TextInput, StyleSheet } from "react-native";
import { colors, spacing, radius, typography } from "../theme";

export default function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  error,
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
        style={[
          styles.input,
          multiline && styles.multiline,
          error && styles.inputError,
        ]}
        {...rest}
      />
      {maxLength ? (
        <Text style={styles.counter}>
          {(value || "").length}/{maxLength}
        </Text>
      ) : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.md },
  label: {
    fontSize: typography.caption.fontSize,
    fontWeight: typography.caption.fontWeight,
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
  multiline: {
    minHeight: 90,
    textAlignVertical: "top",
  },
  inputError: {
    borderColor: colors.danger,
  },
  counter: {
    fontSize: typography.caption.fontSize,
    color: colors.textPlaceholder,
    textAlign: "right",
    marginTop: spacing.xs,
  },
  error: {
    fontSize: typography.caption.fontSize,
    color: colors.danger,
    marginTop: spacing.xs,
  },
});
