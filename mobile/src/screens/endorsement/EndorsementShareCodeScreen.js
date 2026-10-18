/**
 * My endorsement code (prototype 8.1, 8.1b, 8.1s; FR-ENDORSE-02, FR-ENDORSE-05) — Afham.
 *
 * The job-seeker's own six-character code, opened from the Profile row "My endorsement code"
 * (1.18 / 1.18z / 1.18bio) and from the 8.7 suggestion's "See my code".
 *
 *   8.1   eligible: the explainer, the code spaced in endorsement purple ("K 7 X A 2 B" — display
 *         only; the value shared is unspaced), the format and closing-rule lines, "How endorsement
 *         works" (the help page HF.3), and "Share code" pinned at the foot.
 *   8.1s  "Share code" opens the phone's own share sheet (React Native's Share API) with the
 *         server's share text — "My YouthLink endorsement code: K7XA2B — enter it in the app to
 *         vouch for me." The prototype's OS/ShareSheet is a mock of the platform and is not built.
 *   8.1b  eligibility closed (the first rating has landed): the one closing note, no code and no
 *         button — never a greyed-out code, because it will never come back.
 *
 * Not drawn, composed per design-system.md §8: loading → Feedback/LoadingState under the header;
 * a failed load (offline included) → Feedback/FormBanner {Kind=Error} with "Try again".
 */
import { useCallback, useState } from "react";
import { View, Text, ScrollView, Share, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect } from "@react-navigation/native";
import { colors, spacing, radius, typography } from "../../theme/tokens";
import ScreenHeader from "../../components/ScreenHeader";
import Button from "../../components/Button";
import CtaBar from "../../components/CtaBar";
import Link from "../../components/Link";
import FormBanner from "../../components/FormBanner";
import LoadingState from "../../components/LoadingState";
import { getMyEndorsementCode } from "../../api/endorsement.api";
import { spacedCode } from "./endorsement.format";

// 8.1 / 8.1b copy, word for word.
const EXPLAINER =
  "Share this code with someone who knows your work. If they vouch for you, employers see you higher in the list.";
const FORMAT_NOTE = "Letters and numbers — not like an SMS code.";
const ELIGIBILITY_NOTE = "Yours until your first rating arrives — then it closes for good.";
const CLOSED_NOTE =
  "Your endorsement window has closed — it ended when your first rating arrived, and it doesn't reopen. Endorsements you already received stay on your profile.";

// Not drawn: a load that failed. The offline wording follows 4.1bnr / 2.9bnr ("You're offline,
// so … couldn't be …"); any other failure shows the server's own sentence.
const OFFLINE_LOAD = "You're offline, so your code couldn't be loaded. Try again once you reconnect.";

export default function EndorsementShareCodeScreen({ navigation }) {
  const [data, setData] = useState(null); // { eligible, code, shareText } once loaded
  const [error, setError] = useState(null);
  const [shareError, setShareError] = useState(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      setData(await getMyEndorsementCode());
    } catch (err) {
      setError(err.offline ? OFFLINE_LOAD : err.message);
    }
  }, []);

  // Re-read on every visit: eligibility closes the moment a first rating lands (FR-ENDORSE-05).
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  async function share() {
    setShareError(null);
    try {
      // 8.1s: the platform's own sheet. Only the text is sent — it carries the unspaced code.
      await Share.share({ message: data.shareText });
    } catch (err) {
      setShareError(err.message);
    }
  }

  const eligible = data?.eligible && data.code;

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScreenHeader title="My endorsement code" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={eligible ? styles.content : styles.contentClosed}>
        {error ? (
          <>
            <FormBanner kind="error" message={error} />
            <Button title="Try again" style="secondary" onPress={load} />
          </>
        ) : !data ? (
          <LoadingState />
        ) : eligible ? (
          <>
            {shareError ? <FormBanner kind="error" message={shareError} /> : null}
            <Text style={styles.explainer}>{EXPLAINER}</Text>
            <View style={styles.codeBox}>
              <Text style={styles.code} accessibilityLabel={`Your code: ${data.code.split("").join(", ")}`}>
                {spacedCode(data.code)}
              </Text>
            </View>
            <Text style={styles.format}>{FORMAT_NOTE}</Text>
            <Text style={styles.eligibility}>{ELIGIBILITY_NOTE}</Text>
            <View style={styles.linkWrap}>
              <Link title="How endorsement works" onPress={() => navigation.navigate("HelpEndorsement")} />
            </View>
          </>
        ) : (
          // 8.1b: the whole design is this one note.
          <Text style={styles.closedNote}>{CLOSED_NOTE}</Text>
        )}
      </ScrollView>

      {eligible ? (
        <CtaBar surface="subtle">
          <Button title="Share code" onPress={share} />
        </CtaBar>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  // 8.1: fill color/bg/subtle; the ctaBar takes the same fill.
  root: {
    flex: 1,
    backgroundColor: colors.bg.subtle,
  },
  // 8.1 content: pad 20/16/2/16, gap 14.
  content: {
    paddingTop: 20,
    paddingHorizontal: spacing.gutter,
    paddingBottom: 2,
    gap: 14,
  },
  // 8.1b content: pad 20/16/24/16, gap 14 (no pinned bar below it).
  contentClosed: {
    paddingTop: 20,
    paddingHorizontal: spacing.gutter,
    paddingBottom: spacing.xl,
    gap: 14,
  },
  explainer: {
    ...typography.secondary,
    color: colors.text.primary,
  },
  // codeBox: pad 14/20, r8, fill color/bg/subtle, the code centred.
  codeBox: {
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: radius.input,
    backgroundColor: colors.bg.subtle,
  },
  // mobile/title in color/badge/endorsed — endorsement purple runs through M8.
  code: {
    ...typography.title,
    color: colors.badge.endorsed,
    textAlign: "center",
  },
  format: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  eligibility: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  // Action/Link hugs its label; it does not stretch across the column.
  linkWrap: {
    alignSelf: "flex-start",
  },
  closedNote: {
    ...typography.body,
    color: colors.text.secondary,
  },
});
