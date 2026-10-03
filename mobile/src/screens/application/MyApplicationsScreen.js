/**
 * My applications (prototype 4.3 and every 4.3* list, 4.3ldg, 4.3z; the withdraw dialog 4.4*;
 * FR-APPLY-12, FR-APPLY-03) — Naveenkhan.
 *
 * The worker's hub on the Applications tab. Every pending application, and every decided or
 * withdrawn one from the last 30 days, with its state (Display/Badge {Family=Application}):
 *   - pending: when its posting closes and, on a multi-slot posting, how full it is, plus Withdraw;
 *   - selected: "Contact shared — see engagement", and the row opens that engagement (M5 5.2);
 *   - declined, not selected (with why), withdrawn: one line saying what happened.
 * The server sends the rows already ordered (pending first, soonest closing first); the footer
 * states the rule. Reloads whenever the screen regains focus, so a state changed elsewhere (a
 * selection, a posting that closed) shows without revisiting the listing (criterion 6).
 *
 * Withdraw opens Feedback/ConfirmDialog (4.4) over the list: "Keep it" (Secondary) closes it,
 * "Withdraw" (Destructive) withdraws and the row becomes Withdrawn.
 *
 * States: loading → three Feedback/LoadingState cards (4.3ldg); nothing yet →
 * Feedback/EmptyState {NoneExist} with "Browse gigs" (4.3z); a failed load → FormBanner + retry.
 */
import { useCallback, useEffect, useState } from "react";
import { View, Text, Pressable, FlatList, RefreshControl, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing, radius, typography } from "../../theme/tokens";
import Badge from "../../components/Badge";
import Link from "../../components/Link";
import EmptyState from "../../components/EmptyState";
import LoadingState from "../../components/LoadingState";
import FormBanner from "../../components/FormBanner";
import Button from "../../components/Button";
import ConfirmDialog from "../../components/ConfirmDialog";
import DialogModal from "../../components/DialogModal";
import ShellTabBar, { openShellTab } from "../../components/ShellTabBar";
import { getMyApplications, withdrawApplication } from "../../api/application.api";
import { parseApiError } from "../../api/client";
import { applicationBadgeValue, pendingMeta, resolvedMeta, ORDER_NOTE } from "./application.format";

function ApplicationRow({ row, onWithdraw, onOpenEngagement }) {
  const pending = row.status === "PENDING";
  const opensEngagement = row.status === "SELECTED" && row.engagement;
  const card = (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.cardTitle}>{row.posting.title}</Text>
        <Badge family="application" value={applicationBadgeValue(row.status)} />
      </View>
      <Text style={styles.meta}>{pending ? pendingMeta(row) : resolvedMeta(row)}</Text>
      {pending ? <Link title="Withdraw" onPress={() => onWithdraw(row)} /> : null}
    </View>
  );
  if (!opensEngagement) return card;
  return (
    <Pressable
      onPress={() => onOpenEngagement(row.engagement.id)}
      accessibilityRole="button"
      accessibilityLabel={`${row.posting.title}, see engagement`}
    >
      {card}
    </Pressable>
  );
}

export default function MyApplicationsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [rows, setRows] = useState(null); // null = not loaded yet
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [confirming, setConfirming] = useState(null); // the row whose Withdraw was tapped
  const [withdrawing, setWithdrawing] = useState(false);

  const load = useCallback(async () => {
    try {
      setRows(await getMyApplications());
      setError(null);
    } catch (err) {
      setError(parseApiError(err).formError || "Your applications couldn't be loaded.");
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
    return navigation.addListener("focus", load);
  }, [load, navigation]);

  async function confirmWithdraw() {
    if (!confirming) return;
    setWithdrawing(true);
    try {
      await withdrawApplication(confirming.id);
      setConfirming(null);
      await load();
    } catch (err) {
      setConfirming(null);
      setError(parseApiError(err).formError || "Your application couldn't be withdrawn.");
    } finally {
      setWithdrawing(false);
    }
  }

  const loaded = rows !== null;

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <FlatList
        data={rows ?? []}
        keyExtractor={(row) => row.id}
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
            <Text style={styles.screenTitle}>My applications</Text>
            {error ? <FormBanner kind="error" message={error} /> : null}
            {error && !loaded ? <Button title="Try again" style="secondary" onPress={load} /> : null}
          </View>
        }
        ListEmptyComponent={
          !loaded ? (
            error ? null : (
              // 4.3ldg: three skeleton cards while the list loads.
              <View style={styles.loading}>
                <LoadingState />
                <LoadingState />
                <LoadingState />
              </View>
            )
          ) : (
            // 4.3z: a brand-new worker's list.
            <EmptyState
              title="No applications yet"
              body="Apply to a gig from Browse and it will appear here, with its status."
              actionLabel="Browse gigs"
              onAction={() => openShellTab(navigation, "worker", "browse")}
            />
          )
        }
        renderItem={({ item }) => (
          <ApplicationRow
            row={item}
            onWithdraw={setConfirming}
            onOpenEngagement={(engagementId) => navigation.navigate("EngagementDetail", { engagementId })}
          />
        )}
        ListFooterComponent={loaded && rows.length > 0 ? <Text style={styles.orderNote}>{ORDER_NOTE}</Text> : null}
      />

      {/* 4.3*: the worker's tab bar, Applications active. */}
      <ShellTabBar active="applications" />

      {/* 4.4: Withdraw this application? — over the list. */}
      <DialogModal visible={Boolean(confirming)} onRequestClose={() => setConfirming(null)}>
        {confirming ? (
          <ConfirmDialog
            title="Withdraw this application?"
            body={`${confirming.posting.employerName} will no longer see it. You can apply again while the posting stays open.`}
            cancelLabel="Keep it"
            cancelStyle="secondary"
            onCancel={withdrawing ? undefined : () => setConfirming(null)}
            confirmLabel="Withdraw"
            onConfirm={withdrawing ? () => {} : confirmWithdraw}
          />
        ) : null}
      </DialogModal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg.subtle,
  },
  // 4.3 content: pad 66/16/16/16 (66 = the status bar plus 22), gap 12.
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
  loading: {
    gap: spacing.md,
  },
  // app-* card: pad 12/14, gap 6, r8 on bg/default.
  card: {
    gap: 6,
    paddingVertical: spacing.md,
    paddingHorizontal: 14,
    borderRadius: radius.input,
    backgroundColor: colors.bg.default,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  cardTitle: {
    flex: 1,
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  meta: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  orderNote: {
    ...typography.caption,
    color: colors.text.secondary,
  },
});
