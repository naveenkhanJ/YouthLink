/**
 * Report (prototype 9.1) and Report · submitted (9.1d). Requirements FR-DISPUTE-01, FR-DISPUTE-02,
 * NFR-PRIV-05.
 *
 * Params `{ targetType: "POSTING"|"USER"|"ENGAGEMENT", targetId, context? }` — `context` is what
 * follows "Reporting:" (9.1 draws the posting title, "Reporting: Data entry — work from home"). Opened
 * from the listing detail's "Report this listing" (M3 3.12g), the applicant detail (a person) and an
 * active engagement's detail (FR-DISPUTE-01: "listings, profiles, and within an active Engagement").
 *
 * A reason from FR-DISPUTE-01's fixed list is required; the details are optional, up to 300
 * characters. Five `Input/RoleOption` rows act as the radio group, as 9.1 draws them. The detail box
 * is 9.1's own `detailField` (pad 10/12, a 1px border/default stroke), NOT Input/TextArea: M9 records
 * that the component's 96px minimum does not fit 9.1's 6px of slack, and keeps the box as drawn.
 *
 * Submitting shows 9.1d in place — the same header and context, "Report submitted" — and "Done"
 * returns to where the report started. Filing the same report twice is answered by the server with
 * `alreadyReported` (no new report); 9.1d is shown either way, since the first report is queued.
 *
 * States: no reason chosen → Feedback/FieldError under the options (the server's own sentence);
 * offline → Feedback/FormBanner {Kind=Error} at the top with the choice and the text kept (M9
 * "States not drawn", 4.1bnr's pattern); any other refusal → the same banner with the server's
 * sentence ("You can't report your own posting.", "You can report an engagement only while it is
 * active.").
 */
import { useState } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { fileReport } from "../../api/dispute.api";
import { parseApiError } from "../../api/client";
import ScreenHeader from "../../components/ScreenHeader";
import RoleOption from "../../components/RoleOption";
import Button from "../../components/Button";
import CtaBar from "../../components/CtaBar";
import FieldError from "../../components/FieldError";
import FormBanner from "../../components/FormBanner";
import { colors, spacing, radius, typography } from "../../theme/tokens";
import { REPORT_REASONS } from "./dispute.format";

const DETAIL_MAX_LENGTH = 300;
// The server's sentence for a missing reason (dispute.service.js), reused word for word.
const REASON_REQUIRED = "Choose a reason for the report.";
// DERIVED from 4.1bnr ("You're offline, so your application couldn't be sent. Your note is still
// here — try again once you reconnect."): no frame draws a report sent offline.
const OFFLINE_MESSAGE =
  "You're offline, so your report couldn't be sent. Your details are still here — try again once you reconnect.";

export default function DisputeReportScreen({ route, navigation }) {
  const { targetType, targetId, context } = route.params ?? {};
  const [reason, setReason] = useState(null);
  const [detail, setDetail] = useState("");
  const [reasonError, setReasonError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const contextLine = context ? `Reporting: ${context}` : null;

  async function submit() {
    if (sending) return;
    setFormError(null);
    if (!reason) {
      setReasonError(REASON_REQUIRED);
      return;
    }
    setSending(true);
    try {
      await fileReport({ targetType, targetId, reason, detail: detail.trim() || undefined });
      setSubmitted(true); // → 9.1d
    } catch (err) {
      setFormError(err.offline ? OFFLINE_MESSAGE : parseApiError(err).formError || "Your report couldn't be sent.");
    } finally {
      setSending(false);
    }
  }

  // ---- 9.1d — Report · submitted ----
  if (submitted) {
    return (
      <View style={[styles.root, styles.rootSubtle]}>
        <StatusBar style="dark" />
        <ScreenHeader title="Report" onBack={() => navigation.goBack()} />
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
          {contextLine ? <Text style={styles.context}>{contextLine}</Text> : null}
          <Text style={styles.doneTitle}>Report submitted</Text>
          <Text style={styles.doneBody}>
            It's queued for a moderator to review. They will never learn who reported them — reports stay anonymous,
            permanently.
          </Text>
        </ScrollView>
        <CtaBar surface="subtle">
          <Button title="Done" onPress={() => navigation.goBack()} />
        </CtaBar>
      </View>
    );
  }

  // ---- 9.1 — Report ----
  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScreenHeader title="Report" onBack={() => navigation.goBack()} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {formError ? <FormBanner kind="error" message={formError} /> : null}
        {contextLine ? <Text style={styles.context}>{contextLine}</Text> : null}
        <Text style={styles.prompt}>Why are you reporting this?</Text>

        <View style={styles.options} accessibilityRole="radiogroup" accessibilityLabel="Why are you reporting this?">
          {REPORT_REASONS.map((option) => (
            <RoleOption
              key={option.id}
              title={option.title}
              description={option.description}
              selected={reason === option.id}
              onPress={() => {
                setReason(option.id);
                setReasonError(null);
              }}
            />
          ))}
        </View>
        {reasonError ? <FieldError message={reasonError} /> : null}

        <Text style={styles.detailLabel}>Details (optional · up to 300 characters)</Text>
        <TextInput
          style={styles.detailField}
          value={detail}
          onChangeText={setDetail}
          multiline
          textAlignVertical="top"
          maxLength={DETAIL_MAX_LENGTH}
          accessibilityLabel="Details, optional, up to 300 characters"
        />
        <Text style={styles.anonNote}>They won't learn who reported them.</Text>
      </ScrollView>

      <CtaBar>
        <Button title="Submit report" onPress={submit} loading={sending} />
      </CtaBar>
    </View>
  );
}

const styles = StyleSheet.create({
  // 9.1 is white; 9.1d is grey.
  root: {
    flex: 1,
    backgroundColor: colors.bg.default,
  },
  rootSubtle: {
    backgroundColor: colors.bg.subtle,
  },
  scroll: {
    flex: 1,
  },
  // Figma content: pad 16/16/0/16, gap 10.
  content: {
    flexGrow: 1,
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.gutter,
    paddingBottom: spacing.lg,
    gap: 10,
  },
  context: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  prompt: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  // The options keep the content's 10px rhythm between them, as 9.1 draws them.
  options: {
    gap: 10,
  },
  detailLabel: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  // 9.1 `detailField`: pad 10/12 with the 1px stroke inside, r8, bg/default, border/default.
  detailField: {
    minHeight: 68,
    paddingVertical: 10 - 1,
    paddingHorizontal: spacing.md - 1,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: radius.input,
    backgroundColor: colors.bg.default,
    ...typography.body,
    color: colors.text.primary,
  },
  anonNote: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  // 9.1d
  doneTitle: {
    ...typography.display,
    color: colors.text.primary,
  },
  doneBody: {
    ...typography.body,
    color: colors.text.secondary,
  },
});
