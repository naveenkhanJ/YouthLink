/**
 * Password reset, new password (spec 1.9) — Afham.
 *
 * Layout:
 *  - Chrome/ScreenHeader title "Reset password"
 *  - TextField "New password" (secure)
 *  - TextField "Confirm new password" (secure)
 *  - TEXT "8 to 64 characters — spaces allowed, no other rules."
 *  - TEXT "Changing your password signs you out on any other device."
 *  - SPACER
 *  - ctaBar: Button "Set new password"
 */
import { useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { StatusBar } from "expo-status-bar";
import { colors, spacing, typography } from "../../theme/tokens";
import ScreenHeader from "../../components/ScreenHeader";
import Button from "../../components/Button";
import TextField from "../../components/TextField";
import CtaBar from "../../components/CtaBar";
import { confirmPasswordReset } from "../../api/account";
import { parseApiError } from "../../api/client";

export default function AccountResetPasswordScreen({ navigation, route }) {
  const { token } = route.params || {};
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  async function handleSetNewPassword() {
    setLoading(true);
    setFormError(null);
    setFieldErrors({});
    try {
      await confirmPasswordReset({ token, newPassword: password });
      // Lead to login (1.6)
      navigation.reset({
        index: 0,
        routes: [{ name: "AccountLogin" }],
      });
    } catch (err) {
      const { formError, fieldErrors } = parseApiError(err);
      setFormError(formError);
      setFieldErrors(fieldErrors);
    } finally {
      setLoading(false);
    }
  }

  const canSubmit = password.length >= 8 && confirmPassword === password;

  return (
    <View style={styles.flex}>
      <StatusBar style="dark" />
      <ScreenHeader title="Reset password" onBack={() => navigation.goBack()} />

      <KeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={120}
      >
        {formError ? <Text style={styles.formErrorText}>{formError}</Text> : null}

        <TextField
          label="New password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="••••••••••"
          error={fieldErrors.newPassword || fieldErrors.password}
        />
        <TextField
          label="Confirm new password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholder="••••••••••"
        />

        <Text style={styles.pwHelp}>
          8 to 64 characters — spaces allowed, no other rules.
        </Text>
        <Text style={styles.signOutLine}>
          Changing your password signs you out on any other device.
        </Text>

        <View style={styles.spacer} />
      </KeyboardAwareScrollView>

      <CtaBar>
        <Button
          title="Set new password"
          onPress={handleSetNewPassword}
          loading={loading}
          disabled={!canSubmit}
        />
      </CtaBar>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.bg.default,
  },
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,       // 24px — spec: vertical pad 24/16/4/16
    paddingBottom: spacing.xs,
    gap: spacing.lg,              // 16px between fields
  },
  formErrorText: {
    ...typography.caption,
    color: colors.state.danger,
  },
  pwHelp: {
    ...typography.secondary,
    color: colors.text.secondary,
    marginTop: -spacing.sm,       // close the gap since this follows immediately
  },
  signOutLine: {
    ...typography.secondary,
    color: colors.text.secondary,
    marginTop: -spacing.sm,
  },
  spacer: {
    flex: 1,
    minHeight: spacing.xxl,
  },
});
