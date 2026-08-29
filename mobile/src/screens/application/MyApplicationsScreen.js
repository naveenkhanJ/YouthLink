/**
 * A worker's own applications (FR-APPLY-03 withdraw, FR-APPLY-07 worker-side
 * contact reveal) — Naveenkhan.
 *
 * Reveal isn't a separate action here: once `engagement` is present on an
 * application, the employer's phone and the precise address are already in
 * the payload (see application.service.js's getMyApplications) because
 * Engagement.contactRevealedAt defaults to now() the instant selection
 * happens on the backend.
 */
import { useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { getMyApplications, withdrawApplication } from "../../api/application";
import { parseApiError } from "../../api/client";
import { colors, spacing, radius, typography } from "./theme";
import Button from "./components/Button";

function formatEnum(value) {
  return value.replaceAll("_", " ").toLowerCase();
}

const STATUS_COLOR = {
  PENDING: colors.warning,
  SELECTED: colors.success,
  DECLINED: colors.danger,
  NOT_SELECTED: colors.textSecondary,
  WITHDRAWN: colors.textSecondary,
};

function ApplicationCard({ application, onWithdraw, withdrawing }) {
  const { gigPosting, engagement } = application;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{gigPosting.title}</Text>
      <Text style={[styles.status, { color: STATUS_COLOR[application.status] }]}>
        {formatEnum(application.status)}
      </Text>

      {engagement ? (
        <View style={styles.revealBox}>
          <Text style={styles.revealLabel}>Contact revealed</Text>
          <Text style={styles.row}>
            {engagement.employer.businessName || engagement.employer.legalName}: {engagement.employer.phone}
          </Text>
          <Text style={styles.row}>Address: {engagement.gigPosting.locationAddress}</Text>
        </View>
      ) : null}

      {application.status === "PENDING" ? (
        <Button
          title="Withdraw"
          variant="secondary"
          loading={withdrawing}
          onPress={() => onWithdraw(application.id)}
        />
      ) : null}
    </View>
  );
}

export default function MyApplicationsScreen() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [withdrawingId, setWithdrawingId] = useState(null);

  const load = useCallback(async ({ silent } = {}) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      setApplications(await getMyApplications());
    } catch (err) {
      setError(parseApiError(err).formError || "Could not load your applications.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  async function handleWithdraw(applicationId) {
    setWithdrawingId(applicationId);
    try {
      await withdrawApplication(applicationId);
      await load({ silent: true });
    } catch (err) {
      setError(parseApiError(err).formError || "Could not withdraw that application.");
    } finally {
      setWithdrawingId(null);
    }
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {error ? <Text style={styles.formError}>{error}</Text> : null}
      <FlatList
        data={applications}
        keyExtractor={(a) => a.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              load({ silent: true });
            }}
          />
        }
        renderItem={({ item }) => (
          <ApplicationCard
            application={item}
            onWithdraw={handleWithdraw}
            withdrawing={withdrawingId === item.id}
          />
        )}
        ListEmptyComponent={<Text style={styles.body}>You haven't applied to anything yet.</Text>}
      />
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  list: { padding: spacing.xl },
  card: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.subtitle.fontSize,
    fontWeight: typography.subtitle.fontWeight,
    color: colors.textPrimary,
  },
  status: {
    fontSize: typography.caption.fontSize,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: spacing.sm,
  },
  revealBox: {
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  revealLabel: { fontSize: typography.caption.fontSize, fontWeight: "700", color: colors.success, marginBottom: spacing.xs },
  row: { fontSize: typography.body.fontSize, color: colors.textPrimary },
  body: { fontSize: typography.body.fontSize, color: colors.textSecondary, textAlign: "center", marginTop: spacing.xxl },
  formError: {
    fontSize: typography.caption.fontSize,
    color: colors.danger,
    padding: spacing.lg,
  },
});
