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
 * The drawn fields, in the drawn order: Title, Pay, Workers needed, Schedule (part-time and
 * internship only) and one "Start date & time" picker field (the same StartDateTimeField the
 * create form uses). FR-POST-11 lets the employer edit any field, so the fields the frames don't
 * draw are added with the create flow's own inputs and labels (lead's decision, 2026-10-18):
 * Description under Title (the two share step 1), Category (2.2's rows, components/OptionRow.js),
 * and the Location step's Address, Area picker and "Shown to workers as" note (2.6, with
 * components/AreaPicker.js) after the start. Arrangement type and pay kind are not editable: they
 * decide what kind of posting it is.
 *
 * What the server does with a save is its rule, not this screen's: after a fill, a material change
 * (pay, timing, location, workers needed, category) is saved together with a re-confirmation
 * request for each engaged worker (FR-POST-11 criterion 2, FR-ENG-09), it is refused within 2
 * hours of the start, and a second one is refused while the first is waiting. A refusal is shown
 * in the banner. A title or description change (minor) always saves.
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
import TextArea from '../../components/TextArea';
import { LIMITS, GIG_CATEGORIES, validateLeadTime } from './posting.constants.js';
import {
  APPLY_NOTE,
  MATERIAL_CHANGE_WARNING,
  digitsOnly,
  editChanges,
  editPayLabel,
  editedNotes,
  engagedFirstName,
  formatStartFull,
  groupDigits,
  hasMaterialChange,
  reconfirmDeadline,
  saveDialogBody,
} from './posting.format.js';
import StartDateTimeField from './components/StartDateTimeField.js';
import AreaPicker from './components/AreaPicker.js';
import OptionRow from './components/OptionRow.js';

// The create flow's own messages for the location fields (PostingCreateScreen.js, round 4 L-1).
const ADDRESS_REQUIRED = 'Enter the address.';
const AREA_REQUIRED = 'Choose your area from the list.';
// The create flow has no message here (its Continue simply stays off while Description is
// empty); this one follows the edit form's "Enter a title for the posting." — undrawn copy.
const DESCRIPTION_REQUIRED = 'Enter a description.';

const categoryLabel = (id) => GIG_CATEGORIES.find((c) => c.id === id)?.label ?? id;

/**
 * The fields the drawn form doesn't carry (description, category, location) that now differ,
 * added to the PATCH body beside editChanges'. The area goes as the chosen list name.
 */
function extraChanges(posting, form) {
  const changes = {};
  if (form.description.trim() !== (posting.description || '').trim()) changes.description = form.description.trim();
  if (form.category && form.category !== posting.category) changes.category = form.category;
  if (form.locationAddress.trim() !== (posting.locationAddress || '').trim()) {
    changes.locationAddress = form.locationAddress.trim();
  }
  if (form.locationArea && form.locationArea !== posting.locationAreaLabel) changes.locationArea = form.locationArea;
  return changes;
}

/** 2.11e `editedNote` lines for category and location, in editedNotes' "X changed from Y." pattern. */
function extraEditedNotes(posting, changes) {
  const notes = [];
  if (changes.category) notes.push(`Category changed from ${categoryLabel(posting.category)}.`);
  if (changes.locationAddress != null || changes.locationArea != null) {
    notes.push(`Location changed from ${posting.locationAreaLabel} area.`);
  }
  return notes;
}

/**
 * 2.11e2's dialog body with the undrawn fields. Drawn fields keep saveDialogBody's exact sentences;
 * a category or location change adds one sentence in the same pattern, and when it is the only
 * material change the re-confirm deadline and pending-applicant sentences are added here, worded
 * exactly as saveDialogBody words them.
 */
function dialogBody(posting, changes) {
  const { description, category, locationAddress, locationArea, ...drawn } = changes;
  const extra = [];
  if (category) extra.push(`The category changes to ${categoryLabel(category)}.`);
  if (locationAddress != null || locationArea != null) {
    extra.push(`The location changes to ${locationArea ?? posting.locationAreaLabel} area.`);
  }
  if (extra.length === 0) {
    return [saveDialogBody(posting, drawn), description != null ? 'The description changes.' : ''].filter(Boolean).join(' ');
  }
  const { title: _title, ...drawnMaterial } = drawn; // a title change isn't named beside a material one
  if (hasMaterialChange(drawnMaterial)) return [...extra, saveDialogBody(posting, drawnMaterial)].join(' ');
  const who = engagedFirstName(posting) ?? 'Each engaged worker';
  extra.push(
    `${who} has until ${formatStartFull(reconfirmDeadline(posting.startAt))} to re-confirm — if they don't accept by then, that engagement moves into cancellation.`,
  );
  const waiting = posting.pendingApplicantCount ?? 0;
  if (waiting > 0) {
    extra.push(`The ${waiting} pending applicant${waiting === 1 ? '' : 's'} ${waiting === 1 ? 'is' : 'are'} told what changed.`);
  }
  return extra.join(' ');
}

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
  const [description, setDescription] = useState(posting.description || '');
  const [category, setCategory] = useState(posting.category);
  const [locationAddress, setLocationAddress] = useState(posting.locationAddress || '');
  // As on the Location step: `areaQuery` is what is typed in Area; only a row tapped from the
  // list sets `locationArea`. Both start at the posting's current area.
  const [locationArea, setLocationArea] = useState(posting.locationAreaLabel || null);
  const [areaQuery, setAreaQuery] = useState(posting.locationAreaLabel || '');

  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Scrolls a focused field to a fixed place under the top (see hooks/useFocusScroll.js).
  const scrollRef = useRef(null);
  const { field, scrollProps } = useFocusScroll(scrollRef);

  const form = { title, payAmount, workersNeeded, schedule, startAt, description, category, locationAddress, locationArea };
  const changes = useMemo(
    () => ({ ...editChanges(posting, form), ...extraChanges(posting, form) }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [posting, title, payAmount, workersNeeded, schedule, startAt, description, category, locationAddress, locationArea],
  );
  const dirty = Object.keys(changes).length > 0;
  const notes = engaged ? [...editedNotes(posting, changes), ...extraEditedNotes(posting, changes)] : [];

  // Typing in Area after choosing drops the choice: only a row from the list counts (as on 2.6).
  function handleAreaQuery(text) {
    setAreaQuery(text);
    if (locationArea) setLocationArea(null);
  }

  function handleAreaChosen(name) {
    setLocationArea(name);
    setAreaQuery(name);
  }

  // Same rules as the create form (and the server): a changed start is held to the 2-hour minimum.
  const startError =
    changes.startAt && startAt && !validateLeadTime(startAt).valid ? validateLeadTime(startAt).message : null;

  /** The first problem with what is typed, or null. The server re-checks everything. */
  function validate() {
    const errors = {};
    if (!title.trim()) errors.title = 'Enter a title for the posting.';
    if (!description.trim()) errors.description = DESCRIPTION_REQUIRED;
    if (!locationAddress.trim()) errors.locationAddress = ADDRESS_REQUIRED;
    if (!locationArea) errors.locationArea = AREA_REQUIRED;
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
      // Back to the detail this form was opened from, which reloads on focus (2.11). Navigating
      // to a new detail instead left this form, dialog open, underneath it (round 4, L-3).
      navigation.goBack();
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

        {/* Description: the create flow's step 1 field (TextArea has no onFocus, so the touch that
            focuses it also scrolls it into view). A minor change, like the title. */}
        <View style={styles.field} onLayout={field('description').onLayout} onTouchStart={field('description').onFocus}>
          <Text style={styles.label}>Description</Text>
          <TextArea
            value={description}
            onChangeText={setDescription}
            maxLength={LIMITS.DESCRIPTION_MAX}
            error={Boolean(fieldErrors.description)}
            accessibilityLabel="Description"
          />
        </View>
        {fieldErrors.description ? <FieldError message={fieldErrors.description} /> : null}

        {/* Category: 2.2's seven rows, the allow-list and nothing else (FR-POST-02). */}
        <View style={styles.field}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.optionList}>
            {GIG_CATEGORIES.map((cat) => (
              <OptionRow key={cat.id} label={cat.label} selected={category === cat.id} onPress={() => setCategory(cat.id)} />
            ))}
          </View>
        </View>
        {fieldErrors.category ? <FieldError message={fieldErrors.category} /> : null}

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

        {/* Location: 2.6's Address and the Area picker (round 4, L-1). The precise address is the
            owner's and the selected worker's only (FR-POST-08); workers see the area. */}
        <TextField
          label="Address"
          value={locationAddress}
          onChangeText={setLocationAddress}
          placeholder="e.g. 23 Temple Road, Colombo 04"
          autoCapitalize="words"
          error={Boolean(fieldErrors.locationAddress)}
          {...field('address')}
        />
        {fieldErrors.locationAddress ? <FieldError message={fieldErrors.locationAddress} /> : null}
        <AreaPicker
          query={areaQuery}
          onChangeQuery={handleAreaQuery}
          value={locationArea}
          onChoose={handleAreaChosen}
          error={fieldErrors.locationArea}
          {...field('area')}
        />
        {locationArea ? <Text style={styles.note}>{`Shown to workers as: ${locationArea} area`}</Text> : null}

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
          body={dialogBody(posting, changes)}
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
  // The create flow's Description label and Category list (PostingCreateScreen.js styles).
  field: {
    gap: spacing.xs,
  },
  label: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  optionList: {
    gap: spacing.sm,
  },
  // 2.6 `areaNote`: mobile/caption, color/text/secondary.
  note: {
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
