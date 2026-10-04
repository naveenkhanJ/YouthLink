/**
 * Screen 5.1w / 5.1z / 5.1 / 5.1e / 5.1ez — My Engagements list.
 *
 * Requirements: FR-ENG-14 (Engagements list), FR-ENG-12 (End Engagement).
 * Owner: Naveenkhan (Sprint 4)
 */
import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import { useAuth } from "../../auth/AuthContext";
import { listEngagements } from "../../api/engagement.api";
import EngagementRow from "../../components/EngagementRow";
import EmptyState from "../../components/EmptyState";
import LoadingState from "../../components/LoadingState";
import ShellTabBar from "../../components/ShellTabBar";
import { colors, spacing, typography } from "../../theme/tokens";

export default function EngagementListScreen({ navigation }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [engagements, setEngagements] = useState([]);
  const [error, setError] = useState(null);

  const fetchEngagements = useCallback(async () => {
    try {
      setError(null);
      const res = await listEngagements();
      setEngagements(res.engagements || []);
    } catch (err) {
      setError(err.message || "Failed to load engagements");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchEngagements();
    });
    fetchEngagements();
    return unsubscribe;
  }, [navigation, fetchEngagements]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchEngagements();
  };

  const isWorker = user?.role === "YOUTH_JOB_SEEKER";

  const handleRowPress = (eng) => {
    navigation.navigate("EngagementDetail", { engagementId: eng.id });
  };

  const handleActionPress = (eng) => {
    if (eng.actionLabel === "End engagement") {
      navigation.navigate("EngagementEnd", { engagementId: eng.id });
    } else if (
      eng.actionLabel === "Enter arrival code" ||
      eng.actionLabel === "Show arrival code" ||
      eng.actionLabel === "Enter completion code" ||
      eng.actionLabel === "Show completion code" ||
      eng.actionLabel === "Enter payment code" ||
      eng.actionLabel === "Show payment code"
    ) {
      navigation.navigate("EngagementCode", { engagementId: eng.id });
    } else if (eng.actionLabel === "Re-confirm the new start") {
      navigation.navigate("EngagementReconfirm", { engagementId: eng.id });
    } else {
      navigation.navigate("EngagementDetail", { engagementId: eng.id });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My engagements</Text>
      </View>

      {loading ? (
        <LoadingState />
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {engagements.length === 0 ? (
            isWorker ? (
              <EmptyState
                title="No engagements yet"
                body="When an employer selects you the gig moves here, with its check-in steps and the codes you need to enter."
                actionLabel="Browse gigs"
                onAction={() => navigation.navigate("Home", { tab: "browse" })}
              />
            ) : (
              <EmptyState
                title="No active engagements"
                body="When you select an applicant for one of your postings, their engagement will appear here."
                actionLabel="My postings"
                onAction={() => navigation.navigate("PostingList")}
              />
            )
          ) : (
            engagements.map((item) => (
              <EngagementRow
                key={item.id}
                counterpartyName={item.counterpartyName}
                status={item.status}
                postingTitle={item.postingTitle}
                actionLabel={item.actionLabel}
                onPressAction={() => handleActionPress(item)}
              />
            ))
          )}
        </ScrollView>
      )}

      <ShellTabBar active="engagements" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.subtle,
  },
  header: {
    paddingHorizontal: spacing.gutter,
    paddingTop: spacing.xl,
    paddingBottom: spacing.sm,
  },
  title: {
    ...typography.display,
    color: colors.text.primary,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.gutter,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  errorBox: {
    padding: spacing.md,
    backgroundColor: colors.bg.default,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.state.danger,
  },
  errorText: {
    ...typography.secondary,
    color: colors.state.danger,
  },
});
