/**
 * The phone-verification step's UI — Account Management module only,
 * shared by RegisterScreen.js and LoginScreen.js's OTP mode so the same
 * fix (inline errors instead of a top-of-form line, resend with a
 * cooldown, a working "change number" instead of an editable-but-inert
 * field) lands identically in both places. Pairs with
 * ../hooks/usePhoneVerification.js, which owns all the state this only
 * renders.
 */
import { View, Text, Pressable, StyleSheet } from "react-native";
import { colors, spacing, typography } from "../theme";
import { LOCAL_DIGITS } from "../phoneFormat";
import Button from "./Button";
import PhoneField from "./PhoneField";
import TextField from "./TextField";

/**
 * @param {ReturnType<typeof import("../hooks/usePhoneVerification").default>} verification
 * @param {() => void} onConfirm - called when the confirm button is pressed.
 * @param {string} confirmLabel - e.g. "Verify" or "Log in".
 */
export default function PhoneVerificationStep({ verification, onConfirm, confirmLabel }) {
  const {
    phone,
    setPhone,
    confirmationResult,
    code,
    setCode,
    error,
    sendingCode,
    confirmingCode,
    resendCooldown,
    formattedPhone,
    sendCode,
    changeNumber,
  } = verification;

  if (!confirmationResult) {
    return (
      <>
        <PhoneField value={phone} onChangeText={setPhone} error={error} />
        <Button
          title="Send code"
          onPress={sendCode}
          loading={sendingCode}
          disabled={phone.length !== LOCAL_DIGITS}
        />
      </>
    );
  }

  return (
    <>
      <View style={styles.sentRow}>
        <Text style={styles.sentText}>Code sent to {formattedPhone}</Text>
        <Pressable onPress={changeNumber} disabled={sendingCode || confirmingCode}>
          <Text style={[styles.link, (sendingCode || confirmingCode) && styles.linkDisabled]}>
            Change
          </Text>
        </Pressable>
      </View>

      <TextField
        label="Verification code"
        value={code}
        onChangeText={setCode}
        placeholder="123456"
        keyboardType="number-pad"
        maxLength={6}
        error={error}
      />

      <Button
        title={confirmLabel}
        onPress={onConfirm}
        loading={confirmingCode}
        disabled={code.length !== 6}
      />

      {/* Disabled on resendCooldown > 0 (the normal case), sendingCode, and
          confirmingCode. The first review pass caught sendingCode: without
          it, two rapid taps before the first request resolves (cooldown
          hasn't started yet) fire concurrent signInWithPhoneNumber calls,
          and whichever setConfirmationResult() lands second silently
          replaces the first — reproduced live before that fix, confirmed
          gone after. A second pass caught confirmingCode: on a slow
          connection, confirmCode()'s await can outlast the 30s cooldown,
          so without this the link re-enables while a confirm() call is
          still in flight and closing over the confirmationResult resend
          is about to replace. */}
      <Pressable
        onPress={sendCode}
        disabled={resendCooldown > 0 || sendingCode || confirmingCode}
        style={styles.resendRow}
      >
        <Text
          style={[
            styles.link,
            (resendCooldown > 0 || sendingCode || confirmingCode) && styles.linkDisabled,
          ]}
        >
          {sendingCode
            ? "Sending…"
            : resendCooldown > 0
              ? `Resend code in ${resendCooldown}s`
              : "Resend code"}
        </Text>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  sentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  sentText: {
    fontSize: typography.caption.fontSize,
    color: colors.textSecondary,
    flexShrink: 1,
  },
  resendRow: {
    marginTop: spacing.lg,
    alignItems: "center",
  },
  link: {
    fontSize: typography.caption.fontSize,
    fontWeight: typography.caption.fontWeight,
    color: colors.primary,
  },
  linkDisabled: {
    color: colors.textPlaceholder,
  },
});
