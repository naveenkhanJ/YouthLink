/**
 * Employer applicant pool (FR-APPLY-04 three-tier sort, FR-APPLY-05 view,
 * FR-APPLY-06 select, FR-APPLY-08 decline) — Naveenkhan.
 *
 * Starts from the Employer's own postings (Lahiru's already-built
 * GET /api/postings/mine) so there's a real way to reach a pool without
 * waiting on a "my postings" screen that isn't this module's to build —
 * this only reads his endpoint, it doesn't add UI to his module.
 */
import { useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Pressable } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { getMyGigPostings } from "../../api/posting.api";
import { getApplicantPool, selectApplicant, declineApplicant } from "../../api/application";
import { parseApiError } from "../../api/client";
import { colors, spacing, radius, typography } from "./theme";
import Button from "./components/Button";

function formatEnum(value) {
  return value.replaceAll("_", " ").toLowerCase();
}

function ApplicantCard({ applicant, onSelect, onDecline, actingId }) {
  const acting = actingId === applicant.applicationId;
  const isPending = applicant.status === "PENDING";
  const hasHistory = applicant.avgRating !== null;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.name}>{applicant.worker.displayName}</Text>
        {applicant.worker.phoneVerified ? <Text style={styles.badge}>Phone verified</Text> : null}
      </View>

      {hasHistory ? (
        <Text style={styles.row}>
          ★ {applicant.avgRating.toFixed(1)} · {Math.round(applicant.completionRate * 100)}% completion
        </Text>
      ) : (
        <Text style={styles.row}>
          New to YouthLink{applicant.isEndorsed ? " · Endorsed" : ""}
        </Text>
      )}

      {applicant.note ? <Text style={styles.note}>"{applicant.note}"</Text> : null}
      <Text style={styles.status}>{formatEnum(applicant.status)}</Text>

      {isPending ? (
        <View style={styles.actions}>
          <Button
            title="Select"
            loading={acting}
            onPress={() => onSelect(applicant.applicationId)}
          />
          <Button
            title="Decline"
            variant="danger"
            loading={acting}
            onPress={() => onDecline(applicant.applicationId)}
          />
        </View>
      ) : null}
    </View>
  );
}

export default function ApplicantPoolScreen() {
  const [postings, setPostings] = useState(null);
  const [selectedPosting, setSelectedPosting] = useState(null);
  const [pool, setPool] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actingId, setActingId] = useState(null);

  const loadPostings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { postings } = await getMyGigPostings();
      setPostings(postings);
    } catch (err) {
      setError(parseApiError(err).formError || "Could not load your postings.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadPool = useCallback(async (gigPostingId) => {
    setLoading(true);
    setError(null);
    try {
      setPool(await getApplicantPool(gigPostingId));
    } catch (err) {
      setError(parseApiError(err).formError || "Could not load applicants.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (selectedPosting) {
        loadPool(selectedPosting.id);
      } else {
        loadPostings();
      }
    }, [selectedPosting, loadPool, loadPostings]),
  );

  async function runAction(applicationId, action) {
    setActingId(applicationId);
    setError(null);
    try {
      await action(applicationId);
      await loadPool(selectedPosting.id);
    } catch (err) {
      setError(parseApiError(err).formError || "That action failed.");
    } finally {
      setActingId(null);
    }
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!selectedPosting) {
    return (
      <View style={styles.screen}>
        {error ? <Text style={styles.formError}>{error}</Text> : null}
        <FlatList
          data={postings || []}
          keyExtractor={(p) => p.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable style={styles.postingRow} onPress={() => setSelectedPosting(item)}>
              <Text style={styles.name}>{item.title}</Text>
              <Text style={styles.row}>
                {item.filledCount} of {item.workersNeeded} filled · {formatEnum(item.status)}
              </Text>
            </Pressable>
          )}
          ListEmptyComponent={<Text style={styles.body}>You haven't posted anything yet.</Text>}
        />
        <StatusBar style="dark" />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.headerBar}>
        <Pressable onPress={() => setSelectedPosting(null)}>
          <Text style={styles.link}>← All postings</Text>
        </Pressable>
        <Text style={styles.title}>{selectedPosting.title}</Text>
      </View>

      {error ? <Text style={styles.formError}>{error}</Text> : null}

      <FlatList
        data={pool}
        keyExtractor={(a) => a.applicationId}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <ApplicantCard
            applicant={item}
            actingId={actingId}
            onSelect={(id) => runAction(id, selectApplicant)}
            onDecline={(id) => runAction(id, declineApplicant)}
          />
        )}
        ListEmptyComponent={<Text style={styles.body}>No applicants yet.</Text>}
      />
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  list: { padding: spacing.xl },
  headerBar: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg },
  link: { color: colors.primary, fontSize: typography.body.fontSize, marginBottom: spacing.sm },
  title: {
    fontSize: typography.title.fontSize,
    fontWeight: typography.title.fontWeight,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  postingRow: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  name: {
    fontSize: typography.subtitle.fontSize,
    fontWeight: typography.subtitle.fontWeight,
    color: colors.textPrimary,
  },
  badge: {
    fontSize: typography.caption.fontSize,
    color: colors.success,
    fontWeight: "700",
  },
  row: { fontSize: typography.body.fontSize, color: colors.textSecondary, marginTop: spacing.xs },
  note: {
    fontSize: typography.body.fontSize,
    color: colors.textPrimary,
    fontStyle: "italic",
    marginTop: spacing.sm,
  },
  status: {
    fontSize: typography.caption.fontSize,
    color: colors.textSecondary,
    textTransform: "uppercase",
    marginTop: spacing.sm,
  },
  actions: { flexDirection: "row", gap: spacing.md },
  body: { fontSize: typography.body.fontSize, color: colors.textSecondary, textAlign: "center", marginTop: spacing.xxl },
  formError: { fontSize: typography.caption.fontSize, color: colors.danger, padding: spacing.lg },
});
