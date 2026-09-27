/**
 * Feedback/FormBanner — docs/prototype/design-system.md §5. Kind: Error |
 * Info. Error pairs with a whole-submission failure (e.g. login's generic
 * "incorrect phone or password", which deliberately never reveals which
 * field was wrong); Info is a neutral notice (e.g. "Request received").
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
    minHeight: 40,
    borderWidth: 1,
    borderRadius: radius.input,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
    justifyContent: "center",
  },
  text: {
    ...typography.secondary,
  },
});
