/**
 * The pinned action bar — docs/prototype/design-system.md §5, "Pinned action
 * bar". A layout convention, not a component set: sits below scrolling
 * content (or above the TabBar/keyboard), fill = the screen's own
 * background, gap8 between children.
 *
 * Two padding shapes, per the spec: 12/16/24/16 (84 tall) when this is the
 * screen's bottom edge, or 12/16/12/16 (72 tall) when a TabBar or the
 * keyboard sits below it — pass `onTabBar` for the second shape.
 *
 * `elevation/bar`'s shadow is deliberately NOT automatic here — the spec
 * only casts it "where the content is taller than the space above it", and
 * that's a fact only the screen holding the ScrollView actually knows.
 * Pass `shadow` explicitly from that check rather than guessing here.
 *
 * Per §5, this bar is deliberately NOT used for: single destructive
 * commits, centred success screens, onboarding, or a button that already
 * belongs to another component (e.g. EmptyState's own secondary button).
 */
import { View, StyleSheet } from "react-native";
import { colors, spacing, elevation } from "../theme/tokens";

/**
 * @param {import("react").ReactNode} children
 * @param {boolean} [onTabBar] - Use the shorter padding shape (a TabBar or
 *   the keyboard sits directly below this bar).
 * @param {boolean} [shadow] - Whether the scrolling content above is
 *   actually taller than the available space right now.
 * @param {"default"|"subtle"} [surface] - The bar's fill is the screen's own fill
 *   (design-system.md §5): `color/bg/default` for a white screen, `color/bg/subtle`
 *   for the grey ones (the owner's posting detail, 2.11*). Pass "subtle" on a grey screen
 *   so the bar is invisible until something scrolls under it.
 */
export default function CtaBar({ children, onTabBar = false, shadow = false, surface = "default" }) {
  return (
    <View
      style={[
        styles.bar,
        surface === "subtle" && styles.surfaceSubtle,
        onTabBar ? styles.paddingOnTabBar : styles.paddingBottomEdge,
        shadow && elevation.bar,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    gap: spacing.sm,
    backgroundColor: colors.bg.default,
  },
  surfaceSubtle: {
    backgroundColor: colors.bg.subtle,
  },
  paddingBottomEdge: {
    paddingTop: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  paddingOnTabBar: {
    paddingTop: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
});
