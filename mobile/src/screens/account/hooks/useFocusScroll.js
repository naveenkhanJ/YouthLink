/**
 * Scrolls a focused form field to a fixed distance below the top of its ScrollView.
 *
 * Why not the keyboard-aware scroll view: the navigator already pads the whole screen above the
 * keyboard (RootNavigator), so that library, which assumes the window did NOT move, decided the
 * focused field was already clear of the keyboard and left the last fields flush with the pinned
 * bar, their counters out of view. Here the position does not depend on where the keyboard is: the
 * field goes `margin` dp from the top, which leaves room below it for its counter or error line.
 *
 * Usage: `const { field, scrollProps } = useFocusScroll(scrollRef);` then
 * `<ScrollView ref={scrollRef} {...scrollProps}>` and `<TextField {...field("nic")} />`.
 * The ScrollView needs spare room at the bottom (paddingBottom) so the last fields can scroll up.
 *
 * Timing: the visible area only shrinks AFTER the keyboard is up (the navigator pads the screen), and
 * a scroll asked for before that is cut short by the old, taller area. So the scroll is repeated
 * whenever the ScrollView itself is laid out again (its height changed) while a field has focus.
 */
import { useCallback, useEffect, useRef } from "react";
import { Keyboard } from "react-native";

/**
 * @param {{ current: import("react-native").ScrollView | null }} scrollRef
 * @param {{ margin?: number }} [options]
 * @returns {{ field: (name: string) => { onLayout: (event: object) => void, onFocus: () => void },
 *   scrollProps: { onLayout: () => void } }}
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

  // Fallback for the first focus: scroll again shortly after the keyboard is up. The reliable trigger
  // is the ScrollView's own layout (below); forget the focused field when the keyboard goes away.
  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () => {
      const name = focused.current;
      if (name) setTimeout(() => scrollToField(name), 150);
    });
    const hide = Keyboard.addListener("keyboardDidHide", () => {
      focused.current = null;
    });
    return () => {
      show.remove();
      hide.remove();
    };
  }, [scrollToField]);

  const field = (name) => ({
    onLayout: (event) => {
      tops.current[name] = event.nativeEvent.layout.y;
    },
    onFocus: () => {
      focused.current = name;
      scrollToField(name);
    },
  });

  // The ScrollView is laid out again when the keyboard changes its height: scroll now that the real
  // height is known.
  const scrollProps = {
    onLayout: () => {
      if (focused.current) scrollToField(focused.current);
    },
  };

  return { field, scrollProps };
}
