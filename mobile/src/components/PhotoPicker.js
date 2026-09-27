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
            <Text style={styles.thumbGlyph}>🖼</Text>
          </View>
        ))}
        {canAddMore ? (
          <Pressable onPress={onAdd} style={styles.addTile} accessibilityRole="button" accessibilityLabel="Add a photo">
            <Text style={styles.addGlyph}>+</Text>
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
  addTile: {
    width: 72,
    height: 72,
    borderRadius: radius.input,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.border.default,
    alignItems: "center",
    justifyContent: "center",
  },
  addGlyph: {
    fontSize: 20,
    color: colors.brand.primary,
  },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: radius.input,
    backgroundColor: colors.bg.subtle,
    alignItems: "center",
    justifyContent: "center",
  },
  thumbGlyph: {
    fontSize: 20,
    color: colors.text.secondary,
  },
  caption: {
    ...typography.caption,
    color: colors.text.secondary,
  },
});
