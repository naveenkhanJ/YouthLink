/**
 * Input/StarInput — real Figma component (node 28:75, "Components /
 * Inputs" page, found 2026-09-28). New — nothing existed for this before.
 *
 * Five tappable WHOLE stars (6.1, FR-RATE-01) — no half-star, no free
 * text. The real component's own note: "count conveyed by text echo
 * ('3 of 5 stars'), never fill colour alone" — the text echo is shown
 * whenever at least one star is selected. Stars are Figma's own 28px
 * solid star shape (see StarShape.js): filled ones in color/badge/rating,
 * empty ones in color/border/default, 8px apart. Star colour is
 * `color/badge/rating` — the register's own adjacency rule keeps rating
 * stars out of any context with urgent/danger colours, which is exactly
 * why this is its own distinct token rather than reusing `state.danger`
 * or `state.urgent`.
 */
import { Pressable, Text, View, StyleSheet } from "react-native";
import StarShape from "./StarShape";
import { colors, spacing, typography } from "../theme/tokens";

const STAR_COUNT = 5;

/**
 * @param {number} value - 0-5.
 * @param {(value: number) => void} onChange
 */
export default function StarInput({ value = 0, onChange }) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {Array.from({ length: STAR_COUNT }, (_, i) => i + 1).map((star) => (
          <Pressable
            key={star}
            onPress={() => onChange(star)}
            hitSlop={spacing.xs}
            accessibilityRole="button"
            accessibilityLabel={`${star} star${star === 1 ? "" : "s"}`}
          >
            <StarShape
              size={28}
              color={star <= value ? colors.badge.rating : colors.border.default}
            />
          </Pressable>
        ))}
      </View>
      {value > 0 ? (
        <Text style={styles.echo}>
          {value} of {STAR_COUNT} stars
        </Text>
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
    gap: spacing.sm, // Figma 28:75: 28px stars 8px apart
  },
  echo: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
});
