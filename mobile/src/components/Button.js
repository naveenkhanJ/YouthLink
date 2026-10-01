/**
 * Action/Button — real Figma component (fileKey 9gIi2H8L0QDQps3T8oinPC,
 * node 34:26, "Components / Actions" page — found 2026-09-28, this file
 * previously built from `design-system.md`'s text description only).
 *
 * Style: Primary | Secondary | Destructive | Text · State: Default | Loading | Disabled.
 * "Text" is a link rendered as a button-shaped slot, not a lighter/quieter
 * button — the spec is explicit that a destructive dialog's safe escape
 * must be Secondary, never Text, so don't reach for Text as a generic
 * "less important" variant.
 *
 * Disabled is NOT one uniform look across styles, per the real component
 * (this was wrong before): Primary/Destructive-disabled swap to a fully
 * inert bg/subtle fill with a 1px border/default stroke and text/secondary
 * label. Secondary-disabled keeps its own bg/default (white) background —
 * only its border and label recolour to the disabled/inert tone. Text has
 * no background in either state.
 *
 * Border width is part of the variant, not flat 1px: Secondary's border
 * (both Default and Disabled) is 1.5px; Primary/Destructive-disabled's is
 * 1px; Primary/Destructive/Text-default have no border at all.
 */
import { ActivityIndicator, Pressable, Text, View, StyleSheet } from "react-native";
import { colors, spacing, radius, typography } from "../theme/tokens";

const STYLE_VARIANTS = {
  primary: {
    background: colors.brand.primary,
    border: null,
    borderWidth: 0,
    label: colors.text.inverse,
  },
  secondary: {
    background: colors.bg.default,
    border: colors.brand.primary,
    borderWidth: 1.5,
    label: colors.brand.primary,
  },
  destructive: {
    background: colors.state.danger,
    border: null,
    borderWidth: 0,
    label: colors.text.inverse,
  },
  text: {
    background: "transparent",
    border: null,
    borderWidth: 0,
    label: colors.brand.primary,
  },
};

// Secondary-disabled keeps its own background; the other styles fall back
// to this shared inert look. Real component, not a uniform guess.
const DISABLED = {
  primary: { background: colors.bg.subtle, border: colors.border.default, borderWidth: 1, label: colors.text.secondary },
  secondary: { background: colors.bg.default, border: colors.border.default, borderWidth: 1.5, label: colors.text.secondary },
  destructive: { background: colors.bg.subtle, border: colors.border.default, borderWidth: 1, label: colors.text.secondary },
  text: { background: "transparent", border: null, borderWidth: 0, label: colors.text.secondary },
};

/**
 * @param {string} title
 * @param {() => void} onPress
 * @param {"primary"|"secondary"|"destructive"|"text"} [style]
 * @param {boolean} [loading] - Shows a spinner in place of the label and disables the button; the
 *   button does not change size or move.
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
  const colorsForState = disabled ? DISABLED[style] : variant;
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
          borderWidth: colorsForState.borderWidth,
          borderColor: colorsForState.border || "transparent",
        },
        isText ? styles.textVariant : styles.defaultVariant,
        pressed && !isDisabled && styles.pressed,
      ]}
    >
      {/* The label stays in the layout (invisible while loading) so the button keeps exactly the
          size and position it had a moment ago, and the spinner is centred over it. Figma 1.6sub
          draws the Loading button the same width as the Default one: 328, filling the bar. */}
      <Text style={[styles.label, { color: colorsForState.label }, loading && styles.hidden]}>{title}</Text>
      {loading ? (
        <View style={styles.spinner} pointerEvents="none">
          <ActivityIndicator color={colorsForState.label} />
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: radius.input,
    alignItems: "center",
    justifyContent: "center",
  },
  defaultVariant: {
    paddingHorizontal: spacing.xl,
  },
  textVariant: {
    paddingHorizontal: spacing.sm,
    // The real component is a fixed-content-width inline element, not a
    // stretched one — without this, a parent column with default
    // (stretch) alignment forces the label to the container's full width.
    alignSelf: "flex-start",
  },
  hidden: {
    opacity: 0,
  },
  spinner: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    ...typography.bodyMedium,
  },
});
