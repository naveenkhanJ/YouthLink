/**
 * Edit posting (prototype 2.11pe, 2.11de, 2.11e, 2.11e2; FR-POST-11) — Lahiru.
 *
 * Two drawn moments, chosen by whether any place is filled:
 *   No one engaged (2.11pe gig, 2.11de part-time) → the current values, an `applyNote`, and
 *       "Save changes", which stays disabled until something changes. A change applies at once.
 *   Someone engaged (2.11e) → the same fields under a `materialChangeWarning`, an
 *       `editedNote` naming what moved, and "Review changes", which opens the 2.11e2
 *       "Save these changes?" dialog (Keep editing / Save changes).
 *
 * The fields are exactly the ones drawn: Title, Pay, Workers needed, Schedule (part-time and
 * internship only) and one "Start date & time" picker field (the same StartDateTimeField the
 * create form uses).
 *
 * What the server does with a save is its rule, not this screen's: after a fill, a pay, timing or
 * Workers-needed change is saved together with a re-confirmation request for the engaged worker
 * (FR-POST-11 criterion 2), and a second one is refused while the first is waiting. A refusal is
 * shown in the banner. A title change always saves.
 */
import { useMemo, useRef, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors, spacing, radius, typography } from '../../theme/tokens';
import ScreenHeader from '../../components/ScreenHeader';
import TextField from '../../components/TextField';
import Button from '../../components/Button';
import CtaBar from '../../components/CtaBar';
import FormBanner from '../../components/FormBanner';
import FieldError from '../../components/FieldError';
import ConfirmDialog from '../../components/ConfirmDialog';
import DialogModal from '../../components/DialogModal';
import useFocusScroll from '../../hooks/useFocusScroll';
import { updateGigPosting } from '../../api/posting.api.js';
import { LIMITS, validateLeadTime } from './posting.constants.js';
import {
  APPLY_NOTE,
  MATERIAL_CHANGE_WARNING,
  digitsOnly,
  editChanges,
  editPayLabel,
  editedNotes,
  groupDigits,
  saveDialogBody,
} from './posting.format.js';
import StartDateTimeField from './components/StartDateTimeField.js';

export default function PostingEditScreen({ route, navigation }) {
  const { posting } = route.params;
  const engaged = (posting.filledCount ?? 0) > 0;
  const hasSchedule = posting.arrangementType !== 'GIG';
  const hasPay = posting.payKind !== 'UNPAID';

  const [title, setTitle] = useState(posting.title);
  const [payAmount, setPayAmount] = useState(hasPay ? String(Math.round(Number(posting.payAmount))) : '');
  const [workersNeeded, setWorkersNeeded] = useState(String(posting.workersNeeded));
  const [schedule, setSchedule] = useState(posting.schedule || '');
  const [startAt, setStartAt] = useState(posting.startAt);

  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Scrolls a focused field to a fixed place under the top (see hooks/useFocusScroll.js).
  const scrollRef = useRef(null);
  const { field, scrollProps } = useFocusScroll(scrollRef);

  const form = { title, payAmount, workersNeeded, schedule, startAt };
  const changes = useMemo(
    () => editChanges(posting, form),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [posting, title, payAmount, workersNeeded, schedule, startAt],
  );
  const dirty = Object.keys(changes).length > 0;
  const notes = engaged ? editedNotes(posting, changes) : [];

  // Same rules as the create form (and the server): a changed start is held to the 2-hour minimum.
  const startError =
    changes.startAt && startAt && !validateLeadTime(startAt).valid ? validateLeadTime(startAt).message : null;

  /** The first problem with what is typed, or null. The server re-checks everything. */
  function validate() {
    const errors = {};
    if (!title.trim()) errors.title = 'Enter a title for the posting.';
    if (hasPay && !(Number(payAmount) > 0)) errors.payAmount = 'Enter a pay amount greater than zero.';
    const n = Number(workersNeeded);
    if (!Number.isInteger(n) || n < LIMITS.WORKERS_MIN || n > LIMITS.WORKERS_MAX) {
      errors.workersNeeded = `Enter a whole number between ${LIMITS.WORKERS_MIN} and ${LIMITS.WORKERS_MAX}.`;
    }
    if (hasSchedule && !schedule.trim()) errors.schedule = 'Enter the schedule.';
    if (!startAt) errors.start = 'Enter the start date and time.';
    else if (startError) errors.start = startError;
    return errors;
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      await updateGigPosting(posting.id, changes);
      navigation.navigate('PostingDetail', { postingId: posting.id }); // 2.11 reloads on focus
    } catch (err) {
      setConfirmOpen(false);
      setFieldErrors(err.fields || {});
      setError(err.message || "Your changes couldn't be saved.");
    } finally {
      setSaving(false);
    }
  }

  function handlePrimary() {
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;
    // 2.11e: an engaged worker's edit is confirmed first (2.11e2). 2.11pe saves straight away.
    if (engaged) setConfirmOpen(true);
    else save();
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScreenHeader title="Edit posting" onBack={() => navigation.goBack()} />

      <ScrollView
        ref={scrollRef}
        {...scrollProps}
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {error ? <FormBanner kind="error" message={error} /> : null}

        {engaged ? (
          <View style={styles.warning}>
            <Text style={styles.warningTitle}>
              {posting.filledCount === 1 ? '1 worker is already engaged' : `${posting.filledCount} workers are already engaged`}
            </Text>
            <Text style={styles.warningBody}>{MATERIAL_CHANGE_WARNING}</Text>
          </View>
        ) : null}

        <TextField
          label="Title"
          value={title}
          onChangeText={setTitle}
          autoCapitalize="sentences"
          maxLength={LIMITS.TITLE_MAX}
          error={fieldErrors.title}
          {...field('title')}
        />
        {fieldErrors.title ? <FieldError message={fieldErrors.title} /> : null}

        {hasPay ? (
          <>
            <TextField
              label={editPayLabel(posting)}
              value={groupDigits(payAmount)}
              onChangeText={(v) => setPayAmount(digitsOnly(v).slice(0, 9))}
              keyboardType="number-pad"
              error={fieldErrors.payAmount}
              {...field('pay')}
            />
            {fieldErrors.payAmount ? <FieldError message={fieldErrors.payAmount} /> : null}
          </>
        ) : null}

        <TextField
          label="Workers needed"
          value={workersNeeded}
          onChangeText={(v) => setWorkersNeeded(digitsOnly(v))}
          keyboardType="number-pad"
          maxLength={2}
          error={fieldErrors.workersNeeded}
          {...field('workers')}
        />
        {fieldErrors.workersNeeded ? <FieldError message={fieldErrors.workersNeeded} /> : null}

        {hasSchedule ? (
          <>
            <TextField
              label="Schedule"
              value={schedule}
              onChangeText={setSchedule}
              autoCapitalize="sentences"
              maxLength={LIMITS.SCHEDULE_MAX}
              error={fieldErrors.schedule}
              {...field('schedule')}
            />
            {fieldErrors.schedule ? <FieldError message={fieldErrors.schedule} /> : null}
          </>
        ) : null}

        <StartDateTimeField
          value={startAt}
          onChange={setStartAt}
          error={fieldErrors.start || startError}
          {...field('start')}
        />
        {fieldErrors.start || startError ? <FieldError message={fieldErrors.start || startError} /> : null}

        {engaged
          ? notes.map((note) => (
              <Text key={note} style={styles.editedNote}>
                {note}
              </Text>
            ))
          : <Text style={styles.applyNote}>{APPLY_NOTE}</Text>}

        <View style={styles.spacer} />
      </ScrollView>

      <CtaBar>
        <Button
          title={engaged ? 'Review changes' : 'Save changes'}
          onPress={handlePrimary}
          disabled={!dirty || Boolean(startError)}
          loading={saving && !engaged}
        />
      </CtaBar>

      <DialogModal visible={confirmOpen} onRequestClose={() => setConfirmOpen(false)}>
        <ConfirmDialog
          title="Save these changes?"
          body={saveDialogBody(posting, changes)}
          cancelLabel="Keep editing"
          cancelStyle="secondary"
          onCancel={() => setConfirmOpen(false)}
          confirmLabel="Save changes"
          confirmStyle="primary"
          onConfirm={saving ? () => {} : save}
        />
      </DialogModal>
    </View>
  );
}

const styles = StyleSheet.create({
  // 2.11e/2.11pe frames are color/bg/default, unlike the detail's bg/subtle.
  root: {
    flex: 1,
    backgroundColor: colors.bg.default,
  },
  scroll: {
    flex: 1,
  },
  // Figma content: pad 16/16/0/16, gap 12. The bottom padding leaves room for a focused field
  // to scroll clear of the pinned bar.
  content: {
    flexGrow: 1,
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.gutter,
    paddingBottom: 160,
    gap: spacing.md,
  },
  // materialChangeWarning: pad 10/14, gap 4, 1px color/state/urgent stroke, r10.
  warning: {
    gap: spacing.xs,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.state.urgent,
    borderRadius: radius.card,
  },
  warningTitle: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  warningBody: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  editedNote: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  applyNote: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  spacer: {
    flexGrow: 1,
    minHeight: spacing.lg,
  },
});
