/**
 * First run (prototype M0, frames 0.2–0.4): three onboarding cards, shown once. The splash (0.1)
 * is BrandSplash, shown on every launch before this.
 *
 * - 0.2 / 0.3 cards: art, title, body, pager dots, "Next"; a "Skip" link at the top right.
 * - 0.4 card: the last one — no Skip, and the button is "Create account".
 * Skip and "Create account" both leave for 1.1 (role selection, step 1 of AccountRegister) and
 * record that onboarding was seen, so later launches go straight to 1.1 (M0 "states not drawn").
 *
 * The prototype positions these screens absolutely on a 360×800 frame. A real device is taller
 * or wider than that, so the vertical rhythm is kept (art → title 42, title → body 8/16, the pager
 * and button pinned to the bottom) and the content is centred in the extra space, the art
 * horizontally centred (the frame puts it at x=80 of 360).
 */
import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing, typography } from "../../theme/tokens";
import Button from "../../components/Button";
import PagerDots from "../../components/PagerDots";
import OnboardingArt from "./OnboardingArt";

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
  // 1..3 = the cards.
  const [step, setStep] = useState(1);
  const insets = useSafeAreaInsets();

  const card = CARDS[step - 1];
  const last = step === CARDS.length;

  return (
    <View style={[styles.card, { paddingBottom: Math.max(insets.bottom, spacing.xl) }]}>
      <StatusBar style="dark" />
      {/* M0 positions these screens absolutely (the only ones in the product): Skip @284,24
          right-aligned, art @80,150, title @24,392, body right under it. They are anchored to the
          top (below the status bar, which the 360×800 frames do not draw), so the art, title and
          body sit at the same place on every card and do not move when paging. */}
      {last ? null : (
        <Pressable
          onPress={onDone}
          hitSlop={12}
          accessibilityRole="button"
          style={[styles.skipWrap, { top: insets.top + 24 }]}
        >
          <Text style={styles.skip}>Skip</Text>
        </Pressable>
      )}

      <View style={[styles.content, { top: insets.top + 150 }]}>
        <View style={styles.art}>
          <OnboardingArt variant={card.art} />
        </View>
        <Text style={styles.title}>{card.title}</Text>
        <Text style={styles.body}>{card.body}</Text>
      </View>

      <View style={styles.spacer} />
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
  card: {
    flex: 1,
    backgroundColor: colors.bg.default,
  },
  // Skip: 60 wide, right-aligned, right edge at 344 of 360.
  skipWrap: {
    position: "absolute",
    right: 16,
    width: 60,
  },
  skip: {
    ...typography.secondary,
    color: colors.text.secondary,
    textAlign: "right",
  },
  content: {
    position: "absolute",
    left: 0,
    right: 0,
    paddingHorizontal: spacing.xl,
  },
  art: {
    alignSelf: "center",
  },
  spacer: {
    flex: 1,
  },
  // Inter SemiBold 24 sets "Local work, verified people" at 313.7 dp, just over the 312 dp column
  // the prototype draws it in on one line; a hair of negative tracking (about 2 dp over the line)
  // keeps it on one line without changing the size. art 150–350, title at 392, body 16 below it.
  title: {
    marginTop: 42,
    letterSpacing: -0.1,
    ...typography.display,
    color: colors.text.primary,
  },
  body: {
    marginTop: spacing.lg,
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
