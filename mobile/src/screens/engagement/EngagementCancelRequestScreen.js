/**
 * Cancellation request — prototype 5.9 (respond by …), 5.9b (accepted) and 5.9r (not agreed).
 * Requirement FR-ENG-05. Owner: Naveenkhan.
 *
 * Param: `{ engagementId }`. Reached from the responder's list row "Asked to cancel — respond by
 * …" (5.1). Shows who asked, the reason, the deadline and what each answer — and silence — does.
 *   - Accept → cancelled, no penalty to the one who accepted → 5.9b
 *   - Don't agree → it stands as agreed, the requester is told → 5.9r
 * Both outcomes lead "Back to engagements" (5.1a / 5.1r).
 */
import { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { getEngagement, respondToCancellation } from "../../api/engagement.api";
import { parseApiError } from "../../api/client";
import ScreenHeader from "../../components/ScreenHeader";
import Button from "../../components/Button";
import CtaBar from "../../components/CtaBar";
import CountdownText from "../../components/CountdownText";
import FormBanner from "../../components/FormBanner";
import LoadingState from "../../components/LoadingState";
import { colors, spacing, radius, typography } from "../../theme/tokens";
import { formatDayTime, reasonLabel, requestContextLine } from "./engagement.format";

export default function EngagementCancelRequestScreen({ route, navigation }) {
  const { engagementId } = route.params || {};
  const [engagement, setEngagement] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(null); // "accept" | "reject" | null
  const [outcome, setOutcome] = useState(null); // "ACCEPTED" | "REJECTED" once answered

  useEffect(() => {
    let active = true;
    getEngagement(engagementId)
      .then((res) => active && setEngagement(res.engagement))
      .catch((err) => active && setError(parseApiError(err).formError || "This request couldn't be loaded."));
    return () => {
      active = false;
    };
  }, [engagementId]);

  async function answer(accept) {
    if (submitting) return;
    setSubmitting(accept ? "accept" : "reject");
    setError(null);
    try {
      const result = await respondToCancellation(engagementId, { accept });
      setOutcome(result.outcome);
    } catch (err) {
      setError(parseApiError(err).formError || "Your answer couldn't be sent.");
    } finally {
      setSubmitting(null);
    }
  }

  const header = <ScreenHeader title="Cancellation request" onBack={() => navigation.goBack()} />;
  const request = engagement?.pendingCancellation;

  // Nothing to answer: loading, failed, answered elsewhere, or resolved when the window closed.
  if (!engagement || (!outcome && (!request || request.requestedByMe))) {
    return (
      <View style={styles.root}>
        <StatusBar style="dark" />
        {header}
        <View style={styles.content}>
          {error ? (
            <FormBanner kind="error" message={error} />
          ) : engagement ? (
            <FormBanner kind="info" message="There is no cancellation request waiting for your answer." />
          ) : (
            <LoadingState />
          )}
        </View>
      </View>
    );
  }

  const name = engagement.counterparty.name;
  const who = <Text style={styles.body}>{`${name} asked to cancel this engagement.`}</Text>;
  const context = <Text style={styles.context}>{requestContextLine(engagement.posting)}</Text>;

  // ---- 5.9b / 5.9r ----
  if (outcome) {
    return (
      <View style={[styles.root, styles.rootSubtle]}>
        <StatusBar style="dark" />
        {header}
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
          {who}
          {context}
          <Text style={styles.body}>
            {outcome === "ACCEPTED"
              ? "You accepted — this engagement is cancelled, with no penalty to you. Either of you can still rate it."
              : `You didn't agree — the engagement stands as agreed, and ${name} has been told. You can still discuss changes with them directly.`}
          </Text>
        </ScrollView>
        <CtaBar surface="subtle">
          <Button title="Back to engagements" onPress={() => navigation.popTo("EngagementList")} />
        </CtaBar>
      </View>
    );
  }

  // ---- 5.9 ----
  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      {header}
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {error ? <FormBanner kind="error" message={error} /> : null}
        {who}
        {context}
        <View style={styles.reasonBox}>
          <Text style={styles.reasonLabel}>REASON</Text>
          <Text style={styles.reason}>{reasonLabel(request.reason)}</Text>
        </View>
        <CountdownText text={`Respond by ${formatDayTime(request.deadline)}`} />
        <Text style={styles.note}>Regular-gig rules apply — fixed when the request was made, even if the posting changes.</Text>
        <Text style={styles.note}>
          Accept — the engagement is cancelled, with no penalty to you. Don't agree — it stands as agreed. If you don't respond by then, the request resolves against you.
        </Text>
      </ScrollView>
      <CtaBar>
        <View style={styles.actions}>
          <View style={styles.action}>
            <Button
              title="Accept"
              onPress={() => answer(true)}
              loading={submitting === "accept"}
              disabled={submitting === "reject"}
            />
          </View>
          <View style={styles.action}>
            <Button
              title="Don't agree"
              style="secondary"
              onPress={() => answer(false)}
              loading={submitting === "reject"}
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
  rootSubtle: {
    backgroundColor: colors.bg.subtle,
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
  body: {
    ...typography.body,
    color: colors.text.primary,
  },
  context: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  // reasonBox: pad 10/12, gap 4, r8, fill color/bg/subtle.
  reasonBox: {
    gap: spacing.xs,
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    borderRadius: radius.input,
    backgroundColor: colors.bg.subtle,
  },
  reasonLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  reason: {
    ...typography.secondary,
    color: colors.text.primary,
  },
  note: {
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
