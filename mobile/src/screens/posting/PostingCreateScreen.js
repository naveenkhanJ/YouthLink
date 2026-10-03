/**
 * Post a gig — the multi-step posting form (FR-POST-01..09) — Lahiru.
 *
 * Built to docs/prototype/M2-posting.md screens 2.1–2.8 (gig, "Step N of 7")
 * and 2.1t–2.8t (part-time / internship, which add the Schedule step, "of 8").
 * One field (or one short group) per step, exactly as the prototype draws it:
 * a mobile/display screen title, a "Step N of M" caption, the field, its
 * helper/range note, and a pinned ctaBar ("Continue", "Review posting" on the
 * last step). All colour, spacing, type and components come from the shared
 * kit (theme/tokens + components/*), never raw hex — this screen was rebuilt
 * from a free-hand, off-spec version for UI conformance (design-system.md §5.4).
 *
 * Two deliberate interim choices, both documented so they can be revisited:
 *  - Posting-as (FR-POST-16) is auto-populated from the signed-in employer's
 *    account (useAuth), NOT asked as a step — the prototype has no "Post as"
 *    step; it only shows the value on the Review screen (2.9).
 *  - Precise map-pin selection (FR-POST-08) needs react-native-maps, a native
 *    dependency (a new shared build — an escalation, not a member's call). The
 *    prototype's Display/MapArea is itself a flat placeholder. Until that
 *    dependency is decided, the employer types the precise address, the coarse
 *    area is derived from it for the worker-facing note, and coordinates fall
 *    back to a default. See the Location step below.
 */
import { useEffect, useMemo, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { StatusBar } from "expo-status-bar";
import Svg, { Path } from "react-native-svg";
import { colors, spacing, radius, typography } from "../../theme/tokens";
import ScreenHeader from "../../components/ScreenHeader";
import Button from "../../components/Button";
import TextField from "../../components/TextField";
import TextArea from "../../components/TextArea";
import Chip from "../../components/Chip";
import MapArea from "../../components/MapArea";
import DateTimeField from "../../components/DateTimeField";
import FieldError from "../../components/FieldError";
import CtaBar from "../../components/CtaBar";
import ConfirmDialog from "../../components/ConfirmDialog";
import DialogModal from "../../components/DialogModal";
import { useAuth } from "../../auth/AuthContext";
import {
  LIMITS,
  GIG_CATEGORIES,
  ARRANGEMENT_TYPES,
  PAY_RATE_UNITS,
  computeIsUrgent,
  validateLeadTime,
} from "./posting.constants.js";
import { combineStart } from "./posting.format.js";
import { loadPostingDraft, savePostingDraft, clearPostingDraft, hasDraftContent } from "./postingDraft.js";

// Interim default coordinates until a real map pin (react-native-maps) is
// wired — Colombo city centre. See the file header.
const DEFAULT_COORDS = { lat: 6.9271, lng: 79.8612 };

// The step sequence. Arrangement (step 3) decides whether the Schedule step
// (FR-POST-03, part-time & internship only) is present, which is what turns
// "of 7" into "of 8" — exactly the prototype's 2.3 → 2.3t difference.
const GIG_STEPS = ["titleDesc", "category", "arrangement", "pay", "location", "workers", "start"];
const RECURRING_STEPS = ["titleDesc", "category", "arrangement", "pay", "schedule", "location", "workers", "start"];

// The mobile/display title drawn at the top of each step's content (2.1–2.8).
const STEP_TITLES = {
  titleDesc: "Post a gig",
  category: "Category",
  arrangement: "Arrangement",
  pay: "Pay",
  schedule: "Schedule",
  location: "Location",
  workers: "Workers needed",
  start: "Start",
};

/** Derive the coarse, worker-facing area from a precise address (FR-POST-08):
 *  the last comma-separated segment, e.g. "23 Temple Road, Colombo 04" →
 *  "Colombo 04". Falls back to the whole string when there is no comma. */
function deriveAreaLabel(address) {
  if (!address) return "";
  const parts = address.split(",").map((p) => p.trim()).filter(Boolean);
  return parts.length ? parts[parts.length - 1] : address.trim();
}

/** The payKind the backend expects, derived from the arrangement + internship
 *  choice (FR-POST-04). Gig → fixed total; part-time → rate; internship →
 *  one of unpaid / stipend / paid. */
function derivePayKind(arrangementType, internshipChoice) {
  if (arrangementType === "GIG") return "FIXED_TOTAL";
  if (arrangementType === "PART_TIME") return "RATE";
  return internshipChoice; // UNPAID | STIPEND | PAID
}

export default function PostingCreateScreen({ navigation }) {
  const { user } = useAuth();

  const [stepIndex, setStepIndex] = useState(0);

  // Form state (one source of truth, carried across steps).
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(null);
  const [arrangementType, setArrangementType] = useState("GIG");
  const [payAmount, setPayAmount] = useState("");
  const [payRateUnit, setPayRateUnit] = useState("DAY");
  const [internshipChoice, setInternshipChoice] = useState("PAID");
  const [schedule, setSchedule] = useState("");
  const [locationAddress, setLocationAddress] = useState("");
  const [workersNeeded, setWorkersNeeded] = useState("1");
  // Start date (YYYY-MM-DD) and time (HH:MM) kept separate for the two fields,
  // then combined into one ISO value on submit.
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");

  const [error, setError] = useState(null); // one message for the current step

  // FR-POST-15 (E9): the unsent form is kept on this device only. `restored` flips once
  // the stored copy has been read, so the first (blank) render can't overwrite it.
  const [restored, setRestored] = useState(false);
  const [keptOffline, setKeptOffline] = useState(false); // a publish failed with no signal
  const [discardOpen, setDiscardOpen] = useState(false);

  const isRecurring = arrangementType !== "GIG";
  const steps = isRecurring ? RECURRING_STEPS : GIG_STEPS;
  const totalSteps = steps.length; // 7 or 8
  const stepKey = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;

  const payKind = derivePayKind(arrangementType, internshipChoice);
  const areaLabel = useMemo(() => deriveAreaLabel(locationAddress), [locationAddress]);

  // Combined ISO start — only valid once both halves are present.
  const startAt = useMemo(() => {
    return combineStart(startDate, startTime);
  }, [startDate, startTime]);

  // ----- per-step validation (returns an error message, or null) -----
  function validateCurrentStep() {
    switch (stepKey) {
      case "titleDesc":
        if (!title.trim()) return "Enter a title for the posting.";
        if (!description.trim()) return "Enter a description.";
        return null;
      case "category":
        if (!category) return "Choose a category.";
        return null;
      case "arrangement":
        return null; // always has a default selection
      case "pay": {
        if (payKind === "UNPAID") return null; // no amount collected
        const num = parseFloat(payAmount);
        if (!payAmount || isNaN(num) || num <= 0) return "Enter a pay amount greater than zero.";
        return null;
      }
      case "schedule":
        if (!schedule.trim()) return "Enter the schedule.";
        return null;
      case "location":
        if (!locationAddress.trim()) return "Enter the address.";
        return null;
      case "workers": {
        const n = parseInt(workersNeeded, 10);
        if (!Number.isInteger(n) || n < LIMITS.WORKERS_MIN || n > LIMITS.WORKERS_MAX) {
          return `Enter a whole number between ${LIMITS.WORKERS_MIN} and ${LIMITS.WORKERS_MAX}.`;
        }
        return null;
      }
      case "start": {
        if (!startAt) return "Enter the start date and time.";
        const lead = validateLeadTime(startAt);
        if (!lead.valid) return lead.message;
        return null;
      }
      default:
        return null;
    }
  }

  const form = {
    title, description, category, arrangementType, payAmount, payRateUnit,
    internshipChoice, schedule, locationAddress, workersNeeded, startDate, startTime,
  };

  function applyDraft(d) {
    setTitle(d.title ?? "");
    setDescription(d.description ?? "");
    setCategory(d.category ?? null);
    setArrangementType(d.arrangementType ?? "GIG");
    setPayAmount(d.payAmount ?? "");
    setPayRateUnit(d.payRateUnit ?? "DAY");
    setInternshipChoice(d.internshipChoice ?? "PAID");
    setSchedule(d.schedule ?? "");
    setLocationAddress(d.locationAddress ?? "");
    setWorkersNeeded(d.workersNeeded ?? "1");
    setStartDate(d.startDate ?? "");
    setStartTime(d.startTime ?? "");
  }

  // Restore on open: the form comes back filled, at step 1 (prototype 2.1rst).
  useEffect(() => {
    let active = true;
    loadPostingDraft(user?.id).then((d) => {
      if (!active) return;
      if (d) {
        applyDraft(d);
        setKeptOffline(Boolean(d.keptOffline));
      }
      setRestored(true);
    });
    return () => { active = false; };
  }, [user?.id]);

  // Coming back from the review after an offline failure: pick up the flag it set.
  useEffect(() => {
    return navigation.addListener("focus", () => {
      loadPostingDraft(user?.id).then((d) => {
        setKeptOffline(Boolean(d?.keptOffline));
        // The stored copy is gone (posted, or discarded): this screen must not show a stale form.
        if (!d) {
          applyDraft({});
          setStepIndex(0);
        }
      });
    });
  }, [navigation, user?.id]);

  // Keep the form as it stands — on the device, never the server. An untouched blank
  // form is not saved (and clears any stale copy).
  useEffect(() => {
    if (!restored) return;
    if (hasDraftContent(form)) savePostingDraft(user?.id, { ...form, keptOffline });
    else clearPostingDraft(user?.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restored, keptOffline, title, description, category, arrangementType, payAmount, payRateUnit,
    internshipChoice, schedule, locationAddress, workersNeeded, startDate, startTime]);

  // 2.8err: a start under 2 hours away is blocked, not warned — shown live, Review disabled.
  const startError = useMemo(() => {
    if (stepKey !== "start" || !startAt) return null;
    const lead = validateLeadTime(startAt);
    return lead.valid ? null : lead.message;
  }, [stepKey, startAt]);

  // The explicit discard FR-POST-15 refers to: forget the kept form and start blank.
  function handleDiscard() {
    clearPostingDraft(user?.id);
    applyDraft({});
    setKeptOffline(false);
    setStepIndex(0);
    setError(null);
    setDiscardOpen(false);
  }

  function handleContinue() {
    const message = validateCurrentStep();
    if (message) {
      setError(message);
      return;
    }
    setError(null);
    if (isLastStep) {
      goToReview();
    } else {
      setStepIndex((i) => i + 1);
    }
  }

  function handleBack() {
    setError(null);
    if (stepIndex === 0) {
      navigation.goBack(); // step 1 is the form root; leave to the postings list
    } else {
      setStepIndex((i) => i - 1);
    }
  }

  function goToReview() {
    // FR-POST-16: posting-as is the employer's account identity, not a form
    // field. Auto-populated here from the signed-in user.
    const postedAsType = user?.postingAsType === "BUSINESS" ? "BUSINESS" : "INDIVIDUAL";

    const formData = {
      title: title.trim(),
      description: description.trim(),
      category,
      arrangementType,
      payKind,
      payAmount: payKind === "UNPAID" ? null : parseFloat(payAmount),
      payRateUnit: payKind === "RATE" ? payRateUnit : null,
      postedAsType,
      postedBusinessName: postedAsType === "BUSINESS" ? user?.businessName ?? null : null,
      postedBusinessBio: postedAsType === "BUSINESS" ? user?.businessBio ?? null : null,
      schedule: isRecurring ? schedule.trim() : null,
      locationAddress: locationAddress.trim(),
      locationAreaLabel: areaLabel,
      locationLat: DEFAULT_COORDS.lat,
      locationLng: DEFAULT_COORDS.lng,
      workersNeeded: parseInt(workersNeeded, 10),
      startAt,
      // FR-POST-07: urgency is always derived, never chosen. Shown (as "set
      // automatically") only on the Review screen.
      isUrgent: computeIsUrgent(startAt),
    };
    navigation.navigate("PostingReview", { formData });
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      {/* 2.1's header is a ghost (tab root); 2.2+ add a back arrow and a ✕
          that exits to the postings list. We render back on every step
          (step 1 leaves the screen) and ✕ from step 2 on. */}
      <ScreenHeader
        title=""
        onBack={handleBack}
        action={
          stepIndex > 0 ? (
            <Pressable
              onPress={() => navigation.goBack()}
              hitSlop={spacing.sm}
              accessibilityRole="button"
              accessibilityLabel="Close"
              style={styles.closeHit}
            >
              <Svg width={24} height={24} viewBox="0 0 24 24">
                <Path
                  d="M6 6L18 18M18 6L6 18"
                  stroke={colors.text.primary}
                  strokeWidth={2}
                  strokeLinecap="round"
                />
              </Svg>
            </Pressable>
          ) : null
        }
      />

      <KeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={120}
      >
        <Text style={styles.screenTitle}>{STEP_TITLES[stepKey]}</Text>
        <Text style={styles.step}>
          Step {stepIndex + 1} of {totalSteps}
        </Text>

        {stepIndex === 0 && keptOffline ? (
          <Text style={styles.restoredNote}>Your details were kept while you were offline.</Text>
        ) : null}

        {renderStepBody()}

        {startError || error ? <FieldError message={startError || error} /> : null}

        {hasDraftContent(form) ? (
          <Button title="Discard posting" style="text" onPress={() => setDiscardOpen(true)} />
        ) : null}

        <View style={styles.spacer} />
      </KeyboardAwareScrollView>

      <CtaBar>
        <Button
          title={isLastStep ? "Review posting" : "Continue"}
          onPress={handleContinue}
          disabled={Boolean(startError)}
        />
      </CtaBar>

      <DialogModal visible={discardOpen} onRequestClose={() => setDiscardOpen(false)}>
        <ConfirmDialog
          title="Discard this posting?"
          body="What you've entered is removed from this phone. This can't be undone."
          cancelLabel="Keep editing"
          cancelStyle="secondary"
          onCancel={() => setDiscardOpen(false)}
          confirmLabel="Discard"
          onConfirm={handleDiscard}
        />
      </DialogModal>
    </View>
  );

  // ----- step bodies -----
  function renderStepBody() {
    switch (stepKey) {
      case "titleDesc":
        return (
          <>
            <TextField
              label="Title"
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Event setup crew (3 needed)"
              autoCapitalize="sentences"
              maxLength={LIMITS.TITLE_MAX}
            />
            <View style={styles.field}>
              <Text style={styles.label}>Description</Text>
              <TextArea
                value={description}
                onChangeText={setDescription}
                placeholder="What the work involves, what's provided, where."
                maxLength={LIMITS.DESCRIPTION_MAX}
              />
            </View>
          </>
        );

      case "category":
        return (
          <View style={styles.optionList}>
            {GIG_CATEGORIES.map((cat) => (
              <OptionRow
                key={cat.id}
                label={cat.label}
                selected={category === cat.id}
                onPress={() => setCategory(cat.id)}
              />
            ))}
          </View>
        );

      case "arrangement":
        return (
          <View style={styles.optionList}>
            {ARRANGEMENT_TYPES.map((arr) => (
              <OptionRow
                key={arr.id}
                label={arr.label}
                selected={arrangementType === arr.id}
                onPress={() => setArrangementType(arr.id)}
              />
            ))}
          </View>
        );

      case "pay":
        return renderPayStep();

      case "schedule":
        return (
          <>
            <Text style={styles.note}>Part-time jobs and internships only.</Text>
            <TextField
              label="Schedule"
              value={schedule}
              onChangeText={setSchedule}
              placeholder="e.g. Mon, Wed, Fri — 4 to 6 pm"
              autoCapitalize="sentences"
              maxLength={LIMITS.SCHEDULE_MAX}
            />
          </>
        );

      case "location":
        return (
          <>
            <MapArea kind="precisePin" />
            <TextField
              label="Address"
              value={locationAddress}
              onChangeText={setLocationAddress}
              placeholder="e.g. 23 Temple Road, Colombo 04"
              autoCapitalize="words"
            />
            <Text style={styles.note}>
              {areaLabel
                ? `Shown to workers as: ${areaLabel} area`
                : "Workers see only the general area, not the precise address."}
            </Text>
          </>
        );

      case "workers":
        return (
          <>
            <TextField
              label="Workers needed"
              value={workersNeeded}
              onChangeText={(v) => setWorkersNeeded(v.replace(/[^0-9]/g, ""))}
              keyboardType="number-pad"
              maxLength={2}
            />
            <Text style={styles.note}>A whole number between 1 and 20.</Text>
          </>
        );

      case "start":
        return (
          <>
            <DateTimeField
              label="Start date"
              value={startDate}
              onChangeText={setStartDate}
              placeholder="YYYY-MM-DD"
            />
            <TextField
              label="Start time (24-hour, e.g. 17:00)"
              value={startTime}
              onChangeText={setStartTime}
              placeholder="HH:MM"
              keyboardType="numbers-and-punctuation"
              maxLength={5}
            />
            <Text style={styles.note}>At least 2 hours from now, so workers have time to apply.</Text>
          </>
        );

      default:
        return null;
    }
  }

  function renderPayStep() {
    if (arrangementType === "GIG") {
      return (
        <>
          <TextField
            label="Fixed total per worker (Rs)"
            value={payAmount}
            onChangeText={(v) => setPayAmount(v.replace(/[^0-9]/g, ""))}
            keyboardType="number-pad"
          />
          <Text style={styles.note}>Each selected worker earns this amount.</Text>
        </>
      );
    }
    if (arrangementType === "PART_TIME") {
      return (
        <>
          <TextField
            label="Rate per worker (Rs)"
            value={payAmount}
            onChangeText={(v) => setPayAmount(v.replace(/[^0-9]/g, ""))}
            keyboardType="number-pad"
          />
          <View style={styles.chipRow}>
            {PAY_RATE_UNITS.map((unit) => (
              <Chip
                key={unit.id}
                label={unit.label}
                selected={payRateUnit === unit.id}
                onPress={() => setPayRateUnit(unit.id)}
              />
            ))}
          </View>
          <Text style={styles.note}>Each selected worker earns this rate.</Text>
        </>
      );
    }
    // Internship — not drawn in the prototype; built from FR-POST-04 and the
    // pay strings in design-system.md §9 (Unpaid / Stipend / Paid).
    return (
      <>
        <View style={styles.chipRow}>
          <Chip label="Unpaid" selected={internshipChoice === "UNPAID"} onPress={() => setInternshipChoice("UNPAID")} />
          <Chip label="Stipend" selected={internshipChoice === "STIPEND"} onPress={() => setInternshipChoice("STIPEND")} />
          <Chip label="Paid" selected={internshipChoice === "PAID"} onPress={() => setInternshipChoice("PAID")} />
        </View>
        {internshipChoice !== "UNPAID" ? (
          <>
            <TextField
              label={internshipChoice === "STIPEND" ? "Stipend per worker (Rs)" : "Pay per worker (Rs)"}
              value={payAmount}
              onChangeText={(v) => setPayAmount(v.replace(/[^0-9]/g, ""))}
              keyboardType="number-pad"
            />
            <Text style={styles.note}>Each selected worker earns this amount.</Text>
          </>
        ) : (
          <Text style={styles.note}>No pay is collected for an unpaid internship.</Text>
        )}
      </>
    );
  }
}

/** A single selectable row for the Category and Arrangement lists (2.2, 2.3):
 *  48 tall, radius 8, pad 12; selected fills color/bg/subtle with a
 *  color/brand/primary label, default is a plain color/text/primary row. */
function OptionRow({ label, selected, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={[styles.optionRow, selected && styles.optionRowSelected]}
    >
      <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>{label}</Text>
    </Pressable>
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
  // Figma content: pad 6/16/4/16, gap 16.
  content: {
    flexGrow: 1,
    paddingTop: spacing.sm - 2,
    paddingHorizontal: spacing.gutter,
    paddingBottom: spacing.xs,
    gap: spacing.lg,
  },
  screenTitle: {
    ...typography.display,
    color: colors.text.primary,
  },
  step: {
    ...typography.caption,
    color: colors.text.secondary,
    // The title/step pair sits closer together than the 16 content gap.
    marginTop: -spacing.md,
  },
  field: {
    gap: spacing.xs,
  },
  label: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  restoredNote: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  note: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  optionList: {
    gap: spacing.sm,
  },
  optionRow: {
    height: 48,
    justifyContent: "center",
    paddingHorizontal: spacing.md,
    borderRadius: radius.input,
  },
  optionRowSelected: {
    backgroundColor: colors.bg.subtle,
  },
  optionLabel: {
    ...typography.body,
    color: colors.text.primary,
  },
  optionLabelSelected: {
    color: colors.brand.primary,
  },
  chipRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  closeHit: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  spacer: {
    flex: 1,
    minHeight: spacing.lg,
  },
});
