/**
 * DEMO-ONLY browse screen — integration showcase branch. NOT part of any epic.
 *
 * ===========================================================================
 * Only exists on `demo/integration-showcase`. Never merge into develop.
 * ===========================================================================
 *
 * Stands in for Discovery (FR-DISC, Pawan) purely so a worker can see that
 * postings exist. It is NOT an implementation of his slice: no radius query,
 * no auto-expansion, no filters, no keyword search, no sort options. It is one
 * unfiltered list, urgent first, newest after — whatever the demo endpoint
 * returns. When his real browse screen lands it appears in the hub on its own
 * and this can be deleted.
 *
 * What it does demonstrate is Gig Posting's own work: the computed urgency
 * flag (FR-POST-07) and the coarse-vs-precise location rule (FR-POST-08),
 * rendered through Lahiru's own LocationDisplay component rather than
 * anything reimplemented here.
 */
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import LocationDisplay from "../components/LocationDisplay.js";
import { browsePostings } from "./demo.api";

/** PayKind + PayRateUnit -> one readable line. Mirrors FR-POST-04's formats. */
function formatPay({ payKind, payAmount, payRateUnit }) {
  if (payKind === "UNPAID") return "Unpaid";
  if (payAmount == null) return payKind;
  const amount = `Rs ${Number(payAmount).toLocaleString("en-LK")}`;
  if (payKind === "FIXED_TOTAL") return `${amount} total`;
  if (payRateUnit) return `${amount} per ${payRateUnit.toLowerCase()}`;
  return amount;
}

export default function DemoBrowseScreen() {
  const [postings, setPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      setPostings(await browsePostings());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Reload on every focus, not just mount: the demo switches roles and selects
  // applicants between visits, and a stale list would misrepresent both.
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
        Demo scaffolding — stands in for Discovery (FR-DISC), which is not built
        yet. No radius, filters or search.
      </Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {!error && postings.length === 0 ? (
        <Text style={styles.empty}>
          No open postings. Run backend/src/demo/seed.demo.js, or create one
          from the Gig Posting slice.
        </Text>
      ) : null}

      {postings.map((posting) => {
        const isOpen = expanded === posting.id;
        return (
          <Pressable
            key={posting.id}
            style={styles.card}
            onPress={() => setExpanded(isOpen ? null : posting.id)}
          >
            <View style={styles.cardHead}>
              <Text style={styles.title}>{posting.title}</Text>
              {posting.isUrgent ? (
                <Text style={styles.urgent}>URGENT</Text>
              ) : null}
            </View>

            <Text style={styles.meta}>
              {formatPay(posting)} · {posting.arrangementType.replace("_", "-")} ·{" "}
              {posting.category.replace(/_/g, " ").toLowerCase()}
            </Text>
            <Text style={styles.meta}>
              {posting.employerName} · {posting.applicantCount} applicant
              {posting.applicantCount === 1 ? "" : "s"} ·{" "}
              {posting.workersNeeded - posting.filledCount} of{" "}
              {posting.workersNeeded} slot
              {posting.workersNeeded === 1 ? "" : "s"} open
            </Text>

            {isOpen ? (
              <View style={styles.detail}>
                <Text style={styles.description}>{posting.description}</Text>

                {/* Lahiru's own component, showing his own privacy rule. */}
                <LocationDisplay
                  locationAreaLabel={posting.locationAreaLabel}
                  locationAddress={posting.locationAddress}
                  isPreciseLocationReleased={posting.isPreciseLocationReleased}
                  locationLat={posting.locationLat}
                  locationLng={posting.locationLng}
                />

                {posting.schedule ? (
                  <Text style={styles.meta}>Schedule: {posting.schedule}</Text>
                ) : null}
                <Text style={styles.idNote}>id: {posting.id}</Text>
              </View>
            ) : (
              <Text style={styles.hint}>Tap for details and location</Text>
            )}
          </Pressable>
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
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cardHead: { flexDirection: "row", alignItems: "flex-start" },
  title: { flex: 1, fontSize: 16, fontWeight: "700", color: "#111827" },
  urgent: {
    fontSize: 10,
    fontWeight: "800",
    color: "#FFFFFF",
    backgroundColor: "#DC2626",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginLeft: 8,
    overflow: "hidden",
  },
  meta: { fontSize: 13, color: "#6B7280", marginTop: 4, lineHeight: 18 },
  hint: { fontSize: 12, color: "#9CA3AF", marginTop: 8, fontStyle: "italic" },

  detail: { marginTop: 10 },
  description: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
    marginBottom: 10,
  },
  idNote: { fontSize: 11, color: "#C4C7CE", marginTop: 8 },
});
