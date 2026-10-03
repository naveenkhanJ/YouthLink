/**
 * Display/Badge — real Figma component (node 39:68, "Components /
 * Display" page, found 2026-09-28). New — nothing existed for this
 * before.
 *
 * Two visual families, both real, not a guess:
 * - "Special" badges (Verified/Endorsed/Urgent) are outline pills:
 *   border + glyph + label, all in one tone colour, no fill.
 * - "Status" badges (Posting/Application/Engagement/Case — 18 pills
 *   from the schema's own enums) are filled `bg/subtle` pills with a
 *   small coloured dot plus a label that stays `text/primary` (dark)
 *   regardless of tone — the dot carries the tone, the label never
 *   changes colour. Per the component's own N-rule note: "label is the
 *   non-colour signal, never colour alone."
 *
 * Tone map (PROPOSED in the real component, kept exactly): success =
 * positive outcomes, brand = in-progress, urgent = needs-attention,
 * neutral = terminal/no-action. `Cancelled` is deliberately NEUTRAL, not
 * danger (no-stigma rule) — don't "fix" that into a red dot.
 */
import { Text, View, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";
import { colors, typography } from "../theme/tokens";

/**
 * The three badge glyphs, drawn exactly as Figma does (Display/Badge, node
 * 39:68): a 8x6 check (stroke 1.8, round caps/joins), a 10x10 filled diamond and
 * a 10x9 filled triangle — vectors, not text characters, so they look the same
 * on every device font.
 */
function Glyph({ shape, color }) {
  if (shape === "check") {
    return (
      <Svg width={8} height={6} viewBox="0 0 8 6" fill="none" overflow="visible">
        <Path d="M0 3L3 6L8 0" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    );
  }
  if (shape === "diamond") {
    return (
      <Svg width={10} height={10} viewBox="0 0 10 10">
        <Path d="M5 0L10 5L5 10L0 5L5 0Z" fill={color} />
      </Svg>
    );
  }
  return (
    <Svg width={10} height={9} viewBox="0 0 10 9">
      <Path d="M5 0L10 9L0 9L5 0Z" fill={color} />
    </Svg>
  );
}

const SPECIAL = {
  verified: { border: colors.badge.verified, glyph: "check", label: "Phone verified" },
  endorsed: { border: colors.badge.endorsed, glyph: "diamond", label: "Endorsed" },
  endorsedCount: { border: colors.badge.endorsed, glyph: "diamond", label: (n) => `Endorsed ×${n}` }, // 4.5 draws "Endorsed ×2", no space
  urgent: { border: colors.state.urgent, glyph: "triangle", label: "Urgent" },
};

const TONE_DOT = {
  success: colors.state.success,
  brand: colors.brand.primary,
  urgent: colors.state.urgent,
  neutral: colors.text.secondary,
};

// "family:value" -> { label, tone }. The 18 real status pills.
const STATUS = {
  "posting:open": { label: "Open", tone: "success" },
  "posting:filled": { label: "Filled", tone: "brand" },
  "posting:withdrawn": { label: "Withdrawn", tone: "neutral" },
  "posting:expired": { label: "Expired", tone: "neutral" },
  "application:pending": { label: "Pending", tone: "brand" },
  "application:selected": { label: "Selected", tone: "success" },
  "application:declined": { label: "Declined", tone: "neutral" },
  "application:withdrawn": { label: "Withdrawn", tone: "neutral" },
  "application:notselected": { label: "Not selected", tone: "neutral" },
  "engagement:active": { label: "Active", tone: "brand" },
  "engagement:completed": { label: "Completed", tone: "success" },
  "engagement:cancelled": { label: "Cancelled", tone: "neutral" },
  "engagement:ended": { label: "Ended", tone: "neutral" },
  "engagement:disputed": { label: "Disputed", tone: "urgent" },
  "case:awaitingresponse": { label: "Awaiting response", tone: "urgent" },
  "case:underreview": { label: "Under review", tone: "brand" },
  "case:escalated": { label: "Escalated", tone: "urgent" },
  "case:resolved": { label: "Resolved", tone: "success" },
};

/**
 * @param {"verified"|"endorsed"|"urgent"|"posting"|"application"|"engagement"|"case"} family
 * @param {string} [value] - Required for the status families, e.g. "open", "pending".
 * @param {number} [count] - For family="endorsed" with a count (e.g. 3 -> "Endorsed ×3").
 */
export default function Badge({ family, value, count }) {
  if (family === "verified" || family === "urgent" || family === "endorsed") {
    const spec = family === "endorsed" && count != null ? SPECIAL.endorsedCount : SPECIAL[family];
    const label = typeof spec.label === "function" ? spec.label(count) : spec.label;
    return (
      <View style={[styles.pill, styles.outlinePill, { borderColor: spec.border }]}>
        <Glyph shape={spec.glyph} color={spec.border} />
        <Text style={[styles.outlineLabel, { color: spec.border }]}>{label}</Text>
      </View>
    );
  }

  const status = STATUS[`${family}:${value?.toLowerCase()}`];
  if (!status) {
    throw new Error(`Badge: unknown family/value "${family}"/"${value}"`);
  }
  return (
    <View style={[styles.pill, styles.statusPill]}>
      <View style={[styles.dot, { backgroundColor: TONE_DOT[status.tone] }]} />
      <Text style={styles.statusLabel}>{status.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // alignSelf: a badge hugs its content (115 / 89 / 74 wide in Figma). In a
  // column parent React Native would otherwise stretch it to the full width.
  pill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  // Figma strokes the outline pill INSIDE its 24px height; RN's border is
  // outside the padding, so the padding gives up the 1px.
  outlinePill: {
    paddingHorizontal: 10 - 1,
    paddingVertical: 4 - 1,
    borderWidth: 1,
    gap: 5,
    backgroundColor: "transparent",
  },
  statusPill: {
    gap: 6,
    backgroundColor: colors.bg.subtle,
  },
  outlineLabel: {
    ...typography.caption,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusLabel: {
    ...typography.caption,
    color: colors.text.primary,
  },
});
