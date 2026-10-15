/**
 * True when the person has asked the phone to reduce motion (Android: Settings > Accessibility >
 * Remove animations). Every decorative animation in the app checks this and stays still instead:
 * the loading pulse, the toast's slide, the press effects (WCAG 2.3.3, animation from interactions).
 *
 * Usage: `const reduceMotion = useReducedMotion();` It is false until the setting has been read,
 * which takes one render; an animation that starts in that moment is harmless.
 */
import { useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";

export default function useReducedMotion() {
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((value) => {
      if (mounted) setReduceMotion(value);
    });
    // The setting can change while the app is open.
    const subscription = AccessibilityInfo.addEventListener("reduceMotionChanged", setReduceMotion);
    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);
  return reduceMotion;
}
