/**
 * Notification Preferences Screen (FR-NOTIF-03) — Pawan.
 */
import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  getNotificationPreferences,
  updateNotificationPreferences,
} from "../../api/notification.api";
import { parseApiError } from "../../api/client";

export default function NotificationPreferencesScreen() {
  const [notifyUrgentOptIn, setNotifyUrgentOptIn] = useState(false);
  const [notifyNewGigOptOut, setNotifyNewGigOptOut] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const loadPreferences = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const prefs = await getNotificationPreferences();
      setNotifyUrgentOptIn(Boolean(prefs.notifyUrgentOptIn));
      setNotifyNewGigOptOut(Boolean(prefs.notifyNewGigOptOut));
    } catch (err) {
      setError(parseApiError(err).formError || "Could not load preferences.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  async function handleToggleUrgent(value) {
    setNotifyUrgentOptIn(value);
    setSaving(true);
    try {
      await updateNotificationPreferences({ notifyUrgentOptIn: value });
    } catch (err) {
      setError("Failed to save preference.");
      setNotifyUrgentOptIn(!value);
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleGeneral(value) {
    // If the switch represents "General Notifications Enabled", then enabled = !notifyNewGigOptOut
    // value = true means enabled (optOut = false), value = false means disabled (optOut = true)
    const optOut = !value;
    setNotifyNewGigOptOut(optOut);
    setSaving(true);
    try {
      await updateNotificationPreferences({ notifyNewGigOptOut: optOut });
    } catch (err) {
      setError("Failed to save preference.");
      setNotifyNewGigOptOut(!optOut);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#5B4FE0" size="large" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar style="dark" />
      <Text style={styles.heading}>Notification Preferences</Text>
      <Text style={styles.subheading}>
        Manage what alerts you receive about gigs in your area.
      </Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Urgent Gig Alerts</Text>
            <Text style={styles.description}>
              Receive proactive high-priority push notifications when an urgent gig is posted within your radius (up to 5 per day).
            </Text>
          </View>
          <Switch
            value={notifyUrgentOptIn}
            onValueChange={handleToggleUrgent}
            trackColor={{ false: "#E5E7EB", true: "#C7D2FE" }}
            thumbColor={notifyUrgentOptIn ? "#5B4FE0" : "#9CA3AF"}
          />
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>General New Gig Notifications</Text>
            <Text style={styles.description}>
              Receive standard notifications whenever any regular gig matching your location is published.
            </Text>
          </View>
          <Switch
            value={!notifyNewGigOptOut}
            onValueChange={handleToggleGeneral}
            trackColor={{ false: "#E5E7EB", true: "#C7D2FE" }}
            thumbColor={!notifyNewGigOptOut ? "#5B4FE0" : "#9CA3AF"}
          />
        </View>
      </View>

      {saving ? (
        <Text style={styles.savingText}>Saving preferences...</Text>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: "#F9FAFB" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  heading: { fontSize: 22, fontWeight: "700", color: "#111827", marginBottom: 6 },
  subheading: { fontSize: 14, color: "#6B7280", marginBottom: 20 },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  textContainer: { flex: 1, marginRight: 16 },
  title: { fontSize: 16, fontWeight: "600", color: "#111827", marginBottom: 4 },
  description: { fontSize: 13, color: "#6B7280", lineHeight: 18 },
  errorText: { fontSize: 13, color: "#DC2626", marginBottom: 12 },
  savingText: { fontSize: 12, color: "#5B4FE0", textAlign: "center", marginTop: 8 },
});
