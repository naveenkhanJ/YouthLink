/**
 * Login screen — password path (spec 1.6emp / 1.6) — Afham.
 *
 * This is the PASSWORD path only. The OTP path (spec 1.7) is a separate
 * screen; the user reaches it via "Log in with a code instead" link here.
 * The spec explicitly has two separate screens connected by a link — NOT a
 * tab switcher on one screen.
 *
 * Layout per spec:
 *  - No ScreenHeader chrome — a bare backHit 44x44 only
 *  - TEXT "Welcome back" (mobile/display)
 *  - TEXT subtitle (mobile/caption, secondary colour)
 *  - PhoneField + password TextField
 *  - SPACER (grows to push link group down)
 *  - linkGroup: "Log in with a code instead" / "Forgot password?" / "Trouble getting in? Get help"
 *  - ctaBar (pinned): Button "Log in" (disabled until both fields filled)
 *
 * A successful login hands the token/user to AuthContext's signIn()
 * (persists to SecureStore) and resets the stack back to Home.
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
import CtaBar from "../../components/CtaBar";
import BackButton from "./components/BackButton";
import { COUNTRY_CODE, LOCAL_DIGITS } from "./phoneFormat";

export default function LoginScreen({ navigation }) {
  const { signIn, sessionEndReason } = useAuth();
  const insets = useSafeAreaInsets();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Log in only becomes enabled once both fields have content — spec 1.6emp
  // shows the button disabled, 1.6 shows it enabled.
  const canSubmit = phone.length === LOCAL_DIGITS && password.length > 0;

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
      const { formError, fieldErrors } = parseApiError(err);
      setFormError(formError);
      setFieldErrors(fieldErrors);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      {/* Content — scrollable, grows to push link group down */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Bare 44×44 back hit — no ScreenHeader chrome per spec 1.6 */}
        <BackButton onPress={() => navigation.goBack()} />

        <Text style={styles.screenTitle}>Welcome back</Text>

        {/* Subtitle changes depending on whether this is the first visit or a
            return after signing out. sessionEndReason comes from AuthContext
            and is set when the backend rejects a request mid-session; if it's
            present we show it as a FormBanner instead of the static subtitle. */}
        {sessionEndReason ? (
          <View style={styles.bannerWrap}>
            <FormBanner kind="Info" message={sessionEndReason} />
          </View>
        ) : (
          <Text style={styles.welcomeSub}>
            Log in to pick up where you left off.
          </Text>
        )}

        <PhoneField value={phone} onChangeText={setPhone} error={fieldErrors.phone} />

        <TextField
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="8–64 characters"
          secureTextEntry
          error={fieldErrors.password}
        />

        {formError ? (
          <View style={styles.formBannerWrap}>
            <FormBanner kind="Error" message={formError} />
          </View>
        ) : null}

        {/* Grows to push the link group toward the ctaBar */}
        <View style={styles.spacer} />

        {/* linkGroup — stacked links, no gap/border, left-aligned */}
        <View style={styles.linkGroup}>
          <Link
            title="Log in with a code instead"
            onPress={() => navigation.navigate("AccountLoginOtp")}
          />
          <Link
            title="Forgot password?"
            onPress={() => navigation.navigate("AccountForgotPassword", { phone })}
          />
          <Link
            title="Trouble getting in? Get help"
            onPress={() => console.log("HF.5 — not yet built")}
          />
        </View>
      </ScrollView>

      {/* Pinned ctaBar — elevation.bar shadow only applied when content scrolls */}
      <CtaBar>
        <Button
          title="Log in"
          onPress={handleSubmit}
          loading={loading}
          disabled={!canSubmit}
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
  content: {
    flexGrow: 1,
    paddingTop: spacing.sm,             // 6px top — spec: vertical pad 6/16/4/16
    paddingHorizontal: spacing.lg,      // 16px sides
    paddingBottom: spacing.xs,          // 4px bottom before link group
  },
  screenTitle: {
    ...typography.display,
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  welcomeSub: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  bannerWrap: {
    marginBottom: spacing.lg,
  },
  formBannerWrap: {
    marginTop: spacing.md,
  },
  spacer: {
    flex: 1,
    minHeight: spacing.xxl,
  },
  linkGroup: {
    gap: 0,                             // Action/Link has its own 10px h-padding
    marginBottom: spacing.xs,           // 4px before ctaBar
    alignItems: "flex-start",
  },
});
