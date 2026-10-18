/**
 * 5.6 — Unable to confirm · opening a dispute. Requirements FR-ENG-03, and FR-ENG-12's "yes"
 * answer, which M5's "States not drawn" builds from this screen's pattern. Owner: Naveenkhan.
 *
 * Params: `{ engagementId, mode: "unable" | "end", checkpoint? }`.
 *   - "unable" (from 5.5a / 5.5 "Unable to confirm?"): FR-ENG-03 — the live checkpoint is
 *     marked unable to confirm and the engagement Disputed; the other party is told.
 *   - "end" (End Engagement → "Did something go wrong?" → Yes): FR-ENG-12's dispute route.
 *
 * "Open dispute" opens the case it created — M9's 9.2 (from arrival) or 9.2k (from completion),
 * the `DisputeCase` screen with the returned `disputeCaseId` (FR-DISPUTE-03). This screen and the
 * code entry are taken off the stack first, so the case's back arrow returns to the engagement,
 * now Disputed (M9 9.2: "Exits back → … after opening the case, → M5 5.2s").
 *
 * "Open dispute" is a single destructive commit, so it stays at the end of the content rather
 * than in a pinned bar (design-system.md §5).
 */
import { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { getEngagement, unableToConfirmCheckpoint, endEngagement } from "../../api/engagement.api";
import { parseApiError } from "../../api/client";
import ScreenHeader from "../../components/ScreenHeader";
import Button from "../../components/Button";
import Link from "../../components/Link";
import FormBanner from "../../components/FormBanner";
import { colors, spacing, typography } from "../../theme/tokens";

export default function EngagementUnableToConfirmScreen({ route, navigation }) {
  const { engagementId, checkpoint, mode = "unable" } = route.params || {};
  const [counterpartyName, setCounterpartyName] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // The first bullet names who is told ("Saman Stores will be notified…").
  useEffect(() => {
    let active = true;
    getEngagement(engagementId)
      .then((res) => active && setCounterpartyName(res.engagement.counterparty.name))
      .catch((err) => active && setError(parseApiError(err).formError));
    return () => {
      active = false;
    };
  }, [engagementId]);

  async function openDispute() {
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const result =
        mode === "end"
          ? await endEngagement(engagementId, { somethingWentWrong: true })
          : await unableToConfirmCheckpoint(engagementId, { checkpoint });
      // Back to the engagement (5.2s underneath), then the case on top of it (9.2 / 9.2k).
      navigation.popTo("EngagementDetail", { engagementId });
      if (result?.disputeCaseId) {
        navigation.navigate("DisputeCase", { disputeCaseId: result.disputeCaseId, engagementId });
      }
    } catch (err) {
      // Offline: 4.1bnr's pattern (DERIVED wording) — nothing was opened, and nothing is lost.
      setError(
        err.offline
          ? "You're offline, so the dispute couldn't be opened. Try again once you reconnect."
          : parseApiError(err).formError || "The dispute couldn't be opened.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScreenHeader title="Unable to confirm" onBack={() => navigation.goBack()} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {error ? <FormBanner kind="error" message={error} /> : null}
        <Text style={styles.what}>This opens a dispute case for this engagement.</Text>
        {counterpartyName ? (
          <Text style={styles.point}>{`• ${counterpartyName} will be notified and asked to respond`}</Text>
        ) : null}
        <Text style={styles.point}>• A moderator reviews both sides</Text>
        <Text style={styles.point}>• You can follow the case status from this engagement</Text>
        <Text style={styles.point}>• Once submitted, it can't be withdrawn</Text>
        <Link title="How disputes are resolved" onPress={() => navigation.navigate("HelpDisputes")} />
        <View style={styles.spacerGrow} />
        <Button title="Open dispute" style="destructive" onPress={openDispute} loading={submitting} />
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
  // Figma content: pad 16/16/24/16, gap 12.
  content: {
    flexGrow: 1,
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.gutter,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  what: {
    ...typography.body,
    color: colors.text.primary,
  },
  point: {
    ...typography.secondary,
    color: colors.text.primary,
  },
  spacerGrow: {
    flexGrow: 1,
  },
});
