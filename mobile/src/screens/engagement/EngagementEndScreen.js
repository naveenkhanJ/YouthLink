/**
 * Screen for End Engagement (FR-ENG-12 / YL-66).
 *
 * Requirements:
 * - "did something go wrong?" prompt
 * - "no" answer -> proceeds to rating (FR-RATE-01)
 * - "yes" answer -> routes to dispute case creation before rating
 * Owner: Naveenkhan (Sprint 4)
 */
import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import { endEngagement } from "../../api/engagement.api";
import ScreenHeader from "../../components/ScreenHeader";
import Button from "../../components/Button";
import CtaBar from "../../components/CtaBar";
import TextField from "../../components/TextField";
import { colors, spacing, radius, typography } from "../../theme/tokens";

export default function EngagementEndScreen({ route, navigation }) {
  const { engagementId } = route.params || {};
  const [didSomethingGoWrong, setDidSomethingGoWrong] = useState(false);
  const [issueDetails, setIssueDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);

      const res = await endEngagement(engagementId, {
        didSomethingGoWrong,
        issueDetails: didSomethingGoWrong ? issueDetails : undefined,
      });

      if (didSomethingGoWrong) {
        Alert.alert(
          "Dispute opened",
          "Your dispute has been logged. A moderator will review it before ratings open.",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate("EngagementList"),
            },
          ]
        );
      } else {
        Alert.alert(
          "Engagement ended",
          "The engagement has ended successfully. Double-blind rating is now open.",
          [
            {
              text: "Done",
              onPress: () => navigation.navigate("EngagementList"),
            },
          ]
        );
      }
    } catch (err) {
      setError(err.message || "Failed to end engagement");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="End engagement" onBack={() => navigation.goBack()} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.promptTitle}>Did something go wrong?</Text>
          <Text style={styles.promptBody}>
            Ending a part-time engagement will conclude your active arrangement. Please let us know if you encountered any issues.
          </Text>

          {/* Options: No / Yes */}
          <View style={styles.optionsGroup}>
            <Pressable
              onPress={() => setDidSomethingGoWrong(false)}
              style={[
                styles.optionCard,
                !didSomethingGoWrong && styles.optionSelected,
              ]}
            >
              <View style={styles.radioRow}>
                <View
                  style={[
                    styles.radioCircle,
                    !didSomethingGoWrong && styles.radioCircleSelected,
                  ]}
                >
                  {!didSomethingGoWrong && <View style={styles.radioDot} />}
                </View>
                <Text style={styles.optionTitle}>No, everything went fine</Text>
              </View>
              <Text style={styles.optionDescription}>
                The gig ran smoothly. Proceed straight to double-blind rating.
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setDidSomethingGoWrong(true)}
              style={[
                styles.optionCard,
                didSomethingGoWrong && styles.optionSelected,
              ]}
            >
              <View style={styles.radioRow}>
                <View
                  style={[
                    styles.radioCircle,
                    didSomethingGoWrong && styles.radioCircleSelected,
                  ]}
                >
                  {didSomethingGoWrong && <View style={styles.radioDot} />}
                </View>
                <Text style={styles.optionTitle}>Yes, there was an issue</Text>
              </View>
              <Text style={styles.optionDescription}>
                Open a dispute case before ratings are submitted.
              </Text>
            </Pressable>
          </View>

          {didSomethingGoWrong ? (
            <View style={styles.issueContainer}>
              <TextField
                label="Please describe what went wrong"
                value={issueDetails}
                onChangeText={setIssueDetails}
                placeholder="Details of the issue..."
              />
            </View>
          ) : null}

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>

      <CtaBar surface="subtle">
        <Button
          title={
            submitting
              ? "Submitting..."
              : didSomethingGoWrong
              ? "Submit & open dispute"
              : "End & proceed to rating"
          }
          onPress={handleSubmit}
          disabled={submitting}
          style={didSomethingGoWrong ? "secondary" : "primary"}
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
  promptTitle: {
    ...typography.title,
    color: colors.text.primary,
  },
  promptBody: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  optionsGroup: {
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  optionCard: {
    borderWidth: 1.5,
    borderColor: colors.border.default,
    borderRadius: radius.input,
    padding: spacing.md,
    gap: spacing.xs,
  },
  optionSelected: {
    borderColor: colors.brand.primary,
    backgroundColor: colors.bg.brandTint,
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
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
  optionTitle: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  optionDescription: {
    ...typography.caption,
    color: colors.text.secondary,
    marginLeft: 28,
  },
  issueContainer: {
    marginTop: spacing.md,
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
