/**
 * One numbered mechanism step on an HF.* screen — a bold lead-in run
 * followed by an em-dash and the body, in one paragraph. docs/prototype/
 * MHF-help.md is explicit that this is one text node with two runs, not two
 * separate paragraphs — rendered here as nested <Text> so the lead-in's
 * weight doesn't leak into the body (React Native inherits/overrides style
 * per nested Text node, which is exactly this rule).
 */
import { Text, StyleSheet } from "react-native";
import { colors, typography } from "../../../theme/tokens";

/**
 * @param {string} lead - The bold lead-in phrase, e.g. "Arrival".
 * @param {string} body - The rest of the sentence.
 */
export default function Step({ lead, body }) {
  return (
    <Text style={styles.step}>
      <Text style={styles.lead}>{lead}</Text> — {body}
    </Text>
  );
}

const styles = StyleSheet.create({
  step: {
    ...typography.secondary,
    color: colors.text.primary,
  },
  lead: {
    ...typography.secondaryMedium,
    color: colors.text.primary,
  },
});
