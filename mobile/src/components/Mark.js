/**
 * Brand/Mark — real Figma component (node 2701:55, "Components /
 * Display" page, found 2026-09-28), real exported vector path (not
 * approximated — downloaded and inlined via react-native-svg, same
 * approach as `TabBar`'s icons). "Two identical quarter-arcs turning on
 * a point" (Afham's design, adopted 2026-09-08). ONE COLOUR ONLY — there
 * is no second brand colour; a gold-tint variant was tried and withdrawn
 * the same day it was explored, because tinted surfaces made some
 * screens look worse.
 *
 * Tone=OnLight is brand blue `#0F3D91` for white/light grounds;
 * Tone=OnBrand is white for brand-blue/ink grounds. Native 48x48 viewBox
 * — pass `size` to scale, the path data itself never changes.
 */
import Svg, { Path, Circle } from "react-native-svg";
import { colors } from "../theme/tokens";

/**
 * @param {"onLight"|"onBrand"} [tone] - Defaults to "onLight".
 * @param {number} [size] - Defaults to 48 (the real component's native size).
 */
export default function Mark({ tone = "onLight", size = 48 }) {
  const fill = tone === "onBrand" ? colors.text.inverse : colors.brand.primary;
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Path
        d="M6.24 24C6.24 19.2898 8.11114 14.7724 11.4418 11.4418C14.7724 8.11114 19.2898 6.24 24 6.24L24 13.44C21.1993 13.44 18.5133 14.5526 16.533 16.533C14.5526 18.5133 13.44 21.1993 13.44 24L6.24 24Z"
        fill={fill}
      />
      <Path
        d="M41.76 24C41.76 26.3323 41.3006 28.6417 40.4081 30.7965C39.5156 32.9512 38.2074 34.909 36.5582 36.5582C34.909 38.2074 32.9512 39.5156 30.7965 40.4081C28.6417 41.3006 26.3323 41.76 24 41.76L24 34.56C25.3868 34.56 26.7599 34.2869 28.0411 33.7562C29.3223 33.2255 30.4865 32.4476 31.467 31.467C32.4476 30.4865 33.2255 29.3223 33.7562 28.0411C34.2869 26.7599 34.56 25.3868 34.56 24H41.76Z"
        fill={fill}
      />
      <Circle cx={24} cy={24} r={3.6} fill={fill} />
    </Svg>
  );
}
