/**
 * Primary button — Account Management module only, not shared app-wide.
 * See ../theme.js for why the tokens it uses are interim.
 */
import { Pressable, Text, StyleSheet, ActivityIndicator } from "react-native";
import { colors, spacing, radius, typography } from "../theme";

/**
 * @param {string} title
 * @param {() => void} onPress
 * @param {boolean} [loading] - Shows a spinner instead of the label, disables the button.
 * @param {boolean} [disabled]
 */
export default function Button({
  title,
  onPress,
  loading = false,
  disabled = false,
}) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        isDisabled && styles.buttonDisabled,
        pressed && !isDisabled && styles.buttonPressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.surface} />
      ) : (
        <Text style={styles.label}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    minHeight: 54,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  label: {
    color: colors.surface,
    fontSize: typography.button.fontSize,
    fontWeight: typography.button.fontWeight,
  },
});
