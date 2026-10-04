/**
 * 6.2 / 6.2e — Awaiting reveal (FR-RATE-02) — Pawan.
 *
 * Shows confirmation that the user's rating is submitted, and explains the double-blind
 * mechanism: ratings unlock when both have rated or when the 14-day window expires.
 */
import { View, Text, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import ScreenHeader from "../../components/ScreenHeader";
import Button from "../../components/Button";
import CtaBar from "../../components/CtaBar";
import { colors, spacing, typography } from "../../theme/tokens";

function formatDate(dateStr) {
  if (!dateStr) return "14 days from completion";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AwaitingRevealScreen({ navigation, route }) {
  const { postingTitle, counterpartyName, revealDeadline } = route.params || {};

  function handleBack() {
    navigation.popToTop();
  }

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <ScreenHeader title="Rating" onBack={() => navigation.goBack()} />

      <View style={styles.content}>
        <Text style={styles.contextLine}>
          {postingTitle || "Engagement"} · {counterpartyName || "Counterparty"}
        </Text>

        <View style={styles.glyphBox}>
          <Text style={styles.checkmark}>✓</Text>
        </View>

        <Text style={styles.statusTitle}>Your rating is in</Text>

        <Text style={styles.unlockLine}>
          Ratings unlock when both of you have rated, or on {formatDate(revealDeadline)}.
        </Text>
      </View>

      <CtaBar>
        <Button title="Back to engagement" onPress={handleBack} />
      </CtaBar>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg.subtle },
  content: {
    flex: 1,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  contextLine: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  glyphBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2.5,
    borderColor: colors.state.success,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: spacing.sm,
  },
  checkmark: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.state.success,
  },
  statusTitle: {
    ...typography.display,
    color: colors.text.primary,
  },
  unlockLine: {
    ...typography.body,
    color: colors.text.secondary,
  },
});
