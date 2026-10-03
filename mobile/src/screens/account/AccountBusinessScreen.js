/**
 * Business name & bio (prototype 1.15eb; FR-ACC-02) — Afham.
 *
 * Figma: Chrome/ScreenHeader "Business name & bio", content pad 24/16/4/16 gap 16: Business name
 * (TextField), the label "Business bio (optional)", the bio TextArea, its counter ("72 / 300",
 * right-aligned caption), the helper "Shown on your profile and on your postings.", ctaBar "Save".
 *
 * Only an employer who posts as Business has this row in Settings. Saving keeps the account on
 * Business and replaces the name and bio; postings already published keep what they were posted
 * with.
 */
import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { StatusBar } from "expo-status-bar";
import { colors, spacing, typography } from "../../theme/tokens";
import ScreenHeader from "../../components/ScreenHeader";
import Button from "../../components/Button";
import TextField from "../../components/TextField";
import TextArea from "../../components/TextArea";
import FieldError from "../../components/FieldError";
import FormBanner from "../../components/FormBanner";
import CtaBar from "../../components/CtaBar";
import { useAuth } from "../../auth/AuthContext";
import { updatePostingAs } from "../../api/account";

const NAME_CAP = 100;
const BIO_CAP = 300;
const NAME_REQUIRED_MESSAGE = "Enter your business name.";

export default function AccountBusinessScreen({ navigation }) {
  const { user, updateUser } = useAuth();
  const [businessName, setBusinessName] = useState(user?.businessName ?? "");
  const [businessBio, setBusinessBio] = useState(user?.businessBio ?? "");
  const [nameError, setNameError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    setFormError(null);
    setNameError(null);
    setLoading(true);
    try {
      const saved = await updatePostingAs({
        postingAsType: "BUSINESS",
        businessName: businessName.trim(),
        businessBio: businessBio.trim(),
      });
      await updateUser(saved);
      navigation.goBack(); // 1.15eb leads back to Settings
    } catch (err) {
      if (err.fields?.businessName) setNameError(NAME_REQUIRED_MESSAGE);
      else setFormError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScreenHeader title="Business name & bio" onBack={() => navigation.goBack()} />

      <KeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={120}
      >
        {formError ? <FormBanner kind="error" message={formError} /> : null}

        <TextField
          label="Business name"
          value={businessName}
          onChangeText={(value) => {
            setBusinessName(value);
            setNameError(null);
          }}
          autoCapitalize="words"
          maxLength={NAME_CAP}
          error={Boolean(nameError)}
        />
        <FieldError message={nameError} />

        <Text style={styles.label}>Business bio (optional)</Text>
        <TextArea value={businessBio} onChangeText={setBusinessBio} maxLength={BIO_CAP} />
        <Text style={styles.counter}>
          {businessBio.length} / {BIO_CAP}
        </Text>
        <Text style={styles.helper}>Shown on your profile and on your postings.</Text>

        <View style={styles.spacer} />
      </KeyboardAwareScrollView>

      <CtaBar>
        <Button title="Save" onPress={handleSave} loading={loading} disabled={!businessName.trim()} />
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
  // Figma 1.15eb: the label, the bio field, the counter and the helper are ordinary gap-16
  // children of the content (y = 112, 148, 262, 294); the counter hugs its text at the left.
  label: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  counter: {
    ...typography.caption,
    color: colors.text.secondary,
    alignSelf: "flex-start",
  },
  helper: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  spacer: {
    flex: 1,
    minHeight: spacing.lg,
  },
});
