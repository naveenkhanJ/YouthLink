/**
 * Login, password path — Afham.
 *
 * Prototype frames (docs/prototype/M1-account.md): 1.6emp / 1.6 (empty and filled), 1.6sub
 * (submitting), 1.6bnr1 / bnr2 / bnr3 (incorrect details, 2 attempts left, paused 15
 * minutes), 1.6s (signed out for security) and 1.6sus (account suspended). They are all this
 * one screen with different state.
 *
 * Layout (every frame): content pad 6/16/4/16, gap 16 — back target, "Welcome back",
 * welcomeSub, [sessionBanner], [formBanner], PhoneField, password TextField, a growing
 * spacer, the link group — and a pinned ctaBar with "Log in".
 *
 * - 1.6s: the app signed the person out (session ended / password changed elsewhere), so
 *   there is no back chevron (nothing is behind it) and a plain line explains why.
 * - 1.6sus: a 403 from the server means the account is suspended — both inputs and the
 *   button are Disabled and the only link is "What suspension means".
 * - The error text is the server's own (it already matches 1.6bnr1/2/3 and 1.6sus), so the
 *   remaining-attempts warning and the lockout wording stay in one place.
 */
import { useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { loginPassword } from "../../api/account";
import { parseApiError } from "../../api/client";
import { useAuth } from "../../auth/AuthContext";
import { colors, spacing, typography } from "../../theme/tokens";
import Button from "../../components/Button";
import TextField from "../../components/TextField";
import Link from "../../components/Link";
import PhoneField from "../../components/PhoneField";
import FormBanner from "../../components/FormBanner";
import FieldError from "../../components/FieldError";
import CtaBar from "../../components/CtaBar";
import BackButton from "./components/BackButton";
import { COUNTRY_CODE, LOCAL_DIGITS } from "./phoneFormat";

const SESSION_BANNER =
  "You were signed out — your session ended, or your password was changed on another device. Sign in again to continue. If that change wasn't you, reset your password now.";

export default function LoginScreen({ navigation }) {
  const { signIn, sessionEndReason } = useAuth();
  const insets = useSafeAreaInsets();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [suspended, setSuspended] = useState(false);
  const [loading, setLoading] = useState(false);

  // 1.6emp shows the button disabled, 1.6 enabled: it needs a full number and a password.
  const canSubmit = !suspended && phone.length === LOCAL_DIGITS && password.length > 0;

  async function handleSubmit() {
    setFieldErrors({});
    setFormError(null);
    setLoading(true);
    try {
      const { token, user } = await loginPassword({
        phone: `${COUNTRY_CODE}${phone}`,
        password,
      });
      setPassword("");
      await signIn(token, user);
      navigation.reset({ index: 0, routes: [{ name: "Home" }] });
    } catch (err) {
      const parsed = parseApiError(err);
      setFormError(parsed.formError);
      setFieldErrors(parsed.fieldErrors);
      // 403 on this endpoint is only ever "suspended" (after the password was proven right).
      setSuspended(err.status === 403);
    } finally {
      setLoading(false);
    }
  }

  const helpTarget = () => navigation.navigate("HelpAccountAccess");

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* 44px back target — or, for 1.6s, an empty 44px so the title stays where the
            drawn frame has it (its content padding is 66 = 6 + 44 + 16). */}
        {sessionEndReason ? (
          <View style={styles.backHit} />
        ) : (
          <BackButton onPress={() => navigation.goBack()} />
        )}

        <Text style={styles.screenTitle}>Welcome back</Text>
        <Text style={styles.welcomeSub}>Log in to pick up where you left off.</Text>

        {sessionEndReason ? <Text style={styles.sessionBanner}>{SESSION_BANNER}</Text> : null}

        {formError ? <FormBanner kind="error" message={formError} /> : null}

        <PhoneField
          value={phone}
          onChangeText={setPhone}
          error={Boolean(fieldErrors.phone)}
          editable={!suspended}
        />
        {fieldErrors.phone ? <FieldError message={fieldErrors.phone} /> : null}

        <TextField
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="8–64 characters"
          secureTextEntry
          disabled={suspended}
          error={Boolean(fieldErrors.password)}
        />
        {fieldErrors.password ? <FieldError message={fieldErrors.password} /> : null}

        {/* Grows to push the link group down toward the ctaBar */}
        <View style={styles.spacer} />

        <View style={styles.linkGroup}>
          {suspended ? (
            <Link title="What suspension means" onPress={helpTarget} />
          ) : (
            <>
              <Link
                title="Log in with a code instead"
                onPress={() => navigation.navigate("AccountLoginOtp")}
              />
              <Link
                title="Forgot password?"
                onPress={() => navigation.navigate("AccountForgotPassword", { phone })}
              />
              <Link title="Trouble getting in? Get help" onPress={helpTarget} />
            </>
          )}
        </View>
      </ScrollView>

      <CtaBar>
        <Button title="Log in" onPress={handleSubmit} loading={loading} disabled={!canSubmit} />
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
  // Spec: content pad 6/16/4/16, gap 16. 6 is a literal in the frames (no spacing token).
  content: {
    flexGrow: 1,
    paddingTop: 6,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xs,
    gap: spacing.lg,
  },
  backHit: {
    width: 44,
    height: 44,
  },
  screenTitle: {
    ...typography.display,
    color: colors.text.primary,
  },
  welcomeSub: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  // 1.6s `sessionBanner`: plain text (mobile/secondary, text/primary), not a FormBanner.
  sessionBanner: {
    ...typography.secondary,
    color: colors.text.primary,
  },
  spacer: {
    flex: 1,
    minHeight: spacing.lg,
  },
  linkGroup: {
    alignItems: "flex-start",
  },
});
