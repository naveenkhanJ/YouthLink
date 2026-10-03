/**
 * Terms of Service and Privacy Policy (prototype 1.20, FR-ACC-19) — Afham.
 *
 * Reached from the underlined links in the registration details step; the back chevron
 * returns there. Static text, version-stamped. The copy is the prototype's, verbatim.
 */
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { colors, spacing, typography } from "../../theme/tokens";
import ScreenHeader from "../../components/ScreenHeader";

export default function AccountTermsScreen({ navigation }) {
  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScreenHeader title="Terms & Privacy" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.version}>Version 1.0 — 1 August 2026</Text>
        <Text style={styles.para}>
          1. Using YouthLink{"\n"}YouthLink connects youth job-seekers with verified local gigs. You
          must be 18 or older to register, and the details you provide must be your own.
        </Text>
        <Text style={styles.para}>
          2. Your data{"\n"}Your NIC is stored encrypted and never shown publicly. Phone numbers are
          shared only when an employer selects a worker for a gig — then the two of them can see each
          other's number.
        </Text>
        <Text style={styles.privTitle}>3. Privacy Policy</Text>
        <Text style={styles.privBody}>
          Your NIC is encrypted and never shown publicly. There is no public directory — your profile
          is visible only to people you interact with through an application, listing, engagement or
          rating. Reports you file stay anonymous, permanently. Platform statistics are aggregates; we
          don't publish per-person activity.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg.subtle,
  },
  // Spec: content pad 24/16/24/16, gap 16.
  content: {
    padding: spacing.xl,
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  version: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  para: {
    ...typography.body,
    color: colors.text.primary,
  },
  privTitle: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  privBody: {
    ...typography.body,
    color: colors.text.secondary,
  },
});
