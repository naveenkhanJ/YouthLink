/**
 * Password reset, new password (prototype 1.9; FR-ACC-10, FR-ACC-11) — Afham.
 *
 * Shared by every role and by two entry routes, which differ only in what proves the right:
 *   - `token`    — from the SMS code step (the email link uses the web page instead);
 *   - `deviceId` — an Admin-approved recovery request on this device (1.8rec4 → 1.9).
 *
 * Layout: Chrome/ScreenHeader "Reset password", content pad 24/16/4/16 gap 16: New password,
 * Confirm new password (both Secure), the 8–64 rule, the sign-out line, growing spacer, ctaBar
 * "Set new password". A rejected field is State=Error with a FieldError beneath it.
 *
 * Setting a password signs out every other device (the server stamps passwordChangedAt), so the
 * finish is the login screen, as the prototype's demo has it.
 */
import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { StatusBar } from "expo-status-bar";
import { colors, spacing, typography } from "../../theme/tokens";
import ScreenHeader from "../../components/ScreenHeader";
import Button from "../../components/Button";
import TextField from "../../components/TextField";
import FieldError from "../../components/FieldError";
import FormBanner from "../../components/FormBanner";
import CtaBar from "../../components/CtaBar";
import { confirmPasswordReset, confirmRecovery } from "../../api/account";

const LENGTH_MESSAGE = "8 to 64 characters — spaces allowed, no other rules.";
const MISMATCH_MESSAGE = "Passwords do not match.";
const SESSION_EXPIRED_MESSAGE =
  "This reset has expired or was already used. Go back and request a new code.";

export default function AccountResetPasswordScreen({ navigation, route }) {
  const { token, deviceId } = route.params || {};
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  async function handleSubmit() {
    setFormError(null);
    const errors = {};
    if (password.length < 8 || password.length > 64) errors.password = LENGTH_MESSAGE;
    else if (password !== confirmPassword) errors.confirmPassword = MISMATCH_MESSAGE;
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      if (deviceId) await confirmRecovery({ deviceId, newPassword: password });
      else await confirmPasswordReset({ token, newPassword: password });
      navigation.reset({ index: 0, routes: [{ name: "AccountLogin" }] });
    } catch (err) {
      if (err.fields?.newPassword || err.fields?.password) {
        setFieldErrors({ password: LENGTH_MESSAGE });
      } else {
        // 401 means the token or approval is gone (used, expired); anything else is the
        // server's own readable message (offline, rate limit).
        setFormError(err.status === 401 ? SESSION_EXPIRED_MESSAGE : err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScreenHeader title="Reset password" onBack={() => navigation.goBack()} />

      <KeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={120}
      >
        {formError ? <FormBanner kind="error" message={formError} /> : null}

        <TextField
          label="New password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="••••••••••"
          maxLength={64}
          error={Boolean(fieldErrors.password)}
        />
        <FieldError message={fieldErrors.password} />
        <TextField
          label="Confirm new password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholder="••••••••••"
          maxLength={64}
          error={Boolean(fieldErrors.confirmPassword)}
        />
        <FieldError message={fieldErrors.confirmPassword} />

        <Text style={styles.help}>8 to 64 characters — spaces allowed, no other rules.</Text>
        <Text style={styles.help}>Changing your password signs you out on any other device.</Text>

        <View style={styles.spacer} />
      </KeyboardAwareScrollView>

      <CtaBar>
        <Button
          title="Set new password"
          onPress={handleSubmit}
          loading={loading}
          disabled={!password || !confirmPassword}
        />
      </CtaBar>
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
  // Spec: content pad 24/16/4/16, gap 16.
  content: {
    flexGrow: 1,
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xs,
    gap: spacing.lg,
  },
  help: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  spacer: {
    flex: 1,
    minHeight: spacing.lg,
  },
});
