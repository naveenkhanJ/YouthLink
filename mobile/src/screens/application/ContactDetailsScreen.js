/**
 * Contact details (prototype 4.8, 4.8k, 4.8t; FR-APPLY-07) — Naveenkhan.
 *
 * The employer's side of the contact reveal: the selected worker's phone number, and a note that
 * the employer's own number — and the venue address — went to that worker. FR-APPLY-07 reveals
 * both numbers to both parties and the precise address to the selected worker only, so there is
 * nothing about the location for the employer to see here (the screen stopped showing a map on
 * 2026-09-23).
 *
 * Opened with `{ gigPostingId, applicationId }` after a selection (4.7) or from a selected row of
 * the pool (4.5s). "Back to applicants" and the header's back both return to the pool.
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
import { getApplicantPool } from "../../api/application.api";
import { parseApiError } from "../../api/client";
import { contactContext, formatPhone } from "./application.format";

export default function ContactDetailsScreen({ route, navigation }) {
  const { gigPostingId, applicationId } = route.params ?? {};
  const [pool, setPool] = useState(null);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setPool(await getApplicantPool(gigPostingId));
      setError(null);
    } catch (err) {
      setError(parseApiError(err).formError || "The contact details couldn't be loaded.");
    }
  }, [gigPostingId]);

  useEffect(() => {
    load();
  }, [load]);

  const row = pool?.applicants.find((a) => a.applicationId === applicationId);

  // The pool this came from, or a fresh one when the selection replaced the confirmation screen.
  const backToPool = () => navigation.navigate("ApplicationApplicantPool", { gigPostingId });

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScreenHeader title="Contact details" onBack={backToPool} />

      <ScrollView contentContainerStyle={styles.content}>
        {error ? <FormBanner kind="error" message={error} /> : null}
        {error && !pool ? <Button title="Try again" style="secondary" onPress={load} /> : null}
        {!pool && !error ? <LoadingState /> : null}
        {row?.worker.phone ? (
          <>
            <Text style={styles.caption}>{contactContext(pool.posting.title, row.engagement?.status)}</Text>
            <Text style={styles.caption}>PHONE</Text>
            <Text style={styles.phone}>{formatPhone(row.worker.phone)}</Text>
            <Text style={styles.caption}>Your number is now shared with them too, with the venue address.</Text>
          </>
        ) : null}
      </ScrollView>

      <CtaBar surface="subtle">
        <Button title="Back to applicants" onPress={backToPool} />
      </CtaBar>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg.subtle,
  },
  // 4.8 content: pad 20/16/0/16, gap 12.
  content: {
    paddingTop: 20,
    paddingHorizontal: spacing.gutter,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  caption: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  phone: {
    ...typography.body,
    color: colors.text.primary,
  },
});
