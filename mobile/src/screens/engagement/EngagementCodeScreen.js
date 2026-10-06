/**
 * The check-in code screens — whichever one the viewer's live checkpoint needs (FR-ENG-01,
 * FR-ENG-02, FR-ENG-04). Owner: Naveenkhan.
 *
 * Custody decides what is drawn (product-overview.md §6): the employer holds the arrival and
 * completion codes, the worker holds the payment code. The server sends the viewer ONLY the code
 * they hold (`myCode`), so the screen that enters a code never has the answer.
 *
 *   Worker, arrival     → 5.5a  Confirm arrival     — Display/CodePanel {View=Enterer}
 *   Worker, completion  → 5.5   Confirm completion  — then 5.5b "Completion confirmed" when a
 *                                                     payment step follows; back to the detail
 *                                                     when it was the last (unpaid internship)
 *   Worker, payment     → 5.4b  Payment code: "Have you been paid?" {View=PaymentGate} → 5.4c {View=Holder}
 *   Employer, arrival   → "Arrival code" {View=Holder}   (not drawn: 5.4 with arrival's title and instruction)
 *   Employer, completion→ 5.4   Completion code {View=Holder}
 *   Employer, payment   → "Confirm payment" {View=Enterer} (not drawn: 5.5's pattern, M5 "States not drawn")
 *
 * A wrong code (not drawn): the code boxes in their Error state and Feedback/FieldError with the
 * server's message. The attempt is recorded on the server, never locked out.
 */
import { useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import Svg, { Circle, Path } from "react-native-svg";
import { getEngagement, verifyCheckpoint } from "../../api/engagement.api";
import { parseApiError } from "../../api/client";
import ScreenHeader from "../../components/ScreenHeader";
import CodePanel from "../../components/CodePanel";
import Button from "../../components/Button";
import CtaBar from "../../components/CtaBar";
import Link from "../../components/Link";
import FieldError from "../../components/FieldError";
import FormBanner from "../../components/FormBanner";
import LoadingState from "../../components/LoadingState";
import { colors, spacing, typography } from "../../theme/tokens";

/** The copy of each view. Drawn unless marked. */
function copyFor(engagement, checkpoint) {
  const name = engagement.counterparty.name;
  const isWorker = engagement.viewerRole === "WORKER";
  if (isWorker && checkpoint === "arrival") {
    return { title: "Confirm arrival", instruction: `Enter the code ${name} shows you when you arrive.`, cta: "Confirm arrival" };
  }
  if (isWorker && checkpoint === "completion") {
    return {
      title: "Confirm completion",
      instruction: `Enter the code ${name} shows you when the work is done.`,
      cta: "Confirm completion",
    };
  }
  if (isWorker && checkpoint === "payment") {
    return {
      title: "Payment code",
      gateWhy: "Entering it on their phone is what confirms payment. Only share it once the money is in your hand.",
      instruction: `Give this code to ${name} once you have been paid — they enter it to close the engagement.`,
      why: "Entering it on their phone confirms payment — the last checkpoint on this engagement.",
    };
  }
  if (checkpoint === "arrival") {
    // Not drawn: 5.4 with arrival's title and instruction (M5 "States not drawn"). 5.4's `why`
    // names completion, so it is left out here rather than reworded.
    return { title: "Arrival code", instruction: "Show this code to the worker when they arrive." };
  }
  if (checkpoint === "completion") {
    return {
      title: "Completion code",
      instruction: "Show this code to the worker when the work is done.",
      why: "Entering it on their phone is what confirms completion. Only share it when the work is actually finished.",
    };
  }
  // Employer at payment — not drawn: 5.5's pattern with M5's stated instruction.
  return {
    title: "Confirm payment",
    instruction: "Enter the code the worker shows you once you've paid them.",
    cta: "Confirm payment",
  };
}

export default function EngagementCodeScreen({ route, navigation }) {
  const { engagementId } = route.params || {};
  const [engagement, setEngagement] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [paid, setPaid] = useState(false); // 5.4b → 5.4c, the worker said yes
  const [completionDone, setCompletionDone] = useState(false); // 5.5b

  const load = useCallback(async () => {
    try {
      const res = await getEngagement(engagementId);
      setEngagement(res.engagement);
      setLoadError(null);
    } catch (err) {
      setLoadError(parseApiError(err).formError || "This engagement couldn't be loaded.");
    }
  }, [engagementId]);

  useEffect(() => {
    load();
  }, [load]);

  const checkpoint = engagement?.liveCheckpoint ?? null;

  // Nothing to do here any more (confirmed meanwhile, cancelled…): back to the engagement.
  useEffect(() => {
    if (engagement && !checkpoint && !completionDone) navigation.goBack();
  }, [engagement, checkpoint, completionDone, navigation]);

  if (!engagement || (!checkpoint && !completionDone)) {
    return (
      <View style={[styles.root, styles.rootSubtle]}>
        <StatusBar style="dark" />
        <ScreenHeader title="Check-in" onBack={() => navigation.goBack()} />
        <View style={styles.content}>
          {loadError ? <FormBanner kind="error" message={loadError} /> : <LoadingState />}
        </View>
      </View>
    );
  }

  const context = `${engagement.posting.title} · ${engagement.counterparty.name}`;

  // 5.5b — completion confirmed, payment next (worker, paid arrangement).
  if (completionDone) {
    return (
      <View style={[styles.root, styles.rootSubtle]}>
        <StatusBar style="dark" />
        <ScreenHeader title="Confirm completion" onBack={() => navigation.goBack()} />
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
          <Text style={styles.context}>{context}</Text>
          <Svg width={48} height={48} viewBox="0 0 48 48" accessibilityLabel="Confirmed">
            <Circle cx={24} cy={24} r={22.75} stroke={colors.state.success} strokeWidth={2.5} fill="none" />
            <Path
              d="M13 24L20 31L35 16"
              stroke={colors.state.success}
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </Svg>
          <Text style={styles.confTitle}>Completion confirmed</Text>
          <Text style={styles.confBody}>
            {`Both of you can see the work is done. Next: payment — once the money is in your hand, ${engagement.counterparty.name} enters your payment code.`}
          </Text>
        </ScrollView>
        <CtaBar surface="subtle">
          <Button
            title="Show my payment code"
            onPress={() => {
              setCompletionDone(false); // → 5.4b, with the payment code already loaded
              setPaid(false);
            }}
          />
          <Button title="Not now" style="secondary" onPress={() => navigation.goBack()} />
        </CtaBar>
      </View>
    );
  }

  const copy = copyFor(engagement, checkpoint);
  const isEnterer = engagement.liveRole === "ENTERER";

  async function submit() {
    if (submitting || code.length !== 6) return;
    setSubmitting(true);
    setCodeError(null);
    try {
      const result = await verifyCheckpoint(engagementId, { checkpoint, code });
      if (checkpoint === "completion" && result.nextCheckpoint === "payment") {
        // 5.5 → 5.5b. Reload first: the payment code is only sent once completion is confirmed.
        setCode("");
        setCompletionDone(true);
        await load();
      } else {
        // Arrival → 5.2h; the last checkpoint → the detail, now Completed with "Rate now" (5.3b).
        navigation.goBack();
      }
    } catch (err) {
      setCodeError(parseApiError(err).formError || "That code couldn't be checked. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // ---- Enterer: 5.5a, 5.5, and the employer's payment entry ----
  if (isEnterer) {
    return (
      <View style={styles.root}>
        <StatusBar style="dark" />
        <ScreenHeader title={copy.title} onBack={() => navigation.goBack()} />
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.context}>{context}</Text>
          {engagement.codesMissing ? (
            <FormBanner
              kind="error"
              message="No check-in codes were issued for this engagement, so this checkpoint can't be confirmed by code."
            />
          ) : (
            <>
              <CodePanel
                view="enterer"
                instruction={copy.instruction}
                enteredCode={code}
                onChangeCode={(value) => {
                  setCode(value);
                  if (codeError) setCodeError(null);
                }}
                error={codeError}
              />
              <FieldError message={codeError} />
            </>
          )}
          <View style={styles.spacerGrow} />
          {/* FR-ENG-03: the fallback at every checkpoint (5.6). */}
          <Link
            title="Unable to confirm?"
            onPress={() => navigation.navigate("EngagementUnableToConfirm", { engagementId, checkpoint, mode: "unable" })}
          />
        </ScrollView>
        <CtaBar>
          <Button
            title={copy.cta}
            onPress={submit}
            loading={submitting}
            disabled={engagement.codesMissing || code.length !== 6}
          />
        </CtaBar>
      </View>
    );
  }

  // ---- Holder: 5.4, the employer's arrival code, and the worker's 5.4b → 5.4c ----
  const showGate = checkpoint === "payment" && !paid;
  return (
    <View style={[styles.root, styles.rootSubtle]}>
      <StatusBar style="dark" />
      <ScreenHeader title={copy.title} onBack={() => navigation.goBack()} />
      <ScrollView style={styles.scroll} contentContainerStyle={[styles.content, styles.contentNoBar]}>
        <Text style={styles.context}>{context}</Text>
        {engagement.codesMissing || !engagement.myCode ? (
          <FormBanner
            kind="error"
            message="No check-in codes were issued for this engagement, so this checkpoint can't be confirmed by code."
          />
        ) : showGate ? (
          <>
            <CodePanel view="paymentGate" onConfirmPaid={() => setPaid(true)} />
            <Text style={styles.why}>{copy.gateWhy}</Text>
          </>
        ) : (
          <>
            <CodePanel view="holder" code={engagement.myCode} instruction={copy.instruction} />
            {copy.why ? <Text style={styles.why}>{copy.why}</Text> : null}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // The enterer screens are white (5.5a, 5.5); the holder screens and 5.5b are grey (5.4, 5.4b).
  root: {
    flex: 1,
    backgroundColor: colors.bg.default,
  },
  rootSubtle: {
    backgroundColor: colors.bg.subtle,
  },
  scroll: {
    flex: 1,
  },
  // Figma content: pad 16/16/0/16 gap 12 above a pinned bar (5.5a); 16/16/24/16 gap 10 without (5.4).
  content: {
    flexGrow: 1,
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.gutter,
    gap: spacing.md,
  },
  contentNoBar: {
    paddingBottom: spacing.xl,
    gap: 10,
  },
  context: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  why: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  confTitle: {
    ...typography.display,
    color: colors.text.primary,
  },
  confBody: {
    ...typography.body,
    color: colors.text.secondary,
  },
  spacerGrow: {
    flexGrow: 1,
  },
});
