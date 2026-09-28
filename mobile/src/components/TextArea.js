/**
 * Input/TextArea — real Figma component (node 3403:104, "Components /
 * Inputs" page, found 2026-09-28). New — nothing existed for this
 * before; per its own description, two screens (6.4, 6.5) hand-built
 * this shape twice before it became a shared component.
 *
 * Multi-line text entry — the single-line `TextField` is a fixed 48px
 * tall and can't hold a paragraph.
 */
import { TextInput, StyleSheet } from "react-native";
import { colors, spacing, radius, typography } from "../theme/tokens";

/**
 * @param {string} value
 * @param {(text: string) => void} onChangeText
 * @param {string} [placeholder]
 * @param {boolean} [error]
 * @param {number} [maxLength]
 */
export default function TextArea({ value, onChangeText, placeholder, error = false, maxLength }) {
  return (
    <TextInput
      style={[styles.field, error && styles.fieldError]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.text.secondary}
      multiline
      textAlignVertical="top"
      maxLength={maxLength}
    />
  );
}

const styles = StyleSheet.create({
  field: {
    minHeight: 96,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: radius.input,
    backgroundColor: colors.bg.default,
    ...typography.body,
    color: colors.text.primary,
  },
  fieldError: {
    borderColor: colors.border.error,
  },
});
