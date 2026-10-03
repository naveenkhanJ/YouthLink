/**
 * 3.5 — Filters (FR-DISC-03), and 3.5c once cleared — Pawan.
 *
 * Category and arrangement chips, combinable with each other and with the radius. One of each at
 * most: tap a chip to choose it, tap it again to drop it. Nothing changes on Browse until
 * "Show results"; back leaves the filters as they were. "Clear all" empties the choice here (3.5c,
 * where the link itself is gone because nothing is left to clear) and "Show results" applies it.
 *
 * The choices live for the app session only — FR-DISC-07, which `sessionNote` states.
 */
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import ScreenHeader from "../../components/ScreenHeader";
import Chip from "../../components/Chip";
import Link from "../../components/Link";
import Button from "../../components/Button";
import CtaBar from "../../components/CtaBar";
import { colors, spacing, typography } from "../../theme/tokens";
import { ARRANGEMENT_OPTIONS, CATEGORY_OPTIONS } from "./discovery.format";
import { activeFilterCount, getSession, setFilters } from "./discoverySession";

export default function FiltersScreen({ navigation }) {
  const [draft, setDraft] = useState(getSession().filters);

  /** Choose `value` for `group`, or drop it when it is already chosen. */
  function toggle(group, value) {
    setDraft((prev) => ({ ...prev, [group]: prev[group] === value ? null : value }));
  }

  function showResults() {
    setFilters(draft);
    navigation.goBack(); // Browse reloads with them as it comes back into view
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScreenHeader title="Filters" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.groupLabel}>CATEGORY</Text>
        <View style={styles.chips}>
          {CATEGORY_OPTIONS.map((option) => (
            <Chip
              touch
              key={option.value}
              label={option.label}
              selected={draft.category === option.value}
              onPress={() => toggle("category", option.value)}
            />
          ))}
        </View>

        <Text style={styles.groupLabel}>ARRANGEMENT</Text>
        <View style={styles.chips}>
          {ARRANGEMENT_OPTIONS.map((option) => (
            <Chip
              touch
              key={option.value}
              label={option.label}
              selected={draft.arrangementType === option.value}
              onPress={() => toggle("arrangementType", option.value)}
            />
          ))}
        </View>

        <Text style={styles.sessionNote}>Filters reset when you close the app.</Text>

        {activeFilterCount(draft) > 0 ? (
          <View style={styles.clearAll}>
            <Link title="Clear all" onPress={() => setDraft({ category: null, arrangementType: null })} />
          </View>
        ) : null}
      </ScrollView>

      <CtaBar>
        <Button title="Show results" onPress={showResults} />
      </CtaBar>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg.default,
  },
  // content: pad 20/16/2/16, gap 14.
  content: {
    paddingTop: 20,
    paddingHorizontal: spacing.gutter,
    paddingBottom: 2,
    gap: 14,
  },
  groupLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  // categoryChips / arrangementChips: horizontal, gap 8, wrapping.
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  sessionNote: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  // Action/Link hugs its label (61×44) rather than stretching across the column.
  clearAll: {
    alignSelf: "flex-start",
  },
});
