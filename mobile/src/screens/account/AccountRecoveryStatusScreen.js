/**
 * Account recovery, outcome (prototype 1.8rec3 pending / 1.8rec4 approved; FR-ACC-10 E8) — Afham.
 *
 * "The outcome will appear here": this screen asks the server for the outcome of THIS device's
 * request (the id in SecureStore) when it opens, every 30 seconds while it is open, and when the
 * app returns to the foreground — so an approval the Admin gives later shows up without anyone
 * logging in.
 *
 *   pending  → 1.8rec3  Info banner + note, button "Done" (back to login)
 *   approved → 1.8rec4  Info banner + note, button "Set new password" (→ 1.9)
 *   rejected → not drawn; 1.8rec3's layout with a banner naming the next step (the prototype's
 *              "States not drawn in this module" table), button "Done"
 *   used     → the new password was already set; the way on is the login screen
 */
import { useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, AppState } from "react-native";
import { StatusBar } from "expo-status-bar";
import { colors, spacing, typography } from "../../theme/tokens";
import ScreenHeader from "../../components/ScreenHeader";
import FormBanner from "../../components/FormBanner";
import Button from "../../components/Button";
import CtaBar from "../../components/CtaBar";
import { getRecoveryStatus } from "../../api/account";
import { peekRecoveryDeviceId } from "./recoveryDevice";

const POLL_MS = 30 * 1000;

const CONTENT = {
  pending: {
    banner: "Request received. An admin will review it, and the outcome will appear here.",
    note: "You don't need to do anything else. Keep the app installed on this device so we can show you the result.",
    button: "Done",
  },
  approved: {
    banner: "Your account has been recovered. Set a new password to finish.",
    note: "Your ratings, completed gigs and endorsements are unchanged.",
    button: "Set new password",
  },
  rejected: {
    banner: "We couldn't match these details to the account, so the request wasn't approved.",
    note: "Check the details and try again from the login screen, or use Get help there to contact support.",
    button: "Done",
  },
  used: {
    banner: "This recovery has already been used.",
    note: "Log in with the new password you set.",
    button: "Go to log in",
  },
};

export default function AccountRecoveryStatusScreen({ navigation }) {
  const [status, setStatus] = useState("pending");
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const id = await peekRecoveryDeviceId();
      if (!id) {
        // Nothing was ever requested from this device: back to the form.
        navigation.replace("AccountRecoveryConfirm");
        return;
      }
      const result = await getRecoveryStatus(id);
      setStatus(result.status);
      setError(null);
    } catch (err) {
      if (err.status === 404) navigation.replace("AccountRecoveryConfirm");
      else setError(err.message);
    }
  }, [navigation]);

  useEffect(() => {
    refresh();
    const timer = setInterval(refresh, POLL_MS);
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") refresh();
    });
    return () => {
      clearInterval(timer);
      sub.remove();
    };
  }, [refresh]);

  const content = CONTENT[status] || CONTENT.pending;

  async function handleAction() {
    if (status === "approved") {
      const deviceId = await peekRecoveryDeviceId();
      navigation.navigate("AccountResetPassword", { deviceId });
    } else {
      navigation.reset({ index: 0, routes: [{ name: "AccountLogin" }] });
    }
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScreenHeader title="Recover your account" onBack={() => navigation.goBack()} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {error ? <FormBanner kind="error" message={error} /> : null}
        <FormBanner kind="info" message={content.banner} />
        <Text style={styles.note}>{content.note}</Text>
        <View style={styles.spacer} />
      </ScrollView>

      <CtaBar>
        <Button title={content.button} onPress={handleAction} />
      </CtaBar>
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
  content: {
    flexGrow: 1,
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xs,
    gap: spacing.lg,
  },
  note: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  spacer: {
    flex: 1,
    minHeight: spacing.lg,
  },
});
