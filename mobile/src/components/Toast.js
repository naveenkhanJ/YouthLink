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
import { Text, View, StyleSheet } from "react-native";
import { colors, spacing, typography } from "../theme/tokens";

const VISIBLE_MS = 2500;

/** @param {number} [bottom] - Distance from the bottom edge; raise it to clear a TabBar. */
export function useToast(bottom = spacing.xl) {
  const [message, setMessage] = useState(null);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  function show(text) {
    setMessage(text);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(null), VISIBLE_MS);
  }

  const toast = message ? (
    <View style={[styles.toast, { bottom }]} pointerEvents="none" accessibilityLiveRegion="polite">
      <Text style={styles.text}>{message}</Text>
    </View>
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
