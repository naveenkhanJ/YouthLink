/**
 * Display strings for the dispute screens (M9, user side).
 *
 * Every sentence the case screens build from data is made here, once, so the case screen, the
 * respond screen and the engagement detail can never word the same fact two ways. Copy is the
 * prototype's (docs/prototype/M9-disputes.md, checked against the Figma frames), character for
 * character where it is drawn. Where a string is DERIVED for a state the prototype does not draw,
 * the comment beside it says so.
 *
 * Pure functions, no React. Dates use the engagement module's formatters ("2 Sep 2026",
 * "Wed 2 Sep 2026"), so a deadline reads the same on 5.2s and on 9.2.
 */
import { formatDate } from "../engagement/engagement.format";

/** CaseView.status → Display/Badge {Family=Case} value ("AWAITING_RESPONSE" → "awaitingresponse"). */
export function caseBadgeValue(status) {
  return String(status ?? "").replace(/_/g, "").toLowerCase();
}

/**
 * 9.2 `context`: "Shop assistant — weekend · Saman Stores" — the posting and the OTHER party.
 * 9.2e drops the name ("once a case is with an admin it is about the incident"). A report-type
 * case never names anyone (NFR-PRIV-05), so it is the posting alone.
 */
export function caseContextLine(dc) {
  const parts = [dc.postingTitle];
  if (dc.status !== "ESCALATED" && dc.counterpartName) parts.push(dc.counterpartName);
  return parts.filter(Boolean).join(" · ");
}

/**
 * 9.2 `trigger`. Drawn: "Opened from: arrival could not be confirmed." (9.2) and "… completion
 * could not be confirmed." (9.2k). The other three entry points (FR-DISPUTE-03) are not drawn;
 * their lines are DERIVED from the same "Opened from: …" pattern, naming only what happened.
 */
export function caseTriggerLine(dc) {
  switch (dc.triggerType) {
    case "UNABLE_TO_CONFIRM":
      return dc.checkpoint
        ? `Opened from: ${dc.checkpoint} could not be confirmed.`
        : "Opened from: a check-in could not be confirmed."; // DERIVED: checkpoint unknown
    case "END_ENGAGEMENT_ISSUE":
      return "Opened from: something went wrong when the engagement was ended."; // DERIVED (FR-ENG-12 "yes")
    case "STALLED_AUTO_FLAG":
      return "Opened from: the engagement stalled, with no update from either side for 7 days."; // DERIVED (FR-ENG-13)
    case "REPORT":
      return "Opened from: a report."; // DERIVED (FR-DISPUTE-03's fourth entry point)
    default:
      return null;
  }
}

/** 9.2 / 9.2r / 9.2k `countdown` (Display/CountdownText {Format=Deadline}). */
export function responseWindowLine(deadline) {
  return `Response window closes ${formatDate(deadline)}`;
}

/** 9.2c / 9.4 `countdown`. */
export function answerByLine(deadline) {
  return `Answer by ${formatDate(deadline)}`;
}

// The two visibility lines (FR-DISPUTE-07): "when" while something is still owed, "as soon as"
// once it is with the reviewers (9.2u, 9.2ur, 9.2e).
const VISIBLE_WHEN = "You'll see the outcome here when the case is decided.";
const VISIBLE_AS_SOON_AS = "You'll see the outcome here as soon as the case is decided.";

/** "the arrival dispute" (9.2f), or "the dispute" when it was not about one checkpoint. */
function disputeNoun(dc) {
  return dc.triggerType === "UNABLE_TO_CONFIRM" && dc.checkpoint ? `the ${dc.checkpoint} dispute` : "the dispute";
}

const FINAL = "This decision is final; there is no appeals process.";

/**
 * 9.2f `windowNote`. Drawn: "Outcome: in your favour — the arrival dispute was upheld. This
 * decision is final; there is no appeals process." M9's "States not drawn": an outcome against
 * the viewer is 9.2f "with the windowNote outcome sentence changed" and nothing softened. The
 * other wordings are DERIVED from the recorded resolution (FR-MOD / FR-ADM's outcomes).
 */
function outcomeLine(dc) {
  const resolution = dc.outcome?.resolution;
  const favour = dc.outcome?.inViewersFavour;
  const noun = disputeNoun(dc);
  let first;
  if (resolution === "RULED_FOR_RAISER" || resolution === "RULED_FOR_OTHER") {
    const upheld = resolution === "RULED_FOR_RAISER" ? `${noun} was upheld` : `${noun} was not upheld`;
    if (favour === true) first = `Outcome: in your favour — ${upheld}.`;
    else if (favour === false) first = `Outcome: not in your favour — ${upheld}.`; // DERIVED
    else first = `Outcome: ${upheld}.`; // DERIVED: a stalled case, which has no raiser
  } else if (resolution === "INCONCLUSIVE") {
    first = "Outcome: inconclusive — the evidence did not settle it either way."; // DERIVED
  } else if (resolution === "WARNING_ONLY") {
    first = "Outcome: closed with a warning."; // DERIVED
  } else if (resolution === "NO_SHOW_CONFIRMED") {
    first = "Outcome: a no-show was confirmed."; // DERIVED
  } else {
    first = "Outcome: recorded."; // DERIVED: an outcome with no resolution value
  }
  return `${first} ${FINAL}`;
}

/** 9.2f `visibilityNote`: "Resolved 4 Sep 2026 by a YouthLink admin ruling." */
function resolvedLine(outcome) {
  const when = formatDate(outcome?.resolvedAt);
  return outcome?.decidedBy === "ADMIN"
    ? `Resolved ${when} by a YouthLink admin ruling.`
    : `Resolved ${when} by a YouthLink moderator.`; // DERIVED: a moderator's decision
}

/**
 * The whole 9.2 family, chosen from the case's status and who is looking — one screen, not eight
 * (M9: "Build one screen and pick the copy and the button from whether the viewer is the opener or
 * the respondent").
 *
 * @returns {{ countdown: string|null, windowNote: string, visibilityNote: string,
 *   showHelpLink: boolean, showRespond: boolean, question: string|null }}
 */
export function caseCopy(dc) {
  const base = { countdown: null, question: null, showHelpLink: false, showRespond: false };

  // 9.2c — a question for the viewer while the case is under review. The badge stays the case's
  // status; the clarification adds a task, not a fifth value.
  if (dc.clarificationRequest && dc.status !== "RESOLVED") {
    return {
      ...base,
      countdown: answerByLine(dc.clarificationRequest.deadline),
      windowNote:
        "The moderator has a question for you. Answering helps your case — unanswered questions can leave the outcome inconclusive.",
      question: dc.clarificationRequest.question,
      visibilityNote: VISIBLE_WHEN,
    };
  }

  switch (dc.status) {
    case "AWAITING_RESPONSE": {
      const countdown = dc.respondentDeadline ? responseWindowLine(dc.respondentDeadline) : null;
      if (dc.viewerRole === "RESPONDENT" && !dc.hasResponded) {
        // 9.2r
        return {
          ...base,
          countdown,
          windowNote: "You have 48 hours to respond. If you don't, review goes ahead without your side.",
          visibilityNote: VISIBLE_WHEN,
          showHelpLink: true,
          showRespond: Boolean(dc.canRespond),
        };
      }
      if (dc.viewerRole === "RAISER") {
        // 9.2 / 9.2k
        return {
          ...base,
          countdown,
          windowNote: `${dc.counterpartName} has 48 hours to respond. If they don't, review goes ahead without their side.`,
          visibilityNote: VISIBLE_WHEN,
          showHelpLink: true,
        };
      }
      break; // anything else reads as under review (below)
    }
    case "ESCALATED":
      // 9.2e
      return {
        ...base,
        windowNote:
          "Escalated to a YouthLink admin for a ruling — this happens when a case needs a decision the moderator can't make alone.",
        visibilityNote: VISIBLE_AS_SOON_AS,
      };
    case "RESOLVED":
      // 9.2f
      return { ...base, windowNote: outcomeLine(dc), visibilityNote: resolvedLine(dc.outcome) };
    default:
      break;
  }

  // 9.2ur — the respondent whose response is on record.
  if (dc.viewerRole === "RESPONDENT" && dc.hasResponded) {
    return {
      ...base,
      windowNote:
        "A YouthLink moderator is reviewing both sides. Your response is on record — nothing more is needed from you right now.",
      visibilityNote: VISIBLE_AS_SOON_AS,
    };
  }
  // 9.2u — and, per M9's "States not drawn", both parties once the window expired unanswered.
  return {
    ...base,
    windowNote: "A YouthLink moderator is reviewing both sides. Nothing more is needed from you right now.",
    visibilityNote: VISIBLE_AS_SOON_AS,
  };
}

/**
 * 9.3 / 9.3e / 9.4 `context`: "Dispute: arrival not confirmed · Shop assistant — weekend". Only the
 * unable-to-confirm wording is drawn; the others are DERIVED in the same short form.
 */
export function respondContextLine(dc) {
  let what;
  switch (dc.triggerType) {
    case "UNABLE_TO_CONFIRM":
      what = dc.checkpoint ? `${dc.checkpoint} not confirmed` : "check-in not confirmed";
      break;
    case "END_ENGAGEMENT_ISSUE":
      what = "problem when the engagement ended"; // DERIVED
      break;
    case "STALLED_AUTO_FLAG":
      what = "engagement stalled"; // DERIVED
      break;
    default:
      what = "report"; // DERIVED
  }
  return [`Dispute: ${what}`, dc.postingTitle].filter(Boolean).join(" · ");
}

/** FR-DISPUTE-01's fixed reasons, as 9.1 draws them (title and description). */
export const REPORT_REASONS = [
  { id: "FRAUD_SCAM", title: "Fraud or scam", description: "Fake gig, fake pay, or identity misuse" },
  { id: "INAPPROPRIATE_CONTENT", title: "Inappropriate content", description: "Offensive or explicit material" },
  { id: "SAFETY_CONCERN", title: "Safety concern", description: "Something feels unsafe or risky" },
  { id: "HARASSMENT", title: "Harassment", description: "Threats or unwanted contact" },
  { id: "OTHER", title: "Other", description: "Something else" },
];
