/**
 * 3.4 — Set your location: the manual location fallback (FR-DISC-02) — Pawan.
 *
 * Reached from Browse when location permission is refused, unavailable, or gives no position. The
 * youth picks an area; "Show gigs" goes back to Browse, which searches from that area's centre (the
 * server resolves the name, and records that centre as the youth's browse location, FR-POST-10).
 *
 * The areas are the same list postings are placed in — GET /api/postings/areas, the Gig Posting
 * module's single list (posting.areas.js). One list means a worker can pick exactly the areas gigs
 * are posted in, and the app keeps no second copy of names and coordinates to drift out of step.
 *
 * Route params:
 *   permanentlyDenied  The OS will no longer show the permission dialogue, so Browse came straight
 *                      here (amendment A10). Adds the hint that location can be turned back on in
 *                      the phone's settings. Not drawn in the prototype ("States not drawn", M3).
 */
import { useCallback, useEffect, useState } from "react";
import { Linking, ScrollView, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import ScreenHeader from "../../components/ScreenHeader";
import Select from "../../components/Select";
import FormBanner from "../../components/FormBanner";
import LoadingState from "../../components/LoadingState";
import Link from "../../components/Link";
import Button from "../../components/Button";
import CtaBar from "../../components/CtaBar";
import { colors, spacing, typography } from "../../theme/tokens";
import { listAreas } from "../../api/discovery.api";
import { parseApiError } from "../../api/client";
import { getSession, setCentre } from "./discoverySession";

// A10's hint for the permanently-denied case (not drawn — built from the requirement's own words).
const SETTINGS_HINT =
  "Location is turned off for YouthLink and your phone won't ask again. You can turn it back on in your phone's settings.";

export default function LocationFallbackScreen({ navigation, route }) {
  const { permanentlyDenied = false } = route.params || {};
  const current = getSession().centre;

  const [areas, setAreas] = useState(null); // null until loaded
  const [error, setError] = useState(null);
  const [areaName, setAreaName] = useState(current?.kind === "area" ? current.area : undefined);

  const load = useCallback(async () => {
    setError(null);
    try {
      const { areas: list } = await listAreas();
      setAreas(list.map((area) => ({ value: area.name, label: area.name })));
    } catch (err) {
      setError(parseApiError(err).formError || "The areas couldn't be loaded. Try again.");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function showGigs() {
    setCentre({ kind: "area", area: areaName });
    // Browse is the screen underneath; it reloads from the new centre as it comes back into view.
    navigation.goBack();
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScreenHeader title="Set your location" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.note}>Location is off. Pick your area to see gigs near you.</Text>

        {permanentlyDenied ? (
          <View style={styles.hint}>
            <FormBanner kind="info" message={SETTINGS_HINT} />
            <Link title="Open settings" onPress={() => Linking.openSettings()} />
          </View>
        ) : null}

        {areas ? (
          <Select label="Area" options={areas} value={areaName} onChange={setAreaName} placeholder="Choose your area" />
        ) : error ? (
          <>
            <FormBanner kind="error" message={error} />
            <Button title="Try again" style="secondary" onPress={load} />
          </>
        ) : (
          <LoadingState />
        )}
      </ScrollView>

      <CtaBar>
        <Button title="Show gigs" onPress={showGigs} disabled={!areaName} />
      </CtaBar>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg.default,
  },
  // content: pad 24/16/4/16, gap 16.
  content: {
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.gutter,
    paddingBottom: spacing.xs,
    gap: spacing.lg,
  },
  note: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  hint: {
    gap: spacing.sm,
  },
});
