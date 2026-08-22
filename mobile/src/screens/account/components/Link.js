/**
 * Text link — Account Management module only, not shared app-wide.
 * Extracted from LoginScreen.js/RegisterScreen.js, which each had an
 * identical linkContainer/link style pair for their "switch screen"
 * links — flagged by a code-review pass as a real duplication risk.
 */
import { Pressable, Text, StyleSheet } from "react-native";
import { colors, spacing, typography } from "../theme";

/**
 * @param {() => void} onPress
 * @param {React.ReactNode} children
 */
export default function Link({ onPress, children }) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Text style={styles.text}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.lg,
    alignItems: "center",
  },
  text: {
    fontSize: typography.caption.fontSize,
    fontWeight: typography.caption.fontWeight,
    color: colors.primary,
  },
});
