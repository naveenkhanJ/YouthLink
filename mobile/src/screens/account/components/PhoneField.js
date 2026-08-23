/**
 * Phone number input with a fixed "+94" prefix — Account Management
 * module only. YouthLink's whole target market is Sri Lanka
 * (product-overview.md §2), so hardcoding the country code removes the
 * most common signup/login typo (a missing or malformed "+94") instead
 * of asking the user to type it themselves every time. Accepts and
 * returns digits only — the caller is responsible for prefixing "+94"
 * before handing the value to Firebase (see usePhoneVerification.js).
 */
import { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { colors, spacing, radius, typography } from "../theme";
import { COUNTRY_CODE, LOCAL_DIGITS } from "../phoneFormat";

/**
 * @param {string} value - Local digits only, no country code (e.g. "771234567").
 * @param {(digits: string) => void} onChangeText
 * @param {string} [error]
 * @param {boolean} [editable]
 */
export default function PhoneField({ value, onChangeText, error, editable = true }) {
  const [focused, setFocused] = useState(false);

  function handleChange(text) {
    onChangeText(text.replace(/[^0-9]/g, "").slice(0, LOCAL_DIGITS));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Phone number</Text>
      <View
        style={[
          styles.row,
          focused && styles.rowFocused,
          error && styles.rowError,
          !editable && styles.rowDisabled,
        ]}
      >
        <Text style={styles.prefix}>{COUNTRY_CODE}</Text>
        <View style={styles.divider} />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          editable={editable}
          placeholder="771234567"
          placeholderTextColor={colors.textPlaceholder}
          keyboardType="number-pad"
          maxLength={LOCAL_DIGITS}
        />
      </View>
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 54,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
  },
  rowFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  rowError: {
    borderColor: colors.danger,
  },
  rowDisabled: {
    backgroundColor: colors.surfaceMuted,
  },
  prefix: {
    fontSize: typography.body.fontSize,
    color: colors.textPrimary,
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: colors.border,
    marginHorizontal: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: typography.body.fontSize,
    color: colors.textPrimary,
    padding: 0,
  },
  errorText: {
    marginTop: spacing.xs,
    fontSize: typography.caption.fontSize,
    color: colors.danger,
  },
});
