/**
 * Display/NotificationRow — real Figma component (node 40:78,
 * "Components / Display" page, found 2026-09-28). New — nothing existed
 * for this before. Notification history row (3.10, FR-NOTIF-08).
 *
 * Per-type title/body/tap comes from the real component's own 16-type
 * presentation table (not this component's concern — the caller supplies
 * the already-resolved title/body per notification type). Digest type
 * exists specifically for FR-NOTIF-01's 5/day cap: it batches the excess
 * into one expandable row (chevron, no timestamp) instead of flooding
 * the list — this component only renders the two shapes, the batching
 * decision itself happens server-side.
 */
import { Pressable, Text, View, StyleSheet } from "react-native";
import { colors, spacing, radius, elevation, typography } from "../theme/tokens";

/**
 * @param {"standard"|"digest"} type
 * @param {string} title
 * @param {string} body
 * @param {string} [timeAgo] - Standard type only, e.g. "2h ago".
 * @param {() => void} [onPress]
 */
export default function NotificationRow({ type = "standard", title, body, timeAgo, onPress }) {
  const isDigest = type === "digest";
  return (
    <Pressable onPress={onPress} style={[styles.card, elevation.card]} accessibilityRole="button">
      <View style={styles.dot} />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={isDigest ? 1 : undefined}>{title}</Text>
        <Text style={styles.body} numberOfLines={isDigest ? 1 : undefined}>{body}</Text>
        {!isDigest && timeAgo ? <Text style={styles.timeAgo}>{timeAgo}</Text> : null}
      </View>
      {isDigest ? <Text style={styles.chevron}>▼</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
    padding: spacing.md,
    borderRadius: radius.input,
    backgroundColor: colors.bg.default,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.brand.primary,
    marginTop: 6,
  },
  content: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  body: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  timeAgo: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  chevron: {
    fontSize: 8,
    color: colors.text.secondary,
    marginTop: 6,
  },
});
