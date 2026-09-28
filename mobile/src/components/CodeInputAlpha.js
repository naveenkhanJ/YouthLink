/**
 * Input/CodeInputAlpha — real Figma component (node 17:17, "Components /
 * Inputs" page, found 2026-09-28). New — nothing existed for this
 * before. 6-character ALPHANUMERIC endorsement-code entry (8.2) —
 * deliberately NOT shaped like `CodeInputNumeric`'s per-digit boxes (M8
 * rule: the two must not look alike, since one is an OTP and the other
 * isn't). Single wide, tracked field; dashed `badge/endorsed` (purple)
 * border when empty, solid when filled, `border/error` red on error.
 * `typography.code` (20px Semi Bold, 6px letter-spacing) is the exact
 * existing token for this — matches the real component precisely.
 */
import { View, TextInput, Text, StyleSheet } from "react-native";
import { colors, spacing, radius, typography } from "../theme/tokens";

/**
 * @param {string} value
 * @param {(value: string) => void} onChangeText
 * @param {string} [error]
 */
export default function CodeInputAlpha({ value = "", onChangeText, error }) {
  const isFilled = value.length > 0;
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Endorsement code</Text>
      <View
        style={[
          styles.field,
          isFilled ? styles.fieldFilled : styles.fieldEmpty,
          error && styles.fieldError,
        ]}
      >
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={(text) => onChangeText(text.toUpperCase().slice(0, 6))}
          placeholder="ABC123"
          placeholderTextColor={colors.text.secondary}
          autoCapitalize="characters"
          maxLength={6}
          accessibilityLabel="Endorsement code"
        />
      </View>
      <Text style={[styles.helper, error && styles.helperError]}>
        {error || "Letters and numbers — not like an SMS code."}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  label: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  field: {
    height: 56,
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    borderRadius: radius.input,
    backgroundColor: colors.bg.default,
  },
  fieldEmpty: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: colors.badge.endorsed,
  },
  fieldFilled: {
    borderWidth: 2,
    borderColor: colors.badge.endorsed,
  },
  fieldError: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.border.error,
  },
  input: {
    ...typography.code,
    color: colors.text.primary,
    padding: 0,
  },
  helper: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  helperError: {
    color: colors.state.danger,
  },
});
