/**
 * Input/Toggle — real Figma component (node 28:59, "Components / Inputs"
 * page, found 2026-09-28).
 *
 * G9 rule (real component's own note): the `label` must describe the
 * OUTCOME, never the raw field name — the two real rows are "Notify me
 * about urgent gigs nearby" (default off) and "Notify me about new gigs
 * nearby" (an inverted field, default on). Two identical-looking toggles
 * can behave oppositely; that's the caller's copy to get right, not
 * something this component can enforce.
 *
 * Built as a custom 44x24 pill to match the exact Figma geometry, replacing
 * the previous native Switch (which has OS-dependent, un-stylable dimensions).
 */
import { Pressable, Text, View, StyleSheet } from "react-native";
import { colors, spacing, typography } from "../theme/tokens";

/**
 * @param {string} label
 * @param {boolean} value
 * @param {(value: boolean) => void} onValueChange
 */
export default function Toggle({ label, value, onValueChange }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        onPress={() => onValueChange(!value)}
        style={[styles.track, value ? styles.trackOn : styles.trackOff]}
        accessibilityRole="switch"
        accessibilityState={{ checked: value }}
        accessibilityLabel={label}
      >
        <View style={[styles.thumb, value ? styles.thumbOn : styles.thumbOff]} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
    paddingVertical: spacing.sm,
  },
  label: {
    flex: 1,
    ...typography.body,
    color: colors.text.primary,
  },
  track: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
    justifyContent: "center",
  },
  trackOn: {
    backgroundColor: colors.brand.primary,
  },
  // Figma 28:53: the off track is color/border/default, not bg/subtle.
  trackOff: {
    backgroundColor: colors.border.default,
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.bg.default,
    // No shadow: the Figma knob (28:54) is a flat white ellipse.
  },
  thumbOn: {
    transform: [{ translateX: 20 }],
  },
  thumbOff: {
    transform: [{ translateX: 0 }],
  },
});
