/**
 * 6.1 / 6.1e / 6.1f — Rate this engagement (FR-RATE-01, FR-RATE-02, FR-RATE-05) — Pawan.
 *
 * Requirements:
 *   - FR-RATE-01: 1 to 5 whole stars only, no accompanying free-text review field.
 *   - FR-RATE-02: Double-blind: ratings hidden until both submit or 14 days pass.
 *     Submission closes permanently at reveal (6.1f).
 */
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import ScreenHeader from "../../components/ScreenHeader";
import Button from "../../components/Button";
import CtaBar from "../../components/CtaBar";
import FormBanner from "../../components/FormBanner";
import LoadingState from "../../components/LoadingState";
import { colors, spacing, radius, typography } from "../../theme/tokens";
import { submitRating, getEngagementRatings } from "../../api/rating.api";
import { parseApiError } from "../../api/client";

export default function RateEngagementScreen({ navigation, route }) {
  const { engagementId, postingTitle, counterpartyName } = route.params || {};

  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    async function loadStatus() {
      try {
        const res = await getEngagementRatings(engagementId);
        const data = res.data;
        if (data.isRevealed) {
          // If already revealed and user has rating -> go to revealed screen
          if (data.myRating) {
            navigation.replace("RatingRevealed", {
              engagementId,
              postingTitle,
              counterpartyName,
            });
            return;
          }
          // If revealed and user hasn't rated -> 6.1f submission is closed!
          setIsClosed(true);
        } else if (data.myRating) {
          // User already rated, awaiting counterparty
          navigation.replace("RatingAwaiting", {
            engagementId,
            postingTitle,
            counterpartyName,
            revealDeadline: data.revealDeadline,
          });
          return;
        }
      } catch (err) {
        // If error loading, stay on form
      } finally {
        setLoading(false);
      }
    }

    if (engagementId) {
      loadStatus();
    } else {
      setLoading(false);
    }
  }, [engagementId, navigation, postingTitle, counterpartyName]);

  async function handleSubmit() {
    if (score < 1 || score > 5) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await submitRating({ engagementId, score });
      if (res.revealed) {
        navigation.replace("RatingRevealed", {
          engagementId,
          postingTitle,
          counterpartyName,
        });
      } else {
        navigation.replace("RatingAwaiting", {
          engagementId,
          postingTitle,
          counterpartyName,
        });
      }
    } catch (err) {
      setError(parseApiError(err).formError || "Could not submit rating. Please try again.");
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.screen}>
        <ScreenHeader title="Rate" onBack={() => navigation.goBack()} />
        <LoadingState />
      </View>
    );
  }

  // 6.1f — Closed at reveal
  if (isClosed) {
    return (
      <View style={styles.screenSubtle}>
        <StatusBar style="dark" />
        <ScreenHeader title="Rate" onBack={() => navigation.goBack()} />
        <View style={styles.content}>
          <Text style={styles.contextLine}>
            {postingTitle || "Engagement"} · {counterpartyName || "Counterparty"}
          </Text>
          <Text style={styles.questionTitle}>Rating is closed</Text>
          <Text style={styles.closedBody}>
            The reveal date passed, so ratings for this engagement are final. Submitting now — after you can see their rating — wouldn't be fair to either of you.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <ScreenHeader title="Rate" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content}>
        {error ? <FormBanner kind="error" message={error} /> : null}

        <Text style={styles.contextLine}>
          {postingTitle || "Engagement"} · {counterpartyName || "Counterparty"}
        </Text>

        <Text style={styles.questionTitle}>
          How was working with {counterpartyName || "them"}?
        </Text>

        {/* 1-5 Star Selection (FR-RATE-01) */}
        <View style={styles.starRow}>
          {[1, 2, 3, 4, 5].map((val) => {
            const isFilled = val <= score;
            return (
              <Pressable
                key={val}
                style={styles.starTouch}
                onPress={() => setScore(val)}
                accessibilityRole="button"
                accessibilityLabel={`${val} star`}
              >
                <Text
                  style={[
                    styles.starChar,
                    { color: isFilled ? colors.badge.rating : colors.border.default },
                  ]}
                >
                  ★
                </Text>
              </Pressable>
            );
          })}
        </View>

        {score > 0 ? (
          <Text style={styles.scoreEcho}>{score} of 5 stars</Text>
        ) : null}

        {/* Double-Blind Note (FR-RATE-02) */}
        <Text style={styles.blindNote}>
          They won't see your rating until you've both rated, or 14 days pass from when rating opened.
        </Text>
      </ScrollView>

      <CtaBar>
        <Button
          title={submitting ? "Submitting..." : "Submit rating"}
          onPress={handleSubmit}
          disabled={score === 0 || submitting}
        />
      </CtaBar>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg.default },
  screenSubtle: { flex: 1, backgroundColor: colors.bg.subtle },
  content: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  contextLine: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  questionTitle: {
    ...typography.title,
    color: colors.text.primary,
  },
  starRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginVertical: spacing.sm,
  },
  starTouch: {
    padding: spacing.xs,
  },
  starChar: {
    fontSize: 36,
    lineHeight: 40,
  },
  scoreEcho: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  blindNote: {
    ...typography.secondary,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  closedBody: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
});
