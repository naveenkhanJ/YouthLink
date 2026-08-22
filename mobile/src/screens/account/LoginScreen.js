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
 * No post-login destination screen exists yet (no other module has a
 * screen built), so a successful login shows an inline confirmation rather
 * than navigating anywhere — where an authenticated user actually lands is
 * a bigger, not-yet-decided app-wide question, not something to invent here.
 */
import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { loginPassword, loginOtp } from "../../api/account";
import { setAuthToken, parseApiError } from "../../api/client";
import { colors, spacing, radius, typography } from "./theme";
import Button from "./components/Button";
import TextField from "./components/TextField";
import usePhoneVerification from "./hooks/usePhoneVerification";

export default function LoginScreen({ navigation }) {
  const [mode, setMode] = useState("password"); // "password" | "otp"
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Password path.
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);

  const canSubmit = phone.trim().length > 0 && password.length > 0;

  async function handleSubmit() {
    setFieldErrors({});
    setFormError(null);
    setLoading(true);
    try {
      const { token, user } = await loginPassword({ phone, password });
      setAuthToken(token);
      setPassword("");
      setLoggedInUser(user);
    } catch (err) {
      const { formError, fieldErrors } = parseApiError(err);
      setFormError(formError);
      setFieldErrors(fieldErrors);
    } finally {
      setLoading(false);
    }
  }

  // OTP path — independent phone/error state from the password path above,
  // deliberately (via its own usePhoneVerification instance), so switching
  // modes never carries stale input or errors from one into the other.
  const {
    phone: otpPhone,
    setPhone: setOtpPhone,
    confirmationResult,
    code,
    setCode,
    error: otpError,
    sendingCode,
    confirmingCode,
    sendCode: handleSendCode,
    confirmCode,
  } = usePhoneVerification();

  async function handleConfirmCode() {
    await confirmCode(async (idToken) => {
      const { token, user } = await loginOtp({ idToken });
      setAuthToken(token);
      setLoggedInUser(user);
    });
  }

  if (loggedInUser) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome back, {loggedInUser.legalName}</Text>
        <Text style={styles.body}>Logged in successfully.</Text>
        <StatusBar style="dark" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
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

            <TextField
              label="Phone number"
              value={phone}
              onChangeText={setPhone}
              placeholder="+94771234567"
              keyboardType="phone-pad"
              error={fieldErrors.phone}
            />
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
          <>
            {otpError ? <Text style={styles.formError}>{otpError}</Text> : null}

            <TextField
              label="Phone number"
              value={otpPhone}
              onChangeText={setOtpPhone}
              placeholder="+94771234567"
              keyboardType="phone-pad"
            />

            {!confirmationResult ? (
              <Button
                title="Send code"
                onPress={handleSendCode}
                loading={sendingCode}
                disabled={!otpPhone.trim()}
              />
            ) : (
              <>
                <TextField
                  label="Verification code"
                  value={code}
                  onChangeText={setCode}
                  placeholder="123456"
                  keyboardType="number-pad"
                />
                <Button
                  title="Log in"
                  onPress={handleConfirmCode}
                  loading={confirmingCode}
                  disabled={!code.trim()}
                />
              </>
            )}
          </>
        )}

        <Pressable
          style={styles.linkContainer}
          onPress={() => navigation.navigate("AccountRegister")}
        >
          <Text style={styles.link}>Don't have an account? Create one</Text>
        </Pressable>

        <StatusBar style="dark" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.surface,
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
  body: {
    fontSize: typography.body.fontSize,
    color: colors.textSecondary,
  },
  formError: {
    fontSize: typography.caption.fontSize,
    color: colors.danger,
    marginBottom: spacing.lg,
  },
  linkContainer: {
    marginTop: spacing.lg,
    alignItems: "center",
  },
  link: {
    fontSize: typography.caption.fontSize,
    fontWeight: typography.caption.fontWeight,
    color: colors.primary,
  },
});
