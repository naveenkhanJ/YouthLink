/**
 * Rate this engagement — prototype 6.1 (worker), 6.1e (employer), 6.6 / 6.6n (a cancelled
 * engagement) and 6.1f (closed at reveal). FR-RATE-01, FR-RATE-02 — Pawan.
 *
 * Route: RatingRate { engagementId }. This is the single entry point the engagement screens and
 * the "Rate your engagement" notification open; the screen asks the server which moment it is:
 *   OPEN, not rated            -> 6.1 / 6.1e (the same frame for both roles, different cast), or
 *                                 6.6 for a cancelled engagement (FR-RATE-05's survival note)
 *   rated, awaiting the other  -> replaced by RatingAwaiting (6.2)
 *   revealed, rated            -> replaced by RatingRevealed (6.3)
 *   revealed, never rated      -> 6.1f: "Rating is closed", with no submit control at all —
 *                                 absent, not disabled, because there is nothing to submit
 *
 * FR-RATE-01: five whole stars (Input/StarInput) and nothing else — no free-text field.
 * Submit stays disabled and inert until a star is chosen (M6 "States not drawn", first rule).
 */
import { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import ScreenHeader from "../../components/ScreenHeader";
import StarInput from "../../components/StarInput";
import Button from "../../components/Button";
import CtaBar from "../../components/CtaBar";
import FormBanner from "../../components/FormBanner";
import LoadingState from "../../components/LoadingState";
import { colors, spacing, typography } from "../../theme/tokens";
import { getEngagementRatings, submitRating } from "../../api/rating.api.js";
import { parseApiError } from "../../api/client.js";
import { contextLine, screenForStage } from "./rating.format.js";

// Exact prototype copy (M6 6.1, 6.6, 6.1f).
const BLIND_NOTE =
  "They won't see your rating until you've both rated, or 14 days pass from when rating opened.";
const SURVIVAL_NOTE = "This engagement was cancelled, but you can still rate how it was handled.";
const CLOSED_TITLE = "Rating is closed";
const CLOSED_BODY =
  "The reveal date passed, so ratings for this engagement are final. Submitting now — after you can see their rating — wouldn't be fair to either of you.";
const NOT_OPEN = "Rating isn't open for this engagement.";

export default function RateEngagementScreen({ navigation, route }) {
  const { engagementId } = route.params || {};
  const [state, setState] = useState(null); // the server's rating state
  const [loadError, setLoadError] = useState(null);
  const [score, setScore] = useState(0); // 0 = no star chosen yet (StarInput State=Empty)
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const load = useCallback(async () => {
    try {
      const { ratings } = await getEngagementRatings(engagementId);
      // Rated already: this is not the screen for the moment, so hand over to the one that is.
      if (ratings.myRating) {
        navigation.replace(screenForStage(ratings), { engagementId });
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

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const { revealed } = await submitRating({ engagementId, score });
      // 6.1 leads to 6.2; when this was the second rating, both are revealed at once (6.3).
      navigation.replace(revealed ? "RatingRevealed" : "RatingAwaiting", { engagementId });
    } catch (err) {
      setSubmitting(false);
      if (err.status === 409) {
        // The window closed (or the pair revealed) while this screen was open: show the moment
        // as it now is — 6.1f, or the pair if this person's rating did land.
        await load();
      }
      setSubmitError(parseApiError(err).formError);
    }
  }

  const header = <ScreenHeader title="Rate" onBack={() => navigation.goBack()} />;

  // Loading, or the first load failed: the header stays, the content is the loading card or the
  // error banner (design-system.md §8).
  if (!state) {
    return (
      <View style={styles.root}>
        <StatusBar style="dark" />
        {header}
        <View style={[styles.content, styles.contentNoBar]}>
          {loadError ? <FormBanner kind="error" message={loadError} /> : <LoadingState />}
        </View>
      </View>
    );
  }

  // Not drawn: the engagement screens only offer rating once it is open. If it is reached anyway
  // (e.g. a no-show ruling skipped rating, FR-ADM-08) the server's message is shown.
  if (state.stage === "NOT_OPEN") {
    return (
      <View style={styles.root}>
        <StatusBar style="dark" />
        {header}
        <View style={[styles.content, styles.contentNoBar]}>
          <FormBanner kind="error" message={NOT_OPEN} />
        </View>
      </View>
    );
  }

  // 6.1f — submission closed at reveal (FR-RATE-02 amendment). Grey screen, no ctaBar.
  if (!state.canSubmit) {
    return (
      <View style={[styles.root, styles.rootSubtle]}>
        <StatusBar style="dark" />
        {header}
        <ScrollView style={styles.scroll} contentContainerStyle={[styles.content, styles.contentNoBar]}>
          <Text style={styles.context}>{contextLine(state)}</Text>
          <Text style={styles.question}>{CLOSED_TITLE}</Text>
          <Text style={styles.closedBody}>{CLOSED_BODY}</Text>
        </ScrollView>
      </View>
    );
  }

  // 6.1 / 6.1e, or 6.6 for a cancelled engagement.
  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      {header}
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {submitError ? <FormBanner kind="error" message={submitError} /> : null}
        <Text style={styles.context}>
          {state.isCancelled ? `${state.postingTitle} · Cancelled` : contextLine(state)}
        </Text>
        {state.isCancelled ? <Text style={styles.survivalNote}>{SURVIVAL_NOTE}</Text> : null}
        <Text style={styles.question}>How was working with {state.counterpartyName}?</Text>
        <StarInput value={score} onChange={setScore} />
        <Text style={styles.blindNote}>{BLIND_NOTE}</Text>
      </ScrollView>
      <CtaBar>
        <Button
          title="Submit rating"
          onPress={handleSubmit}
          disabled={score === 0}
          loading={submitting}
        />
      </CtaBar>
    </View>
  );
}

const styles = StyleSheet.create({
  // 6.1 is a white screen (fill color/bg/default); 6.1f is grey (color/bg/subtle).
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
  // Figma `content`: vertical, pad 20/16/2/16, gap 14 (14 and 20 are the frame's own literals).
  // The 2 at the bottom is max(0, gap − 12): the last line clears the pinned bar by the gap.
  // flexGrow stands in for `spacer-grow`, so short content still fills the region.
  content: {
    flexGrow: 1,
    paddingTop: 20,
    paddingHorizontal: spacing.gutter,
    paddingBottom: 2,
    gap: 14,
  },
  // 6.1f has no ctaBar, so its content is padded 20/16/24/16.
  contentNoBar: {
    paddingBottom: spacing.xl,
  },
  context: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  survivalNote: {
    ...typography.body,
    color: colors.text.secondary,
  },
  question: {
    ...typography.title,
    color: colors.text.primary,
  },
  blindNote: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  closedBody: {
    ...typography.body,
    color: colors.text.secondary,
  },
});
