/**
 * Scrolls a focused form field to a fixed distance below the top of its ScrollView.
 *
 * Why not the keyboard-aware scroll view: the navigator already pads the whole screen above the
 * keyboard (RootNavigator), so that library, which assumes the window did NOT move, decided the
 * focused field was already clear of the keyboard and left the last fields flush with the pinned
 * bar, their counters out of view. Here the position does not depend on where the keyboard is: the
 * field goes `margin` dp from the top, which leaves room below it for its counter or error line.
 *
 * Usage: `const field = useFocusScroll(scrollRef);` then `<TextField {...field("nic")} />`.
 * The ScrollView needs spare room at the bottom (paddingBottom) so the last fields can scroll up.
 */
import { useCallback, useEffect, useRef } from "react";
import { Keyboard } from "react-native";

/**
 * @param {{ current: import("react-native").ScrollView | null }} scrollRef
 * @param {{ margin?: number }} [options]
 * @returns {(name: string) => { onLayout: (event: object) => void, onFocus: () => void }}
 */
export default function useFocusScroll(scrollRef, { margin = 120 } = {}) {
  const tops = useRef({}); // field name -> y of the field inside the scroll content
  const focused = useRef(null);

  const scrollToField = useCallback(
    (name) => {
      const y = tops.current[name];
      if (y == null) return;
      scrollRef.current?.scrollTo({ y: Math.max(0, y - margin), animated: true });
    },
    [scrollRef, margin],
  );

  // The first focus opens the keyboard, which shrinks the visible area a moment later: scroll again
  // once it is up.
  useEffect(() => {
    const sub = Keyboard.addListener("keyboardDidShow", () => {
      if (focused.current) scrollToField(focused.current);
    });
    return () => sub.remove();
  }, [scrollToField]);

  return (name) => ({
    onLayout: (event) => {
      tops.current[name] = event.nativeEvent.layout.y;
    },
    onFocus: () => {
      focused.current = name;
      scrollToField(name);
    },
  });
}
