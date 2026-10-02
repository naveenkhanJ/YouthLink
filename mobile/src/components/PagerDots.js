/**
 * Chrome/PagerDots — the three-step pager of the first-run cards (prototype M0): 8×8 dots, gap 8,
 * the active one at full brand colour, the others the same colour at 30% opacity. The position is
 * a property of the component (`active`), so it is never hand-drawn per screen.
 */
import { View, StyleSheet } from "react-native";
import { colors } from "../theme/tokens";

/**
 * @param {number} active - The current step, 1-based.
 * @param {number} [count] - How many dots to draw (3 in the prototype).
 */
export default function PagerDots({ active, count = 3 }) {
  return (
    <View style={styles.row} accessibilityRole="progressbar" accessibilityLabel={`Step ${active} of ${count}`}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={[styles.dot, i + 1 !== active && styles.inactive]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.brand.primary },
  inactive: { opacity: 0.3 },
});
