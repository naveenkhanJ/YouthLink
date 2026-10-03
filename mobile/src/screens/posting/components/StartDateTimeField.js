/**
 * Start date & time — one picker field (prototype 2.8, 2.8err, 2.11e, 2.11pe, 2.11de; FR-POST-01/05) — Lahiru.
 *
 * The prototype draws a single `Input/DateTimeField` labelled "Start date & time" showing
 * "Sat 29 Aug 2026, 5:00 AM" with a calendar glyph on the right: picker framing, never free text.
 * A native date-time picker is a new dependency (and a rebuild of the shared development build),
 * which is not a module owner's call, so this field opens a sheet built only from the shared kit:
 * a row of the next 60 days, an hour / minute / AM-PM selector made of Chips, and a "Done" button.
 *
 * Looks like Input/DateTimeField {State=Filled}: label (secondary, text/secondary), a 48-high
 * field (pad 12 with the 1 px border inside, border/default, r8), the value in `body`, and the
 * 12 x 12 calendar glyph (stroke text/secondary 1.5). Empty shows a placeholder in text/secondary;
 * an error draws the 1.5 px error border (the message is the caller's FieldError beneath it).
 *
 * The value in and out is one ISO string ('' while nothing is chosen).
 */
import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, spacing, radius, elevation, typography } from '../../../theme/tokens';
import { fill } from '../../../theme/layout';
import Chip from '../../../components/Chip';
import Button from '../../../components/Button';
import { formatStartFull } from '../posting.format.js';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS_AHEAD = 60;
const HOURS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

/** What the sheet starts on: the current value, or tomorrow at 9:00 AM when nothing is chosen. */
function initialPick(value) {
  const parsed = value ? new Date(value) : null;
  if (parsed && !isNaN(parsed.getTime())) {
    const h = parsed.getHours();
    return {
      dayTime: startOfDay(parsed).getTime(),
      hour: h % 12 || 12,
      // The selector offers 5-minute steps; an odd minute (a seeded 4:07) is shown at the step below.
      minute: Math.floor(parsed.getMinutes() / 5) * 5,
      pm: h >= 12,
    };
  }
  const tomorrow = startOfDay(new Date(Date.now() + 24 * 60 * 60 * 1000));
  return { dayTime: tomorrow.getTime(), hour: 9, minute: 0, pm: false };
}

/** The picked day, hour, minute and AM/PM as one ISO instant (device time). */
function toIso({ dayTime, hour, minute, pm }) {
  const day = new Date(dayTime);
  const hours24 = (hour % 12) + (pm ? 12 : 0);
  return new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours24, minute).toISOString();
}

/**
 * @param {string} [label]
 * @param {string} value - ISO string, or '' while empty
 * @param {(iso: string) => void} onChange
 * @param {string} [error] - truthy draws the error border; show the message with a FieldError
 * @param {string} [placeholder]
 * @param {() => void} [onFocus] - called when the sheet opens (lets useFocusScroll bring the field into view)
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
  const { height } = useWindowDimensions();
  const [open, setOpen] = useState(false);
  const [pick, setPick] = useState(() => initialPick(value));

  // Opening starts from whatever is stored now, so cancelling leaves the field untouched.
  function openSheet() {
    setPick(initialPick(value));
    setOpen(true);
    if (onFocus) onFocus();
  }

  function done() {
    onChange(toIso(pick));
    setOpen(false);
  }

  const days = useMemo(() => {
    const today = startOfDay(new Date());
    return Array.from({ length: DAYS_AHEAD }, (_, i) => {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
      return { time: d.getTime(), label: `${WEEKDAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}` };
    });
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps -- recomputed each time the sheet opens

  const text = value ? formatStartFull(value) : '';

  return (
    <View style={styles.container} onLayout={onLayout}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        onPress={openSheet}
        accessibilityRole="button"
        accessibilityLabel={`${label}${text ? `, ${text}` : ''}. Open the picker.`}
        style={[styles.field, error && styles.fieldError]}
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

      <Modal
        visible={open}
        transparent
        statusBarTranslucent
        navigationBarTranslucent
        animationType="slide"
        onRequestClose={() => setOpen(false)}
      >
        <View style={styles.layer}>
          <Pressable style={styles.scrim} onPress={() => setOpen(false)} accessibilityLabel="Close the picker" />
          <View style={[styles.sheet, elevation.sheet, { maxHeight: height * 0.85 }]}>
            <View style={styles.handle} />
            <Text style={styles.title}>{label}</Text>

            <ScrollView contentContainerStyle={styles.sheetBody} showsVerticalScrollIndicator={false}>
              <Text style={styles.groupLabel}>Day</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
                {days.map((day) => (
                  <Chip
                    key={day.time}
                    label={day.label}
                    selected={pick.dayTime === day.time}
                    onPress={() => setPick((p) => ({ ...p, dayTime: day.time }))}
                  />
                ))}
              </ScrollView>

              <Text style={styles.groupLabel}>Hour</Text>
              <View style={styles.chipWrap}>
                {HOURS.map((h) => (
                  <Chip key={h} label={String(h)} selected={pick.hour === h} onPress={() => setPick((p) => ({ ...p, hour: h }))} />
                ))}
              </View>

              <Text style={styles.groupLabel}>Minute</Text>
              <View style={styles.chipWrap}>
                {MINUTES.map((m) => (
                  <Chip
                    key={m}
                    label={String(m).padStart(2, '0')}
                    selected={pick.minute === m}
                    onPress={() => setPick((p) => ({ ...p, minute: m }))}
                  />
                ))}
              </View>

              <View style={styles.chipWrap}>
                <Chip label="AM" selected={!pick.pm} onPress={() => setPick((p) => ({ ...p, pm: false }))} />
                <Chip label="PM" selected={pick.pm} onPress={() => setPick((p) => ({ ...p, pm: true }))} />
              </View>
            </ScrollView>

            <Button title="Done" onPress={done} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
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
    borderColor: colors.border.default,
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
  layer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  scrim: {
    ...fill,
    backgroundColor: colors.overlay.scrim,
    opacity: 0.4,
  },
  // Same shape as the shared BottomSheet card: handle, title, content, 12 radius top corners.
  sheet: {
    gap: spacing.sm,
    paddingTop: 10,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    backgroundColor: colors.bg.default,
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 999,
    backgroundColor: colors.border.default,
  },
  title: {
    ...typography.title,
    color: colors.text.primary,
  },
  sheetBody: {
    gap: spacing.sm,
    paddingBottom: spacing.sm,
  },
  groupLabel: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  chipRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
