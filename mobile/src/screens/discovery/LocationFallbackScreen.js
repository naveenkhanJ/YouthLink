/**
 * 3.4 — Manual location fallback (FR-DISC-02) — Pawan.
 *
 * Reached from Browse when location permission is denied (or when the phone can't give a
 * position), and from Browse's "Change area" link. The youth picks an area; "Show gigs" returns
 * to Browse, which searches from that area's centre.
 *
 * Route params:
 *   permanentlyDenied  The OS will no longer show the permission dialogue, so Browse came straight
 *                      here (A10). Adds the hint that location can be turned back on in Settings.
 *   currentLabel       The area already in use, preselected when changing it.
 */
import { useState } from "react";
import { Linking, ScrollView, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import ScreenHeader from "../../components/ScreenHeader";
import Select from "../../components/Select";
import FormBanner from "../../components/FormBanner";
import Link from "../../components/Link";
import Button from "../../components/Button";
import CtaBar from "../../components/CtaBar";
import { colors, spacing, typography } from "../../theme/tokens";
import AREAS from "./areas";

const AREA_OPTIONS = AREAS.map((area) => ({ value: area.label, label: area.label }));

export default function LocationFallbackScreen({ navigation, route }) {
  const { permanentlyDenied = false, currentLabel } = route.params || {};
  const [areaLabel, setAreaLabel] = useState(
    AREAS.some((area) => area.label === currentLabel) ? currentLabel : undefined,
  );

  function showGigs() {
    const area = AREAS.find((a) => a.label === areaLabel);
    // Back to the Browse screen underneath, handing it the chosen area.
    navigation.popTo("DiscoveryBrowse", { manualArea: area }, { merge: true });
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScreenHeader title="Set your location" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.note}>Location is off. Pick your area to see gigs near you.</Text>

        {permanentlyDenied ? (
          <View style={styles.settingsHint}>
            <FormBanner
              kind="info"
              message="YouthLink can't ask for your location again. You can turn it back on in your phone's Settings."
            />
            <Link title="Open Settings" onPress={() => Linking.openSettings()} />
          </View>
        ) : null}

        <Select
          label="Area"
          options={AREA_OPTIONS}
          value={areaLabel}
          onChange={setAreaLabel}
          placeholder="Choose your area"
        />
      </ScrollView>

      <CtaBar>
        <Button title="Show gigs" onPress={showGigs} disabled={!areaLabel} />
      </CtaBar>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg.default,
  },
  content: {
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  note: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  settingsHint: {
    gap: spacing.sm,
  },
});
