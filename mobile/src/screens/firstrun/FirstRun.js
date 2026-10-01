/**
 * First run (prototype M0, frames 0.1–0.4): a splash and three onboarding cards, shown once.
 *
 * - 0.1 Splash: brand-blue ground, mark, wordmark and tagline. Moves on after 2 seconds, or on a tap,
 *   whichever comes first.
 * - 0.2 / 0.3 cards: art, title, body, pager dots, "Next"; a "Skip" link at the top right.
 * - 0.4 card: the last one — no Skip, and the button is "Create account".
 * Skip and "Create account" both leave for 1.1 (role selection, step 1 of AccountRegister) and
 * record that onboarding was seen, so later launches go straight to 1.1 (M0 "states not drawn").
 *
 * The prototype positions these four screens absolutely on a 360×800 frame. A real device is
 * taller or wider than that, so the vertical rhythm is kept (art → title 42, title → body 8/16,
 * the pager and button pinned to the bottom) and the content is centred in the extra space.
 */
import { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing, typography } from "../../theme/tokens";
import Mark from "../../components/Mark";
import Button from "../../components/Button";
import PagerDots from "../../components/PagerDots";
import OnboardingArt from "./OnboardingArt";

const SPLASH_MS = 2000;

const CARDS = [
  {
    art: "gigs",
    title: "Local work, verified people",
    body: "Young people looking for work, employers posting gigs nearby, and community members who vouch for someone they know. Every identity is checked before anyone can take part.",
  },
  {
    art: "endorsement",
    title: "A good word gets you started",
    body: "Nobody has ratings on day one. Someone who already knows a young worker can vouch for them, and employers see that vouch beside their name.",
  },
  {
    art: "codes",
    title: "Both sides confirm, every step",
    body: "Each step of a gig is confirmed by a short code — one person shows it, the other types it in. Neither side can mark something done on their own.",
  },
];

/** @param {() => void} onDone - Called when the person skips or taps "Create account". */
export default function FirstRun({ onDone }) {
  // 0 = splash, 1..3 = the cards.
  const [step, setStep] = useState(0);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (step !== 0) return undefined;
    const timer = setTimeout(() => setStep(1), SPLASH_MS);
    return () => clearTimeout(timer);
  }, [step]);

  if (step === 0) {
    return (
      <Pressable style={styles.splash} onPress={() => setStep(1)} accessibilityLabel="YouthLink">
        <StatusBar style="light" />
        <Mark tone="onBrand" size={76} />
        <Text style={styles.splashName}>YouthLink</Text>
        <Text style={styles.splashTagline}>Verified local work for young people</Text>
      </Pressable>
    );
  }

  const card = CARDS[step - 1];
  const last = step === CARDS.length;

  return (
    <View style={[styles.card, { paddingTop: insets.top, paddingBottom: Math.max(insets.bottom, spacing.xl) }]}>
      <StatusBar style="dark" />
      <View style={styles.skipRow}>
        {last ? null : (
          <Pressable onPress={onDone} hitSlop={12} accessibilityRole="button">
            <Text style={styles.skip}>Skip</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.center}>
        <OnboardingArt variant={card.art} />
        <Text style={styles.title}>{card.title}</Text>
        <Text style={styles.body}>{card.body}</Text>
      </View>

      <View style={styles.bottom}>
        <PagerDots active={step} />
        <View style={styles.buttonWrap}>
          <Button title={last ? "Create account" : "Next"} onPress={last ? onDone : () => setStep(step + 1)} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.brand.primary,
  },
  // The wordmark has no text style on purpose: it is Archivo Bold, the only non-Inter text.
  splashName: {
    marginTop: 38,
    fontFamily: "Archivo_700Bold",
    fontSize: 32,
    lineHeight: 40,
    color: colors.text.inverse,
    textAlign: "center",
  },
  splashTagline: {
    marginTop: 2,
    ...typography.secondary,
    color: colors.text.inverse,
    opacity: 0.82,
    textAlign: "center",
  },
  card: {
    flex: 1,
    backgroundColor: colors.bg.default,
  },
  skipRow: {
    height: 44,
    paddingHorizontal: 24,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  skip: {
    ...typography.secondary,
    color: colors.text.secondary,
    textAlign: "right",
  },
  center: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: "center",
    gap: spacing.sm,
  },
  title: {
    marginTop: 42 - spacing.sm,
    ...typography.display,
    color: colors.text.primary,
  },
  body: {
    marginTop: spacing.sm,
    ...typography.body,
    color: colors.text.secondary,
  },
  bottom: {
    alignItems: "center",
    gap: 44, // pager dots at y=676, button at y=728 in the 800 frame
  },
  buttonWrap: {
    alignSelf: "stretch",
    paddingHorizontal: spacing.lg,
  },
});
