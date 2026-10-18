/**
 * Reports & Disputes — the pure rules, with no database access.
 *
 * Epic: FR-DISPUTE (user side)
 *
 * Everything here takes plain objects (a DisputeCase row, an Engagement row) and a `now`, and
 * returns a decision, so the case screen (9.2 family), the engagement detail (5.2s / 5.3s) and the
 * engagements list (5.1es) can never disagree about what state a case is in or what the viewer owes.
 *
 * The rules, and where they come from:
 *   - FR-DISPUTE-04: the party who did not raise the case has 48 hours to respond; when the window
 *     lapses without a response, "review proceeds" — the case is Under review.
 *   - FR-DISPUTE-05: up to 3 images per party per case, 5 MB each.
 *   - FR-DISPUTE-07: both parties see the case's real stage, the window, and the outcome.
 *   - database-schema.md (DisputeCase): a stalled auto-flag has no raiser and no respondent, and
 *     starts Under review with no deadline.
 */

const HOUR_MS = 60 * 60 * 1000;

/** FR-DISPUTE-04: the respondent's window, from the moment the case opens. */
export const RESPONSE_WINDOW_MS = 48 * HOUR_MS;

/** FR-DISPUTE-05: per party, per case. */
export const EVIDENCE_MAX_PER_PARTY = 3;
/** FR-DISPUTE-05: each image, decoded. */
export const EVIDENCE_MAX_BYTES = 5 * 1024 * 1024;

/** Prototype 9.3 capNote: "Up to 300 characters." (schema column is VarChar(300)). */
export const STATEMENT_MAX = 300;

/** FR-DISPUTE-01's fixed list, in the order 9.1 draws it. */
export const REPORT_REASONS = ["FRAUD_SCAM", "INAPPROPRIATE_CONTENT", "SAFETY_CONCERN", "HARASSMENT", "OTHER"];

/** Prototype 9.1 detailLabel: "Details (optional · up to 300 characters)". The column allows 1000. */
export const REPORT_DETAIL_MAX = 300;

/** FR-DISPUTE-02: three independent (distinct) reporters auto-hide the content. */
export const AUTO_HIDE_THRESHOLD = 3;

/** What can be reported (FR-DISPUTE-01: listings, profiles, within an active engagement). */
export const REPORT_TARGETS = ["POSTING", "USER", "ENGAGEMENT"];

/**
 * The status a case really has right now. A response window that has closed is Under review even
 * if the sweep has not written it down yet (FR-DISPUTE-04 "review proceeds"), so no screen ever
 * shows "Awaiting response" with a deadline in the past.
 */
export function effectiveCaseStatus(disputeCase, now = new Date()) {
  if (
    disputeCase.status === "AWAITING_RESPONSE" &&
    disputeCase.respondentDeadline &&
    now.getTime() >= new Date(disputeCase.respondentDeadline).getTime()
  ) {
    return "UNDER_REVIEW";
  }
  return disputeCase.status;
}

/**
 * Who the viewer is in this case: the one who opened it, the one who must answer it, or — for a
 * stalled auto-flag, which nobody raised — simply one of the two parties.
 */
export function caseViewerRole(disputeCase, userId) {
  if (disputeCase.raisedByUserId && disputeCase.raisedByUserId === userId) return "RAISER";
  if (disputeCase.respondentUserId && disputeCase.respondentUserId === userId) return "RESPONDENT";
  return "PARTY";
}

/** True when the viewer is the respondent and can still respond (once, inside the window). */
export function canRespondToCase(disputeCase, userId, now = new Date()) {
  return (
    Boolean(disputeCase.respondentUserId) &&
    disputeCase.respondentUserId === userId &&
    !disputeCase.respondedAt &&
    effectiveCaseStatus(disputeCase, now) === "AWAITING_RESPONSE"
  );
}

/**
 * Whether a party may still attach evidence: only while the response window is open. Once review
 * proceeds it does so "using only the evidence submitted so far" (FR-DISPUTE-04's criterion), so
 * nothing is accepted after the window — and a stalled auto-flag, which never had a window, takes
 * none.
 */
export function evidenceWindowOpen(disputeCase, now = new Date()) {
  return effectiveCaseStatus(disputeCase, now) === "AWAITING_RESPONSE";
}

/**
 * The case an engagement is "about" right now: the open one if there is one, otherwise the latest.
 * `cases` is newest first.
 */
export function currentCase(cases) {
  const list = cases ?? [];
  return list.find((c) => c.status !== "RESOLVED") ?? list[0] ?? null;
}

const CHECKPOINT_ORDER = ["arrival", "completion", "payment"];

/**
 * Which checkpoint an unable-to-confirm case was opened from, read off the engagement: the one
 * marked UNABLE_TO_CONFIRM — or, once a ruling has settled it, SETTLED_BY_RULING (FR-ADM-08).
 * Null for the other entry points (End Engagement "yes", stalled, report).
 */
export function disputedCheckpoint(engagement, triggerType) {
  if (triggerType !== "UNABLE_TO_CONFIRM" || !engagement) return null;
  for (const wanted of ["UNABLE_TO_CONFIRM", "SETTLED_BY_RULING"]) {
    const found = CHECKPOINT_ORDER.find((cp) => engagement[`${cp}Status`] === wanted);
    if (found) return found;
  }
  return null;
}

/**
 * The recorded outcome from the viewer's side (9.2f "Outcome: in your favour …"). A ruling for the
 * raiser is in the raiser's favour and against the respondent, and the reverse; the other
 * resolutions (inconclusive, warning only, no-show confirmed) favour neither side as such.
 * @returns {true|false|null}
 */
export function outcomeFavoursViewer(resolution, viewerRole) {
  if (viewerRole === "PARTY") return null;
  if (resolution === "RULED_FOR_RAISER") return viewerRole === "RAISER";
  if (resolution === "RULED_FOR_OTHER") return viewerRole === "RESPONDENT";
  return null;
}

/**
 * The short form of an engagement's current case, for the engagement detail (5.2s / 5.3s
 * cancelNote and "Open the dispute case") — or null when the engagement has never had one.
 */
export function engagementDisputeSummary(engagement, userId, now = new Date()) {
  const dc = currentCase(engagement.disputeCases);
  if (!dc) return null;
  return {
    id: dc.id,
    status: effectiveCaseStatus(dc, now),
    triggerType: dc.triggerType,
    checkpoint: disputedCheckpoint(engagement, dc.triggerType),
    viewerRole: caseViewerRole(dc, userId),
    openedAt: dc.createdAt,
    openedByMe: Boolean(dc.raisedByUserId) && dc.raisedByUserId === userId,
    respondentDeadline: dc.respondentDeadline ?? null,
    hasResponded: Boolean(dc.respondedAt),
    canRespond: canRespondToCase(dc, userId, now),
  };
}
