/**
 * Display/PhotoPicker — real Figma component (node 198:61, "Components /
 * Display" page, found 2026-09-28). New — nothing existed for this
 * before. Minimal evidence picker (9.3, FR-DISPUTE-05).
 *
 * Real, non-obvious rule from the component's own description: caps are
 * enforced AT the picker itself — the add tile disappears once the
 * limit is reached, rather than letting a caller submit past it. Evidence
 * is optional; its absence never blocks a dispute review — don't wire
 * this as a required field.
 */
import { Pressable, Text, View, StyleSheet } from "react-native";
import Svg, { Rect, Path, Circle } from "react-native-svg";
import { colors, radius, typography } from "../theme/tokens";

const MAX_PHOTOS = 3;
const MAX_SIZE_MB = 5;

/**
 * @param {string[]} photos - Local URIs, up to MAX_PHOTOS.
 * @param {() => void} onAdd
 */
export default function PhotoPicker({ photos = [], onAdd }) {
  const canAddMore = photos.length < MAX_PHOTOS;
  return (
    <View style={styles.container}>
      <View style={styles.tiles}>
        {photos.map((uri, i) => (
          <View key={i} style={styles.thumb}>
            {/* Figma `icon-image` (24 x 24): a 20 x 10 mountain outline at (2,8) and
                a 5px sun ring at (15,3), stroke text/secondary 1.5. */}
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path
                d="M2 18L9 8L14 14L17 11L22 18L2 18Z"
                stroke={colors.text.secondary}
                strokeWidth={1.5}
                strokeLinejoin="round"
              />
              <Circle cx={17.5} cy={5.5} r={1.75} stroke={colors.text.secondary} strokeWidth={1.5} />
            </Svg>
          </View>
        ))}
        {canAddMore ? (
          <Pressable onPress={onAdd} style={styles.addTile} accessibilityRole="button" accessibilityLabel="Add a photo">
            {/* Figma `addTile`: a 72px rounded square with a 1.5px border/default
                stroke dashed 4 on / 4 off, drawn INSIDE the shape, and a 16px
                brand.primary plus (stroke 2) at (28,28). RN's own dashed border
                cannot set the dash lengths, so the outline is an SVG rect. */}
            <Svg width={72} height={72} viewBox="0 0 72 72" fill="none" style={StyleSheet.absoluteFill}>
              <Rect
                x={0.75}
                y={0.75}
                width={70.5}
                height={70.5}
                rx={7.25}
                stroke={colors.border.default}
                strokeWidth={1.5}
                strokeDasharray="4 4"
              />
              <Path d="M36 28L36 44M28 36L44 36" stroke={colors.brand.primary} strokeWidth={2} strokeLinecap="round" />
            </Svg>
          </Pressable>
        ) : null}
      </View>
      <Text style={styles.caption}>
        {photos.length > 0
          ? `${photos.length} of ${MAX_PHOTOS} · up to ${MAX_SIZE_MB}MB each`
          : `Up to ${MAX_PHOTOS} images, ${MAX_SIZE_MB}MB each`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  tiles: {
    flexDirection: "row",
    gap: 8,
  },
  // The dashed outline and the plus are drawn by the SVG inside; this is only
  // the 72px hit area.
  addTile: {
    width: 72,
    height: 72,
  },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: radius.input,
    backgroundColor: colors.bg.subtle,
    alignItems: "center",
    justifyContent: "center",
  },
  caption: {
    ...typography.caption,
    color: colors.text.secondary,
  },
});
