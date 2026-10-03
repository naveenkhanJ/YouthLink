/**
 * The Area field of the Location step (FR-POST-08; round 4, L-1) — Lahiru.
 *
 * The posting's public area is chosen from the server's list, never typed freely: before this, the
 * text after the last comma of the address became the area, so an address with no comma was shown
 * to every worker in full (POST-E2E-01), and an area the app didn't know was placed at Colombo's
 * centre (POST-E2E-02). Now the employer types in Area, the matching areas show under the field,
 * and only a row tapped from that list counts. The server takes the label and the coordinates from
 * its own copy of the list.
 *
 * Built from the shared TextField; the result rows are drawn like the Category rows of frame 2.2
 * (pad 12, radius 8, mobile/body, color/text/primary), at least 48 tall so a long name can wrap at
 * large text sizes.
 *
 * Who holds what: the screen holds the typed text (`query`) and the chosen area (`value`), because
 * the kept form (postingDraft.js) stores the choice. This component loads the list and filters it.
 */
import { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Keyboard } from 'react-native';
import { colors, spacing, radius, typography } from '../../../theme/tokens';
import TextField from '../../../components/TextField';
import FieldError from '../../../components/FieldError';
import { getAreas } from '../../../api/posting.api.js';

// At most this many matches are listed under the field.
const MAX_MATCHES = 8;

export const AREAS_LOAD_FAILED = "Couldn't load the list of areas. Check your connection and try again.";

// Loaded once and kept for the rest of the app session: the list only changes with a new release
// of the server, and the Location step can be opened many times.
let cachedAreas = null;

/** Lower-case, trimmed, single spaces — how typed text and names are compared. */
function clean(text) {
  return String(text ?? '').toLowerCase().replace(/\s+/g, ' ').trim();
}

/**
 * Whether `text` (already cleaned) matches `candidate`: the candidate starts with it, or one of
 * its words does. Words are split at spaces, hyphens and brackets, so "mount" finds
 * "Dehiwala-Mount Lavinia" and "gampaha" finds "Name (Gampaha)".
 */
function startsWithOrHasWord(candidate, text) {
  const name = clean(candidate);
  if (name.startsWith(text)) return true;
  return name.split(/[\s\-()]+/).some((word) => word && word.startsWith(text));
}

/**
 * The areas that match what was typed, best first: those whose name starts with it, then the
 * rest (a word of the name, or an alias, e.g. "Kollupitiya" for Colombo 03). "Colombo 5" is also
 * tried as "Colombo 05", the way the list writes it.
 *
 * @param {Array<{ name: string, aliases?: string[] }>} areas
 * @param {string} query
 */
export function matchAreas(areas, query) {
  const text = clean(query);
  if (!text) return [];
  const padded = text.replace(/^colombo (\d)$/, 'colombo 0$1');
  const tries = padded === text ? [text] : [text, padded];

  const first = [];
  const rest = [];
  for (const area of areas) {
    const name = clean(area.name);
    if (tries.some((t) => name.startsWith(t))) first.push(area);
    else if (tries.some((t) => [area.name, ...(area.aliases ?? [])].some((c) => startsWithOrHasWord(c, t)))) {
      rest.push(area);
    }
  }
  return [...first, ...rest].slice(0, MAX_MATCHES);
}

/**
 * @param {string} query - What is in the field.
 * @param {(text: string) => void} onChangeQuery - The employer typed (the screen drops any choice).
 * @param {string|null} value - The chosen area's name, or null.
 * @param {(name: string) => void} onChoose - A row was tapped.
 * @param {string|null} [error] - "Choose your area from the list." from Continue, drawn under the field.
 * @param {() => void} [onFocus] - Focus scroll from the screen (useFocusScroll).
 * @param {(event: object) => void} [onLayout]
 */
export default function AreaPicker({ query, onChangeQuery, value, onChoose, error, onFocus, onLayout }) {
  const [areas, setAreas] = useState(cachedAreas);
  const [loadFailed, setLoadFailed] = useState(false);
  const [loading, setLoading] = useState(false);

  async function load() {
    if (cachedAreas || loading) return;
    setLoading(true);
    try {
      const { areas: list } = await getAreas();
      cachedAreas = list;
      setAreas(list);
      setLoadFailed(false);
    } catch {
      // Offline or a server error: say so under the field; the next focus tries again.
      setLoadFailed(true);
    } finally {
      setLoading(false);
    }
  }

  // The Location step opened: load the list unless this session already has it.
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleFocus(event) {
    if (loadFailed) load();
    if (onFocus) onFocus(event);
  }

  function choose(name) {
    onChoose(name);
    Keyboard.dismiss(); // the list closes; Continue comes back into view
  }

  // The list shows while something is typed and nothing is chosen yet.
  const showList = Boolean(areas) && !value && clean(query) !== '';
  const matches = showList ? matchAreas(areas, query) : [];

  return (
    <View style={styles.root} onLayout={onLayout}>
      <TextField
        label="Area"
        value={query}
        onChangeText={onChangeQuery}
        placeholder="Start typing your town or area"
        autoCapitalize="words"
        error={Boolean(error)}
        onFocus={handleFocus}
      />
      {error ? <FieldError message={error} /> : null}
      {loadFailed ? <FieldError message={AREAS_LOAD_FAILED} /> : null}

      {showList ? (
        <View style={styles.list}>
          {matches.length > 0 ? (
            matches.map((area) => (
              <Pressable
                key={area.name}
                onPress={() => choose(area.name)}
                accessibilityRole="button"
                style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
              >
                <Text style={styles.rowLabel}>{area.name}</Text>
              </Pressable>
            ))
          ) : (
            <View style={styles.row}>
              <Text style={styles.noMatch}>No area matches “{query.trim()}”. Try a nearby town.</Text>
            </View>
          )}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: spacing.xs,
  },
  list: {
    gap: spacing.xs,
  },
  // 2.2's row: horizontal pad 12, radius 8, 48 tall (min, so large text can wrap).
  row: {
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    borderRadius: radius.input,
  },
  // The pressed row takes 2.2's selected fill for the moment of the tap.
  rowPressed: {
    backgroundColor: colors.bg.subtle,
  },
  rowLabel: {
    ...typography.body,
    color: colors.text.primary,
  },
  noMatch: {
    ...typography.body,
    color: colors.text.secondary,
  },
});
