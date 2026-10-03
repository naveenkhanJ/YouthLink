/**
 * Cancel engagement — prototype 5.7t (regular: a request), 5.10 (worker, urgent: immediate) and
 * 5.7e (employer, urgent: immediate). Requirements FR-ENG-05, FR-ENG-06, FR-ENG-07, FR-ENG-08.
 * Owner: Naveenkhan.
 *
 * Param: `{ engagementId }`. Reached from "Cancel engagement" on a detail that has not started
 * (5.2t, 5.2n, 5.3t). Which rule applies is decided by how far away the start is NOW — more than
 * 48 hours is a request the other party answers within 48 hours, 48 hours or less takes effect at
 * once (FR-ENG-05/06 as amended 2026-09-24). The server sends that verdict with the engagement
 * (`cancelPreview`) and decides again when the cancellation is sent; its answer (`mode`) is what
 * the screen follows:
 *   - REQUESTED → 5.8t "Request sent"
 *   - CANCELLED → the list (5.1n / 5.1ex)
 *
 * A reason from the fixed list is required; none is chosen for the person, so the button stays
 * disabled until they pick one. "Cancel now" is a single destructive commit, so it stays at the
 * end of the content (design-system.md §5); "Send cancellation request" is pinned.
 */
import { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { getEngagement, cancelEngagement } from "../../api/engagement.api";
import { parseApiError } from "../../api/client";
import ScreenHeader from "../../components/ScreenHeader";
import Badge from "../../components/Badge";
import Button from "../../components/Button";
import CtaBar from "../../components/CtaBar";
import FormBanner from "../../components/FormBanner";
import LoadingState from "../../components/LoadingState";
import { colors, spacing, radius, typography } from "../../theme/tokens";
import {
  CANCELLATION_REASONS,
  employerUrgentNote,
  regularRegimeNote,
  urgentImmediateLine,
  urgentLateLine,
} from "./engagement.format";

export default function EngagementCancelScreen({ route, navigation }) {
  const { engagementId } = route.params || {};
  const [engagement, setEngagement] = useState(null);
  const [reason, setReason] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    getEngagement(engagementId)
      .then((res) => active && setEngagement(res.engagement))
      .catch((err) => active && setError(parseApiError(err).formError || "This engagement couldn't be loaded."));
    return () => {
      active = false;
    };
  }, [engagementId]);

  const header = <ScreenHeader title="Cancel engagement" onBack={() => navigation.goBack()} />;
  const preview = engagement?.cancelPreview;

  if (!engagement || !preview) {
    return (
      <View style={styles.root}>
        <StatusBar style="dark" />
        {header}
        <View style={styles.content}>
          {error ? (
            <FormBanner kind="error" message={error} />
          ) : engagement ? (
            // Started meanwhile, already cancelled, or a request is already open.
            <FormBanner kind="info" message="This engagement can't be cancelled now." />
          ) : (
            <LoadingState />
          )}
        </View>
      </View>
    );
  }

  async function submit() {
    if (submitting || !reason) return;
    setSubmitting(true);
    setError(null);
    try {
      const result = await cancelEngagement(engagementId, { reason });
      if (result.mode === "REQUESTED") {
        navigation.replace("EngagementCancelSent", { engagementId, counterpartyName: engagement.counterparty.name });
      } else {
        navigation.popTo("EngagementList"); // 5.10 → 5.1n, 5.7e → 5.1ex
      }
    } catch (err) {
      setError(parseApiError(err).formError || "This engagement couldn't be cancelled.");
      setSubmitting(false);
    }
  }

  const reasons = (
    <>
      <Text style={styles.question}>Why are you cancelling?</Text>
      {CANCELLATION_REASONS.map((r) => {
        const selected = reason === r.id;
        return (
          <Pressable
            key={r.id}
            onPress={() => setReason(r.id)}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            style={[styles.reason, selected && styles.reasonSelected]}
          >
            <Text style={[styles.reasonLabel, selected && styles.reasonLabelSelected]}>{r.label}</Text>
          </Pressable>
        );
      })}
    </>
  );
  const context = `${engagement.posting.title} · ${engagement.counterparty.name}`;

  // ---- 5.7t: a request under regular rules ----
  if (preview.regime === "REGULAR") {
    return (
      <View style={styles.root}>
        <StatusBar style="dark" />
        {header}
        <ScrollView style={styles.scroll} contentContainerStyle={[styles.content, styles.gap10]}>
          {error ? <FormBanner kind="error" message={error} /> : null}
          <Text style={styles.context}>{context}</Text>
          {reasons}
          <Text style={styles.note}>{regularRegimeNote(engagement)}</Text>
        </ScrollView>
        <CtaBar>
          <Button title="Send cancellation request" onPress={submit} loading={submitting} disabled={!reason} />
        </CtaBar>
      </View>
    );
  }

  const cancelNow = (
    <Button title="Cancel now" style="destructive" onPress={submit} loading={submitting} disabled={!reason} />
  );

  // ---- 5.10: the worker, urgent and immediate ----
  if (engagement.viewerRole === "WORKER") {
    const late = urgentLateLine(preview);
    return (
      <View style={styles.root}>
        <StatusBar style="dark" />
        {header}
        <ScrollView style={styles.scroll} contentContainerStyle={[styles.content, styles.noBar]}>
          {error ? <FormBanner kind="error" message={error} /> : null}
          <View style={styles.urgentRow}>
            <Badge family="urgent" />
            <Text style={styles.context}>{engagement.posting.title}</Text>
          </View>
          <Text style={styles.body}>{urgentImmediateLine(engagement)}</Text>
          {late ? <Text style={styles.late}>{late}</Text> : null}
          {reasons}
          <View style={styles.spacerGrow} />
          {cancelNow}
        </ScrollView>
      </View>
    );
  }

  // ---- 5.7e: the employer, urgent and immediate ----
  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      {header}
      <ScrollView style={styles.scroll} contentContainerStyle={[styles.content, styles.noBar, styles.gap10]}>
        {error ? <FormBanner kind="error" message={error} /> : null}
        <Text style={styles.context}>{context}</Text>
        {reasons}
        <Text style={styles.note}>{employerUrgentNote(engagement, preview)}</Text>
        <View style={styles.spacerGrow} />
        {cancelNow}
      </ScrollView>
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
  // Figma content: pad 16/16/0/16 above a pinned bar (5.7t); 16/16/24/16 without one (5.10, 5.7e).
  content: {
    flexGrow: 1,
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.gutter,
    gap: spacing.md,
  },
  gap10: {
    gap: 10,
  },
  noBar: {
    paddingBottom: spacing.xl,
  },
  context: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  urgentRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: spacing.sm,
  },
  body: {
    ...typography.body,
    color: colors.text.primary,
  },
  late: {
    ...typography.secondary,
    color: colors.state.urgent,
  },
  question: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  // reason-*: 48 tall, pad 0/12, r8; the chosen one on color/bg/subtle in color/brand/primary.
  reason: {
    minHeight: 48,
    justifyContent: "center",
    paddingHorizontal: spacing.md,
    borderRadius: radius.input,
  },
  reasonSelected: {
    backgroundColor: colors.bg.subtle,
  },
  reasonLabel: {
    ...typography.body,
    color: colors.text.primary,
  },
  reasonLabelSelected: {
    color: colors.brand.primary,
  },
  note: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  spacerGrow: {
    flexGrow: 1,
  },
});
