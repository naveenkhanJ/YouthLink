/**
 * Input/CodeInputNumeric — real Figma component (node 14:62, "Components
 * / Inputs" page, found 2026-09-28). New — nothing existed for this
 * before. 6-digit numeric entry for OTP (1.3/1.7) and checkpoint codes
 * (5.5) — NOT for endorsement codes, which are alphanumeric and
 * deliberately shaped differently (see `CodeInputAlpha`, M8 rule: the two
 * must not look alike).
 *
 * Six boxes are drawn, but they are only display: one real TextInput sits invisibly over the
 * row and owns the value. That is what makes paste, backspace, the keyboard's one-time-code
 * suggestion and Android SMS autofill work (six separate inputs each accept one character, so a
 * pasted or autofilled code was lost — E2E-09). Tapping anywhere on the row focuses it.
 */
import { useRef, useState } from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";
import { colors, spacing, radius, typography } from "../theme/tokens";
import { fill } from "../theme/layout";

const DIGIT_COUNT = 6;

/**
 * @param {string} value - Up to 6 digits.
 * @param {(value: string) => void} onChangeText
 * @param {string} [error] - Shown below the boxes; also reddens them.
 */
export default function CodeInputNumeric({ value = "", onChangeText, error, showErrorLine = false }) {
  const inputRef = useRef(null);
  const [focused, setFocused] = useState(false);
  const digits = value.split("");
  // The box the next digit will land in (none once all six are filled).
  const activeIndex = Math.min(digits.length, DIGIT_COUNT - 1);

  function handleChange(text) {
    onChangeText(text.replace(/[^0-9]/g, "").slice(0, DIGIT_COUNT));
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {Array.from({ length: DIGIT_COUNT }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.box,
              focused && i === activeIndex && styles.boxFocused,
              error && styles.boxError,
            ]}
          >
            <Text style={styles.digit}>{digits[i] ?? ""}</Text>
          </View>
        ))}
        <TextInput
          ref={inputRef}
          style={styles.hiddenInput}
          value={value}
          onChangeText={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          keyboardType="number-pad"
          maxLength={DIGIT_COUNT}
          textContentType="oneTimeCode"
          autoComplete="sms-otp"
          caretHidden
          contextMenuHidden={false}
          accessibilityLabel={`${DIGIT_COUNT}-digit code`}
        />
      </View>
      {showErrorLine && typeof error === "string" && error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  row: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  box: {
    flex: 1,
    height: 52,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: radius.input,
    backgroundColor: colors.bg.default,
    alignItems: "center",
    justifyContent: "center",
  },
  digit: {
    ...typography.displayNumber,
    color: colors.text.primary,
  },
  // Covers the whole row and is invisible, so any tap or long-press (paste) reaches it.
  hiddenInput: {
    ...fill,
    opacity: 0.02,
    color: "transparent",
  },
  // Figma draws every box with a 1px stroke and no focus state. The box about to receive a digit
  // only changes colour here, never width, so the row does not shift and a red error border is
  // the same thickness on every box.
  boxFocused: {
    borderColor: colors.brand.primary,
  },
  boxError: {
    borderColor: colors.border.error,
  },
  errorText: {
    ...typography.caption,
    color: colors.state.danger,
  },
});
