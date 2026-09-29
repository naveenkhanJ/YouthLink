/**
 * Login screen — both paths (FR-ACC-07) — Afham.
 *
 * Two fully independent paths, per FR-ACC-07: password, or Firebase phone
 * OTP via ./hooks/usePhoneVerification.js (shared with RegisterScreen.js,
 * which uses the same flow for signup) — its resulting ID token is handed
 * to the backend's separate POST /login/otp instead of /register.
 * Switching the mode toggle below does not share state between the two
 * paths, so partially-entered data in one mode never leaks into the other.
 *
 * A successful login now hands the token/user to AuthContext's signIn()
 * (persists to SecureStore, see src/auth/AuthContext.js) and resets the
 * stack back to Home, which renders the signed-in role's shell — Home used
 * to be an unreachable dead end for a logged-in user, this is the fix.
 */
import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { StatusBar } from "expo-status-bar";
import { loginPassword, loginOtp } from "../../api/account";
import { parseApiError } from "../../api/client";
import { useAuth } from "../../auth/AuthContext";
import { colors, spacing, radius, typography } from "./theme";
import Button from "./components/Button";
import TextField from "./components/TextField";
import Link from "./components/Link";
import PhoneField from "./components/PhoneField";
import PhoneVerificationStep from "./components/PhoneVerificationStep";
import usePhoneVerification from "./hooks/usePhoneVerification";
import { COUNTRY_CODE, LOCAL_DIGITS } from "./phoneFormat";

export default function LoginScreen({ navigation }) {
  const { signIn, sessionEndReason } = useAuth();
  const [mode, setMode] = useState("password"); // "password" | "otp"

  // Password path. `phone` is the 9-digit local part only — PhoneField
  // enforces that shape, same as usePhoneVerification's OTP path — the
  // full E.164 string is only assembled right before the API call.
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);

  const canSubmit = phone.length === LOCAL_DIGITS && password.length > 0;

  async function handleSubmit() {
    setFieldErrors({});
    setFormError(null);
    setLoading(true);
    try {
      const { token, user } = await loginPassword({ phone: `${COUNTRY_CODE}${phone}`, password });
      setPassword("");
      await signIn(token, user);
      navigation.reset({ index: 0, routes: [{ name: "Home" }] });
    } catch (err) {
      const { formError, fieldErrors } = parseApiError(err);
      setFormError(formError);
      setFieldErrors(fieldErrors);
    } finally {
      setLoading(false);
    }
  }

  // OTP path — its own usePhoneVerification instance, deliberately
  // independent of the password path above, so switching modes never
  // carries stale input or errors from one into the other.
  const otpVerification = usePhoneVerification();

  async function handleConfirmCode() {
    await otpVerification.confirmCode(async (idToken) => {
      const { token, user } = await loginOtp({ idToken });
      await signIn(token, user);
      navigation.reset({ index: 0, routes: [{ name: "Home" }] });
    });
  }

  return (
    <KeyboardAwareScrollView
      style={styles.flex}
      contentContainerStyle={styles.formContainer}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid
      extraScrollHeight={120}
    >
      {sessionEndReason ? (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>{sessionEndReason}</Text>
        </View>
      ) : null}

      <Text style={styles.title}>Log in</Text>

      <View style={styles.modeToggle}>
        <Pressable
          style={[styles.modeOption, mode === "password" && styles.modeOptionActive]}
          onPress={() => setMode("password")}
        >
          <Text style={[styles.modeLabel, mode === "password" && styles.modeLabelActive]}>
            Password
          </Text>
        </Pressable>
        <Pressable
          style={[styles.modeOption, mode === "otp" && styles.modeOptionActive]}
          onPress={() => setMode("otp")}
        >
          <Text style={[styles.modeLabel, mode === "otp" && styles.modeLabelActive]}>
            OTP
          </Text>
        </Pressable>
      </View>

      {mode === "password" ? (
        <>
          {formError ? <Text style={styles.formError}>{formError}</Text> : null}

          <PhoneField value={phone} onChangeText={setPhone} error={fieldErrors.phone} />
          <TextField
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
            error={fieldErrors.password}
          />

          <Button
            title="Log in"
            onPress={handleSubmit}
            loading={loading}
            disabled={!canSubmit}
          />
        </>
      ) : (
        <PhoneVerificationStep
          verification={otpVerification}
          onConfirm={handleConfirmCode}
          confirmLabel="Log in"
        />
      )}

      <Link onPress={() => navigation.navigate("AccountRegister")}>
        Don't have an account? Create one
      </Link>

      <StatusBar style="dark" />
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  // Top-anchored, not centered — the Password/OTP toggle below changes how
  // much content the screen renders (a mode switch, or the code field
  // appearing after "Send code"), and centering the whole scroll content
  // made the entire screen visibly jump every time that height changed.
  // Matches RegisterScreen.js's scrollContainer for the same reason.
  formContainer: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxl,
    backgroundColor: colors.surface,
  },
  banner: {
    backgroundColor: colors.bg?.subtle,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.xl,
    borderLeftWidth: 4,
    borderLeftColor: colors.brand?.primary || colors.primary,
  },
  bannerText: {
    fontSize: typography.body?.fontSize || 16,
    color: colors.textPrimary,
  },
  title: {
    fontSize: typography.title.fontSize,
    fontWeight: typography.title.fontWeight,
    color: colors.textPrimary,
    marginBottom: spacing.xl,
  },
  modeToggle: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.xs,
    marginBottom: spacing.xl,
  },
  modeOption: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    alignItems: "center",
  },
  modeOptionActive: {
    backgroundColor: colors.primary,
  },
  modeLabel: {
    fontSize: typography.caption.fontSize,
    fontWeight: typography.caption.fontWeight,
    color: colors.textSecondary,
  },
  modeLabelActive: {
    color: colors.surface,
  },
  formError: {
    fontSize: typography.caption.fontSize,
    color: colors.danger,
    marginBottom: spacing.lg,
  },
});
