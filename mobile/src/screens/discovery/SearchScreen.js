/**
 * 3.7 — Keyword search (FR-DISC-04), opened from Browse's search bar — Pawan.
 *
 * Matches the keyword against each posting's title and description, inside the same search centre
 * and radius as Browse — "1 result within 5 km" — and with Browse's filters and sort still applied,
 * because search complements them rather than replacing them (FR-DISC-04).
 *
 * The search runs when the keyboard's search key is pressed, or once typing pauses.
 * States composed per design-system.md §8: loading → Feedback/LoadingState; nothing matches →
 * Feedback/EmptyState; a failed search → Feedback/FormBanner.
 */
import { useEffect, useRef, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import ScreenHeader from "../../components/ScreenHeader";
import ListingCard from "../../components/ListingCard";
import LoadingState from "../../components/LoadingState";
import EmptyState from "../../components/EmptyState";
import FormBanner from "../../components/FormBanner";
import { isRouteRegistered } from "../../components/ShellTabBar";
import { colors, radius, spacing, typography } from "../../theme/tokens";
import { browseGigs } from "../../api/discovery.api";
import { parseApiError } from "../../api/client";
import { centreParams, getSession } from "./discoverySession";
import { cardFill, cardMeta, cardPay, searchResultCount } from "./discovery.format";

const TYPING_PAUSE_MS = 500;
const LISTING_DETAIL_SCREEN = "ApplicationListingDetail";

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null); // { radiusKm, postings, keyword }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const latestRequest = useRef(0);

  async function search(text) {
    const keyword = text.trim();
    const { centre, filters, sortBy } = getSession();
    if (!keyword || !centre) {
      setResult(null);
      return;
    }
    // Only the newest search may update the screen; an older, slower answer is dropped.
    const requestId = ++latestRequest.current;
    setLoading(true);
    setError(null);
    try {
      const response = await browseGigs({ ...centreParams(centre), ...filters, sortBy, keyword });
      if (requestId === latestRequest.current) setResult({ ...response, keyword });
    } catch (err) {
      if (requestId === latestRequest.current) {
        setError(parseApiError(err).formError || "The search couldn't be run. Try again.");
      }
    } finally {
      if (requestId === latestRequest.current) setLoading(false);
    }
  }

  // Search once typing pauses.
  useEffect(() => {
    const timer = setTimeout(() => search(query), TYPING_PAUSE_MS);
    return () => clearTimeout(timer);
  }, [query]); // eslint-disable-line react-hooks/exhaustive-deps

  function openListing(item) {
    if (!isRouteRegistered(navigation, LISTING_DETAIL_SCREEN)) return;
    navigation.navigate(LISTING_DETAIL_SCREEN, { gigPostingId: item.id });
  }

  const postings = result?.postings ?? [];

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScreenHeader title="Search" onBack={() => navigation.goBack()} />

      <FlatList
        data={loading ? [] : postings}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.searchField}>
              <TextInput
                style={styles.input}
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={() => search(query)}
                placeholder="Search gigs"
                placeholderTextColor={colors.text.secondary}
                returnKeyType="search"
                autoFocus
                autoCorrect={false}
                accessibilityLabel="Search gigs"
              />
            </View>
            {error ? <FormBanner kind="error" message={error} /> : null}
            {result && !loading ? (
              <Text style={styles.resultCount}>
                {searchResultCount({ count: postings.length, radiusKm: result.radiusKm })}
              </Text>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <LoadingState />
          ) : result ? (
            <EmptyState
              title="No gigs match your search"
              body={`Nothing within ${result.radiusKm} km of ${result.centreLabel} mentions “${result.keyword}”.`}
            />
          ) : null
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
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg.default,
  },
  // content: pad 20/16/24/16, gap 14.
  content: {
    paddingTop: 20,
    paddingHorizontal: spacing.gutter,
    paddingBottom: spacing.xl,
    gap: 14,
  },
  header: {
    gap: 14,
  },
  // searchField: 328×48, pad 12, color/bg/subtle, r8.
  searchField: {
    minHeight: 48,
    justifyContent: "center",
    paddingHorizontal: spacing.md,
    borderRadius: radius.input,
    backgroundColor: colors.bg.subtle,
  },
  input: {
    ...typography.body,
    color: colors.text.primary,
    paddingVertical: spacing.md,
  },
  resultCount: {
    ...typography.caption,
    color: colors.text.secondary,
  },
});
