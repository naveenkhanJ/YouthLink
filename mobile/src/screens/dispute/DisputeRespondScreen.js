/**
 * Respond to dispute (prototype 9.3) and Respond · submitted (9.3e). Requirements FR-DISPUTE-04,
 * FR-DISPUTE-05.
 *
 * Opened from 9.2r's "Respond" with `{ disputeCaseId }`; only the respondent, once, while the
 * 48-hour window is open. "Your side of what happened" (Input/TextArea, up to 300 characters) and up
 * to three photos (Display/PhotoPicker, "2 of 3 · up to 5MB each"). Evidence is optional — a
 * statement alone, or photos alone, is a response; the server refuses only an empty one.
 *
 * FR-DISPUTE-05's caps are enforced BEFORE upload: the picker's add tile disappears at three, and a
 * photo over 5 MB is refused at the moment it is chosen (dispute.evidence.js), with the server's own
 * sentence under the picker. Nothing oversized is sent.
 *
 * Submitting shows 9.3e in place; "Back to case" (and the back arrow) return to the case, which
 * reloads as 9.2ur. 9.3's own back arrow goes to 9.2r — the one screen it is reached from.
 *
 * Evidence mode (`{ disputeCaseId, mode: "evidence" }`, added 2026-10-18): FR-DISPUTE-05 lets EITHER
 * party attach up to three photos, but only the respondent's 9.3 is drawn. The person who opened the
 * case reaches this same screen from 9.2's "Add photos" link while the response window is open, with
 * the statement left out (their side is the dispute itself) — the photo section, caps and states are
 * 9.3's. Undrawn; its copy is recorded in decisions.md.
 *
 * States: loading → Feedback/LoadingState; a failed load → Feedback/FormBanner with "Try again";
 * offline at submit → Feedback/FormBanner {Kind=Error} at the top of the content with the text and
 * photos kept (M9 "States not drawn", 4.1bnr's pattern); already responded or the window closed →
 * the server's sentence in the banner and no submit button.
 */
import { useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { addEvidence, getCase, respondToCase } from "../../api/dispute.api";
import { parseApiError } from "../../api/client";
import ScreenHeader from "../../components/ScreenHeader";
import TextArea from "../../components/TextArea";
import PhotoPicker from "../../components/PhotoPicker";
import Button from "../../components/Button";
import CtaBar from "../../components/CtaBar";
import FieldError from "../../components/FieldError";
import FormBanner from "../../components/FormBanner";
import LoadingState from "../../components/LoadingState";
import { colors, spacing, typography } from "../../theme/tokens";
import { respondContextLine } from "./dispute.format";
import { pickEvidencePhoto } from "./dispute.evidence";

const STATEMENT_MAX_LENGTH = 300;
// The server's sentences (dispute.service.js), reused word for word.
const EMPTY_RESPONSE = "Write your side of what happened, or add a photo.";
const ALREADY_RESPONDED = "You've already responded to this case.";
const WINDOW_CLOSED = "The response window has closed.";
// DERIVED from 4.1bnr: no frame draws a response sent offline.
const OFFLINE_MESSAGE =
  "You're offline, so your response couldn't be sent. Your response is still here — try again once you reconnect.";
const OFFLINE_LOAD = "You're offline, so this case couldn't be loaded. Try again once you reconnect.";
// Evidence mode (undrawn).
const NO_PHOTO = "Add at least one photo.";
const EVIDENCE_OFFLINE =
  "You're offline, so your photos couldn't be sent. They're still here — try again once you reconnect.";
const EVIDENCE_CLOSED = "The response window has closed.";

export default function DisputeRespondScreen({ route, navigation }) {
  const { disputeCaseId, mode = "respond" } = route.params ?? {};
  const evidenceOnly = mode === "evidence";
  const title = evidenceOnly ? "Add photos" : "Respond";
  const [dc, setDc] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [statement, setStatement] = useState("");
  const [photos, setPhotos] = useState([]); // [{ uri, mimeType, dataBase64 }]
  const [statementError, setStatementError] = useState(null);
  const [photoError, setPhotoError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const load = useCallback(async () => {
    setLoadError(null);
    try {
      const res = await getCase(disputeCaseId);
      setDc(res.case);
    } catch (err) {
      setLoadError(err.offline ? OFFLINE_LOAD : parseApiError(err).formError || "This case couldn't be loaded.");
    }
  }, [disputeCaseId]);

  useEffect(() => {
    load();
  }, [load]);

  async function addPhoto() {
    setPhotoError(null);
    try {
      // Photos already on the case count toward this party's three (FR-DISPUTE-05).
      const alreadyOnCase = dc?.evidence?.mine?.length ?? 0;
      const picked = await pickEvidencePhoto(photos.length + alreadyOnCase);
      if (!picked) return; // backed out of the picker
      if (picked.error) {
        setPhotoError(picked.error);
        return;
      }
      setPhotos((current) => [...current, picked.photo]);
      setStatementError(null);
    } catch {
      setPhotoError("This photo couldn't be read. Try choosing it again.");
    }
  }

  async function submit() {
    if (sending) return;
    setFormError(null);
    const text = statement.trim();
    if (evidenceOnly) {
      if (photos.length === 0) {
        setPhotoError(NO_PHOTO);
        return;
      }
      setSending(true);
      try {
        await addEvidence(disputeCaseId, {
          images: photos.map(({ mimeType, dataBase64 }) => ({ mimeType, dataBase64 })),
        });
        setSubmitted(true);
      } catch (err) {
        setFormError(err.offline ? EVIDENCE_OFFLINE : parseApiError(err).formError || "Your photos couldn't be sent.");
      } finally {
        setSending(false);
      }
      return;
    }
    if (!text && photos.length === 0) {
      setStatementError(EMPTY_RESPONSE);
      return;
    }
    setSending(true);
    try {
      await respondToCase(disputeCaseId, {
        statement: text || undefined,
        images: photos.map(({ mimeType, dataBase64 }) => ({ mimeType, dataBase64 })),
      });
      setSubmitted(true); // → 9.3e
    } catch (err) {
      setFormError(err.offline ? OFFLINE_MESSAGE : parseApiError(err).formError || "Your response couldn't be sent.");
    } finally {
      setSending(false);
    }
  }

  // ---- Loading, or a failed load ----
  if (!dc) {
    return (
      <View style={styles.root}>
        <StatusBar style="dark" />
        <ScreenHeader title={title} onBack={() => navigation.goBack()} />
        <View style={styles.content}>
          {loadError ? (
            <>
              <FormBanner kind="error" message={loadError} />
              <Button title="Try again" style="secondary" onPress={load} />
            </>
          ) : (
            <LoadingState />
          )}
        </View>
      </View>
    );
  }

  const context = respondContextLine(dc);

  // ---- 9.3e — Response submitted ----
  if (submitted) {
    return (
      <View style={[styles.root, styles.rootSubtle]}>
        <StatusBar style="dark" />
        <ScreenHeader title={title} onBack={() => navigation.goBack()} />
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
          <Text style={styles.context}>{context}</Text>
          <Text style={styles.subTitle}>{evidenceOnly ? "Photos added" : "Response submitted"}</Text>
          <Text style={styles.subBody}>
            {evidenceOnly
              ? "The moderator will see them with the case. You'll see the outcome on the case when it's decided."
              : "A moderator now has both sides. You'll see the outcome on the case when it's decided."}
          </Text>
        </ScrollView>
        <CtaBar surface="subtle">
          <Button title="Back to case" onPress={() => navigation.goBack()} />
        </CtaBar>
      </View>
    );
  }

  // Already answered, or the window closed while the screen was away: say so, offer nothing.
  const closedReason = evidenceOnly
    ? dc.evidence?.canAdd
      ? null
      : EVIDENCE_CLOSED
    : dc.canRespond
      ? null
      : dc.hasResponded
        ? ALREADY_RESPONDED
        : WINDOW_CLOSED;

  // ---- 9.3 — Respond ----
  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScreenHeader title={title} onBack={() => navigation.goBack()} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {formError ? <FormBanner kind="error" message={formError} /> : null}
        {closedReason ? <FormBanner kind="error" message={closedReason} /> : null}
        <Text style={styles.context}>{context}</Text>
        {evidenceOnly ? null : (
          <>
        <Text style={styles.prompt}>Your side of what happened</Text>
        <View>
          <TextArea
            value={statement}
            onChangeText={(text) => {
              setStatement(text);
              if (statementError) setStatementError(null);
            }}
            maxLength={STATEMENT_MAX_LENGTH}
            error={Boolean(statementError)}
            accessibilityLabel="Your side of what happened, up to 300 characters"
          />
          <FieldError message={statementError} />
        </View>
        <Text style={styles.capNote}>Up to 300 characters.</Text>
          </>
        )}

        <Text style={styles.prompt}>Add photos (optional)</Text>
        <PhotoPicker photos={photos.map((p) => p.uri)} onAdd={addPhoto} />
        <FieldError message={photoError} />
        <Text style={styles.optionalNote}>Evidence is optional — not adding any never blocks review.</Text>
      </ScrollView>

      {closedReason ? null : (
        <CtaBar>
          <Button title={evidenceOnly ? "Add photos" : "Submit response"} onPress={submit} loading={sending} />
        </CtaBar>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // 9.3 is white; 9.3e is grey.
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
  // Figma content: pad 16/16/0/16, gap 12.
  content: {
    flexGrow: 1,
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.gutter,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  context: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  prompt: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  capNote: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  optionalNote: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  // 9.3e
  subTitle: {
    ...typography.display,
    color: colors.text.primary,
  },
  subBody: {
    ...typography.body,
    color: colors.text.secondary,
  },
});
