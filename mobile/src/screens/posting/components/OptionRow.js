/**
 * One selectable row of the create flow's Category and Arrangement lists (prototype 2.2, 2.3) —
 * Lahiru. Lifted out of PostingCreateScreen.js, unchanged, so the Edit posting screen picks a
 * category with the very same rows (FR-POST-11).
 *
 * TODO: PostingCreateScreen.js still carries its own identical inline copy; it should import this
 * one and drop it (left alone here: that file was outside this change).
 *
 * 48 tall, radius 8, pad 12; selected fills color/bg/subtle with a color/brand/primary label,
 * default is a plain color/text/primary row.
 */
import { Pressable, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius, typography, pressed } from '../../../theme/tokens';

/**
 * @param {string} label
 * @param {boolean} selected
 * @param {() => void} onPress
 */
export default function OptionRow({ label, selected, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={({ pressed: isPressed }) => [styles.optionRow, selected && styles.optionRowSelected, isPressed && styles.pressedSurface]}
    >
      <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // While a finger is on it (theme/tokens.js `pressed`): follows the rounded corners.
  pressedSurface: { backgroundColor: pressed.surface },
  optionRow: {
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    borderRadius: radius.input,
  },
  optionRowSelected: {
    backgroundColor: colors.bg.subtle,
  },
  optionLabel: {
    ...typography.body,
    color: colors.text.primary,
  },
  optionLabelSelected: {
    color: colors.brand.primary,
  },
});
