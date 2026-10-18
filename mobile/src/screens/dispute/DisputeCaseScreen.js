/**
 * Dispute case — one screen for the whole 9.2 family (prototype 9.2, 9.2k, 9.2r, 9.2c, 9.2u,
 * 9.2ur, 9.2e, 9.2f). Requirements FR-DISPUTE-03, FR-DISPUTE-04, FR-DISPUTE-07, FR-NOTIF-12
 * (the DISPUTE_OPENED notification opens it).
 *
 * Params `{ disputeCaseId?, engagementId? }`: a case by its id (5.6 and End engagement after
 * opening it, a notification, 5.2s / 5.3s), or an engagement's current case.
 *
 * Which frame is drawn depends on the case's status and on who is looking (M9: "build one screen
 * and pick the copy and the button from whether the viewer is the opener or the respondent").
 * The wording lives in dispute.format.js:
 *   AWAITING_RESPONSE  opener 9.2 / 9.2k (no button) · respondent 9.2r ("Respond" → 9.3)
 *   UNDER_REVIEW       9.2u · respondent who answered 9.2ur · with a moderator question 9.2c
 *   ESCALATED          9.2e (no name in the context line)
 *   RESOLVED           9.2f, the outcome sentence chosen for the viewer
 *
 * 9.2c's "Answer the question" is NOT offered: the API exposes the question read-only and has no
 * endpoint to answer it (the answer is taken staff-side), so a button would lead nowhere. The
 * question itself is shown under 9.4's "The moderator asked:" label so it is not hidden.
 *
 * States (Error and Offline build spec, E-category): loading → Feedback/LoadingState; a failed
 * first load → Feedback/FormBanner {Kind=Error} with "Try again"; offline after the case loaded →
 * Feedback/OfflineBar over the case as last loaded (NFR-USE-01); an engagement with no case →
 * Feedback/EmptyState. Reloads whenever the screen regains focus (back from 9.3e shows 9.2ur).
 */
import { useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { getCase, getCaseForEngagement } from "../../api/dispute.api";
import { parseApiError } from "../../api/client";
import ScreenHeader from "../../components/ScreenHeader";
import Badge from "../../components/Badge";
import CountdownText from "../../components/CountdownText";
import Button from "../../components/Button";
import CtaBar from "../../components/CtaBar";
import Link from "../../components/Link";
import FormBanner from "../../components/FormBanner";
import OfflineBar from "../../components/OfflineBar";
import EmptyState from "../../components/EmptyState";
import LoadingState from "../../components/LoadingState";
import { colors, spacing, radius, typography } from "../../theme/tokens";
import { caseBadgeValue, caseContextLine, caseCopy, caseTriggerLine } from "./dispute.format";

// DERIVED from the E-spec's "You're offline, so … couldn't be …" pattern (2.9bnr, 4.1bnr) and the
// OfflineBar's "Offline — showing …" (3.1ofl): no frame draws a dispute case offline.
const OFFLINE_FIRST_LOAD = "You're offline, so this case couldn't be loaded. Try again once you reconnect.";
const OFFLINE_SHOWING = "Offline — showing the case as last loaded";

export default function DisputeCaseScreen({ route, navigation }) {
  const { disputeCaseId, engagementId } = route.params ?? {};
  const [dc, setDc] = useState(undefined); // undefined = not loaded yet; null = the engagement has none
  const [error, setError] = useState(null);
  const [offline, setOffline] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = disputeCaseId ? await getCase(disputeCaseId) : await getCaseForEngagement(engagementId);
      setDc(res.case ?? null);
      setError(null);
      setOffline(false);
    } catch (err) {
      if (err.offline) {
        setOffline(true);
        setError(OFFLINE_FIRST_LOAD);
      } else {
        setOffline(false);
        setError(parseApiError(err).formError || "This case couldn't be loaded.");
      }
    }
  }, [disputeCaseId, engagementId]);

  useEffect(() => {
    load();
    return navigation.addListener("focus", load);
  }, [load, navigation]);

  const header = <ScreenHeader title="Dispute case" onBack={() => navigation.goBack()} />;

  // ---- Not loaded: loading, or a failed first load ----
  if (dc === undefined) {
    return (
      <View style={styles.root}>
        <StatusBar style="dark" />
        {header}
        <View style={[styles.content, styles.contentNoBar]}>
          {error ? (
            <>
              <FormBanner kind="error" message={error} />
              <Button title="Try again" style="secondary" onPress={load} />
            </>
          ) : (
            <LoadingState />
          )}
        </View>
      </View>
    );
  }

  // ---- The engagement has never had a case (not drawn) ----
  if (dc === null) {
    return (
      <View style={styles.root}>
        <StatusBar style="dark" />
        {header}
        <View style={[styles.content, styles.contentNoBar]}>
          {/* DERIVED copy: no frame draws an engagement without a case. */}
          <EmptyState title="No dispute case" body="Nothing has been disputed on this engagement." />
        </View>
      </View>
    );
  }

  const copy = caseCopy(dc);
  const trigger = caseTriggerLine(dc);

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      {header}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, !copy.showRespond && styles.contentNoBar]}
      >
        {/* Offline after it loaded: what is on screen stays readable (NFR-USE-01). */}
        {offline ? <OfflineBar message={OFFLINE_SHOWING} /> : null}
        {error && !offline ? <FormBanner kind="error" message={error} /> : null}

        <Badge family="case" value={caseBadgeValue(dc.status)} />
        <Text style={styles.context}>{caseContextLine(dc)}</Text>
        {trigger ? <Text style={styles.trigger}>{trigger}</Text> : null}
        {copy.countdown ? <CountdownText text={copy.countdown} /> : null}
        <Text style={styles.windowNote}>{copy.windowNote}</Text>

        {/* 9.2c: the question itself, in 9.4's received-card style (see the header). */}
        {copy.question ? (
          <>
            <Text style={styles.qLabel}>The moderator asked:</Text>
            <View style={styles.questionCard}>
              <Text style={styles.questionText}>{copy.question}</Text>
            </View>
          </>
        ) : null}

        <Text style={styles.visibilityNote}>{copy.visibilityNote}</Text>

        {/* FR-DISPUTE-05: either party may attach photos while the window is open. The respondent does
            it on 9.3; the opener has no drawn route, so this link opens the same screen in evidence
            mode (added 2026-10-18, decisions.md). */}
        {dc.viewerRole === "RAISER" && dc.evidence?.canAdd ? (
          <Link
            title="Add photos to this case"
            onPress={() => navigation.navigate("DisputeRespond", { disputeCaseId: dc.id, mode: "evidence" })}
          />
        ) : null}

        {copy.showHelpLink ? (
          <Link title="How disputes are resolved" onPress={() => navigation.navigate("HelpDisputes")} />
        ) : null}
      </ScrollView>

      {/* 9.2r: the respondent's one action. */}
      {copy.showRespond ? (
        <CtaBar surface="subtle">
          <Button title="Respond" onPress={() => navigation.navigate("DisputeRespond", { disputeCaseId: dc.id })} />
        </CtaBar>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg.subtle,
  },
  scroll: {
    flex: 1,
  },
  // Figma content: pad 16/16/0/16 gap 10 above a pinned bar (9.2r); 16/16/24/16 without one (9.2).
  content: {
    flexGrow: 1,
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.gutter,
    gap: 10,
  },
  contentNoBar: {
    paddingBottom: spacing.xl,
  },
  context: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  trigger: {
    ...typography.body,
    color: colors.text.primary,
  },
  windowNote: {
    ...typography.body,
    color: colors.text.secondary,
  },
  visibilityNote: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  // 9.4 `qLabel`.
  qLabel: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  // 9.4 `questionCard` is bg/subtle on a white screen; this screen is bg/subtle itself, so the card
  // takes bg/default to stay visible — still borderless, still reading as something received.
  questionCard: {
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    borderRadius: radius.input,
    backgroundColor: colors.bg.default,
  },
  questionText: {
    ...typography.body,
    color: colors.text.primary,
  },
});
