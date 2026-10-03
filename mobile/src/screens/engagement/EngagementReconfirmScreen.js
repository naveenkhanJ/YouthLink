/**
 * 5.11 — Posting changed · re-confirm the new start. Requirement FR-ENG-09 (the worker's side).
 * Owner: Naveenkhan.
 *
 * Reached from the worker's list row that owes "Re-confirm the new start — by …" (5.1w). Shows
 * what changed (Was / Now, one box per changed field — only START TIME is drawn), the deadline,
 * and what not answering or declining does (rules 4 and 5). Two answers:
 *   - Accept change → the engagement carries on → its detail (5.2t); back from there lands on the list (5.1v).
 *   - Can't make it → cancelled at once, recorded as the employer's change → its detail (5.11d).
 */
import { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { getEngagement, reconfirmMaterialChange } from "../../api/engagement.api";
import { parseApiError } from "../../api/client";
import ScreenHeader from "../../components/ScreenHeader";
import Button from "../../components/Button";
import CtaBar from "../../components/CtaBar";
import CountdownText from "../../components/CountdownText";
import FormBanner from "../../components/FormBanner";
import LoadingState from "../../components/LoadingState";
import { colors, spacing, radius, typography } from "../../theme/tokens";
import { changeRows, changeWhoLine, changeWindowLine, formatDayTime } from "./engagement.format";

export default function EngagementReconfirmScreen({ route, navigation }) {
  const { engagementId } = route.params || {};
  const [engagement, setEngagement] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(null); // "accept" | "decline" | null

  useEffect(() => {
    let active = true;
    getEngagement(engagementId)
      .then((res) => active && setEngagement(res.engagement))
      .catch((err) => active && setError(parseApiError(err).formError || "This change couldn't be loaded."));
    return () => {
      active = false;
    };
  }, [engagementId]);

  async function answer(accept) {
    if (submitting) return;
    setSubmitting(accept ? "accept" : "decline");
    setError(null);
    try {
      await reconfirmMaterialChange(engagementId, { accept });
      // 5.2t after accepting, 5.11d after declining — the same detail screen, in its new state.
      navigation.replace("EngagementDetail", { engagementId });
    } catch (err) {
      setError(parseApiError(err).formError || "Your answer couldn't be sent.");
      setSubmitting(null);
    }
  }

  const header = <ScreenHeader title="Posting changed" onBack={() => navigation.goBack()} />;
  const change = engagement?.pendingChange;

  if (!engagement || !change) {
    return (
      <View style={styles.root}>
        <StatusBar style="dark" />
        {header}
        <View style={styles.content}>
          {error ? (
            <FormBanner kind="error" message={error} />
          ) : engagement ? (
            // Answered meanwhile (or its window closed): nothing left to answer here.
            <FormBanner kind="info" message="There is no change waiting for your answer." />
          ) : (
            <LoadingState />
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      {header}
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {error ? <FormBanner kind="error" message={error} /> : null}
        <Text style={styles.who}>{changeWhoLine(engagement, change.changeSummary)}</Text>
        {changeRows(change.changeSummary, engagement.posting).map((row) => (
          <View key={row.field} style={styles.changeBox}>
            <Text style={styles.changeLabel}>{row.label}</Text>
            <Text style={styles.oldVal}>{row.was}</Text>
            <Text style={styles.newVal}>{row.now}</Text>
          </View>
        ))}
        <CountdownText text={`Respond by ${formatDayTime(change.deadline)}`} />
        <Text style={styles.window}>{changeWindowLine(engagement)}</Text>
      </ScrollView>
      <CtaBar>
        <View style={styles.actions}>
          <View style={styles.action}>
            <Button
              title="Accept change"
              compact
              onPress={() => answer(true)}
              loading={submitting === "accept"}
              disabled={submitting === "decline"}
            />
          </View>
          <View style={styles.action}>
            <Button
              title="Can't make it"
              compact
              style="secondary"
              onPress={() => answer(false)}
              loading={submitting === "decline"}
              disabled={submitting === "accept"}
            />
          </View>
        </View>
      </CtaBar>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg.default,
  },
  scroll: {
    flex: 1,
  },
  // Figma content: pad 16/16/0/16, gap 12.
  content: {
    flexGrow: 1,
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.gutter,
    gap: spacing.md,
  },
  who: {
    ...typography.body,
    color: colors.text.primary,
  },
  // changeBox: pad 10/12, gap 6, r8, fill color/bg/subtle.
  changeBox: {
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    borderRadius: radius.input,
    backgroundColor: colors.bg.subtle,
  },
  changeLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  oldVal: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  newVal: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  window: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  action: {
    flex: 1,
  },
});
