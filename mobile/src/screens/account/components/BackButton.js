/**
 * Bare 44×44 back-chevron hit target — the "backHit" pattern used on
 * registration and login screens (spec 1.6, 1.6emp, 1.2–1.4). These screens
 * hand-build their header inline (display-size title below the chevron)
 * rather than using Chrome/ScreenHeader, which is for settings/form screens.
 *
 * The SVG path matches the Figma component exactly:
 *   back 8×16 @6,14 — stroke color/text/primary 2
 * rendered inside the 44×44 hit target frame.
 */
import { Pressable, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";
import { colors, spacing } from "../../../theme/tokens";

/**
 * @param {() => void} onPress
 */
export default function BackButton({ onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.hit}
      hitSlop={spacing.sm}
      accessibilityRole="button"
      accessibilityLabel="Back"
    >
      <Svg width={44} height={44} viewBox="0 0 44 44">
        <Path
          d="M14 14L6 22L14 30"
          stroke={colors.text.primary}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Svg>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hit: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
});
