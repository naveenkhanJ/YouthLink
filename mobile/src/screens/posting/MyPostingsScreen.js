/**
 * An Employer's own postings — FR-POST.
 *
 * The other side of the create flow: what you've posted, how each one is
 * filling up, and the way through to its applicant pool. Reads
 * GET /api/postings/mine, which returns only the caller's own postings —
 * employerId comes from the auth token, never from the request.
 *
 * The urgency flag shown here is the stored, computed one (FR-POST-07); there
 * is no control to change it, here or anywhere.
 */
import { useCallback, useState } from "react";

import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

import { getMyGigPostings } from "../../api/posting.api";
import { parseApiError } from "../../api/client";
import Button from "./components/Button";
import { colors, spacing, radius, typography } from "./theme";
import { ARRANGEMENTS, CATEGORIES, formatPay, labelFor } from "./postingOptions";

/** Reads a stored posting's status as something a person would say. */
function statusLabel(posting) {
  if (posting.status === "FILLED") return "All slots filled";
  if (posting.status === "WITHDRAWN") return "Withdrawn";
  if (posting.status === "EXPIRED") return "Expired";
  const open = posting.workersNeeded - posting.filledCount;
  return `${open} of ${posting.workersNeeded} slot${posting.workersNeeded === 1 ? "" : "s"} open`;
}

export default function MyPostingsScreen({ navigation }) {
  const [postings, setPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async ({ pull } = {}) => {
    if (pull) setRefreshing(true);
    setError(null);
    try {
      const res = await getMyGigPostings();
      setPostings(res.postings || []);
    } catch (err) {
      // GET /mine has no role guard — it filters by the token's own user id,
      // so a job-seeker gets an empty list rather than a 403. Saying "switch
      // to the Employer account" on a 403 would therefore be wrong: that
      // status here means the account is suspended.
      setError(parseApiError(err).formError || "Could not load your postings.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Reload on focus: coming back from creating a posting, or from selecting an
  // applicant, both change what belongs on this screen.
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  if (loading) {
    return (
      <View style={styles.centre}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.screen}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => load({ pull: true })} />
      }
    >
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {!error && postings.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No postings yet</Text>
          <Text style={styles.emptyBody}>
            Only an Employer can post gigs. If you're signed in as an Employer,
            post one and it will appear here with its applicants.
          </Text>
        </View>
      ) : null}

      {postings.map((posting) => (
        <Pressable
          key={posting.id}
          style={styles.card}
          accessibilityRole="button"
          onPress={() => navigation.navigate("PostingDetail", { gigPostingId: posting.id })}
        >
          <View style={styles.cardHead}>
            <Text style={styles.title}>{posting.title}</Text>
            {posting.isUrgent ? <Text style={styles.urgent}>URGENT</Text> : null}
          </View>

          <Text style={styles.meta}>
            {formatPay(posting)} · {labelFor(ARRANGEMENTS, posting.arrangementType)} ·{" "}
            {labelFor(CATEGORIES, posting.category)}
          </Text>
          <Text style={styles.meta}>{posting.locationAreaLabel}</Text>

          <View style={styles.statusRow}>
            <Text
              style={[
                styles.status,
                posting.status === "FILLED" && styles.statusFilled,
              ]}
            >
              {statusLabel(posting)}
            </Text>
            <Text style={styles.chevron}>→</Text>
          </View>
        </Pressable>
      ))}

      {!error ? (
        <Button title="Post a new gig" onPress={() => navigation.navigate("PostingCreate")} />
      ) : null}

      <StatusBar style="dark" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centre: { flex: 1, alignItems: "center", justifyContent: "center" },
  screen: { padding: spacing.lg, paddingBottom: spacing.xxl, backgroundColor: colors.surfaceMuted },

  error: {
    fontSize: typography.caption.fontSize,
    color: colors.danger,
    backgroundColor: "#FEE2E2",
    borderRadius: radius.sm,
    padding: spacing.md,
    marginBottom: spacing.lg,
    lineHeight: 18,
  },

  empty: { paddingVertical: spacing.xl, alignItems: "center" },
  emptyTitle: {
    fontSize: typography.heading.fontSize,
    fontWeight: typography.heading.fontWeight,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  emptyBody: {
    fontSize: typography.caption.fontSize,
    color: colors.textSecondary,
    textAlign: "center",
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardHead: { flexDirection: "row", alignItems: "flex-start" },
  title: {
    flex: 1,
    fontSize: typography.heading.fontSize,
    fontWeight: typography.heading.fontWeight,
    color: colors.textPrimary,
  },
  urgent: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.surface,
    backgroundColor: colors.danger,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    marginLeft: spacing.sm,
    overflow: "hidden",
  },
  meta: {
    fontSize: typography.caption.fontSize,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  status: { flex: 1, fontSize: typography.caption.fontSize, fontWeight: "600", color: colors.primary },
  statusFilled: { color: colors.success },
  chevron: { fontSize: typography.caption.fontSize, color: colors.textPlaceholder },
});
