/**
 * Feedback/FormBanner — real Figma component (node 45:8, "Components /
 * Feedback" page, found 2026-09-28). Kind: Error | Info. Error pairs with a
 * whole-submission failure (e.g. login's generic "incorrect phone or
 * password", which deliberately never reveals which field was wrong); Info
 * is a neutral notice (e.g. "Request received").
 */
import { Text, View, StyleSheet } from "react-native";
import { colors, spacing, radius, typography } from "../theme/tokens";

const KIND_STYLES = {
  // Figma 45:4 (Kind=Error) has a stroke and no fill, so it takes whatever
  // surface it sits on rather than forcing white.
  error: {
    background: "transparent",
    border: colors.border.error,
    text: colors.state.danger,
  },
  info: {
    background: colors.bg.subtle,
    border: colors.border.default,
    text: colors.text.primary,
  },
};

/**
 * @param {"error"|"info"} kind
 * @param {string} message
 */
export default function FormBanner({ kind, message }) {
  if (!message) return null;
  const variant = KIND_STYLES[kind];
  if (!variant) {
    throw new Error(`FormBanner: unknown kind "${kind}"`);
  }
  return (
    <View
      style={[
        styles.banner,
        { backgroundColor: variant.background, borderColor: variant.border },
      ]}
    >
      <Text style={[styles.text, { color: variant.text }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderWidth: 1,
    borderRadius: radius.input,
    // Figma pads 10/12 (10 is a literal in the real component, not a spacing
    // token) with the 1px stroke INSIDE the 40px banner; React Native lays the
    // border outside the padding, so it is subtracted. No outer margin: the
    // 328x40 component has none, spacing is the parent's job.
    paddingVertical: 10 - 1,
    paddingHorizontal: spacing.md - 1,
  },
  text: {
    ...typography.secondary,
  },
});
