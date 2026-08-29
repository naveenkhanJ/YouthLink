/**
 * Browse & Discovery Screen (FR-DISC-01, FR-DISC-02, FR-DISC-03, FR-DISC-05) — Pawan.
 */
import { useEffect, useState, useCallback } from "react";
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

// The first entry was labelled "Current / Auto GPS" but carried hardcoded
// Colombo coordinates and no geolocation call was ever made — so distances and
// the radius were silently wrong for anyone outside Colombo while the chip
// claimed to be using their location. Relabelled to state what it actually is.
// Real device location needs expo-location, a native module, which would force
// a full `expo run:android` rebuild — deliberately not added on a demo branch.
// Until then the manual city list IS the location mechanism (FR-DISC-02's
// fallback path), and it works correctly.
const SRI_LANKA_CITIES = [
  { label: "Colombo (default)", lat: 6.9271, lng: 79.8612 },
  { label: "Kandy", lat: 7.2906, lng: 80.6337 },
  { label: "Galle", lat: 6.0535, lng: 80.221 },
  { label: "Gampaha", lat: 7.084, lng: 79.9943 },
  { label: "Kurunegala", lat: 7.4818, lng: 80.3609 },
  { label: "Jaffna", lat: 9.6615, lng: 80.0255 },
];

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

// "Soonest Start" was wired to value "recency", which the service now correctly
// treats as most-recently-posted; soonest-start is its own value. Both are
// offered, so FR-DISC-05's alternate sorts are all actually reachable.
const SORTS = [
  { label: "Nearest & Urgent", value: "default" },
  { label: "Pay: High to Low", value: "pay" },
  { label: "Soonest Start", value: "soonest" },
  { label: "Recently Posted", value: "recency" },
];

function formatEnum(val) {
  if (!val) return "";
  return val.replaceAll("_", " ").toLowerCase();
}

function formatPay(item) {
  if (!item.payAmount) return formatEnum(item.payKind);
  const amount = `Rs ${Number(item.payAmount).toLocaleString()}`;
  return item.payRateUnit ? `${amount} / ${formatEnum(item.payRateUnit)}` : amount;
}

export default function DiscoveryScreen({ navigation }) {
  const [selectedCity, setSelectedCity] = useState(SRI_LANKA_CITIES[0]);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedArrangement, setSelectedArrangement] = useState("ALL");
  const [selectedSort, setSelectedSort] = useState("default");
  const [searchKeyword, setSearchKeyword] = useState("");
  // Typing used to fire a full browse request per keystroke, flipping the list
  // to a spinner each time and letting responses land out of order — "car"
  // could be overtaken by the earlier "ca" and show the wrong results. The
  // committed value trails the typed one by 350ms of quiet, so only settled
  // input triggers a request.
  const [debouncedKeyword, setDebouncedKeyword] = useState("");

  const [postings, setPostings] = useState([]);
  const [effectiveRadius, setEffectiveRadius] = useState(5);
  const [autoExpanded, setAutoExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadGigs = useCallback(
    async ({ silent } = {}) => {
      if (!silent) setLoading(true);
      setError(null);
      try {
        const res = await browseGigs({
          lat: selectedCity.lat,
          lng: selectedCity.lng,
          category: selectedCategory !== "ALL" ? selectedCategory : undefined,
          arrangementType: selectedArrangement !== "ALL" ? selectedArrangement : undefined,
          keyword: debouncedKeyword.trim() || undefined,
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
    [selectedCity, selectedCategory, selectedArrangement, debouncedKeyword, selectedSort],
  );

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedKeyword(searchKeyword), 350);
    return () => clearTimeout(timer);
  }, [searchKeyword]);

  useEffect(() => {
    loadGigs();
  }, [loadGigs]);

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
          // Flush the debounce rather than calling loadGigs() directly:
          // loadGigs closes over debouncedKeyword, so submitting inside the
          // 350ms window would have searched the PREVIOUS term and then let
          // the pending timer fire a second, different request — exactly the
          // out-of-order problem the debounce is meant to remove. Committing
          // the term instead triggers one load, through the same path.
          onSubmitEditing={() => setDebouncedKeyword(searchKeyword)}
          returnKeyType="search"
        />

        {/* Location Fallback Selector (FR-DISC-02) */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cityScroll}>
          {SRI_LANKA_CITIES.map((city) => (
            <Pressable
              key={city.label}
              style={[styles.chip, selectedCity.label === city.label && styles.chipActive]}
              onPress={() => setSelectedCity(city)}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedCity.label === city.label && styles.chipTextActive,
                ]}
              >
                📍 {city.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

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

        {/* Arrangement-type Filters (FR-DISC-03).
            ARRANGEMENTS and selectedArrangement already existed and the value
            was already being sent to the API, but no chips were ever rendered
            and setSelectedArrangement was never called — so half of
            FR-DISC-03's filter was unreachable from the UI. Rendered here,
            matching the category row above. */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {ARRANGEMENTS.map((arr) => (
            <Pressable
              key={arr}
              style={[styles.chip, selectedArrangement === arr && styles.chipActive]}
              onPress={() => setSelectedArrangement(arr)}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedArrangement === arr && styles.chipTextActive,
                ]}
              >
                {arr === "ALL" ? "All Types" : formatEnum(arr)}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Sort Options (FR-DISC-05).
            Horizontally scrollable rather than a fixed flex row: a fourth
            option was added and four flex:1 buttons can't fit labels like
            "Nearest & Urgent" and "Recently Posted" side by side, so they
            wrapped unevenly. Matches the chip rows above. */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sortRow}
        >
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
        </ScrollView>

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
                Try adjusting your category filters or choosing a different city.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() =>
                navigation.navigate("ApplicationListingDetail", {
                  gigPostingId: item.id,
                  title: item.title,
                })
              }
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
  cityScroll: { marginBottom: 8 },
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
  sortRow: { flexDirection: "row", marginVertical: 6, gap: 4 },
  sortButton: {
    // Sized to its label rather than flex:1 — the row scrolls horizontally
    // now, so equal widths would squeeze the longer labels instead.
    paddingHorizontal: 12,
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
