/**
 * Button for the Gig Posting module's screens — FR-POST.
 *
 * Same shape and variants as the Applying & Selection module's Button, so the
 * two slices look like one app. Module-scoped rather than shared for the
 * reason recorded in this module's theme.js.
 */
import { Pressable, Text, StyleSheet, ActivityIndicator } from "react-native";
import { colors, spacing, radius, typography } from "../theme";

export default function Button({ title, onPress, loading, disabled, variant = "primary" }) {
  const isDisabled = disabled || loading;
  const isSecondary = variant === "secondary";
  const isDanger = variant === "danger";

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: Boolean(isDisabled), busy: Boolean(loading) }}
      style={[
        styles.base,
        isSecondary && styles.secondary,
        isDanger && styles.danger,
        isDisabled && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isSecondary ? colors.primary : colors.surface} />
      ) : (
        <Text style={[styles.label, isSecondary && styles.secondaryLabel]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.md,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  danger: { backgroundColor: colors.danger },
  disabled: { opacity: 0.5 },
  label: {
    color: colors.surface,
    fontSize: typography.button.fontSize,
    fontWeight: typography.button.fontWeight,
  },
  secondaryLabel: { color: colors.primary },
});
