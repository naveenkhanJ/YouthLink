/**
 * My postings (prototype 2.10, 2.10p, 2.10w, 2.10z …; FR-POST-14, FR-POST-18) — Lahiru.
 *
 * The employer's own postings, newest first. Each card is a title, the status badge
 * (Open / Filled / Withdrawn / Expired — computed by the server from the fill count,
 * FR-POST-18) and a meta line that always begins with the plain fill count, "2 of 3
 * filled" (FR-POST-14), then says what matters for that status. Reloads whenever the
 * screen regains focus, so a withdrawal made on the detail shows here at once.
 *
 * States beyond the typical one come from design-system.md §8: loading →
 * Feedback/LoadingState; nothing posted yet → Feedback/EmptyState {NoneExist} (2.10z);
 * a failed load → Feedback/FormBanner with a retry. A posting hidden after reports (2.10g)
 * reads "Hidden pending review" on its card, with the explanation beneath it.
 */
import { useCallback, useEffect, useState } from 'react';
import { View, Text, Pressable, FlatList, RefreshControl, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, radius, typography } from '../../theme/tokens';
import Badge from '../../components/Badge';
import EmptyState from '../../components/EmptyState';
import LoadingState from '../../components/LoadingState';
import FormBanner from '../../components/FormBanner';
import Button from '../../components/Button';
import { getMyGigPostings } from '../../api/posting.api.js';
import { HIDDEN_NOTE_LIST, badgeValue, cardMeta, isHiddenPending } from './posting.format.js';

export default function PostingListScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [postings, setPostings] = useState(null); // null = not loaded yet
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const { postings: list } = await getMyGigPostings();
      setPostings(list);
      setError(null);
    } catch (err) {
      setError(err.message || "Your postings couldn't be loaded.");
    } finally {
      setRefreshing(false);
    }
  }, []);

  // On open and every time the screen is returned to (after a withdrawal, a new posting…).
  useEffect(() => {
    load();
    return navigation.addListener('focus', load);
  }, [load, navigation]);

  const hasList = postings !== null;

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <FlatList
        data={postings ?? []}
        keyExtractor={(item) => item.id}
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
            <Text style={styles.screenTitle}>My postings</Text>
            {error ? <FormBanner kind="error" message={error} /> : null}
            {error && !hasList ? <Button title="Try again" style="secondary" onPress={load} /> : null}
          </View>
        }
        ListEmptyComponent={
          !hasList ? (
            // Still loading — or failed, in which case the banner above says so.
            error ? null : <LoadingState />
          ) : (
            // 2.10z: a new employer's empty list.
            <EmptyState
              title="No postings yet"
              body="Post a gig and it will appear here, with its applicants as they arrive."
              actionLabel="Post a gig"
              onAction={() => navigation.navigate('PostingCreate')}
            />
          )
        }
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Pressable
              onPress={() => navigation.navigate('PostingDetail', { postingId: item.id })}
              accessibilityRole="button"
              accessibilityLabel={item.title}
              style={styles.card}
            >
              <View style={styles.topRow}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Badge family="posting" value={badgeValue(item.status)} />
              </View>
              <Text style={styles.meta}>{cardMeta(item)}</Text>
            </Pressable>
            {isHiddenPending(item) ? <Text style={styles.hiddenNote}>{HIDDEN_NOTE_LIST}</Text> : null}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg.subtle,
  },
  // Figma content: pad 66/16/16/16 (66 = the status bar plus 22), gap 12.
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
  // A card and, for a hidden posting (2.10g), its note — a sibling of the card, gap 12.
  item: {
    gap: spacing.md,
  },
  hiddenNote: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  // posting-* card: pad 12/14, gap 6, r8 on color/bg/default.
  card: {
    gap: 6,
    paddingVertical: spacing.md,
    paddingHorizontal: 14,
    borderRadius: radius.input,
    backgroundColor: colors.bg.default,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  cardTitle: {
    flex: 1,
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  meta: {
    ...typography.caption,
    color: colors.text.secondary,
  },
});
