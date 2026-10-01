/**
 * Feedback/FieldError — docs/prototype/design-system.md §5.
 *
 * Always pairs with an Input/* component at State=Error, directly beneath
 * it — and per §8's composed-states rule, it replaces that component's own
 * generic built-in error line rather than showing alongside it. Exported
 * standalone (not baked into TextField) so any Input/* component can pair
 * with it the same way.
 */
import { Text, StyleSheet } from "react-native";
import { colors, spacing, typography } from "../theme/tokens";

/**
 * @param {string} message
 */
export default function FieldError({ message }) {
  if (!message) return null;
  return <Text style={styles.text}>{message}</Text>;
}

const styles = StyleSheet.create({
  text: {
    ...typography.secondary,
    color: colors.state.danger,
    marginTop: spacing.xs,
  },
});
