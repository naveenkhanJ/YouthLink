/**
 * Shared layout for HF.2-4 — all three are the same shape: ScreenHeader,
 * a page title, a lead paragraph, numbered Steps, and a footnote. Factored
 * out so the three screens don't triplicate this wrapper.
 */
import { Text, View, StyleSheet } from "react-native";
import { colors, spacing, typography } from "../../../theme/tokens";
import ScreenHeader from "../../../components/ScreenHeader";
import Step from "./Step";

/**
 * @param {string} headerTitle
 * @param {string} pageTitle
 * @param {string} lead
 * @param {{lead: string, body: string}[]} steps
 * @param {string} footnote
 * @param {() => void} onBack
 */
export default function TopicLayout({ headerTitle, pageTitle, lead, steps, footnote, onBack }) {
  return (
    <View style={styles.screen}>
      <ScreenHeader title={headerTitle} onBack={onBack} />
      <View style={styles.content}>
        <Text style={styles.pageTitle}>{pageTitle}</Text>
        <Text style={styles.lead}>{lead}</Text>
        <View style={styles.steps}>
          {steps.map((step, i) => (
            <Step key={i} lead={step.lead} body={step.body} />
          ))}
        </View>
        <Text style={styles.footnote}>{footnote}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg.subtle,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  pageTitle: {
    ...typography.bodyMedium,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  lead: {
    ...typography.secondary,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  steps: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  footnote: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
});
