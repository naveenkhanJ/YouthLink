/**
 * Registration screen (FR-ACC-01) — Afham.
 *
 * Four steps, matching spec 1.1 → 1.2 → 1.3 → 1.4:
 *   Step 1 — Role selection (1.1)  — which of the three roles they are
 *   Step 2 — Phone entry (1.2)     — Firebase Phone Auth, send code
 *   Step 3 — Code entry (1.3)      — OTP verify, sets idToken
 *   Step 4 — Details (1.4)         — password, email, NIC, birthdate, legal name, ToS
 *
 * All steps share the same registration topBar chrome pattern: a backHit
 * 44×44, TEXT "Create account" (mobile/display), TEXT "Step X of 4"
 * (mobile/caption), and a pinned ctaBar at the bottom — NOT Chrome/ScreenHeader
 * (that's only for settings/form screens per the component's own comment).
 *
 * Every step except the last keeps a "Go to log in" link above the ctaBar.
 *
 * Navigation note: the X button (step 1) and back (steps 2–4) both go to
 * step 1, and ✕ always exits to 1.1 (not goBack()), matching the spec.
 *
 * Phone verification state lives in usePhoneVerification.js, shared with
 * AccountLoginOtpScreen.js.
 */
import { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Alert } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { register, checkAvailability } from "../../api/account";
import { parseApiError } from "../../api/client";
import { colors, spacing, typography } from "../../theme/tokens";
import Button from "../../components/Button";
import TextField from "../../components/TextField";
import RoleOption from "../../components/RoleOption";
import Checkbox from "../../components/Checkbox";
import Link from "../../components/Link";
import CodeInputNumeric from "../../components/CodeInputNumeric";
import CountdownText from "../../components/CountdownText";
import FieldError from "../../components/FieldError";
import CtaBar from "../../components/CtaBar";
import PhoneField from "../../components/PhoneField";
import BackButton from "./components/BackButton";
import usePhoneVerification from "./hooks/usePhoneVerification";
import { COUNTRY_CODE } from "./phoneFormat";

// Client-side email check — see RegisterScreen comment for rationale.
const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ROLES = [
  {
    value: "YOUTH_JOB_SEEKER",
    title: "Youth Job-Seeker",
    description: "Find part-time work and gigs",
  },
  {
    value: "EMPLOYER",
    title: "Local Business/Employer",
    description: "Post gigs and hire workers",
  },
  {
    value: "COMMUNITY_ENDORSER",
    title: "Community Verifier",
    description: "Vouch for people you know",
  },
];

// Employer gets 5 steps (the extra "posting as" step 1.4e/1.5); others get 4.
// Note: the extra employer step is a separate screen not yet built. The step
// counter shows the total that applies to this role so it's correct from step 1.
function totalSteps(role) {
  return role === "EMPLOYER" ? 5 : 4;
}

export default function RegisterScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  // step: 1 | 2 | 3 | 4
  const [step, setStep] = useState(1);

  // Step 1 — role
  const [role, setRole] = useState(null);

  // Steps 2–3 — phone verification
  const verification = usePhoneVerification({
    onBeforeSend: async (phone) => {
      const result = await checkAvailability({ phone: `${COUNTRY_CODE}${phone}` });
      if (result.phoneTaken) {
        throw new Error("This number is already registered. Log in instead — you can reset your password from there.");
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
    changeNumber,
    codeExpired,
  } = verification;
  const [idToken, setIdToken] = useState(null);

  // Step 4 — details form
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

  // Back-press guard — once phone has been entered or step 2 reached,
  // warn before discarding (spec: ✕ goes to 1.1 after confirmation).
  useEffect(() => {
    const hasUnsavedInput =
      !registeredUser && (step > 1 || (phone && phone.length > 0));
    if (!hasUnsavedInput) return undefined;

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
  }, [navigation, registeredUser, step, phone]);

  // Step 2 — send code advances to step 3 on success
  async function handleSendCode() {
    await sendCode();
    if (verification.confirmationResult || !verification.error) {
      // confirmationResult is set by the hook asynchronously; step 3 reads it.
      setStep(3);
    }
  }

  // Step 3 — verify code, advance to step 4 on success
  async function handleConfirmCode() {
    await verification.confirmCode(async (token) => {
      setIdToken(token);
      setStep(4);
    });
  }

  async function handleEmailBlur() {
    if (!email.trim() || !EMAIL_FORMAT.test(email.trim())) return;
    try {
      const result = await checkAvailability({ email: email.trim() });
      if (result.emailTaken) {
        setFieldErrors((prev) => ({ ...prev, email: "Already in use" }));
      } else {
        setFieldErrors((prev) => {
          const next = { ...prev };
          if (next.email === "Already in use") delete next.email;
          return next;
        });
      }
    } catch (err) {
      // Ignore network errors on blur, let the submit catch them
    }
  }

  // Step 4 — submit registration
  async function handleSubmitRegistration() {
    setFieldErrors({});
    setFormError(null);

    const preErrors = {};
    if (password !== confirmPassword) {
      preErrors.confirmPassword = "Passwords do not match";
    }
    if (email.trim() && !EMAIL_FORMAT.test(email.trim())) {
      preErrors.email = "Must be a valid email address";
    }
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

  // ── Shared registration chrome ──────────────────────────────────────────
  // Per spec: backHit 44×44, TEXT "Create account" (mobile/display),
  // TEXT "Step X of Y" (mobile/caption). The ✕ is spec-named but is actually
  // the back button on step 1 (no back on step 1 in spec — topBarGhost 44×44).
  function RegHeader({ stepNum, onBack }) {
    const total = totalSteps(role);
    return (
      <View style={styles.topBar}>
        <View style={styles.backHitArea}>
          {onBack ? <BackButton onPress={onBack} /> : <View style={styles.topBarGhost} />}
        </View>
        <Text style={styles.screenTitle}>Create account</Text>
        {stepNum ? (
          <Text style={styles.stepLabel}>Step {stepNum} of {total}</Text>
        ) : null}
      </View>
    );
  }

  // ── Success screen ──────────────────────────────────────────────────────
  if (registeredUser) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <StatusBar style="dark" />
        <View style={styles.successContent}>
          <Text style={styles.screenTitle}>Account created</Text>
          <Text style={styles.successBody}>
            Welcome, {registeredUser.legalName}. You can now log in with your
            phone number and password.
          </Text>
        </View>
        <CtaBar>
          <Button title="Go to log in" onPress={() => navigation.navigate("AccountLogin")} />
        </CtaBar>
      </View>
    );
  }

  // ── Step 1 — Role Selection (1.1) ───────────────────────────────────────
  if (step === 1) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <StatusBar style="dark" />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* topBarGhost — no back arrow on step 1 */}
          <RegHeader stepNum={1} onBack={null} />

          {ROLES.map((option) => (
            <RoleOption
              key={option.value}
              title={option.title}
              description={option.description}
              selected={role === option.value}
              onPress={() => setRole(option.value)}
            />
          ))}

          <View style={styles.spacer} />
          <View style={styles.linkGroup}>
            <Link
              title="Go to log in"
              onPress={() => navigation.navigate("AccountLogin")}
            />
          </View>
        </ScrollView>
        <CtaBar>
          <Button
            title="Continue"
            onPress={() => setStep(2)}
            disabled={!role}
          />
        </CtaBar>
      </View>
    );
  }

  // ── Step 2 — Phone Entry (1.2) ──────────────────────────────────────────
  if (step === 2) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <StatusBar style="dark" />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <RegHeader stepNum={2} onBack={() => setStep(1)} />

          <PhoneField
            value={phone}
            onChangeText={setPhone}
            error={verificationError}
          />

          <View style={styles.spacer} />
          <View style={styles.linkGroup}>
            <Link
              title="Go to log in"
              onPress={() => navigation.navigate("AccountLogin")}
            />
          </View>
        </ScrollView>
        <CtaBar>
          <Button
            title="Send code"
            onPress={handleSendCode}
            loading={sendingCode}
            disabled={phone.length !== 9}
          />
        </CtaBar>
      </View>
    );
  }

  // ── Step 3 — Code Entry (1.3) ───────────────────────────────────────────
  if (step === 3) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <StatusBar style="dark" />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <RegHeader stepNum={3} onBack={() => setStep(2)} />

          <Text style={styles.sentTo}>
            We sent a 6-digit code to {formattedPhone}.
          </Text>

          <CodeInputNumeric
            value={code}
            onChangeText={setCode}
            error={verificationError}
          />

          {/* CountdownText shows "Resend in 0:XX" during cooldown, then
              Resend code link when cooldown expires — spec 1.3 / 1.3rs2 */}
          {resendCooldown > 0 ? (
            <CountdownText
              text={`Resend in ${Math.floor(resendCooldown / 60)}:${String(resendCooldown % 60).padStart(2, "0")}`}
            />
          ) : (
            <Link
              title="Resend code"
              onPress={sendCode}
              disabled={sendingCode || confirmingCode}
            />
          )}

          {verificationError ? (
            <FieldError message={verificationError} />
          ) : null}

          <View style={styles.spacer} />
          <View style={styles.linkGroup}>
            <Link
              title="Change number"
              onPress={() => { changeNumber(); setStep(2); }}
            />
            <Link
              title="Go to log in"
              onPress={() => navigation.navigate("AccountLogin")}
            />
          </View>
        </ScrollView>
        <CtaBar>
          <Button
            title="Verify"
            onPress={handleConfirmCode}
            loading={confirmingCode}
            disabled={code.length !== 6 || codeExpired}
          />
        </CtaBar>
      </View>
    );
  }

  // ── Step 4 — Details (1.4) ──────────────────────────────────────────────
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
        <RegHeader stepNum={4} onBack={() => setStep(3)} />

        {formError ? <FieldError message={formError} /> : null}

        <TextField
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••••"
          secureTextEntry
          error={fieldErrors.password}
        />
        <TextField
          label="Confirm password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="••••••••••"
          secureTextEntry
          error={fieldErrors.confirmPassword}
        />
        <Text style={styles.fieldHelp}>8–64 characters, spaces allowed.</Text>

        <TextField
          label="Email (optional)"
            value={email}
            onChangeText={setEmail}
            onBlur={handleEmailBlur}
            placeholder="you@example.com"
          keyboardType="email-address"
          error={fieldErrors.email}
        />

        <TextField
          label="NIC"
          value={nic}
          onChangeText={setNic}
          placeholder="200412345678"
          error={fieldErrors.nic}
        />
        <Text style={styles.fieldHelp}>
          12 digits, or 9 digits + V or X — only the shape is checked.
        </Text>

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
          onLabelPress={() => navigation.navigate("AccountTerms")}
        />

        <View style={styles.spacer} />
      </KeyboardAwareScrollView>
      <CtaBar>
        <Button
          title="Create account"
          onPress={handleSubmitRegistration}
          loading={submitting}
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
  content: {
    flexGrow: 1,
    paddingTop: spacing.sm,          // 6px — spec: vertical pad 6/16/4/16
    paddingHorizontal: spacing.lg,   // 16px sides
    paddingBottom: spacing.xs,       // 4px
    gap: spacing.lg,                 // 16px between children
  },
  // ── Registration header ──────────────────────────────────────────────
  topBar: {
    // No explicit height — the title text below sets it naturally.
    // The 44×44 backHit is inside a Row to avoid competing with the title.
  },
  backHitArea: {
    height: 44,
    justifyContent: "center",
  },
  topBarGhost: {
    // 44×44 placeholder when step 1 has no back arrow
    width: 44,
    height: 44,
  },
  screenTitle: {
    ...typography.display,
    color: colors.text.primary,
  },
  stepLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  // ── Content elements ─────────────────────────────────────────────────
  sentTo: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  fieldHelp: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: -spacing.md,   // pull up — gap:16 above already applied
  },
  spacer: {
    flex: 1,
    minHeight: spacing.xxl,
  },
  linkGroup: {
    gap: 0,
    alignItems: "flex-start",
    marginBottom: spacing.xs,
  },
  // ── Success screen ────────────────────────────────────────────────────
  successContent: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
  },
  successBody: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
});


