/**
 * Input/RoleOption — real Figma component (node 26:15, "Components /
 * Inputs" page, found 2026-09-28). New in the shared kit — the only
 * existing version was a one-off in `screens/account/components/`, built
 * against that module's own (confirmed-wrong) `theme.js`.
 *
 * Real fixes vs. the old local version, not guessable from the text spec:
 * selecting a card does NOT change its background — only the border
 * (1.5px default, 2px brand/primary when selected). The old version also
 * tinted the background on selection. Description text is `mobile/
 * secondary` (14px), not a 12px caption — the old version used the
 * smaller size.
 */
import { Pressable, Text, View, StyleSheet } from "react-native";
import { colors, spacing, radius, typography } from "../theme/tokens";

/**
 * @param {string} title
 * @param {string} description
 * @param {boolean} selected
 * @param {() => void} onPress
 */
export default function RoleOption({ title, description, selected, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, selected ? styles.cardSelected : styles.cardDefault]}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
    >
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected ? <View style={styles.radioDot} /> : null}
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.input,
    backgroundColor: colors.bg.default,
  },
  cardDefault: {
    borderWidth: 1.5,
    borderColor: colors.border.default,
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: colors.brand.primary,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.border.default,
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    borderWidth: 2,
    borderColor: colors.brand.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.brand.primary,
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  description: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
});
