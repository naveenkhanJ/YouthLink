/**
 * Action/Button — docs/prototype/design-system.md §5.
 *
 * Style: Primary | Secondary | Destructive | Text · State: Default | Loading | Disabled.
 * "Text" is a link rendered as a button-shaped slot, not a lighter/quieter
 * button — the spec is explicit that a destructive dialog's safe escape
 * must be Secondary, never Text, so don't reach for Text as a generic
 * "less important" variant.
 *
 * Disabled uses the exact pattern drawn throughout M1 (e.g. 1.3err1,
 * 1.6bnr3): bg/subtle fill, border/default stroke, text/secondary label —
 * genuinely inert, not just dimmed.
 */
import { ActivityIndicator, Pressable, Text, StyleSheet } from "react-native";
import { colors, spacing, radius, typography } from "../theme/tokens";

const STYLE_VARIANTS = {
  primary: {
    background: colors.brand.primary,
    border: null,
    label: colors.text.inverse,
  },
  secondary: {
    background: colors.bg.default,
    border: colors.border.default,
    label: colors.text.primary,
  },
  destructive: {
    background: colors.state.danger,
    border: null,
    label: colors.text.inverse,
  },
  text: {
    background: "transparent",
    border: null,
    label: colors.brand.primary,
  },
};

const DISABLED = {
  background: colors.bg.subtle,
  border: colors.border.default,
  label: colors.text.secondary,
};

/**
 * @param {string} title
 * @param {() => void} onPress
 * @param {"primary"|"secondary"|"destructive"|"text"} [style]
 * @param {boolean} [loading] - Shows a spinner instead of the label, disables the button.
 * @param {boolean} [disabled]
 */
export default function Button({
  title,
  onPress,
  style = "primary",
  loading = false,
  disabled = false,
}) {
  const isDisabled = disabled || loading;
  const variant = STYLE_VARIANTS[style];
  if (!variant) {
    throw new Error(`Button: unknown style "${style}"`);
  }
  const colorsForState = isDisabled ? DISABLED : variant;
  const isText = style === "text";

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: colorsForState.background,
          borderWidth: colorsForState.border ? 1 : 0,
          borderColor: colorsForState.border || "transparent",
        },
        isText && styles.textVariant,
        pressed && !isDisabled && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colorsForState.label} />
      ) : (
        <Text style={[styles.label, { color: colorsForState.label }]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: radius.input,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  textVariant: {
    minHeight: 44,
    paddingHorizontal: spacing.sm,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    ...typography.bodyMedium,
  },
});
