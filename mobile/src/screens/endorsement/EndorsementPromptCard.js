/**
 * The one-time prompt card of M8 `8.6` (bio prompt, FR-ENDORSE-13) and `8.7` (endorsement
 * suggestion, FR-ENDORSE-14) — Afham.
 *
 * Both frames draw the same hand-built `promptCard`, not `Feedback/ConfirmDialog`: pad 20/20/16/20
 * (the component's is 20 all round), gap 12, r12, `elevation/sheet`, the title and body at the
 * card's full 288 width, and two non-destructive actions on the right — Secondary "Not now", then
 * a Primary action (M8-endorsement.md, 8.7: "a prompt rather than a confirmation… recorded rather
 * than changed"). It sits inside DialogModal, which owns the 40% scrim and the 16px side margins.
 *
 * Kept in the endorsement module because both prompts are M8 dialogs, even though they open over
 * screens of other modules (Apply, My applications).
 */
import { Text, View, StyleSheet } from "react-native";
import { colors, spacing, radius, elevation, typography } from "../../theme/tokens";
import Button from "../../components/Button";

/**
 * @param {string} title - "Add a short bio?" / "No luck yet?"
 * @param {string} body
 * @param {() => void} onDismiss - "Not now".
 * @param {string} actionLabel - "Add bio" / "See my code".
 * @param {() => void} onAction
 */
export default function EndorsementPromptCard({ title, body, onDismiss, actionLabel, onAction }) {
  return (
    <View style={[styles.card, elevation.sheet]} accessibilityViewIsModal>
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      <Text style={styles.body}>{body}</Text>
      <View style={styles.actions}>
        <Button title="Not now" style="secondary" onPress={onDismiss} />
        <Button title={actionLabel} onPress={onAction} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // promptCard: vertical pad 20/20/16/20, gap 12, fill color/bg/default, r12.
  card: {
    gap: spacing.md,
    paddingTop: 20, // 20 is a literal in the frame, not a spacing token
    paddingHorizontal: 20,
    paddingBottom: spacing.lg,
    borderRadius: radius.sheet,
    backgroundColor: colors.bg.default,
  },
  title: {
    ...typography.title,
    color: colors.text.primary,
  },
  body: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  // actions: horizontal, gap 8, right-aligned. Wraps at large text sizes so neither button is cut
  // off at the card's edge (the same rule ConfirmDialog follows).
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    justifyContent: "flex-end",
  },
});
