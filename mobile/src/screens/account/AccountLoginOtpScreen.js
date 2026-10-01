/**
 * Login, OTP path (spec 1.7) — Afham.
 *
 * Reached from LoginScreen (1.6) via "Log in with a code instead" link.
 * Layout per spec 1.7:
 *  - backHit 44×44 (no ScreenHeader chrome)
 *  - TEXT "Welcome back" (mobile/display)
 *  - TEXT "We'll text you a one-time code to log in." (mobile/caption, secondary)
 *  - TEXT "Code login" (mobile/caption, secondary) — the sub-label
 *
 * Phase 1 — before code is sent:
 *   PhoneField → "Send code" in ctaBar (disabled until 9 digits)
 *
 * Phase 2 — after code is sent (confirmationResult exists):
 *   PhoneField (locked) + CodeInputNumeric 6 boxes
 *   CountdownText (Resend in X:XX) or Resend link when cooldown ends
 *   linkGroup: "Use password instead" / "Trouble getting in? Get help"
 *   ctaBar: Button "Log in"
 *
 * The OTP verification state lives in usePhoneVerification — the same hook
 * used by RegisterScreen. The confirmed Firebase ID token is exchanged with
 * the backend at POST /login/otp to get a YouthLink JWT.
 */
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { loginOtp } from "../../api/account";
import { useAuth } from "../../auth/AuthContext";
import { colors, spacing, typography } from "../../theme/tokens";
import Button from "../../components/Button";
import Link from "../../components/Link";
import PhoneField from "../../components/PhoneField";
import CodeInputNumeric from "../../components/CodeInputNumeric";
import CountdownText from "../../components/CountdownText";
import CtaBar from "../../components/CtaBar";
import BackButton from "./components/BackButton";
import usePhoneVerification from "./hooks/usePhoneVerification";
import { LOCAL_DIGITS } from "./phoneFormat";

export default function AccountLoginOtpScreen({ navigation }) {
  const { signIn } = useAuth();
  const insets = useSafeAreaInsets();

  const verification = usePhoneVerification();
  const {
    phone,
    setPhone,
    confirmationResult,
    code,
    setCode,
    error,
    sendingCode,
    confirmingCode,
    resendCooldown,
    formattedPhone,
    sendCode,
    changeNumber,
    codeExpired,
  } = verification;

  async function handleConfirmCode() {
    await verification.confirmCode(async (idToken) => {
      const { token, user } = await loginOtp({ idToken });
      await signIn(token, user);
      navigation.reset({ index: 0, routes: [{ name: "Home" }] });
    });
  }

  const phase = confirmationResult ? "code" : "phone";

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <BackButton onPress={() => navigation.goBack()} />

        <Text style={styles.screenTitle}>Welcome back</Text>
        <Text style={styles.welcomeSub}>
          We'll text you a one-time code to log in.
        </Text>
        <Text style={styles.sub}>Code login</Text>

        <PhoneField
          value={phone}
          onChangeText={setPhone}
          error={phase === "phone" ? error : undefined}
          editable={phase === "phone"}
        />

        {phase === "code" ? (
          <>
            {/* "We sent a 6-digit code to +94 XX XXX XXXX." */}
            <Text style={styles.sentTo}>
              We sent a 6-digit code to {formattedPhone}.
            </Text>

            <CodeInputNumeric
              value={code}
              onChange={setCode}
              error={!!error}
            />

            {/* Countdown or Resend link */}
            {resendCooldown > 0 ? (
              <CountdownText seconds={resendCooldown} />
            ) : (
              <Link
                title="Resend code"
                onPress={sendCode}
                disabled={sendingCode || confirmingCode}
              />
            )}

            {error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : null}
          </>
        ) : null}

        <View style={styles.spacer} />

        {phase === "code" ? (
          <View style={styles.linkGroup}>
            <Link
              title="Change number"
              onPress={changeNumber}
            />
            <Link
              title="Use password instead"
              onPress={() => navigation.goBack()}
            />
            <Link
              title="Trouble getting in? Get help"
              onPress={() => console.log("HF.5 — not yet built")}
            />
          </View>
        ) : (
          <View style={styles.linkGroup}>
            <Link
              title="Use password instead"
              onPress={() => navigation.goBack()}
            />
            <Link
              title="Trouble getting in? Get help"
              onPress={() => console.log("HF.5 — not yet built")}
            />
          </View>
        )}
      </ScrollView>

      <CtaBar>
        {phase === "phone" ? (
          <Button
            title="Send code"
            onPress={sendCode}
            loading={sendingCode}
            disabled={phone.length !== LOCAL_DIGITS}
          />
        ) : (
          <Button
            title="Log in"
            onPress={handleConfirmCode}
            loading={confirmingCode}
            disabled={code.length !== 6 || codeExpired}
          />
        )}
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
  content: {
    flexGrow: 1,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xs,
    gap: spacing.lg,
  },
  screenTitle: {
    ...typography.display,
    color: colors.text.primary,
    marginTop: spacing.lg,
  },
  welcomeSub: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: -spacing.sm,   // collapse gap from content gap:16
  },
  sub: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: -spacing.sm,
  },
  sentTo: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  errorText: {
    ...typography.secondary,
    color: colors.state.danger,
  },
  spacer: {
    flex: 1,
    minHeight: spacing.xxl,
  },
  linkGroup: {
    gap: 0,
    alignItems: "flex-start",
    marginBottom: spacing.xs,
  },
});
