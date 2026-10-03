/**
 * The ✕ on the registration top bar (prototype "What the collapsed chrome hides"):
 * `closeHit` is 44×44, the ✕ a 12×12 vector at @26,16 inside it — stroke text/secondary 2,
 * round caps. It abandons registration and returns to role selection.
 */
import { Pressable, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";
import { colors, spacing } from "../../../theme/tokens";

/**
 * @param {() => void} onPress
 */
export default function CloseButton({ onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.hit}
      hitSlop={spacing.sm}
      accessibilityRole="button"
      accessibilityLabel="Close"
    >
      <Svg width={44} height={44} viewBox="0 0 44 44">
        <Path
          d="M26 16L38 28M38 16L26 28"
          stroke={colors.text.secondary}
          strokeWidth={2}
          strokeLinecap="round"
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
  },
});
