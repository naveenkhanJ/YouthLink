/**
 * Edit bio (prototype M7 7.1, 7.1d; FR-PROF-03, feeds FR-PROF-04 and FR-ENDORSE-13) — Afham.
 *
 * Figma 7.1 (192:2) / 7.1d (2051:251): Chrome/ScreenHeader "Edit bio"; content pad 20/16/0/16,
 * gap 10: the label "Your bio" (mobile/body-medium), Input/TextArea, its counter ("271 / 300",
 * mobile/caption, hugging at the left), the helper sentence (mobile/secondary); a pinned ctaBar
 * with "Save". 7.1d is the same screen after saving: a success line in color/state/success under
 * the helper, and the button reads "Done".
 *
 * Reached from the profile (1.18 / 1.18bio / 1.18z "Add a short bio") and from the one-time bio
 * prompt before a first application (8.6). The 300-character cap is enforced in the field
 * (maxLength) and on the server, which refuses rather than truncates.
 *
 * States: loading (Feedback/LoadingState while the current bio is read), a load failure or offline
 * (FormBanner Kind=Error + "Try again", design-system §8), a save failure (FormBanner above the
 * field; the typed text is kept), saving (Button Loading), saved (7.1d).
 */
import { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { StatusBar } from "expo-status-bar";
import { colors, spacing, typography } from "../../theme/tokens";
import ScreenHeader from "../../components/ScreenHeader";
import Button from "../../components/Button";
import TextArea from "../../components/TextArea";
import FormBanner from "../../components/FormBanner";
import LoadingState from "../../components/LoadingState";
import CtaBar from "../../components/CtaBar";
import { getOwnProfile, updateBio } from "../../api/profile";
import { parseApiError } from "../../api/client";

const BIO_CAP = 300;

// 7.1 / 7.1d copy, verbatim.
const HELPER = "Shown on your profile. It also pre-fills the note on your applications, which you can edit each time.";
const SAVED_NOTE = "Saved — your bio now shows on your profile and pre-fills your application notes.";

export default function ProfileBioScreen({ navigation }) {
  const [bio, setBio] = useState(null); // null until the current bio has loaded
  const [loadError, setLoadError] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = useCallback(() => {
    setLoadError(null);
    getOwnProfile()
      .then((profile) => setBio(profile.bio ?? ""))
      .catch((err) =>
        setLoadError(
          err.offline
            ? "You're offline, so your bio couldn't be loaded. Try again once you reconnect."
            : parseApiError(err).formError || "Your bio couldn't be loaded.",
        ),
      );
  }, []);

  useEffect(load, [load]);

  function edit(text) {
    setBio(text);
    setSaved(false); // editing again goes back to 7.1 and its Save
    setSaveError(null);
  }

  async function save() {
    setSaveError(null);
    setSaving(true);
    try {
      const result = await updateBio(bio.trim());
      setBio(result.bio ?? "");
      setSaved(true);
    } catch (err) {
      const parsed = parseApiError(err);
      setSaveError(parsed.fieldErrors.bio || parsed.formError || "Your bio couldn't be saved. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScreenHeader title="Edit bio" onBack={() => navigation.goBack()} />
      {bio === null ? (
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
      ) : (
        <>
          <KeyboardAwareScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            enableOnAndroid
            extraScrollHeight={120}
          >
            {saveError ? <FormBanner kind="error" message={saveError} /> : null}
            <Text style={styles.label}>Your bio</Text>
            <TextArea value={bio} onChangeText={edit} maxLength={BIO_CAP} accessibilityLabel="Your bio" />
            <Text style={styles.counter} accessibilityLabel={`${bio.length} of ${BIO_CAP} characters`}>
              {bio.length} / {BIO_CAP}
            </Text>
            <Text style={styles.helper}>{HELPER}</Text>
            {saved ? (
              <Text style={styles.savedNote} accessibilityLiveRegion="polite">
                {SAVED_NOTE}
              </Text>
            ) : null}
          </KeyboardAwareScrollView>
          <CtaBar>
            {saved ? (
              <Button title="Done" onPress={() => navigation.goBack()} />
            ) : (
              <Button title="Save" onPress={save} loading={saving} />
            )}
          </CtaBar>
        </>
      )}
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
  // Figma: content pad 20/16/0/16, gap 10.
  content: {
    flexGrow: 1,
    paddingTop: 20,
    paddingHorizontal: spacing.gutter,
    paddingBottom: spacing.lg,
    gap: 10,
  },
  label: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  counter: {
    ...typography.caption,
    color: colors.text.secondary,
    alignSelf: "flex-start",
  },
  helper: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  savedNote: {
    ...typography.secondary,
    color: colors.state.success,
  },
});
