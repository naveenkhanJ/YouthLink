/**
 * Screen 5.7t / 5.10 — Cancel engagement.
 *
 * Requirements: FR-ENG-05, FR-ENG-06, FR-ENG-07, FR-ENG-08.
 * Owner: Naveenkhan (Sprint 5)
 */
import { useState } from "react";
import { View, Text, ScrollView, StyleSheet, Pressable, Alert } from "react-native";
import { cancelEngagement } from "../../api/engagement.api";
import ScreenHeader from "../../components/ScreenHeader";
import Button from "../../components/Button";
import CtaBar from "../../components/CtaBar";
import { colors, spacing, radius, typography } from "../../theme/tokens";

const CANCELLATION_REASONS = [
  { key: "SCHEDULE_CONFLICT", label: "Schedule conflict" },
  { key: "DETAILS_NO_LONGER_SUITABLE", label: "Details no longer suitable" },
  { key: "FOUND_OTHER_WORK", label: "Found other work" },
  { key: "PERSONAL_EMERGENCY", label: "Personal emergency" },
  { key: "OTHER", label: "Other reason" },
];

export default function EngagementCancelScreen({ route, navigation }) {
  const { engagementId, isUrgent } = route.params || {};
  const [selectedReason, setSelectedReason] = useState("SCHEDULE_CONFLICT");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleCancel = async () => {
    try {
      setSubmitting(true);
      setError(null);

      await cancelEngagement(engagementId, { reason: selectedReason });

      Alert.alert(
        "Engagement cancelled",
        "The engagement has been cancelled. The other party has been notified.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("EngagementList"),
          },
        ]
      );
    } catch (err) {
      setError(err.message || "Failed to cancel engagement");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Cancel engagement" onBack={() => navigation.goBack()} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>Select a reason for cancellation</Text>
          <Text style={styles.body}>
            {isUrgent
              ? "This is an urgent engagement. Immediate cancellation will notify the employer right away."
              : "Cancelling an active engagement is recorded in completion statistics."}
          </Text>

          <View style={styles.reasonsList}>
            {CANCELLATION_REASONS.map((r) => {
              const selected = selectedReason === r.key;
              return (
                <Pressable
                  key={r.key}
                  onPress={() => setSelectedReason(r.key)}
                  style={[styles.reasonItem, selected && styles.reasonItemSelected]}
                >
                  <View style={[styles.radioCircle, selected && styles.radioCircleSelected]}>
                    {selected ? <View style={styles.radioDot} /> : null}
                  </View>
                  <Text style={styles.reasonLabel}>{r.label}</Text>
                </Pressable>
              );
            })}
          </View>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>

      <CtaBar surface="subtle">
        <Button
          title={submitting ? "Cancelling..." : "Confirm cancellation"}
          onPress={handleCancel}
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
  reasonsList: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  reasonItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderRadius: radius.input,
    borderWidth: 1.5,
    borderColor: colors.border.default,
    gap: spacing.sm,
  },
  reasonItemSelected: {
    borderColor: colors.brand.primary,
    backgroundColor: colors.bg.brandTint,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border.default,
    alignItems: "center",
    justifyContent: "center",
  },
  radioCircleSelected: {
    borderColor: colors.brand.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.brand.primary,
  },
  reasonLabel: {
    ...typography.bodyMedium,
    color: colors.text.primary,
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
