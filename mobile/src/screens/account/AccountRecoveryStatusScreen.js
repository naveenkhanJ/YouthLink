/**
 * Account recovery, status screen (spec 1.8rec3 pending / 1.8rec4 approved) — Afham.
 *
 * 1.8rec3 — pending: Info banner + note + "Done" button
 * 1.8rec4 — approved: Info banner + note + "Set new password" button
 */
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { colors, spacing, typography } from "../../theme/tokens";
import ScreenHeader from "../../components/ScreenHeader";
import FormBanner from "../../components/FormBanner";
import Button from "../../components/Button";
import CtaBar from "../../components/CtaBar";

export default function AccountRecoveryStatusScreen({ navigation, route }) {
  // "pending" (1.8rec3) | "approved" (1.8rec4)
  const status = route.params?.status || "pending";

  function handleAction() {
    if (status === "approved") {
      navigation.navigate("AccountResetPassword");
    } else {
      // Exits back
      navigation.goBack();
    }
  }

  return (
    <View style={styles.flex}>
      <StatusBar style="dark" />
      {/* Spec title: "Recover your account" (not "Account recovery") */}
      <ScreenHeader title="Recover your account" onBack={() => navigation.goBack()} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
      >
        <FormBanner
          kind={status === "approved" ? "Success" : "Info"}
          message={
            status === "approved"
              ? "Your account has been recovered. Set a new password to finish."
              : "Request received. An admin will review it, and the outcome will appear here."
          }
        />

        <Text style={styles.note}>
          {status === "approved"
            ? "Your ratings, completed gigs and endorsements are unchanged."
            : "You don't need to do anything else. Keep the app installed on this device so we can show you the result."}
        </Text>

        <View style={styles.spacer} />
      </ScrollView>

      <CtaBar>
        <Button
          title={status === "approved" ? "Set new password" : "Done"}
          onPress={handleAction}
        />
      </CtaBar>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.bg.default,
  },
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xs,
    gap: spacing.lg,
  },
  note: {
    ...typography.body,
    color: colors.text.secondary,
  },
  spacer: {
    flex: 1,
    minHeight: spacing.xxl,
  },
});
