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
  error: {
    background: colors.bg.default,
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
    // 10px vertical — a literal in the real component, not one of the
    // named spacing tokens (4/8/12/16/24/32).
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  text: {
    ...typography.secondary,
  },
});
