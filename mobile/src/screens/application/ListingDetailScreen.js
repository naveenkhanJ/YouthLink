/**
 * Listing detail, job-seeker view (prototype M3 3.12 and its variants; FR-APPLY-01) — Naveenkhan.
 *
 * The 3.x number belongs to Discovery, but docs/prototype/README.md ("Who builds a screen") gives
 * 3.12 to Applying & Selection. It is opened from Browse with `{ gigPostingId }` and leads to the
 * Apply screen (4.1).
 *
 * Everything FR-APPLY-01 lists: title, description, category, arrangement type, pay, general area,
 * start time and urgency, slot-fill status, and the employer's trust signals (display name,
 * business bio when it posts as a Business, the phone-verified badge). Location is the area only —
 * `Display/MapArea {Kind=Area}`, never a pin (FR-POST-08); the server never sends this screen the
 * address at all.
 *
 * States: loading → Feedback/LoadingState; a failed load (or offline) → Feedback/FormBanner with
 * "Try again"; already applied, or the posting closed → Apply {State=Disabled} with a caption
 * saying why (M4 "States not drawn": a duplicate application).
 */
import { useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { colors, spacing, radius, typography } from "../../theme/tokens";
import ScreenHeader from "../../components/ScreenHeader";
import Badge from "../../components/Badge";
import MapArea from "../../components/MapArea";
import Button from "../../components/Button";
import CtaBar from "../../components/CtaBar";
import LoadingState from "../../components/LoadingState";
import FormBanner from "../../components/FormBanner";
import { getListingDetail } from "../../api/application.api";
import { parseApiError } from "../../api/client";
import { payLine, payBasis } from "../posting/posting.format.js";
import { listingMeta, listingFillStart, employerLine } from "./application.format";

// Server message reused as the disabled Apply's caption, so the screen and the API say the same.
const ALREADY_APPLIED = "You have already applied to this posting.";
const NOT_ACCEPTING = "This posting is no longer accepting applications.";

export default function ListingDetailScreen({ route, navigation }) {
  const gigPostingId = route.params?.gigPostingId;
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!gigPostingId) return;
    setError(null);
    try {
      setDetail(await getListingDetail(gigPostingId));
    } catch (err) {
      setError(parseApiError(err).formError || "This posting couldn't be loaded.");
    }
  }, [gigPostingId]);

  // Reload when the screen is returned to, so an application just sent shows as applied.
  useEffect(() => {
    load();
    return navigation.addListener("focus", load);
  }, [load, navigation]);

  const posting = detail?.posting;
  const employer = detail?.employer;
  const applied = Boolean(detail?.myApplication);
  const accepting = posting?.status === "OPEN";
  const basis = posting ? payBasis(posting) : null;

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScreenHeader title="Gig" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content}>
        {error ? <FormBanner kind="error" message={error} /> : null}
        {error && !detail ? <Button title="Try again" style="secondary" onPress={load} /> : null}
        {!detail && !error ? <LoadingState /> : null}

        {posting ? (
          <>
            <Text style={styles.title}>{posting.title}</Text>
            {posting.isUrgent ? (
              <View style={styles.badges}>
                <Badge family="urgent" />
              </View>
            ) : null}
            <Text style={styles.meta}>{listingMeta(posting)}</Text>

            {/* factsCard: pay, its basis when more than one worker is needed, then slots and start. */}
            <View style={styles.factsCard}>
              <Text style={styles.pay}>{payLine(posting)}</Text>
              {basis ? <Text style={styles.payBasis}>{basis}</Text> : null}
              <Text style={styles.fillStart}>{listingFillStart(posting)}</Text>
            </View>

            <Text style={styles.description}>{posting.description}</Text>

            <MapArea kind="area" areaLabel={`${posting.locationAreaLabel} area`} />

            <View style={styles.employer}>
              <View style={styles.employerRow}>
                <Text style={styles.employerName}>{employer.displayName}</Text>
                {employer.phoneVerified ? <Badge family="verified" /> : null}
              </View>
              <Text style={styles.businessBio}>{employerLine(employer, posting)}</Text>
            </View>
          </>
        ) : null}
      </ScrollView>

      {posting ? (
        <CtaBar surface="subtle">
          <Button
            title="Apply"
            disabled={applied || !accepting}
            onPress={() =>
              navigation.navigate("ApplicationApply", {
                gigPostingId: posting.id,
                title: posting.title,
                employerName: employer.displayName,
              })
            }
          />
          {applied || !accepting ? (
            <Text style={styles.applyCaption}>{applied ? ALREADY_APPLIED : NOT_ACCEPTING}</Text>
          ) : null}
        </CtaBar>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg.subtle,
  },
  // 3.12 content: pad 16/16/0/16, gap 10.
  content: {
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.gutter,
    paddingBottom: spacing.lg,
    gap: 10,
  },
  title: {
    ...typography.title,
    color: colors.text.primary,
  },
  badges: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  meta: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  // factsCard: pad 12/14, gap 6, r10 on bg/default.
  factsCard: {
    gap: 6,
    paddingVertical: spacing.md,
    paddingHorizontal: 14,
    borderRadius: radius.card,
    backgroundColor: colors.bg.default,
  },
  pay: {
    ...typography.displayNumber,
    color: colors.text.primary,
  },
  payBasis: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  fillStart: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  description: {
    ...typography.secondary,
    color: colors.text.primary,
  },
  employer: {
    gap: spacing.xs,
  },
  // A name and its badge wrap rather than squeeze the name (design-system.md §5).
  employerRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    columnGap: spacing.sm,
    rowGap: spacing.xs,
  },
  employerName: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  businessBio: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  applyCaption: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
});
