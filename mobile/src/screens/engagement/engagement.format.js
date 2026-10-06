/**
 * Display strings for the engagement screens — Naveenkhan.
 *
 * Every sentence the engagement screens build from data is made here, once, so the list, the
 * detail and the code screens can never word the same fact two ways. Copy is the prototype's
 * (docs/prototype/M5-engagement.md), character for character where it is drawn. Where a string
 * is DERIVED for a state the prototype does not draw, the comment beside it says so.
 *
 * Pure functions, no React.
 */

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const HOUR_MS = 60 * 60 * 1000;

/** "5:00 AM" */
export function formatTime(value) {
  const d = new Date(value);
  const hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${hours % 12 || 12}:${minutes} ${hours >= 12 ? "PM" : "AM"}`;
}

/** "30 Aug 2026" */
export function formatDate(value) {
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** "Wed 2 Sep 2026" */
export function formatDay(value) {
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  return `${WEEKDAYS[d.getDay()]} ${formatDate(d)}`;
}

/** "Mon 31 Aug 2026, 6:00 PM" */
export function formatDayTime(value) {
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  return `${formatDay(d)}, ${formatTime(d)}`;
}

// ---------------------------------------------------------------------------
// Pay — docs/prototype/design-system.md §9
// ---------------------------------------------------------------------------

const PER_UNIT = { DAY: "per day", WEEK: "per week", MONTH: "per month" };

/** "Rs 6,000" — no decimals, thousands separators. */
function rupees(amount) {
  const whole = Math.round(Number(amount) || 0);
  return `Rs ${String(whole).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

/** The worker-facing pay: "Rs 6,000 for the job", "Rs 1,800 per day", "Rs 15,000 stipend", "Unpaid". */
export function payLine(posting) {
  const per = PER_UNIT[posting.payRateUnit];
  const rs = rupees(posting.payAmount);
  switch (posting.payKind) {
    case "RATE":
      return per ? `${rs} ${per}` : rs;
    case "PAID":
      return per ? `${rs} ${per}` : `${rs} for the job`;
    case "STIPEND":
      return per ? `${rs} stipend ${per}` : `${rs} stipend`;
    case "UNPAID":
      return "Unpaid";
    default:
      return `${rs} for the job`;
  }
}

/**
 * The detail's `posting` line: "Shop assistant — weekend · Rs 7,000 for the job" (5.2), and for a
 * part-time job its schedule after it: "Grade 8 maths tutoring · Rs 1,800 per day · Mon, Wed, Fri 6–8 pm" (5.2t).
 */
export function postingLine(posting) {
  const parts = [posting.title, payLine(posting)];
  if (posting.arrangementType !== "GIG" && posting.schedule) parts.push(posting.schedule);
  return parts.join(" · ");
}

// ---------------------------------------------------------------------------
// Names
// ---------------------------------------------------------------------------

/**
 * How the worker's screens name the employer in a sentence: a business by its name ("Saman
 * Stores", "Lanka Events (Pvt) Ltd"), a person by their first name ("Dilrukshi", 5.2t, 5.11).
 */
export function employerShortName(engagement) {
  const name = engagement.counterparty?.name ?? "";
  if (engagement.posting?.postedAsType === "BUSINESS") return name;
  return name.trim().split(/\s+/)[0] ?? name;
}

// ---------------------------------------------------------------------------
// The list's next-action line (FR-ENG-14, as amended 2026-09-24)
// ---------------------------------------------------------------------------

const CODE_ACTION = {
  // The worker's lines
  "arrival:ENTERER": "Enter arrival code", // 5.1w
  "completion:ENTERER": "Enter completion code", // 5.2h's button
  "payment:HOLDER": "Show my payment code", // 5.2p's button
  // The employer's lines
  "arrival:HOLDER": "Show arrival code", // derived from 5.1eu's "Show completion code"
  "completion:HOLDER": "Show completion code", // 5.1eu
  "payment:ENTERER": "Enter payment code", // derived: the employer's side of the payment checkpoint
};

/**
 * The owed action as one line, or null.
 * @param {object|null} action - the server's `nextAction`
 * @param {string} counterpartyName
 */
export function nextActionLabel(action, counterpartyName) {
  if (!action) return null;
  switch (action.kind) {
    case "CODE":
      return CODE_ACTION[`${action.checkpoint}:${action.role}`] ?? null;
    case "RECONFIRM":
      // 5.1w for a moved start; "the change" is DERIVED for the other material fields.
      return action.changedFields?.includes("startAt")
        ? `Re-confirm the new start — by ${formatDayTime(action.deadline)}`
        : `Re-confirm the change — by ${formatDayTime(action.deadline)}`;
    case "RESPOND_CANCELLATION":
      return `Asked to cancel — respond by ${formatDay(action.deadline)}`; // 5.1
    case "RATE":
      return `Rate ${counterpartyName}`; // 5.1c, 5.1ec
    default:
      return null;
  }
}

/** The detail's pinned button for the live checkpoint — the same words as the list line. */
export function liveActionLabel(checkpoint, role) {
  return CODE_ACTION[`${checkpoint}:${role}`] ?? null;
}

// ---------------------------------------------------------------------------
// The detail's checkpoint rows (cpState)
// ---------------------------------------------------------------------------

/**
 * One checkpoint row's text and tone ("action" = brand colour, "done" = success, "muted" =
 * secondary). Drawn: 5.2, 5.2h, 5.2p, 5.2n, 5.2t, 5.2s, 5.3, 5.3t, 5.3b, 5.11d.
 */
export function checkpointState(engagement, name, now = Date.now()) {
  const cp = engagement.checkpoints[name];
  const isWorker = engagement.viewerRole === "WORKER";
  const running = engagement.status === "ACTIVE" || engagement.status === "DISPUTED";

  if (cp.status === "CONFIRMED") {
    return { text: name === "payment" ? "Confirmed ✓ · paid in hand" : "Confirmed ✓", tone: "done" };
  }
  if (cp.status === "SETTLED_BY_RULING") return { text: "Settled by ruling", tone: "muted" };
  if (cp.status === "UNABLE_TO_CONFIRM") return { text: "Not confirmed — dispute open", tone: "muted" };
  // A finished engagement's unreached checkpoints (5.11d, 5.2nc, 5.3x).
  if (!running) return { text: "—", tone: "muted" };

  if (engagement.liveCheckpoint === name) {
    const counterparty = engagement.counterparty.name;
    if (name === "arrival") {
      return isWorker
        ? { text: `Enter the code ${counterparty} shows you`, tone: "action" } // 5.2
        : { text: "Show your code when the worker arrives", tone: "action" }; // DERIVED from 5.3
    }
    if (name === "completion") {
      return isWorker
        ? { text: "Enter the employer's code", tone: "action" } // 5.2h
        : { text: "Show your code when the work is done", tone: "action" }; // 5.3
    }
    return isWorker
      ? { text: "Your code — share it once you're paid", tone: "muted" } // 5.2p
      : { text: "Enter the worker's code once you've paid them", tone: "action" }; // DERIVED (M5 "States not drawn")
  }

  // Arrival before the start (5.2n, 5.2t for the worker; 5.3t for the employer).
  if (name === "arrival" && !engagement.hasStarted && engagement.status === "ACTIVE") {
    const start = formatDayTime(engagement.posting.startAt);
    if (!isWorker) return { text: `Code issued at the start — ${start}`, tone: "muted" };
    const msLeft = new Date(engagement.posting.startAt).getTime() - now;
    if (msLeft < 24 * HOUR_MS) {
      const hours = Math.max(1, Math.ceil(msLeft / HOUR_MS));
      return { text: `Starts ${start} — in ${hours} ${hours === 1 ? "hour" : "hours"}`, tone: "muted" };
    }
    return { text: `Starts ${start} — ${employerShortName(engagement)} shows you a code then`, tone: "muted" };
  }
  return { text: "Not reached", tone: "muted" };
}

// ---------------------------------------------------------------------------
// FR-ENG-09 — material changes
// ---------------------------------------------------------------------------

// The change box's caps label. START TIME is drawn (5.11); the others are DERIVED.
const CHANGE_LABEL = {
  startAt: "START TIME",
  payAmount: "PAY",
  workersNeeded: "WORKERS NEEDED",
  schedule: "SCHEDULE",
};

// What a field is called inside a sentence: "the change … made to the start time" (5.11d).
const CHANGE_NOUN = {
  startAt: "the start time",
  payAmount: "the pay",
  workersNeeded: "the number of workers",
  schedule: "the schedule",
};

/** One side of a change, as text. `changeSummary` holds `{ field: { from, to } }` (posting.reconfirm.js). */
function changeValue(field, value, posting) {
  if (value === null || value === undefined || value === "") return "—";
  if (field === "startAt") return formatDayTime(value);
  if (field === "payAmount") return payLine({ ...posting, payAmount: value });
  return String(value);
}

/** The change boxes of 5.11: `[{ label, was, now }]`, one per changed field. */
export function changeRows(changeSummary, posting) {
  return Object.entries(changeSummary ?? {})
    .filter(([field]) => CHANGE_LABEL[field])
    .map(([field, change]) => {
      const pair = change && typeof change === "object" && "to" in change ? change : { from: null, to: change };
      return {
        field,
        label: CHANGE_LABEL[field],
        was: `Was: ${changeValue(field, pair.from, posting)}`,
        now: `Now: ${changeValue(field, pair.to, posting)}`,
      };
    });
}

/** 5.11 `who`: "Dilrukshi Herath moved the start of Grade 8 maths tutoring. Check the change and re-confirm." */
export function changeWhoLine(engagement, changeSummary) {
  const name = engagement.counterparty.name;
  const title = engagement.posting.title;
  if (changeSummary && "startAt" in changeSummary) {
    return `${name} moved the start of ${title}. Check the change and re-confirm.`;
  }
  return `${name} changed ${title}. Check the change and re-confirm.`; // DERIVED for the other fields
}

/** 5.11 `window`: what not accepting, or declining, does. */
export function changeWindowLine(engagement) {
  return `If you don't accept by then, or you can't make it, the engagement is cancelled — recorded as ${employerShortName(
    engagement,
  )}'s change, not against you.`;
}

/** 5.11d `cancelNote`, the worker's side of a declined change. */
export function declinedChangeNote(engagement) {
  const declined = engagement.declinedChange;
  const fields = Object.keys(declined?.changeSummary ?? {}).filter((f) => CHANGE_NOUN[f]);
  const what = fields.length === 1 ? CHANGE_NOUN[fields[0]] : "the posting";
  const when = formatDate(declined?.respondedAt ?? engagement.cancelledAt);
  // respondedAt is null when the window closed without an answer (rule 4) — that wording is DERIVED.
  const how = declined?.respondedAt
    ? `you declined the change ${engagement.counterparty.name} made to ${what}`
    : `you didn't re-confirm the change ${engagement.counterparty.name} made to ${what} in time`;
  return (
    `Cancelled on ${when} — ${how}. ` +
    `It is recorded as ${employerShortName(engagement)}'s change, not your cancellation, so your completion ` +
    "rate is unaffected. Either of you can still rate this engagement."
  );
}

/** 5.12 `context`: "Event setup crew (3 needed) · start time changed to 7:00 AM". */
export function changeContextLine(title, changeSummary, posting = {}) {
  const parts = [];
  for (const [field, change] of Object.entries(changeSummary ?? {})) {
    const pair = change && typeof change === "object" && "to" in change ? change : { from: null, to: change };
    if (field === "startAt") {
      const sameDay = pair.from && formatDate(pair.from) === formatDate(pair.to);
      parts.push(`start time changed to ${sameDay ? formatTime(pair.to) : formatDayTime(pair.to)}`);
    } else if (field === "payAmount") {
      parts.push(`pay changed to ${payLine({ ...posting, payAmount: pair.to })}`); // DERIVED
    } else if (field === "workersNeeded") {
      parts.push(`workers needed changed to ${pair.to}`); // DERIVED
    } else if (field === "schedule") {
      parts.push("schedule changed"); // DERIVED
    }
  }
  return [title, ...parts].join(" · ");
}

/** 5.12 `slotState` for each worker's answer. Only "Waiting — until …" is drawn. */
export function responseState(response) {
  if (response.status === "PENDING") return { text: `Waiting — until ${formatDayTime(response.deadline)}`, tone: "action" };
  if (response.status === "ACCEPTED") return { text: "Accepted", tone: "done" }; // DERIVED
  return { text: "Can't make it — cancelled", tone: "muted" }; // DERIVED
}

// ---------------------------------------------------------------------------
// Cancellation — FR-ENG-05 / 06 (5.7t, 5.8t, 5.2tx, 5.9, 5.9b, 5.9r, 5.10, 5.7e, 5.2nc, 5.2tc, 5.3x)
// ---------------------------------------------------------------------------

/** FR-ENG-05's fixed reasons, as 5.7t lists them. */
export const CANCELLATION_REASONS = [
  { id: "SCHEDULE_CONFLICT", label: "Schedule conflict" },
  { id: "DETAILS_NO_LONGER_SUITABLE", label: "Gig details no longer suitable" },
  { id: "FOUND_OTHER_WORK", label: "Found other work" },
  { id: "PERSONAL_EMERGENCY", label: "Personal or family emergency" },
  { id: "OTHER", label: "Other" },
];

export function reasonLabel(id) {
  return CANCELLATION_REASONS.find((r) => r.id === id)?.label ?? "";
}

/** 5.9 `context`: "Grade 8 maths tutoring · Part-time". */
const ARRANGEMENT_SHORT = { GIG: "One-off gig", PART_TIME: "Part-time", INTERNSHIP: "Internship" };
export function requestContextLine(posting) {
  return `${posting.title} · ${ARRANGEMENT_SHORT[posting.arrangementType] ?? ""}`;
}

function hoursPhrase(hours) {
  const n = Math.max(1, Math.floor(hours));
  return `${n} ${n === 1 ? "hour" : "hours"}`;
}

/** 5.7t `regimeNote` — a regular request. */
export function regularRegimeNote(engagement) {
  return `This is a regular gig: ${engagement.counterparty.name} gets 48 hours to respond before the cancellation takes effect.`;
}

/** 5.10 `imm` — the worker's urgent screen. */
export function urgentImmediateLine(engagement) {
  return `This gig is urgent, so cancelling takes effect immediately — there is no approval step. ${engagement.counterparty.name} is told now.`;
}

/** 5.10 `late` — the worker's warning, or null when the cancellation would not be Late. */
export function urgentLateLine(preview) {
  if (preview.lateReason === "UNDER_6_HOURS") {
    return "It starts in under 6 hours, so this is a late cancellation: it weighs twice on your completion rate.";
  }
  if (preview.lateReason === "BOOKED_AHEAD") {
    // DERIVED from 5.10 with FR-ENG-06's 24-hour clause.
    return "It was booked well ahead and starts in under 24 hours, so this is a late cancellation: it weighs twice on your completion rate.";
  }
  return null;
}

/** 5.7e `regimeNote` — the employer's urgent screen. */
export function employerUrgentNote(engagement, preview) {
  const first = `${engagement.posting.title} starts in ${hoursPhrase(preview.hoursToStart)}, so cancelling takes effect immediately and ${engagement.counterparty.name} is told now.`;
  if (preview.lateReason === "BOOKED_AHEAD") {
    return `${first} It was booked well ahead and the start is under 24 hours away, so this is a late cancellation.`;
  }
  if (preview.lateReason === "UNDER_6_HOURS") {
    return `${first} The start is under 6 hours away, so this is a late cancellation.`; // DERIVED
  }
  return first; // DERIVED: not late
}

/** 5.8t `line1`. The drawn "If she doesn't" names a pronoun the system cannot know: "they". */
export function requestSentLine(name) {
  return `${name} has 48 hours to respond. If they don't, the cancellation takes effect.`;
}

/** 5.2tx `cancelNote` — the requester's view while the request is open ("she" → "they", as above). */
export function pendingRequestNote(engagement) {
  return `Cancellation requested — ${engagement.counterparty.name} has 48 hours to accept or reject. If they don't respond, the cancellation takes effect. Until then the engagement stays as agreed.`;
}

/**
 * The cancelled engagement's `cancelNote`, or null. Drawn: 5.2nc (worker, immediate, late),
 * 5.3x (employer, immediate, late, booked ahead), 5.2tc (accepted the other's request), 5.11d
 * (declined change). Every other variant is DERIVED from those and marked so.
 */
export function cancellationNote(engagement) {
  const c = engagement.cancellation;
  if (engagement.status !== "CANCELLED" || !c) return null;
  const name = engagement.counterparty.name;
  const isWorker = engagement.viewerRole === "WORKER";
  const rateLine = "Either of you can still rate this engagement.";

  // FR-ENG-09: a change the worker declined, or did not accept in time.
  if (engagement.declinedChange) {
    if (isWorker) return declinedChangeNote(engagement);
    return engagement.declinedChange.respondedAt
      ? `Cancelled on ${formatDate(c.at)} — ${name} declined your change, so it is recorded as your change, not their cancellation. ${rateLine}` // DERIVED
      : `Cancelled on ${formatDate(c.at)} — ${name} didn't re-confirm your change in time, so it is recorded as your change, not their cancellation. ${rateLine}`; // DERIVED
  }

  if (c.via === "ACCEPTED") {
    return c.requestedByMe
      ? `Cancelled — you asked to cancel and ${name} accepted. ${rateLine}` // DERIVED
      : `Cancelled — ${name} asked to cancel and you accepted. No penalty to you; either of you can still rate this engagement.`; // 5.2tc
  }

  if (c.via === "AUTO_RESOLVED_NO_RESPONSE") {
    const by = formatDate(c.deadline ?? c.at);
    return c.requestedByMe
      ? `Cancelled — ${name} didn't respond by ${by}, so your request took effect. ${rateLine}` // DERIVED
      : `Cancelled — ${name} asked to cancel and you didn't respond by ${by}, so the request resolved against you. ${rateLine}`; // DERIVED
  }

  // Immediate (FR-ENG-06), or an older row with no request recorded.
  if (!c.byMe) return `Cancelled by ${name} on ${formatDate(c.at)}. ${rateLine}`; // DERIVED

  const hoursBefore = (new Date(engagement.posting.startAt).getTime() - new Date(c.at).getTime()) / HOUR_MS;
  if (isWorker) {
    if (c.lateReason === "UNDER_6_HOURS") {
      return `Cancelled by you on ${formatDate(c.at)}, under 6 hours before the start — a late cancellation. It weighs twice on your completion rate, and ${name} has been told. ${rateLine}`; // 5.2nc
    }
    if (c.lateReason === "BOOKED_AHEAD") {
      return `Cancelled by you on ${formatDate(c.at)}, under 24 hours before a start booked well ahead — a late cancellation. It weighs twice on your completion rate, and ${name} has been told. ${rateLine}`; // DERIVED
    }
    return `Cancelled by you on ${formatDate(c.at)}. ${name} has been told. ${rateLine}`; // DERIVED
  }
  const reopened = `${name} has been told, and the place on ${engagement.posting.title} reopened.`;
  if (c.lateReason === "BOOKED_AHEAD") {
    return `Cancelled by you on ${formatDayTime(c.at)}. The start was ${hoursPhrase(hoursBefore)} away on an engagement booked well ahead, so it is a late cancellation. ${reopened}`; // 5.3x
  }
  if (c.lateReason === "UNDER_6_HOURS") {
    return `Cancelled by you on ${formatDayTime(c.at)}. The start was under 6 hours away, so it is a late cancellation. ${reopened}`; // DERIVED
  }
  return `Cancelled by you on ${formatDayTime(c.at)}. ${reopened}`; // DERIVED
}
