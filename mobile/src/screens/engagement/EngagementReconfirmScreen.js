/**
 * Screen 5.11 — Posting changed · re-confirm the new start.
 *
 * Requirements: FR-ENG-09, FR-ENG-10, FR-ENG-11.
 * Owner: Naveenkhan (Sprint 5)
 */
import { useState } from "react";
import { View, Text, ScrollView, StyleSheet, Alert } from "react-native";
import { reconfirmMaterialChange } from "../../api/engagement.api";
import ScreenHeader from "../../components/ScreenHeader";
import Button from "../../components/Button";
import CtaBar from "../../components/CtaBar";
import { colors, spacing, radius, typography } from "../../theme/tokens";

export default function EngagementReconfirmScreen({ route, navigation }) {
  const { engagementId } = route.params || {};
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleResponse = async (accept) => {
    try {
      setSubmitting(true);
      setError(null);

      const res = await reconfirmMaterialChange(engagementId, { accept });

      Alert.alert(
        accept ? "Changes accepted" : "Changes declined",
        res.message || (accept ? "New terms accepted." : "Engagement cancelled."),
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("EngagementList"),
          },
        ]
      );
    } catch (err) {
      setError(err.message || "Failed to update response");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Posting changed" onBack={() => navigation.goBack()} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>Re-confirm the new start</Text>
          <Text style={styles.body}>
            The employer has updated the schedule or pay details for this gig. Please review and confirm whether you can still take this assignment.
          </Text>

          <View style={styles.noticeBox}>
            <Text style={styles.noticeText}>
              If you decline, the engagement will be cancelled without any penalty to your completion record.
            </Text>
          </View>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>

      <CtaBar surface="subtle">
        <View style={styles.ctaRow}>
          <Button
            title={submitting ? "..." : "Decline"}
            onPress={() => handleResponse(false)}
            disabled={submitting}
            style="secondary"
          />
          <Button
            title={submitting ? "..." : "Accept new terms"}
            onPress={() => handleResponse(true)}
            disabled={submitting}
            style="primary"
          />
        </View>
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
  noticeBox: {
    backgroundColor: colors.bg.brandTint,
    borderRadius: radius.sm,
    padding: spacing.md,
  },
  noticeText: {
    ...typography.caption,
    color: colors.brand.primary,
  },
  ctaRow: {
    flexDirection: "row",
    gap: spacing.md,
    width: "100%",
    justifyContent: "space-between",
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
