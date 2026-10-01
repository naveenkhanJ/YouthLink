/**
 * Display/MapArea — real Figma component (node 40:148, "Components /
 * Display" page, found 2026-09-28). New — nothing existed for this
 * before as a SHARED component. Per its own description: "honest flat
 * vector, no imagery" — deliberately not a real map tile.
 *
 * NOTE for Afham: `mobile/src/components/LocationDisplay.js` and
 * `MapPinDisplay.js` already exist (Lahiru's, commit `e6d802f`, already
 * on `develop`) and serve a similar purpose for FR-POST-08, but they
 * don't match this real component at all — raw hex colours throughout,
 * a rings/pulse/badge treatment with coordinate text, not the flat
 * grid+oval / grid+pin shape the real `Display/MapArea` draws. Worth
 * raising with Lahiru; not touched here — that's his module's already-
 * merged file, not this pass's to rebuild or replace.
 *
 * Kind=Area: a tinted shape + a computed label, NEVER a pin — FR-POST-08
 * only ever releases the precise address as a pin to a selected worker;
 * browse/detail surfaces must not show one, so don't reach for
 * kind="precisePin" there. Kind=PrecisePin: the location picker and
 * contact-reveal/selected-worker surfaces only.
 */
import { Text, View, StyleSheet } from "react-native";
import { colors, radius, typography } from "../theme/tokens";

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
        <View style={styles.areaShape}>
          <Text style={styles.areaLabel}>{areaLabel}</Text>
        </View>
      ) : (
        <View style={styles.pinWrap}>
          <View style={styles.pinHead} />
          <View style={styles.pinPoint} />
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
  areaShape: {
    width: "55%",
    height: "70%",
    borderRadius: 999,
    backgroundColor: "rgba(17, 24, 39, 0.16)",
    alignItems: "center",
    justifyContent: "center",
  },
  areaLabel: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  pinWrap: {
    alignItems: "center",
  },
  pinHead: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.brand.primary,
  },
  pinPoint: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: colors.brand.primary,
    marginTop: -2,
  },
});
