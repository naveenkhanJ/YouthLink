/**
 * Browse & Discovery Screen (FR-DISC-01, FR-DISC-02, FR-DISC-03, FR-DISC-04, FR-DISC-05) — Pawan.
 *
 * Where the search is centred (FR-DISC-02, prototype 3.3 / 3.4):
 *   - On entry, if location permission was never answered, one line of context explains why it is
 *     asked, then the OS dialogue fires.
 *   - Allowed → search around the device's position.
 *   - Denied, or the phone can't give a position → the manual area screen (DiscoveryLocation).
 *   - Permanently denied (the OS won't show the dialogue any more) → straight to the manual area
 *     screen, with the hint that location can be turned back on in Settings.
 *   - Back out of that screen without choosing → Browse shows a "choose your area" prompt, never a
 *     blocked or empty screen.
 */
import { useEffect, useState, useCallback, useRef } from "react";
import * as Location from "expo-location";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Pressable,
  TextInput,
  ScrollView,
  RefreshControl,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { browseGigs } from "../../api/discovery.api";
import { parseApiError } from "../../api/client";
import Button from "../../components/Button";
import Link from "../../components/Link";

const LOCATION_CONTEXT_LINE =
  "YouthLink asks for your location so it can show gigs within 5 km of you.";
const LISTING_DETAIL_SCREEN = "ApplicationListingDetail";
// How long the context line is on screen, alone, before the OS permission dialogue opens over it.
const CONTEXT_LINE_LEAD_MS = 1200;

const CATEGORIES = [
  "ALL",
  "RETAIL",
  "DELIVERY",
  "EVENT_SETUP",
  "MOVING",
  "FOOD_SERVICE",
  "TUTORING",
  "CLEANING",
];

const ARRANGEMENTS = ["ALL", "GIG", "PART_TIME", "INTERNSHIP"];

const SORTS = [
  { label: "Nearest & Urgent", value: "default" },
  { label: "Pay: High to Low", value: "pay" },
  { label: "Newest", value: "recency" },
];

function formatEnum(val) {
  if (!val) return "";
  return val.replaceAll("_", " ").toLowerCase();
}

const RATE_UNIT_WORDS = { DAY: "day", WEEK: "week", MONTH: "month" };

/** "Rs 6,000": thousands separators, no decimals (design-system.md §9, NFR-LOC-04). */
function formatRupees(amount) {
  const whole = Math.round(Number(amount));
  return `Rs ${String(whole).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

/**
 * Pay figure AND its basis on every result card (FR-DISC-01, amended 2026-08-27), in the one
 * format used everywhere — design-system.md §9, "Worker-facing — card" column:
 *   FIXED_TOTAL        "Rs 6,000 for the job"  (+ " · per worker" when more than one worker)
 *   RATE · DAY         "Rs 1,800 per day"      (WEEK / MONTH likewise)
 *   PAID               as RATE with its unit, or as FIXED_TOTAL when it has none
 *   STIPEND            "Rs 15,000 stipend per month", or "Rs 15,000 stipend" with no unit
 *   UNPAID             "Unpaid"
 * Never abbreviated ("/day"), never with decimals.
 */
function formatPay(item) {
  if (item.payKind === "UNPAID" || item.payAmount == null) return "Unpaid";

  const amount = formatRupees(item.payAmount);
  const unit = RATE_UNIT_WORDS[item.payRateUnit];

  if (item.payKind === "STIPEND") return unit ? `${amount} stipend per ${unit}` : `${amount} stipend`;
  if ((item.payKind === "RATE" || item.payKind === "PAID") && unit) return `${amount} per ${unit}`;

  // FIXED_TOTAL, and PAID with no unit, read as a whole-job figure.
  const perWorker = item.workersNeeded > 1 ? " · per worker" : "";
  return `${amount} for the job${perWorker}`;
}

export default function DiscoveryScreen({ navigation, route }) {
  // The search centre: { label, lat, lng, source: "device" | "manual" }, or null until known.
  const [searchCentre, setSearchCentre] = useState(null);
  // "checking" → reading the permission · "asking" → OS dialogue open, context line shown ·
  // "locating" → reading the device position · "ready" → have a centre ·
  // "needsArea" → no location and no area chosen yet.
  const [locationPhase, setLocationPhase] = useState("checking");
  const permissionChecked = useRef(false);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedArrangement, setSelectedArrangement] = useState("ALL");
  const [selectedSort, setSelectedSort] = useState("default");
  const [searchKeyword, setSearchKeyword] = useState("");

  const [postings, setPostings] = useState([]);
  const [effectiveRadius, setEffectiveRadius] = useState(5);
  const [autoExpanded, setAutoExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Opens the listing detail (3.12), which belongs to the Applying module (Naveenkhan,
   * "ApplicationListingDetail", reads route.params.gigPostingId). Until that screen is merged into
   * the app, tapping a card does nothing rather than raising React Navigation's
   * "not handled by any navigator" error.
   */
  function openListing(item) {
    if (!navigation.getState()?.routeNames?.includes(LISTING_DETAIL_SCREEN)) return;
    navigation.navigate(LISTING_DETAIL_SCREEN, { gigPostingId: item.id, title: item.title });
  }

  function openAreaPicker({ permanentlyDenied = false } = {}) {
    setLocationPhase((phase) => (phase === "ready" ? phase : "needsArea"));
    navigation.navigate("DiscoveryLocation", {
      permanentlyDenied,
      currentLabel: searchCentre?.source === "manual" ? searchCentre.label : undefined,
    });
  }

  async function searchFromDevicePosition() {
    setLocationPhase("locating");
    try {
      const position = await Location.getCurrentPositionAsync();
      setSearchCentre({
        label: "Near you",
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        source: "device",
      });
      setLocationPhase("ready");
    } catch {
      // Permission granted but no position (location services off, no fix): same fallback.
      openAreaPicker();
    }
  }

  // FR-DISC-02: decide where to search from, once, on first entry to Browse.
  useEffect(() => {
    if (permissionChecked.current) return;
    permissionChecked.current = true;

    (async () => {
      try {
        let permission = await Location.getForegroundPermissionsAsync();
        if (!permission.granted && permission.canAskAgain) {
          // The context line must PRECEDE the OS dialogue (FR-DISC-02): show it, give it a
          // moment on screen, then ask. Without the pause the dialogue opens before the line
          // has even been drawn, and the reason is never seen.
          setLocationPhase("asking");
          await new Promise((resolve) => setTimeout(resolve, CONTEXT_LINE_LEAD_MS));
          permission = await Location.requestForegroundPermissionsAsync();
        }

        if (permission.granted) {
          await searchFromDevicePosition();
        } else {
          openAreaPicker({ permanentlyDenied: !permission.canAskAgain });
        }
      } catch {
        openAreaPicker();
      }
    })();
  }, []);

  // An area chosen on the fallback screen comes back as a route param.
  useEffect(() => {
    const area = route.params?.manualArea;
    if (!area) return;
    setSearchCentre({ label: area.label, lat: area.lat, lng: area.lng, source: "manual" });
    setLocationPhase("ready");
  }, [route.params?.manualArea]);

  const loadGigs = useCallback(
    async ({ silent } = {}) => {
      if (!searchCentre) return;
      if (!silent) setLoading(true);
      setError(null);
      try {
        const res = await browseGigs({
          lat: searchCentre.lat,
          lng: searchCentre.lng,
          category: selectedCategory !== "ALL" ? selectedCategory : undefined,
          arrangementType: selectedArrangement !== "ALL" ? selectedArrangement : undefined,
          keyword: searchKeyword.trim() || undefined,
          sortBy: selectedSort,
          autoExpand: "true",
        });
        setPostings(res.postings || []);
        setEffectiveRadius(res.effectiveRadius || 5);
        setAutoExpanded(res.autoExpanded || false);
      } catch (err) {
        setError(parseApiError(err).formError || "Could not load gigs.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [searchCentre, selectedCategory, selectedArrangement, searchKeyword, selectedSort],
  );

  useEffect(() => {
    loadGigs();
  }, [loadGigs]);

  // Until there is a search centre, there is nothing true to show below the search bar.
  if (locationPhase !== "ready") {
    return (
      <View style={styles.screen}>
        <StatusBar style="dark" />
        {/* Top of the screen, so it stays readable above the centred OS dialogue (prototype 3.3). */}
        {locationPhase === "asking" ? (
          <Text style={styles.contextLine}>{LOCATION_CONTEXT_LINE}</Text>
        ) : null}
        <View style={styles.locationGate}>
          {locationPhase === "needsArea" ? (
            <>
              <Text style={styles.emptyTitle}>Choose your area</Text>
              <Text style={styles.emptySubtitle}>
                Location is off. Pick your area to see gigs near you.
              </Text>
              <Button title="Choose area" onPress={() => openAreaPicker()} />
            </>
          ) : (
            <ActivityIndicator color="#5B4FE0" size="large" />
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />

      {/* Search Header */}
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search gigs by title or keywords..."
          placeholderTextColor="#9CA3AF"
          value={searchKeyword}
          onChangeText={setSearchKeyword}
          onSubmitEditing={() => loadGigs()}
          returnKeyType="search"
        />

        {/* Search centre + manual area change (FR-DISC-02) */}
        <View style={styles.locationRow}>
          <Text style={styles.locationLabel}>📍 {searchCentre.label}</Text>
          <Link title="Change area" onPress={() => openAreaPicker()} />
        </View>

        {/* Category Filters (FR-DISC-03) */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat}
              style={[styles.chip, selectedCategory === cat && styles.chipActive]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.chipText, selectedCategory === cat && styles.chipTextActive]}>
                {cat === "ALL" ? "All Categories" : formatEnum(cat)}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Arrangement-type Filters (FR-DISC-03), combinable with category and radius */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {ARRANGEMENTS.map((type) => (
            <Pressable
              key={type}
              style={[styles.chip, selectedArrangement === type && styles.chipActive]}
              onPress={() => setSelectedArrangement(type)}
            >
              <Text style={[styles.chipText, selectedArrangement === type && styles.chipTextActive]}>
                {type === "ALL" ? "All Types" : formatEnum(type)}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Sort Options (FR-DISC-05) */}
        <View style={styles.sortRow}>
          {SORTS.map((s) => (
            <Pressable
              key={s.value}
              style={[styles.sortButton, selectedSort === s.value && styles.sortButtonActive]}
              onPress={() => setSelectedSort(s.value)}
            >
              <Text
                style={[styles.sortText, selectedSort === s.value && styles.sortTextActive]}
              >
                {s.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Auto-expansion notification banner (FR-DISC-01) */}
        {autoExpanded ? (
          <View style={styles.expandedBanner}>
            <Text style={styles.expandedText}>
              🔍 Auto-expanded search to {effectiveRadius}km to find more gigs
            </Text>
          </View>
        ) : null}
      </View>

      {/* Main List */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color="#5B4FE0" size="large" />
        </View>
      ) : (
        <FlatList
          data={postings}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                loadGigs({ silent: true });
              }}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No gigs found nearby</Text>
              <Text style={styles.emptySubtitle}>
                Try other filters or change your area.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() => openListing(item)}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                {item.isUrgent ? <Text style={styles.urgentBadge}>URGENT</Text> : null}
              </View>

              <Text style={styles.payText}>💰 {formatPay(item)}</Text>

              <View style={styles.metaRow}>
                <Text style={styles.metaItem}>
                  📍 {item.locationAreaLabel}{" "}
                  {item.distanceInKm != null ? `(${item.distanceInKm} km away)` : ""}
                </Text>
              </View>

              <View style={styles.metaRow}>
                <Text style={styles.tag}>{formatEnum(item.category)}</Text>
                <Text style={styles.tag}>{formatEnum(item.arrangementType)}</Text>
                <Text style={styles.tag}>
                  {item.filledCount}/{item.workersNeeded} filled
                </Text>
              </View>

              {item.postedBusinessName ? (
                <Text style={styles.businessText}>By {item.postedBusinessName}</Text>
              ) : null}
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F9FAFB" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    backgroundColor: "#FFFFFF",
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  searchInput: {
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#111827",
    marginBottom: 10,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  locationLabel: { fontSize: 14, fontWeight: "600", color: "#111827" },
  locationGate: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 12,
  },
  contextLine: { fontSize: 12, lineHeight: 16, color: "#6B7280", padding: 16 },
  filterScroll: { marginBottom: 8 },
  chip: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  chipActive: { backgroundColor: "#5B4FE0" },
  chipText: { fontSize: 13, color: "#4B5563", fontWeight: "500" },
  chipTextActive: { color: "#FFFFFF" },
  sortRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 6, gap: 4 },
  sortButton: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
  },
  sortButtonActive: { backgroundColor: "#E0E7FF" },
  sortText: { fontSize: 11, color: "#4B5563", fontWeight: "600" },
  sortTextActive: { color: "#4338CA" },
  expandedBanner: {
    backgroundColor: "#FEF3C7",
    borderRadius: 6,
    padding: 6,
    marginTop: 4,
    alignItems: "center",
  },
  expandedText: { fontSize: 12, color: "#92400E", fontWeight: "600" },
  list: { padding: 16 },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#111827", flex: 1, marginRight: 8 },
  urgentBadge: {
    backgroundColor: "#DC2626",
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  payText: { fontSize: 15, fontWeight: "700", color: "#16A34A", marginVertical: 6 },
  metaRow: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 6, marginVertical: 3 },
  metaItem: { fontSize: 13, color: "#6B7280" },
  tag: {
    backgroundColor: "#F3F4F6",
    fontSize: 11,
    color: "#4B5563",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    textTransform: "capitalize",
  },
  businessText: { fontSize: 12, color: "#9CA3AF", marginTop: 6, fontStyle: "italic" },
  emptyState: { alignItems: "center", marginTop: 40, paddingHorizontal: 20 },
  emptyTitle: { fontSize: 16, fontWeight: "700", color: "#374151", marginBottom: 6 },
  emptySubtitle: { fontSize: 13, color: "#9CA3AF", textAlign: "center" },
});
