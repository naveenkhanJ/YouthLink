/**
 * Feedback/EmptyState — real Figma component (node 45:17, "Components /
 * Feedback" page, found 2026-09-28; this file previously rendered plain
 * centred text with no card, no title, and no shadow — a structural miss,
 * not a copy one). The real component is a white `elevation/card` card:
 * bold title, a secondary body line beneath it, then an optional
 * Secondary-style `Button`. "Illustration-free: title + line + action" per
 * its own description — a gold-tint variant was tried and withdrawn by
 * Afham on 2026-09-08 ("no second brand colour"), so this stays plain white.
 *
 * Cause: NoneExist (nothing has ever been created) vs FiltersExclude
 * (things exist but the current filters hide all of them) get different
 * copy, since "clear your filters" is meaningless when nothing exists at
 * all — the caller supplies both title/body and the optional action per
 * screen, since the component's own example copy ("No gigs nearby yet") is
 * Discovery-specific, not a generic default every module's empty state
 * should show.
 *
 * OPEN QUESTION for Afham, not resolved here: the real component's own
 * usage note says NoneExist is "wait-or-widen (no action button)", but the
 * actual drawn NoneExist instance in Figma includes a "Browse gigs"
 * button — the description and the instance disagree. Left the button
 * fully caller-controlled (optional `actionLabel`/`onAction`, either
 * cause) rather than silently picking one reading.
 */
import { Text, View, StyleSheet } from "react-native";
import { colors, spacing, radius, elevation, typography } from "../theme/tokens";
import Button from "./Button";

/**
 * @param {string} title - Bold headline, e.g. "No gigs nearby yet".
 * @param {string} body - Secondary line beneath the title.
 * @param {string} [actionLabel] - e.g. "Clear filters" or "Browse gigs".
 * @param {() => void} [onAction]
 */
export default function EmptyState({ title, body, actionLabel, onAction }) {
  return (
    <View style={[styles.card, elevation.card]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
      {actionLabel && onAction ? (
        <View style={styles.actionWrap}>
          <Button title={actionLabel} onPress={onAction} style="secondary" />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.card,
    backgroundColor: colors.bg.default,
  },
  title: {
    ...typography.title,
    color: colors.text.primary,
    textAlign: "center",
  },
  body: {
    ...typography.secondary,
    color: colors.text.secondary,
    textAlign: "center",
    maxWidth: 280, // Figma 45:11 wraps the body in a fixed 280px box
  },
  // No extra margin: the card's own gap (8) is the whole space above the
  // action in Figma 45:9 — the old marginTop made it 16.
  actionWrap: {},
});
