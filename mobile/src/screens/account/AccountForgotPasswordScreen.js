/**
 * Forgot password, request (FR-ACC-10) — Afham.
 *
 * Prototype frames: 1.8 / 1.8e / 1.8v (both channels), 1.8rec1 (no verified email: an extra
 * "Neither of these works for me" link) and 1.8bnr (neither reachable: error banner, both
 * options marked, button becomes "Recover my account"). One screen, three states.
 *
 * Layout (all frames): Chrome/ScreenHeader "Forgot password", content pad 24/16/4/16 gap 16:
 * [banner], explainer, two RoleOption cards, link group, growing spacer, pinned ctaBar.
 *
 * The channels come from the server (getResetChannels): the SMS option is always offered, the
 * email option only when the account has a VERIFIED email (shown masked — this endpoint is
 * unauthenticated). The server answers an unknown number exactly like one with no email, so the
 * screen cannot tell them apart and neither can anyone typing numbers into it.
 *
 * Not drawn, built from the nearest frames: the person arrives without a number (the login
 * screen was left empty) → a PhoneField asks for it; the email link has no code step (the link
 * opens the reset page in the browser) → an Info banner says it was sent.
 */
import { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, BackHandler } from "react-native";
import { StatusBar } from "expo-status-bar";
import { colors, spacing, typography } from "../../theme/tokens";
import ScreenHeader from "../../components/ScreenHeader";
import FormBanner from "../../components/FormBanner";
import Button from "../../components/Button";
import RoleOption from "../../components/RoleOption";
import Link from "../../components/Link";
import CtaBar from "../../components/CtaBar";
import PhoneField from "../../components/PhoneField";
import { getResetChannels, requestPasswordReset } from "../../api/account";
import { COUNTRY_CODE, LOCAL_DIGITS, formatLocalNumber, toLocalDigits } from "./phoneFormat";

export default function AccountForgotPasswordScreen({ navigation, route }) {
  // The login screen passes whatever was typed; keep the nine local digits.
  const [localPhone, setLocalPhone] = useState(toLocalDigits(route.params?.phone));
  const phoneKnown = localPhone.length === LOCAL_DIGITS;
  const e164 = `${COUNTRY_CODE}${localPhone}`;

  const [maskedEmail, setMaskedEmail] = useState(null);
  const [channelsLoaded, setChannelsLoaded] = useState(false);
  const [selected, setSelected] = useState("PHONE");
  const [neither, setNeither] = useState(false); // 1.8bnr
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [emailSent, setEmailSent] = useState(false);

  // Look up the channels once there is a full number.
  useEffect(() => {
    if (!phoneKnown) return undefined;
    let cancelled = false;
    setChannelsLoaded(false);
    setError(null);
    getResetChannels({ phone: e164 })
      .then((result) => {
        if (cancelled) return;
        setMaskedEmail(result.emailVerified ? result.email : null);
        setSelected("PHONE");
        setChannelsLoaded(true);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, [phoneKnown, e164]);

  // 1.8bnr backs out to 1.8rec1, not off the screen.
  function goBack() {
    if (neither) setNeither(false);
    else navigation.goBack();
  }
  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      if (!neither) return false;
      setNeither(false);
      return true;
    });
    return () => sub.remove();
  }, [neither]);

  async function handleSubmit() {
    if (neither) {
      navigation.navigate("AccountRecoveryConfirm");
      return;
    }
    setSending(true);
    setError(null);
    setEmailSent(false);
    try {
      await requestPasswordReset({ phone: e164, channel: selected });
      if (selected === "PHONE") {
        navigation.navigate("AccountForgotPasswordCode", {
          phone: e164,
          destination: `${COUNTRY_CODE} ${formatLocalNumber(localPhone)}`,
        });
      } else {
        setEmailSent(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  const hasEmail = Boolean(maskedEmail);
  const helpTarget = () => navigation.navigate("HelpAccountAccess");

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScreenHeader title="Forgot password" onBack={goBack} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {neither ? (
          <FormBanner
            kind="error"
            message="We can't reach you by phone or email, so we can't reset your password automatically."
          />
        ) : null}
        {error ? <FormBanner kind="error" message={error} /> : null}
        {emailSent ? (
          <FormBanner kind="info" message={`We sent a reset link to ${maskedEmail}. Open it to choose a new password.`} />
        ) : null}

        {phoneKnown ? (
          <>
            <Text style={styles.explainer}>Choose where we should send your reset code.</Text>

            <RoleOption
              title="Text me a code"
              description={
                neither
                  ? `${COUNTRY_CODE} ${formatLocalNumber(localPhone)} — not reachable`
                  : `SMS to ${COUNTRY_CODE} ${formatLocalNumber(localPhone)}`
              }
              selected={selected === "PHONE"}
              onPress={() => setSelected("PHONE")}
            />
            <RoleOption
              title="Email me a link"
              description={hasEmail ? `To ${maskedEmail}` : "No verified email on this account"}
              selected={hasEmail && selected === "EMAIL"}
              onPress={() => hasEmail && setSelected("EMAIL")}
            />

            <View style={styles.linkGroup}>
              {channelsLoaded && !hasEmail && !neither ? (
                <Link title="Neither of these works for me" onPress={() => setNeither(true)} />
              ) : null}
              <Link title="Trouble getting in? Get help" onPress={helpTarget} />
            </View>
          </>
        ) : (
          <>
            <Text style={styles.explainer}>Enter the phone number on your account.</Text>
            <PhoneField value={localPhone} onChangeText={setLocalPhone} />
            <View style={styles.linkGroup}>
              <Link title="Trouble getting in? Get help" onPress={helpTarget} />
            </View>
          </>
        )}

        <View style={styles.spacer} />
      </ScrollView>

      <CtaBar>
        <Button
          title={neither ? "Recover my account" : "Send reset code"}
          onPress={handleSubmit}
          loading={sending}
          disabled={!phoneKnown || (!neither && !channelsLoaded)}
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
  explainer: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  linkGroup: {
    alignItems: "flex-start",
  },
  spacer: {
    flex: 1,
    minHeight: spacing.lg,
  },
});
