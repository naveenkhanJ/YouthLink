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
 * Discrepancy RESOLVED 2026-09-29: the real component's own built-in
 * error line renders at `mobile/caption` (12px), confirmed directly from
 * Figma. The standalone `Feedback/FieldError` component is `mobile/secondary`
 * (14px) per its own real component — those are two different sizes for
 * two different contexts. This file now renders its own inline 12px error
 * to match the real TextField, rather than composing the 14px FieldError.
 * Callers who want the standalone error style still use FieldError directly.
 */
import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { colors, spacing, radius, typography } from "../theme/tokens";
import EyeIcon from "./EyeIcon";

/**
 * @param {string} label
 * @param {string} value
 * @param {(text: string) => void} onChangeText
 * @param {string|boolean} [error] - Truthy puts the field in State=Error (red border). The
 *   message itself is drawn by a separate Feedback/FieldError beneath the field, per
 *   design-system.md §8 ("hide the field's own built-in error line"); pass
 *   `showErrorLine` only where no FieldError is composed under it.
 * @param {() => void} [onBlur] - Called when the field loses focus (e.g. check an email on exit).
 * @param {boolean} [showErrorLine] - Draw `error` (when it is a string) inside the field.
 * @param {number} [maxLength] - Hard cap on what can be typed.
 * @param {boolean} [showCounter] - Opt in to the "N / cap" caption, right-aligned beneath the field
 *   from 90% of `maxLength` (prototype 1.4cnt, "90 / 100"). Only the legal-name fields draw it;
 *   a NIC, password or email field has a cap but no counter.
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
  showErrorLine = false,
  onBlur,
  disabled = false,
  secureTextEntry = false,
  placeholder,
  keyboardType = "default",
  autoCapitalize = "none",
  maxLength,
  showCounter = false,
}) {
  const [focused, setFocused] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const currentLength = value ? value.length : 0;
  // Prototype 1.4cnt draws a right-aligned "90 / 100" caption once the entry is at 90% of
  // the cap (FR-ACC-01 E3: input is blocked at the cap, with the count shown as it nears).
  const showCount = showCounter && Boolean(maxLength) && !disabled && currentLength >= maxLength * 0.9;
  const errorText = !disabled && showErrorLine && typeof error === "string" ? error : "";

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
          onBlur={(event) => {
            setFocused(false);
            if (onBlur) onBlur(event);
          }}
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
      {errorText || showCount ? (
        <View style={styles.footerRow}>
          <Text style={styles.errorText}>{errorText}</Text>
          {showCount ? (
            <Text style={styles.charCount}>
              {currentLength} / {maxLength}
            </Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  // No outer margin: the Figma component is 328 x 72 (label 20 + gap 4 + input 48); the
  // space between fields is the screen's own gap (8 or 16 depending on the screen).
  container: {},
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
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.xs, // Figma: gap 4 under the field
  },
  errorText: {
    ...typography.caption,
    color: colors.state.danger,
    flex: 1,
  },
  charCount: {
    ...typography.caption,
    color: colors.text.secondary,
    marginLeft: spacing.sm,
  },
});
