/**
 * Find someone to vouch for (prototype 8.3, 8.3m, 8.3n, 8.3d; FR-ENDORSE-03, NFR-PRIV-04) — Afham.
 *
 * A lookup by a number the Verifier already knows — one person or none, never a list (NFR-PRIV-04
 * forbids a user directory). One screen, four drawn states:
 *
 *   8.3   the explainer, Input/PhoneField and "Search" (inert until all nine digits are in).
 *   8.3m  a match: a card with the name and "Matches +94 77 123 4567" and nothing else,
 *         "Not the right person? Search again" before the commit, then "Vouch for {name}".
 *   8.3n  "Search again", or typing a different number: the card goes, "Search" comes back.
 *   8.3d  no eligible match: "No one to show for that number." / "Check the number and try again."
 *         — the same words whether no account exists or one exists but is not eligible
 *         (FR-ENDORSE-03). No button: editing the number returns to 8.3n.
 *
 * Back follows the drawn exits: from a result (8.3m, 8.3d) it returns to the search (8.3); from the
 * search itself it leaves, to 8.2.
 *
 * Not drawn (M8 "States not drawn"): a match the Verifier already vouches for shows the card with
 * "You already vouch for them" and no Vouch button — it leaks nothing, the person is already in
 * their My endorsements. Offline or any other failure → Feedback/FormBanner {Kind=Error}, the
 * number kept.
 */
import { useCallback, useState } from "react";
import { View, Text, ScrollView, BackHandler, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect } from "@react-navigation/native";
import { colors, spacing, radius, elevation, typography } from "../../theme/tokens";
import ScreenHeader from "../../components/ScreenHeader";
import PhoneField from "../../components/PhoneField";
import Button from "../../components/Button";
import CtaBar from "../../components/CtaBar";
import Link from "../../components/Link";
import FormBanner from "../../components/FormBanner";
import { searchEndorseeByPhone } from "../../api/endorsement.api";
import { displayPhone } from "./endorsement.format";

const EXPLAINER = "Know their number? Search for someone you can vouch for.";
const NO_MATCH = "No one to show for that number."; // the server's sentence, drawn on 8.3d
const NO_MATCH_SUB = "Check the number and try again.";
const ALREADY_VOUCHED = "You already vouch for them";
const LOCAL_DIGITS = 9;

export default function EndorsementSearchScreen({ navigation }) {
  const [digits, setDigits] = useState(""); // local digits, "771234567"
  const [match, setMatch] = useState(null); // { workerId, name, phone, alreadyVouched } — 8.3m
  const [noMatch, setNoMatch] = useState(false); // 8.3d
  const [formError, setFormError] = useState(null);
  const [searching, setSearching] = useState(false);

  const hasResult = Boolean(match) || noMatch;

  /** Back from a result returns to the search; from the search it leaves the screen. */
  function back() {
    if (hasResult) {
      setMatch(null);
      setNoMatch(false);
    } else {
      navigation.goBack();
    }
  }

  // Hardware Back follows the on-screen back arrow — only while this screen is the one in view,
  // so it never handles a Back pressed on the vouch screen above it.
  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener("hardwareBackPress", () => {
        if (!hasResult) return false; // nothing to clear: the navigator's own Back leaves
        setMatch(null);
        setNoMatch(false);
        return true;
      });
      return () => sub.remove();
    }, [hasResult]),
  );

  function edit(value) {
    setDigits(value);
    // A different number typed: the card goes (8.3m → 8.3n) and a miss clears (8.3d → 8.3n).
    setMatch(null);
    setNoMatch(false);
    setFormError(null);
  }

  async function search() {
    setFormError(null);
    setSearching(true);
    try {
      setMatch(await searchEndorseeByPhone(`+94${digits}`));
      setNoMatch(false);
    } catch (err) {
      if (err.code === "NO_ELIGIBLE_MATCH") {
        setMatch(null);
        setNoMatch(true);
      } else {
        setFormError(err.message);
      }
    } finally {
      setSearching(false);
    }
  }

  /** 8.3m → 8.3n: the card goes and the number is cleared for a fresh search. */
  function searchAgain() {
    setMatch(null);
    setNoMatch(false);
    setDigits("");
  }

  function vouch() {
    navigation.navigate("EndorsementVouch", { workerId: match.workerId, name: match.name, entryPoint: "PHONE_SEARCH" });
  }

  // The CTA: Search (8.3 / 8.3n), Vouch for {name} (8.3m), none on a miss (8.3d) or a match the
  // Verifier already vouches for.
  let cta = null;
  if (match && !match.alreadyVouched) cta = <Button title={`Vouch for ${match.name}`} onPress={vouch} />;
  else if (!match && !noMatch) {
    cta = (
      <Button title="Search" onPress={search} loading={searching} disabled={digits.length !== LOCAL_DIGITS} />
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScreenHeader title="Vouch for someone" onBack={back} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, !cta && styles.contentNoBar]}
        keyboardShouldPersistTaps="handled"
      >
        {formError ? <FormBanner kind="error" message={formError} /> : null}
        {/* 8.3d drops the explainer: the field and the miss are the whole screen. */}
        {noMatch ? null : <Text style={styles.explainer}>{EXPLAINER}</Text>}
        <PhoneField value={digits} onChangeText={edit} />

        {match ? (
          <>
            <View style={[styles.resultCard, elevation.card]} accessible accessibilityLabel={`${match.name}, matches ${displayPhone(match.phone)}`}>
              <Text style={styles.resultName}>{match.name}</Text>
              <Text style={styles.resultMeta}>Matches {displayPhone(match.phone)}</Text>
              {match.alreadyVouched ? <Text style={styles.already}>{ALREADY_VOUCHED}</Text> : null}
            </View>
            <View style={styles.linkWrap}>
              <Link title="Not the right person? Search again" onPress={searchAgain} />
            </View>
          </>
        ) : null}

        {noMatch ? (
          <View accessibilityLiveRegion="polite">
            <Text style={styles.noMatch}>{NO_MATCH}</Text>
            <Text style={[styles.noMatchSub, styles.noMatchGap]}>{NO_MATCH_SUB}</Text>
          </View>
        ) : null}
      </ScrollView>

      {cta ? <CtaBar>{cta}</CtaBar> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg.default,
  },
  scroll: {
    flex: 1,
  },
  // 8.3 content: pad 20/16/2/16, gap 14.
  content: {
    paddingTop: 20,
    paddingHorizontal: spacing.gutter,
    paddingBottom: 2,
    gap: 14,
  },
  // 8.3d: no pinned bar below, so the content's own bottom pad is 24.
  contentNoBar: {
    paddingBottom: spacing.xl,
  },
  explainer: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  // resultCard: pad 12/14, gap 4, r8, white, elevation/card.
  resultCard: {
    gap: spacing.xs,
    paddingVertical: spacing.md,
    paddingHorizontal: 14,
    borderRadius: radius.input,
    backgroundColor: colors.bg.default,
  },
  resultName: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  resultMeta: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  already: {
    ...typography.secondary,
    color: colors.text.primary,
  },
  linkWrap: {
    alignSelf: "flex-start",
  },
  noMatch: {
    ...typography.body,
    color: colors.text.primary,
  },
  noMatchSub: {
    ...typography.body,
    color: colors.text.secondary,
  },
  // The two lines are separate children of the gap-14 column in 8.3d.
  noMatchGap: {
    marginTop: 14,
  },
});
