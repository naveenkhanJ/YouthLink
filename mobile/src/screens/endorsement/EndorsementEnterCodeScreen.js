/**
 * Enter a code (prototype 8.2; FR-ENDORSE-02, FR-ENDORSE-15) — Afham.
 *
 * The Verifier's Vouch tab, and where a newly registered Verifier lands straight after signup
 * (FR-ENDORSE-15: "Have a code to enter?" shown directly, not buried in a menu — RegisterScreen
 * routes here). No ScreenHeader: it is a tab destination, so the title is part of the content.
 *
 *   - Input/CodeInputAlpha: six letters and numbers, upper-cased as typed, sent unspaced.
 *   - "Check code" asks the server; a match opens the vouch screen (8.4) for that person.
 *   - "Search by phone instead" opens 8.3; "How endorsement works" the help page (HF.3).
 *
 * States not drawn, built as M8-endorsement.md's "States not drawn" table says:
 *   - a code that does not match, or whose window has closed → CodeInputAlpha {State=Error} with the
 *     server's one sentence for both, "That code didn't work. Check it with the person who shared
 *     it." — never saying the window closed, which would confirm the account exists (NFR-PRIV-04);
 *   - an eligible code for someone the Verifier already vouches for → "You already vouch for them."
 *     in the same place;
 *   - offline or any other failure → Feedback/FormBanner {Kind=Error} at the top, the code kept.
 *
 * `<PushContextLine role="verifier" />` sits under the title: it shows only while the notification
 * permission dialog is up (FR-NOTIF-09), which on a new Verifier's first launch is over this screen.
 */
import { useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing, typography } from "../../theme/tokens";
import CodeInputAlpha from "../../components/CodeInputAlpha";
import Button from "../../components/Button";
import CtaBar from "../../components/CtaBar";
import Link from "../../components/Link";
import FormBanner from "../../components/FormBanner";
import ShellTabBar from "../../components/ShellTabBar";
import PushContextLine from "../notification/PushContextLine";
import { lookupEndorsementCode } from "../../api/endorsement.api";

const EXPLAINER = "If someone shared their YouthLink code with you, enter it to vouch for them.";
// The component's own error string (M8 "States not drawn"), used when the server's is unavailable.
const NO_MATCH = "That code didn't work. Check it with the person who shared it.";

export default function EndorsementEnterCodeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [checking, setChecking] = useState(false);

  async function check() {
    setCodeError(null);
    setFormError(null);
    // The value sent is the unspaced, upper-case string, whatever was pasted.
    const value = code.replace(/\s+/g, "").toUpperCase();
    if (value.length !== 6) {
      setCodeError(NO_MATCH);
      return;
    }
    setChecking(true);
    try {
      const { workerId, name } = await lookupEndorsementCode(value);
      setCode("");
      navigation.navigate("EndorsementVouch", { workerId, name, entryPoint: "CODE" });
    } catch (err) {
      if (err.offline) setFormError(err.message);
      else if (err.code === "NO_ELIGIBLE_MATCH" || err.code === "ALREADY_VOUCHED") setCodeError(err.message);
      else if (err.fields?.code) setCodeError(NO_MATCH);
      else setFormError(err.message);
    } finally {
      setChecking(false);
    }
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 22 }]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.screenTitle} accessibilityRole="header">
          Have a code to enter?
        </Text>
        <PushContextLine role="verifier" />
        {formError ? <FormBanner kind="error" message={formError} /> : null}
        <Text style={styles.explainer}>{EXPLAINER}</Text>
        <CodeInputAlpha
          value={code}
          onChangeText={(text) => {
            setCode(text);
            setCodeError(null);
          }}
          error={codeError ?? undefined}
        />
        {/* linkGroup: the two links stacked with no gap between their 44px targets. */}
        <View style={styles.linkGroup}>
          <Link title="Search by phone instead" onPress={() => navigation.navigate("EndorsementSearch")} />
          <Link title="How endorsement works" onPress={() => navigation.navigate("HelpEndorsement")} />
        </View>
      </ScrollView>

      {/* ctaBar: pad 12/16/12/16 — a tab bar sits directly below it. */}
      <CtaBar onTabBar>
        <Button title="Check code" onPress={check} loading={checking} />
      </CtaBar>
      <ShellTabBar active="vouch" />
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
  // 8.2 content: pad 66/16/2/16 (66 = the status bar plus 22), gap 14.
  content: {
    paddingHorizontal: spacing.gutter,
    paddingBottom: 2,
    gap: 14,
  },
  screenTitle: {
    ...typography.display,
    color: colors.text.primary,
  },
  explainer: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  linkGroup: {
    alignItems: "flex-start",
  },
});
