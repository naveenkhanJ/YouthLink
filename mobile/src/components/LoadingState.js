/**
 * Feedback/LoadingState — docs/prototype/design-system.md §5/§8. Four
 * skeleton rectangles, used wherever content is loading. No shimmer/pulse
 * animation is specified in the text spec, so this renders static bars
 * rather than guessing at an animation the source doesn't describe.
 */
import { View, StyleSheet } from "react-native";
import { colors, spacing, radius } from "../theme/tokens";

export default function LoadingState() {
  return (
    <View style={styles.container} accessibilityLabel="Loading">
      {[0, 1, 2, 3].map((i) => (
        <View key={i} style={styles.bar} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  bar: {
    height: 48,
    borderRadius: radius.input,
    backgroundColor: colors.bg.subtle,
  },
});
