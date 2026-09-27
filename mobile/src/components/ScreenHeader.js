/**
 * Chrome/ScreenHeader — docs/prototype/design-system.md §5.
 *
 * Action: None | Slot (something on the right — e.g. a text action button).
 * Used on settings/simple-form/help screens (1.8, 1.9, 1.11, 1.12, 1.20,
 * HF.1-4, …). NOT the same header registration/login screens use — those
 * (1.1-1.4x, 1.6-1.7sus) hand-build a larger inline header at mobile/display
 * instead of mobile/title, flagged in this session's design-system research
 * as a second, undocumented header pattern. This component is only the
 * named one; don't reach for it on an onboarding-style screen.
 *
 * backHit is a fixed 44x44 touch target whether or not a back arrow is
 * drawn, so the header's height never shifts based on whether onBack exists.
 */
import { Pressable, Text, View, StyleSheet } from "react-native";
import { colors, spacing, typography } from "../theme/tokens";

/**
 * @param {string} title
 * @param {() => void} [onBack] - Omit to render backHit as an empty spacer.
 * @param {import("react").ReactNode} [action] - Right-side Action slot content.
 */
export default function ScreenHeader({ title, onBack, action }) {
  return (
    <View style={styles.bar}>
      <View style={styles.backHit}>
        {onBack ? (
          <Pressable
            onPress={onBack}
            hitSlop={spacing.sm}
            accessibilityRole="button"
            accessibilityLabel="Back"
            style={styles.backTarget}
          >
            <View style={styles.backChevron} />
          </Pressable>
        ) : null}
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.actionSlot}>{action}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.xs,
    backgroundColor: colors.bg.default,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  backHit: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  backTarget: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  backChevron: {
    width: 10,
    height: 10,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: colors.text.primary,
    transform: [{ rotate: "45deg" }],
  },
  title: {
    flex: 1,
    ...typography.title,
    color: colors.text.primary,
  },
  actionSlot: {
    minWidth: 44,
    alignItems: "flex-end",
    justifyContent: "center",
  },
});
