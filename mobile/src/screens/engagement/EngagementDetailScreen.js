/**
 * Engagement detail — one screen, every moment of one engagement (prototype 5.2, 5.2h, 5.2p,
 * 5.2n, 5.2t, 5.2s, 5.11d, 5.11dr, 5.3, 5.3t, 5.3b, 5.3c, 5.3s, 5.3x). Requirements FR-ENG-01,
 * FR-ENG-02, FR-ENG-12, FR-ENG-14. Owner: Naveenkhan.
 *
 * Reached with `{ engagementId }` from the list, from the posting detail's "See engagement", and
 * back from the rating screens (6.2's "Back to engagement" pops to this route). It reloads every
 * time it regains focus, so a confirmed code or a submitted rating shows at once.
 *
 *   - CHECK-INS: arrival, completion and payment in order, each "Not reached" until the one
 *     before it is confirmed (FR-ENG-01 as amended). An unpaid internship has no payment row
 *     (FR-ENG-02). The wording per state lives in engagement.format.js.
 *   - The pinned button is the viewer's step at the live checkpoint: enter the other party's
 *     code, or show their own (the custody flip at payment). Nothing is pinned before the start.
 *   - Rating row: once rating has opened — "Rate now", "View status" or "See ratings".
 *   - End engagement (part-time only, once started — FR-ENG-12): not drawn in the prototype; built
 *     from M5's "States not drawn": a link at the foot of the content → a ConfirmDialog "Did
 *     something go wrong?". No → ended, straight to rating (M6 6.1). Yes → 5.6's pattern, which
 *     opens the dispute case (M9 9.2) before anything else.
 *   - A dispute holding the engagement (5.2s opener, 5.3s respondent — FR-DISPUTE-07): the case in
 *     one line (`disputeNote`) and the pinned "Open the dispute case" → M9's DisputeCase, in place
 *     of any checkpoint button.
 *   - The stalled prompt (5.14, and over 5.3 for the employer — FR-ENG-13 as amended 2026-09-24):
 *     "Did this happen?" opens over the detail when `stalledPrompt.show`. "Still running" dismisses
 *     it on the server and changes nothing; "Update status" opens the earliest unresolved
 *     checkpoint's code screen (where "Unable to confirm?" opens a dispute).
 *   - Report (FR-DISPUTE-01 "within an active Engagement"): not drawn on any engagement frame; the
 *     shared Action/Link "Report" at the foot of an ACTIVE engagement, with Cancel / End.
 *   - Contact and location (FR-APPLY-07, FR-POST-08), worker side: NOT DRAWN on any frame. While the
 *     engagement is Active or Disputed, the selected worker sees the employer's phone (4.8's "PHONE"
 *     caption + value) and the precise location as Display/MapArea {Kind=PrecisePin} with the
 *     address under it, read from the posting (GET /api/postings/:id releases the address only to
 *     the owner and a selected worker).
 *   - Cancel engagement (before the start, FR-ENG-05/06) → 5.7t / 5.10 / 5.7e; while a request is
 *     open the requester sees 5.2tx's note; a cancelled engagement says how it was cancelled
 *     (5.2nc, 5.2tc, 5.3x, 5.11d — the wording lives in engagement.format.js).
 */
import { useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, useWindowDimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import { getEngagement, endEngagement, dismissStalledPrompt } from "../../api/engagement.api";
import { getGigPosting } from "../../api/posting.api";
import { parseApiError } from "../../api/client";
import ScreenHeader from "../../components/ScreenHeader";
import Badge from "../../components/Badge";
import Button from "../../components/Button";
import CtaBar from "../../components/CtaBar";
import Link from "../../components/Link";
import ConfirmDialog from "../../components/ConfirmDialog";
import DialogModal from "../../components/DialogModal";
import FormBanner from "../../components/FormBanner";
import LoadingState from "../../components/LoadingState";
import MapArea from "../../components/MapArea";
import { formatPhone } from "../application/application.format";
import { colors, spacing, radius, typography } from "../../theme/tokens";
import {
  cancellationNote,
  checkpointState,
  disputeNote,
  liveActionLabel,
  pendingRequestNote,
  postingLine,
} from "./engagement.format";

// The check-in rows draw a 90-wide label column beside the state (5.2). At large text a fixed 90 broke
// "Completion" and "Payment" mid-word (found on the emulator at font scale 2.0, 360 dp — the same
// defect as Review's "Urgency", POST-E2E-06). The column grows with the font; when that would leave
// the state less than half the row, the label goes above it. At font scale 1.0 this is exactly 5.2.
const CP_LABEL_WIDTH = 90;
const CP_ROW_GAP = 10;
const CP_ROW_PADDING = 12; // spacing.md on each side

const CHECKPOINT_LABEL = { arrival: "Arrival", completion: "Completion", payment: "Payment" };

const TONE_COLOR = {
  action: colors.brand.primary,
  done: colors.state.success,
  muted: colors.text.secondary,
};

/**
 * One check-in row (cp-Arrival / cp-Completion / cp-Payment in 5.2p and 5.3). Figma centres the 16 px
 * label against the 12 px state in the Arrival and Completion rows, even when the state wraps, so
 * the two share a middle line; the Payment row alone is top-aligned with a 12 gap (its right-hand
 * side is a column that can hold a code). A stacked row (large text) is a plain column.
 */
function CheckpointRow({ name, stacked, labelStyle, label, state, color }) {
  const top = name === "payment";
  return (
    <View style={[styles.cpRow, stacked ? styles.cpRowStacked : top && styles.cpRowTop]}>
      <Text style={labelStyle}>{label}</Text>
      <Text style={[styles.cpState, stacked && styles.cpStateStackedRow, { color }]}>{state}</Text>
    </View>
  );
}

export default function EngagementDetailScreen({ route, navigation }) {
  const { engagementId } = route.params || {};
  const { width, fontScale } = useWindowDimensions();
  const cpLabelWidth = Math.round(CP_LABEL_WIDTH * Math.max(1, fontScale));
  const cpRowWidth = width - 2 * spacing.gutter - 2 * CP_ROW_PADDING;
  const cpStacked = cpRowWidth - cpLabelWidth - CP_ROW_GAP < cpRowWidth / 2;
  const cpRowStyle = [styles.cpRow, cpStacked && styles.cpRowStacked];
  const cpLabelStyle = [styles.cpLabel, cpStacked ? styles.cpLabelStacked : { width: cpLabelWidth }];
  const [engagement, setEngagement] = useState(null);
  const [error, setError] = useState(null);
  const [endDialogOpen, setEndDialogOpen] = useState(false);
  const [ending, setEnding] = useState(false);
  // 5.14: closed for as long as this screen is open once answered, so returning from the code
  // screen does not put it straight back up (the server keeps it until "Still running").
  const [stalledClosed, setStalledClosed] = useState(false);
  const [dismissing, setDismissing] = useState(false);
  // FR-POST-08: the precise address, released to the selected worker only (null until loaded).
  const [location, setLocation] = useState(null);

  const load = useCallback(async () => {
    try {
      const res = await getEngagement(engagementId);
      setEngagement(res.engagement);
      setError(null);
    } catch (err) {
      setError(parseApiError(err).formError || "This engagement couldn't be loaded.");
    }
  }, [engagementId]);

  useEffect(() => {
    load();
    return navigation.addListener("focus", load);
  }, [load, navigation]);

  // FR-APPLY-07 / FR-POST-08: the worker's precise location, from the posting itself. Only the
  // selected worker of a live engagement asks; a refusal or no address just leaves the map out.
  const gigPostingId = engagement?.posting?.id;
  const wantsLocation =
    engagement?.viewerRole === "WORKER" && (engagement.status === "ACTIVE" || engagement.status === "DISPUTED");
  useEffect(() => {
    if (!wantsLocation || !gigPostingId) return undefined;
    let active = true;
    getGigPosting(gigPostingId)
      .then((res) => {
        const p = res?.posting;
        if (active && p?.isPreciseLocationReleased && p.locationAddress) setLocation({ address: p.locationAddress });
      })
      .catch(() => {}); // the rest of the engagement is still correct without it
    return () => {
      active = false;
    };
  }, [wantsLocation, gigPostingId]);

  const header = <ScreenHeader title="Engagement" onBack={() => navigation.goBack()} />;

  if (!engagement) {
    return (
      <View style={styles.root}>
        <StatusBar style="dark" />
        {header}
        <View style={styles.content}>
          {error ? <FormBanner kind="error" message={error} /> : <LoadingState />}
        </View>
      </View>
    );
  }

  const isWorker = engagement.viewerRole === "WORKER";
  const live = engagement.liveCheckpoint;
  const liveLabel = live && !engagement.codesMissing ? liveActionLabel(live, engagement.liveRole) : null;
  // FR-ENG-05/06: offered until the start, unless a request is already waiting for an answer.
  const showsCancelLink = engagement.canCancel;
  const cancelNote = cancellationNote(engagement);
  // 5.2nc, 5.2tc and 5.11d (the worker's cancelled engagement) draw no help link; 5.3x does.
  const showsHelpLink = !(engagement.status === "CANCELLED" && isWorker);
  const showsEndLink = engagement.canEnd;
  const ratingRow = ratingRowFor(engagement);
  // 5.2s / 5.3s: the case holds the engagement, so its button replaces any checkpoint button.
  const caseNote = disputeNote(engagement);
  const caseId = caseNote ? engagement.dispute.id : null;
  // FR-DISPUTE-01: reporting the engagement is offered while it is active.
  const showsReportLink = engagement.status === "ACTIVE";
  const showsStalledPrompt = Boolean(engagement.stalledPrompt?.show) && !stalledClosed;
  const showsContact = wantsLocation && Boolean(engagement.counterparty.phone);
  const pinnedLabel = caseId ? "Open the dispute case" : liveLabel;

  // 5.14 "Still running": dismissed on the server, nothing else changes (FR-ENG-13 amendment AC 1).
  async function stillRunning() {
    if (dismissing) return;
    setDismissing(true);
    try {
      await dismissStalledPrompt(engagementId);
      setStalledClosed(true);
      load();
    } catch (err) {
      setStalledClosed(true);
      // "There is no prompt to dismiss." means it is already gone — nothing to tell anyone.
      if (err.status !== 409) setError(parseApiError(err).formError || "The prompt couldn't be dismissed.");
      load();
    } finally {
      setDismissing(false);
    }
  }

  // 5.14 "Update status" → the earliest unresolved checkpoint (5.5a for arrival; AC 2).
  function updateStatus() {
    setStalledClosed(true);
    navigation.navigate("EngagementCode", { engagementId });
  }

  // "No, nothing went wrong" (FR-ENG-12): the engagement ends and rating opens — M6 6.1.
  async function endWithoutIssue() {
    if (ending) return;
    setEnding(true);
    try {
      await endEngagement(engagementId, { somethingWentWrong: false });
      setEndDialogOpen(false);
      navigation.navigate("RatingRate", { engagementId });
    } catch (err) {
      setEndDialogOpen(false);
      setError(parseApiError(err).formError || "This engagement couldn't be ended.");
      load();
    } finally {
      setEnding(false);
    }
  }

  // "Yes, something went wrong": 5.6's pattern, which opens the dispute route.
  function endWithIssue() {
    setEndDialogOpen(false);
    navigation.navigate("EngagementUnableToConfirm", { engagementId, mode: "end" });
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      {header}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, !pinnedLabel && styles.contentNoBar]}
      >
        {error ? <FormBanner kind="error" message={error} /> : null}

        {/* topRow wraps: the name has the first line to itself, the badges sit on the second. */}
        <View style={styles.topRow}>
          <Text style={styles.counterparty}>{engagement.counterparty.name}</Text>
          {engagement.counterparty.phoneVerified ? <Badge family="verified" /> : null}
          <Badge family="engagement" value={engagement.status} />
        </View>
        <Text style={styles.posting}>{postingLine(engagement.posting)}</Text>

        <Text style={styles.cpHeader}>CHECK-INS</Text>
        {["arrival", "completion", "payment"].map((name) => {
          if (!engagement.checkpoints[name]) return null; // FR-ENG-02: no payment row
          const state = checkpointState(engagement, name);
          return (
            <CheckpointRow
              key={name}
              name={name}
              stacked={cpStacked}
              labelStyle={cpLabelStyle}
              label={CHECKPOINT_LABEL[name]}
              state={state.text}
              color={TONE_COLOR[state.tone]}
            />
          );
        })}

        {showsHelpLink ? (
          <Link title="How check-in codes work" onPress={() => navigation.navigate("HelpCheckIn")} />
        ) : null}

        {engagement.codesMissing ? (
          <FormBanner
            kind="error"
            message="No check-in codes were issued for this engagement, so this checkpoint can't be confirmed by code."
          />
        ) : null}

        {/* 5.2tx: the requester's own request, waiting for an answer. */}
        {engagement.pendingCancellation?.requestedByMe ? (
          <Text style={styles.note}>{pendingRequestNote(engagement)}</Text>
        ) : null}

        {/* 5.2nc, 5.2tc, 5.3x, 5.11d: how a cancelled engagement came to be cancelled. */}
        {cancelNote ? <Text style={styles.note}>{cancelNote}</Text> : null}

        {/* 5.2s / 5.3s: the case in one line. */}
        {caseNote ? <Text style={styles.note}>{caseNote}</Text> : null}

        {/* FR-APPLY-07 / FR-POST-08, worker side — not drawn; 4.8's "PHONE" pattern (see header). */}
        {showsContact ? (
          <>
            <Text style={styles.cpHeader}>PHONE</Text>
            <Text style={styles.contactValue}>{formatPhone(engagement.counterparty.phone)}</Text>
          </>
        ) : null}
        {showsContact && location ? (
          <>
            <Text style={styles.cpHeader}>ADDRESS</Text>
            <MapArea kind="precisePin" />
            <Text style={styles.contactValue}>{location.address}</Text>
          </>
        ) : null}

        {ratingRow ? (
          <View style={[cpRowStyle, !cpStacked && styles.cpRowTop]}>
            <Text style={cpLabelStyle}>Rating</Text>
            <View style={styles.cpRight}>
              <Text style={styles.cpStateStacked}>{ratingRow.state}</Text>
              {ratingRow.link ? (
                <Link title={ratingRow.link} onPress={() => navigation.navigate(ratingRow.route, { engagementId })} />
              ) : null}
            </View>
          </View>
        ) : null}

        <View style={styles.spacerGrow} />

        {showsCancelLink ? (
          // 5.2t / 5.2n / 5.3t → 5.7t, 5.10 or 5.7e
          <Link title="Cancel engagement" onPress={() => navigation.navigate("EngagementCancel", { engagementId })} />
        ) : null}
        {showsEndLink ? <Link title="End engagement" onPress={() => setEndDialogOpen(true)} /> : null}
        {showsReportLink ? (
          <Link
            title="Report"
            onPress={() =>
              navigation.navigate("DisputeReport", {
                targetType: "ENGAGEMENT",
                targetId: engagementId,
                context: `${engagement.posting.title} · ${engagement.counterparty.name}`,
              })
            }
          />
        ) : null}
      </ScrollView>

      {pinnedLabel ? (
        <CtaBar surface="subtle">
          <Button
            title={pinnedLabel}
            onPress={() =>
              caseId
                ? navigation.navigate("DisputeCase", { disputeCaseId: caseId, engagementId }) // 5.2s → 9.2, 5.3s → 9.2r
                : navigation.navigate("EngagementCode", { engagementId })
            }
          />
        </CtaBar>
      ) : null}

      {/* 5.14 — "Did this happen?" over the detail. Hardware back closes it without an answer. */}
      <DialogModal visible={showsStalledPrompt && !endDialogOpen} onRequestClose={() => setStalledClosed(true)}>
        <ConfirmDialog
          title="Did this happen?"
          body={`${engagement.posting.title} started more than a day ago. If it's still running, just dismiss this — nothing changes.`}
          cancelLabel="Still running"
          cancelStyle="secondary"
          onCancel={stillRunning}
          confirmLabel="Update status"
          confirmStyle="primary"
          onConfirm={updateStatus}
          fillActions
        />
      </DialogModal>

      {/* FR-ENG-12's prompt. Not drawn: composed per M5 "States not drawn". */}
      <DialogModal visible={endDialogOpen} onRequestClose={() => setEndDialogOpen(false)}>
        <ConfirmDialog
          title="Did something go wrong?"
          body={`${engagement.counterparty.name} is told either way. If something went wrong, a dispute is opened before anything else; if not, you go straight to rating.`}
          cancelLabel="No"
          cancelStyle="secondary"
          onCancel={endWithoutIssue}
          confirmLabel="Yes"
          confirmStyle="primary"
          onConfirm={endWithIssue}
        />
      </DialogModal>
    </View>
  );
}

/**
 * The Rating row (5.3b "Not yet rated · Rate now", 5.2c "Submitted — awaiting reveal · View
 * status", 5.2d "Ratings revealed · See ratings"), or null before rating has opened.
 */
function ratingRowFor(engagement) {
  const r = engagement.rating;
  if (!r?.openedAt) return null;
  if (r.revealed) return { state: "Ratings revealed", link: "See ratings", route: "RatingRevealed" };
  if (r.submitted) return { state: "Submitted — awaiting reveal", link: "View status", route: "RatingAwaiting" };
  if (r.isOpen) return { state: "Not yet rated", link: "Rate now", route: "RatingRate" };
  return { state: "Not yet rated", link: null, route: null };
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg.subtle,
  },
  scroll: {
    flex: 1,
  },
  // Figma content: pad 16/16/0/16 gap 10 above a pinned bar; 16/16/24/16 without one.
  content: {
    flexGrow: 1,
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.gutter,
    gap: 10,
  },
  contentNoBar: {
    paddingBottom: spacing.xl,
  },
  topRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    columnGap: spacing.sm,
    rowGap: spacing.xs,
  },
  // The name takes the whole first line, so the badges wrap together onto the second.
  counterparty: {
    width: "100%",
    ...typography.title,
    color: colors.text.primary,
  },
  posting: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  cpHeader: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  // cp-*: pad 10/12, gap 10, r8, fill color/bg/subtle; label and a one-line state centred together.
  cpRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    borderRadius: radius.input,
    backgroundColor: colors.bg.subtle,
  },
  // cp-Payment (items-start, gap 12), and the Rating row, whose right-hand side is a column.
  cpRowTop: {
    alignItems: "flex-start",
    gap: spacing.md,
  },
  cpRowStacked: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: spacing.xs,
  },
  cpLabel: {
    width: CP_LABEL_WIDTH,
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  cpLabelStacked: {
    width: "100%",
  },
  cpRight: {
    flex: 1,
    gap: spacing.xs,
  },
  cpState: {
    flex: 1,
    ...typography.caption,
  },
  // Stacked rows are a column: the state text must hug its height, not flex (flex: 1 would collapse it).
  cpStateStackedRow: {
    flex: 0,
  },
  // Inside cpRight (a column), the state text hugs its height instead of flexing.
  cpStateStacked: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  note: {
    ...typography.body,
    color: colors.text.primary,
  },
  // The revealed phone and address: 4.8's `phone` value style under a caption label.
  contactValue: {
    ...typography.body,
    color: colors.text.primary,
  },
  spacerGrow: {
    flexGrow: 1,
  },
});
