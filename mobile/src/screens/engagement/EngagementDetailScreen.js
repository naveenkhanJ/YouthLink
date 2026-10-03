/**
 * Screen 5.2 / 5.3 — Engagement detail.
 *
 * Requirements: FR-ENG-14, FR-ENG-12, FR-ENG-01.
 * Owner: Naveenkhan (Sprint 4 & 5)
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
import { getEngagement } from "../../api/engagement.api";
import ScreenHeader from "../../components/ScreenHeader";
import Badge from "../../components/Badge";
import Button from "../../components/Button";
import CtaBar from "../../components/CtaBar";
import LoadingState from "../../components/LoadingState";
import { colors, spacing, radius, typography } from "../../theme/tokens";

export default function EngagementDetailScreen({ route, navigation }) {
  const { engagementId } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [engagement, setEngagement] = useState(null);
  const [error, setError] = useState(null);

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

  if (loading) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Engagement" onBack={() => navigation.goBack()} />
        <LoadingState />
      </View>
    );
  }

  if (error || !engagement) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Engagement" onBack={() => navigation.goBack()} />
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error || "Engagement not found"}</Text>
        </View>
      </View>
    );
  }

  const posting = engagement.gigPosting;
  const isPartTime = posting?.arrangementType === "PART_TIME";
  const isActive = engagement.status === "ACTIVE";
  const isWorker = engagement.isWorker;

  const payDisplay =
    posting?.payKind === "UNPAID"
      ? "Unpaid internship"
      : posting?.payAmount
      ? `Rs ${Number(posting.payAmount).toLocaleString()}${
          posting.payRateUnit ? ` per ${posting.payRateUnit.toLowerCase()}` : " for the job"
        }`
      : "Pay specified on start";

  const getCheckpointStateText = (status, codeHolder, isEnterer) => {
    if (status === "CONFIRMED") return "Confirmed";
    if (status === "UNABLE_TO_CONFIRM") return "Disputed / Unconfirmed";
    if (isEnterer) return "Code entry required";
    return "Show code to counterparty";
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Engagement" onBack={() => navigation.goBack()} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Top summary card */}
        <View style={styles.summaryCard}>
          <View style={styles.nameRow}>
            <Text style={styles.counterparty}>{engagement.counterparty.name}</Text>
          </View>
          <View style={styles.badgesRow}>
            {engagement.counterparty.phoneVerified ? (
              <Badge family="verified" value="default" />
            ) : null}
            <Badge family="engagement" value={engagement.statusDisplay} />
          </View>

          <Text style={styles.postingTitle}>
            {posting?.title} · {payDisplay}
          </Text>

          {posting?.locationAddress ? (
            <Text style={styles.addressText}>
              📍 {posting.locationAddress}
            </Text>
          ) : null}
        </View>

        {/* Checkpoint section for one-off gigs */}
        {!isPartTime ? (
          <View style={styles.checkpointSection}>
            <Text style={styles.sectionHeader}>CHECK-INS</Text>

            {/* Arrival */}
            <View style={styles.checkpointRow}>
              <Text style={styles.checkpointLabel}>Arrival</Text>
              <Text
                style={[
                  styles.checkpointState,
                  engagement.arrivalStatus === "PENDING"
                    ? styles.checkpointActionRequired
                    : engagement.arrivalStatus === "CONFIRMED"
                    ? styles.checkpointConfirmed
                    : styles.checkpointMuted,
                ]}
              >
                {getCheckpointStateText(engagement.arrivalStatus, !isWorker, isWorker)}
              </Text>
            </View>

            {/* Completion */}
            <View style={styles.checkpointRow}>
              <Text style={styles.checkpointLabel}>Completion</Text>
              <Text
                style={[
                  styles.checkpointState,
                  engagement.completionStatus === "PENDING" && engagement.arrivalStatus === "CONFIRMED"
                    ? styles.checkpointActionRequired
                    : engagement.completionStatus === "CONFIRMED"
                    ? styles.checkpointConfirmed
                    : styles.checkpointMuted,
                ]}
              >
                {engagement.arrivalStatus !== "CONFIRMED"
                  ? "Not reached"
                  : getCheckpointStateText(engagement.completionStatus, !isWorker, isWorker)}
              </Text>
            </View>

            {/* Payment */}
            {posting?.payKind !== "UNPAID" ? (
              <View style={styles.checkpointRow}>
                <Text style={styles.checkpointLabel}>Payment</Text>
                <Text
                  style={[
                    styles.checkpointState,
                    engagement.paymentStatus === "PENDING" && engagement.completionStatus === "CONFIRMED"
                      ? styles.checkpointActionRequired
                      : engagement.paymentStatus === "CONFIRMED"
                      ? styles.checkpointConfirmed
                      : styles.checkpointMuted,
                  ]}
                >
                  {engagement.completionStatus !== "CONFIRMED"
                    ? "Not reached"
                    : getCheckpointStateText(engagement.paymentStatus, isWorker, !isWorker)}
                </Text>
              </View>
            ) : null}

            <Pressable
              onPress={() =>
                Alert.alert(
                  "How check-in codes work",
                  "Checkpoints keep both parties safe: the employer shows arrival and completion codes for the worker to enter. For payment, custody flips: the worker holds the payment code until paid."
                )
              }
              style={styles.helpLink}
            >
              <Text style={styles.helpLinkText}>How check-in codes work</Text>
            </Pressable>
          </View>
        ) : null}
      </ScrollView>

      {/* CTA actions */}
      {isActive ? (
        <CtaBar surface="subtle">
          {isPartTime ? (
            <Button
              title="End engagement"
              onPress={() => navigation.navigate("EngagementEnd", { engagementId })}
              style="primary"
            />
          ) : (
            <Button
              title={
                isWorker
                  ? engagement.arrivalStatus === "PENDING"
                    ? "Enter arrival code"
                    : engagement.completionStatus === "PENDING"
                    ? "Enter completion code"
                    : "Show payment code"
                  : engagement.arrivalStatus === "PENDING"
                  ? "Show arrival code"
                  : engagement.completionStatus === "PENDING"
                  ? "Show completion code"
                  : "Enter payment code"
              }
              onPress={() => navigation.navigate("EngagementCode", { engagementId })}
              style="primary"
            />
          )}
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
    gap: spacing.lg,
  },
  summaryCard: {
    backgroundColor: colors.bg.default,
    borderRadius: radius.card,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  counterparty: {
    ...typography.title,
    color: colors.text.primary,
  },
  badgesRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flexWrap: "wrap",
  },
  postingTitle: {
    ...typography.secondary,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  addressText: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  checkpointSection: {
    backgroundColor: colors.bg.default,
    borderRadius: radius.card,
    padding: spacing.lg,
    gap: spacing.md,
  },
  sectionHeader: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  checkpointRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  checkpointLabel: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  checkpointState: {
    ...typography.caption,
  },
  checkpointActionRequired: {
    color: colors.brand.primary,
    fontWeight: "600",
  },
  checkpointConfirmed: {
    color: colors.state.success,
    fontWeight: "600",
  },
  checkpointMuted: {
    color: colors.text.secondary,
  },
  helpLink: {
    marginTop: spacing.sm,
  },
  helpLinkText: {
    ...typography.bodyMedium,
    color: colors.brand.primary,
  },
  errorBox: {
    padding: spacing.lg,
  },
  errorText: {
    ...typography.secondary,
    color: colors.state.danger,
  },
});
