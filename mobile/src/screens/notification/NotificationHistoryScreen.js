/**
 * Notifications — the history on the Notifications tab (prototype 3.10x / 3.10 family) — Pawan.
 *
 * Every role's Notifications tab opens this screen (FR-NOTIF-08: "All actor types"). It is how a
 * gig notification from FR-NOTIF-01 / FR-NOTIF-02 reaches the person in this build: the app has no
 * push delivery yet, so the rows the fan-out writes are read here, which is also what FR-NOTIF-09
 * promises when push is off.
 *
 * Drawn states built here:
 *   3.10x   rows, newest first — "Urgent gig near you" / "New gig near you" open the listing (3.12)
 *   3.10ldg loading — four Feedback/LoadingState cards under the title row
 *   3.10z / 3.10ez / 3.10vz  first run, per role — Feedback/EmptyState {NoneExist} with its action
 * Not drawn, built from design-system.md §5 and FR-NOTIF-01: the urgent digest
 * (Display/NotificationRow {Type=Digest}), which expands in place to the gigs batched into it.
 * A failed load is composed per §8: Feedback/FormBanner with "Try again".
 *
 * How each row is worded is notification.format.js.
 */
import { useCallback, useState } from "react";
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing, typography } from "../../theme/tokens";
import NotificationRow from "../../components/NotificationRow";
import LoadingState from "../../components/LoadingState";
import EmptyState from "../../components/EmptyState";
import FormBanner from "../../components/FormBanner";
import Button from "../../components/Button";
import ShellTabBar, { isRouteRegistered, openShellTab, tabBarRoleFor } from "../../components/ShellTabBar";
import { useAuth } from "../../auth/AuthContext";
import { getNotifications, markNotificationAsRead } from "../../api/notification.api";
import { parseApiError } from "../../api/client";
import { presentRow, timeAgo } from "./notification.format";

// The listing detail (3.12) belongs to the Applying module.
const LISTING_DETAIL_SCREEN = "ApplicationListingDetail";

// 3.10z / 3.10ez / 3.10vz — each role's first-run history: its body copy and its one action
// (a tab of that role's own bar).
const FIRST_RUN = {
  worker: {
    body: "We'll tell you about gigs near you, and about anything that needs an answer from you.",
    action: "Browse gigs",
    tab: "browse",
  },
  employer: {
    body: "We'll tell you when someone applies to a posting, and when an engagement needs you.",
    action: "Post a gig",
    tab: "postGig",
  },
  verifier: {
    body: "We'll tell you when someone you vouched for gets their first rating.",
    action: "Vouch for someone",
    tab: "vouch",
  },
};

export default function NotificationHistoryScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const role = tabBarRoleFor(user);

  const [rows, setRows] = useState(null); // null until loaded
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [expanded, setExpanded] = useState({}); // digest id -> true while open

  const load = useCallback(async () => {
    try {
      const { notifications } = await getNotifications();
      // A row is shown only when it can be worded (presentRow returns null otherwise).
      setRows(notifications.map((row) => ({ row, view: presentRow(row) })).filter(({ view }) => view));
      setError(null);
    } catch (err) {
      setError(parseApiError(err).formError || "Your notifications couldn't be loaded.");
    } finally {
      setRefreshing(false);
    }
  }, []);

  // On open, and every time the tab is returned to.
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  function markRead(row) {
    if (!row.readAt) markNotificationAsRead(row.id).catch(() => {}); // a missed mark is harmless
  }

  function openRow(row, view) {
    markRead(row);
    if (view.opens === "expand") {
      setExpanded((prev) => ({ ...prev, [row.id]: !prev[row.id] }));
      return;
    }
    if (view.opens?.gigPostingId && isRouteRegistered(navigation, LISTING_DETAIL_SCREEN)) {
      // The listing as it stands now, not as it was when the notification was sent.
      navigation.navigate(LISTING_DETAIL_SCREEN, { gigPostingId: view.opens.gigPostingId });
      return;
    }
    // A11's other targets (the pool, the engagement, the re-confirmation, the ratings…): the screen
    // as it stands now, opened only when this build has it.
    if (view.opens?.screen && isRouteRegistered(navigation, view.opens.screen)) {
      navigation.navigate(view.opens.screen, view.opens.params);
    }
  }

  function renderItem({ item: { row, view } }) {
    const children = view.opens === "expand" && expanded[row.id] ? row.children : [];
    return (
      <View style={styles.item}>
        <NotificationRow
          type={view.type}
          title={view.title}
          body={view.body}
          timeAgo={timeAgo(row.createdAt)}
          onPress={() => openRow(row, view)}
        />
        {children.map((child) => {
          const childView = presentRow(child);
          return childView ? (
            <NotificationRow
              key={child.id}
              title={childView.title}
              body={childView.body}
              timeAgo={timeAgo(child.createdAt)}
              onPress={() => openRow(child, childView)}
            />
          ) : null;
        })}
      </View>
    );
  }

  const firstRun = FIRST_RUN[role];

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <FlatList
        data={rows ?? []}
        keyExtractor={({ row }) => row.id}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 22 }]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              load();
            }}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Text style={styles.screenTitle}>Notifications</Text>
              <Pressable
                onPress={() => navigation.navigate("NotificationPreferences")}
                style={styles.prefsLink}
                accessibilityRole="link"
              >
                <Text style={styles.prefsLabel}>Preferences</Text>
              </Pressable>
            </View>
            {error ? <FormBanner kind="error" message={error} /> : null}
            {error && rows === null ? <Button title="Try again" style="secondary" onPress={load} /> : null}
          </View>
        }
        ListEmptyComponent={
          rows === null ? (
            error ? null : (
              <View style={styles.loading}>
                <LoadingState />
                <LoadingState />
                <LoadingState />
                <LoadingState />
              </View>
            )
          ) : firstRun ? (
            <EmptyState
              title="No notifications yet"
              body={firstRun.body}
              actionLabel={firstRun.action}
              onAction={() => openShellTab(navigation, role, firstRun.tab)}
            />
          ) : null
        }
        renderItem={renderItem}
      />
      {/* The role's tab bar, Notifications active; no dot on the screen that shows them. */}
      <ShellTabBar active="notifications" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg.subtle,
  },
  // content: pad 66/16/…/16 (66 = the status bar plus 22), gap 12. Scrolls above the tab bar.
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.gutter,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  header: {
    gap: spacing.md,
  },
  // titleRow: horizontal, gap 12 — the title fills, "Preferences" sits right in a 91×44 target.
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  screenTitle: {
    flex: 1,
    ...typography.display,
    color: colors.text.primary,
  },
  prefsLink: {
    minHeight: 44,
    justifyContent: "center",
  },
  prefsLabel: {
    ...typography.body,
    color: colors.brand.primary,
    textAlign: "right",
  },
  item: {
    gap: spacing.md,
  },
  loading: {
    gap: spacing.md,
  },
});
