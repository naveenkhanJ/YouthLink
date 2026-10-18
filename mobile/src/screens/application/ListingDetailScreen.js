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
 *
 * "Report this listing" (FR-DISPUTE-01) — M3 3.12g's `reportLink`: a caption-size line in
 * color/brand/primary under the employer block, opening M9 9.1 for this posting. 3.12g is the only
 * frame that draws it; it is offered on every listing, since FR-DISPUTE-01 puts a Report action on
 * listings generally. Its touch target is grown to 44 with hitSlop so the 16px line keeps 3.12g's
 * spacing.
 *
 * Offline (NFR-USE-01, 3.12ofl — added 2026-10-18): a listing loaded earlier in the session is shown
 * from the phone when the server can't be reached, under Feedback/OfflineBar with 3.12ofl's message,
 * and Apply is {State=Disabled} reading "Apply — needs a connection" (applying writes to the server).
 * Save and Report need the server too, so they are not offered while offline.
 *
 * Save / Saved (FR-DISC-06) — NOT DRAWN on 3.12 (its header is {Action=None}): a text action in the
 * ScreenHeader's action slot, Action/Link's look (mobile/body, brand, underlined) in a 44px target.
 * Shown once the saved state is known; a job-seeker only (the saved list is theirs). A failed toggle
 * reverts and says why in a Toast.
 */
import { useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { colors, spacing, radius, typography, pressed } from "../../theme/tokens";
import ScreenHeader from "../../components/ScreenHeader";
import Badge from "../../components/Badge";
import MapArea from "../../components/MapArea";
import Button from "../../components/Button";
import CtaBar from "../../components/CtaBar";
import LoadingState from "../../components/LoadingState";
import FormBanner from "../../components/FormBanner";
import OfflineBar from "../../components/OfflineBar";
import { cachedListing, rememberListing } from "./listingCache";
import { useToast } from "../../components/Toast";
import { getListingDetail } from "../../api/application.api";
import { getSavedState, saveGig, unsaveGig } from "../../api/discovery.api";
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
  const [offline, setOffline] = useState(false); // showing the copy kept on the phone (3.12ofl)
  const [saved, setSaved] = useState(null); // null = not known (or not a job-seeker): no action shown
  const [saving, setSaving] = useState(false);
  const { show: showToast, toast } = useToast();

  const load = useCallback(async () => {
    if (!gigPostingId) return;
    setError(null);
    try {
      const fresh = await getListingDetail(gigPostingId);
      rememberListing(gigPostingId, fresh);
      setDetail(fresh);
      setOffline(false);
    } catch (err) {
      const kept = err.offline ? cachedListing(gigPostingId) : null;
      if (kept) {
        setDetail(kept);
        setOffline(true);
        return;
      }
      setError(parseApiError(err).formError || "This posting couldn't be loaded.");
    }
  }, [gigPostingId]);

  // Reload when the screen is returned to, so an application just sent shows as applied.
  useEffect(() => {
    load();
    return navigation.addListener("focus", load);
  }, [load, navigation]);

  // FR-DISC-06: is this gig on the saved list? A refusal (not a job-seeker) or a failure leaves the
  // action out rather than showing a state that may be wrong.
  useEffect(() => {
    if (!gigPostingId) return undefined;
    let active = true;
    getSavedState(gigPostingId)
      .then((res) => active && setSaved(Boolean(res?.saved)))
      .catch(() => active && setSaved(null));
    return () => {
      active = false;
    };
  }, [gigPostingId]);

  async function toggleSaved() {
    if (saving || saved === null) return;
    const next = !saved;
    setSaving(true);
    setSaved(next); // shown at once; put back if the server refuses
    try {
      const res = next ? await saveGig(gigPostingId) : await unsaveGig(gigPostingId);
      setSaved(Boolean(res?.saved ?? next));
    } catch (err) {
      setSaved(!next);
      showToast(parseApiError(err).formError || "This gig couldn't be saved. Try again.");
    } finally {
      setSaving(false);
    }
  }

  const saveAction =
    saved === null || offline ? null : (
      <Pressable
        onPress={toggleSaved}
        disabled={saving}
        accessibilityRole="button"
        accessibilityLabel={saved ? "Remove from saved" : "Save this gig"}
        accessibilityState={{ selected: saved, busy: saving }}
        style={({ pressed: isPressed }) => [styles.saveAction, isPressed && styles.pressedText]}
      >
        <Text style={styles.saveLabel}>{saved ? "Saved" : "Save"}</Text>
      </Pressable>
    );

  const posting = detail?.posting;
  const employer = detail?.employer;
  const applied = Boolean(detail?.myApplication);
  const accepting = posting?.status === "OPEN";
  const basis = posting ? payBasis(posting) : null;

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScreenHeader title="Gig" onBack={() => navigation.goBack()} action={saveAction} />

      <ScrollView contentContainerStyle={styles.content}>
        {offline ? <OfflineBar message="Offline — showing gigs saved on your phone" /> : null}
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

            {/* 3.12g `reportLink` → 9.1 (needs the server, so not while offline) */}
            {offline ? null : (
            <Pressable
              onPress={() =>
                navigation.navigate("DisputeReport", { targetType: "POSTING", targetId: posting.id, context: posting.title })
              }
              hitSlop={{ top: 14, bottom: 14 }}
              accessibilityRole="button"
              accessibilityLabel="Report this listing"
              style={({ pressed: isPressed }) => isPressed && styles.pressedText}
            >
              <Text style={styles.reportLink}>Report this listing</Text>
            </Pressable>
            )}
          </>
        ) : null}
      </ScrollView>

      {posting ? (
        <CtaBar surface="subtle">
          <Button
            title={offline ? "Apply — needs a connection" : "Apply"}
            disabled={offline || applied || !accepting}
            onPress={() =>
              navigation.navigate("ApplicationApply", {
                gigPostingId: posting.id,
                title: posting.title,
                employerName: employer.displayName,
              })
            }
          />
          {!offline && (applied || !accepting) ? (
            <Text style={styles.applyCaption}>{applied ? ALREADY_APPLIED : NOT_ACCEPTING}</Text>
          ) : null}
        </CtaBar>
      ) : null}
      {toast}
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
  // 3.12g `reportLink`: mobile/caption in color/brand/primary.
  reportLink: {
    ...typography.caption,
    color: colors.brand.primary,
  },
  // Save / Saved: Action/Link's look in a 44 x 44 (at least) target inside the header's slot.
  saveAction: {
    minWidth: 44,
    minHeight: 44,
    paddingHorizontal: spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  saveLabel: {
    ...typography.body,
    color: colors.brand.primary,
    textDecorationLine: "underline",
  },
  pressedText: {
    opacity: pressed.textOpacity,
  },
});
