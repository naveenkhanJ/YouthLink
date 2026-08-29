/**
 * DEMO-ONLY notifications screen — integration showcase branch.
 *
 * ===========================================================================
 * Only exists on `demo/integration-showcase`. Never merge into develop.
 * ===========================================================================
 *
 * Applying & Selection writes Notification rows on select, decline, and the
 * automatic not-selected sweep when a posting fills — but nothing in the app
 * ever read them back, so FR-APPLY-08 and FR-APPLY-09 were invisible. This is
 * a plain list so those two requirements can actually be seen happening.
 *
 * NOT an implementation of the Notifications slice (FR-NOTIF, Pawan): no push
 * delivery, no urgent/non-urgent triggers, no rate limiting or digests, no
 * preference toggles. Just a read of rows another module already writes.
 */
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { listNotifications } from "./demo.api";

/** NotificationType -> plain English, plus which requirement produced it. */
const TYPE_LABELS = {
  APPLICATION_SELECTED: ["You were selected", "FR-APPLY-06"],
  APPLICATION_NOT_SELECTED: ["Not selected — the posting filled", "FR-APPLY-09"],
  APPLICATION_DECLINED: ["Your application was declined", "FR-APPLY-08"],
  APPLICATION_RECEIVED: ["New applicant", "FR-APPLY-02"],
  MATERIAL_CHANGE: ["A posting you applied to changed", "FR-APPLY-10"],
  URGENT_GIG: ["Urgent gig near you", "FR-NOTIF-01"],
  NEW_GIG: ["New gig near you", "FR-NOTIF-02"],
};

function formatWhen(iso) {
  const date = new Date(iso);
  const mins = Math.round((Date.now() - date.getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  if (mins < 1440) return `${Math.round(mins / 60)} h ago`;
  return date.toLocaleDateString();
}

export default function DemoNotificationsScreen() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      setItems(await listNotifications());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refetch on focus — the whole point is watching rows appear right after a
  // selection happens in another part of the demo.
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  if (loading) {
    return (
      <View style={styles.centre}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={false} onRefresh={load} />}
    >
      <Text style={styles.banner}>
        Demo scaffolding — reads rows Applying &amp; Selection writes. Not the
        Notifications slice (FR-NOTIF): no push, triggers or preferences.
      </Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {!error && items.length === 0 ? (
        <Text style={styles.empty}>
          Nothing yet. Select or decline an applicant as the Employer, then
          switch back to that worker.
        </Text>
      ) : null}

      {items.map((item) => {
        const [label, requirement] = TYPE_LABELS[item.type] ?? [item.type, ""];
        return (
          <View key={item.id} style={styles.card}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.meta}>
              {formatWhen(item.createdAt)}
              {requirement ? ` · ${requirement}` : ""}
              {item.readAt ? "" : " · unread"}
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centre: { flex: 1, alignItems: "center", justifyContent: "center" },
  content: { padding: 16, paddingBottom: 40, backgroundColor: "#F3F4F6" },

  banner: {
    fontSize: 12,
    fontWeight: "600",
    color: "#92400E",
    backgroundColor: "#FEF3C7",
    borderRadius: 6,
    padding: 8,
    marginBottom: 14,
    lineHeight: 17,
  },
  error: {
    fontSize: 13,
    color: "#991B1B",
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
  },
  empty: { fontSize: 14, color: "#6B7280", lineHeight: 20, paddingVertical: 12 },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  label: { fontSize: 15, fontWeight: "600", color: "#111827" },
  meta: { fontSize: 12, color: "#6B7280", marginTop: 4 },
});
