/**
 * Display/MapArea — real Figma component (node 40:148, "Components /
 * Display" page, found 2026-09-28). New — nothing existed for this
 * before as a SHARED component. Per its own description: "honest flat
 * vector, no imagery" — deliberately not a real map tile.
 *
 * Replaces `LocationDisplay.js` and `MapPinDisplay.js` (the Gig Posting owner's earlier
 * FR-POST-08 components: raw hex colours and a rings/pulse/coordinate-text treatment that
 * does not match this flat grid component). Nothing imported them, so both were deleted.
 *
 * Kind=Area: a tinted shape + a computed label, NEVER a pin — FR-POST-08
 * only ever releases the precise address as a pin to a selected worker;
 * browse/detail surfaces must not show one, so don't reach for
 * kind="precisePin" there. Kind=PrecisePin: the location picker and
 * contact-reveal/selected-worker surfaces only.
 */
import { Text, View, StyleSheet } from "react-native";
import Svg, { Path, Circle, Ellipse } from "react-native-svg";
import { colors, radius, spacing, typography } from "../theme/tokens";

/**
 * @param {"area"|"precisePin"} kind
 * @param {string} [areaLabel] - "area" kind only, e.g. "Nugegoda area".
 */
export default function MapArea({ kind = "area", areaLabel }) {
  return (
    <View style={styles.box}>
      <View style={[styles.gridLine, styles.gridH, { top: "25%" }]} />
      <View style={[styles.gridLine, styles.gridH, { top: "50%" }]} />
      <View style={[styles.gridLine, styles.gridH, { top: "75%" }]} />
      <View style={[styles.gridLine, styles.gridV, { left: "20%" }]} />
      <View style={[styles.gridLine, styles.gridV, { left: "40%" }]} />
      <View style={[styles.gridLine, styles.gridV, { left: "60%" }]} />
      <View style={[styles.gridLine, styles.gridV, { left: "80%" }]} />
      {kind === "area" ? (
        <>
          {/* The shape is a true ellipse (React Native's borderRadius can only draw a pill), and the
              label is centred across the whole map, not squeezed inside the shape, so a long area
              name wraps at the map's width as in the frame. */}
          <Svg width={180} height={110} viewBox="0 0 180 110">
            <Ellipse cx={90} cy={55} rx={90} ry={55} fill={colors.brand.primary} fillOpacity={0.15} />
          </Svg>
          <Text style={styles.areaLabel}>{areaLabel}</Text>
        </>
      ) : (
        // Figma 40:138: the pin is a 24 x 32 path (brand.primary) with an 8px
        // bg/subtle dot, its top 48px down in the 160px map and centred across.
        <View style={styles.pinWrap}>
          <Svg width={24} height={32} viewBox="0 0 24 32">
            <Path
              d="M12 0C5.4 0 0 5.4 0 12C0 21 12 32 12 32C12 32 24 21 24 12C24 5.4 18.6 0 12 0Z"
              fill={colors.brand.primary}
            />
            <Circle cx={12} cy={12} r={4} fill={colors.bg.subtle} />
          </Svg>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    height: 160,
    width: "100%",
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: radius.input,
    backgroundColor: colors.bg.subtle,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  gridLine: {
    position: "absolute",
    backgroundColor: colors.border.default,
  },
  gridH: {
    left: 0,
    right: 0,
    height: 1,
  },
  gridV: {
    top: 0,
    bottom: 0,
    width: 1,
  },
  // Figma `areaShape` (40:136): a 180 x 110 ellipse filled color/brand/primary at 15% opacity, centred
  // (read from the frame's own SVG; an earlier black-at-15% pill only approximated it).
  areaLabel: {
    ...typography.bodyMedium,
    color: colors.text.primary,
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    paddingHorizontal: spacing.md,
  },
  pinWrap: {
    position: "absolute",
    top: 48 - 1, // 48 from the map's outer top edge; RN positions inside the 1px border
    alignSelf: "center",
  },
});
