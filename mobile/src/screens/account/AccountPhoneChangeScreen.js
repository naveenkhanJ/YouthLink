import { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { StatusBar } from "expo-status-bar";
import { colors, spacing, typography } from "../../theme/tokens";
import ScreenHeader from "../../components/ScreenHeader";
import Button from "../../components/Button";
import TextField from "../../components/TextField";
import PhoneField from "../../components/PhoneField";
import CtaBar from "../../components/CtaBar";
import Link from "../../components/Link";
import CodeInputNumeric from "../../components/CodeInputNumeric";
import CountdownText from "../../components/CountdownText";
import FormBanner from "../../components/FormBanner";
import { LOCAL_DIGITS, COUNTRY_CODE } from "./phoneFormat";
import usePhoneVerification from "./hooks/usePhoneVerification";
import { changePhone, checkAvailability } from "../../api/account";
import { parseApiError } from "../../api/client";

export default function AccountPhoneChangeScreen({ navigation }) {
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState(null);
  const [finishing, setFinishing] = useState(false);

  const verification = usePhoneVerification({
    onBeforeSend: async (ph) => {
      if (!password) {
        throw new Error("Password is required.");
      }
      const result = await checkAvailability({ phone: `${COUNTRY_CODE}${ph}` });
      if (result.phoneTaken) {
        throw new Error("This number is already registered.");
      }
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

  const error = localError || verificationError;

  useEffect(() => {
    async function finishChange() {
      if (!code || code.length !== 6 || !confirmationResult || finishing) return;
      setFinishing(true);
      setLocalError(null);
      
      await confirmCode(async (idToken) => {
        try {
          await changePhone({ password, idToken });
          Alert.alert("Success", "Your phone number has been updated.");
          navigation.goBack();
        } catch (err) {
          const { formError } = parseApiError(err);
          setLocalError(formError || "Verification failed. Please try again.");
        }
      });
      
      setFinishing(false);
    }
    finishChange();
  }, [code, confirmationResult]);

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
            if (localError) setLocalError(null);
          }}
          secureTextEntry
          placeholder="8-64 characters"
          error={localError ? "error" : undefined}
          editable={!confirmationResult}
        />
        
        <PhoneField
          label="New phone number"
          value={phone}
          onChangeText={(val) => {
            setPhone(val);
            if (localError) setLocalError(null);
          }}
          editable={!confirmationResult}
        />

        {error ? (
          <FormBanner kind="error" message={error} />
        ) : null}

        {confirmationResult ? (
          <View style={styles.pendingChangeRow}>
            <Text style={styles.prTitle}>Pending  confirm {formattedPhone}</Text>
            <Text style={styles.prBody}>
              Your current number stays active until the new one is confirmed by SMS code. If the code expires or you cancel, nothing changes.
            </Text>
            <CodeInputNumeric
              value={code}
              onChangeText={setCode}
              error={localError ? "error" : undefined}
              autoFocus
            />
            {resendCooldown > 0 ? (
              <CountdownText
                text="Resend in :"
              />
            ) : (
              <Link
                title="Resend code"
                onPress={sendCode}
                disabled={sendingCode || confirmingCode || finishing}
              />
            )}
            <View style={{ marginTop: spacing.md }}>
              <Link
                title="Cancel this change"
                onPress={() => {
                  setPassword("");
                  changeNumber();
                }}
              />
            </View>
          </View>
        ) : (
          <Text style={styles.note}>
            Your current number stays active until the new one is verified.
          </Text>
        )}

        <View style={styles.spacer} />
      </KeyboardAwareScrollView>

      {!confirmationResult && (
        <CtaBar>
          <Button
            title="Send code to new number"
            onPress={sendCode}
            loading={sendingCode}
            disabled={!canSubmit}
          />
        </CtaBar>
      )}
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
  pendingChangeRow: {
    padding: spacing.md,
    backgroundColor: colors.bg.default,
    borderColor: colors.border.default,
    borderWidth: 1,
    borderRadius: 10,
    gap: spacing.sm,
  },
  prTitle: {
    ...typography["body-medium"],
    color: colors.text.primary,
  },
  prBody: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
});


