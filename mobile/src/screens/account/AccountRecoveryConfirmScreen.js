/**
 * Account recovery, confirm your identity (prototype 1.8rec2; FR-ACC-10 E8) — Afham.
 *
 * Reached from 1.8bnr when neither the phone nor an email can reach the person. They confirm the
 * details on the account; an Admin compares them on the dashboard and approves or rejects.
 *
 * Layout: the registration-style top bar (back ← history, ✕ → login, 8px bottom padding), the
 * display title "Recover your account", content pad 6/16/0/16 gap 8: explainer, NIC + shape
 * help, Birthdate, Legal name, outcome note, growing spacer, ctaBar "Submit request".
 *
 * The request is tied to this device by a random id kept in SecureStore (recoveryDevice.js), so
 * the answer can be shown here later without any login. If this device already has an open
 * request the person is taken straight to its status instead of being asked again.
 */
import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing, typography } from "../../theme/tokens";
import Button from "../../components/Button";
import TextField from "../../components/TextField";
import DateTimeField from "../../components/DateTimeField";
import FieldError from "../../components/FieldError";
import FormBanner from "../../components/FormBanner";
import CtaBar from "../../components/CtaBar";
import BackButton from "./components/BackButton";
import CloseButton from "./components/CloseButton";
import { requestAccountRecovery, getRecoveryStatus } from "../../api/account";
import { getRecoveryDeviceId, peekRecoveryDeviceId } from "./recoveryDevice";

const NIC_SHAPE = /^(\d{12}|\d{9}[VvXx])$/;
const NIC_MESSAGE = "A NIC is 12 digits, or 9 digits followed by V or X.";
const BIRTHDATE_MESSAGE = "Enter your birthdate as YYYY-MM-DD.";
const NAME_MESSAGE = "Enter your full legal name.";

function isValidDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

export default function AccountRecoveryConfirmScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [nic, setNic] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  // A request already open on this device goes to its status screen, not a second form.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const id = await peekRecoveryDeviceId();
        if (!id) return;
        const { status } = await getRecoveryStatus(id);
        if (!cancelled && (status === "pending" || status === "approved")) {
          navigation.replace("AccountRecoveryStatus");
        }
      } catch {
        // No request found (404) or offline: show the form.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [navigation]);

  async function handleSubmit() {
    setFormError(null);
    const errors = {};
    if (!NIC_SHAPE.test(nic.trim())) errors.nic = NIC_MESSAGE;
    if (!isValidDate(birthdate)) errors.birthdate = BIRTHDATE_MESSAGE;
    if (!name.trim()) errors.legalName = NAME_MESSAGE;
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      const deviceId = await getRecoveryDeviceId();
      await requestAccountRecovery({ nic: nic.trim(), birthdate, legalName: name.trim(), deviceId });
      navigation.replace("AccountRecoveryStatus");
    } catch (err) {
      if (err.fields?.birthdate) setFieldErrors({ birthdate: BIRTHDATE_MESSAGE });
      else setFormError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      <KeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={120}
      >
        <View style={styles.topBar}>
          <BackButton onPress={() => navigation.goBack()} />
          <CloseButton onPress={() => navigation.reset({ index: 0, routes: [{ name: "AccountLogin" }] })} />
        </View>
        <Text style={styles.screenTitle}>Recover your account</Text>
        <Text style={styles.explainer}>
          Confirm the details on the account. An admin reviews every request — this isn't instant.
        </Text>

        {formError ? <FormBanner kind="error" message={formError} /> : null}

        <TextField
          label="NIC"
          value={nic}
          onChangeText={setNic}
          placeholder="200412345678"
          autoCapitalize="characters"
          maxLength={12}
          error={Boolean(fieldErrors.nic)}
        />
        <FieldError message={fieldErrors.nic} />
        <Text style={styles.explainer}>12 digits, or 9 digits + V or X — only the shape is checked.</Text>

        <DateTimeField
          label="Birthdate"
          value={birthdate}
          onChangeText={setBirthdate}
          error={Boolean(fieldErrors.birthdate)}
        />
        <FieldError message={fieldErrors.birthdate} />

        <TextField
          label="Legal name"
          value={name}
          onChangeText={setName}
          placeholder="Full legal name"
          autoCapitalize="words"
          maxLength={100}
          error={Boolean(fieldErrors.legalName)}
        />
        <FieldError message={fieldErrors.legalName} />

        <Text style={styles.explainer}>
          We'll show the outcome here when it's been reviewed. Keep the app installed on this device.
        </Text>
        <View style={styles.spacer} />
      </KeyboardAwareScrollView>

      <CtaBar shadow>
        <Button
          title="Submit request"
          onPress={handleSubmit}
          loading={loading}
          disabled={!nic || !birthdate || !name}
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
  // Spec: content pad 6/16/0/16, gap 8.
  content: {
    flexGrow: 1,
    paddingTop: 6,
    paddingHorizontal: spacing.lg,
    paddingBottom: 0,
    gap: spacing.sm,
  },
  // topBar 328×52: back left, ✕ right, 8px bottom padding.
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: spacing.sm,
  },
  screenTitle: {
    ...typography.display,
    color: colors.text.primary,
  },
  explainer: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  spacer: {
    flex: 1,
    minHeight: spacing.lg,
  },
});
