/**
 * The three first-run illustrations (prototype M0, `art` 200×200): a 160-px brand-tint disc with
 * simple people drawn on it. Decorative, so it uses the primitive blue/700 (#0f3d91) and white
 * rather than a semantic token (design-system.md §1). Drawn in react-native-svg from the
 * prototype's primitives: `person` = a head circle plus shoulders, `verified` = a small blue
 * check badge, `diamond` = the vouch mark, `codeBox` = one cell of a code.
 */
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { colors } from "../../theme/tokens";

const BLUE = "#0f3d91"; // blue/700
const STROKE = 2.67;

/** A person: head 11×11 at (11,4), shoulders 21×11 at (5,17), inside a 32×32 box at (x, y). */
function Person({ x, y }) {
  return (
    <>
      <Circle cx={x + 16.5} cy={y + 9.5} r={(11 - STROKE) / 2} stroke={BLUE} strokeWidth={STROKE} fill="none" />
      <Path
        d={`M${x + 5} ${y + 28}C${x + 5} ${y + 22} ${x + 9} ${y + 18.5} ${x + 15.5} ${y + 18.5}C${x + 22} ${y + 18.5} ${x + 26} ${y + 22} ${x + 26} ${y + 28}`}
        stroke={BLUE}
        strokeWidth={STROKE}
        strokeLinecap="round"
        fill="none"
      />
    </>
  );
}

/** The 16×16 verified badge at (x, y): blue disc ringed in the disc colour, white check. */
function Verified({ x, y }) {
  return (
    <>
      <Circle cx={x + 8} cy={y + 8} r={7} fill={BLUE} stroke={colors.bg.brandTint} strokeWidth={2} />
      <Path
        d={`M${x + 4} ${y + 8.2}L${x + 6.8} ${y + 10.8}L${x + 11.6} ${y + 5.6}`}
        stroke="#ffffff"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </>
  );
}

/**
 * @param {"gigs"|"endorsement"|"codes"} variant - 0.2, 0.3 or 0.4.
 */
export default function OnboardingArt({ variant }) {
  return (
    <Svg width={200} height={200} viewBox="0 0 200 200" accessibilityElementsHidden importantForAccessibility="no">
      <Circle cx={100} cy={100} r={80} fill={colors.bg.brandTint} />
      {variant === "gigs" ? (
        <>
          {[36, 84, 132].map((x) => (
            <Person key={x} x={x} y={82} />
          ))}
          {[50, 98, 146].map((x) => (
            <Verified key={x} x={x} y={102} />
          ))}
        </>
      ) : null}
      {variant === "endorsement" ? (
        <>
          <Person x={36} y={84} />
          {/* the vouch diamond, 32×32 at (84,84) */}
          <Path d="M100 84L116 100L100 116L84 100Z" fill={BLUE} />
          <Person x={132} y={84} />
        </>
      ) : null}
      {variant === "codes" ? (
        <>
          <Person x={36} y={84} />
          <Rect x={84} y={90} width={8} height={20} rx={2} fill={BLUE} opacity={0.22} />
          <Rect x={96} y={90} width={8} height={20} rx={2} fill={BLUE} />
          <Rect x={108} y={90} width={8} height={20} rx={2} fill={BLUE} opacity={0.22} />
          <Person x={132} y={84} />
        </>
      ) : null}
    </Svg>
  );
}
