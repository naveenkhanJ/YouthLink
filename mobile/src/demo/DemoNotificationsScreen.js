/**
 * DEMO-ONLY notifications screen — integration showcase branch.
 *
 * ===========================================================================
 * Only exists on `demo/integration-showcase`. Never merge into develop.
 * ===========================================================================
 *
 * Two modules write Notification rows — Applying & Selection on select,
 * decline and the automatic not-selected sweep, and Notifications on the
 * urgent/non-urgent fan-out — but nothing in the app displayed them, so
 * FR-APPLY-08/09 and FR-NOTIF-01/02 were all invisible.
 *
 * NOT an implementation of the Notifications slice (FR-NOTIF, Pawan). It reads
 * that module's own GET /api/notifications and renders what comes back,
 * including the digest roll-up (batchedCount / batchedItems) its 5-per-day cap
 * produces. The triggers, the cap, the batching and the preferences screen are
 * all his; this is only somewhere for the result to be seen.
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
        Demo scaffolding — a plain list over the real GET /api/notifications.
        The Notifications slice owns the triggers, the 5/day cap and the
        preferences screen; this only gives them somewhere to be seen.
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
        const rolledUp = item.batchedCount > 0;
        return (
          <View key={item.id} style={[styles.card, rolledUp && styles.cardDigest]}>
            <Text style={styles.label}>
              {rolledUp ? `${item.batchedCount} more urgent gigs today` : label}
            </Text>
            <Text style={styles.meta}>
              {formatWhen(item.createdAt)}
              {requirement ? ` · ${requirement}` : ""}
              {item.readAt ? "" : " · unread"}
            </Text>

            {/* The 5/day push cap (FR-NOTIF-01) rolls everything past the
                limit into one digest instead of pushing each one. The gigs
                are still listed — they just arrive as a single notification. */}
            {rolledUp
              ? item.batchedItems.map((child) => (
                  <Text key={child.id} style={styles.child}>
                    • {child.payload?.title ?? "Urgent gig"}
                  </Text>
                ))
              : null}
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
    color: "#92400E",
    backgroundColor: "#FFFBEB",
    borderLeftWidth: 3,
    borderLeftColor: "#F59E0B",
    borderRadius: 6,
    padding: 10,
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
  cardDigest: { borderColor: "#1D4ED8", backgroundColor: "#EFF6FF" },
  label: { fontSize: 15, fontWeight: "600", color: "#111827" },
  meta: { fontSize: 12, color: "#6B7280", marginTop: 4 },
  child: { fontSize: 13, color: "#374151", marginTop: 6, lineHeight: 18 },
});
