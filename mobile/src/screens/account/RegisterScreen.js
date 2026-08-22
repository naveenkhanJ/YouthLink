/**
 * Registration screen (FR-ACC-01) — Afham.
 *
 * Two steps in one screen, not two navigator screens: phone verification
 * (via Firebase Phone Auth, client-side) first, then the rest of the
 * registration form, shown only once a verified Firebase ID token exists.
 * Matches FR-ACC-01 AC1 directly — "when the phone OTP is not yet
 * verified, then the account cannot be created" — by construction, since
 * the form fields required to submit don't even render until step one
 * succeeds.
 *
 * Firebase API calls (signInWithPhoneNumber, ConfirmationResult#confirm,
 * getIdToken) are the modular @react-native-firebase/auth API, verified
 * directly against this project's installed package version (26.2.0) —
 * see node_modules/@react-native-firebase/auth/dist/typescript/lib/index.d.ts.
 * No app verifier / reCAPTCHA setup needed here: that's what the native
 * module (vs. the Firebase JS SDK) buys us, per mobile's Firebase setup
 * notes.
 */
import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { getAuth, signInWithPhoneNumber, getIdToken } from "@react-native-firebase/auth";
import { register } from "../../api/account";
import { parseApiError } from "../../api/client";
import { colors, spacing, typography } from "./theme";
import Button from "./components/Button";
import TextField from "./components/TextField";
import RoleOption from "./components/RoleOption";
import Checkbox from "./components/Checkbox";

const ROLES = [
  {
    value: "YOUTH_JOB_SEEKER",
    title: "Youth Job-Seeker",
    description: "Find part-time work and gigs",
  },
  {
    value: "EMPLOYER",
    title: "Employer",
    description: "Post gigs and hire workers",
  },
  {
    value: "COMMUNITY_ENDORSER",
    title: "Community Verifier",
    description: "Vouch for people you know",
  },
];

export default function RegisterScreen({ navigation }) {
  // Step 1 — phone verification.
  const [phone, setPhone] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [code, setCode] = useState("");
  const [phoneError, setPhoneError] = useState(null);
  const [sendingCode, setSendingCode] = useState(false);
  const [confirmingCode, setConfirmingCode] = useState(false);
  const [idToken, setIdToken] = useState(null);

  // Step 2 — the rest of the form, only reachable once idToken is set.
  const [role, setRole] = useState(null);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [nic, setNic] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [legalName, setLegalName] = useState("");
  const [tosAccepted, setTosAccepted] = useState(false);
  const [tosError, setTosError] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [registeredUser, setRegisteredUser] = useState(null);

  async function handleSendCode() {
    setPhoneError(null);
    if (!phone.trim()) {
      setPhoneError("Phone number is required.");
      return;
    }
    setSendingCode(true);
    try {
      const result = await signInWithPhoneNumber(getAuth(), phone.trim());
      setConfirmationResult(result);
    } catch (err) {
      setPhoneError(err.message || "Could not send a verification code.");
    } finally {
      setSendingCode(false);
    }
  }

  async function handleConfirmCode() {
    setPhoneError(null);
    if (!code.trim()) {
      setPhoneError("Enter the code you received.");
      return;
    }
    setConfirmingCode(true);
    try {
      const userCredential = await confirmationResult.confirm(code.trim());
      if (!userCredential) {
        setPhoneError("That code didn't work. Try again.");
        return;
      }
      const token = await getIdToken(userCredential.user);
      setIdToken(token);
    } catch (err) {
      setPhoneError(err.message || "That code didn't work. Try again.");
    } finally {
      setConfirmingCode(false);
    }
  }

  const canSubmit =
    role && password.length > 0 && nic.trim().length > 0 &&
    birthdate.trim().length > 0 && legalName.trim().length > 0;

  async function handleSubmitRegistration() {
    setFieldErrors({});
    setFormError(null);
    // FR-ACC-19: blocked with the checkbox highlighted, checked here before
    // ever calling the API — the backend enforces this too, as the real,
    // final guard, but the acceptance criterion describes an in-the-moment
    // UI response to the submit attempt itself.
    if (!tosAccepted) {
      setTosError(true);
      return;
    }
    setTosError(false);
    setSubmitting(true);
    try {
      const user = await register({
        role,
        idToken,
        password,
        email: email.trim() || undefined,
        nic,
        birthdate,
        legalName,
        tosAccepted,
      });
      setRegisteredUser(user);
    } catch (err) {
      const { formError, fieldErrors } = parseApiError(err);
      setFormError(formError);
      setFieldErrors(fieldErrors);
    } finally {
      setSubmitting(false);
    }
  }

  if (registeredUser) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Account created</Text>
        <Text style={styles.body}>
          Welcome, {registeredUser.legalName}. You can now log in with your
          phone number and password.
        </Text>
        <Button title="Go to log in" onPress={() => navigation.navigate("AccountLogin")} />
        <StatusBar style="dark" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Create your account</Text>

        {!idToken ? (
          <>
            <Text style={styles.stepBody}>
              Verify your phone number to get started.
            </Text>

            {phoneError ? <Text style={styles.formError}>{phoneError}</Text> : null}

            <TextField
              label="Phone number"
              value={phone}
              onChangeText={setPhone}
              placeholder="+94771234567"
              keyboardType="phone-pad"
            />

            {!confirmationResult ? (
              <Button
                title="Send code"
                onPress={handleSendCode}
                loading={sendingCode}
                disabled={!phone.trim()}
              />
            ) : (
              <>
                <TextField
                  label="Verification code"
                  value={code}
                  onChangeText={setCode}
                  placeholder="123456"
                  keyboardType="number-pad"
                />
                <Button
                  title="Verify"
                  onPress={handleConfirmCode}
                  loading={confirmingCode}
                  disabled={!code.trim()}
                />
              </>
            )}
          </>
        ) : (
          <>
            {formError ? <Text style={styles.formError}>{formError}</Text> : null}

            <Text style={styles.sectionLabel}>I am a...</Text>
            {ROLES.map((option) => (
              <RoleOption
                key={option.value}
                title={option.title}
                description={option.description}
                selected={role === option.value}
                onPress={() => setRole(option.value)}
              />
            ))}

            <TextField
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              secureTextEntry
              error={fieldErrors.password}
            />
            <TextField
              label="Email (optional)"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              keyboardType="email-address"
              error={fieldErrors.email}
            />
            <TextField
              label="NIC"
              value={nic}
              onChangeText={setNic}
              placeholder="NIC number"
              error={fieldErrors.nic}
            />
            <TextField
              label="Birthdate"
              value={birthdate}
              onChangeText={setBirthdate}
              placeholder="YYYY-MM-DD"
              keyboardType="numbers-and-punctuation"
              error={fieldErrors.birthdate}
            />
            <TextField
              label="Legal name"
              value={legalName}
              onChangeText={setLegalName}
              placeholder="Full legal name"
              autoCapitalize="words"
              error={fieldErrors.legalName}
            />

            <Checkbox
              checked={tosAccepted}
              onToggle={() => {
                setTosAccepted((prev) => !prev);
                setTosError(false);
              }}
              label="I accept the Terms of Service and Privacy Policy"
              error={tosError || fieldErrors.tosAccepted}
            />

            <Button
              title="Create account"
              onPress={handleSubmitRegistration}
              loading={submitting}
              disabled={!canSubmit}
            />
          </>
        )}

        <Pressable
          style={styles.linkContainer}
          onPress={() => navigation.navigate("AccountLogin")}
        >
          <Text style={styles.link}>Already have an account? Log in</Text>
        </Pressable>

        <StatusBar style="dark" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.surface,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxl,
  },
  title: {
    fontSize: typography.title.fontSize,
    fontWeight: typography.title.fontWeight,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  stepBody: {
    fontSize: typography.body.fontSize,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  body: {
    fontSize: typography.body.fontSize,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  sectionLabel: {
    fontSize: typography.label.fontSize,
    fontWeight: typography.label.fontWeight,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  formError: {
    fontSize: typography.caption.fontSize,
    color: colors.danger,
    marginBottom: spacing.lg,
  },
  linkContainer: {
    marginTop: spacing.lg,
    alignItems: "center",
  },
  link: {
    fontSize: typography.caption.fontSize,
    fontWeight: typography.caption.fontWeight,
    color: colors.primary,
  },
});
