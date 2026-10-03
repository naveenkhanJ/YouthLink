/**
 * Revealed ratings — prototype 6.3, 6.3p (a public response exists) and 6.3s (this person never
 * rated; the 14-day window revealed only the other rating). FR-RATE-01, FR-RATE-02 — Pawan.
 *
 * Route: RatingRevealed { engagementId }. Reached when the second rating lands (6.1 -> 6.3) and
 * from the engagement's "See ratings" link (M5 5.2d).
 *
 * Both ratings side by side, each in its own card. "Neither card is a component" (M6 6.3): they are
 * plain frames — so the two cards are drawn here, not taken from the shared kit. The stars are the
 * same STAR shape the kit's StarInput / StarsDisplay use, at 20px and 6 apart.
 *
 * 6.3s: "didn't rate" shows *no stars at all* — never zero stars — because "didn't rate" and
 * "rated badly" must not look alike.
 *
 * Not built here, pending a ruling (FR-RATE-06 is outside this sprint's cards): 6.3's pinned
 * "Write a public response" / "Edit your response" button (-> 6.4) and 6.3s's
 * "Request removal — policy violation" link (-> 6.5). See the report to Afham.
 */
import { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import ScreenHeader from "../../components/ScreenHeader";
import StarShape from "../../components/StarShape";
import FormBanner from "../../components/FormBanner";
import LoadingState from "../../components/LoadingState";
import { colors, radius, spacing, typography, elevation } from "../../theme/tokens";
import { getEngagementRatings } from "../../api/rating.api.js";
import { parseApiError } from "../../api/client.js";
import { contextLine, screenForStage } from "./rating.format.js";

const INDEPENDENCE = "Each engagement is rated on its own.";

/** Figma `stars` 124x20: five 20px stars, 6 apart; filled ones color/badge/rating, the rest border. */
function Stars({ score }) {
  return (
    <View
      style={styles.stars}
      accessible
      accessibilityLabel={`${score} of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <StarShape key={n} size={20} color={n <= score ? colors.badge.rating : colors.border.default} />
      ))}
    </View>
  );
}

/** One rating card: who · stars · "N of 5 stars" (the count in text, never colour alone). */
function RatingCard({ who, score }) {
  return (
    <View style={styles.card}>
      <Text style={styles.who}>{who}</Text>
      <Stars score={score} />
      <Text style={styles.echo}>{score} of 5 stars</Text>
    </View>
  );
}

export default function RevealedRatingsScreen({ navigation, route }) {
  const { engagementId } = route.params || {};
  const [state, setState] = useState(null);
  const [loadError, setLoadError] = useState(null);

  const load = useCallback(async () => {
    try {
      const { ratings } = await getEngagementRatings(engagementId);
      const target = screenForStage(ratings);
      if (!target) {
        setLoadError("Rating isn't open for this engagement.");
        return;
      }
      // Not revealed yet: this screen must not be the one showing it (double-blind).
      if (target !== "RatingRevealed") {
        navigation.replace(target, { engagementId });
        return;
      }
      setState(ratings);
      setLoadError(null);
    } catch (err) {
      setLoadError(parseApiError(err).formError);
    }
  }, [engagementId, navigation]);

  useEffect(() => {
    load();
  }, [load]);

  let body;
  if (!state) {
    // M6 "States not drawn": Feedback/LoadingState in place of the two rating cards.
    body = loadError ? <FormBanner kind="error" message={loadError} /> : <LoadingState />;
  } else {
    const { myRating, theirRating, counterpartyName } = state;
    body = (
      <>
        {/* 6.3 names only the job (the cards name the person); 6.3s, whose first card names
            no one, carries the name in the context line. */}
        <Text style={styles.context}>{myRating ? state.postingTitle : contextLine(state)}</Text>

        {myRating ? (
          <RatingCard who={`You rated ${counterpartyName}`} score={myRating.score} />
        ) : (
          // 6.3s `rating-you-none`: no stars at all.
          <View style={styles.card}>
            <Text style={styles.who}>You didn't rate this engagement</Text>
            <Text style={styles.echo}>Submission closed at reveal</Text>
          </View>
        )}

        {/* The other party's card. When they never rated (the window closed on this person's
            rating alone) the prototype draws nothing for it, so nothing is shown — see report. */}
        {theirRating ? (
          <RatingCard who={`${counterpartyName} rated you`} score={theirRating.score} />
        ) : null}

        {/* 6.3p: the response this person posted to the rating they received. */}
        {theirRating?.publicResponse ? (
          <Text style={styles.responseText}>
            Your public response — “{theirRating.publicResponse}” Shown next to this rating.
          </Text>
        ) : null}

        <Text style={styles.independence}>{INDEPENDENCE}</Text>
      </>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScreenHeader title="Ratings" onBack={() => navigation.goBack()} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {body}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // 6.3 is a grey screen (fill color/bg/subtle) with white cards.
  root: {
    flex: 1,
    backgroundColor: colors.bg.subtle,
  },
  scroll: {
    flex: 1,
  },
  // Figma `content`: vertical, pad 20/16/·/16, gap 12. No ctaBar is drawn here for now, so the
  // bottom pad is 6.3s's 24 rather than 6.3's 0 (which sits on a ctaBar).
  content: {
    flexGrow: 1,
    paddingTop: 20,
    paddingHorizontal: spacing.gutter,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  context: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  // Figma `rating-…` frame: vertical, pad 12/14/12/14, gap 6, fill color/bg/default, r8, elevation/card.
  card: {
    paddingVertical: spacing.md,
    paddingHorizontal: 14,
    gap: 6,
    backgroundColor: colors.bg.default,
    borderRadius: radius.input,
    ...elevation.card,
  },
  who: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  stars: {
    flexDirection: "row",
    gap: 6,
  },
  echo: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  responseText: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  independence: {
    ...typography.caption,
    color: colors.text.secondary,
  },
});
