/**
 * Phone number change (spec 1.12 / 1.12err) — Afham.
 *
 * Layout:
 *  - Chrome/ScreenHeader title "Change phone number"
 *  - TextField "Password" (secure)
 *  - PhoneField "New phone number"
 *  - TEXT "Your current number stays active until the new one is verified."
 *  - SPACER
 *  - ctaBar: Button "Send code to new number"
 */
import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { StatusBar } from "expo-status-bar";
import { colors, spacing, typography } from "../../theme/tokens";
import ScreenHeader from "../../components/ScreenHeader";
import Button from "../../components/Button";
import TextField from "../../components/TextField";
import PhoneField from "../../components/PhoneField";
import CtaBar from "../../components/CtaBar";
import { LOCAL_DIGITS } from "./phoneFormat";
// API functions will be imported here when backend is wired, e.g. verifyPassword, sendOtp

export default function AccountPhoneChangeScreen({ navigation }) {
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Used for testing 1.12err state

  async function handleSendCode() {
    // Basic mock implementation for UI review
    if (password !== "correct") {
      setError("That password doesn't match your account. Please try again.");
      return;
    }
    setError(null);
    setLoading(true);
    // TODO: Wire up actual password verification and OTP sending
    setTimeout(() => {
      setLoading(false);
      // navigation.navigate("AccountPhoneChangeConfirm", { newPhone: phone }) // Next step
    }, 1000);
  }

  const canSubmit = password.length > 0 && phone.length === LOCAL_DIGITS;

  return (
    <View style={styles.flex}>
      <StatusBar style="dark" />
      <ScreenHeader title="Change phone number" onBack={() => navigation.goBack()} />

      <KeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={120}
      >
        <TextField
          label="Password"
          value={password}
          onChangeText={(val) => {
            setPassword(val);
            if (error) setError(null);
          }}
          secureTextEntry
          placeholder="••••••••••"
          error={error}
        />
        
        <PhoneField
          label="New phone number"
          value={phone}
          onChangeText={setPhone}
        />

        <Text style={styles.note}>
          Your current number stays active until the new one is verified.
        </Text>

        <View style={styles.spacer} />
      </KeyboardAwareScrollView>

      <CtaBar>
        <Button
          title="Send code to new number"
          onPress={handleSendCode}
          loading={loading}
          disabled={!canSubmit}
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
  note: {
    ...typography.secondary,
    color: colors.text.secondary,
    marginTop: -spacing.sm, // closer to the phone field
  },
  spacer: {
    flex: 1,
    minHeight: spacing.xxl,
  },
});
