/**
 * The posting form's top bar (prototype M2 "What the collapsed chrome hides") — Lahiru.
 *
 * Not the shared ScreenHeader: the form draws no title, no border and no fill band. It is a
 * 328 x 44 row at 16 / 6 holding a back control and a close control:
 *   backHit  44 x 44, an 8 x 16 chevron (stroke color/text/primary 2)
 *   closeHit 44 x 44, a 12 x 12 cross, 6 in from the right edge
 * Step 1 (2.1, 2.1t, 2.1n, 2.1rst) has nothing to go back to — it uses the tab bar to leave — so
 * it draws `topBarGhost`, an empty 44 x 44 that keeps the title at the same height as every other
 * step. The three review screens carry 6 of bottom padding (a 328 x 50 bar).
 *
 * The bar sits 6 below the status bar (the safe-area inset is added here).
 */
import { View, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { colors, spacing } from '../../../theme/tokens';

/**
 * @param {() => void} [onBack] - Back to the previous step. Omit on step 1 (draws the ghost instead).
 * @param {() => void} onClose - The ✕: leaves the form for the postings list.
 * @param {boolean} [ghost] - Step 1: no back control and no ✕, just the empty 44 x 44.
 * @param {boolean} [review] - The review screens: 6 extra bottom padding.
 */
export default function FormTopBar({ onBack, onClose, ghost = false, review = false }) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.bar,
        { paddingTop: insets.top + 6 },
        review && styles.reviewPadding,
      ]}
    >
      {ghost ? (
        <View style={styles.hit} />
      ) : (
        <>
          <Pressable
            onPress={onBack}
            hitSlop={spacing.sm}
            accessibilityRole="button"
            accessibilityLabel="Back"
            style={styles.hit}
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
          <Pressable
            onPress={onClose}
            hitSlop={spacing.sm}
            accessibilityRole="button"
            accessibilityLabel="Close"
            style={[styles.hit, styles.closeHit]}
          >
            <Svg width={12} height={12} viewBox="0 0 12 12">
              <Path d="M0 0L12 12M12 0L0 12" stroke={colors.text.primary} strokeWidth={2} strokeLinecap="round" />
            </Svg>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.gutter,
  },
  reviewPadding: {
    paddingBottom: 6,
  },
  hit: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // The cross is drawn 6 in from the right edge of its 44 x 44 hit area, not centred.
  closeHit: {
    alignItems: 'flex-end',
    paddingRight: 6,
  },
});
