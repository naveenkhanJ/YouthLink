/**
 * Change password (prototype 1.11; FR-ACC-11) — Afham.
 *
 * Layout: Chrome/ScreenHeader "Change password", content pad 24/16/4/16 gap 16: Current
 * password, New password, Confirm new password (all Secure), the 8–64 rule, the sign-out line
 * (the consequence is stated BEFORE the button, per the requirement's amendment), growing
 * spacer, ctaBar "Change password".
 *
 * The server stamps passwordChangedAt, which signs out every OTHER device; it returns a fresh
 * token for this one, which replaces the stored token so this device stays signed in. A wrong
 * current password is a field error on that field (State=Error + FieldError, as 1.12err draws
 * the same case for the phone form), not a sign-out.
 *
 * "Forgotten your current password?" (1.11r1) opens AccountResetByEmail (1.11r2–r4), which emails
 * a reset link to the verified address; it sits between the length rule and the sign-out line,
 * as 1.11r1 draws it.
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
import Link from "../../components/Link";
import CtaBar from "../../components/CtaBar";
import { useAuth } from "../../auth/AuthContext";
import { changePassword } from "../../api/account";

const WRONG_CURRENT_MESSAGE = "That password doesn't match your account. Please try again.";
const LENGTH_MESSAGE = "Password must be 8 to 64 characters.";
const MISMATCH_MESSAGE = "Passwords do not match.";

export default function AccountChangePasswordScreen({ navigation }) {
  const { replaceToken } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setFormError(null);
    const errors = {};
    if (newPassword.length < 8 || newPassword.length > 64) errors.newPassword = LENGTH_MESSAGE;
    else if (newPassword !== confirmPassword) errors.confirmPassword = MISMATCH_MESSAGE;
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      const { token } = await changePassword({ currentPassword, newPassword });
      await replaceToken(token);
      navigation.goBack(); // 1.11 leads back to Settings
    } catch (err) {
      if (err.fields?.currentPassword) setFieldErrors({ currentPassword: WRONG_CURRENT_MESSAGE });
      else if (err.fields?.newPassword) setFieldErrors({ newPassword: LENGTH_MESSAGE });
      else setFormError(err.message); // rate limit, offline
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScreenHeader title="Change password" onBack={() => navigation.goBack()} />

      <KeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={120}
      >
        {formError ? <FormBanner kind="error" message={formError} /> : null}

        <TextField
          label="Current password"
          placeholder="8–64 characters"
          value={currentPassword}
          onChangeText={(value) => {
            setCurrentPassword(value);
            setFieldErrors((prev) => ({ ...prev, currentPassword: undefined }));
          }}
          secureTextEntry
          maxLength={64}
          error={Boolean(fieldErrors.currentPassword)}
        />
        <FieldError message={fieldErrors.currentPassword} />
        <TextField
          label="New password"
          placeholder="••••••••••"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          maxLength={64}
          error={Boolean(fieldErrors.newPassword)}
        />
        <FieldError message={fieldErrors.newPassword} />
        <TextField
          label="Confirm new password"
          placeholder="••••••••••"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          maxLength={64}
          error={Boolean(fieldErrors.confirmPassword)}
        />
        <FieldError message={fieldErrors.confirmPassword} />

        <Text style={styles.help}>8 to 64 characters — spaces allowed, no other rules.</Text>
        <View style={styles.linkWrap}>
          <Link
            title="Forgotten your current password?"
            onPress={() => navigation.navigate("AccountResetByEmail")}
          />
        </View>
        <Text style={styles.help}>Changing your password signs you out on any other device.</Text>

        <View style={styles.spacer} />
      </KeyboardAwareScrollView>

      <CtaBar>
        <Button
          title="Change password"
          onPress={handleSubmit}
          loading={loading}
          disabled={!currentPassword || !newPassword || !confirmPassword}
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
  linkWrap: {
    alignItems: "flex-start",
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
