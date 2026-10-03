/**
 * Browse's `searchBar` (prototype 3.1, 3.3, 3.9) — Pawan.
 *
 * Not a text field: a 328×44 bar that opens Keyword search (3.7), where the typing happens. Drawn
 * from the frame — `color/bg/default` fill, `color/border/default` 1px stroke, radius 12, the search
 * glyph (12×12 ring at 14,14 with its 4×4 handle at 25,25, stroke 1.8) and "Search gigs" in
 * `mobile/secondary`, `color/text/secondary` at x 36.
 *
 * With no `onPress` it is inert, as on the offline Browse (3.1ofl): searching needs the server.
 */
import { Pressable, Text, StyleSheet } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { colors, radius, typography } from "../../../theme/tokens";

/** @param {{ onPress?: () => void }} props */
export default function SearchBar({ onPress }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={styles.bar}
      accessibilityRole="search"
      accessibilityLabel="Search gigs"
      accessibilityState={{ disabled: !onPress }}
    >
      {/* A 20×20 box with 1px to spare around the ring, so its stroke is not clipped: the ring
          (12×12) sits at 14,14 of the bar and the handle runs to 29,29. */}
      <Svg width={20} height={20} viewBox="0 0 20 20" fill="none" style={styles.glyph}>
        <Circle cx={7} cy={7} r={6} stroke={colors.text.secondary} strokeWidth={1.8} />
        <Path d="M11.5 11.5L15.5 15.5" stroke={colors.text.secondary} strokeWidth={1.8} strokeLinecap="round" />
      </Svg>
      <Text style={styles.placeholder}>Search gigs</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: radius.sheet, // r12
    backgroundColor: colors.bg.default,
  },
  // Ring at x 14: the bar's 1px border + 12 + the box's own 1px margin.
  glyph: {
    marginLeft: 12,
  },
  // Text at x 36: 1 border + 12 + 20 glyph box + 3.
  placeholder: {
    ...typography.secondary,
    color: colors.text.secondary,
    marginLeft: 3,
  },
});
