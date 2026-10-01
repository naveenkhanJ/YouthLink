/**
 * A solid five-point star, the shape behind Input/StarInput (28px) and
 * Display/StarsDisplay (16px).
 *
 * Figma draws these as STAR nodes with pointCount 5 and innerRadius 0.382
 * (a regular pentagram), filled and with no stroke, so it is rebuilt here as
 * one polygon: ten points alternating between the outer radius (half the
 * size) and the inner radius (0.382 of that), starting at 12 o'clock.
 */
import Svg, { Polygon } from "react-native-svg";

const POINTS = 5;
const INNER_RATIO = 0.3819660246372223; // Figma's own innerRadius for these nodes

/** @returns {string} The polygon `points` attribute for a star filling `size`. */
function starPoints(size) {
  const center = size / 2;
  const outer = size / 2;
  const inner = outer * INNER_RATIO;
  const pts = [];
  for (let i = 0; i < POINTS * 2; i++) {
    const radius = i % 2 === 0 ? outer : inner;
    const angle = -Math.PI / 2 + (i * Math.PI) / POINTS;
    pts.push(`${center + radius * Math.cos(angle)},${center + radius * Math.sin(angle)}`);
  }
  return pts.join(" ");
}

/**
 * @param {number} size - Width and height in px.
 * @param {string} color - Fill colour (a token value).
 */
export default function StarShape({ size, color }) {
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Polygon points={starPoints(size)} fill={color} />
    </Svg>
  );
}
