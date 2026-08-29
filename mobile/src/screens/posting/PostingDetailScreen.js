/**
 * A single posting, as its Employer sees it — FR-POST-08.
 *
 * The counterpart to the browsing view. Reads GET /api/postings/:id, which
 * runs every response through posting.location.js: the employer who owns the
 * posting and any worker already selected for it get the precise street
 * address, everyone else gets the coarse area only. That decision is made
 * server-side — this screen renders whatever it is handed and does not
 * re-implement the rule.
 *
 * LocationDisplay and MapPinDisplay are the module's own components; both
 * states they render (precise pin vs. general-area halo) are reachable from
 * here depending on who is signed in.
 */
import { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

import { getGigPosting } from "../../api/posting.api";
import { parseApiError } from "../../api/client";
import LocationDisplay from "../../components/LocationDisplay.js";
import Button from "./components/Button";
import { colors, spacing, radius, typography } from "./theme";
import { ARRANGEMENTS, CATEGORIES, formatPay, labelFor } from "./postingOptions";

export default function PostingDetailScreen({ route, navigation }) {
  // Reachable from the postings list, which always passes an id. Guarded all
  // the same, so opening it directly from a launcher explains itself instead
  // of throwing on a missing param.
  const gigPostingId = route.params?.gigPostingId;
  const [posting, setPosting] = useState(null);
  const [loading, setLoading] = useState(Boolean(gigPostingId));
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(
    async ({ pull, retry } = {}) => {
      if (!gigPostingId) return;
      if (pull) setRefreshing(true);
      // A retry has to go back into the loading state, or the screen shows
      // exactly what it showed before and the button reads as dead.
      if (retry) setLoading(true);
      setError(null);
      try {
        const res = await getGigPosting(gigPostingId);
        setPosting(res.posting);
      } catch (err) {
        setError(parseApiError(err).formError || "Could not load this posting.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [gigPostingId],
  );

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  if (!gigPostingId) {
    return (
      <View style={styles.screen}>
        <Text style={styles.title}>No posting selected</Text>
        <Text style={styles.body}>Open one from your postings list.</Text>
        <Button title="My postings" onPress={() => navigation.navigate("PostingMine")} />
        <StatusBar style="dark" />
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centre}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (error || !posting) {
    return (
      <View style={styles.screen}>
        <Text style={styles.error}>{error || "Posting not found."}</Text>
        <Button title="Try again" variant="secondary" onPress={() => load({ retry: true })} />
        <StatusBar style="dark" />
      </View>
    );
  }

  const openSlots = posting.workersNeeded - posting.filledCount;

  return (
    <ScrollView
      contentContainerStyle={styles.screen}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => load({ pull: true })} />
      }
    >
      <View style={styles.head}>
        <Text style={styles.title}>{posting.title}</Text>
        {posting.isUrgent ? <Text style={styles.urgent}>URGENT</Text> : null}
      </View>
      <Text style={styles.subtitle}>
        {labelFor(CATEGORIES, posting.category)} ·{" "}
        {labelFor(ARRANGEMENTS, posting.arrangementType)}
      </Text>

      <Text style={styles.body}>{posting.description}</Text>

      <View style={styles.card}>
        <Row label="Pay" value={`${formatPay(posting)} · per worker`} />
        {posting.schedule ? <Row label="Schedule" value={posting.schedule} /> : null}
        <Row label="Starts" value={new Date(posting.startAt).toLocaleString()} />
        <Row
          label="Slots"
          value={`${posting.filledCount} filled · ${openSlots} open of ${posting.workersNeeded}`}
        />
        <Row label="Status" value={posting.status.toLowerCase()} last />
      </View>

      {posting.postedAsType === "BUSINESS" && posting.postedBusinessName ? (
        <View style={styles.card}>
          <Text style={styles.businessName}>{posting.postedBusinessName}</Text>
          {posting.postedBusinessBio ? (
            <Text style={styles.businessBio}>{posting.postedBusinessBio}</Text>
          ) : null}
        </View>
      ) : null}

      {/* FR-POST-08. Which of the two states this renders is decided by the
          server from who is asking — see posting.location.js. */}
      <LocationDisplay
        locationAreaLabel={posting.locationAreaLabel}
        locationAddress={posting.locationAddress}
        isPreciseLocationReleased={posting.isPreciseLocationReleased}
        locationLat={posting.locationLat}
        locationLng={posting.locationLng}
      />

      <Button
        title="View applicants"
        onPress={() =>
          navigation.navigate("ApplicationApplicantPool", { gigPostingId: posting.id })
        }
      />

      <StatusBar style="dark" />
    </ScrollView>
  );
}

function Row({ label, value, last }) {
  return (
    <View style={[styles.row, last && styles.rowLast]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centre: { flex: 1, alignItems: "center", justifyContent: "center" },
  screen: { padding: spacing.xl, paddingBottom: spacing.xxl, backgroundColor: colors.surface },

  head: { flexDirection: "row", alignItems: "flex-start" },
  title: {
    flex: 1,
    fontSize: typography.title.fontSize,
    fontWeight: typography.title.fontWeight,
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
  subtitle: {
    fontSize: typography.caption.fontSize,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  body: {
    fontSize: typography.body.fontSize,
    color: colors.textPrimary,
    lineHeight: typography.body.lineHeight,
    marginBottom: spacing.lg,
  },
  error: {
    fontSize: typography.caption.fontSize,
    color: colors.danger,
    backgroundColor: "#FEE2E2",
    borderRadius: radius.sm,
    padding: spacing.md,
  },

  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  row: { paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  rowLast: { borderBottomWidth: 0 },
  rowLabel: { fontSize: typography.caption.fontSize, color: colors.textSecondary, marginBottom: 2 },
  rowValue: { fontSize: typography.body.fontSize, color: colors.textPrimary },

  businessName: {
    fontSize: typography.heading.fontSize,
    fontWeight: typography.heading.fontWeight,
    color: colors.textPrimary,
    paddingTop: spacing.lg,
  },
  businessBio: {
    fontSize: typography.caption.fontSize,
    color: colors.textSecondary,
    lineHeight: 18,
    paddingTop: spacing.xs,
    paddingBottom: spacing.lg,
  },
});
