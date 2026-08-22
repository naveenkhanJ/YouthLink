/**
 * Labeled checkbox — Account Management module only. Built for the ToS/
 * Privacy Policy acceptance on registration (FR-ACC-19). Not shown in the
 * source prototypes; the square/border/fill treatment here follows the
 * proposal in .worklog/progress.md's design-system section ("standard,
 * low-risk to get right without more source material").
 */
import { Pressable, Text, View, StyleSheet } from "react-native";
import { colors, spacing, radius, typography } from "../theme";

/**
 * @param {boolean} checked
 * @param {() => void} onToggle
 * @param {React.ReactNode} label - Can include nested <Text> for a linked phrase.
 * @param {boolean} [error] - Highlights the box red when the user tried to
 *   submit without checking it (FR-ACC-19: "blocked with the checkbox
 *   highlighted").
 */
export default function Checkbox({ checked, onToggle, label, error }) {
  return (
    <Pressable style={styles.container} onPress={onToggle}>
      <View
        style={[
          styles.box,
          checked && styles.boxChecked,
          error && styles.boxError,
        ]}
      >
        {checked ? <Text style={styles.checkmark}>✓</Text> : null}
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: spacing.lg,
  },
  box: {
    width: 22,
    height: 22,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
    marginTop: 2,
  },
  boxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  boxError: {
    borderColor: colors.danger,
  },
  checkmark: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: "700",
  },
  label: {
    flex: 1,
    fontSize: typography.body.fontSize,
    color: colors.textPrimary,
  },
});
