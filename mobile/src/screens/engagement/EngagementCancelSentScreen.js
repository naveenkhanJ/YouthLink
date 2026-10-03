/**
 * 5.8t — Cancellation request sent. Requirement FR-ENG-05. Owner: Naveenkhan.
 *
 * Params: `{ engagementId, counterpartyName }`. A centred success screen with its button kept with
 * the message (design-system.md §5: centred success screens are not pinned), and no header.
 * "Back to engagement" returns to the engagement, which reloads as it now stands (5.2tx); Back from
 * there goes to the list (5.1tx). The cancel screen was replaced by this one, so it is not in between.
 */
import { View, Text, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Path } from "react-native-svg";
import Button from "../../components/Button";
import { colors, spacing, typography } from "../../theme/tokens";
import { requestSentLine } from "./engagement.format";

export default function EngagementCancelSentScreen({ route, navigation }) {
  const { engagementId, counterpartyName } = route.params || {};
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.xl }]}>
      <StatusBar style="dark" />
      <Svg width={56} height={56} viewBox="0 0 56 56" accessibilityLabel="Sent">
        <Circle cx={28} cy={28} r={26.75} stroke={colors.state.success} strokeWidth={2.5} fill="none" />
        <Path
          d="M16 29L24.5 37.5L41 20"
          stroke={colors.state.success}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Svg>
      <Text style={styles.title}>Request sent</Text>
      <Text style={styles.line}>{requestSentLine(counterpartyName)}</Text>
      <Text style={styles.line}>This request runs under regular-gig rules, fixed when you sent it.</Text>
      <View style={styles.action}>
        <Button
          title="Back to engagement"
          onPress={() => navigation.popTo("EngagementDetail", { engagementId })}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Figma content: the whole screen, vertical pad 24, gap 12, centred.
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.bg.subtle,
  },
  title: {
    ...typography.title,
    color: colors.text.primary,
    textAlign: "center",
  },
  // line1 / regime: 280 wide, centred.
  line: {
    maxWidth: 280,
    ...typography.secondary,
    color: colors.text.secondary,
    textAlign: "center",
  },
  // The button hugs its label (206 wide in Figma).
  action: {
    alignSelf: "center",
  },
});
