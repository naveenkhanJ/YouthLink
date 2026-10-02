/**
 * Posting-as change (prototype 1.16 / 1.16b; FR-ACC-16, FR-ACC-02) — Afham.
 *
 * Figma: Chrome/ScreenHeader "Posting as", content pad 24/16/4/16 gap 16, SegmentedControl
 * (Individual/Household · Business), then:
 *   Individual selected (1.16)   the note "Switching from Business clears your business name and
 *                                bio. Past postings keep the details they were posted with."
 *   Business selected (1.16b)    Business name and Business bio (optional) fields (empty when
 *                                switching in; the saved values when already Business) and the
 *                                note "Switching to Business shows the business name and bio on
 *                                your profile and your postings. Postings you've already
 *                                published keep the name they were posted under."
 * ctaBar "Save", Disabled while Business is chosen without a name (1.16b).
 *
 * Only the account changes: postings already published keep what they were posted with.
 */
import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { StatusBar } from "expo-status-bar";
import { colors, spacing, typography } from "../../theme/tokens";
import ScreenHeader from "../../components/ScreenHeader";
import Button from "../../components/Button";
import TextField from "../../components/TextField";
import SegmentedControl from "../../components/SegmentedControl";
import FieldError from "../../components/FieldError";
import FormBanner from "../../components/FormBanner";
import CtaBar from "../../components/CtaBar";
import { useAuth } from "../../auth/AuthContext";
import { updatePostingAs } from "../../api/account";

const NAME_CAP = 100;
const BIO_CAP = 300;
const NAME_REQUIRED_MESSAGE = "Enter your business name.";

export default function AccountPostingAsScreen({ navigation }) {
  const { user, updateUser } = useAuth();
  const [selected, setSelected] = useState(user?.postingAsType === "BUSINESS" ? "business" : "individual");
  const [businessName, setBusinessName] = useState(user?.businessName ?? "");
  const [businessBio, setBusinessBio] = useState(user?.businessBio ?? "");
  const [nameError, setNameError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);

  const business = selected === "business";

  async function handleSave() {
    setFormError(null);
    setNameError(null);
    setLoading(true);
    try {
      const saved = await updatePostingAs(
        business
          ? { postingAsType: "BUSINESS", businessName: businessName.trim(), businessBio: businessBio.trim() }
          : { postingAsType: "INDIVIDUAL" },
      );
      await updateUser(saved);
      navigation.goBack(); // 1.16 leads back to Settings
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
      <ScreenHeader title="Posting as" onBack={() => navigation.goBack()} />

      <KeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={120}
      >
        {formError ? <FormBanner kind="error" message={formError} /> : null}

        <SegmentedControl selected={selected} onChange={setSelected} />

        {business ? (
          <>
            <TextField
              label="Business name"
              value={businessName}
              onChangeText={(value) => {
                setBusinessName(value);
                setNameError(null);
              }}
              placeholder="Enter your business name"
              autoCapitalize="words"
              maxLength={NAME_CAP}
              error={Boolean(nameError)}
            />
            <FieldError message={nameError} />
            <TextField
              label="Business bio (optional)"
              value={businessBio}
              onChangeText={setBusinessBio}
              placeholder="What your business does (optional)"
              autoCapitalize="sentences"
              maxLength={BIO_CAP}
            />
            <Text style={styles.note}>
              Switching to Business shows the business name and bio on your profile and your postings. Postings
              you've already published keep the name they were posted under.
            </Text>
          </>
        ) : (
          <Text style={styles.note}>
            Switching from Business clears your business name and bio. Past postings keep the details they were
            posted with.
          </Text>
        )}

        <View style={styles.spacer} />
      </KeyboardAwareScrollView>

      <CtaBar>
        <Button title="Save" onPress={handleSave} loading={loading} disabled={business && !businessName.trim()} />
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
  note: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  spacer: {
    flex: 1,
    minHeight: spacing.lg,
  },
});
