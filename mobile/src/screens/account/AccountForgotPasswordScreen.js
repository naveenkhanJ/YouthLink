/**
 * Forgot password, request (spec 1.8 / 1.8e / 1.8v / 1.8rec1 / 1.8bnr) — Afham.
 *
 * Layout per spec 1.8:
 *  - Chrome/ScreenHeader title "Forgot password"
 *  - TEXT "Choose where we should send your reset code." (secondary)
 *  - Two RoleOption cards (SMS / Email)
 *  - linkGroup: "Neither of these works for me" (conditional) / "Trouble getting in? Get help"
 *  - SPACER grows
 *  - ctaBar: Button "Send reset code" / "Recover my account" (1.8bnr)
 *
 * The FormBanner (error) only appears on the 1.8bnr state.
 */
import { useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { colors, spacing, typography } from "../../theme/tokens";
import ScreenHeader from "../../components/ScreenHeader";
import FormBanner from "../../components/FormBanner";
import Button from "../../components/Button";
import RoleOption from "../../components/RoleOption";
import Link from "../../components/Link";
import CtaBar from "../../components/CtaBar";
import { requestPasswordReset } from "../../api/account";
import { parseApiError } from "../../api/client";

export default function AccountForgotPasswordScreen({ navigation, route }) {
  // `phone` and `email` come from navigation params or API mock
  const phone = route.params?.phone || "+94 77 123 4567";
  const email = route.params?.email || "kavindu@example.com";
  
  // States: "sms", "email"
  const [selectedChannel, setSelectedChannel] = useState("sms");
  const [loading, setLoading] = useState(false);

  // Is this the "neither channel works" scenario?
  const isEmailMissing = !email || email === "";
  const isPhoneUnreachable = route.params?.phoneUnreachable || false;
  
  // 1.8bnr: Neither channel reachable
  const isNeitherReachable = isPhoneUnreachable && isEmailMissing;

  async function handleSendResetCode() {
    if (isNeitherReachable) {
      // Leads to 1.8rec2
      navigation.navigate("AccountRecoveryConfirm", { identifier: phone });
      return;
    }
    
    // Proceed to OTP screen
    setLoading(true);
    try {
      const destination = selectedChannel === "sms" ? phone : email;
      const backendChannel = selectedChannel === "sms" ? "PHONE" : "EMAIL";
      await requestPasswordReset({ phone, channel: backendChannel });
      navigation.navigate("AccountForgotPasswordCode", {
        channel: selectedChannel,
        destination,
        phone,
      });
    } catch (err) {
      const { formError } = parseApiError(err);
      // In a full app, we'd display formError, but the spec doesn't show a banner here.
      console.warn("Password reset request failed", formError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.flex}>
      <StatusBar style="dark" />
      <ScreenHeader title="Forgot password" onBack={() => navigation.goBack()} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {isNeitherReachable && (
          <FormBanner
            kind="Error"
            message="We can't reach you by phone or email, so we can't reset your password automatically."
          />
        )}

        <Text style={styles.explainer}>
          Choose where we should send your reset code.
        </Text>

        <RoleOption
          title="Text me a code"
          description={isPhoneUnreachable ? `${phone} — not reachable` : `SMS to ${phone}`}
          selected={selectedChannel === "sms" && !isPhoneUnreachable}
          onPress={() => !isPhoneUnreachable && setSelectedChannel("sms")}
        />

        <RoleOption
          title="Email me a link"
          description={isEmailMissing ? "No verified email on this account" : `To ${email}`}
          selected={selectedChannel === "email" && !isEmailMissing}
          onPress={() => !isEmailMissing && setSelectedChannel("email")}
        />

        {/* linkGroup — "Neither of these works for me" appears only when
            there is no working email but phone IS still reachable (1.8rec1).
            On 1.8bnr (neither reachable) it disappears and the button changes.
        */}
        <View style={styles.linkGroup}>
          {isEmailMissing && !isNeitherReachable && (
            <Link
              title="Neither of these works for me"
              onPress={() => navigation.setParams({ phoneUnreachable: true })}
            />
          )}
          <Link
            title="Trouble getting in? Get help"
            onPress={() => console.log("HF.5 — not yet built")}
          />
        </View>

        <View style={styles.spacer} />
      </ScrollView>

      <CtaBar>
        <Button
          title={isNeitherReachable ? "Recover my account" : "Send reset code"}
          onPress={handleSendResetCode}
          loading={loading}
          disabled={!selectedChannel && !isNeitherReachable}
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
    paddingTop: spacing.xl,           // 24px — spec: vertical pad 24/16/4/16
    paddingBottom: spacing.xs,
    gap: spacing.lg,                  // 16px between children
  },
  explainer: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  linkGroup: {
    gap: 0,
    alignItems: "flex-start",
  },
  spacer: {
    flex: 1,
    minHeight: spacing.xxl,
  },
});
