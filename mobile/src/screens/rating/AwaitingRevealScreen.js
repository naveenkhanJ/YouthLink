/**
 * Awaiting reveal — prototype 6.2 (worker), 6.2e (employer), 6.6b / 6.6d / 6.6nb (a cancelled
 * engagement). FR-RATE-02 — Pawan.
 *
 * Route: RatingAwaiting { engagementId }. Reached right after submitting (6.1 -> 6.2) and from
 * the engagement's "View status" link. The other party's rating is never shown here — the server
 * does not even send it until the reveal (double-blind).
 *
 * "The date is computed, not stored per rating" (M6 6.2): the unlock date is
 * Engagement.ratingOpenedAt + 14 days, which the server sends as `revealAt`.
 *
 * If the pair has been revealed since (the other party rated, or the 14 days ran out), the screen
 * hands over to RatingRevealed (6.3); it re-checks whenever it comes back into view.
 */
import { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import Svg, { Circle, Path } from "react-native-svg";
import ScreenHeader from "../../components/ScreenHeader";
import Button from "../../components/Button";
import CtaBar from "../../components/CtaBar";
import FormBanner from "../../components/FormBanner";
import LoadingState from "../../components/LoadingState";
import { colors, spacing, typography } from "../../theme/tokens";
import { getEngagementRatings } from "../../api/rating.api.js";
import { parseApiError } from "../../api/client.js";
import { contextLine, formatDay, screenForStage } from "./rating.format.js";

/**
 * Figma `sentGlyph` 48x48: an ellipse stroked 2.5 in color/state/success, and a 22x16 check
 * stroked 3 at (13,17). The ring sits inside the 48 box (radius 24 − 2.5/2).
 */
function SentGlyph() {
  return (
    <Svg width={48} height={48} viewBox="0 0 48 48" fill="none">
      <Circle cx={24} cy={24} r={22.75} stroke={colors.state.success} strokeWidth={2.5} />
      <Path
        d="M13 25L21 33L35 17"
        stroke={colors.state.success}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default function AwaitingRevealScreen({ navigation, route }) {
  const { engagementId } = route.params || {};
  const [state, setState] = useState(null);
  const [loadError, setLoadError] = useState(null);

  const load = useCallback(async () => {
    try {
      const { ratings } = await getEngagementRatings(engagementId);
      const target = screenForStage(ratings);
      if (!target) {
        // NOT_OPEN: nothing is awaiting a reveal (not drawn; the server's own wording).
        setLoadError("Rating isn't open for this engagement.");
        return;
      }
      if (target !== "RatingAwaiting") {
        navigation.replace(target, { engagementId });
        return;
      }
      setState(ratings);
      setLoadError(null);
    } catch (err) {
      setLoadError(parseApiError(err).formError);
    }
  }, [engagementId, navigation]);

  // On open and whenever the screen is returned to, so a reveal is picked up.
  useEffect(() => {
    load();
    return navigation.addListener("focus", load);
  }, [load, navigation]);

  // "Back to engagement" -> the engagement (M5 5.2c / 5.3c / 5.2tcr / 5.11dr). popTo returns to it
  // when it is already in the stack (the usual path: engagement -> rate -> this), and opens it in
  // place of this screen when it is not (e.g. arrived from a notification).
  function backToEngagement() {
    navigation.popTo("EngagementDetail", { engagementId });
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScreenHeader title="Rating" onBack={() => navigation.goBack()} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {state ? (
          <>
            <Text style={styles.context}>{contextLine(state)}</Text>
            <SentGlyph />
            <Text style={styles.selfState}>Your rating is in</Text>
            <Text style={styles.unlockLine}>
              Ratings unlock when both of you have rated, or on {formatDay(state.revealAt)}.
            </Text>
          </>
        ) : loadError ? (
          <FormBanner kind="error" message={loadError} />
        ) : (
          <LoadingState />
        )}
      </ScrollView>
      <CtaBar surface="subtle">
        <Button title="Back to engagement" onPress={backToEngagement} />
      </CtaBar>
    </View>
  );
}

const styles = StyleSheet.create({
  // 6.2 is a grey screen (fill color/bg/subtle); the ctaBar takes the same fill.
  root: {
    flex: 1,
    backgroundColor: colors.bg.subtle,
  },
  scroll: {
    flex: 1,
  },
  // Figma `content`: vertical, pad 20/16/2/16, gap 14; flexGrow stands in for `spacer-grow`.
  content: {
    flexGrow: 1,
    paddingTop: 20,
    paddingHorizontal: spacing.gutter,
    paddingBottom: 2,
    gap: 14,
  },
  context: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  selfState: {
    ...typography.display,
    color: colors.text.primary,
  },
  unlockLine: {
    ...typography.body,
    color: colors.text.secondary,
  },
});
