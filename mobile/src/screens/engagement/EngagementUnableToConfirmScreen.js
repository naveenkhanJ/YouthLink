/**
 * Screen 5.6 — Unable to confirm · opening a dispute.
 *
 * Requirements: FR-ENG-03.
 * Owner: Naveenkhan (Sprint 5)
 */
import { useState } from "react";
import { View, Text, ScrollView, StyleSheet, Alert } from "react-native";
import { unableToConfirmCheckpoint } from "../../api/engagement.api";
import ScreenHeader from "../../components/ScreenHeader";
import Button from "../../components/Button";
import CtaBar from "../../components/CtaBar";
import TextField from "../../components/TextField";
import { colors, spacing, radius, typography } from "../../theme/tokens";

export default function EngagementUnableToConfirmScreen({ route, navigation }) {
  const { engagementId, checkpoint } = route.params || {};
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);

      await unableToConfirmCheckpoint(engagementId, {
        checkpoint: checkpoint || "arrival",
        reason: reason.trim() || undefined,
      });

      Alert.alert(
        "Dispute initiated",
        "Your report has been submitted. The engagement is now marked as Disputed for review.",
        [
          {
            text: "Done",
            onPress: () => navigation.navigate("EngagementList"),
          },
        ]
      );
    } catch (err) {
      setError(err.message || "Failed to submit dispute");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Unable to confirm" onBack={() => navigation.goBack()} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>Having trouble exchanging codes?</Text>
          <Text style={styles.body}>
            If you cannot confirm this checkpoint because the other party is unreachable,
            unwilling to share their code, or the code fails repeatedly, you can submit an
            issue report. This moves the engagement to Disputed status.
          </Text>

          <TextField
            label="What happened? (optional)"
            value={reason}
            onChangeText={setReason}
            placeholder="Explain the situation..."
          />

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>

      <CtaBar surface="subtle">
        <Button
          title={submitting ? "Submitting..." : "Report issue & open dispute"}
          onPress={handleSubmit}
          disabled={submitting}
          style="danger"
        />
      </CtaBar>
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
  title: {
    ...typography.title,
    color: colors.text.primary,
  },
  body: {
    ...typography.secondary,
    color: colors.text.secondary,
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
