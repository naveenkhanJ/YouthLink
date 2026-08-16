/**
 * Apply confirmation screen (FR-APPLY-02) — Naveenkhan.
 *
 * The note should pre-fill from the worker's profile bio (FR-PROF-04), but
 * Profile & Trust Signals isn't built yet this sprint (deferred slice) —
 * there's no endpoint to read a bio from. Starts blank instead; wire the
 * pre-fill in once that endpoint exists. Still editable and optional
 * either way, which is what the acceptance criteria actually require.
 */
import { useState } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { applyToPosting } from "../../api/application";
import { parseApiError } from "../../api/client";
import { colors, spacing, typography } from "./theme";
import Button from "./components/Button";
import TextField from "./components/TextField";

const NOTE_MAX_LENGTH = 300;

export default function ApplyScreen({ route, navigation }) {
  const { gigPostingId, title } = route.params;
  const [note, setNote] = useState("");
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit() {
    setFormError(null);
    setLoading(true);
    try {
      await applyToPosting({ gigPostingId, note: note.trim() || undefined });
      setSubmitted(true);
    } catch (err) {
      setFormError(parseApiError(err).formError || "Could not submit your application.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Application sent</Text>
        <Text style={styles.body}>
          Your application to "{title}" is Pending. You can withdraw it any time before the
          Employer decides.
        </Text>
        <Button title="View my applications" onPress={() => navigation.replace("ApplicationMine")} />
        <StatusBar style="dark" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Apply to "{title}"</Text>

        {formError ? <Text style={styles.formError}>{formError}</Text> : null}

        <TextField
          label="Note to the Employer (optional)"
          value={note}
          onChangeText={setNote}
          placeholder="Anything you'd like them to know"
          multiline
          maxLength={NOTE_MAX_LENGTH}
        />

        <Button title="Submit application" onPress={handleSubmit} loading={loading} />
        <Button title="Cancel" variant="secondary" onPress={() => navigation.goBack()} />

        <StatusBar style="dark" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.surface },
  container: { flexGrow: 1, padding: spacing.xl, backgroundColor: colors.surface },
  title: {
    fontSize: typography.title.fontSize,
    fontWeight: typography.title.fontWeight,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  body: { fontSize: typography.body.fontSize, color: colors.textSecondary, marginBottom: spacing.xl },
  formError: { fontSize: typography.caption.fontSize, color: colors.danger, marginBottom: spacing.lg },
});
