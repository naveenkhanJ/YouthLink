/**
 * Input/TextField — docs/prototype/design-system.md §5.
 *
 * State: Default | Focused | Filled | Error | Disabled (computed from props,
 * not passed explicitly — Focused/Filled are local interaction state, Error
 * and Disabled are the caller's). Type: Text | Secure (secureTextEntry).
 * A typed value keeps color/text/primary even in the Error state — only the
 * border changes — per §8's composed-error rule.
 *
 * Secure fields get the show/hide EyeIcon toggle for free (ported from the
 * account-module version — this was a real, previously-missing feature: a
 * password typo was undetectable until the next login failed).
 */
import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { colors, spacing, radius, typography } from "../theme/tokens";
import EyeIcon from "./EyeIcon";
import FieldError from "./FieldError";

/**
 * @param {string} label
 * @param {string} value
 * @param {(text: string) => void} onChangeText
 * @param {string} [error] - Field-level error message; also switches State to Error.
 * @param {boolean} [disabled]
 * @param {boolean} [secureTextEntry]
 * @param {string} [placeholder]
 * @param {string} [keyboardType]
 * @param {string} [autoCapitalize]
 * @param {number} [maxLength]
 */
export default function TextField({
  label,
  value,
  onChangeText,
  error,
  disabled = false,
  secureTextEntry = false,
  placeholder,
  keyboardType = "default",
  autoCapitalize = "none",
  maxLength,
}) {
  const [focused, setFocused] = useState(false);
  const [revealed, setRevealed] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.inputRow,
          focused && !disabled && styles.inputFocused,
          error && !disabled && styles.inputError,
          disabled && styles.inputDisabled,
        ]}
      >
        <TextInput
          style={[styles.input, disabled && styles.inputTextDisabled]}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          editable={!disabled}
          secureTextEntry={secureTextEntry && !revealed}
          placeholder={placeholder}
          placeholderTextColor={colors.text.secondary}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          maxLength={maxLength}
          accessibilityLabel={label}
        />
        {secureTextEntry ? (
          <Pressable
            onPress={() => setRevealed((prev) => !prev)}
            style={styles.toggleButton}
            hitSlop={spacing.sm}
            accessibilityRole="button"
            accessibilityLabel={revealed ? "Hide password" : "Show password"}
          >
            <EyeIcon revealed={revealed} />
          </Pressable>
        ) : null}
      </View>
      <FieldError message={!disabled ? error : null} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.sectionLabel,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: radius.input,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.bg.default,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.text.primary,
    paddingVertical: spacing.sm,
  },
  inputFocused: {
    borderColor: colors.brand.primary,
    borderWidth: 2,
  },
  inputError: {
    borderColor: colors.border.error,
  },
  inputDisabled: {
    backgroundColor: colors.bg.subtle,
  },
  inputTextDisabled: {
    color: colors.text.secondary,
  },
  toggleButton: {
    marginLeft: spacing.sm,
  },
});
