/**
 * Feedback/ConfirmDialog — real Figma component (node 45:23, "Components /
 * Feedback" page, found 2026-09-28). New — nothing existed for this
 * before; `design-system.md`'s text description named it but it was never
 * built, since the shared-prerequisite pass only got as far as the
 * components that had an obvious existing text-spec section to build from.
 *
 * Destructive confirmation (used at 1.17, 4.4, 8.5, 9.x, 10.x per its own
 * description): title names the act, body states what is lost and that it
 * cannot be undone, "Stay"/cancel is the safe, leftmost action (Text
 * style), the destructive action is explicit — never "OK".
 *
 * The scrim (dimmed backdrop) is screen-level, not part of this component —
 * every real usage in Figma draws this as a card sitting on top of a
 * separate full-screen scrim sibling, so the calling screen owns that,
 * this is just the card.
 */
import { Text, View, StyleSheet } from "react-native";
import { colors, spacing, radius, elevation, typography } from "../theme/tokens";
import Button from "./Button";

/**
 * @param {string} title - Names the act, e.g. "Discard registration?".
 * @param {string} body - States what is lost and that it can't be undone.
 * @param {string} [cancelLabel] - Defaults to "Stay".
 * @param {() => void} onCancel
 * @param {string} confirmLabel - The explicit destructive verb, e.g. "Discard".
 * @param {() => void} onConfirm
 * @param {"text"|"secondary"} [cancelStyle] - Defaults to "text" (1.17-style destructive
 *   dialogs). Sign out (1.10s) is not destructive and draws Secondary + Primary instead.
 * @param {"destructive"|"primary"} [confirmStyle] - Defaults to "destructive".
 */
export default function ConfirmDialog({
  title,
  body,
  cancelLabel = "Stay",
  onCancel,
  confirmLabel,
  onConfirm,
  cancelStyle = "text",
  confirmStyle = "destructive",
}) {
  return (
    <View style={[styles.card, elevation.sheet]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
      <View style={styles.actions}>
        <Button title={cancelLabel} onPress={onCancel} style={cancelStyle} />
        <Button title={confirmLabel} onPress={onConfirm} style={confirmStyle} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
    // 20px — a literal in the real component, not one of the named
    // spacing tokens (4/8/12/16/24/32).
    padding: 20,
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
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "flex-end",
  },
});
