/**
 * Posting detail, owner view (prototype 2.11p, 2.11, 2.11c, 2.11f, 2.11x, 2.11ex, 2.11g, 2.11pw;
 * FR-POST-11, FR-POST-12, FR-POST-14, FR-POST-18) — Lahiru.
 *
 * One screen, several moments, chosen by what the server says the posting is:
 *   Open, nothing filled   → Edit posting (opens 2.11pe/2.11de) + Withdraw (live). Withdraw opens
 *                            a confirm dialog and calls the API (FR-POST-12).
 *   Open, a slot filled    → Edit posting (2.11e), Withdraw disabled, and a note naming the two
 *                            actions that do apply: lower Workers needed in Edit, or cancel an
 *                            engagement. (Amended 2026-09-23.)
 *   Open, edit awaiting a  → 2.11c: the change note and its deadline; Edit and Withdraw both
 *   worker's re-confirm      disabled (one re-confirmation at a time, FR-ENG-09).
 *   Open, hidden for       → 2.11g: no actions; editing and withdrawal pause until the review ends.
 *   review
 *   Filled                 → managed from Engagements; no Withdraw.
 *   Withdrawn              → no actions; the fill line says what happened.
 *   Expired                → "Post a new gig" (2.11ex): an expired posting can't be reopened.
 *
 * The fill count ("1 of 3 filled") and the status badge are shown here as everywhere
 * else a posting appears (FR-POST-14, FR-POST-18).
 *
 * Two controls draw but cannot act yet, because the work they lead to is not built:
 * "See engagement" and "view pool" (Engagement and Applying & Selection screens, not on
 * develop). They are drawn disabled / as plain text rather than as buttons that do nothing.
 */
import { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors, spacing, typography } from '../../theme/tokens';
import ScreenHeader from '../../components/ScreenHeader';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import CtaBar from '../../components/CtaBar';
import ConfirmDialog from '../../components/ConfirmDialog';
import DialogModal from '../../components/DialogModal';
import FormBanner from '../../components/FormBanner';
import LoadingState from '../../components/LoadingState';
import { getGigPosting, withdrawGigPosting } from '../../api/posting.api.js';
import { GIG_CATEGORIES, ARRANGEMENT_TYPES } from './posting.constants.js';
import {
  HIDDEN_NOTE_DETAIL,
  PAUSED_NOTE,
  badgeValue,
  changeNote,
  detailFill,
  engagedFirstName,
  engagedWorkerName,
  isHiddenPending,
  metaLine,
  payDetailLine,
} from './posting.format.js';

// Prototype 2.11 `withdrawNote`, word for word.
const WITHDRAW_NOTE =
  "Withdraw isn't available once a place is filled. To stop hiring, lower Workers needed in Edit posting; to end an engagement, cancel it from Engagements.";

export default function PostingDetailScreen({ route, navigation }) {
  const { postingId } = route.params || {};
  const [posting, setPosting] = useState(null);
  const [error, setError] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);

  const load = useCallback(async () => {
    try {
      const { posting: fresh } = await getGigPosting(postingId);
      setPosting(fresh);
      setError(null);
    } catch (err) {
      setError(err.message || "This posting couldn't be loaded.");
    }
  }, [postingId]);

  // On open and whenever the screen is returned to (after an edit is saved).
  useEffect(() => {
    load();
    return navigation.addListener('focus', load);
  }, [load, navigation]);

  async function handleWithdraw() {
    setWithdrawing(true);
    try {
      await withdrawGigPosting(postingId);
      setConfirmOpen(false);
      navigation.navigate('PostingList'); // 2.11pw → 2.10w; the list reloads on focus
    } catch (err) {
      // e.g. a slot filled while the dialog was open: say why, and show the posting as it now is.
      setConfirmOpen(false);
      setError(err.message || "This posting couldn't be withdrawn.");
      load();
    } finally {
      setWithdrawing(false);
    }
  }

  const header = <ScreenHeader title="Posting" onBack={() => navigation.goBack()} />;

  if (!posting) {
    return (
      <View style={styles.root}>
        <StatusBar style="dark" />
        {header}
        <View style={styles.content}>
          {error ? <FormBanner kind="error" message={error} /> : <LoadingState />}
        </View>
      </View>
    );
  }

  const isOpen = posting.status === 'OPEN';
  const hasFilled = (posting.filledCount ?? 0) > 0;
  const hidden = isHiddenPending(posting); // 2.11g: paused, no actions
  const awaitingReconfirm = isOpen && Boolean(posting.pendingChangeRequest); // 2.11c
  const canEdit = isOpen && !hidden && !awaitingReconfirm;
  const canWithdraw = canEdit && !hasFilled;
  const waiting = posting.pendingApplicantCount ?? 0;
  const isGig = posting.arrangementType === 'GIG';

  // Which bar (if any) the prototype draws for this moment. With none (withdrawn, hidden), the
  // content carries 24 of bottom padding instead (2.11x, 2.11dx, 2.11g).
  const showsActionBar = (isOpen && !hidden) || posting.status === 'FILLED' || posting.status === 'EXPIRED';

  const categoryLabel = GIG_CATEGORIES.find((c) => c.id === posting.category)?.label;
  const arrangementLabel = ARRANGEMENT_TYPES.find((a) => a.id === posting.arrangementType)?.label;

  // The pending applicants are told when a posting with applicants is withdrawn (FR-APPLY-09).
  const dialogBody =
    waiting > 0
      ? "It comes out of Browse straight away. Anyone who has applied is told it's no longer available. This can't be undone."
      : "It comes out of Browse straight away. No one has applied yet, so there's no one to tell. This can't be undone.";

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      {header}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, !showsActionBar && styles.contentNoBar]}
      >
        {error ? <FormBanner kind="error" message={error} /> : null}

        <View style={styles.titleRow}>
          <Text style={styles.title}>{posting.title}</Text>
          <Badge family="posting" value={badgeValue(posting.status)} />
        </View>
        <Text style={styles.meta}>
          {metaLine({ categoryLabel, arrangementLabel, areaLabel: posting.locationAreaLabel })}
        </Text>
        <Text style={styles.pay}>{payDetailLine(posting)}</Text>
        <Text style={styles.fill}>{detailFill(posting, engagedWorkerName(posting))}</Text>

        {isOpen && !hidden ? (
          // TODO(YL-174 / M4): link to the applicant pool (4.5b / 4.5s) once Applying & Selection's
          // screens are on develop; until then it is drawn as the link but does not act.
          // With applicants it is always the link (brand colour). With none, a part-time job's
          // frame (2.11d, 2.11dw) draws a plain "No applicants yet"; a gig's still reads "— view pool".
          waiting > 0 || isGig ? (
            <Text style={styles.applicantsLink}>
              {waiting > 0
                ? `${waiting} ${waiting === 1 ? 'applicant' : 'applicants'} — view pool`
                : 'No applicants yet — view pool'}
            </Text>
          ) : (
            <Text style={styles.applicantsNote}>No applicants yet</Text>
          )
        ) : null}

        {awaitingReconfirm ? (
          <Text style={styles.changeNote}>{changeNote(posting.pendingChangeRequest, engagedFirstName(posting))}</Text>
        ) : null}
        {awaitingReconfirm ? <Text style={styles.note}>{PAUSED_NOTE}</Text> : null}
        {canEdit && hasFilled ? <Text style={styles.note}>{WITHDRAW_NOTE}</Text> : null}
        {hidden ? <Text style={styles.note}>{HIDDEN_NOTE_DETAIL}</Text> : null}
        {posting.status === 'EXPIRED' ? <Text style={styles.note}>Expired postings can't be reopened.</Text> : null}
        {posting.status === 'FILLED' ? (
          <Text style={styles.note}>This posting is filled. Manage the work from Engagements.</Text>
        ) : null}
      </ScrollView>

      {isOpen && !hidden ? (
        <CtaBar surface="subtle">
          <View style={styles.actions}>
            <View style={styles.action}>
              <Button
                title="Edit posting"
                style="secondary"
                disabled={!canEdit}
                onPress={() => navigation.navigate('PostingEdit', { posting })}
              />
            </View>
            <View style={styles.action}>
              <Button
                title="Withdraw"
                style="destructive"
                disabled={!canWithdraw}
                onPress={() => setConfirmOpen(true)}
              />
            </View>
          </View>
        </CtaBar>
      ) : null}

      {posting.status === 'FILLED' ? (
        <CtaBar surface="subtle">
          {/* TODO(M5 5.3t): open the engagement when Engagement's screens are on develop. */}
          <Button title="See engagement" style="secondary" disabled onPress={() => {}} />
        </CtaBar>
      ) : null}

      {posting.status === 'EXPIRED' ? (
        <CtaBar surface="subtle">
          <Button title="Post a new gig" style="secondary" onPress={() => navigation.navigate('PostingCreate')} />
        </CtaBar>
      ) : null}

      <DialogModal visible={confirmOpen} onRequestClose={() => setConfirmOpen(false)}>
        <ConfirmDialog
          title="Withdraw this posting?"
          body={dialogBody}
          cancelLabel="Keep posting"
          cancelStyle="secondary"
          onCancel={() => setConfirmOpen(false)}
          confirmLabel="Withdraw"
          onConfirm={withdrawing ? () => {} : handleWithdraw}
        />
      </DialogModal>
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
  // Figma content: pad 20/16/0/16, gap 12.
  content: {
    flexGrow: 1,
    paddingTop: 20,
    paddingHorizontal: spacing.gutter,
    gap: spacing.md,
  },
  // 2.11x, 2.11dx, 2.11g draw no pinned bar: the content frame is padded 20/16/24/16.
  contentNoBar: {
    paddingBottom: spacing.xl,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    flex: 1,
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  meta: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  pay: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  fill: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  // 2.11p / 2.11 / 2.11c `applicantsLink`: body-medium in color/brand/primary.
  applicantsLink: {
    ...typography.bodyMedium,
    color: colors.brand.primary,
  },
  // 2.11d / 2.11dw `applicantsNote`: the same size, plain, in color/text/secondary.
  applicantsNote: {
    ...typography.bodyMedium,
    color: colors.text.secondary,
  },
  note: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  // 2.11c changeNote: body-medium in color/brand/primary, ahead of the pausedNote.
  changeNote: {
    ...typography.bodyMedium,
    color: colors.brand.primary,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  action: {
    flex: 1,
  },
});
