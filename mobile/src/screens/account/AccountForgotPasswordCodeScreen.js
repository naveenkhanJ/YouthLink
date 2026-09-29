/**
 * Forgot password, enter reset code (spec 1.10 / 1.10e) — Afham.
 *
 * Layout per spec 1.10:
 *  - Chrome/ScreenHeader title "Forgot password"
 *  - TEXT "We sent a 6-digit code to [destination]." (secondary)
 *  - Input/CodeInputNumeric (6 boxes)
 *  - FormBanner {Kind=Error} — appears on wrong/expired code
 *  - linkGroup: "Resend code" / "Change number" (SMS path only)
 *  - SPACER
 *  - ctaBar: Button "Verify"
 */
import { useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { colors, spacing, typography } from "../../theme/tokens";
import ScreenHeader from "../../components/ScreenHeader";
import FormBanner from "../../components/FormBanner";
import Button from "../../components/Button";
import CodeInputNumeric from "../../components/CodeInputNumeric";
import Link from "../../components/Link";
import CtaBar from "../../components/CtaBar";
import { verifyPasswordResetOtp } from "../../api/account";
import { parseApiError } from "../../api/client";

export default function AccountForgotPasswordCodeScreen({ navigation, route }) {
  const { channel, destination, identifier } = route.params || {};
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleVerifyCode() {
    setLoading(true);
    setError(null);
    try {
      const response = await verifyPasswordResetOtp({ identifier, code });
      navigation.navigate("AccountResetPassword", { token: response.token });
    } catch (err) {
      const { formError } = parseApiError(err);
      setError(formError || "That code doesn't match. Check the 6 digits and try again.");
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
        <Text style={styles.sentTo}>
          We sent a 6-digit code to {destination}.
        </Text>

        <CodeInputNumeric
          value={code}
          onChangeText={setCode}
          error={error ? "error" : undefined}
          autoFocus
        />

        {error ? (
          <FormBanner kind="Error" message={error} />
        ) : null}

        <View style={styles.linkGroup}>
          <Link
            title="Resend code"
            onPress={() => console.log("Resend code — not yet implemented")}
          />
          {channel === "sms" && (
            <Link
              title="Change number"
              onPress={() => navigation.goBack()}
            />
          )}
        </View>

        <View style={styles.spacer} />
      </ScrollView>

      <CtaBar>
        <Button
          title="Verify"
          onPress={handleVerifyCode}
          loading={loading}
          disabled={code.length < 6}
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
    paddingTop: spacing.xl,
    paddingBottom: spacing.xs,
    gap: spacing.lg,
  },
  sentTo: {
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
