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
 * The phone-verification step itself (signInWithPhoneNumber,
 * ConfirmationResult#confirm, getIdToken — the modular
 * @react-native-firebase/auth API, verified directly against this
 * project's installed package version (26.2.0), no app verifier/reCAPTCHA
 * needed thanks to the native module) lives in
 * ./hooks/usePhoneVerification.js, shared with LoginScreen.js's OTP mode.
 */
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { StatusBar } from "expo-status-bar";
import { register } from "../../api/account";
import { parseApiError } from "../../api/client";
import { colors, spacing, typography } from "./theme";
import Button from "./components/Button";
import TextField from "./components/TextField";
import RoleOption from "./components/RoleOption";
import Checkbox from "./components/Checkbox";
import Link from "./components/Link";
import PhoneVerificationStep from "./components/PhoneVerificationStep";
import usePhoneVerification from "./hooks/usePhoneVerification";

// Mirrors backend/src/modules/account/account.service.js's EMAIL_FORMAT —
// duplicated, not shared, since mobile/ and backend/ are separate deployable
// apps with no shared module between them. This is a client-side pre-check
// only; the server check is the authoritative one.
const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  const verification = usePhoneVerification();
  const [idToken, setIdToken] = useState(null);

  // Step 2 — the rest of the form, only reachable once idToken is set.
  const [role, setRole] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

  async function handleConfirmCode() {
    await verification.confirmCode(async (token) => setIdToken(token));
  }

  // FR-ACC-01 is silent on this — found by hitting it live during testing
  // (KEYCODE_BACK silently discarded a fully-filled step-2 form). Only
  // warns once there's something to lose: a phone number typed in step 1,
  // or step 2 reached at all. Never warns after a successful registration,
  // where navigating away (via "Go to log in") is the intended exit.
  useEffect(() => {
    const hasUnsavedInput =
      !registeredUser && (idToken || verification.phone.length > 0);
    if (!hasUnsavedInput) {
      return undefined;
    }

    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
      Alert.alert(
        "Discard registration?",
        "The details you've entered will be lost.",
        [
          { text: "Stay", style: "cancel" },
          {
            text: "Discard",
            style: "destructive",
            onPress: () => navigation.dispatch(e.data.action),
          },
        ],
      );
    });

    return unsubscribe;
  }, [navigation, registeredUser, idToken, verification.phone]);

  const canSubmit =
    role && password.length > 0 && confirmPassword.length > 0 &&
    nic.trim().length > 0 && birthdate.trim().length > 0 &&
    legalName.trim().length > 0;

  async function handleSubmitRegistration() {
    setFieldErrors({});
    setFormError(null);

    // Client-side pre-checks the backend can't express as a single field
    // error (a mismatch spans two fields) or doesn't check at all today
    // (email format) — caught here, before the network round-trip, same
    // spirit as the phone-digit-count check gating "Send code" already
    // does. The backend's own validateFields() is still the authoritative
    // check for everything else. Computed alongside the ToS check (not
    // before it, with its own early return) so a submit with both problems
    // highlights both at once instead of only revealing the ToS checkbox
    // on a second attempt.
    const preErrors = {};
    if (password !== confirmPassword) {
      preErrors.confirmPassword = "Passwords do not match";
    }
    if (email.trim() && !EMAIL_FORMAT.test(email.trim())) {
      preErrors.email = "Must be a valid email address";
    }

    // FR-ACC-19: blocked with the checkbox highlighted, checked here before
    // ever calling the API — the backend enforces this too, as the real,
    // final guard, but the acceptance criterion describes an in-the-moment
    // UI response to the submit attempt itself.
    setTosError(!tosAccepted);

    if (Object.keys(preErrors).length > 0 || !tosAccepted) {
      setFieldErrors(preErrors);
      return;
    }
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
    <KeyboardAwareScrollView
      style={styles.flex}
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid
      extraScrollHeight={120}
    >
      <Text style={styles.title}>Create your account</Text>

      {!idToken ? (
        <>
          <Text style={styles.stepBody}>
            Verify your phone number to get started.
          </Text>
          <PhoneVerificationStep
            verification={verification}
            onConfirm={handleConfirmCode}
            confirmLabel="Verify"
          />
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
            label="Confirm password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Re-enter password"
            secureTextEntry
            error={fieldErrors.confirmPassword}
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
            maxLength={100}
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

      <Link onPress={() => navigation.navigate("AccountLogin")}>
        Already have an account? Log in
      </Link>

      <StatusBar style="dark" />
    </KeyboardAwareScrollView>
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
});
