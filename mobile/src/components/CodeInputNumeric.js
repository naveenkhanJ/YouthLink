/**
 * Input/CodeInputNumeric — real Figma component (node 14:62, "Components
 * / Inputs" page, found 2026-09-28). New — nothing existed for this
 * before. 6-digit numeric entry for OTP (1.3/1.7) and checkpoint codes
 * (5.5) — NOT for endorsement codes, which are alphanumeric and
 * deliberately shaped differently (see `CodeInputAlpha`, M8 rule: the two
 * must not look alike).
 *
 * Six separate boxes, each one digit, auto-advancing focus — the real
 * component only draws the static boxes; the auto-advance/backspace
 * behaviour is this file's own, standard implementation of "a 6-box code
 * input" on top of that shape.
 */
import { useRef } from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";
import { colors, spacing, radius, typography } from "../theme/tokens";

const DIGIT_COUNT = 6;

/**
 * @param {string} value - Up to 6 digits.
 * @param {(value: string) => void} onChangeText
 * @param {string} [error] - Shown below the boxes; also reddens them.
 */
export default function CodeInputNumeric({ value = "", onChangeText, error }) {
  const inputRefs = useRef([]);
  const digits = value.split("");

  function handleChangeAt(index, text) {
    const digit = text.replace(/[^0-9]/g, "").slice(-1);
    const next = value.split("");
    next[index] = digit ?? "";
    const joined = next.join("").slice(0, DIGIT_COUNT);
    onChangeText(joined);
    if (digit && index < DIGIT_COUNT - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyPress(index, key) {
    if (key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {Array.from({ length: DIGIT_COUNT }).map((_, i) => (
          <TextInput
            key={i}
            ref={(el) => (inputRefs.current[i] = el)}
            style={[styles.box, error && styles.boxError]}
            value={digits[i] ?? ""}
            onChangeText={(text) => handleChangeAt(i, text)}
            onKeyPress={({ nativeEvent }) => handleKeyPress(i, nativeEvent.key)}
            keyboardType="number-pad"
            maxLength={1}
            accessibilityLabel={`Digit ${i + 1} of ${DIGIT_COUNT}`}
          />
        ))}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
    textAlign: "center",
    ...typography.displayNumber,
    color: colors.text.primary,
  },
  boxError: {
    borderColor: colors.border.error,
  },
  errorText: {
    ...typography.caption,
    color: colors.state.danger,
  },
});
