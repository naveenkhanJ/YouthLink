/**
 * Start date & time — one picker field (prototype 2.8, 2.8err, 2.11e, 2.11pe, 2.11de; FR-POST-01/05) — Lahiru.
 *
 * The prototype draws a single `Input/DateTimeField` labelled "Start date & time" showing
 * "Sat 29 Aug 2026, 5:00 AM" with a calendar glyph on the right: picker framing, never free text.
 * Figma draws only the closed field, not the picker. Tapping it opens Android's own date dialog
 * (a month calendar), then its own time dialog (a clock), from @react-native-community/datetimepicker
 * — the pickers every Android user already knows, read properly by TalkBack.
 *
 * Replaced on 2026-10-18 (integration/viva-demo, Afham's decision; decisions.md): the first version
 * was a sheet of Chips (a strip of the next 60 days, hour / minute / AM-PM grids), built that way
 * because a native picker meant a new dependency. Selected chips grow (the filter chip's selected
 * label is larger), so every tap shifted the grid, and the 60 days were a cap no requirement sets.
 *
 * Only days from today on can be picked. The 2-hour rule (FR-POST-05) stays with the caller: Android's
 * time dialog cannot enforce a minimum time, and the rule's message is the caller's FieldError.
 *
 * Looks like Input/DateTimeField {State=Filled}: label (secondary, text/secondary), a 48-high
 * field (pad 12 with the 1 px border inside, border/default, r8), the value in `body`, and the
 * 12 x 12 calendar glyph (stroke text/secondary 1.5). Empty shows a placeholder in text/secondary;
 * an error draws the 1.5 px error border (the message is the caller's FieldError beneath it).
 *
 * The value in and out is one ISO string ('' while nothing is chosen).
 */
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import Svg, { Path } from 'react-native-svg';
import { colors, spacing, radius, typography, pressed } from '../../../theme/tokens';
import { formatStartFull } from '../posting.format.js';

// The dialogs' OK / CANCEL in the brand colour. The time dialog's buttons otherwise take the app
// theme's default accent (teal); the config plugin in app.json colours everything else.
const DIALOG_BUTTONS = {
  positiveButton: { textColor: colors.brand.primary },
  negativeButton: { textColor: colors.brand.primary },
};

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

/** Where the dialogs start: the current value, or tomorrow at 9:00 AM when nothing is chosen. */
function initialDate(value) {
  const parsed = value ? new Date(value) : null;
  if (parsed && !isNaN(parsed.getTime())) return parsed;
  const tomorrow = startOfDay(new Date(Date.now() + 24 * 60 * 60 * 1000));
  tomorrow.setHours(9, 0, 0, 0);
  return tomorrow;
}

/**
 * @param {string} [label]
 * @param {string} value - ISO string, or '' while empty
 * @param {(iso: string) => void} onChange
 * @param {string} [error] - truthy draws the error border; show the message with a FieldError
 * @param {string} [placeholder]
 * @param {() => void} [onFocus] - called when the picker opens (lets useFocusScroll bring the field into view)
 * @param {(event: object) => void} [onLayout]
 */
export default function StartDateTimeField({
  label = 'Start date & time',
  value = '',
  onChange,
  error,
  placeholder = 'Choose a date and time',
  onFocus,
  onLayout,
}) {
  // Day first, then the time on that day. Cancelling either dialog leaves the field as it was:
  // nothing is stored until the time is set.
  function openPicker() {
    if (onFocus) onFocus();
    const start = initialDate(value);
    DateTimePickerAndroid.open({
      ...DIALOG_BUTTONS,
      mode: 'date',
      value: start,
      minimumDate: startOfDay(new Date()),
      onValueChange: (_event, day) => {
        // Keep the time already chosen (or 9:00 AM) on the newly picked day.
        const onDay = new Date(day.getFullYear(), day.getMonth(), day.getDate(), start.getHours(), start.getMinutes());
        DateTimePickerAndroid.open({
          ...DIALOG_BUTTONS,
          mode: 'time',
          value: onDay,
          is24Hour: false,
          onValueChange: (_e, time) => {
            const picked = new Date(day.getFullYear(), day.getMonth(), day.getDate(), time.getHours(), time.getMinutes());
            onChange(picked.toISOString());
          },
        });
      },
    });
  }

  const text = value ? formatStartFull(value) : '';

  return (
    <View style={styles.container} onLayout={onLayout}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        onPress={openPicker}
        accessibilityRole="button"
        accessibilityLabel={`${label}${text ? `, ${text}` : ''}. Open the picker.`}
        style={({ pressed: isPressed }) => [styles.field, error && styles.fieldError, isPressed && styles.pressedSurface]}
      >
        <Text style={[styles.value, text && styles.valueFilled]} numberOfLines={1}>
          {text || placeholder}
        </Text>
        {/* Figma's own glyph (node 28:80): 12 x 12, stroke text/secondary 1.5, round caps and joins. */}
        <Svg width={12} height={12} viewBox="0 0 12 12" fill="none" overflow="visible">
          <Path
            d="M0 5.5L12 5.5M3 0L3 3M9 0L9 3M0 2L12 2L12 12L0 12L0 2Z"
            stroke={colors.text.secondary}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  // While a finger is on it (theme/tokens.js `pressed`): follows the rounded corners.
  pressedSurface: { backgroundColor: pressed.surface },
  // 6 — a literal in the real DateTimeField, not a named spacing token.
  container: {
    gap: 6,
  },
  label: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    // Figma pads 12 with the 1 px stroke INSIDE the 48 px field; React Native puts the border
    // outside the padding, so it is subtracted (same as the shared DateTimeField).
    padding: spacing.md - 1,
    borderWidth: 1,
    borderColor: colors.border.input,
    borderRadius: radius.input,
    backgroundColor: colors.bg.default,
  },
  fieldError: {
    padding: spacing.md - 1.5,
    borderWidth: 1.5,
    borderColor: colors.border.error,
  },
  value: {
    flex: 1,
    ...typography.body,
    color: colors.text.secondary,
  },
  valueFilled: {
    color: colors.text.primary,
  },
});
