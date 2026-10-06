/**
 * 5.12 — Change responses. Requirements FR-ENG-09 / FR-ENG-11 (the employer's side). Owner:
 * Naveenkhan.
 *
 * Param: `{ gigPostingId }`. Reached from the employer's list row whose worker owes a
 * re-confirmation (5.1e) and from the posting detail's change note (M2 2.11c, "— see responses").
 * One row per engaged worker, each answering separately. Only "Waiting — until …" is drawn; the
 * answered states ("Accepted", "Can't make it — cancelled") are derived (engagement.format.js).
 */
import { useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { getChangeResponses } from "../../api/engagement.api";
import { parseApiError } from "../../api/client";
import ScreenHeader from "../../components/ScreenHeader";
import FormBanner from "../../components/FormBanner";
import LoadingState from "../../components/LoadingState";
import { colors, spacing, radius, elevation, typography } from "../../theme/tokens";
import { changeContextLine, responseState } from "./engagement.format";

const TONE_COLOR = {
  action: colors.brand.primary,
  done: colors.state.success,
  muted: colors.text.secondary,
};

export default function EngagementChangeResponsesScreen({ route, navigation }) {
  const { gigPostingId } = route.params || {};
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setData(await getChangeResponses(gigPostingId));
      setError(null);
    } catch (err) {
      setError(parseApiError(err).formError || "The responses couldn't be loaded.");
    }
  }, [gigPostingId]);

  useEffect(() => {
    load();
    return navigation.addListener("focus", load);
  }, [load, navigation]);

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScreenHeader title="Change responses" onBack={() => navigation.goBack()} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {error ? <FormBanner kind="error" message={error} /> : null}
        {!data && !error ? <LoadingState /> : null}
        {data?.change ? (
          <>
            <Text style={styles.context}>{changeContextLine(data.posting.title, data.change.changeSummary, data.posting)}</Text>
            <Text style={styles.note}>
              Each worker responds separately. If a worker doesn't accept in time, their engagement is cancelled — recorded as your change, not against them.
            </Text>
            {data.responses.map((response) => {
              const state = responseState(response);
              return (
                <View key={response.engagementId} style={styles.slot}>
                  <Text style={styles.slotName}>{response.workerName}</Text>
                  <Text style={[styles.slotState, { color: TONE_COLOR[state.tone] }]}>{state.text}</Text>
                </View>
              );
            })}
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg.subtle,
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
  context: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  note: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  // slot-*: horizontal, centred, pad 12, gap 10, r8, fill color/bg/default, elevation/card.
  slot: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: spacing.md,
    borderRadius: radius.input,
    backgroundColor: colors.bg.default,
    ...elevation.card,
  },
  slotName: {
    flex: 1,
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  slotState: {
    width: 120,
    ...typography.caption,
  },
});
