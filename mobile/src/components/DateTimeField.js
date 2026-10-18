/**
 * Input/DateTimeField — real Figma component (node 28:92, "Components /
 * Inputs" page, found 2026-09-28).
 *
 * IMPORTANT, not just a visual note: the real component's own description
 * says "G5: PICKER framing, never free text — 1.4's birthdate is
 * currently free text in code, spec overrides." That's exactly the
 * `RegisterScreen.js` free-text `YYYY-MM-DD` field already flagged as a
 * known gap in `account-management.md`.
 *
 * Built as a hybrid rather than picker-only, on Afham's explicit
 * instruction (2026-09-28): the value itself is a real, masked `TextInput`
 * (typing digits auto-inserts the `-` separators, same digit-stripping
 * approach as `PhoneField`) so the field is actually usable today, without
 * forcing the native-dependency decision a real picker needs. The calendar
 * glyph is its own separate `Pressable`. Both paths write to the same
 * `value`/`onChangeText`, so the field behaves the same either way.
 *
 * The glyph opens Android's own date dialog (@react-native-community/datetimepicker),
 * added 2026-10-18 on integration/viva-demo with the posting start picker
 * (Afham's decision; decisions.md). It opens on the year list, because a
 * birthdate is usually decades back, and starts on `pickerStart` when the
 * field is empty.
 */
import { Pressable, Text, TextInput, View, StyleSheet } from "react-native";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import Svg, { Path } from "react-native-svg";
import { colors, spacing, radius, typography } from "../theme/tokens";

/** "20040314" -> "2004-03-14"; stops adding a dash until the next digit arrives. */
function formatDigits(digits) {
  const d = digits.slice(0, 8);
  if (d.length <= 4) return d;
  if (d.length <= 6) return `${d.slice(0, 4)}-${d.slice(4)}`;
  return `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6)}`;
}

// A date-only value is held at NOON, never midnight. Sri Lanka's clock offset has changed over the
// years (+6:00 until 2006, +5:30 now), and at midnight the picker and JavaScript disagreeing by half
// an hour about a past year moved the picked day back by one (found on the emulator: 18 Oct 2000
// came back as 2000-10-17). Noon leaves hours of margin either way.
const NOON = 12;

/** Today's date `years` years back — a birthdate picker opens there (18: YouthLink's minimum age). */
export function yearsAgo(years) {
  const today = new Date();
  return new Date(today.getFullYear() - years, today.getMonth(), today.getDate(), NOON);
}

/** A local Date as "YYYY-MM-DD" (not toISOString, which would shift it to UTC). */
function toYmd(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** "2004-03-14" as a local Date, or null while the typed value is not a real date yet. */
function fromYmd(text) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), NOON);
  return date.getDate() === Number(match[3]) ? date : null;
}

/**
 * @param {string} label
 * @param {string} [value] - "YYYY-MM-DD", e.g. "2004-03-14".
 * @param {(value: string) => void} onChangeText
 * @param {string} [placeholder] - Defaults to "YYYY-MM-DD".
 * @param {Date} [minimumDate] - Earliest day the date dialog offers.
 * @param {Date} [maximumDate] - Latest day the date dialog offers.
 * @param {Date} [pickerStart] - Where the date dialog opens while the field is empty (default today).
 * @param {string} [error]
 * @param {() => void} [onFocus]
 * @param {(event: object) => void} [onLayout]
 */
export default function DateTimeField({
  label,
  value = "",
  onChangeText,
  placeholder = "YYYY-MM-DD",
  minimumDate,
  maximumDate,
  pickerStart,
  error,
  showErrorLine = false,
  onFocus,
  onLayout,
}) {
  function handleChange(text) {
    onChangeText(formatDigits(text.replace(/[^0-9]/g, "")));
  }

  function openPicker() {
    if (onFocus) onFocus();
    DateTimePickerAndroid.open({
      // OK / CANCEL in the brand colour, as on the posting start picker.
      positiveButton: { textColor: colors.brand.primary },
      negativeButton: { textColor: colors.brand.primary },
      mode: "date",
      value: fromYmd(value) || pickerStart || new Date(),
      minimumDate,
      maximumDate,
      startOnYearSelection: true,
      onValueChange: (_event, date) => onChangeText(toYmd(date)),
    });
  }

  return (
    <View style={styles.container} onLayout={onLayout}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.field, error && styles.fieldError]}>
        <TextInput
          style={[styles.value, value && styles.valueFilled]}
          value={value}
          onChangeText={handleChange}
          onFocus={onFocus}
          placeholder={placeholder}
          placeholderTextColor={colors.text.secondary}
          keyboardType="number-pad"
          maxLength={10}
          accessibilityLabel={label}
        />
        {/* hitSlop 18 makes the 12 px glyph a 48 x 48 touch target. */}
        <Pressable
          onPress={openPicker}
          hitSlop={18}
          accessibilityRole="button"
          accessibilityLabel={`Open date picker for ${label}`}
        >
          {/* Figma's own glyph (node 28:80): 12 x 12, stroke text/secondary 1.5,
              round caps and joins. overflow visible because the stroke extends
              past the 12px box (Figma insets the image by -6.25%). */}
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
      {showErrorLine && typeof error === "string" && error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // 6px — a literal in the real component, not a named spacing token.
    gap: 6,
  },
  label: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // Figma pads 12 with the 1px stroke INSIDE the 48px field; React Native
    // puts the border outside the padding, so it is subtracted (50px otherwise).
    padding: spacing.md - 1,
    borderWidth: 1,
    borderColor: colors.border.input,
    borderRadius: radius.input,
    backgroundColor: colors.bg.default,
  },
  fieldError: {
    padding: spacing.md - 1.5, // same compensation, for the 1.5px error stroke
    borderWidth: 1.5,
    borderColor: colors.border.error,
  },
  value: {
    flex: 1,
    ...typography.body,
    color: colors.text.secondary,
    padding: 0,
  },
  valueFilled: {
    color: colors.text.primary,
  },
  errorText: {
    ...typography.caption,
    color: colors.state.danger,
  },
});
