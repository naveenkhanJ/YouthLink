/**
 * Display/CountdownText — real Figma component (node 39:77, "Components
 * / Display" page, found 2026-09-28). New — nothing existed for this
 * before. Purely presentational, matching the real component exactly (it
 * draws static text, no interactivity) — the caller owns the actual
 * ticking/formatting logic and passes the already-formatted string.
 *
 * Two formats, both real: Cooldown ("Resend in 0:47" — the CLIENT's own
 * timer; per the component's own M-rule, never imply this is the code's
 * true lifetime, since Firebase owns the real expiry and doesn't expose
 * it) and Deadline ("Closes 12 Sep 2026" — an absolute date). NEVER
 * invent a countdown where the spec draws none — 1.6's lockout
 * deliberately shows no timer, so don't reach for this component there.
 */
import { Text, StyleSheet } from "react-native";
import { colors, typography } from "../theme/tokens";

/**
 * @param {string} text - Pre-formatted, e.g. "Resend in 0:47" or "Closes 12 Sep 2026".
 */
export default function CountdownText({ text }) {
  return <Text style={styles.text}>{text}</Text>;
}

const styles = StyleSheet.create({
  text: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
});
