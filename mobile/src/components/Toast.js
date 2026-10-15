/**
 * A short message at the foot of the screen that goes away by itself. Not drawn in Figma: used
 * only where the app must say something the prototype has no frame for, such as tapping a row
 * whose screen belongs to a part of the app that is not in this build. Built from the tokens
 * (text/primary ground, text/inverse copy, 8 radius, mobile/secondary).
 *
 * Usage: `const { show, toast } = useToast();` call `show("...")`, render `{toast}` last in the
 * screen's root View.
 */
import { useEffect, useRef, useState } from "react";
import { Animated, Text, StyleSheet } from "react-native";
import { colors, spacing, typography } from "../theme/tokens";
import useReducedMotion from "../hooks/useReducedMotion";

const VISIBLE_MS = 2500;
// It fades in while rising this far into place, and sinks back as it fades out. Short, so the
// message is readable at once; without it the toast blinked on and off.
const ENTER_MS = 180;
const EXIT_MS = 160;
const RISE_DP = 8;

/** @param {number} [bottom] - Distance from the bottom edge; raise it to clear a TabBar. */
export function useToast(bottom = spacing.xl) {
  const [message, setMessage] = useState(null);
  const timer = useRef(null);
  const shown = useRef(new Animated.Value(0)).current; // 0 hidden, 1 in place
  const reduceMotion = useReducedMotion();
  useEffect(() => () => clearTimeout(timer.current), []);

  function show(text) {
    setMessage(text);
    clearTimeout(timer.current);
    shown.stopAnimation();
    if (reduceMotion) shown.setValue(1);
    else Animated.timing(shown, { toValue: 1, duration: ENTER_MS, useNativeDriver: true }).start();
    timer.current = setTimeout(hide, VISIBLE_MS);
  }

  function hide() {
    if (reduceMotion) {
      setMessage(null);
      return;
    }
    // Removed only once it has faded, so it never vanishes mid-fade.
    Animated.timing(shown, { toValue: 0, duration: EXIT_MS, useNativeDriver: true }).start(({ finished }) => {
      if (finished) setMessage(null);
    });
  }

  const translateY = shown.interpolate({ inputRange: [0, 1], outputRange: [RISE_DP, 0] });
  const toast = message ? (
    <Animated.View
      style={[styles.toast, { bottom, opacity: shown, transform: [{ translateY }] }]}
      pointerEvents="none"
      accessibilityLiveRegion="polite"
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  ) : null;

  return { show, toast };
}

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    left: spacing.lg,
    right: spacing.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    backgroundColor: colors.text.primary,
  },
  text: {
    ...typography.secondary,
    color: colors.text.inverse,
  },
});
