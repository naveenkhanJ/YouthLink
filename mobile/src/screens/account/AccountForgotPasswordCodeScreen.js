/**
 * Forgot password, enter the SMS code (FR-ACC-10) — Afham.
 *
 * Not drawn on its own: the prototype's "States not drawn in this module" says a code step is
 * `1.3`'s layout. So this is that layout under the Forgot-password header — the "We sent a
 * 6-digit code to …" line, the six boxes, the failure line beneath them, the resend countdown
 * (0:47 → Resend code) — with the copy of 1.3err2 / 1.3err1 for a wrong or expired code.
 *
 * Params: `phone` (E.164, what the API takes) and `destination` (the formatted number shown).
 * A correct code returns a short-lived token for the new-password step (1.9).
 */
import { useEffect, useRef, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { colors, spacing, typography } from "../../theme/tokens";
import ScreenHeader from "../../components/ScreenHeader";
import Button from "../../components/Button";
import CodeInputNumeric from "../../components/CodeInputNumeric";
import CountdownText from "../../components/CountdownText";
import FieldError from "../../components/FieldError";
import Link from "../../components/Link";
import CtaBar from "../../components/CtaBar";
import { verifyPasswordResetCode, requestPasswordReset } from "../../api/account";
import { CODE_MISMATCH_MESSAGE } from "./hooks/usePhoneVerification";

// Same judgment call as the registration code step: long enough to discourage spamming SMS.
const RESEND_COOLDOWN_SECONDS = 30;

export default function AccountForgotPasswordCodeScreen({ navigation, route }) {
  const { phone, destination } = route.params || {};
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);
  const timer = useRef(null);

  function startCooldown() {
    clearInterval(timer.current);
    setCooldown(RESEND_COOLDOWN_SECONDS);
    timer.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  // The code was sent by the previous screen, so the first cooldown starts on arrival.
  useEffect(() => {
    startCooldown();
    return () => clearInterval(timer.current);
  }, []);

  async function handleResend() {
    setError(null);
    setCode("");
    try {
      await requestPasswordReset({ phone, channel: "PHONE" });
      startCooldown();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleVerify() {
    setVerifying(true);
    setError(null);
    try {
      const { token } = await verifyPasswordResetCode({ phone, code });
      navigation.navigate("AccountResetPassword", { token });
    } catch (err) {
      // 401 is "wrong or expired" (the server answers both the same way); 429 and offline
      // errors carry their own readable sentence.
      setError(err.status === 401 ? CODE_MISMATCH_MESSAGE : err.message);
    } finally {
      setVerifying(false);
    }
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScreenHeader title="Forgot password" onBack={() => navigation.goBack()} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.sentTo}>We sent a 6-digit code to {destination}.</Text>
        <CodeInputNumeric value={code} onChangeText={setCode} error={Boolean(error)} />
        <FieldError message={error} />
        {cooldown > 0 ? (
          <CountdownText text={`Resend in ${Math.floor(cooldown / 60)}:${String(cooldown % 60).padStart(2, "0")}`} />
        ) : (
          <Link title="Resend code" onPress={handleResend} />
        )}
        <View style={styles.spacer} />
      </ScrollView>

      <CtaBar>
        <Button title="Verify" onPress={handleVerify} loading={verifying} disabled={code.length !== 6} />
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
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xs,
    gap: spacing.lg,
  },
  sentTo: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  spacer: {
    flex: 1,
    minHeight: spacing.lg,
  },
});
