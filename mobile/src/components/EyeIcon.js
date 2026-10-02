/**
 * Password-visibility eye icon, shared version.
 *
 * Geometry is Figma's `eye` node (12:27, Input/TextField), read from the file:
 * a 24px box holding a 20 x 12 ellipse outline at (2,6) with a 1.5 stroke drawn
 * INSIDE the shape, plus a 7px filled pupil centred at (12,12), both
 * color/text/secondary. An SVG ellipse strokes on its centre line, so the
 * outline is inset by half the stroke width to reproduce "stroke inside".
 *
 * The drawn component has only the one (hidden) state. When the password is
 * revealed a diagonal slash is added across the same eye; that second state is
 * not drawn in Figma, so it is the only part of this icon not taken from it.
 */
import Svg, { Ellipse, Circle, Line } from "react-native-svg";
import { colors } from "../theme/tokens";

const SIZE = 24;
const STROKE = 1.5;

/** @param {boolean} revealed - True while the password is shown. */
export default function EyeIcon({ revealed }) {
  return (
    <Svg width={SIZE} height={SIZE} viewBox="0 0 24 24" fill="none">
      <Ellipse
        cx={12}
        cy={12}
        rx={10 - STROKE / 2}
        ry={6 - STROKE / 2}
        stroke={colors.text.secondary}
        strokeWidth={STROKE}
      />
      <Circle cx={12} cy={12} r={3.5} fill={colors.text.secondary} />
      {revealed ? (
        <Line
          x1={4}
          y1={4}
          x2={20}
          y2={20}
          stroke={colors.text.secondary}
          strokeWidth={STROKE}
          strokeLinecap="round"
        />
      ) : null}
    </Svg>
  );
}
