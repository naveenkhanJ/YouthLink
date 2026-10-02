/**
 * Login, OTP path — Afham.
 *
 * Prototype frames: 1.7 (code entered), 1.7sus (account suspended); the employer and verifier
 * copies (1.7e, 1.7v) are the same screen. Reached from LoginScreen's "Log in with a code
 * instead", and the way out of a password lockout (FR-ACC-09 E7).
 *
 * Layout: content pad 6/16/4/16, gap 16 — back target, "Welcome back", welcomeSub, "Code
 * login", PhoneField, 6-box CodeInputNumeric, the resend countdown or link, a growing
 * spacer, the link group — and a pinned ctaBar.
 *
 * The drawn frame is the "code sent" state. Before a code exists the screen shows only the
 * phone field and a "Send code" button (that state is composed, not drawn). Editing the
 * number after a code was sent drops that code, so there is no separate "Change number" link
 * (the prototype's 1.7 has none).
 *
 * Phone verification itself is the shared usePhoneVerification hook; the Firebase ID token it
 * produces is exchanged for a YouthLink session at POST /login/otp.
 */
import { useEffect, useRef, useState } from "react";
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
import FieldError from "../../components/FieldError";
import FormBanner from "../../components/FormBanner";
import CtaBar from "../../components/CtaBar";
import BackButton from "./components/BackButton";
import usePhoneVerification from "./hooks/usePhoneVerification";
import { LOCAL_DIGITS } from "./phoneFormat";

/** 47 seconds -> "0:47", as the drawn countdown reads. */
function formatCooldown(seconds) {
  return `Resend in ${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

export default function AccountLoginOtpScreen({ navigation }) {
  const { signIn } = useAuth();
  const insets = useSafeAreaInsets();
  const [suspendedMessage, setSuspendedMessage] = useState(null);

  const scrollRef = useRef(null);

  const verification = usePhoneVerification();
  const {
    phone,
    editPhone,
    confirmationResult,
    code,
    setCode,
    error,
    sendingCode,
    confirmingCode,
    resendCooldown,
    sendCode,
    confirmCode,
    codeExpired,
  } = verification;

  // With the keyboard open the code error sits just under the pinned bar. When one appears, scroll
  // to the end of the content so the error and the links below it are in view.
  useEffect(() => {
    if (!error || !confirmationResult) return undefined;
    const timer = setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 150);
    return () => clearTimeout(timer);
  }, [error, confirmationResult]);

  async function handleConfirmCode() {
    await confirmCode(async (idToken) => {
      try {
        const { token, user } = await loginOtp({ idToken });
        await signIn(token, user);
        navigation.reset({ index: 0, routes: [{ name: "Home" }] });
      } catch (err) {
        // 403 here is only ever "suspended" (1.7sus): shown as the drawn banner, with the
        // inputs and button disabled, rather than as a line under the code boxes.
        if (err.status === 403) {
          setSuspendedMessage(err.message);
          return;
        }
        throw err;
      }
    });
  }

  const codeSent = Boolean(confirmationResult);
  const suspended = Boolean(suspendedMessage);
  const helpTarget = () => navigation.navigate("HelpAccountAccess");

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <BackButton onPress={() => navigation.goBack()} />

        <Text style={styles.screenTitle}>Welcome back</Text>
        <Text style={styles.welcomeSub}>We'll text you a one-time code to log in.</Text>
        <Text style={styles.sub}>Code login</Text>

        {suspended ? <FormBanner kind="error" message={suspendedMessage} /> : null}

        <PhoneField
          value={phone}
          onChangeText={editPhone}
          error={!codeSent && Boolean(error)}
          editable={!suspended}
        />
        {!codeSent && error ? <FieldError message={error} /> : null}

        {codeSent ? (
          <>
            <CodeInputNumeric value={code} onChangeText={setCode} error={Boolean(error)} />
            {error ? <FieldError message={error} /> : null}

            {resendCooldown > 0 ? (
              <CountdownText text={formatCooldown(resendCooldown)} />
            ) : (
              <Link title="Resend code" onPress={sendCode} />
            )}
          </>
        ) : null}

        <View style={styles.spacer} />

        <View style={styles.linkGroup}>
          {suspended ? (
            <Link title="What suspension means" onPress={helpTarget} />
          ) : (
            <>
              <Link title="Use password instead" onPress={() => navigation.goBack()} />
              <Link title="Trouble getting in? Get help" onPress={helpTarget} />
            </>
          )}
        </View>
      </ScrollView>

      <CtaBar>
        {codeSent ? (
          <Button
            title="Log in"
            onPress={handleConfirmCode}
            loading={confirmingCode}
            disabled={suspended || code.length !== 6 || codeExpired}
          />
        ) : (
          <Button
            title="Send code"
            onPress={sendCode}
            loading={sendingCode}
            disabled={phone.length !== LOCAL_DIGITS}
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
  // Spec: content pad 6/16/4/16, gap 16 (6 is a literal in the frames, not a spacing token).
  content: {
    flexGrow: 1,
    paddingTop: 6,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xs,
    gap: spacing.lg,
  },
  screenTitle: {
    ...typography.display,
    color: colors.text.primary,
  },
  welcomeSub: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  sub: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  spacer: {
    flex: 1,
    minHeight: spacing.lg,
  },
  linkGroup: {
    alignItems: "flex-start",
  },
});
