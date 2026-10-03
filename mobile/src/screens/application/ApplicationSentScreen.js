/**
 * Application sent (prototype 4.2 and its variants; FR-APPLY-02) — Naveenkhan.
 *
 * A centred success screen: the glyph, "Application sent", who will see it, and the one next step.
 * Per design-system.md §5 a centred success screen keeps its button with the message — no pinned
 * bar, no header to go back to the form that was just sent.
 *
 * Opened by the Apply screen with `{ employerName }`.
 */
import { View, Text, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import Svg, { Circle, Path } from "react-native-svg";
import { colors, spacing, typography } from "../../theme/tokens";
import Button from "../../components/Button";

/** 4.2 `successGlyph`: a 56px ring with a check, both stroked in color/state/success. */
function SuccessGlyph() {
  return (
    <Svg width={56} height={56} viewBox="0 0 56 56">
      <Circle cx={28} cy={28} r={26.75} stroke={colors.state.success} strokeWidth={2.5} fill="none" />
      <Path
        d="M16 29L24.5 37.5L41 21"
        stroke={colors.state.success}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

export default function ApplicationSentScreen({ route, navigation }) {
  const employerName = route.params?.employerName ?? "";
  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <SuccessGlyph />
      <Text style={styles.title}>Application sent</Text>
      <Text style={styles.line}>{employerName} will see your note and profile.</Text>
      <Button title="View my applications" onPress={() => navigation.replace("ApplicationMine")} />
    </View>
  );
}

const styles = StyleSheet.create({
  // 4.2 content: pad 24, gap 12, centred, on bg/subtle.
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
    gap: spacing.md,
    backgroundColor: colors.bg.subtle,
  },
  title: {
    ...typography.title,
    color: colors.text.primary,
  },
  line: {
    ...typography.secondary,
    color: colors.text.secondary,
    textAlign: "center",
    maxWidth: 280,
  },
});
