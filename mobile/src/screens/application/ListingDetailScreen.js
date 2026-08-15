/**
 * Listing detail view (FR-APPLY-01) — Naveenkhan.
 *
 * Two known gaps in the posting endpoint this screen depends on
 * (backend/src/modules/posting/, Lahiru's module — not fixed here, flag to
 * him):
 *   1. getGigPostingById() has no `include: { employer: true }`, so the
 *      Employer's display name and phone-verified badge (both required by
 *      FR-APPLY-01) aren't in the response yet — only postedBusinessName/
 *      postedBusinessBio, which live directly on GigPosting. Rendered
 *      conditionally below; the rest silently doesn't show until that's
 *      fixed upstream.
 *   2. The response includes the PRECISE `locationAddress`, unmasked, to
 *      any caller — a live FR-POST-08 violation. This screen deliberately
 *      never reads that field, only `locationAreaLabel`, regardless of
 *      what the API sends. That's a display-layer safeguard, not a fix —
 *      the leak itself is still Lahiru's endpoint to close.
 *
 * No Discovery/browse screen exists yet (Pawan's FR-DISC), so there's no
 * real way to navigate here yet. The manual ID entry below is temporary
 * test scaffolding for that reason — delete it once a browse list can pass
 * `gigPostingId` via route params instead.
 */
import { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import { getGigPosting } from "../../api/posting.api";
import { getMyApplications } from "../../api/application";
import { parseApiError } from "../../api/client";
import { colors, spacing, typography, radius } from "./theme";
import Button from "./components/Button";
import TextField from "./components/TextField";

function formatEnum(value) {
  if (!value) return "";
  return value.replaceAll("_", " ").toLowerCase();
}

function formatPay(posting) {
  if (!posting.payAmount) return formatEnum(posting.payKind);
  const amount = `Rs ${Number(posting.payAmount).toLocaleString()}`;
  return posting.payRateUnit ? `${amount} / ${formatEnum(posting.payRateUnit)}` : amount;
}

export default function ListingDetailScreen({ route, navigation }) {
  const [gigPostingId, setGigPostingId] = useState(route.params?.gigPostingId ?? "");
  const [idInput, setIdInput] = useState("");
  const [posting, setPosting] = useState(null);
  const [existingApplication, setExistingApplication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const [postingRes, myApplications] = await Promise.all([
        getGigPosting(id),
        getMyApplications(),
      ]);
      setPosting(postingRes.posting);
      setExistingApplication(
        myApplications.find(
          (a) => a.gigPosting.id === id && a.status !== "WITHDRAWN",
        ) || null,
      );
    } catch (err) {
      setError(parseApiError(err).formError || "Could not load this posting.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (gigPostingId) load(gigPostingId);
  }, [gigPostingId, load]);

  if (!gigPostingId) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Open a posting</Text>
        <Text style={styles.body}>
          No browse screen exists yet — paste a posting ID to preview it.
        </Text>
        <TextField
          label="Posting ID"
          value={idInput}
          onChangeText={setIdInput}
          placeholder="uuid"
        />
        <Button
          title="Open"
          onPress={() => setGigPostingId(idInput.trim())}
          disabled={!idInput.trim()}
        />
        <StatusBar style="dark" />
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (error || !posting) {
    return (
      <View style={styles.container}>
        <Text style={styles.formError}>{error || "Posting not found."}</Text>
      </View>
    );
  }

  const slotsFilled = `${posting.filledCount} of ${posting.workersNeeded} filled`;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {posting.isUrgent ? <Text style={styles.urgentBadge}>Urgent</Text> : null}
      <Text style={styles.title}>{posting.title}</Text>
      <Text style={styles.caption}>{formatEnum(posting.category)} · {formatEnum(posting.arrangementType)}</Text>

      <Text style={styles.body}>{posting.description}</Text>

      <View style={styles.card}>
        <Text style={styles.row}>Pay: {formatPay(posting)}</Text>
        <Text style={styles.row}>Area: {posting.locationAreaLabel}</Text>
        <Text style={styles.row}>Starts: {new Date(posting.startAt).toLocaleString()}</Text>
        <Text style={styles.row}>{slotsFilled}</Text>
        <Text style={styles.row}>Status: {formatEnum(posting.status)}</Text>
      </View>

      {posting.postedBusinessName || posting.employer ? (
        <View style={styles.card}>
          <Text style={styles.subtitle}>
            {posting.postedBusinessName || posting.employer?.legalName || "Employer"}
          </Text>
          {posting.employer?.phoneVerifiedAt || posting.employer?.phoneVerified ? (
            <Text style={styles.badge}>✓ Phone verified</Text>
          ) : null}
          {posting.postedBusinessBio ? (
            <Text style={styles.body}>{posting.postedBusinessBio}</Text>
          ) : null}
        </View>
      ) : null}

      {existingApplication ? (
        <View style={styles.card}>
          <Text style={styles.row}>
            You've applied — status: {formatEnum(existingApplication.status)}
          </Text>
        </View>
      ) : (
        <Button
          title="Apply"
          onPress={() => navigation.navigate("ApplicationApply", { gigPostingId, title: posting.title })}
          disabled={posting.status !== "OPEN"}
        />
      )}

      <StatusBar style="dark" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: spacing.xl, backgroundColor: colors.surface },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: {
    fontSize: typography.title.fontSize,
    fontWeight: typography.title.fontWeight,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.subtitle.fontSize,
    fontWeight: typography.subtitle.fontWeight,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  caption: {
    fontSize: typography.caption.fontSize,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    textTransform: "capitalize",
  },
  body: { fontSize: typography.body.fontSize, color: colors.textPrimary, marginBottom: spacing.lg },
  card: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  row: { fontSize: typography.body.fontSize, color: colors.textPrimary, marginBottom: spacing.xs },
  urgentBadge: {
    alignSelf: "flex-start",
    backgroundColor: colors.warning,
    color: colors.surface,
    fontSize: typography.caption.fontSize,
    fontWeight: "700",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    marginBottom: spacing.sm,
  },
  badge: {
    fontSize: typography.caption.fontSize,
    color: colors.success,
    fontWeight: "700",
    marginBottom: spacing.xs,
  },
  formError: { fontSize: typography.body.fontSize, color: colors.danger },
});
