/**
 * Confirm selection (prototype 4.7, 4.7k, 4.7t; FR-APPLY-06, FR-APPLY-07, FR-APPLY-09) — Naveenkhan.
 *
 * Says what selecting does before it happens: an engagement is created (FR-APPLY-06), both sides
 * see each other's contact details (FR-APPLY-07), it takes one of the posting's places, and anyone
 * else stays in the pool until the posting fills, expires or is withdrawn (FR-APPLY-09).
 * "Select {first name}" selects and opens the contact details (4.8); Back cancels.
 *
 * Opened with `{ gigPostingId, applicationId }` from a pool row's Select or the detail's Select.
 * If the server refuses (the last place was just taken, the posting closed, the applicant was
 * already decided) its sentence shows in Feedback/FormBanner and nothing changes.
 */
import { useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { colors, spacing, typography } from "../../theme/tokens";
import ScreenHeader from "../../components/ScreenHeader";
import Button from "../../components/Button";
import CtaBar from "../../components/CtaBar";
import LoadingState from "../../components/LoadingState";
import FormBanner from "../../components/FormBanner";
import { getApplicantPool, selectApplicant } from "../../api/application.api";
import { parseApiError } from "../../api/client";
import { firstName, placesBullet } from "./application.format";

export default function ConfirmSelectionScreen({ route, navigation }) {
  const { gigPostingId, applicationId } = route.params ?? {};
  const [pool, setPool] = useState(null);
  const [error, setError] = useState(null);
  const [selecting, setSelecting] = useState(false);

  const load = useCallback(async () => {
    try {
      setPool(await getApplicantPool(gigPostingId));
      setError(null);
    } catch (err) {
      setError(parseApiError(err).formError || "This applicant couldn't be loaded.");
    }
  }, [gigPostingId]);

  useEffect(() => {
    load();
  }, [load]);

  const row = pool?.applicants.find((a) => a.applicationId === applicationId);
  const name = row?.worker.displayName ?? "";

  async function select() {
    setSelecting(true);
    setError(null);
    try {
      await selectApplicant(applicationId);
      // 4.7 → 4.8. Replace, so Back from the contact details does not return to a done selection.
      navigation.replace("ApplicationContactDetails", { gigPostingId, applicationId });
    } catch (err) {
      setError(parseApiError(err).formError || "The applicant couldn't be selected.");
      setSelecting(false);
    }
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScreenHeader title="Confirm selection" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content}>
        {error ? <FormBanner kind="error" message={error} /> : null}
        {!pool && !error ? <LoadingState /> : null}
        {row ? (
          <>
            <Text style={styles.who}>Select {name}?</Text>
            <Text style={styles.effect}>• An engagement is created for this gig</Text>
            <Text style={styles.effect}>• You'll each see the other's contact details</Text>
            <Text style={styles.effect}>{placesBullet(pool.posting.workersNeeded)}</Text>
            <Text style={styles.note}>
              Anyone else who applied stays in the pool until the posting fills, expires or is withdrawn.
            </Text>
          </>
        ) : null}
      </ScrollView>

      {row?.status === "PENDING" ? (
        <CtaBar>
          <Button title={`Select ${firstName(name)}`} onPress={select} loading={selecting} />
        </CtaBar>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg.default,
  },
  // 4.7 content: pad 20/16/0/16, gap 12.
  content: {
    paddingTop: 20,
    paddingHorizontal: spacing.gutter,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  who: {
    ...typography.title,
    color: colors.text.primary,
  },
  effect: {
    ...typography.secondary,
    color: colors.text.primary,
  },
  note: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
});
