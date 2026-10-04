/**
 * Reset by email from Settings (prototype 1.11r2 / 1.11r3 / 1.11r4; FR-ACC-10 + FR-ACC-12's E5
 * amendment) — Afham.
 *
 * Reached from "Forgotten your current password?" on Change password (1.11r1). A signed-in person
 * who no longer knows their current password can still change it: the reset link goes to the
 * verified email on the account, and the new password is chosen on the web page the link opens
 * (the same page the login-side email reset uses). One screen, three states:
 *   "confirm"  1.11r2  explainer, the address (bold), the sign-out note, ctaBar "Send reset link"
 *   "sent"     1.11r3  Info banner naming the address, "You can keep using the app…", ctaBar "Done"
 *   "noEmail"  1.11r4  Info banner "no verified email", ctaBar "Add an email" → Email (1.14)
 *
 * The request reuses the unauthenticated reset endpoint with the account's own phone number and the
 * EMAIL channel, so its rate limit and its "same answer for everyone" behaviour apply unchanged.
 * Back, and Done, return to Settings (1.10). The address is the full one: the person is signed in,
 * so nothing is revealed that they cannot already see in Settings.
 */
import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { colors, spacing, typography } from "../../theme/tokens";
import ScreenHeader from "../../components/ScreenHeader";
import Button from "../../components/Button";
import FormBanner from "../../components/FormBanner";
import CtaBar from "../../components/CtaBar";
import { useAuth } from "../../auth/AuthContext";
import { requestPasswordReset } from "../../api/account";

export default function AccountResetByEmailScreen({ navigation }) {
  const { user } = useAuth();
  const hasVerifiedEmail = Boolean(user?.emailVerified && user?.email);
  const [step, setStep] = useState(hasVerifiedEmail ? "confirm" : "noEmail");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  if (!user) return null; // signing out: the screen is about to be replaced

  const toSettings = () => navigation.navigate("AccountSettings");

  async function handleSend() {
    setSending(true);
    setError(null);
    try {
      await requestPasswordReset({ phone: user.phone, channel: "EMAIL" });
      setStep("sent");
    } catch (err) {
      setError(err.message); // offline, or the server refused
    } finally {
      setSending(false);
    }
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScreenHeader title="Reset your password" onBack={toSettings} />

      {/* Spec: content pad 24/16/4/16 gap 16, growing spacer, pinned ctaBar. */}
      <View style={styles.content}>
        {step === "noEmail" ? (
          <>
            <FormBanner
              kind="info"
              message="There's no verified email on this account, so we can't send a reset link."
            />
            <Text style={styles.note}>
              Add an email address — no password needed — then reset your password by email.
            </Text>
          </>
        ) : null}

        {step === "confirm" ? (
          <>
            {error ? <FormBanner kind="error" message={error} /> : null}
            <Text style={styles.note}>
              We'll email a reset link to the address on your account. You'll set a new password from
              there.
            </Text>
            <Text style={styles.target}>{user.email}</Text>
            <Text style={styles.note}>Resetting your password signs you out on any other device.</Text>
          </>
        ) : null}

        {step === "sent" ? (
          <>
            <FormBanner
              kind="info"
              // The line break before the address is deliberate: when the address did not fit on the first
              // line, Android moved the full stop to the start of the next one, and a zero-width joiner did
              // not stop it. With the address starting its own line, the full stop stays attached to it.
              message={`We've sent a reset link to\n${user.email}. Check your inbox, and your spam folder if it isn't there.`}
            />
            <Text style={styles.note}>You can keep using the app. The link opens in your browser.</Text>
          </>
        ) : null}

        <View style={styles.spacer} />
      </View>

      <CtaBar>
        {step === "confirm" ? (
          <Button title="Send reset link" onPress={handleSend} loading={sending} />
        ) : step === "sent" ? (
          <Button title="Done" onPress={toSettings} />
        ) : (
          <Button title="Add an email" onPress={() => navigation.navigate("AccountEmail")} />
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
  content: {
    flex: 1,
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xs,
    gap: spacing.lg,
  },
  note: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  target: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  spacer: {
    flex: 1,
  },
});
