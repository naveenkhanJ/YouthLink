/**
 * Layout helpers shared across components.
 *
 * `fill` stretches a child over its parent (an overlay, a scrim, a spinner centred on a button).
 * It replaces `StyleSheet.absoluteFillObject`, which React Native 0.86 no longer exports:
 * spreading `undefined` silently produced an empty style, so the overlays were never positioned
 * (invisible scrim, spinner on the button's bottom edge, code input a thin strip at the side).
 */
export const fill = {
  position: "absolute",
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};
