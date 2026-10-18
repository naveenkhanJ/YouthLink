/**
 * Give an endorsement · live (prototype 8.4e; FR-ENDORSE-04, FR-ENDORSE-07) — Afham.
 *
 * Replaces the vouch screen once the endorsement exists, opened with `{ name }`. "There's no review
 * step" states the product decision (live on submit), and the same sentence points at its balance,
 * revoking from My endorsements — which is where the one action and the back arrow both go
 * (8.4e: Leads to 8.5, Exits back → 8.5).
 */
import { useCallback } from "react";
import { View, Text, ScrollView, BackHandler, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect } from "@react-navigation/native";
import Svg, { Path } from "react-native-svg";
import { colors, spacing, typography } from "../../theme/tokens";
import ScreenHeader from "../../components/ScreenHeader";
import Button from "../../components/Button";
import CtaBar from "../../components/CtaBar";

const LIVE_BODY =
  "It shows on their profile immediately — there's no review step. You can revoke it any time from My endorsements.";

/** 8.4e `successGlyph`: the frame's own 48px ring and check, stroked in color/state/success. */
function SuccessGlyph() {
  return (
    <Svg width={48} height={48} viewBox="0 0 48 48" fill="none" accessibilityElementsHidden importantForAccessibility="no">
      <Path
        d="M46.75 24C46.75 36.5645 36.5645 46.75 24 46.75C11.4355 46.75 1.25 36.5645 1.25 24C1.25 11.4355 11.4355 1.25 24 1.25C36.5645 1.25 46.75 11.4355 46.75 24Z"
        stroke={colors.state.success}
        strokeWidth={2.5}
      />
      <Path
        d="M13 24L21 32L35 16"
        stroke={colors.state.success}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default function EndorsementVouchedScreen({ route, navigation }) {
  const name = route.params?.name ?? "";

  // Back to My endorsements where it is already in the stack (the Verifier's first tab, under the
  // Vouch tab), dropping this screen; otherwise it takes this screen's place. React Navigation 7's
  // `navigate` would push a second copy instead.
  const toMine = useCallback(() => {
    if (navigation.getState().routes.some((r) => r.name === "EndorsementMine")) navigation.popTo("EndorsementMine");
    else navigation.replace("EndorsementMine");
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener("hardwareBackPress", () => {
        toMine();
        return true;
      });
      return () => sub.remove();
    }, [toMine]),
  );

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScreenHeader title="Vouch" onBack={toMine} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.whoName}>{name}</Text>
        <SuccessGlyph />
        <Text style={styles.liveTitle} accessibilityRole="header" accessibilityLiveRegion="polite">
          Your endorsement is live
        </Text>
        <Text style={styles.liveBody}>{LIVE_BODY}</Text>
      </ScrollView>
      <CtaBar surface="subtle">
        <Button title="My endorsements" onPress={toMine} />
      </CtaBar>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg.subtle,
  },
  // 8.4e content: pad 16/16/0/16, gap 12.
  content: {
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.gutter,
    gap: spacing.md,
  },
  whoName: {
    ...typography.title,
    color: colors.text.primary,
  },
  liveTitle: {
    ...typography.display,
    color: colors.text.primary,
  },
  liveBody: {
    ...typography.body,
    color: colors.text.secondary,
  },
});
