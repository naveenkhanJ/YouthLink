/**
 * Input/TextField — real Figma component (node 12:59, "Components /
 * Inputs" page, found 2026-09-28; this file was previously built from
 * `design-system.md`'s text description only).
 *
 * State: Default | Focused | Filled | Error | Disabled (computed from props,
 * not passed explicitly — Focused/Filled are local interaction state, Error
 * and Disabled are the caller's). Type: Text | Secure (secureTextEntry).
 * A typed value keeps color/text/primary even in the Error state — only the
 * border changes — per §8's composed-error rule. Disabled greys the value
 * text itself (text/secondary), not just the field chrome — confirmed from
 * the real component, where a Disabled+filled field still shows its value
 * but in the same grey as a placeholder.
 *
 * Secure fields get the show/hide EyeIcon toggle for free (ported from the
 * account-module version — this was a real, previously-missing feature: a
 * password typo was undetectable until the next login failed).
 *
 * Open discrepancy, not resolved here: the real component's own built-in
 * error line renders at `mobile/caption` (12px), but its own usage note
 * says it "matches TextField's inline error grammar" with the standalone
 * `Feedback/FieldError` component — which is confirmed `mobile/secondary`
 * (14px). This file composes the real `FieldError.js` (14px) rather than
 * duplicate the possibly-stale 12px hand-drawn line, since FieldError is
 * the one explicitly checked against its own real component.
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
    ...typography.secondary,
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
    paddingHorizontal: spacing.md,
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
