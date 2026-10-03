/**
 * Browse — the worker's Browse tab (prototype 3.1 and its states) — Pawan.
 *
 * FR-DISC-01 radius browsing with auto-expansion · FR-DISC-02 where the search is centred ·
 * FR-DISC-03 filters (chosen on 3.5) · FR-DISC-05 sort (the 3.6 sheet, here) · FR-DISC-07
 * session-only choices (discoverySession.js).
 *
 * Drawn states built here:
 *   3.3     first entry: the location question, with its one line of context above the OS dialogue
 *   3.1ldg  loading — three Feedback/LoadingState cards under the header, search and chips
 *   3.1     results, urgent first then nearest           3.2  the search widened automatically
 *   3.1f    filtered ("1 gig within 5 km … · 2 filters on", the Filters chip selected)
 *   3.6     the Sort sheet over the list (its scrim dismisses it)
 *   3.1ofl  offline: the last results, read-only, under Feedback/OfflineBar (NFR-USE-01)
 * Composed per design-system.md §8: nothing found → Feedback/EmptyState (NoneExist, or
 * FiltersExclude with "Clear filters"); a failed load → Feedback/FormBanner with "Try again".
 *
 * Where the search is centred (FR-DISC-02, amended A10):
 *   - never asked → the context line shows, then the OS dialogue opens over it;
 *   - allowed → the device's position;
 *   - refused, or no position could be had → the manual area screen (3.4);
 *   - permanently refused (the OS won't ask again) → straight to 3.4, with its settings hint.
 * The answer is kept for the rest of the app session, so the question is asked on first entry only.
 * All device-location access goes through deviceLocation.js.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, Modal, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing, typography } from "../../theme/tokens";
import { fill } from "../../theme/layout";
import Chip from "../../components/Chip";
import ListingCard from "../../components/ListingCard";
import LoadingState from "../../components/LoadingState";
import EmptyState from "../../components/EmptyState";
import FormBanner from "../../components/FormBanner";
import OfflineBar from "../../components/OfflineBar";
import BottomSheet from "../../components/BottomSheet";
import Button from "../../components/Button";
import ShellTabBar, { isRouteRegistered } from "../../components/ShellTabBar";
import { browseGigs } from "../../api/discovery.api";
import { getUnreadNotificationCount } from "../../api/notification.api";
import { parseApiError } from "../../api/client";
import SearchBar from "./components/SearchBar";
import * as deviceLocation from "./deviceLocation";
import {
  activeFilterCount,
  centreParams,
  getSession,
  rememberResult,
  setCentre,
  setFilters,
  setPermanentlyDenied,
  setSort,
} from "./discoverySession";
import {
  SORT_OPTIONS,
  cardFill,
  cardMeta,
  cardPay,
  filtersChipLabel,
  offlineRadiusLine,
  radiusLine,
  sortLabel,
} from "./discovery.format";

// 3.3's contextLine — FR-DISC-02: one line saying why location is asked, before the OS asks.
const LOCATION_CONTEXT_LINE = "YouthLink asks for your location so it can show gigs within 5 km of you.";
// How long the context line is on screen, alone, before the OS dialogue opens over it. Without the
// pause the dialogue opens before the line is even drawn, and the reason is never seen.
const CONTEXT_LINE_LEAD_MS = 1200;

// The listing detail (3.12) belongs to the Applying module.
const LISTING_DETAIL_SCREEN = "ApplicationListingDetail";

export default function DiscoveryScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const session = getSession();

  // "checking" → reading the permission · "asking" → the OS dialogue is open (3.3) ·
  // "locating" → reading the device position · "needsArea" → no position and no area chosen ·
  // "ready" → there is a search centre.
  const [phase, setPhase] = useState(session.centre ? "ready" : "checking");
  const [filters, setFiltersState] = useState(session.filters);
  const [sortBy, setSortState] = useState(session.sortBy);
  const [result, setResult] = useState(null); // the last browse response for the current request
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [offline, setOffline] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const askedThisMount = useRef(false);
  const latestRequest = useRef(0); // only the newest load may update the screen

  const filterCount = activeFilterCount(filters);

  // -------------------------------------------------------------------------
  // Loading results
  // -------------------------------------------------------------------------

  const load = useCallback(
    async ({ pull = false } = {}) => {
      const centre = getSession().centre;
      if (!centre) return;
      const current = getSession();
      const requestId = ++latestRequest.current;
      if (pull) setRefreshing(true);
      else setLoading(true);
      setError(null);
      try {
        const response = await browseGigs({
          ...centreParams(centre),
          category: current.filters.category,
          arrangementType: current.filters.arrangementType,
          sortBy: current.sortBy,
        });
        if (requestId !== latestRequest.current) return; // a newer sort or filter has taken over
        setResult(response);
        setOffline(false);
        rememberResult(response);
      } catch (err) {
        if (requestId !== latestRequest.current) return;
        if (err.offline && getSession().lastResult) {
          // NFR-USE-01: what already loaded stays viewable (3.1ofl).
          setOffline(true);
        } else {
          setError(parseApiError(err).formError || "Gigs couldn't be loaded. Try again.");
        }
      } finally {
        if (requestId === latestRequest.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [],
  );

  // -------------------------------------------------------------------------
  // FR-DISC-02 — where the search is centred
  // -------------------------------------------------------------------------

  const openAreaPicker = useCallback(
    (permanentlyDenied) => {
      setPermanentlyDenied(permanentlyDenied);
      setPhase("needsArea");
      navigation.navigate("DiscoveryLocation", { permanentlyDenied });
    },
    [navigation],
  );

  const searchFromDevice = useCallback(async () => {
    setPhase("locating");
    const position = await deviceLocation.getCurrentPosition();
    if (!position) {
      // Allowed, but the phone gave no position (location services off, no fix): same fallback.
      openAreaPicker(false);
      return;
    }
    setCentre({ kind: "device", lat: position.lat, lng: position.lng });
    setPhase("ready");
    load();
  }, [openAreaPicker, load]);

  useEffect(() => {
    if (session.centre || askedThisMount.current) return;
    askedThisMount.current = true;

    (async () => {
      let permission = await deviceLocation.getPermissionStatus();
      // Ask on first entry (undetermined) and again while the OS would still show its dialogue
      // (refused once, canAskAgain). Only when the OS has stopped showing it — "permanently denied" —
      // does it skip the ask and route to 3.4 with the settings hint (FR-DISC-02, A10). Without the
      // second case a person who tapped "Don't allow" once would never be asked again and would never
      // learn that settings can restore it.
      if (permission.status === "undetermined" || (permission.status === "denied" && permission.canAskAgain)) {
        setPhase("asking");
        await new Promise((resolve) => setTimeout(resolve, CONTEXT_LINE_LEAD_MS));
        permission = await deviceLocation.requestPermission();
      }
      if (permission.status === "granted") {
        await searchFromDevice();
      } else {
        // Refused or unavailable. "Permanently" only when the OS itself won't ask again (A10).
        openAreaPicker(permission.status === "denied" && !permission.canAskAgain);
      }
    })();
  }, [session.centre, searchFromDevice, openAreaPicker]);

  // Every time Browse comes into view: pick up an area chosen on 3.4 or filters set on 3.5, reload,
  // and refresh the Notifications tab's dot.
  useFocusEffect(
    useCallback(() => {
      const current = getSession();
      setFiltersState(current.filters);
      setSortState(current.sortBy);
      if (current.centre) {
        setPhase("ready");
        load();
      }
      getUnreadNotificationCount()
        .then(({ count }) => setHasUnread(count > 0))
        .catch(() => {}); // the dot is a hint; a failed count must not disturb Browse
    }, [load]),
  );

  // -------------------------------------------------------------------------
  // Actions
  // -------------------------------------------------------------------------

  function chooseSort(value) {
    setSortOpen(false);
    if (value === sortBy) return;
    setSort(value);
    setSortState(value);
    load();
  }

  function clearFilters() {
    setFilters({});
    setFiltersState(getSession().filters);
    load();
  }

  function openListing(item) {
    if (!isRouteRegistered(navigation, LISTING_DETAIL_SCREEN)) return;
    navigation.navigate(LISTING_DETAIL_SCREEN, { gigPostingId: item.id });
  }

  // -------------------------------------------------------------------------
  // Rendering
  // -------------------------------------------------------------------------

  const shown = offline ? getSession().lastResult : result;
  const postings = shown?.postings ?? [];
  const controlsLive = phase === "ready" && !offline;

  function renderLine() {
    if (phase === "asking") return <Text style={styles.caption}>{LOCATION_CONTEXT_LINE}</Text>;
    if (!shown) return null;
    if (offline) {
      return (
        <Text style={styles.caption}>
          {offlineRadiusLine({ centreLabel: shown.centreLabel, radiusKm: shown.radiusKm, count: postings.length })}
        </Text>
      );
    }
    const line = radiusLine({
      centreLabel: shown.centreLabel,
      radiusKm: shown.radiusKm,
      widened: shown.widened,
      count: postings.length,
      filterCount,
    });
    // 3.2 sets the longer widened sentence in mobile/secondary; 3.1 and 3.1f use mobile/caption.
    return <Text style={shown.widened ? styles.secondaryLine : styles.caption}>{line}</Text>;
  }

  const header = (
    <View style={styles.header}>
      {offline ? <OfflineBar message="Offline — showing gigs saved on your phone" /> : null}
      <Text style={styles.screenTitle}>Browse</Text>
      {renderLine()}
      <SearchBar onPress={controlsLive ? () => navigation.navigate("DiscoverySearch") : undefined} />
      <View style={styles.controls}>
        <Chip
          touch
          label={filtersChipLabel(filterCount)}
          selected={filterCount > 0}
          onPress={controlsLive ? () => navigation.navigate("DiscoveryFilters") : undefined}
        />
        <Chip touch label={`Sort: ${sortLabel(sortBy)}`} onPress={controlsLive ? () => setSortOpen(true) : undefined} />
        {/* "Saved" opens Saved gigs (3.8, FR-DISC-06), which is not part of this build: drawn, inert. */}
        <Chip touch label="Saved" />
      </View>
      {error ? (
        <>
          <FormBanner kind="error" message={error} />
          <Button title="Try again" style="secondary" onPress={() => load()} />
        </>
      ) : null}
    </View>
  );

  function renderEmpty() {
    if (phase === "needsArea") {
      // Back out of 3.4 without choosing: never a blocked or empty screen (FR-DISC-02) — the area
      // picker is one tap away.
      return (
        <EmptyState
          title="Choose your area"
          body="Location is off. Pick your area to see gigs near you."
          actionLabel="Choose area"
          onAction={() => navigation.navigate("DiscoveryLocation", { permanentlyDenied: session.permanentlyDenied })}
        />
      );
    }
    // 3.3 has no results behind the dialogue: until the answer there is nothing true to show.
    if (phase === "checking" || phase === "asking") return null;
    if (phase === "locating" || loading || (!shown && !error)) {
      return (
        <View style={styles.loading}>
          <LoadingState />
          <LoadingState />
          <LoadingState />
        </View>
      );
    }
    if (!shown || error) return null;
    if (filterCount > 0) {
      return (
        <EmptyState
          title="No gigs match your filters"
          body={`Clear filters to see every gig within ${shown.radiusKm} km of ${shown.centreLabel}.`}
          actionLabel="Clear filters"
          onAction={clearFilters}
        />
      );
    }
    return (
      <EmptyState
        title="No gigs nearby yet"
        body={`Nothing is open within ${shown.radiusKm} km of ${shown.centreLabel} right now.`}
      />
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <FlatList
        data={loading || phase !== "ready" ? [] : postings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 22 }]}
        ListHeaderComponent={header}
        ListEmptyComponent={renderEmpty()}
        refreshControl={
          phase === "ready" && !offline ? (
            <RefreshControl refreshing={refreshing} onRefresh={() => load({ pull: true })} />
          ) : undefined
        }
        renderItem={({ item }) => (
          <Pressable onPress={() => openListing(item)} accessibilityRole="button" accessibilityLabel={item.title}>
            <ListingCard
              title={item.title}
              subtitle={cardMeta(item)}
              payLine={cardPay(item)}
              statusLine={cardFill(item)}
              urgent={item.isUrgent}
            />
          </Pressable>
        )}
      />

      {/* NAV.1: the worker's tab bar, Browse active; the dot when anything is unread. */}
      <ShellTabBar active="browse" notificationBadge={hasUnread} />

      {/* 3.6 — Display/BottomSheet over a 40% scrim. A sheet's scrim dismisses it (design-system §4). */}
      <Modal
        visible={sortOpen}
        transparent
        statusBarTranslucent
        navigationBarTranslucent
        animationType="fade"
        onRequestClose={() => setSortOpen(false)}
      >
        <View style={styles.sheetLayer}>
          <Pressable style={styles.scrim} onPress={() => setSortOpen(false)} accessibilityLabel="Close sort options" />
          <View style={[styles.sheetWrap, { paddingBottom: insets.bottom }]}>
            <BottomSheet title="Sort by" options={SORT_OPTIONS} value={sortBy} onChange={chooseSort} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg.subtle,
  },
  // content: pad 66/16/…/16 (66 = the status bar plus 22), gap 12. It scrolls above the tab bar.
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.gutter,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  header: {
    gap: spacing.md,
  },
  screenTitle: {
    ...typography.display,
    color: colors.text.primary,
  },
  caption: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  secondaryLine: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  // `controls`: horizontal, gap 8, wraps (at large text "Saved" drops to a second line — 3.1x130).
  controls: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  loading: {
    gap: spacing.md,
  },
  sheetLayer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  scrim: {
    ...fill,
    backgroundColor: colors.overlay.scrim,
    opacity: 0.4,
  },
  sheetWrap: {
    backgroundColor: colors.bg.default,
  },
});
