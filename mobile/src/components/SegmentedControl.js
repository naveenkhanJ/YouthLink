/**
 * Input/SegmentedControl — real Figma component (node 28:12, "Components /
 * Inputs" page, found 2026-09-28). New — nothing existed for this before.
 *
 * Posting-as choice (1.5/1.16, FR-ACC-02): Individual/Household vs
 * Business. Business selection reveals businessName/businessBio fields,
 * composed at screen level, not in this control — this is just the
 * two-way switch itself. Segment widths in Figma reflect each instance's
 * own label length (auto-layout), not a fixed ratio — built with equal
 * `flex: 1` segments instead, the correct general behaviour for arbitrary
 * label text.
 */
import { Pressable, Text, View, StyleSheet } from "react-native";
import { colors, spacing, radius, typography } from "../theme/tokens";

/**
 * @param {"individual"|"business"} selected
 * @param {(value: "individual"|"business") => void} onChange
 * @param {string} [individualLabel] - Defaults to "Individual/Household".
 * @param {string} [businessLabel] - Defaults to "Business".
 */
export default function SegmentedControl({
  selected,
  onChange,
  individualLabel = "Individual/Household",
  businessLabel = "Business",
}) {
  return (
    <View style={styles.track}>
      {[
        { value: "individual", label: individualLabel },
        { value: "business", label: businessLabel },
      ].map((segment) => {
        const isSelected = selected === segment.value;
        return (
          <Pressable
            key={segment.value}
            onPress={() => onChange(segment.value)}
            style={[styles.segment, isSelected && styles.segmentSelected]}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
          >
            <Text style={[styles.label, { color: isSelected ? colors.text.inverse : colors.text.primary }]}>
              {segment.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: "row",
    gap: 2,
    padding: 2,
    borderRadius: radius.input,
    backgroundColor: colors.bg.subtle,
  },
  // Figma sizes each segment to its label and then shares the leftover width
  // equally (207.5 / 114.5 at 328px), so grow from the content width instead of
  // flex:1, which would force two equal halves.
  segment: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 6,
  },
  segmentSelected: {
    backgroundColor: colors.brand.primary,
  },
  label: {
    ...typography.bodyMedium,
  },
});
