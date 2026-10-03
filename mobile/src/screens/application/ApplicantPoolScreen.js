/**
 * Applicant pool (prototype 4.5, 4.5b, 4.5s/4.5sk/4.5st, 4.5d/4.5dk/4.5dt, 4.5x; the decline dialog
 * from the pool 4.9p/4.9pk/4.9pt; FR-APPLY-04, FR-APPLY-05, FR-APPLY-06, FR-APPLY-08) — Naveenkhan.
 *
 * The employer's pool for ONE posting, opened with `{ gigPostingId }` — from the posting detail's
 * "N applicants — view pool" (M2 2.11) or a "New applicant" notification (M3 3.10ea).
 *
 * Rows come from the server already in FR-APPLY-04's order (history, then endorsed newcomers, then
 * newcomers; earliest application first inside tiers 2 and 3), drawn with Display/ApplicantRow:
 *   - a pending row carries Select (→ Confirm selection, 4.7) and Decline (→ the 4.9p dialog), and
 *     the row itself opens the applicant's detail (4.6);
 *   - a selected row says so and opens the contact details (4.8);
 *   - a declined or not-selected row stays "for your records", inert (4.5d, 4.5x).
 * Withdrawn applications are not in the pool at all (FR-APPLY-03).
 *
 * States: loading → Feedback/LoadingState; no applicants → Feedback/EmptyState {NoneExist} with
 * "Edit pay or details" (4.5b, FR-POST-17's own wording); a failed load → FormBanner + retry.
 * Reloads on focus, so a selection or decline made on the detail screens shows on return.
 */
import { useCallback, useEffect, useState } from "react";
import { View, Text, Pressable, FlatList, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { colors, spacing, typography } from "../../theme/tokens";
import ScreenHeader from "../../components/ScreenHeader";
import ApplicantRow from "../../components/ApplicantRow";
import EmptyState from "../../components/EmptyState";
import LoadingState from "../../components/LoadingState";
import FormBanner from "../../components/FormBanner";
import Button from "../../components/Button";
import ConfirmDialog from "../../components/ConfirmDialog";
import DialogModal from "../../components/DialogModal";
import { getApplicantPool, declineApplicant } from "../../api/application.api";
import { getGigPosting } from "../../api/posting.api";
import { parseApiError } from "../../api/client";
import {
  TIER_NOTE,
  DECLINE_DIALOG_BODY,
  poolContext,
  emptyPoolContext,
  poolResolvedNote,
} from "./application.format";

export default function ApplicantPoolScreen({ route, navigation }) {
  const gigPostingId = route.params?.gigPostingId;
  const [pool, setPool] = useState(null); // { posting, applicants } once loaded
  const [error, setError] = useState(null);
  const [declining, setDeclining] = useState(null); // the applicant whose Decline was tapped
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!gigPostingId) return;
    try {
      setPool(await getApplicantPool(gigPostingId));
      setError(null);
    } catch (err) {
      setError(parseApiError(err).formError || "The applicants couldn't be loaded.");
    }
  }, [gigPostingId]);

  useEffect(() => {
    load();
    return navigation.addListener("focus", load);
  }, [load, navigation]);

  async function confirmDecline() {
    if (!declining) return;
    setBusy(true);
    try {
      await declineApplicant(declining.applicationId);
      setDeclining(null);
      await load(); // 4.5d: the row stays, declined, with no actions
    } catch (err) {
      setDeclining(null);
      setError(parseApiError(err).formError || "The applicant couldn't be declined.");
    } finally {
      setBusy(false);
    }
  }

  // 4.5b's "Edit pay or details": the Gig Posting module's own edit screen, which takes the
  // owner's full posting, so it is read first.
  async function openEdit() {
    try {
      const { posting } = await getGigPosting(gigPostingId);
      navigation.navigate("PostingEdit", { posting });
    } catch (err) {
      setError(parseApiError(err).formError || "The posting couldn't be opened.");
    }
  }

  const posting = pool?.posting;
  const applicants = pool?.applicants ?? [];
  const params = (row) => ({ gigPostingId, applicationId: row.applicationId });

  function renderRow({ item: row }) {
    const pending = row.status === "PENDING";
    const selected = row.status === "SELECTED";
    const tierRow = (
      <ApplicantRow
        tier={row.tier}
        name={row.worker.displayName}
        ratingAverage={row.ratingAverage}
        ratingCount={row.ratingCount}
        completionRate={row.completionRate}
        endorsed={row.endorsementCount > 0}
        endorsementCount={row.endorsementCount}
        note={pending ? row.note ?? "" : poolResolvedNote({ ...row, arrangementType: posting.arrangementType })}
        onSelect={pending ? () => navigation.navigate("ApplicationConfirmSelection", params(row)) : undefined}
        onDecline={pending ? () => setDeclining(row) : undefined}
      />
    );
    if (!pending && !selected) return tierRow; // declined / not selected: kept for the record, inert
    return (
      <Pressable
        onPress={() =>
          navigation.navigate(selected ? "ApplicationContactDetails" : "ApplicationApplicantDetail", params(row))
        }
        accessibilityRole="button"
        accessibilityLabel={row.worker.displayName}
      >
        {tierRow}
      </Pressable>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScreenHeader title="Applicants" onBack={() => navigation.goBack()} />
      <FlatList
        data={applicants}
        keyExtractor={(row) => row.applicationId}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.header}>
            {error ? <FormBanner kind="error" message={error} /> : null}
            {error && !pool ? <Button title="Try again" style="secondary" onPress={load} /> : null}
            {posting && applicants.length > 0 ? (
              <>
                <Text style={styles.context}>{poolContext(posting)}</Text>
                <Text style={styles.context}>{TIER_NOTE}</Text>
              </>
            ) : null}
            {posting && applicants.length === 0 ? (
              <Text style={styles.context}>{emptyPoolContext(posting)}</Text>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          !pool ? (
            error || !gigPostingId ? null : <LoadingState />
          ) : posting.status === "OPEN" ? (
            // 4.5b: nobody has applied yet.
            <EmptyState
              title="No applicants yet"
              body="Your posting is live in Browse. Applications appear here as youth apply."
              actionLabel="Edit pay or details"
              onAction={openEdit}
            />
          ) : (
            <EmptyState title="No applicants yet" body="" />
          )
        }
        renderItem={renderRow}
      />

      {/* 4.9p: Decline {name}? — over the pool. */}
      <DialogModal visible={Boolean(declining)} onRequestClose={() => setDeclining(null)}>
        {declining ? (
          <ConfirmDialog
            title={`Decline ${declining.worker.displayName}?`}
            body={DECLINE_DIALOG_BODY}
            cancelLabel="Keep in pool"
            cancelStyle="secondary"
            onCancel={busy ? undefined : () => setDeclining(null)}
            confirmLabel="Decline"
            onConfirm={busy ? () => {} : confirmDecline}
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
  // 4.5 content: pad 16/16/24/16, gap 12; a long pool scrolls (FR-APPLY-11 sets no cap).
  content: {
    flexGrow: 1,
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.gutter,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  header: {
    gap: spacing.md,
  },
  context: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
});
