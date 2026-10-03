/**
 * Applicant detail (prototype 4.6, 4.6k, 4.6t) and the decline dialog over it (4.9, 4.9k, 4.9t;
 * FR-APPLY-05, FR-APPLY-08) — Naveenkhan.
 *
 * What the employer may know about one applicant, and nothing more: the posting applied to, the
 * name and phone-verified badge, who endorsed them and for what, Display/ProfileTrustBlock
 * (rating and count, completion rate and jobs — or "New to YouthLink"), and their note. No dispute
 * or case history is ever shown, only aggregate figures (FR-APPLY-05 criterion 3).
 *
 * Select opens Confirm selection (4.7); Decline opens Feedback/ConfirmDialog over this screen and,
 * confirmed, returns to the pool, where the row now reads declined (4.5d).
 *
 * Opened from a pending row of the pool with `{ gigPostingId, applicationId }`. It re-reads the
 * pool rather than trusting a copy passed in, so it always shows the applicant as they are now.
 */
import { useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { colors, spacing, typography } from "../../theme/tokens";
import ScreenHeader from "../../components/ScreenHeader";
import Badge from "../../components/Badge";
import ProfileTrustBlock from "../../components/ProfileTrustBlock";
import Button from "../../components/Button";
import CtaBar from "../../components/CtaBar";
import LoadingState from "../../components/LoadingState";
import FormBanner from "../../components/FormBanner";
import ConfirmDialog from "../../components/ConfirmDialog";
import DialogModal from "../../components/DialogModal";
import { getApplicantPool, declineApplicant } from "../../api/application.api";
import { parseApiError } from "../../api/client";
import { DECLINE_DIALOG_BODY, endorsersSentence, endorsementCountLine } from "./application.format";

/** The trust block's props for this applicant's tier (4.6 history, 4.6t endorsed, 4.6k neither). */
function trustBlockProps(row) {
  if (row.tier === "history") {
    return {
      tier: "history",
      ratingAverage: row.ratingAverage,
      ratingCount: row.ratingCount,
      completionRate: row.completionRate,
      jobCount: row.jobCount,
    };
  }
  if (row.endorsementCount > 0) {
    // endorserName only switches the Endorsed badge on; the line reads "1 endorsement" (4.6t).
    return { tier: "zeroHistory", endorserName: row.endorsers[0]?.name, subtext: endorsementCountLine(row.endorsementCount) };
  }
  return { tier: "zeroHistory", subtext: "No endorsements yet" };
}

export default function ApplicantDetailScreen({ route, navigation }) {
  const { gigPostingId, applicationId } = route.params ?? {};
  const [pool, setPool] = useState(null);
  const [error, setError] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      setPool(await getApplicantPool(gigPostingId));
      setError(null);
    } catch (err) {
      setError(parseApiError(err).formError || "This applicant couldn't be loaded.");
    }
  }, [gigPostingId]);

  useEffect(() => {
    load();
    return navigation.addListener("focus", load);
  }, [load, navigation]);

  const row = pool?.applicants.find((a) => a.applicationId === applicationId);
  const pending = row?.status === "PENDING";

  async function confirmDecline() {
    setBusy(true);
    try {
      await declineApplicant(applicationId);
      setConfirming(false);
      navigation.goBack(); // 4.9 → 4.5d: the pool, with this row declined
    } catch (err) {
      setConfirming(false);
      setError(parseApiError(err).formError || "The applicant couldn't be declined.");
    } finally {
      setBusy(false);
    }
  }

  let endorsementLine = null;
  if (row?.endorsementCount > 0) endorsementLine = <Text style={styles.endorsers}>{endorsersSentence(row.endorsers)}</Text>;
  else if (row && row.tier === "new") endorsementLine = <Text style={styles.caption}>Not endorsed yet — new to YouthLink.</Text>;

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScreenHeader title="Applicant" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content}>
        {error ? <FormBanner kind="error" message={error} /> : null}
        {error && !pool ? <Button title="Try again" style="secondary" onPress={load} /> : null}
        {!pool && !error ? <LoadingState /> : null}

        {row ? (
          <>
            <Text style={styles.caption}>Applied to: {pool.posting.title}</Text>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{row.worker.displayName}</Text>
              {row.worker.phoneVerified ? <Badge family="verified" /> : null}
            </View>
            {endorsementLine}
            <ProfileTrustBlock {...trustBlockProps(row)} />
            {row.note ? (
              <>
                <Text style={styles.caption}>APPLICATION NOTE</Text>
                <Text style={styles.note}>{row.note}</Text>
              </>
            ) : null}
          </>
        ) : null}
      </ScrollView>

      {pending ? (
        <CtaBar surface="subtle">
          <View style={styles.actions}>
            <View style={styles.action}>
              <Button
                title="Select"
                onPress={() => navigation.navigate("ApplicationConfirmSelection", { gigPostingId, applicationId })}
              />
            </View>
            <View style={styles.action}>
              <Button title="Decline" style="secondary" onPress={() => setConfirming(true)} />
            </View>
          </View>
        </CtaBar>
      ) : null}

      {/* 4.9: Decline {name}? — over the detail. */}
      <DialogModal visible={confirming && Boolean(row)} onRequestClose={() => setConfirming(false)}>
        {row ? (
          <ConfirmDialog
            title={`Decline ${row.worker.displayName}?`}
            body={DECLINE_DIALOG_BODY}
            cancelLabel="Keep in pool"
            cancelStyle="secondary"
            onCancel={busy ? undefined : () => setConfirming(false)}
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
  // 4.6 content: pad 16/16/0/16, gap 12.
  content: {
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.gutter,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  caption: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  // A name and its badge wrap rather than squeeze the name (design-system.md §5).
  nameRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    columnGap: spacing.sm,
    rowGap: spacing.xs,
  },
  name: {
    ...typography.title,
    color: colors.text.primary,
  },
  endorsers: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  note: {
    ...typography.secondary,
    color: colors.text.primary,
  },
  // ctaBar `actions`: two FILL buttons side by side, gap 8.
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  action: {
    flex: 1,
  },
});
