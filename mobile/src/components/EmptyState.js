/**
 * Feedback/EmptyState — docs/prototype/design-system.md §8's composed-state
 * rule: an empty list is this, not a blank screen. Cause: NoneExist (nothing
 * has ever been created — e.g. no postings yet) vs FiltersExclude (things
 * exist but the current filters hide all of them) get different copy, since
 * "clear your filters" is meaningless when nothing exists at all.
 */
import { Text, View, StyleSheet } from "react-native";
import { colors, spacing, typography } from "../theme/tokens";
import Button from "./Button";

const DEFAULT_MESSAGE = {
  noneExist: "Nothing here yet.",
  filtersExclude: "Nothing matches your filters.",
};

/**
 * @param {"noneExist"|"filtersExclude"} cause
 * @param {string} [message] - Overrides the default copy for `cause`.
 * @param {string} [actionLabel] - e.g. "Clear filters" or "Post a gig".
 * @param {() => void} [onAction]
 */
export default function EmptyState({ cause, message, actionLabel, onAction }) {
  const text = message ?? DEFAULT_MESSAGE[cause];
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{text}</Text>
      {actionLabel && onAction ? (
        <View style={styles.actionWrap}>
          <Button title={actionLabel} onPress={onAction} style="secondary" />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
  },
  message: {
    ...typography.secondary,
    color: colors.text.secondary,
    textAlign: "center",
  },
  actionWrap: {
    marginTop: spacing.lg,
  },
});
