/**
 * Feedback/OfflineBar — real Figma component (node 2846:9, "Components /
 * Feedback" page, found 2026-09-28; this file previously guessed at a
 * full-bleed top strip with no basis in any spec). It's a rounded,
 * bordered advisory card sitting in the content area — the same shape
 * family as `FormBanner`/`EmptyState`, not an edge-to-edge system bar.
 * Text is mobile/secondary at text/primary (dark, clearly readable) — per
 * the component's own note, "the word 'Offline' carries the meaning,
 * colour alone never does," so this isn't de-emphasised as a caption.
 *
 * A screen shows or hides this itself (this component doesn't detect
 * connectivity; that's @react-native-community/netinfo territory if/when
 * a screen needs it — a decision for whichever screen first needs it, not
 * invented here). NFR-USE-01 keeps already-loaded listings viewable, so
 * this is an advisory, never a blocker.
 */
import { Text, View, StyleSheet } from "react-native";
import { colors, spacing, radius, typography } from "../theme/tokens";

/**
 * @param {string} [message] - Defaults to a generic offline notice; override
 * per screen (e.g. "Offline — showing gigs saved on your phone").
 */
export default function OfflineBar({ message = "Offline — showing your last loaded data" }) {
  return (
    <View style={styles.bar}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: 36,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: radius.input,
    backgroundColor: colors.bg.subtle,
    justifyContent: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  text: {
    ...typography.secondary,
    color: colors.text.primary,
  },
});
