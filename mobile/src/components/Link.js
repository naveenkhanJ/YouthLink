/**
 * Action/Link — real Figma component (node 34:27, "Components / Actions"
 * page, found 2026-09-28). New — a simple underlined, brand-coloured
 * text action (e.g. `EndorsementRow`'s "Revoke"), distinct from both
 * `Action/Button` and the smaller `Action/ListRowAction`.
 */
import { Pressable, Text, StyleSheet } from "react-native";
import { colors, typography } from "../theme/tokens";

/**
 * @param {string} title
 * @param {() => void} onPress
 */
export default function Link({ title, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.wrap} accessibilityRole="button">
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingVertical: 10,
  },
  text: {
    ...typography.body,
    color: colors.brand.primary,
    textDecorationLine: "underline",
  },
});
