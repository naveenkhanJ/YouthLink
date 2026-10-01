/**
 * Chrome/ScreenHeader — the real component (Figma fileKey 9gIi2H8L0QDQps3T8oinPC,
 * node 48:14, "Components / Chrome"), confirmed to match this file's
 * structure exactly (360x56, 44px backHit, mobile/title). The back chevron
 * below is that component's real exported path, not an approximated shape.
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
import Svg, { Path } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing, typography } from "../theme/tokens";

/**
 * @param {string} title
 * @param {() => void} [onBack] - Omit to render backHit as an empty spacer.
 * @param {import("react").ReactNode} [action] - Right-side Action slot content.
 * @param {boolean} [hideBack] - Draw no backHit at all, so the title starts at the left edge (Figma
 *   1.17d "Account deleted": nothing to go back to). Different from omitting `onBack`, which keeps
 *   the empty 44px spacer.
 */
export default function ScreenHeader({ title, onBack, action, hideBack = false }) {
  // insets.top: the status bar overlays this screen's layout rather than
  // pushing it down (found live — the status bar's icons were rendering
  // directly on top of the title text without this).
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingTop: insets.top }]}>
      {hideBack ? null : (
        <View style={styles.backHit}>
          {onBack ? (
            <Pressable
              onPress={onBack}
              hitSlop={spacing.sm}
              accessibilityRole="button"
              accessibilityLabel="Back"
              style={styles.backTarget}
            >
              <Svg width={44} height={44} viewBox="0 0 44 44">
                <Path
                  d="M26 14L18 22L26 30"
                  stroke={colors.text.primary}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </Svg>
            </Pressable>
          ) : null}
        </View>
      )}
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.actionSlot}>{action}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs, // Figma 48:2: gap 4 between back target, title and action
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
