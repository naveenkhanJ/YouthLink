/**
 * Account recovery, identity confirmation (spec 1.8rec2) — Afham.
 *
 * Layout per spec:
 *  - Chrome/ScreenHeader title "Recover your account"
 *  - TEXT explainer (mobile/secondary, secondary colour)
 *  - Input/TextField NIC + NIC help caption
 *  - Input/DateTimeField Birthdate
 *  - Input/TextField Legal name
 *  - TEXT outcome note (mobile/secondary, secondary colour)
 *  - SPACER
 *  - ctaBar: Button "Submit request"
 */
import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { StatusBar } from "expo-status-bar";
import { colors, spacing, typography } from "../../theme/tokens";
import ScreenHeader from "../../components/ScreenHeader";
import Button from "../../components/Button";
import TextField from "../../components/TextField";
import DateTimeField from "../../components/DateTimeField";
import CtaBar from "../../components/CtaBar";
import { requestAccountRecovery } from "../../api/account";
import { parseApiError } from "../../api/client";

export default function AccountRecoveryConfirmScreen({ navigation, route }) {
  const { identifier } = route.params || {};
  const [nic, setNic] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  async function handleSubmitRequest() {
    setLoading(true);
    setFormError(null);
    setFieldErrors({});
    try {
      await requestAccountRecovery({
        nic,
        birthdate,
        legalName: name,
        deviceId: "dummy-device-id",
      });
      // Lead to 1.8rec3
      navigation.navigate("AccountRecoveryStatus", { status: "pending" });
    } catch (err) {
      const { formError, fieldErrors } = parseApiError(err);
      setFormError(formError);
      setFieldErrors(fieldErrors);
    } finally {
      setLoading(false);
    }
  }

  const canSubmit = nic.length > 0 && birthdate.length > 0 && name.length > 0;

  return (
    <View style={styles.flex}>
      <StatusBar style="dark" />
      <ScreenHeader title="Recover your account" onBack={() => navigation.goBack()} />

      <KeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={120}
      >
        <Text style={styles.explainer}>
          Confirm the details on the account. An admin reviews every request — this isn't instant.
        </Text>

        {formError ? <Text style={styles.formErrorText}>{formError}</Text> : null}

        <TextField
          label="NIC"
          value={nic}
          onChangeText={setNic}
          placeholder="200412345678"
          error={fieldErrors.nic}
        />
        <Text style={styles.nicHelp}>
          12 digits, or 9 digits + V or X — only the shape is checked.
        </Text>

        <DateTimeField
          label="Birthdate"
          value={birthdate}
          onPress={() => setBirthdate("2001-03-08")}
        />

        <TextField
          label="Legal name"
          value={name}
          onChangeText={setName}
          placeholder="Nethmi Jayasinghe"
          error={fieldErrors.legalName}
        />

        <Text style={styles.outcomeNote}>
          We'll show the outcome here when it's been reviewed. Keep the app installed on this device.
        </Text>

        <View style={styles.spacer} />
      </KeyboardAwareScrollView>

      <CtaBar>
        <Button
          title="Submit request"
          onPress={handleSubmitRequest}
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
    paddingTop: spacing.xl,       // 24px
    paddingBottom: spacing.xs,
    gap: spacing.lg,              // 16px between children
  },
  explainer: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  formErrorText: {
    ...typography.caption,
    color: colors.state.danger,
  },
  nicHelp: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: -spacing.md,       // close the gap
  },
  outcomeNote: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  spacer: {
    flex: 1,
    minHeight: spacing.xxl,
  },
});
