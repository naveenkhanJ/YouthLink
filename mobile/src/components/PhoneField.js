/**
 * Input/PhoneField — real Figma component (node 14:24, "Components /
 * Inputs" page, found 2026-09-28). New in the shared kit — the only
 * existing version was a one-off in `screens/account/components/`, built
 * against that module's own (confirmed-wrong) `theme.js`.
 *
 * Real structural fix vs. the old local version: the "+94" prefix sits in
 * its own solid `bg/subtle` box directly against the value text — there
 * is no divider line between them. The old version drew a thin vertical
 * divider instead, which doesn't exist in the real component. Row height
 * is 48px, matching every other Input/* field, not the 54px the old
 * version used.
 *
 * Accepts and returns local digits only (no "+94") — the same design the
 * old version had, kept because it's still correct: hardcoding the
 * country code removes the most common signup/login typo, and the caller
 * (not this component) is responsible for prefixing "+94" before handing
 * the value to Firebase.
 */
import { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { colors, spacing, radius, typography } from "../theme/tokens";

const COUNTRY_CODE = "+94";
const LOCAL_DIGITS = 9;

/**
 * @param {string} value - Local digits only, e.g. "771234567".
 * @param {(digits: string) => void} onChangeText
 * @param {string} [error]
 * @param {boolean} [editable]
 */
export default function PhoneField({ value, onChangeText, error, editable = true, label = "Phone number" }) {
  function handleChange(text) {
    onChangeText(text.replace(/[^0-9]/g, "").slice(0, LOCAL_DIGITS));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.row,
          error && styles.rowError,
          !editable && styles.rowDisabled,
        ]}
      >
        <View style={styles.prefix}>
          <Text style={styles.prefixText}>{COUNTRY_CODE}</Text>
        </View>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={handleChange}
          editable={editable}
          placeholder="7X XXX XXXX"
          placeholderTextColor={colors.text.secondary}
          keyboardType="number-pad"
          maxLength={LOCAL_DIGITS}
          accessibilityLabel="Phone number"
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  label: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  row: {
    flexDirection: "row",
    alignItems: "stretch",
    height: 48,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: radius.input,
    backgroundColor: colors.bg.default,
    overflow: "hidden",
  },
  rowFocused: {
    borderColor: colors.brand.primary,
    borderWidth: 2,
  },
  rowError: {
    borderColor: colors.border.error,
  },
  rowDisabled: {
    backgroundColor: colors.bg.subtle,
  },
  prefix: {
    backgroundColor: colors.bg.subtle,
    justifyContent: "center",
    paddingHorizontal: spacing.md,
  },
  prefixText: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.text.primary,
    paddingLeft: spacing.md,
  },
  errorText: {
    ...typography.caption,
    color: colors.state.danger,
  },
});
