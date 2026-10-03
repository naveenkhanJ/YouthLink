/**
 * Apply (prototype 4.1 and its variants, 4.1bnr; FR-APPLY-02, FR-PROF-04) — Naveenkhan.
 *
 * One confirmation screen, as FR-APPLY-02 asks: the posting and employer it goes to, an optional
 * note of at most 300 characters, and "Submit application". The note starts as the worker's
 * profile bio when they have one (FR-PROF-04; read from GET /api/profiles/me) and stays editable;
 * an empty note is fine. Success opens "Application sent" (4.2).
 *
 * Failure states (design-system.md §8): offline at the moment of submitting → the drawn
 * Feedback/FormBanner {Kind=Error} of 4.1bnr, with the note kept; anything else the server refuses
 * (already applied, the posting closed or is under review) → the same banner with its sentence.
 *
 * Opened from the listing detail with `{ gigPostingId, title, employerName }`.
 */
import { useEffect, useRef, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { colors, spacing, typography } from "../../theme/tokens";
import ScreenHeader from "../../components/ScreenHeader";
import TextArea from "../../components/TextArea";
import FieldError from "../../components/FieldError";
import FormBanner from "../../components/FormBanner";
import Button from "../../components/Button";
import CtaBar from "../../components/CtaBar";
import { applyToPosting } from "../../api/application.api";
import { getOwnProfile } from "../../api/profile";
import { parseApiError } from "../../api/client";

const NOTE_MAX_LENGTH = 300;

// 4.1bnr `formBanner`, word for word.
const OFFLINE_MESSAGE =
  "You're offline, so your application couldn't be sent. Your note is still here — try again once you reconnect.";

export default function ApplyScreen({ route, navigation }) {
  const { gigPostingId, title, employerName } = route.params ?? {};
  const [note, setNote] = useState("");
  const [formError, setFormError] = useState(null);
  const [noteError, setNoteError] = useState(null);
  const [sending, setSending] = useState(false);
  // Once the worker types, a late-arriving bio must not overwrite what they wrote.
  const edited = useRef(false);

  // FR-PROF-04: pre-fill from the bio. A failure here is not an error — the note is optional.
  useEffect(() => {
    let active = true;
    getOwnProfile()
      .then((profile) => {
        if (active && !edited.current && profile?.bio) setNote(profile.bio.slice(0, NOTE_MAX_LENGTH));
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  async function submit() {
    setFormError(null);
    setNoteError(null);
    setSending(true);
    try {
      await applyToPosting({ gigPostingId, note: note.trim() || undefined });
      // 4.2: the confirmation replaces this form, so Back does not return to a sent application.
      navigation.replace("ApplicationSent", { employerName });
    } catch (err) {
      if (err.offline) {
        setFormError(OFFLINE_MESSAGE);
      } else {
        const { formError: message, fieldErrors } = parseApiError(err);
        setNoteError(fieldErrors.note ?? null);
        setFormError(message ?? (fieldErrors.note ? null : "Your application couldn't be sent."));
      }
    } finally {
      setSending(false);
    }
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScreenHeader title="Apply" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {formError ? <FormBanner kind="error" message={formError} /> : null}
        <Text style={styles.context}>
          {title} · {employerName}
        </Text>
        <Text style={styles.noteLabel}>Note to the employer</Text>
        <View>
          <TextArea
            value={note}
            onChangeText={(text) => {
              edited.current = true;
              setNote(text);
            }}
            maxLength={NOTE_MAX_LENGTH}
            error={Boolean(noteError)}
          />
          {noteError ? <FieldError message={noteError} /> : null}
        </View>
        <Text style={styles.prefillNote}>Optional — the employer sees it with your profile.</Text>
      </ScrollView>

      <CtaBar>
        <Button title="Submit application" onPress={submit} loading={sending} />
      </CtaBar>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg.default,
  },
  // 4.1 content: pad 20/16/0/16, gap 12.
  content: {
    paddingTop: 20,
    paddingHorizontal: spacing.gutter,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  context: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  noteLabel: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  prefillNote: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
});
