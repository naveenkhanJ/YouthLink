/**
 * A tappable wrapper for a card that opens something (a gig in Browse, an application, an
 * engagement, an applicant). While it is pressed the card shrinks slightly and springs back on
 * release: the feedback stays inside the card's own rounded shape and keeps its shadow, which a
 * background tint (the card draws its own) or an Android ripple (a hard rectangle) would not.
 *
 * Takes every Pressable prop (onPress, accessibilityRole, accessibilityLabel...). Stays still when
 * the phone is set to reduce motion.
 */
import { useRef } from "react";
import { Animated, Pressable } from "react-native";
import { pressed } from "../theme/tokens";
import useReducedMotion from "../hooks/useReducedMotion";

export default function PressableScale({ children, style, onPressIn, onPressOut, ...pressableProps }) {
  const scale = useRef(new Animated.Value(1)).current;
  const reduceMotion = useReducedMotion();

  function animateTo(toValue) {
    if (reduceMotion) return;
    // A stiff, short spring: quick enough to feel like a response to the finger, not an effect.
    Animated.spring(scale, { toValue, speed: 40, bounciness: 0, useNativeDriver: true }).start();
  }

  return (
    <Pressable
      {...pressableProps}
      onPressIn={(event) => {
        animateTo(pressed.cardScale);
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        animateTo(1);
        onPressOut?.(event);
      }}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>
    </Pressable>
  );
}
