/**
 * HF.1 — Help index. docs/prototype/MHF-help.md.
 *
 * Reachable while signed out (no auth check here). Rows are hand-built
 * frames, not a shared component — the spec says this row shape appears
 * nowhere else in the prototype, so a reusable component would be
 * speculative.
 *
 * HF.5 ("Account access") isn't built yet — not enough of its screen was
 * researched this session to build it faithfully, so it's left off this
 * list rather than linking to a screen that doesn't exist.
 */
import { Pressable, Text, View, StyleSheet } from "react-native";
import { colors, spacing, radius, typography } from "../../theme/tokens";
import ScreenHeader from "../../components/ScreenHeader";

const ROWS = [
  { label: "How check-in codes work", target: "HelpCheckIn" },
  { label: "How endorsement works", target: "HelpEndorsement" },
  { label: "How disputes are resolved", target: "HelpDisputes" },
];

export default function HelpIndexScreen({ navigation }) {
  return (
    <View style={styles.screen}>
      <ScreenHeader title="Help" onBack={() => navigation.goBack()} />
      <View style={styles.content}>
        <Text style={styles.intro}>How YouthLink's key mechanisms work.</Text>
        {ROWS.map((row) => (
          <Pressable
            key={row.target}
            style={styles.row}
            onPress={() => navigation.navigate(row.target)}
            accessibilityRole="button"
          >
            <Text style={styles.rowLabel}>{row.label}</Text>
            <View style={styles.chevron} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg.subtle,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  intro: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 52,
    backgroundColor: colors.bg.default,
    borderRadius: radius.input,
    paddingHorizontal: spacing.md,
  },
  rowLabel: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  chevron: {
    width: 7,
    height: 7,
    borderRightWidth: 1.8,
    borderTopWidth: 1.8,
    borderColor: colors.text.secondary,
    transform: [{ rotate: "45deg" }],
  },
});
