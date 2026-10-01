/**
 * Display name (prototype 1.15 / 1.15ed / 1.15eg / 1.15n / 1.15v; FR-ACC-15) — Afham.
 *
 * Every role's copy is the same screen showing the signed-in person's own name (the display
 * name IS the legal name, FR-PROF-01). Layout: Chrome/ScreenHeader "Display name", content pad
 * 24/16/4/16 gap 16: one TextField "Display name" (filled), growing spacer, ctaBar "Save".
 * Input stops at the 100-character cap and the field counts "N / 100" from 90 (the same
 * behaviour as the legal-name field at registration, 1.4cnt).
 *
 * Low ceremony by design (FR-ACC-15, like the NIC correction): no password or code. Saving
 * writes the new name to the stored user so every screen that shows it updates, then returns to
 * Settings. The employer's separate business name (1.15eb) is a different screen and card.
 */
import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { StatusBar } from "expo-status-bar";
import { colors, spacing } from "../../theme/tokens";
import ScreenHeader from "../../components/ScreenHeader";
import Button from "../../components/Button";
import TextField from "../../components/TextField";
import FieldError from "../../components/FieldError";
import FormBanner from "../../components/FormBanner";
import CtaBar from "../../components/CtaBar";
import { useAuth } from "../../auth/AuthContext";
import { updateDisplayName } from "../../api/account";

const NAME_CAP = 100;
const REQUIRED_MESSAGE = "Enter your full legal name.";

export default function AccountDisplayNameScreen({ navigation }) {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.legalName ?? "");
  const [fieldError, setFieldError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    setFormError(null);
    if (!name.trim()) {
      setFieldError(REQUIRED_MESSAGE);
      return;
    }
    setFieldError(null);
    setLoading(true);
    try {
      const { legalName } = await updateDisplayName({ legalName: name });
      await updateUser({ legalName });
      navigation.goBack(); // 1.15 leads back to Settings
    } catch (err) {
      if (err.fields?.legalName) setFieldError(REQUIRED_MESSAGE);
      else setFormError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScreenHeader title="Display name" onBack={() => navigation.goBack()} />

      <KeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={120}
      >
        {formError ? <FormBanner kind="error" message={formError} /> : null}
        <TextField
          label="Display name"
          value={name}
          onChangeText={(value) => {
            setName(value);
            setFieldError(null);
          }}
          autoCapitalize="words"
          maxLength={NAME_CAP}
          showCounter
          error={Boolean(fieldError)}
        />
        <FieldError message={fieldError} />
        <View style={styles.spacer} />
      </KeyboardAwareScrollView>

      <CtaBar>
        <Button title="Save" onPress={handleSave} loading={loading} disabled={!name.trim()} />
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
  spacer: {
    flex: 1,
    minHeight: spacing.lg,
  },
});
