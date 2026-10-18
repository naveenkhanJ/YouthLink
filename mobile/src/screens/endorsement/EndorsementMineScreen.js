/**
 * My endorsements (prototype 8.5, 8.5c / 8.5cI / 8.5cK, 8.5d / 8.5dI / 8.5dK, 8.5z;
 * FR-ENDORSE-07, FR-ENDORSE-11) — Afham.
 *
 * The Verifier's Endorsements tab and their landing screen (MNAV NAV.3; the Home shell opens the
 * first tab's hub). Every endorsement they have given, newest first, revoked ones included:
 *
 *   trackRecord   "N endorsed, M went on to build a good rating" — the server derives both live
 *                 (N = active endorsements, M = those whose worker now has a rating average of 4.0
 *                 or more); this screen only words them. Under it, "Only you can see this."
 *                 (FR-ENDORSE-11: private to the Verifier).
 *   rows          Display/EndorsementRow: the person's name, the Verifier's own reason, the selected
 *                 attributes and "Revoke". A revoked row keeps its name and reason in text/secondary
 *                 with "Revoked", drops the chips and the action, and stays where it was — the list
 *                 is ordered by when each was given, so nothing moves under the finger.
 *   revoke        Feedback/ConfirmDialog over the list (8.5c, one dialog with the name interpolated —
 *                 8.5cI / 8.5cK are the same component): "Keep" (Secondary, the safe escape) and
 *                 "Revoke" (Destructive). Revoking reloads, and the counter is recomputed (8.5d).
 *   8.5z          nothing given yet: no track record ("a record of nothing is not a record"), the
 *                 privacy note, and Feedback/EmptyState {NoneExist} with "Vouch for someone".
 *
 * Not drawn, composed per design-system.md §8: loading → Feedback/LoadingState cards; a failed first
 * load → Feedback/FormBanner {Kind=Error} with "Try again"; a failed refresh while offline → the
 * list as last loaded under Feedback/OfflineBar; a failed revoke → FormBanner above the list.
 *
 * `<PushContextLine role="verifier" />` sits under the title (FR-NOTIF-09): shown only while the
 * notification permission dialog is up.
 */
import { useCallback, useRef, useState } from "react";
import { View, Text, FlatList, RefreshControl, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing, typography } from "../../theme/tokens";
import EndorsementRow from "../../components/EndorsementRow";
import EmptyState from "../../components/EmptyState";
import LoadingState from "../../components/LoadingState";
import FormBanner from "../../components/FormBanner";
import OfflineBar from "../../components/OfflineBar";
import Button from "../../components/Button";
import ConfirmDialog from "../../components/ConfirmDialog";
import DialogModal from "../../components/DialogModal";
import ShellTabBar, { openShellTab } from "../../components/ShellTabBar";
import PushContextLine from "../notification/PushContextLine";
import { getGivenEndorsements, revokeEndorsement } from "../../api/endorsement.api";
import { trackRecordLine } from "./endorsement.format";

const PRIVACY_NOTE = "Only you can see this.";
const REVOKE_BODY = "Revoking stops future display but doesn't undo a hire that already happened. They'll be told.";
// Not drawn: the list is kept from the last load while the phone is offline (NFR-USE-01's
// "already-loaded … viewable"), worded the way 3.1ofl's bar is.
const OFFLINE_BAR = "Offline — showing your endorsements as last loaded";
const LOAD_FAILED = "Your endorsements couldn't be loaded.";

export default function EndorsementMineScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [data, setData] = useState(null); // { trackRecord, endorsements } once loaded
  const [error, setError] = useState(null); // a failed load
  const [offline, setOffline] = useState(false); // a refresh failed offline, data kept
  const [actionError, setActionError] = useState(null); // a failed revoke
  const [refreshing, setRefreshing] = useState(false);
  const [confirming, setConfirming] = useState(null); // the endorsement whose Revoke was tapped
  const [revoking, setRevoking] = useState(false);

  const loaded = useRef(false); // whether a list is on screen, read by load() without re-creating it

  const load = useCallback(async () => {
    try {
      setData(await getGivenEndorsements());
      loaded.current = true;
      setError(null);
      setOffline(false);
    } catch (err) {
      // With a list already on screen, being offline keeps it; anything else is reported.
      if (loaded.current && err.offline) setOffline(true);
      else setError(err.message || LOAD_FAILED);
    } finally {
      setRefreshing(false);
    }
  }, []);

  // On open, and every time the tab is returned to: a vouch just given, a rating that moved M.
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  async function confirmRevoke() {
    if (!confirming) return;
    setRevoking(true);
    setActionError(null);
    try {
      await revokeEndorsement(confirming.id);
    } catch (err) {
      setActionError(err.message);
    } finally {
      // Reload either way: a 409 means it was already revoked elsewhere, and the list should say so.
      setConfirming(null);
      setRevoking(false);
      load();
    }
  }

  const endorsements = data?.endorsements ?? [];
  const hasAny = endorsements.length > 0;

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <FlatList
        data={endorsements}
        keyExtractor={(e) => e.id}
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
            <Text style={styles.screenTitle} accessibilityRole="header">
              My endorsements
            </Text>
            <PushContextLine role="verifier" />
            {offline ? <OfflineBar message={OFFLINE_BAR} /> : null}
            {error ? <FormBanner kind="error" message={error} /> : null}
            {error && !data ? <Button title="Try again" style="secondary" onPress={load} /> : null}
            {actionError ? <FormBanner kind="error" message={actionError} /> : null}
            {/* 8.5z has no track record: there is nothing yet to keep a record of. */}
            {hasAny ? <Text style={styles.trackRecord}>{trackRecordLine(data.trackRecord)}</Text> : null}
            {data ? <Text style={styles.privacyNote}>{PRIVACY_NOTE}</Text> : null}
          </View>
        }
        ListEmptyComponent={
          !data ? (
            error ? null : (
              <View style={styles.loading}>
                <LoadingState />
                <LoadingState />
                <LoadingState />
              </View>
            )
          ) : (
            // 8.5z: Cause=NoneExist, with the action that would create something.
            <EmptyState
              title="No endorsements yet"
              body="Vouch for someone you know and they will appear here, with how they went on to fare."
              actionLabel="Vouch for someone"
              onAction={() => openShellTab(navigation, "verifier", "vouch")}
            />
          )
        }
        renderItem={({ item }) => (
          <EndorsementRow
            endorserName={item.workerName}
            reason={item.reason ?? ""}
            attributes={item.attributes}
            revoked={!item.active}
            showRevoke={item.active}
            onRevoke={() => setConfirming(item)}
          />
        )}
      />

      {/* NAV.3: the Verifier's tab bar, Endorsements active. */}
      <ShellTabBar active="endorsements" />

      {/* 8.5c / 8.5cI / 8.5cK: one dialog, the person named in its title. */}
      <DialogModal visible={Boolean(confirming)} onRequestClose={() => (revoking ? null : setConfirming(null))}>
        {confirming ? (
          <ConfirmDialog
            title={`Revoke your endorsement of ${confirming.workerName}?`}
            body={REVOKE_BODY}
            cancelLabel="Keep"
            cancelStyle="secondary"
            onCancel={revoking ? undefined : () => setConfirming(null)}
            confirmLabel="Revoke"
            onConfirm={revoking ? () => {} : confirmRevoke}
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
  // 8.5 content: pad 66/16/16/16 (66 = the status bar plus 22), gap 12. Rows hug their content.
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
  trackRecord: {
    ...typography.secondary,
    color: colors.text.primary,
  },
  privacyNote: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  loading: {
    gap: spacing.md,
  },
});
