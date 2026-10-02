/**
 * Registration (FR-ACC-01) — Afham.
 *
 * Prototype frames (docs/prototype/M1-account.md): 1.1 role, 1.2 phone, 1.3 code, 1.4 details,
 * plus the failure frames 1.2err, 1.3err1/err2, 1.3rs2, 1.4err1/err2/err3 and 1.4cnt. They are
 * the same steps with different state, so this is one screen holding a `step`. An employer has a
 * fifth, 1.5 / 1.5b: how the account posts (FR-ACC-02).
 *
 * Chrome (every step): content pad 6/16/4/16, gap 16, a 44px top bar (back chevron left, ✕
 * right — step 1 has an empty 44px "ghost" instead, nothing to go back to), the display title
 * "Create account", the "Step N of 4" (5 for an employer) caption, and a pinned ctaBar. The details step is the
 * exception drawn tighter: pad 6/16/0/16, gap 8, and a 52px top bar (8px bottom padding).
 *
 * - Back goes one step back; ✕ abandons registration and returns to role selection (1.1).
 * - "Create account" (step 4) creates the account and signs the person in. A worker or verifier
 *   continues into the app; an employer continues to step 5, which saves how the account posts
 *   (Individual/Household, or Business with a name and optional bio) and then enters the app.
 *   From step 5 back and ✕ leave for the app: the account exists, so there is nothing to discard
 *   (the prototype's back → 1.4e would offer to create it twice).
 * - The phone is verified through Firebase (FR-ACC-08); the resulting ID token is held in
 *   state and submitted with the details, where the server validates it.
 * - A failed field is State=Error plus a separate Feedback/FieldError beneath it — the
 *   server's terse field codes ("Already registered") are mapped to the sentences drawn in
 *   1.2err, 1.4err1 and 1.4err2.
 * - Create account stays enabled when the terms are unticked, so the attempt can produce the
 *   explanation (1.4err3).
 * - The ToS / Privacy links open 1.20 (AccountTerms).
 *
 * Phone verification state lives in usePhoneVerification.js, shared with AccountLoginOtpScreen.
 */
import { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, BackHandler } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { register, checkAvailability, updatePostingAs } from "../../api/account";
import { useAuth } from "../../auth/AuthContext";
import { colors, spacing, typography } from "../../theme/tokens";
import Button from "../../components/Button";
import TextField from "../../components/TextField";
import RoleOption from "../../components/RoleOption";
import Checkbox from "../../components/Checkbox";
import SegmentedControl from "../../components/SegmentedControl";
import Link from "../../components/Link";
import CodeInputNumeric from "../../components/CodeInputNumeric";
import CountdownText from "../../components/CountdownText";
import DateTimeField from "../../components/DateTimeField";
import FieldError from "../../components/FieldError";
import FormBanner from "../../components/FormBanner";
import CtaBar from "../../components/CtaBar";
import PhoneField from "../../components/PhoneField";
import BackButton from "./components/BackButton";
import CloseButton from "./components/CloseButton";
import usePhoneVerification from "./hooks/usePhoneVerification";
import { COUNTRY_CODE, LOCAL_DIGITS } from "./phoneFormat";

const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ROLES = [
  { value: "YOUTH_JOB_SEEKER", title: "Youth Job-Seeker", description: "Find part-time work and gigs" },
  { value: "EMPLOYER", title: "Local Business/Employer", description: "Post gigs and hire workers" },
  { value: "COMMUNITY_ENDORSER", title: "Community Verifier", description: "Vouch for people you know" },
];

// The sentences the prototype draws for the failures a registration can meet.
const PHONE_TAKEN_MESSAGE =
  "This number is already registered. Log in instead — you can reset your password from there.";
const NIC_TAKEN_MESSAGE =
  "This NIC is already registered. You can log in instead, or check the number for a typo.";
const UNDER_AGE_MESSAGE = "YouthLink is for people aged 18 and over. Please check your birthdate is right.";
const TERMS_MESSAGE = "Please accept the Terms of Service and Privacy Policy to continue.";
// Not drawn (no frame for these): kept short and in the same voice.
// Same sentence the Settings email screen draws in 1.14err, so the two never disagree.
const EMAIL_TAKEN_MESSAGE = "This email is already on another account. Try a different address.";
const EMAIL_INVALID_MESSAGE = "Enter a valid email address.";
const PASSWORD_LENGTH_MESSAGE = "Password must be 8 to 64 characters.";
const PASSWORD_MISMATCH_MESSAGE = "Passwords do not match.";
const NAME_REQUIRED_MESSAGE = "Enter your full legal name.";
const NIC_FORMAT_MESSAGE = "A NIC is 12 digits, or 9 digits followed by V or X.";
const BIRTHDATE_FORMAT_MESSAGE = "Enter your birthdate as YYYY-MM-DD.";
const NIC_SHAPE = /^(\d{12}|\d{9}[VvXx])$/;
const LEGAL_NAME_CAP = 100;

/**
 * Four steps for a worker or a verifier; the employer has a fifth (FR-ACC-02): how the account will
 * post, Individual/Household or Business. The counter says so from step 1 (1.1e: "Step 1 of 5").
 */
function totalSteps(role) {
  return role === "EMPLOYER" ? 5 : 4;
}

const BUSINESS_NAME_CAP = 100;
const BUSINESS_BIO_CAP = 300;

/** Whether `value` is a real calendar date written as YYYY-MM-DD. */
function isValidDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

/** Maps a server field code to the drawn sentence; unknown codes pass through readably. */
function fieldMessage(field, code) {
  if (field === "phone") return PHONE_TAKEN_MESSAGE;
  if (field === "nic" && /already/i.test(code)) return NIC_TAKEN_MESSAGE;
  if (field === "birthdate" && /18/.test(code)) return UNDER_AGE_MESSAGE;
  if (field === "email" && /already/i.test(code)) return EMAIL_TAKEN_MESSAGE;
  if (field === "tosAccepted") return TERMS_MESSAGE;
  return code;
}

export default function RegisterScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { signIn, updateUser } = useAuth();

  const [step, setStep] = useState(1);
  const [role, setRole] = useState(null);

  // Steps 2–3: phone verification. onBeforeSend turns "already registered" into 1.2err.
  const verification = usePhoneVerification({
    onBeforeSend: async (digits) => {
      const result = await checkAvailability({ phone: `${COUNTRY_CODE}${digits}` });
      if (result.phoneTaken) throw new Error(PHONE_TAKEN_MESSAGE);
    },
  });
  const {
    phone,
    editPhone,
    code,
    setCode,
    error: verificationError,
    sendingCode,
    confirmingCode,
    resendCooldown,
    codeExpired,
    formattedPhone,
    sendCode,
    changeNumber,
    confirmCode,
  } = verification;
  const [idToken, setIdToken] = useState(null);

  // Step 4: details.
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [nic, setNic] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [legalName, setLegalName] = useState("");
  const [tosAccepted, setTosAccepted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  // True once the account exists (step 4 creates it). From then on there is nothing to go back to
  // and nothing to discard, so back and ✕ leave the registration.
  const [registered, setRegistered] = useState(false);

  // Step 5 (employer): how the account posts.
  const [postingAs, setPostingAs] = useState("individual");
  const [businessName, setBusinessName] = useState("");
  const [businessBio, setBusinessBio] = useState("");
  const [postingError, setPostingError] = useState(null);
  const [savingPosting, setSavingPosting] = useState(false);

  // Hardware back follows the on-screen back: one step back, and out of the screen only from
  // the first step.
  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      if (registered) {
        finishToHome();
        return true;
      }
      if (step === 1) return false;
      goBackOneStep();
      return true;
    });
    return () => sub.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, registered]);

  /** The account exists and the person is signed in: continue into the app. */
  function finishToHome() {
    navigation.reset({ index: 0, routes: [{ name: "Home" }] });
  }

  function goBackOneStep() {
    if (step === 3) changeNumber();
    setStep((s) => Math.max(1, s - 1));
  }

  /** ✕ — abandon registration and return to role selection (1.1). */
  function abandon() {
    changeNumber();
    setIdToken(null);
    setPassword("");
    setConfirmPassword("");
    setEmail("");
    setNic("");
    setBirthdate("");
    setLegalName("");
    setTosAccepted(false);
    setFieldErrors({});
    setFormError(null);
    setStep(1);
  }

  async function handleSendCode() {
    if (await sendCode()) setStep(3);
  }

  async function handleResend() {
    await sendCode();
  }

  async function handleConfirmCode() {
    await confirmCode(async (token) => {
      setIdToken(token);
      setStep(4);
    });
  }

  /** Sets a details-step field and drops that field's error: editing it is the person's answer to it. */
  function edit(field, setter, value) {
    setter(value);
    setFieldErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  }

  async function handleEmailBlur() {
    const trimmed = email.trim();
    if (!trimmed || !EMAIL_FORMAT.test(trimmed)) return;
    try {
      const result = await checkAvailability({ email: trimmed });
      setFieldErrors((prev) => {
        const next = { ...prev };
        if (result.emailTaken) next.email = EMAIL_TAKEN_MESSAGE;
        else if (next.email === EMAIL_TAKEN_MESSAGE) delete next.email;
        return next;
      });
    } catch {
      // A failed pre-check must not block the form; the submit reports a real conflict.
    }
  }

  async function handleSubmit() {
    setFormError(null);

    // Client-side checks mirror the server's so the common mistakes get an answer at once.
    const errors = {};
    if (password.length < 8 || password.length > 64) errors.password = PASSWORD_LENGTH_MESSAGE;
    else if (password !== confirmPassword) errors.confirmPassword = PASSWORD_MISMATCH_MESSAGE;
    if (email.trim() && !EMAIL_FORMAT.test(email.trim())) errors.email = EMAIL_INVALID_MESSAGE;
    if (!NIC_SHAPE.test(nic.trim())) errors.nic = NIC_FORMAT_MESSAGE;
    if (!isValidDate(birthdate)) errors.birthdate = BIRTHDATE_FORMAT_MESSAGE;
    if (!legalName.trim()) errors.legalName = NAME_REQUIRED_MESSAGE;
    if (!tosAccepted) errors.tosAccepted = TERMS_MESSAGE;
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    try {
      const { token, user } = await register({
        role,
        idToken,
        password,
        email: email.trim() || undefined,
        nic: nic.trim(),
        birthdate,
        legalName: legalName.trim(),
        tosAccepted,
      });
      // The prototype continues into the app once the account is created; an employer's step 5
      // needs the session too, so sign in now.
      await signIn(token, user);
      setRegistered(true);
      if (role === "EMPLOYER") setStep(5);
      else finishToHome();
    } catch (err) {
      if (err.fields) {
        const mapped = {};
        for (const [field, text] of Object.entries(err.fields)) mapped[field] = fieldMessage(field, text);
        // The number was free when the code was sent but is taken now: back to phone entry.
        if (mapped.phone) {
          changeNumber();
          setStep(2);
        }
        setFieldErrors(mapped);
      } else {
        setFormError(err.message);
      }
    } finally {
      setSubmitting(false);
    }
  }

  /** Step 5 "Continue": save how the account posts, then into the app. */
  async function handlePostingAs() {
    setPostingError(null);
    setSavingPosting(true);
    try {
      const saved = await updatePostingAs(
        postingAs === "business"
          ? { postingAsType: "BUSINESS", businessName: businessName.trim(), businessBio: businessBio.trim() }
          : { postingAsType: "INDIVIDUAL" },
      );
      await updateUser(saved);
      finishToHome();
    } catch (err) {
      setPostingError(err.message);
    } finally {
      setSavingPosting(false);
    }
  }

  const loginLink = (
    <Link title="Go to log in" onPress={() => navigation.navigate("AccountLogin")} />
  );

  /** The registration top bar: back chevron, spacer, ✕ (a ghost on step 1). */
  function topBar({ ghost = false, tight = false } = {}) {
    return (
      <View style={[styles.topBar, tight && styles.topBarTight]}>
        {ghost ? <View style={styles.ghost} /> : <BackButton onPress={registered ? finishToHome : goBackOneStep} />}
        {ghost ? null : <CloseButton onPress={registered ? finishToHome : abandon} />}
      </View>
    );
  }

  function heading() {
    return (
      <>
        <Text style={styles.screenTitle}>Create account</Text>
        <Text style={styles.stepLabel}>
          Step {step} of {totalSteps(role)}
        </Text>
      </>
    );
  }

  // ── 1.1 Role selection ──────────────────────────────────────────────────
  if (step === 1) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <StatusBar style="dark" />
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {topBar({ ghost: true })}
          {heading()}
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
          {loginLink}
        </ScrollView>
        <CtaBar>
          <Button title="Continue" onPress={() => setStep(2)} disabled={!role} />
        </CtaBar>
      </View>
    );
  }

  // ── 1.2 Phone entry (1.2err when the number is taken) ───────────────────
  if (step === 2) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <StatusBar style="dark" />
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {topBar()}
          {heading()}
          <PhoneField value={phone} onChangeText={editPhone} error={Boolean(verificationError)} />
          <FieldError message={verificationError} />
          <View style={styles.spacer} />
          {loginLink}
        </ScrollView>
        <CtaBar>
          <Button
            title="Send code"
            onPress={handleSendCode}
            loading={sendingCode}
            disabled={phone.length !== LOCAL_DIGITS}
          />
        </CtaBar>
      </View>
    );
  }

  // ── 1.3 Code entry (1.3err1 / 1.3err2 / 1.3rs2) ─────────────────────────
  if (step === 3) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <StatusBar style="dark" />
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {topBar()}
          {heading()}
          <Text style={styles.sentTo}>We sent a 6-digit code to {formattedPhone}.</Text>
          <CodeInputNumeric value={code} onChangeText={setCode} error={Boolean(verificationError)} />
          <FieldError message={verificationError} />
          {resendCooldown > 0 ? (
            <CountdownText
              text={`Resend in ${Math.floor(resendCooldown / 60)}:${String(resendCooldown % 60).padStart(2, "0")}`}
            />
          ) : (
            <Link title="Resend code" onPress={handleResend} />
          )}
          <View style={styles.spacer} />
          <View style={styles.linkGroup}>
            <Link
              title="Change number"
              onPress={() => {
                changeNumber();
                setStep(2);
              }}
            />
            {loginLink}
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

  // ── 1.5 / 1.5b Employer posting-as ──────────────────────────────────────
  if (step === 5) {
    const business = postingAs === "business";
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
          {topBar()}
          {heading()}
          <Text style={styles.question}>How will you post gigs?</Text>
          <SegmentedControl selected={postingAs} onChange={setPostingAs} />
          <Text style={styles.postingDesc}>
            Individual/Household — post occasional gigs as yourself: a house move, tutoring, help at an event.
          </Text>
          <Text style={styles.postingDesc}>
            Business — you'll add a business name, and it appears on every posting you publish.
          </Text>
          <Text style={styles.sentTo}>
            You can change this later in Settings. Postings you've already published keep the name they were posted
            under.
          </Text>
          {business ? (
            <>
              <TextField
                label="Business name"
                value={businessName}
                onChangeText={setBusinessName}
                placeholder="Enter your business name"
                autoCapitalize="words"
                maxLength={BUSINESS_NAME_CAP}
              />
              <TextField
                label="Business bio (optional)"
                value={businessBio}
                onChangeText={setBusinessBio}
                placeholder="What your business does (optional)"
                autoCapitalize="sentences"
                maxLength={BUSINESS_BIO_CAP}
              />
            </>
          ) : null}
          {postingError ? <FormBanner kind="error" message={postingError} /> : null}
          <View style={styles.spacer} />
        </KeyboardAwareScrollView>
        <CtaBar>
          <Button
            title="Continue"
            onPress={handlePostingAs}
            loading={savingPosting}
            disabled={business && !businessName.trim()}
          />
        </CtaBar>
      </View>
    );
  }

  // ── 1.4 Details (1.4err1 / err2 / err3 / 1.4cnt) ────────────────────────
  const termsLabel = (
    <>
      I accept the{" "}
      <Text style={styles.underlined} onPress={() => navigation.navigate("AccountTerms")}>
        Terms of Service
      </Text>{" "}
      and{" "}
      <Text style={styles.underlined} onPress={() => navigation.navigate("AccountTerms")}>
        Privacy Policy
      </Text>
    </>
  );

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      <KeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, styles.contentDetails]}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={120}
      >
        {topBar({ tight: true })}
        {heading()}

        {formError ? <FormBanner kind="error" message={formError} /> : null}

        <TextField
          label="Password"
          value={password}
          onChangeText={(value) => edit("password", setPassword, value)}
          placeholder="••••••••••"
          secureTextEntry
          maxLength={64}
          error={Boolean(fieldErrors.password)}
        />
        <FieldError message={fieldErrors.password} />
        <TextField
          label="Confirm password"
          value={confirmPassword}
          onChangeText={(value) => edit("confirmPassword", setConfirmPassword, value)}
          placeholder="••••••••••"
          secureTextEntry
          maxLength={64}
          error={Boolean(fieldErrors.confirmPassword)}
        />
        <FieldError message={fieldErrors.confirmPassword} />
        <Text style={styles.fieldHelp}>8–64 characters, spaces allowed.</Text>

        <TextField
          label="Email (optional)"
          value={email}
          onChangeText={(value) => edit("email", setEmail, value)}
          onBlur={handleEmailBlur}
          placeholder="you@example.com"
          keyboardType="email-address"
          error={Boolean(fieldErrors.email)}
        />
        <FieldError message={fieldErrors.email} />

        <TextField
          label="NIC"
          value={nic}
          onChangeText={(value) => edit("nic", setNic, value)}
          placeholder="Enter your NIC"
          autoCapitalize="characters"
          maxLength={12}
          error={Boolean(fieldErrors.nic)}
        />
        <FieldError message={fieldErrors.nic} />
        <Text style={styles.nicHelp}>12 digits, or 9 digits + V or X — only the shape is checked.</Text>

        <DateTimeField
          label="Birthdate"
          value={birthdate}
          onChangeText={(value) => edit("birthdate", setBirthdate, value)}
          error={Boolean(fieldErrors.birthdate)}
        />
        <FieldError message={fieldErrors.birthdate} />

        <TextField
          label="Legal name"
          value={legalName}
          onChangeText={(value) => edit("legalName", setLegalName, value)}
          autoCapitalize="words"
          maxLength={LEGAL_NAME_CAP}
          showCounter
          error={Boolean(fieldErrors.legalName)}
        />
        <FieldError message={fieldErrors.legalName} />

        <Checkbox
          checked={tosAccepted}
          onToggle={() => {
            setTosAccepted((prev) => !prev);
            setFieldErrors((prev) => ({ ...prev, tosAccepted: undefined }));
          }}
          label={termsLabel}
          errorMessage={fieldErrors.tosAccepted}
        />

        <View style={styles.spacerTight} />
      </KeyboardAwareScrollView>
      <CtaBar shadow>
        <Button title="Create account" onPress={handleSubmit} loading={submitting} />
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
  // Spec: content pad 6/16/4/16, gap 16. 6 is a literal in the frames (no spacing token).
  content: {
    flexGrow: 1,
    paddingTop: 6,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xs,
    gap: spacing.lg,
  },
  // 1.4 draws its content tighter: pad 6/16/0/16, gap 8.
  contentDetails: {
    // The prototype ends the content flush (0), which is right with the keyboard closed. The extra
    // slack is invisible then, but lets the scroll lift the focused last field and its counter
    // clear of the pinned bar when the keyboard is open (the field was ending flush with the bar).
    paddingBottom: 96,
    gap: spacing.sm,
  },
  // topBar 328×44: back chevron at the left, ✕ at the right.
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  // On the details step the bar carries 8px of bottom padding (328×52).
  topBarTight: {
    paddingBottom: spacing.sm,
  },
  ghost: {
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
  sentTo: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  fieldHelp: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  question: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  postingDesc: {
    ...typography.body,
    color: colors.text.secondary,
  },
  nicHelp: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  underlined: {
    textDecorationLine: "underline",
  },
  spacer: {
    flex: 1,
    minHeight: spacing.lg,
  },
  spacerTight: {
    height: spacing.md,
  },
  linkGroup: {
    alignItems: "flex-start",
  },
});
