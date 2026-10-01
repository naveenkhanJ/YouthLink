/**
 * NIC correction (prototype 1.13; FR-ACC-13) — Afham.
 *
 * Figma 1.13: Chrome/ScreenHeader "Correct NIC", content pad 24/16/4/16 gap 16: Password
 * (Secure), NIC (placeholder "Enter your NIC"), the help line, growing spacer, ctaBar "Save NIC".
 * The form opens empty and shows nobody's data — the current NIC is on Settings, masked to its
 * last four — and Save NIC is Disabled until something is typed.
 *
 * Low ceremony by design (FR-ACC-13): the password is the only gate, no code. Only the shape is
 * checked, never a registry. A wrong password is a field error on the password field (the same
 * sentence 1.12err draws); a NIC already on another account uses the sentence 1.4err1 draws.
 * Saving writes the new last four to the stored user, so Settings shows it, and returns there.
 */
import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { StatusBar } from "expo-status-bar";
import { colors, spacing, typography } from "../../theme/tokens";
import ScreenHeader from "../../components/ScreenHeader";
import Button from "../../components/Button";
import TextField from "../../components/TextField";
import FieldError from "../../components/FieldError";
import FormBanner from "../../components/FormBanner";
import CtaBar from "../../components/CtaBar";
import { useAuth } from "../../auth/AuthContext";
import { changeNic } from "../../api/account";

const NIC_SHAPE = /^(\d{12}|\d{9}[VvXx])$/;
const WRONG_PASSWORD_MESSAGE = "That password doesn't match your account. Please try again.";
const NIC_TAKEN_MESSAGE =
  "This NIC is already registered. You can log in instead, or check the number for a typo.";
const NIC_SHAPE_MESSAGE = "A NIC is 12 digits, or 9 digits followed by V or X.";

export default function AccountNicScreen({ navigation }) {
  const { updateUser } = useAuth();
  const [password, setPassword] = useState("");
  const [nic, setNic] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    setFormError(null);
    if (!NIC_SHAPE.test(nic.trim())) {
      setFieldErrors({ nic: NIC_SHAPE_MESSAGE });
      return;
    }
    setFieldErrors({});
    setLoading(true);
    try {
      const { nicLast4 } = await changeNic({ password, nic: nic.trim() });
      await updateUser({ nicLast4 });
      navigation.goBack(); // 1.13 exits to Settings
    } catch (err) {
      if (err.fields?.password) setFieldErrors({ password: WRONG_PASSWORD_MESSAGE });
      else if (err.fields?.nic) setFieldErrors({ nic: err.status === 409 ? NIC_TAKEN_MESSAGE : NIC_SHAPE_MESSAGE });
      else setFormError(err.message); // rate limit, offline
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScreenHeader title="Correct NIC" onBack={() => navigation.goBack()} />

      <KeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={120}
      >
        {formError ? <FormBanner kind="error" message={formError} /> : null}

        <TextField
          label="Password"
          value={password}
          onChangeText={(value) => {
            setPassword(value);
            setFieldErrors((prev) => ({ ...prev, password: undefined }));
          }}
          secureTextEntry
          placeholder="8–64 characters"
          maxLength={64}
          error={Boolean(fieldErrors.password)}
        />
        <FieldError message={fieldErrors.password} />

        <TextField
          label="NIC"
          value={nic}
          onChangeText={(value) => {
            setNic(value);
            setFieldErrors((prev) => ({ ...prev, nic: undefined }));
          }}
          placeholder="Enter your NIC"
          autoCapitalize="characters"
          maxLength={12}
          error={Boolean(fieldErrors.nic)}
        />
        <FieldError message={fieldErrors.nic} />

        <Text style={styles.help}>
          12 digits, or 9 digits followed by V or X. Stored as entered — only the shape is checked, never a registry.
        </Text>

        <View style={styles.spacer} />
      </KeyboardAwareScrollView>

      <CtaBar>
        <Button title="Save NIC" onPress={handleSave} loading={loading} disabled={!password || !nic} />
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
  // Figma: content pad 24/16/4/16, gap 16.
  content: {
    flexGrow: 1,
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xs,
    gap: spacing.lg,
  },
  help: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  spacer: {
    flex: 1,
    minHeight: spacing.lg,
  },
});
