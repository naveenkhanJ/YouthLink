/**
 * Feedback/LoadingState — real Figma component (node 45:18, "Components /
 * Feedback" page, found 2026-09-28; this file previously drew 4 uniform
 * 48px blocks with no card, guessed from the text spec alone). The real
 * component is a bordered card mimicking a real content row's shape — one
 * title-sized bar plus three body-sized bars of specific, non-uniform
 * widths — not identical blocks. "Static representation — animation is
 * implementation" per its own description, so a shimmer/pulse is fair
 * game to add later; this still renders static bars, matching what's
 * actually specified rather than guessing at unspecified motion.
 *
 * Button-level loading lives in `Action/Button`'s own Loading state
 * (`Button.js`'s `loading` prop), not here.
 */
import { View, StyleSheet } from "react-native";
import { colors, radius } from "../theme/tokens";

const BARS = [
  { height: 16, width: 200 },
  { height: 12, width: 296 },
  { height: 12, width: 296 },
  { height: 12, width: 140 },
];

export default function LoadingState() {
  return (
    <View style={styles.container} accessibilityLabel="Loading">
      {BARS.map((bar, i) => (
        <View key={i} style={[styles.bar, { height: bar.height, width: bar.width }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    padding: 16 - 1, // Figma: 16 with the 1px stroke inside (114px tall); RN's border is outside
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: radius.input,
    alignItems: "flex-start",
  },
  bar: {
    borderRadius: 4,
    backgroundColor: colors.bg.subtle,
  },
});
