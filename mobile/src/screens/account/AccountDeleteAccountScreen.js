/**
 * Account deletion (prototype 1.17 / 1.17b / 1.17be / 1.17bn / 1.17p / 1.17d; FR-ACC-17,
 * NFR-PRIV-03, NFR-REL-04) — Afham.
 *
 * One screen, four states, all drawn in Figma:
 *   "intro"    1.17   what is removed and what is kept, the two-step note, a Destructive
 *                     "Delete account" button at the foot of the content
 *   "blocked"  1.17b / 1.17be / 1.17bn   the same page with the engagement named ("... — Shop
 *                     assistant — weekend with Saman Stores is still running") and the button
 *                     Disabled; the person has to complete or cancel it first
 *   "confirm"  1.17p  Password field, the deleteNote, Destructive "Delete my account" (pinned in a
 *                     ctaBar, see the deviation note below); a wrong
 *                     password is the field's State=Error with the 1.12err sentence
 *   "deleted"  1.17d  "Account deleted", ctaBar "Back to the start" → 1.1
 *
 * "Delete account" on 1.17 asks the server whether anything blocks it; the server asks again when
 * the password is submitted, so the check cannot go stale. Deleting signs this device out (the
 * token is dead on the server too) and leaves the person on 1.17d.
 *
 * DELIBERATE DEVIATION from Figma 1.17d (decided with Afham, 2026-10-02): the frame draws the
 * "Delete account" ScreenHeader bar above "Account deleted". It is not drawn here. A header bar
 * is navigation chrome, and this screen is a dead end: the account no longer exists, the back
 * gesture is swallowed and the only way out is the "Back to the start" button. The title is also
 * redundant, since "Account deleted" directly below says it. Everything else in 1.17d (content
 * padding, title, body, ctaBar) is as drawn. Recorded in docs/decisions.md; Figma is unchanged.
 */
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, BackHandler } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { StatusBar } from "expo-status-bar";
import { colors, spacing, typography } from "../../theme/tokens";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ScreenHeader from "../../components/ScreenHeader";
import Button from "../../components/Button";
import TextField from "../../components/TextField";
import FieldError from "../../components/FieldError";
import FormBanner from "../../components/FormBanner";
import CtaBar from "../../components/CtaBar";
import { useAuth } from "../../auth/AuthContext";
import { getDeletionStatus, deleteAccount } from "../../api/account";

const WRONG_PASSWORD_MESSAGE = "That password doesn't match your account. Please try again.";
const KEPT_COPY =
  "Ratings you have given and received stay, shown without your name — so the people you worked with keep the reputation they earned.";
const BLOCKED_KEPT_COPY =
  "Deletion is available again after that. It removes your NIC, phone, email and password permanently; ratings you gave and received stay under an anonymised reference.";
const TWO_STEP_NOTE = "You'll be asked to confirm and re-enter your password.";

export default function AccountDeleteAccountScreen({ navigation }) {
  const { signOut } = useAuth();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState("intro"); // intro | blocked | confirm | deleted
  const [engagement, setEngagement] = useState(null);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);

  // 1.17p exits back to 1.17; the deleted state has nothing to go back to.
  function goBack() {
    if (step === "confirm") {
      setPassword("");
      setPasswordError(null);
      setStep("intro");
    } else {
      navigation.goBack();
    }
  }
  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      if (step === "deleted") return true; // swallow: there is nothing behind this
      if (step === "confirm") {
        goBack();
        return true;
      }
      return false;
    });
    return () => sub.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  async function handleStart() {
    setFormError(null);
    setLoading(true);
    try {
      const status = await getDeletionStatus();
      if (status.blocked) {
        setEngagement(status.engagement);
        setStep("blocked");
      } else {
        setStep("confirm");
      }
    } catch (err) {
      setFormError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    setFormError(null);
    setPasswordError(null);
    setLoading(true);
    try {
      await deleteAccount({ password });
      await signOut(null, { forget: true }); // the account is gone: no Log in offer next launch
      setPassword("");
      setStep("deleted");
    } catch (err) {
      if (err.fields?.password) {
        setPasswordError(WRONG_PASSWORD_MESSAGE);
      } else if (err.status === 409) {
        // An engagement started between the check and the password: show it as blocked.
        try {
          const status = await getDeletionStatus();
          setEngagement(status.engagement);
        } catch {
          setEngagement(null);
        }
        setStep("blocked");
      } else {
        setFormError(err.message); // rate limit, offline
      }
    } finally {
      setLoading(false);
    }
  }

  // ── 1.17d ──────────────────────────────────────────────────────────────
  if (step === "deleted") {
    return (
      <View style={styles.root}>
        <StatusBar style="dark" />
        {/* Figma: content pad 24/16/4/16 gap 16; the header bar is left out (see the file header),
            so the status-bar inset is added to the top padding instead. */}
        <View style={[styles.content, styles.contentDeleted, { paddingTop: insets.top + spacing.xl }]}>
          <Text style={styles.deletedTitle}>Account deleted</Text>
          <Text style={styles.body}>
            Your identifying details are gone. Ratings you gave and received remain, attributed to an anonymised
            reference, so other people's history stays honest.
          </Text>
        </View>
        <CtaBar>
          <Button
            title="Back to the start"
            onPress={() => navigation.reset({ index: 0, routes: [{ name: "AccountRegister" }] })}
          />
        </CtaBar>
      </View>
    );
  }

  // ── 1.17p ──────────────────────────────────────────────────────────────
  if (step === "confirm") {
    return (
      <View style={styles.root}>
        <StatusBar style="dark" />
        <ScreenHeader title="Delete account" onBack={goBack} />
        <KeyboardAwareScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.content, styles.contentPinned]}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid
          extraScrollHeight={120}
        >
          {formError ? <FormBanner kind="error" message={formError} /> : null}
          <TextField
            label="Password"
            value={password}
            onChangeText={(value) => {
              setPassword(value);
              setPasswordError(null);
            }}
            placeholder="8–64 characters"
            secureTextEntry
            maxLength={64}
            error={Boolean(passwordError)}
          />
          <FieldError message={passwordError} />
          <Text style={styles.deleteNote}>
            Re-enter your password to confirm. Your NIC, phone, email and password are removed permanently. Ratings you
            gave and received stay, attributed to an anonymised reference.
          </Text>
          <View style={styles.spacer} />
        </KeyboardAwareScrollView>
        {/* DELIBERATE DEVIATION from Figma 1.17p, which draws the button at the foot of the content:
            it is pinned in a ctaBar like the other password and form screens, so with the keyboard
            open it sits 24 dp above it everywhere instead of wherever the content happens to end
            (51 dp to 180 dp above it on the test devices). Recorded in docs/decisions.md. */}
        <CtaBar>
          <Button title="Delete my account" style="destructive" onPress={handleDelete} loading={loading} disabled={!password} />
        </CtaBar>
      </View>
    );
  }

  // ── 1.17 / 1.17b / 1.17be / 1.17bn ─────────────────────────────────────
  const blocked = step === "blocked";
  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScreenHeader title="Delete account" onBack={goBack} />
      <View style={[styles.content, styles.fill]}>
        {formError ? <FormBanner kind="error" message={formError} /> : null}
        <Text style={styles.body}>
          {blocked
            ? engagement
              ? `You can't delete your account while an engagement is active — ${engagement.title} with ${engagement.withName} is still running. It has to be completed or cancelled first.`
              : "You can't delete your account while an engagement is active. It has to be completed or cancelled first."
            : "Deleting your account permanently removes your NIC, phone number, email and password. This cannot be undone."}
        </Text>
        <Text style={styles.note}>{blocked ? BLOCKED_KEPT_COPY : KEPT_COPY}</Text>
        <Text style={styles.note}>{TWO_STEP_NOTE}</Text>
        <View style={styles.spacer} />
        <Button
          title="Delete account"
          style="destructive"
          onPress={handleStart}
          loading={loading}
          disabled={blocked}
        />
      </View>
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
  fill: {
    flex: 1,
  },
  // Figma 1.17 / 1.17b / 1.17p: content pad 24/16/24/16, gap 16 — the button sits at the foot of
  // the content, there is no ctaBar on these states.
  content: {
    flexGrow: 1,
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  // 1.17p: the button is pinned in a ctaBar, so the content ends like the other pinned-bar forms.
  contentPinned: {
    paddingBottom: spacing.xs,
  },
  // 1.17d: pad 24/16/4/16, and the ctaBar below carries the button.
  contentDeleted: {
    flex: 1,
    paddingBottom: spacing.xs,
  },
  body: {
    ...typography.body,
    color: colors.text.primary,
  },
  note: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  deleteNote: {
    ...typography.body,
    color: colors.text.secondary,
  },
  deletedTitle: {
    ...typography.display,
    color: colors.text.primary,
  },
  spacer: {
    flex: 1,
    minHeight: spacing.lg,
  },
});
