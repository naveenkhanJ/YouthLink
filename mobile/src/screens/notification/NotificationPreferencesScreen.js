/**
 * 3.11 — Notification preferences (FR-NOTIF-03) — Pawan.
 *
 * Reached from Settings' "Notification preferences" row (FR-ACC-18, M1 1.10), which is where
 * FR-NOTIF-03 places this section. Two independent toggles, each saved as soon as it changes:
 *   - urgent-gig alerts — OPT-IN, off by default (User.notifyUrgentOptIn, FR-NOTIF-01)
 *   - new-gig alerts    — OPT-OUT, on by default (User.notifyNewGigOptOut, FR-NOTIF-02).
 *     The stored field is the opt-OUT, so the toggle shows its opposite: On = not opted out.
 *
 * Not built here: the "How notifications look" row (3.13) belongs to YL-157, which is in the backlog.
 */
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import ScreenHeader from "../../components/ScreenHeader";
import Toggle from "../../components/Toggle";
import FormBanner from "../../components/FormBanner";
import LoadingState from "../../components/LoadingState";
import { colors, spacing, typography } from "../../theme/tokens";
import {
  getNotificationPreferences,
  updateNotificationPreferences,
} from "../../api/notification.api";
import { parseApiError } from "../../api/client";

export default function NotificationPreferencesScreen({ navigation }) {
  const [prefs, setPrefs] = useState(null); // { notifyUrgentOptIn, notifyNewGigOptOut }
  const [error, setError] = useState(null);

  useEffect(() => {
    getNotificationPreferences()
      .then(setPrefs)
      .catch((err) => setError(parseApiError(err).formError || "Couldn't load your preferences."));
  }, []);

  /** Shows the change at once, saves it, and puts the old value back if the save fails. */
  async function save(change) {
    const previous = prefs;
    setPrefs({ ...prefs, ...change });
    setError(null);
    try {
      setPrefs(await updateNotificationPreferences(change));
    } catch (err) {
      setPrefs(previous);
      setError(parseApiError(err).formError || "Couldn't save that change. Try again.");
    }
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScreenHeader title="Notification preferences" onBack={() => navigation.goBack()} />

      {prefs ? (
        <ScrollView contentContainerStyle={styles.content}>
          {error ? <FormBanner kind="error" message={error} /> : null}
          <Toggle
            label="Notify me about urgent gigs nearby"
            value={prefs.notifyUrgentOptIn}
            onValueChange={(on) => save({ notifyUrgentOptIn: on })}
          />
          <Toggle
            label="Notify me about new gigs nearby"
            value={!prefs.notifyNewGigOptOut}
            onValueChange={(on) => save({ notifyNewGigOptOut: !on })}
          />
          <Text style={styles.capNote}>
            Urgent alerts are capped at 5 a day — extras arrive as one digest.
          </Text>
        </ScrollView>
      ) : error ? (
        <View style={styles.content}>
          <FormBanner kind="error" message={error} />
        </View>
      ) : (
        <LoadingState />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg.default,
  },
  content: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  capNote: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
});
