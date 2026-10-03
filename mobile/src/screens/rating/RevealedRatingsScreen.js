/**
 * 6.3 / 6.3p — Revealed ratings (FR-RATE-01, FR-RATE-02, FR-RATE-04, FR-RATE-06) — Pawan.
 *
 * Both ratings side by side, each in its own card.
 * Enables writing/editing a public response (capped at 300 chars, FR-RATE-06).
 */
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput } from "react-native";
import { StatusBar } from "expo-status-bar";
import ScreenHeader from "../../components/ScreenHeader";
import Button from "../../components/Button";
import CtaBar from "../../components/CtaBar";
import FormBanner from "../../components/FormBanner";
import LoadingState from "../../components/LoadingState";
import { colors, spacing, radius, typography } from "../../theme/tokens";
import { getEngagementRatings, postPublicResponse } from "../../api/rating.api";
import { parseApiError } from "../../api/client";

function renderStars(score, max = 5) {
  return [1, 2, 3, 4, 5].map((val) => (
    <Text
      key={val}
      style={[
        styles.starChar,
        { color: val <= score ? colors.badge.rating : colors.border.default },
      ]}
    >
      ★
    </Text>
  ));
}

export default function RevealedRatingsScreen({ navigation, route }) {
  const { engagementId, postingTitle, counterpartyName } = route.params || {};

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // Response input mode
  const [writingResponse, setWritingResponse] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [savingResponse, setSavingResponse] = useState(false);

  async function loadRatings() {
    try {
      const res = await getEngagementRatings(engagementId);
      setData(res.data);
      if (res.data?.counterpartyRating?.publicResponse) {
        setResponseText(res.data.counterpartyRating.publicResponse);
      }
    } catch (err) {
      setError(parseApiError(err).formError || "Could not load ratings.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRatings();
  }, [engagementId]);

  async function handleSaveResponse() {
    if (!responseText.trim() || !data?.counterpartyRating?.id) return;
    setSavingResponse(true);
    setError(null);
    try {
      await postPublicResponse({
        ratingId: data.counterpartyRating.id,
        response: responseText.trim(),
      });
      setWritingResponse(false);
      await loadRatings();
    } catch (err) {
      setError(parseApiError(err).formError || "Could not save public response.");
    } finally {
      setSavingResponse(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.screen}>
        <ScreenHeader title="Ratings" onBack={() => navigation.goBack()} />
        <LoadingState />
      </View>
    );
  }

  const myRating = data?.myRating;
  const counterpartyRating = data?.counterpartyRating;
  const existingPublicResponse = counterpartyRating?.publicResponse;

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <ScreenHeader title="Ratings" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content}>
        {error ? <FormBanner kind="error" message={error} /> : null}

        <Text style={styles.contextLine}>
          {postingTitle || "Engagement"}
        </Text>

        {/* Card 1: You rated counterparty */}
        <View style={styles.ratingCard}>
          <Text style={styles.cardHeaderTitle}>
            You rated {counterpartyName || "them"}
          </Text>
          {myRating ? (
            <>
              <View style={styles.starRow}>{renderStars(myRating.score)}</View>
              <Text style={styles.starEcho}>{myRating.score} of 5 stars</Text>
            </>
          ) : (
            <Text style={styles.noRatingText}>No rating submitted</Text>
          )}
        </View>

        {/* Card 2: Counterparty rated you */}
        <View style={styles.ratingCard}>
          <Text style={styles.cardHeaderTitle}>
            {counterpartyName || "Counterparty"} rated you
          </Text>
          {counterpartyRating?.submitted && counterpartyRating.score ? (
            <>
              <View style={styles.starRow}>
                {renderStars(counterpartyRating.score)}
              </View>
              <Text style={styles.starEcho}>
                {counterpartyRating.score} of 5 stars
              </Text>
            </>
          ) : (
            <Text style={styles.noRatingText}>
              {counterpartyRating?.submitted
                ? "Rating in — awaiting reveal"
                : "No rating submitted"}
            </Text>
          )}
        </View>

        {/* Public response text display (6.3p) */}
        {existingPublicResponse && !writingResponse ? (
          <View style={styles.responseBox}>
            <Text style={styles.responseDisplay}>
              Your public response — “{existingPublicResponse}”. Shown next to this rating.
            </Text>
          </View>
        ) : null}

        {/* Writing public response editor (FR-RATE-06) */}
        {writingResponse ? (
          <View style={styles.editorBox}>
            <Text style={styles.editorLabel}>Public response (max 300 characters):</Text>
            <TextInput
              style={styles.editorInput}
              multiline
              maxLength={300}
              placeholder="Write a clear, professional public response..."
              placeholderTextColor={colors.text.secondary}
              value={responseText}
              onChangeText={setResponseText}
            />
            <Text style={styles.charCount}>{responseText.length}/300</Text>
          </View>
        ) : null}

        {/* FR-RATE-04 independence note */}
        <Text style={styles.independenceNote}>
          Each engagement is rated on its own.
        </Text>
      </ScrollView>

      {/* Action Button */}
      {counterpartyRating?.score ? (
        <CtaBar>
          {writingResponse ? (
            <Button
              title={savingResponse ? "Saving..." : "Save response"}
              onPress={handleSaveResponse}
              disabled={savingResponse || !responseText.trim()}
            />
          ) : (
            <Button
              title={existingPublicResponse ? "Edit public response" : "Write a public response"}
              onPress={() => setWritingResponse(true)}
            />
          )}
        </CtaBar>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg.subtle },
  content: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  contextLine: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  ratingCard: {
    backgroundColor: colors.bg.default,
    borderRadius: radius.input,
    paddingVertical: spacing.md,
    paddingHorizontal: 14,
    gap: 6,
  },
  cardHeaderTitle: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  starRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  starChar: {
    fontSize: 22,
    lineHeight: 24,
  },
  starEcho: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  noRatingText: {
    ...typography.secondary,
    color: colors.text.secondary,
    fontStyle: "italic",
  },
  responseBox: {
    backgroundColor: colors.bg.default,
    borderRadius: radius.input,
    padding: spacing.md,
  },
  responseDisplay: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  editorBox: {
    backgroundColor: colors.bg.default,
    borderRadius: radius.input,
    padding: spacing.md,
    gap: spacing.xs,
  },
  editorLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  editorInput: {
    backgroundColor: colors.bg.subtle,
    borderRadius: radius.input,
    padding: spacing.sm,
    ...typography.secondary,
    color: colors.text.primary,
    minHeight: 80,
    textAlignVertical: "top",
  },
  charCount: {
    ...typography.caption,
    color: colors.text.secondary,
    textAlign: "right",
  },
  independenceNote: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
});
