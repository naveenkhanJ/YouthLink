/**
 * Brand/Wordmark — real Figma component (node 2701:74, "Components /
 * Display" page, found 2026-09-28). New — nothing existed for this
 * before. The `Mark` (found and built the same session) plus "YouthLink"
 * set in Archivo Bold — the real component's own description: "the face
 * the brand source specifies... the UI type ramp stays Inter; this is
 * the only place Archivo appears." Font loaded once at the app root
 * (`App.js`), not here — this file assumes `Archivo_700Bold` is already
 * available by the time it renders.
 *
 * Size drives both the mark's scale and the text size/tracking together
 * — these aren't independently choosable, they're the three real
 * lockups the component actually draws: Compact (24px mark, 18px text),
 * Display (40px mark, 30px text — the default), Hero (64px mark, 48px
 * text). Tone follows `Mark`'s own rule: OnLight (brand blue) for
 * light grounds, OnBrand (white) for brand-blue/ink grounds.
 */
import { Text, View, StyleSheet } from "react-native";
import { colors } from "../theme/tokens";
import Mark from "./Mark";

const SIZES = {
  compact: { mark: 24, gap: 4.8, fontSize: 18, letterSpacing: -0.63 },
  display: { mark: 40, gap: 8, fontSize: 30, letterSpacing: -1.05 },
  hero: { mark: 64, gap: 12.8, fontSize: 48, letterSpacing: -1.68 },
};

/**
 * @param {"compact"|"display"|"hero"} [size] - Defaults to "display".
 * @param {"onLight"|"onBrand"} [tone] - Defaults to "onLight".
 */
export default function Wordmark({ size = "display", tone = "onLight" }) {
  const spec = SIZES[size];
  const textColor = tone === "onBrand" ? colors.text.inverse : colors.brand.primary;
  return (
    <View style={[styles.row, { gap: spec.gap }]}>
      <Mark tone={tone} size={spec.mark} />
      <Text
        style={[
          styles.text,
          { fontSize: spec.fontSize, letterSpacing: spec.letterSpacing, color: textColor },
        ]}
      >
        YouthLink
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontFamily: "Archivo_700Bold",
  },
});
