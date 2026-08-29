/**
 * Create a gig posting — FR-POST-01 through FR-POST-09.
 *
 * A four-step form, because FR-POST-01 requires the fields "in sequence" and
 * because eight fields plus a review on one scroll is where posting flows go
 * to die. Steps 1–3 collect, step 4 is FR-POST-09's review.
 *
 * What each step is carrying:
 *   1  title (80) and description (1000) caps — FR-POST-01; category from the
 *      seven-item allow-list with no free-text option — FR-POST-02;
 *      arrangement type, which decides the shape of step 2
 *   2  pay, whose fields are chosen by arrangement type — FR-POST-04;
 *      schedule, required only for Part-time and Internship — FR-POST-03;
 *      workers needed, 1–20, default 1 — FR-POST-06
 *   3  precise address and the coarse area it will be shown as — FR-POST-08;
 *      start date/time, at least 2 hours out — FR-POST-05
 *   4  every entered field, plus two computed and non-editable previews:
 *      urgency and the general-area display — FR-POST-09
 *
 * There is deliberately no urgency control anywhere on this form. FR-POST-07
 * requires urgency to be computed and "never a manually set employer toggle",
 * so the review step shows it as a read-only consequence of the start time.
 *
 * Location is picked from a list of areas rather than a map. A real map pin
 * needs react-native-maps, a native module, and adding one would force a full
 * rebuild — out of scope here. The area list supplies the same three fields
 * the API wants (address, area label, coordinates), and the coarse-vs-precise
 * behaviour it feeds is Lahiru's own posting.location.js, unchanged.
 */
import { useMemo, useRef, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { StatusBar } from "expo-status-bar";

import { createGigPosting } from "../../api/posting.api";
import { parseApiError } from "../../api/client";
import LocationDisplay from "../../components/LocationDisplay.js";
import Button from "./components/Button";
import TextField from "./components/TextField";
import OptionGroup from "./components/OptionGroup";
import { colors, spacing, radius, typography } from "./theme";
import {
  ARRANGEMENTS,
  CATEGORIES,
  LIMITS,
  MIN_LEAD_TIME_MS,
  POSTING_AS,
  RATE_UNITS,
  computeIsUrgent,
  formatPay,
  labelFor,
  needsSchedule,
  payKindNeedsAmount,
  payKindNeedsRateUnit,
  payKindsFor,
} from "./postingOptions";

/**
 * Preset areas, each supplying the coarse label and the coordinates the API
 * needs. Same approach Discovery takes for its manual-location fallback.
 */
const AREAS = [
  { value: "Bambalapitiya, Colombo 04", lat: 6.8905, lng: 79.8565 },
  { value: "Kollupitiya, Colombo 03", lat: 6.9105, lng: 79.8503 },
  { value: "Cinnamon Gardens, Colombo 07", lat: 6.9061, lng: 79.8687 },
  { value: "Dehiwala", lat: 6.8511, lng: 79.8653 },
  { value: "Nugegoda", lat: 6.8649, lng: 79.8997 },
  { value: "Kandy", lat: 7.2906, lng: 80.6337 },
].map((a) => ({ ...a, label: a.value }));

/**
 * Start-time presets. Hand-typing a future timestamp on a phone keyboard is
 * slow and error-prone, and the two rules that matter here — the 2-hour
 * minimum (FR-POST-05) and the 24–48 hour urgency window (FR-POST-07) — are
 * far easier to see when you can put the start on either side of them
 * deliberately. Manual entry stays available underneath.
 */
const START_PRESETS = [
  { value: "1", label: "In 1 hour" },
  { value: "4", label: "In 4 hours" },
  { value: "30", label: "In 30 hours" },
  { value: "120", label: "In 5 days" },
];

const STEP_TITLES = ["The work", "Pay and people", "Where and when", "Review"];

/** Local datetime string for an input, e.g. 2026-08-31 14:30. */
function formatLocal(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
}

/** Parses "YYYY-MM-DD HH:MM" as local time. Returns null if unusable. */
function parseLocal(text) {
  const match = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})$/.exec((text || "").trim());
  if (!match) return null;
  const [, y, mo, d, h, mi] = match.map(Number);
  const date = new Date(y, mo - 1, d, h, mi);
  return Number.isNaN(date.getTime()) ? null : date;
}

export default function CreatePostingScreen({ navigation }) {
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState(null);
  const scrollRef = useRef(null);

  /**
   * Errors render at the top of the form, but the buttons are at the bottom of
   * a long scroll — on the review step especially. Without this, a rejected
   * submit looked exactly like a dead button: the reason was on screen, just
   * several hundred pixels above where the tap happened.
   */
  function surfaceError() {
    scrollRef.current?.scrollToPosition?.(0, 0, true);
  }

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    arrangementType: "",
    payKind: "",
    payAmount: "",
    payRateUnit: "",
    schedule: "",
    workersNeeded: "1",
    postedAsType: "INDIVIDUAL",
    postedBusinessName: "",
    postedBusinessBio: "",
    locationAddress: "",
    area: "",
    startAt: "",
  });

  const set = (key) => (value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  /** Changing arrangement type invalidates the pay shape chosen under the old one. */
  function setArrangement(value) {
    setForm((prev) => ({
      ...prev,
      arrangementType: value,
      payKind: payKindsFor(value).length === 1 ? payKindsFor(value)[0].value : "",
      payAmount: "",
      payRateUnit: "",
      schedule: needsSchedule(value) ? prev.schedule : "",
    }));
    setErrors({});
  }

  const payKinds = payKindsFor(form.arrangementType);
  const selectedArea = AREAS.find((a) => a.value === form.area);
  const startDate = parseLocal(form.startAt);

  const isUrgent = useMemo(
    () => (startDate ? computeIsUrgent(startDate) : false),
    [startDate],
  );

  /** Validates only the fields the current step is responsible for. */
  function validateStep(index) {
    const next = {};

    if (index === 0) {
      if (!form.title.trim()) next.title = "A title is required.";
      if (!form.description.trim()) next.description = "A description is required.";
      if (!form.category) next.category = "Choose a category.";
      if (!form.arrangementType) next.arrangementType = "Choose an arrangement type.";
    }

    if (index === 1) {
      if (!form.payKind) next.payKind = "Choose how this is paid.";
      if (payKindNeedsAmount(form.payKind)) {
        const amount = Number(form.payAmount);
        if (!form.payAmount.trim()) next.payAmount = "Enter the pay amount.";
        else if (!Number.isFinite(amount) || amount <= 0) next.payAmount = "Enter a valid amount.";
      }
      if (payKindNeedsRateUnit(form.payKind) && !form.payRateUnit) {
        next.payRateUnit = "Choose a rate unit.";
      }
      if (needsSchedule(form.arrangementType) && !form.schedule.trim()) {
        next.schedule = "A schedule is required for this arrangement type.";
      }
      const workers = Number(form.workersNeeded);
      if (!Number.isInteger(workers) || workers < LIMITS.WORKERS_MIN || workers > LIMITS.WORKERS_MAX) {
        next.workersNeeded = `Enter a whole number between ${LIMITS.WORKERS_MIN} and ${LIMITS.WORKERS_MAX}.`;
      }
      if (form.postedAsType === "BUSINESS" && !form.postedBusinessName.trim()) {
        next.postedBusinessName = "A business name is required when posting as a business.";
      }
    }

    if (index === 2) {
      if (!form.locationAddress.trim()) next.locationAddress = "Enter the precise address.";
      if (!form.area) next.area = "Choose the area this will be shown as.";
      if (!form.startAt.trim()) {
        next.startAt = "Enter a start date and time.";
      } else if (!startDate) {
        next.startAt = "Use the format YYYY-MM-DD HH:MM.";
      } else if (startDate.getTime() < Date.now() + MIN_LEAD_TIME_MS) {
        // FR-POST-05 — blocked, with the reason, not a warning.
        next.startAt =
          "Start at least 2 hours from now, so workers have time to see it and apply.";
      }
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function goNext() {
    setFormError(null);
    if (validateStep(step)) {
      setStep((s) => s + 1);
      // Each step starts at its own top rather than inheriting the previous
      // step's scroll position, which otherwise lands mid-form.
      scrollRef.current?.scrollToPosition?.(0, 0, false);
    } else {
      surfaceError();
    }
  }

  async function handleSubmit() {
    setFormError(null);
    setSubmitting(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        arrangementType: form.arrangementType,
        payKind: form.payKind,
        postedAsType: form.postedAsType,
        locationAddress: form.locationAddress.trim(),
        locationLat: selectedArea.lat,
        locationLng: selectedArea.lng,
        locationAreaLabel: selectedArea.value,
        workersNeeded: Number(form.workersNeeded),
        startAt: startDate.toISOString(),
      };
      // Omitted rather than sent empty: the API rejects a rate unit on a pay
      // kind that has no rate, and an amount on an unpaid internship.
      if (payKindNeedsAmount(form.payKind)) payload.payAmount = Number(form.payAmount);
      if (payKindNeedsRateUnit(form.payKind)) payload.payRateUnit = form.payRateUnit;
      if (form.schedule.trim()) payload.schedule = form.schedule.trim();
      if (form.postedAsType === "BUSINESS") {
        payload.postedBusinessName = form.postedBusinessName.trim();
        if (form.postedBusinessBio.trim()) payload.postedBusinessBio = form.postedBusinessBio.trim();
      }

      const res = await createGigPosting(payload);
      setCreated(res.posting);
    } catch (err) {
      const { formError: message, fieldErrors } = parseApiError(err);
      setErrors(fieldErrors || {});
      setFormError(
        message ||
          (fieldErrors && Object.keys(fieldErrors).length
            ? "Please correct the highlighted fields."
            : "Could not create the posting."),
      );
      // Send them back to the step that owns the first rejected field, so a
      // server-side rejection isn't a dead end on the review screen.
      const stepOf = {
        title: 0, description: 0, category: 0, arrangementType: 0,
        payKind: 1, payAmount: 1, payRateUnit: 1, schedule: 1,
        workersNeeded: 1, postedAsType: 1, postedBusinessName: 1, postedBusinessBio: 1,
        locationAddress: 2, locationAreaLabel: 2, locationLat: 2, locationLng: 2, startAt: 2,
      };
      const first = Object.keys(fieldErrors || {}).find((k) => k in stepOf);
      if (first) setStep(stepOf[first]);
      surfaceError();
    } finally {
      setSubmitting(false);
    }
  }

  // ---- Success -------------------------------------------------------------
  if (created) {
    return (
      <ScrollView contentContainerStyle={styles.screen}>
        <Text style={styles.title}>Posting created</Text>
        <Text style={styles.body}>
          "{created.title}" is live and accepting applications.
          {created.isUrgent ? " It was automatically flagged Urgent." : ""}
        </Text>
        <Button
          title="View my postings"
          onPress={() => navigation.replace("PostingMine")}
        />
        <Button
          title="Post another"
          variant="secondary"
          onPress={() => {
            setCreated(null);
            setStep(0);
            setForm((prev) => ({
              ...prev,
              title: "", description: "", category: "", arrangementType: "",
              payKind: "", payAmount: "", payRateUnit: "", schedule: "",
              workersNeeded: "1", locationAddress: "", area: "", startAt: "",
            }));
          }}
        />
        <StatusBar style="dark" />
      </ScrollView>
    );
  }

  return (
    <KeyboardAwareScrollView
      ref={scrollRef}
      contentContainerStyle={styles.screen}
      enableOnAndroid
      extraScrollHeight={120}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.stepper}>
        {STEP_TITLES.map((label, i) => (
          <View key={label} style={styles.stepItem}>
            <View style={[styles.stepDot, i <= step && styles.stepDotActive]}>
              <Text style={[styles.stepNum, i <= step && styles.stepNumActive]}>{i + 1}</Text>
            </View>
            <Text style={[styles.stepLabel, i === step && styles.stepLabelActive]} numberOfLines={1}>
              {label}
            </Text>
          </View>
        ))}
      </View>

      {formError ? <Text style={styles.formError}>{formError}</Text> : null}

      {/* ---- Step 1 — the work ------------------------------------------ */}
      {step === 0 ? (
        <>
          <TextField
            label="Title"
            value={form.title}
            onChangeText={set("title")}
            placeholder="e.g. Kitchen assistant for weekend event"
            maxLength={LIMITS.TITLE_MAX}
            error={errors.title}
          />
          <TextField
            label="Description"
            value={form.description}
            onChangeText={set("description")}
            placeholder="What the work involves, and what a worker should expect."
            multiline
            maxLength={LIMITS.DESCRIPTION_MAX}
            error={errors.description}
          />
          <OptionGroup
            label="Task category"
            options={CATEGORIES}
            value={form.category}
            onChange={set("category")}
            error={errors.category}
            hint="Chosen from a fixed list — categories involving unsupervised access to a vulnerable person, or licensed work, are not offered."
          />
          <OptionGroup
            label="Arrangement type"
            options={ARRANGEMENTS}
            value={form.arrangementType}
            onChange={setArrangement}
            error={errors.arrangementType}
            hint="This decides how pay is entered on the next step."
          />
        </>
      ) : null}

      {/* ---- Step 2 — pay and people ------------------------------------ */}
      {step === 1 ? (
        <>
          <OptionGroup
            label={`How is this paid? (${labelFor(ARRANGEMENTS, form.arrangementType)})`}
            options={payKinds}
            value={form.payKind}
            onChange={set("payKind")}
            error={errors.payKind}
            hint={
              form.arrangementType === "GIG"
                ? "A gig is paid as one fixed total."
                : form.arrangementType === "PART_TIME"
                  ? "A part-time job is paid as a rate."
                  : "An internship can be unpaid, or carry a stipend or full pay."
            }
          />

          {payKindNeedsAmount(form.payKind) ? (
            <TextField
              label="Pay amount (Rs)"
              value={form.payAmount}
              onChangeText={(t) => set("payAmount")(t.replace(/[^0-9.]/g, ""))}
              placeholder="4500"
              keyboardType="decimal-pad"
              error={errors.payAmount}
              hint="Per worker — not divided between the slots you're filling."
            />
          ) : null}

          {payKindNeedsRateUnit(form.payKind) ? (
            <OptionGroup
              label="Rate unit"
              options={RATE_UNITS}
              value={form.payRateUnit}
              onChange={set("payRateUnit")}
              error={errors.payRateUnit}
            />
          ) : null}

          {needsSchedule(form.arrangementType) ? (
            <TextField
              label="Schedule"
              value={form.schedule}
              onChangeText={set("schedule")}
              placeholder="e.g. Saturdays and Sundays, 9am - 5pm"
              maxLength={LIMITS.SCHEDULE_MAX}
              error={errors.schedule}
              hint="Required for ongoing arrangements."
            />
          ) : null}

          <TextField
            label="Workers needed"
            value={form.workersNeeded}
            onChangeText={(t) => set("workersNeeded")(t.replace(/[^0-9]/g, ""))}
            placeholder="1"
            keyboardType="number-pad"
            error={errors.workersNeeded}
            hint={`Between ${LIMITS.WORKERS_MIN} and ${LIMITS.WORKERS_MAX}.`}
          />

          <OptionGroup
            label="You're posting as"
            options={POSTING_AS}
            value={form.postedAsType}
            onChange={set("postedAsType")}
          />

          {form.postedAsType === "BUSINESS" ? (
            <>
              <TextField
                label="Business name"
                value={form.postedBusinessName}
                onChangeText={set("postedBusinessName")}
                placeholder="e.g. Perera Catering Services"
                maxLength={LIMITS.BUSINESS_NAME_MAX}
                error={errors.postedBusinessName}
              />
              <TextField
                label="Business bio (optional)"
                value={form.postedBusinessBio}
                onChangeText={set("postedBusinessBio")}
                placeholder="A sentence about the business."
                multiline
                maxLength={LIMITS.BUSINESS_BIO_MAX}
                error={errors.postedBusinessBio}
              />
            </>
          ) : null}
        </>
      ) : null}

      {/* ---- Step 3 — where and when ------------------------------------ */}
      {step === 2 ? (
        <>
          <TextField
            label="Precise address"
            value={form.locationAddress}
            onChangeText={set("locationAddress")}
            placeholder="e.g. 142/3 Galle Road"
            error={errors.locationAddress}
            hint="Released only to a worker once you select them — browsers see the area only."
          />
          <OptionGroup
            label="Area shown to workers"
            options={AREAS}
            value={form.area}
            onChange={set("area")}
            error={errors.area}
          />

          <OptionGroup
            label="Start"
            options={START_PRESETS}
            value={
              START_PRESETS.find(
                (p) => startDate && Math.abs(
                  startDate.getTime() - (Date.now() + Number(p.value) * 3600000),
                ) < 120000,
              )?.value ?? ""
            }
            onChange={(hours) =>
              set("startAt")(formatLocal(new Date(Date.now() + Number(hours) * 3600000)))
            }
            hint="Or type an exact date and time below."
          />
          <TextField
            label="Start date and time"
            value={form.startAt}
            onChangeText={set("startAt")}
            placeholder="YYYY-MM-DD HH:MM"
            error={errors.startAt}
            hint="Must be at least 2 hours from now."
          />
        </>
      ) : null}

      {/* ---- Step 4 — review (FR-POST-09) ------------------------------- */}
      {step === 3 ? (
        <>
          <Text style={styles.title}>Review before posting</Text>
          <Text style={styles.reviewIntro}>
            Everything you entered, plus two values the system works out for
            itself. Go back to change anything.
          </Text>

          <View style={styles.card}>
            <Row label="Title" value={form.title} />
            <Row label="Description" value={form.description} />
            <Row label="Category" value={labelFor(CATEGORIES, form.category)} />
            <Row label="Arrangement" value={labelFor(ARRANGEMENTS, form.arrangementType)} />
            <Row
              label="Pay"
              value={`${formatPay({
                payKind: form.payKind,
                payAmount: form.payAmount,
                payRateUnit: form.payRateUnit,
              })} · per worker`}
            />
            {form.schedule ? <Row label="Schedule" value={form.schedule} /> : null}
            <Row label="Workers needed" value={form.workersNeeded} />
            <Row label="Posting as" value={labelFor(POSTING_AS, form.postedAsType)} />
            {form.postedAsType === "BUSINESS" ? (
              <Row label="Business" value={form.postedBusinessName} />
            ) : null}
            <Row label="Precise address" value={form.locationAddress} />
            <Row label="Start" value={form.startAt} last />
          </View>

          {/* The two computed previews FR-POST-09 requires. Neither is
              editable, and there is no urgency control anywhere on this form —
              FR-POST-07 requires it to be derived, never toggled. */}
          <Text style={styles.computedHeading}>Computed — not editable</Text>

          <View style={[styles.card, styles.computedCard]}>
            <View style={styles.urgencyRow}>
              <Text style={styles.computedLabel}>Urgency</Text>
              <Text style={[styles.urgencyValue, isUrgent && styles.urgencyOn]}>
                {isUrgent ? "URGENT" : "Not urgent"}
              </Text>
            </View>
            <Text style={styles.computedNote}>
              {isUrgent
                ? "Starts within 24–48 hours, so it is flagged Urgent automatically."
                : "Only a start 24–48 hours away is flagged Urgent."}
            </Text>
          </View>

          <Text style={styles.computedHeading}>General-area preview</Text>
          <Text style={styles.computedNote}>
            What a worker browsing this posting will see. Your precise address
            stays hidden until you select someone.
          </Text>
          {selectedArea ? (
            <LocationDisplay
              locationAreaLabel={selectedArea.value}
              locationAddress={null}
              isPreciseLocationReleased={false}
              locationLat={selectedArea.lat}
              locationLng={selectedArea.lng}
            />
          ) : null}
        </>
      ) : null}

      {/* ---- Navigation -------------------------------------------------- */}
      <View style={styles.nav}>
        {step === 3 ? (
          <Button title="Post this gig" onPress={handleSubmit} loading={submitting} />
        ) : (
          <Button title="Continue" onPress={goNext} />
        )}
        {step > 0 ? (
          <Button
            title="Back"
            variant="secondary"
            onPress={() => {
              setErrors({});
              setFormError(null);
              setStep((s) => s - 1);
            }}
            disabled={submitting}
          />
        ) : null}
      </View>

      <StatusBar style="dark" />
    </KeyboardAwareScrollView>
  );
}

/** One label/value line in the review card. */
function Row({ label, value, last }) {
  return (
    <View style={[styles.row, last && styles.rowLast]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value || "—"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { padding: spacing.xl, paddingBottom: spacing.xxl, backgroundColor: colors.surface },

  stepper: { flexDirection: "row", marginBottom: spacing.xl },
  stepItem: { flex: 1, alignItems: "center" },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
  },
  stepDotActive: { backgroundColor: colors.primary },
  stepNum: { fontSize: 12, fontWeight: "700", color: colors.textSecondary },
  stepNumActive: { color: colors.surface },
  stepLabel: { fontSize: 11, color: colors.textPlaceholder },
  stepLabelActive: { color: colors.primary, fontWeight: "700" },

  title: {
    fontSize: typography.title.fontSize,
    fontWeight: typography.title.fontWeight,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  body: {
    fontSize: typography.body.fontSize,
    color: colors.textSecondary,
    lineHeight: typography.body.lineHeight,
    marginBottom: spacing.lg,
  },
  reviewIntro: {
    fontSize: typography.caption.fontSize,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: spacing.lg,
  },
  formError: {
    fontSize: typography.caption.fontSize,
    color: colors.danger,
    backgroundColor: "#FEE2E2",
    borderRadius: radius.sm,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },

  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    backgroundColor: colors.surface,
  },
  computedCard: { borderColor: colors.primary, backgroundColor: colors.primaryTint },
  row: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowLast: { borderBottomWidth: 0 },
  rowLabel: {
    fontSize: typography.caption.fontSize,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  rowValue: { fontSize: typography.body.fontSize, color: colors.textPrimary },

  computedHeading: {
    fontSize: typography.label.fontSize,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  computedLabel: { fontSize: typography.caption.fontSize, color: colors.textSecondary },
  computedNote: {
    fontSize: typography.caption.fontSize,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  urgencyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: spacing.md,
  },
  urgencyValue: { fontSize: typography.body.fontSize, fontWeight: "700", color: colors.textSecondary },
  urgencyOn: { color: colors.danger },

  nav: { marginTop: spacing.sm },
});
