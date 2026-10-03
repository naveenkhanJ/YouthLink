/**
 * Email add or change (prototype 1.14 / 1.14b / 1.14err; FR-ACC-14) — Afham.
 *
 * Figma: Chrome/ScreenHeader "Email", content pad 24/16/4/16 gap 16.
 *   1.14     "Email address" field, the note, ctaBar "Send confirmation link"
 *   1.14b    pending: the field shows the new address and a pendingChangeRow ("Pending — confirm
 *            <address>", body, "Cancel this change") replaces the button; content pad 24/16/24/16
 *   1.14err  the field in State=Error with "This email is already on another account. Try a
 *            different address." beneath it; the note stays
 *
 * Nothing on the account changes until the link sent to the new address is opened: the old email
 * (if any) stays the active recovery channel. The screen asks the server what is pending when it
 * opens, so a change started earlier shows as 1.14b, and every time it comes back to the
 * foreground, so the address that was just confirmed in the browser is picked up.
 *
 * No password is asked: FR-ACC-14 gates this by the confirmation link alone (1.11r4 says "no
 * password needed").
 */
import { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, AppState } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { StatusBar } from "expo-status-bar";
import { colors, spacing, typography } from "../../theme/tokens";
import ScreenHeader from "../../components/ScreenHeader";
import Button from "../../components/Button";
import TextField from "../../components/TextField";
import FieldError from "../../components/FieldError";
import FormBanner from "../../components/FormBanner";
import Link from "../../components/Link";
import CtaBar from "../../components/CtaBar";
import { useAuth } from "../../auth/AuthContext";
import { getMe, requestEmailChange, cancelEmailChange } from "../../api/account";

const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TAKEN_MESSAGE = "This email is already on another account. Try a different address.";
// Not drawn: kept short and in the same voice.
const INVALID_MESSAGE = "Enter a valid email address.";
const SAME_MESSAGE = "That is already your confirmed email address.";
const NOTE = "We'll send a confirmation link. Nothing on your account changes until the new address is confirmed.";

export default function AccountEmailScreen({ navigation }) {
  const { updateUser } = useAuth();
  const [email, setEmail] = useState("");
  const [pendingEmail, setPendingEmail] = useState(null);
  const [fieldError, setFieldError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Asks the server what is pending and keeps the stored user current (a confirmed address, a
  // number changed elsewhere). Quiet on failure: the form still works offline-first.
  const refresh = useCallback(async () => {
    try {
      const { pendingEmail: pending, ...account } = await getMe();
      setPendingEmail(pending);
      if (pending) setEmail(pending);
      await updateUser({ email: account.email, emailVerified: account.emailVerified });
    } catch {
      /* keep what is on screen */
    }
  }, [updateUser]);

  useEffect(() => {
    refresh();
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") refresh();
    });
    return () => sub.remove();
  }, [refresh]);

  async function handleSend() {
    setFormError(null);
    const address = email.trim();
    if (!EMAIL_FORMAT.test(address)) {
      setFieldError(INVALID_MESSAGE);
      return;
    }
    setFieldError(null);
    setLoading(true);
    try {
      const { pendingEmail: pending } = await requestEmailChange({ email: address });
      setPendingEmail(pending);
      setEmail(pending);
    } catch (err) {
      if (err.status === 409) setFieldError(TAKEN_MESSAGE);
      else if (err.fields?.email) setFieldError(err.status === 400 && /already your/i.test(err.message) ? SAME_MESSAGE : INVALID_MESSAGE);
      else setFormError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel() {
    setFormError(null);
    try {
      await cancelEmailChange();
      navigation.goBack(); // 1.14b: "Cancel this change" leads back to Settings
    } catch (err) {
      setFormError(err.message);
    }
  }

  const pending = Boolean(pendingEmail);

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScreenHeader title="Email" onBack={() => navigation.goBack()} />

      <KeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, pending && styles.contentPending]}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={120}
      >
        {formError ? <FormBanner kind="error" message={formError} /> : null}

        <TextField
          label="Email address"
          value={email}
          onChangeText={(value) => {
            setEmail(value);
            setFieldError(null);
          }}
          placeholder="you@example.com"
          keyboardType="email-address"
          disabled={pending}
          error={Boolean(fieldError)}
        />
        <FieldError message={fieldError} />

        {pending ? (
          <View style={styles.pendingRow}>
            <Text style={styles.pendingTitle}>Pending — confirm {pendingEmail}</Text>
            <Text style={styles.pendingBody}>{NOTE.replace("We'll send", "We sent")}</Text>
            <Link title="Cancel this change" onPress={handleCancel} />
          </View>
        ) : (
          <Text style={styles.note}>{NOTE}</Text>
        )}

        <View style={styles.spacer} />
      </KeyboardAwareScrollView>

      {pending ? null : (
        <CtaBar>
          <Button title="Send confirmation link" onPress={handleSend} loading={loading} disabled={!email.trim()} />
        </CtaBar>
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
  // Figma: content pad 24/16/4/16, gap 16 (1.14, 1.14err); 1.14b ends with 24 at the bottom.
  content: {
    flexGrow: 1,
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xs,
    gap: spacing.lg,
  },
  contentPending: {
    paddingBottom: spacing.xl,
  },
  // pendingChangeRow: pad 12/14/12/14, gap 6, 1px border/default, radius 10.
  pendingRow: {
    paddingVertical: spacing.md,
    paddingHorizontal: 14,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: 10,
    backgroundColor: colors.bg.default,
  },
  pendingTitle: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  pendingBody: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  note: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  spacer: {
    flex: 1,
    minHeight: spacing.lg,
  },
});
