/**
 * Give an endorsement (prototype 8.4; FR-ENDORSE-04, FR-ENDORSE-08) — Afham.
 *
 * Reached from 8.2 (a code) and 8.3m (a phone match) with `{ workerId, name, entryPoint }`.
 *
 *   scopeStatement  a full-bleed band between the header and the content, outside the scroll, so it
 *                   is always on screen before the commit and cannot be scrolled out of view
 *                   (FR-ENDORSE-04's second criterion): what vouching does and does not mean, and
 *                   that employers see it with your name.
 *   whoName         the person being vouched for.
 *   attributeChips  "WHAT STANDS OUT? (OPTIONAL)": the fixed list as Input/Chip {Kind=Select} —
 *                   any number, or none.
 *   reasonField     "How do you know this person?" — optional, at most 300 characters, with its
 *                   counter.
 *   ctaBar          the single action, "Vouch for {name}". Neither field is required.
 *
 * Success replaces this screen with 8.4e, so Back cannot return to a vouch already given.
 *
 * Not drawn, composed per design-system.md §8: the whole submission fails → Feedback/FormBanner
 * {Kind=Error} at the top of the content, everything entered kept. The cases: already vouched (two
 * devices at once) → "You already vouch for them."; the person is no longer eligible → the entry
 * point's own miss sentence; offline → it fails rather than queues (M8 "Offline vouching": an
 * endorsement is live on submit, so a queued one would show on a profile it never reached).
 */
import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { StatusBar } from "expo-status-bar";
import { colors, spacing, typography } from "../../theme/tokens";
import ScreenHeader from "../../components/ScreenHeader";
import Chip from "../../components/Chip";
import TextArea from "../../components/TextArea";
import FieldError from "../../components/FieldError";
import FormBanner from "../../components/FormBanner";
import Button from "../../components/Button";
import CtaBar from "../../components/CtaBar";
import { createEndorsement } from "../../api/endorsement.api";
import { ATTRIBUTES, REASON_MAX_LENGTH } from "./endorsement.format";

const SCOPE =
  "Vouching says you know this person and consider them reliable — it doesn't guarantee their work, and employers see it with your name.";
const REASON_PLACEHOLDER = "My neighbour — known him 8 years";

export default function EndorsementVouchScreen({ route, navigation }) {
  const { workerId, name, entryPoint } = route.params ?? {};
  const [selected, setSelected] = useState([]); // attribute enum values, in tap order
  const [reason, setReason] = useState("");
  const [formError, setFormError] = useState(null);
  const [reasonError, setReasonError] = useState(null);
  const [sending, setSending] = useState(false);

  function toggle(value) {
    setSelected((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  }

  async function vouch() {
    setFormError(null);
    setReasonError(null);
    setSending(true);
    try {
      // Sent in the drawn order, so the endorsement shows its attributes the way the list reads.
      const attributes = ATTRIBUTES.map((a) => a.value).filter((v) => selected.includes(v));
      await createEndorsement({ workerId, entryPoint, attributes, reason: reason.trim() || undefined });
      navigation.replace("EndorsementVouched", { name });
    } catch (err) {
      // The sentence is the top-level `error` ("A reason can be up to 300 characters."); the
      // per-field value is only a terse code ("Too long").
      if (err.fields?.reason) setReasonError(err.message);
      else setFormError(err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScreenHeader title="Vouch" onBack={() => navigation.goBack()} />

      {/* scopeStatement: its own frame, outside the scroll — always in view. */}
      <View style={styles.scopeStatement}>
        <Text style={styles.scopeText}>{SCOPE}</Text>
      </View>

      <KeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={120}
      >
        {formError ? <FormBanner kind="error" message={formError} /> : null}
        <Text style={styles.whoName} accessibilityRole="header">
          {name}
        </Text>

        <Text style={styles.attrLabel}>WHAT STANDS OUT? (OPTIONAL)</Text>
        <View style={styles.attributeChips}>
          {ATTRIBUTES.map((a) => (
            <Chip
              key={a.value}
              label={a.label}
              selected={selected.includes(a.value)}
              onPress={() => toggle(a.value)}
              touch
            />
          ))}
        </View>

        <Text style={styles.reasonLabel}>How do you know this person?</Text>
        <TextArea
          value={reason}
          onChangeText={(text) => {
            setReason(text);
            setReasonError(null);
          }}
          placeholder={REASON_PLACEHOLDER}
          maxLength={REASON_MAX_LENGTH}
          error={Boolean(reasonError)}
        />
        <FieldError message={reasonError} />
        <Text style={styles.counter}>
          {reason.length} / {REASON_MAX_LENGTH}
        </Text>
      </KeyboardAwareScrollView>

      <CtaBar>
        <Button title={`Vouch for ${name}`} onPress={vouch} loading={sending} />
      </CtaBar>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg.default,
  },
  // scopeStatement: full-bleed, pad 10/16, fill color/bg/subtle; mobile/secondary in text/primary.
  scopeStatement: {
    paddingVertical: 10,
    paddingHorizontal: spacing.gutter,
    backgroundColor: colors.bg.subtle,
  },
  scopeText: {
    ...typography.secondary,
    color: colors.text.primary,
  },
  scroll: {
    flex: 1,
  },
  // 8.4 content: pad 16/16/0/16, gap 12.
  content: {
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.gutter,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  whoName: {
    ...typography.title,
    color: colors.text.primary,
  },
  // The module's only upper-case label: mobile/caption, the case from the string, no tracking.
  attrLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  // attributeChips: wrapping row, gap 8 both ways.
  attributeChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  reasonLabel: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  // The counter follows 1.15eb's: mobile/caption, hugging its text at the left.
  counter: {
    ...typography.caption,
    color: colors.text.secondary,
    alignSelf: "flex-start",
  },
});
