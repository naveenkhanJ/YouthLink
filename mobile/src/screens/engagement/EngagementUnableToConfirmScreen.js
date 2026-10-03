/**
 * 5.6 — Unable to confirm · opening a dispute. Requirements FR-ENG-03, and FR-ENG-12's "yes"
 * answer, which M5's "States not drawn" builds from this screen's pattern. Owner: Naveenkhan.
 *
 * Params: `{ engagementId, mode: "unable" | "end", checkpoint? }`.
 *   - "unable" (from 5.5a / 5.5 "Unable to confirm?"): FR-ENG-03 — the live checkpoint is
 *     marked unable to confirm and the engagement Disputed; the other party is told.
 *   - "end" (End Engagement → "Did something go wrong?" → Yes): FR-ENG-12's dispute route.
 *
 * DISPUTE STUB: "Open dispute" leads to M9's case screens (9.2 / 9.2k), and the Disputes module
 * is not built. Until it is, the engagement is marked Disputed on the server and this screen
 * returns to the engagement detail, which shows it Disputed (docs/module-ownership.md, YL-66:
 * "leave the dispute route as a clearly marked stub").
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
      if (mode === "end") {
        await endEngagement(engagementId, { somethingWentWrong: true });
      } else {
        await unableToConfirmCheckpoint(engagementId, { checkpoint });
      }
      // STUB: M9's case screen would open here. Back to the engagement, now Disputed.
      navigation.popTo("EngagementDetail", { engagementId });
    } catch (err) {
      setError(parseApiError(err).formError || "The dispute couldn't be opened.");
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
