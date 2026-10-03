/**
 * 3.11 — Notification preferences (FR-NOTIF-03), with 3.11e (employer) and 3.11v (verifier) — Pawan.
 *
 * Reached from the history's "Preferences" link and from Settings' "Notification preferences" row
 * (FR-ACC-18, M1 1.10), which is where FR-NOTIF-03 places this section.
 *
 * A job-seeker gets the two independent toggles, each saved as soon as it changes:
 *   - urgent-gig alerts — OPT-IN, off by default (User.notifyUrgentOptIn, FR-NOTIF-01)
 *   - new-gig alerts    — OPT-OUT, on by default (User.notifyNewGigOptOut, FR-NOTIF-02).
 *     The stored field is the opt-OUT, so the toggle shows its opposite: On = not opted out.
 * then the cap note, and the row to "How notifications look" (3.13).
 *
 * An employer or a verifier has no gig alerts, so nothing to switch: their screens are one
 * `roleNote` each, saying what they are told about and how to silence YouthLink (3.11e, 3.11v).
 */
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import Svg, { Path } from "react-native-svg";
import ScreenHeader from "../../components/ScreenHeader";
import Toggle from "../../components/Toggle";
import FormBanner from "../../components/FormBanner";
import LoadingState from "../../components/LoadingState";
import Button from "../../components/Button";
import { useAuth } from "../../auth/AuthContext";
import { tabBarRoleFor } from "../../components/ShellTabBar";
import { colors, radius, spacing, typography } from "../../theme/tokens";
import { getNotificationPreferences, updateNotificationPreferences } from "../../api/notification.api";
import { parseApiError } from "../../api/client";

// 3.11e / 3.11v `roleNote`, verbatim.
const ROLE_NOTE = {
  employer:
    "You're told about new applicants, postings with no applicants yet, cancellation requests and their outcomes, ended or stalled engagements, ratings, and dispute updates. There's nothing to switch here — to silence YouthLink, use your phone's notification settings.",
  verifier:
    "You're told when someone you vouched for goes on to build a good rating. There's nothing to switch here — to silence YouthLink, use your phone's notification settings.",
};

export default function NotificationPreferencesScreen({ navigation }) {
  const { user } = useAuth();
  const role = tabBarRoleFor(user);

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScreenHeader title="Notification preferences" onBack={() => navigation.goBack()} />
      {role === "worker" ? (
        <JobSeekerPreferences navigation={navigation} />
      ) : (
        <View style={styles.content}>
          <Text style={styles.secondaryText}>{ROLE_NOTE[role] ?? ""}</Text>
        </View>
      )}
    </View>
  );
}

/** 3.11 — the two toggles, the cap note and the row to 3.13. */
function JobSeekerPreferences({ navigation }) {
  const [prefs, setPrefs] = useState(null); // { notifyUrgentOptIn, notifyNewGigOptOut }
  const [loadError, setLoadError] = useState(null);
  const [saveError, setSaveError] = useState(null);

  function load() {
    setLoadError(null);
    getNotificationPreferences()
      .then(setPrefs)
      .catch((err) => setLoadError(parseApiError(err).formError || "Your preferences couldn't be loaded."));
  }

  useEffect(load, []);

  /** Shows the change at once, saves it, and puts the old value back if the save fails. */
  async function save(change) {
    const previous = prefs;
    setPrefs({ ...prefs, ...change });
    setSaveError(null);
    try {
      setPrefs(await updateNotificationPreferences(change));
    } catch (err) {
      setPrefs(previous);
      setSaveError(parseApiError(err).formError || "That change couldn't be saved. Try again.");
    }
  }

  if (!prefs) {
    return (
      <View style={styles.content}>
        {loadError ? (
          <>
            <FormBanner kind="error" message={loadError} />
            <Button title="Try again" style="secondary" onPress={load} />
          </>
        ) : (
          <LoadingState />
        )}
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      {saveError ? <FormBanner kind="error" message={saveError} /> : null}
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
      <Text style={styles.secondaryText}>Urgent alerts are capped at 5 a day — extras arrive as one digest.</Text>

      {/* row-NotifAppearance: 328×52, pad 14, gap 8, r10, 1px border; opens 3.13. */}
      <Pressable
        onPress={() => navigation.navigate("NotificationAppearance")}
        style={styles.row}
        accessibilityRole="button"
      >
        <Text style={styles.rowLabel}>How notifications look</Text>
        <Svg width={6} height={12} viewBox="0 0 6 12" fill="none" overflow="visible">
          <Path
            d="M0 0L6 6L0 12"
            stroke={colors.text.secondary}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg.default,
  },
  // content: pad 24/16/24/16, gap 16.
  content: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.gutter,
    gap: spacing.lg,
  },
  secondaryText: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: 14 - 1, // Figma pads 14 with the 1px stroke inside; RN's border is outside
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: radius.card,
    backgroundColor: colors.bg.default,
  },
  rowLabel: {
    flex: 1,
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
});
