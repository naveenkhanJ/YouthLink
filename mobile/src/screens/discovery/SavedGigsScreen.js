/**
 * Saved gigs (prototype 3.8; FR-DISC-06) — added 2026-10-18.
 *
 * Figma 3.8 (116:146): Chrome/ScreenHeader "Saved gigs" over color/bg/subtle; content pad
 * 20/16/24/16, gap 12. A posting nobody can apply to any more is a `savedDead` row — color/bg/subtle,
 * 1px color/border/default, r8, pad 12/14 — with its title in color/text/secondary, a Posting status
 * badge, and "No longer accepting applications"; it is not a link (there is nothing left to apply
 * for). A live one is a Display/ListingCard that opens the listing detail (3.12).
 *
 * The list is the server's, unfiltered: a saved posting stays here "regardless of whether it still
 * appears in default browse results" (FR-DISC-06's acceptance criterion). A posting is saved and
 * unsaved from its listing detail ("Save" / "Saved" in the header).
 *
 * States: loading (Feedback/LoadingState cards), empty (Feedback/EmptyState NoneExist — not drawn;
 * copy recorded in decisions.md), load failure or offline (FormBanner Kind=Error + "Try again",
 * design-system §8), pull to refresh. Re-read every time the screen comes into view, so a gig
 * un-saved on its detail is gone when the person comes back.
 */
import { useCallback, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect } from "@react-navigation/native";
import { colors, radius, spacing, typography } from "../../theme/tokens";
import ScreenHeader from "../../components/ScreenHeader";
import ListingCard from "../../components/ListingCard";
import Badge from "../../components/Badge";
import LoadingState from "../../components/LoadingState";
import EmptyState from "../../components/EmptyState";
import FormBanner from "../../components/FormBanner";
import Button from "../../components/Button";
import PressableScale from "../../components/PressableScale";
import { isRouteRegistered } from "../../components/ShellTabBar";
import { listSavedGigs } from "../../api/discovery.api";
import { parseApiError } from "../../api/client";
import { cardPay, savedFill, savedMeta } from "./discovery.format";

// The listing detail (3.12) belongs to the Applying module.
const LISTING_DETAIL_SCREEN = "ApplicationListingDetail";

export default function SavedGigsScreen({ navigation }) {
  const [postings, setPostings] = useState(null); // null until loaded
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const result = await listSavedGigs();
      setPostings(result.postings);
      setError(null);
    } catch (err) {
      setError(
        err.offline
          ? "You're offline, so your saved gigs couldn't be loaded. Try again once you reconnect."
          : parseApiError(err).formError || "Your saved gigs couldn't be loaded.",
      );
    } finally {
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  function open(item) {
    if (isRouteRegistered(navigation, LISTING_DETAIL_SCREEN)) {
      navigation.navigate(LISTING_DETAIL_SCREEN, { gigPostingId: item.id });
    }
  }

  function renderItem({ item }) {
    if (!item.live) {
      // savedDead: not a link — read as one row by TalkBack.
      return (
        <View
          style={styles.dead}
          accessible
          accessibilityLabel={`${item.title}, ${item.status.toLowerCase()}. No longer accepting applications.`}
        >
          <View style={styles.deadTop}>
            <Text style={styles.deadTitle}>{item.title}</Text>
            <Badge family="posting" value={item.status.toLowerCase()} />
          </View>
          <Text style={styles.deadMeta}>No longer accepting applications</Text>
        </View>
      );
    }
    return (
      <PressableScale onPress={() => open(item)} accessibilityRole="button" accessibilityLabel={item.title}>
        <ListingCard
          title={item.title}
          subtitle={savedMeta(item)}
          payLine={cardPay(item)}
          statusLine={savedFill(item)}
          urgent={item.isUrgent}
        />
      </PressableScale>
    );
  }

  function renderEmpty() {
    if (postings === null) {
      if (error) return null;
      return (
        <View style={styles.loading}>
          <LoadingState />
          <LoadingState />
          <LoadingState />
        </View>
      );
    }
    return (
      <EmptyState
        title="No saved gigs yet"
        body="Tap Save on a gig's details to keep it here, so you can come back to it without searching again."
        actionLabel="Browse gigs"
        onAction={() => navigation.goBack()}
      />
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScreenHeader title="Saved gigs" onBack={() => navigation.goBack()} />
      <FlatList
        data={postings ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          error ? (
            <View style={styles.errorBlock}>
              <FormBanner kind="error" message={error} />
              {postings === null ? <Button title="Try again" style="secondary" onPress={load} /> : null}
            </View>
          ) : null
        }
        ListEmptyComponent={renderEmpty()}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.gap} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              load();
            }}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg.subtle,
  },
  // Figma: content pad 20/16/24/16, gap 12 (the gap is the separator, so the header and the
  // empty state are not pushed apart by it).
  content: {
    flexGrow: 1,
    paddingTop: 20,
    paddingHorizontal: spacing.gutter,
    paddingBottom: spacing.xl,
  },
  gap: {
    height: spacing.md,
  },
  errorBlock: {
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  loading: {
    gap: spacing.md,
  },
  // savedDead: vertical pad 12/14, gap 6, bg/subtle, 1px border/default, r8.
  dead: {
    paddingVertical: spacing.md,
    paddingHorizontal: 14,
    gap: 6,
    backgroundColor: colors.bg.subtle,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: radius.input,
  },
  // topRow: horizontal, gap 8; the title fills and wraps, the badge hugs.
  deadTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  deadTitle: {
    flex: 1,
    ...typography.bodyMedium,
    color: colors.text.secondary,
  },
  deadMeta: {
    ...typography.caption,
    color: colors.text.secondary,
  },
});
