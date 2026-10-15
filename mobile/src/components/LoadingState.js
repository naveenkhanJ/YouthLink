/**
 * Feedback/LoadingState — real Figma component (node 45:18, "Components /
 * Feedback" page, found 2026-09-28; this file previously drew 4 uniform
 * 48px blocks with no card, guessed from the text spec alone). The real
 * component is a bordered card mimicking a real content row's shape — one
 * title-sized bar plus three body-sized bars of specific, non-uniform
 * widths — not identical blocks. "Static representation — animation is
 * implementation" per its own description, so a shimmer/pulse is fair
 * game to add later. Added 2026-10-15: the skeleton pulses gently (below),
 * and stays static when the phone is set to reduce motion.
 *
 * Deliberate difference from Figma (Afham, 2026-10-16, viva demo branch):
 * the card has a white fill (bg/default). Figma draws it unfilled with
 * bg/subtle bars, and almost every screen it sits on is bg/subtle, so the
 * bars were the page's own colour and only the outline showed. Filled, it
 * looks like the white cards it stands in for.
 *
 * Button-level loading lives in `Action/Button`'s own Loading state
 * (`Button.js`'s `loading` prop), not here.
 */
import { useEffect, useRef } from "react";
import { Animated, View, StyleSheet } from "react-native";
import { colors, radius } from "../theme/tokens";
import useReducedMotion from "../hooks/useReducedMotion";

const BARS = [
  { height: 16, width: 200 },
  { height: 12, width: 296 },
  { height: 12, width: 296 },
  { height: 12, width: 140 },
];

// One pulse: the bars dim to this opacity and back, in this many ms each way. Slow and shallow on
// purpose: it says "still working" without drawing the eye, and a static block looked frozen.
const PULSE_LOW = 0.45;
const PULSE_MS = 750;

export default function LoadingState() {
  const opacity = useRef(new Animated.Value(1)).current;
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) {
      opacity.setValue(1); // the static bars, as specified, for anyone who asked for less motion
      return undefined;
    }
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: PULSE_LOW, duration: PULSE_MS, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: PULSE_MS, useNativeDriver: true }),
      ]),
    );
    pulse.start();
    return () => pulse.stop(); // stops when the content arrives and this unmounts
  }, [opacity, reduceMotion]);

  // The whole card pulses, fill and outline included, so the page reads as "still loading".
  return (
    <Animated.View style={[styles.container, { opacity }]} accessibilityLabel="Loading">
      {BARS.map((bar, i) => (
        <View key={i} style={[styles.bar, { height: bar.height, width: bar.width }]} />
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    padding: 16 - 1, // Figma: 16 with the 1px stroke inside (114px tall); RN's border is outside
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: radius.input,
    backgroundColor: colors.bg.default, // see the header: not in Figma, decided 2026-10-16
    alignItems: "flex-start",
  },
  bar: {
    borderRadius: 4,
    backgroundColor: colors.bg.subtle,
  },
});
