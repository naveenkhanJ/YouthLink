/**
 * Screen 5.5a / 5.5 / 5.4b / 5.4c — Confirm arrival / completion / payment.
 *
 * Requirements: FR-ENG-01, FR-ENG-02, FR-ENG-03, FR-ENG-04.
 * Owner: Naveenkhan (Sprint 5)
 */
import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import { getEngagement, verifyCheckpoint } from "../../api/engagement.api";
import ScreenHeader from "../../components/ScreenHeader";
import CodePanel from "../../components/CodePanel";
import Button from "../../components/Button";
import CtaBar from "../../components/CtaBar";
import LoadingState from "../../components/LoadingState";
import { colors, spacing, radius, typography } from "../../theme/tokens";

export default function EngagementCodeScreen({ route, navigation }) {
  const { engagementId } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [engagement, setEngagement] = useState(null);
  const [enteredCode, setEnteredCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [paymentGatePassed, setPaymentGatePassed] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setError(null);
        const res = await getEngagement(engagementId);
        if (active) setEngagement(res.engagement);
      } catch (err) {
        if (active) setError(err.message || "Failed to load engagement");
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [engagementId]);

  if (loading || !engagement) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Check-in" onBack={() => navigation.goBack()} />
        <LoadingState />
      </View>
    );
  }

  const isWorker = engagement.isWorker;
  const isEmployer = engagement.isEmployer;

  // Determine active checkpoint
  let currentCheckpoint = "arrival";
  if (engagement.arrivalStatus === "CONFIRMED") {
    currentCheckpoint = engagement.completionStatus === "CONFIRMED" ? "payment" : "completion";
  }

  // Custody rules:
  // Arrival: Employer holds, Worker enters
  // Completion: Employer holds, Worker enters
  // Payment: Worker holds, Employer enters
  const isEnterer =
    (currentCheckpoint === "arrival" && isWorker) ||
    (currentCheckpoint === "completion" && isWorker) ||
    (currentCheckpoint === "payment" && isEmployer);

  const checkpointTitle =
    currentCheckpoint === "arrival"
      ? "Confirm arrival"
      : currentCheckpoint === "completion"
      ? "Confirm completion"
      : "Confirm payment";

  const handleVerify = async () => {
    if (enteredCode.length !== 6) {
      setError("Please enter the full 6-digit code");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const res = await verifyCheckpoint(engagementId, {
        checkpoint: currentCheckpoint,
        code: enteredCode,
      });

      Alert.alert(
        "Checkpoint confirmed",
        res.isUnpaid || currentCheckpoint === "payment"
          ? "All checkpoints complete! Ratings are now open."
          : `${checkpointTitle} successful.`,
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("EngagementList"),
          },
        ]
      );
    } catch (err) {
      setError(err.message || "Invalid code. Please check and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title={checkpointTitle} onBack={() => navigation.goBack()} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.contextText}>
            {engagement.gigPosting?.title} · {engagement.counterparty?.name}
          </Text>

          {isEnterer ? (
            <>
              <CodePanel
                view="enterer"
                enteredCode={enteredCode}
                onChangeCode={setEnteredCode}
              />
              <Pressable
                onPress={() =>
                  navigation.navigate("EngagementUnableToConfirm", {
                    engagementId,
                    checkpoint: currentCheckpoint,
                  })
                }
                style={styles.unableLink}
              >
                <Text style={styles.unableLinkText}>Unable to confirm?</Text>
              </Pressable>
            </>
          ) : currentCheckpoint === "payment" && !paymentGatePassed ? (
            <CodePanel
              view="paymentGate"
              onConfirmPaid={() => setPaymentGatePassed(true)}
            />
          ) : (
            <CodePanel
              view="holder"
              code={engagement.myHeldCode || (currentCheckpoint === "arrival" ? "358176" : "274065")}
            />
          )}

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>

      {isEnterer ? (
        <CtaBar surface="subtle">
          <Button
            title={submitting ? "Verifying..." : checkpointTitle}
            onPress={handleVerify}
            disabled={submitting || enteredCode.length !== 6}
            style="primary"
          />
        </CtaBar>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.subtle,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: spacing.gutter,
  },
  card: {
    backgroundColor: colors.bg.default,
    borderRadius: radius.card,
    padding: spacing.lg,
    gap: spacing.md,
  },
  contextText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  unableLink: {
    marginTop: spacing.md,
    alignSelf: "flex-start",
  },
  unableLinkText: {
    ...typography.bodyMedium,
    color: colors.brand.primary,
  },
  errorBox: {
    padding: spacing.sm,
    backgroundColor: colors.bg.subtle,
    borderRadius: radius.sm,
  },
  errorText: {
    ...typography.caption,
    color: colors.state.danger,
  },
});
