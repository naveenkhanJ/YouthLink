import { Pressable, Text, StyleSheet, ActivityIndicator } from "react-native";
import { colors, spacing, radius, typography } from "../theme";

export default function Button({ title, onPress, loading, disabled, variant = "primary" }) {
  const isDisabled = disabled || loading;
  const isDanger = variant === "danger";
  const isSecondary = variant === "secondary";

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.base,
        isDanger && styles.danger,
        isSecondary && styles.secondary,
        isDisabled && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isSecondary ? colors.primary : colors.surface} />
      ) : (
        <Text
          style={[
            styles.label,
            isSecondary && styles.secondaryLabel,
          ]}
        >
          {title}
        </Text>
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
  danger: {
    backgroundColor: colors.danger,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    color: colors.surface,
    fontSize: typography.button.fontSize,
    fontWeight: typography.button.fontWeight,
  },
  secondaryLabel: {
    color: colors.primary,
  },
});
