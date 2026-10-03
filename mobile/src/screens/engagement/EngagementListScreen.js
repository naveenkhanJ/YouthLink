/**
 * My engagements — the Engagements tab for workers and employers (prototype 5.1w, 5.1, 5.1a,
 * 5.1c, 5.1cr, 5.1cv, 5.1v, 5.1tx, 5.1r, 5.1nw, 5.1n, 5.1e, 5.1eu, 5.1ec, 5.1ecr, 5.1ex, 5.1es,
 * 5.1z, 5.1ez). Requirement FR-ENG-14. Owner: Naveenkhan.
 *
 * Each row is `Display/EngagementRow`: the counterparty, the engagement's status badge (always
 * the EngagementStatus — Active, Completed, Cancelled, Ended, Disputed) and, as a separate line,
 * only what the VIEWER owes (FR-ENG-14 as amended 2026-09-24). The server decides which
 * engagements are still listed (30 days after the rating window closes) and what is owed; this
 * screen only words it (engagement.format.js).
 *
 * Where a row leads (the frames' "Leads to"): a worker's owed re-confirmation opens 5.11; a
 * cancellation request to answer opens 5.9; an
 * employer's engagement with a change waiting on the worker opens Change responses (5.12);
 * everything else opens the engagement detail.
 *
 * States: loading → Feedback/LoadingState; nothing yet → Feedback/EmptyState (5.1z / 5.1ez);
 * a failed load → Feedback/FormBanner with a retry. Reloads whenever the tab is returned to.
 */
import { useCallback, useEffect, useState } from "react";
import { View, Text, Pressable, FlatList, RefreshControl, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../auth/AuthContext";
import { listEngagements } from "../../api/engagement.api";
import { parseApiError } from "../../api/client";
import EngagementRow from "../../components/EngagementRow";
import EmptyState from "../../components/EmptyState";
import LoadingState from "../../components/LoadingState";
import FormBanner from "../../components/FormBanner";
import Button from "../../components/Button";
import ShellTabBar from "../../components/ShellTabBar";
import { colors, spacing, typography } from "../../theme/tokens";
import { nextActionLabel } from "./engagement.format";

export default function EngagementListScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const isWorker = user?.role === "YOUTH_JOB_SEEKER";
  const [engagements, setEngagements] = useState(null); // null = not loaded yet
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await listEngagements();
      setEngagements(res.engagements ?? []);
      setError(null);
    } catch (err) {
      setError(parseApiError(err).formError || "Your engagements couldn't be loaded.");
    } finally {
      setRefreshing(false);
    }
  }, []);

  // On open, and every time the tab is returned to (after a code, an answer, a rating…).
  useEffect(() => {
    load();
    return navigation.addListener("focus", load);
  }, [load, navigation]);

  function openRow(item) {
    if (item.nextAction?.kind === "RECONFIRM") {
      navigation.navigate("EngagementReconfirm", { engagementId: item.id }); // 5.1w → 5.11
    } else if (item.nextAction?.kind === "RESPOND_CANCELLATION") {
      navigation.navigate("EngagementCancelRequest", { engagementId: item.id }); // 5.1 → 5.9
    } else if (!isWorker && item.hasPendingChange) {
      navigation.navigate("EngagementChangeResponses", { gigPostingId: item.gigPostingId }); // 5.1e → 5.12
    } else {
      navigation.navigate("EngagementDetail", { engagementId: item.id });
    }
  }

  const loaded = engagements !== null;

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <FlatList
        data={engagements ?? []}
        keyExtractor={(item) => item.id}
        // Figma content: pad 66/16/16/16 (66 = the status bar plus 22), gap 12.
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 22 }]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              load();
            }}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.screenTitle}>My engagements</Text>
            {error ? <FormBanner kind="error" message={error} /> : null}
            {error && !loaded ? <Button title="Try again" style="secondary" onPress={load} /> : null}
          </View>
        }
        ListEmptyComponent={
          !loaded ? (
            error ? null : <LoadingState />
          ) : isWorker ? (
            // 5.1z
            <EmptyState
              title="No engagements yet"
              body="When an employer selects you the gig moves here, with its check-in steps and the codes you need to enter."
              actionLabel="Browse gigs"
              onAction={() => navigation.navigate("DiscoveryBrowse")}
            />
          ) : (
            // 5.1ez
            <EmptyState
              title="No engagements yet"
              body="When you select an applicant the engagement starts here, and you can share the check-in codes."
              actionLabel="Post a gig"
              onAction={() => navigation.navigate("PostingCreate")}
            />
          )
        }
        renderItem={({ item }) => (
          // The whole row opens it; the action line inside is the same destination.
          <Pressable
            onPress={() => openRow(item)}
            accessibilityRole="button"
            accessibilityLabel={`${item.counterpartyName}, ${item.postingTitle}`}
          >
            <EngagementRow
              counterpartyName={item.counterpartyName}
              status={item.status}
              postingTitle={item.postingTitle}
              actionLabel={nextActionLabel(item.nextAction, item.counterpartyName)}
              onPressAction={() => openRow(item)}
            />
          </Pressable>
        )}
      />
      {/* 5.1*: the role's tab bar, Engagements active. */}
      <ShellTabBar active="engagements" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg.subtle,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.gutter,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  header: {
    gap: spacing.md,
  },
  screenTitle: {
    ...typography.display,
    color: colors.text.primary,
  },
});
