/**
 * Change phone number (prototype 1.12 / 1.12b / 1.12err; FR-ACC-12) — Afham.
 *
 * 1.12     password + new number, "Send code to new number"
 * 1.12b    the change is pending: a pendingChangeRow ("Pending — confirm +94 …") with "Cancel
 *          this change"; the current number stays active until the SMS code is entered
 * 1.12err  the password field in State=Error with "That password doesn't match your account…"
 *
 * Not drawn: the code entry itself (the prototype says a code step is 1.3's layout), so the six
 * boxes and the resend countdown sit inside the pending row, with a "Verify" button.
 *
 * Note on 1.12err: the password is checked by the server together with the verified number (the
 * API takes both at the end), so a wrong password is reported after the code is entered, not on
 * "Send code". The screen returns to 1.12err when that happens, so the person is never left
 * stuck with a code that can no longer be used.
 *
 * Reachable from Settings (YL-92, Sprint 4); until then no screen navigates here.
 */
import { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { StatusBar } from "expo-status-bar";
import { colors, spacing, radius, typography } from "../../theme/tokens";
import ScreenHeader from "../../components/ScreenHeader";
import Button from "../../components/Button";
import TextField from "../../components/TextField";
import PhoneField from "../../components/PhoneField";
import CtaBar from "../../components/CtaBar";
import Link from "../../components/Link";
import CodeInputNumeric from "../../components/CodeInputNumeric";
import CountdownText from "../../components/CountdownText";
import FieldError from "../../components/FieldError";
import { useAuth } from "../../auth/AuthContext";
import { COUNTRY_CODE, LOCAL_DIGITS } from "./phoneFormat";
import usePhoneVerification from "./hooks/usePhoneVerification";
import { changePhone, checkAvailability } from "../../api/account";

const PASSWORD_MISMATCH_MESSAGE = "That password doesn't match your account. Please try again.";
const PHONE_TAKEN_MESSAGE = "This number is already registered to another account.";

export default function AccountPhoneChangeScreen({ navigation }) {
  const { updateUser } = useAuth();
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(null);

  const verification = usePhoneVerification({
    onBeforeSend: async (digits) => {
      const result = await checkAvailability({ phone: `${COUNTRY_CODE}${digits}` });
      if (result.phoneTaken) throw new Error(PHONE_TAKEN_MESSAGE);
    },
  });
  const {
    phone,
    setPhone,
    confirmationResult,
    code,
    setCode,
    error: verificationError,
    sendingCode,
    confirmingCode,
    resendCooldown,
    formattedPhone,
    sendCode,
    confirmCode,
    changeNumber,
  } = verification;

  // The pending row (1.12b) is showing once a code has been sent.
  const pending = Boolean(confirmationResult);

  async function handleVerify() {
    setPasswordError(null);
    await confirmCode(async (idToken) => {
      try {
        const result = await changePhone({ password, idToken });
        await updateUser({ phone: result.phone });
        Alert.alert("Phone number updated", "Your new number is now active.");
        navigation.goBack();
      } catch (err) {
        if (err.fields?.password) {
          // Back to 1.12err with the code dropped: it cannot be used again.
          changeNumber();
          setPasswordError(PASSWORD_MISMATCH_MESSAGE);
          return;
        }
        // Anything else (number taken meanwhile, rate limit, offline) reads as the server's
        // sentence; the hook shows it under the code boxes.
        throw err;
      }
    });
  }

  function cancelChange() {
    changeNumber();
    setPasswordError(null);
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScreenHeader title="Change phone number" onBack={() => navigation.goBack()} />

      <KeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, pending && styles.contentPending]}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={120}
      >
        <TextField
          label="Password"
          value={password}
          onChangeText={(value) => {
            setPassword(value);
            setPasswordError(null);
          }}
          secureTextEntry
          placeholder="8–64 characters"
          disabled={pending}
          error={Boolean(passwordError)}
        />
        <FieldError message={passwordError} />

        <PhoneField
          label="New phone number"
          value={phone}
          onChangeText={setPhone}
          editable={!pending}
          error={!pending && Boolean(verificationError)}
        />
        {!pending ? <FieldError message={verificationError} /> : null}

        {pending ? (
          <View style={styles.pendingRow}>
            <Text style={styles.pendingTitle}>Pending — confirm {formattedPhone}</Text>
            <Text style={styles.pendingBody}>
              Your current number stays active until the new one is confirmed by SMS code. If the code expires or you
              cancel, nothing changes.
            </Text>
            <CodeInputNumeric value={code} onChangeText={setCode} error={Boolean(verificationError)} />
            <FieldError message={verificationError} />
            {resendCooldown > 0 ? (
              <CountdownText
                text={`Resend in ${Math.floor(resendCooldown / 60)}:${String(resendCooldown % 60).padStart(2, "0")}`}
              />
            ) : (
              <Link title="Resend code" onPress={sendCode} />
            )}
            <Link title="Cancel this change" onPress={cancelChange} />
          </View>
        ) : null}

        <Text style={styles.note}>Your current number stays active until the new one is verified.</Text>
        <View style={styles.spacer} />
      </KeyboardAwareScrollView>

      <CtaBar>
        {pending ? (
          <Button title="Verify" onPress={handleVerify} loading={confirmingCode} disabled={code.length !== 6} />
        ) : (
          <Button
            title="Send code to new number"
            onPress={sendCode}
            loading={sendingCode}
            disabled={!password || phone.length !== LOCAL_DIGITS}
          />
        )}
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
  // Spec: content pad 24/16/4/16, gap 16 (1.12 / 1.12err); 1.12b ends with 24 at the bottom.
  content: {
    flexGrow: 1,
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xs,
    gap: spacing.lg,
  },
  contentPending: {
    paddingBottom: spacing.xl,
  },
  // pendingChangeRow: pad 12/14/12/14, gap 6, 1px border, radius 10.
  pendingRow: {
    paddingVertical: spacing.md,
    paddingHorizontal: 14,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: 10,
    backgroundColor: colors.bg.default,
  },
  pendingTitle: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  pendingBody: {
    ...typography.secondary,
    color: colors.text.secondary,
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
