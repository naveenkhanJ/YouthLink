/**
 * Review before submit (prototype 2.9, 2.9t, 2.9bnr; FR-POST-09) — Lahiru.
 *
 * "The only place the whole posting is visible before it goes live": every entered
 * field, plus the two computed previews FR-POST-09 asks for — the precise address
 * with the area workers will be shown, and the urgency, marked "set automatically"
 * because nobody can toggle it (FR-POST-07). Nothing here is editable; back returns
 * to the form.
 *
 * Failures draw a Feedback/FormBanner at the top. Offline (2.9bnr) says the details
 * are still here, and the form stays kept on the device (FR-POST-15, E9) so
 * reopening Post a Gig later restores it.
 */
import { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors, spacing, typography } from '../../theme/tokens';
import Button from '../../components/Button';
import CtaBar from '../../components/CtaBar';
import FormBanner from '../../components/FormBanner';
import { useAuth } from '../../auth/AuthContext';
import { createGigPosting } from '../../api/posting.api.js';
import { GIG_CATEGORIES, ARRANGEMENT_TYPES } from './posting.constants.js';
import {
  reviewPay,
  reviewTotal,
  formatStartFull,
  urgencyLine,
  postingAsLine,
} from './posting.format.js';
import { clearPostingDraft, markDraftKeptOffline } from './postingDraft.js';
import FormTopBar from './components/FormTopBar.js';

export default function PostingReviewScreen({ route, navigation }) {
  const { formData } = route.params || {};
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [banner, setBanner] = useState(null);

  // Reached without a form (e.g. a restored navigation state): nothing to review.
  useEffect(() => {
    if (!formData) navigation.navigate('PostingCreate');
  }, [formData, navigation]);
  if (!formData) return null;

  const category = GIG_CATEGORIES.find((c) => c.id === formData.category)?.label ?? formData.category;
  const arrangement = ARRANGEMENT_TYPES.find((a) => a.id === formData.arrangementType)?.label ?? '';
  const isRecurring = formData.arrangementType !== 'GIG';

  const rows = [
    ['Title', formData.title],
    ['Description', formData.description],
    ['Category', category],
    ['Type', isRecurring ? `${arrangement} · ${formData.schedule}` : arrangement],
    ['Pay', reviewPay(formData)],
    ['Total', reviewTotal(formData)],
    ['Address', formData.locationAddress],
    ['Area shown', `${formData.locationAreaLabel} area`],
    ['Start', formatStartFull(formData.startAt)],
    ['Urgency', urgencyLine(formData.isUrgent)],
    ['Workers', String(formData.workersNeeded)],
    [
      'Posting as',
      postingAsLine({
        postedAsType: formData.postedAsType,
        postedBusinessName: formData.postedBusinessName,
        legalName: user?.legalName,
      }),
    ],
  ];

  async function handlePublish() {
    setSubmitting(true);
    setBanner(null);
    try {
      // isUrgent is shown above as a preview only; the server derives it again (FR-POST-07).
      const { posting } = await createGigPosting(formData);
      await clearPostingDraft(user?.id); // posted: nothing left to keep
      // replace, so back from the confirmation never lands on a finished review
      navigation.replace('PostingSuccess', { posting });
    } catch (err) {
      if (err.offline) {
        // 2.9bnr: nothing was sent, the form stays kept on the phone.
        await markDraftKeptOffline(user?.id);
        setBanner(
          "You're offline, so this couldn't be posted. Your details are still here — try again once you reconnect.",
        );
      } else if (err.fields) {
        setBanner(Object.values(err.fields).join(' '));
      } else {
        setBanner(err.message || "This couldn't be posted. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      {/* The form's top bar: back to the last step, close out to the postings list. */}
      <FormTopBar review onBack={() => navigation.goBack()} onClose={() => navigation.navigate('PostingList')} />
      {/* No inputs here, so a plain ScrollView; the bottom padding keeps the last row clear of the bar. */}
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.screenTitle}>Review your posting</Text>
        <Text style={styles.reviewNote}>
          This is the only place the whole posting is visible before it goes live.
        </Text>

        {banner ? <FormBanner kind="error" message={banner} /> : null}

        {rows.map(([label, value]) => (
          <View key={label} style={styles.row}>
            <Text style={styles.revLabel}>{label}</Text>
            <Text style={styles.revValue}>{value}</Text>
          </View>
        ))}
      </ScrollView>

      <CtaBar>
        <Button title="Post gig" onPress={handlePublish} loading={submitting} />
      </CtaBar>
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
  // Figma content: gap 10 after the top bar (which draws its own 6 of top and bottom padding).
  content: {
    flexGrow: 1,
    paddingTop: 10,
    paddingHorizontal: spacing.gutter,
    paddingBottom: spacing.lg,
    gap: 10,
  },
  screenTitle: {
    ...typography.display,
    color: colors.text.primary,
  },
  reviewNote: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  revLabel: {
    width: 96,
    ...typography.caption,
    color: colors.text.secondary,
  },
  revValue: {
    flex: 1,
    ...typography.secondary,
    color: colors.text.primary,
  },
});
