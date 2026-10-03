/**
 * Display strings for postings — Lahiru.
 *
 * Every figure and sentence the posting screens show is built here, once, so the
 * review, the confirmation, the list and the detail can never word the same fact
 * two ways. Pay follows docs/prototype/design-system.md §9 ("Pay strings — one
 * format everywhere"): `Rs` + a space + the amount with thousands separators and
 * no decimals, always per worker, never abbreviated (no "/day"). Start times
 * follow the prototype's rule: a card gives a weekday alone for a start inside
 * the coming week and writes the date out for anything later.
 *
 * Pure functions, no React — so they can be checked on their own.
 */
import { formatLKR } from './posting.constants.js';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_MS = 24 * 60 * 60 * 1000;

/** "5:00 AM" — 12-hour, minutes always shown. */
function formatTime(d) {
  const hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours % 12 || 12}:${minutes} ${hours >= 12 ? 'PM' : 'AM'}`;
}

/** "29 Aug 2026" */
export function formatDate(value) {
  const d = new Date(value);
  if (isNaN(d.getTime())) return '';
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** "Sat 29 Aug 2026, 5:00 AM" — the full start, for the review and the detail. */
export function formatStartFull(value) {
  const d = new Date(value);
  if (isNaN(d.getTime())) return '';
  return `${WEEKDAYS[d.getDay()]} ${formatDate(d)}, ${formatTime(d)}`;
}

/** "Sat 5:00 AM" inside the coming week, the full form for anything later. */
export function formatStartShort(value, now = Date.now()) {
  const d = new Date(value);
  if (isNaN(d.getTime())) return '';
  const ahead = d.getTime() - now;
  if (ahead >= 0 && ahead < 7 * DAY_MS) return `${WEEKDAYS[d.getDay()]} ${formatTime(d)}`;
  return formatStartFull(d);
}

// ---------------------------------------------------------------------------
// Pay (design-system.md §9)
// ---------------------------------------------------------------------------

const PER_UNIT = { DAY: 'per day', WEEK: 'per week', MONTH: 'per month' };

const plural = (n, noun) => `${n} ${noun}${n === 1 ? '' : 's'}`;

/** The posting's amount times its workers — only ever shown on a line labelled Total. */
function totalAmount(p) {
  return Number(p.payAmount) * Number(p.workersNeeded || 1);
}

/**
 * The pay a worker (or the owner's detail) sees: "Rs 6,000 for the job",
 * "Rs 1,800 per day", "Rs 15,000 stipend", "Unpaid".
 */
export function payLine(p) {
  const rs = formatLKR(p.payAmount);
  const per = PER_UNIT[p.payRateUnit];
  switch (p.payKind) {
    case 'RATE':
      return per ? `${rs} ${per}` : rs;
    case 'PAID': // an internship's rate with its unit, or its fixed total when it has none
      return per ? `${rs} ${per}` : `${rs} for the job`;
    case 'STIPEND':
      return per ? `${rs} stipend ${per}` : `${rs} stipend`;
    case 'UNPAID':
      return 'Unpaid';
    default: // FIXED_TOTAL
      return `${rs} for the job`;
  }
}

/** "per worker" — shown beside the pay only when more than one worker is needed. */
export function payBasis(p) {
  return p.payKind !== 'UNPAID' && Number(p.workersNeeded) > 1 ? 'per worker' : null;
}

/** The owner detail's pay line: "Rs 6,000 for the job · per worker". */
export function payDetailLine(p) {
  const basis = payBasis(p);
  return basis ? `${payLine(p)} · ${basis}` : payLine(p);
}

/** The review's Pay row: "Rs 6,000 per worker", "Rs 1,800 per day", "Unpaid". */
export function reviewPay(p) {
  const rs = formatLKR(p.payAmount);
  const per = PER_UNIT[p.payRateUnit];
  switch (p.payKind) {
    case 'RATE':
      return per ? `${rs} ${per}` : `${rs} per worker`;
    case 'PAID':
      return per ? `${rs} ${per}` : `${rs} per worker`;
    case 'STIPEND':
      return per ? `${rs} stipend ${per}` : `${rs} stipend`;
    case 'UNPAID':
      return 'Unpaid';
    default: // FIXED_TOTAL
      return `${rs} per worker`;
  }
}

/** The review's Total row: "Rs 18,000 for 3 workers", "Rs 1,800 per day · ongoing". */
export function reviewTotal(p) {
  if (p.payKind === 'UNPAID') return 'Unpaid';

  const workers = Number(p.workersNeeded || 1);
  const per = PER_UNIT[p.payRateUnit];
  const recurring = p.payKind === 'RATE' || ((p.payKind === 'PAID' || p.payKind === 'STIPEND') && per);

  if (p.payKind === 'STIPEND') {
    const stipend = per ? `stipend ${per}` : 'stipend';
    const amount = formatLKR(workers > 1 ? totalAmount(p) : p.payAmount);
    return `${amount} ${stipend}${workers > 1 ? ` for ${plural(workers, 'worker')}` : ''} · ongoing`;
  }
  if (recurring) {
    const amount = formatLKR(workers > 1 ? totalAmount(p) : p.payAmount);
    return `${amount} ${per}${workers > 1 ? ` for ${plural(workers, 'worker')}` : ''} · ongoing`;
  }
  // A fixed total (a Gig, or an internship paid a flat sum): the one-off sum across all workers.
  return `${formatLKR(totalAmount(p))} for ${plural(workers, 'worker')}`;
}

// ---------------------------------------------------------------------------
// Posting facts
// ---------------------------------------------------------------------------

/** "Event setup · One-off gig · Colombo 04 area" — the owner detail's meta line. */
export function metaLine({ categoryLabel, arrangementLabel, areaLabel }) {
  return [categoryLabel, arrangementLabel, `${areaLabel} area`].filter(Boolean).join(' · ');
}

/** "2 of 3 filled" — FR-POST-14: shown plainly wherever a posting is shown. */
export function fillText(p) {
  return `${p.filledCount ?? 0} of ${p.workersNeeded ?? 1} filled`;
}

/** "Urgent — starts within 48 hours (set automatically)" — the review's Urgency row. */
export function urgencyLine(isUrgent) {
  return isUrgent
    ? 'Urgent — starts within 48 hours (set automatically)'
    : 'Not urgent — starts in more than 48 hours (set automatically)';
}

/** "Lanka Events (Pvt) Ltd — Business" / "Dilrukshi Herath — Individual/Household". */
export function postingAsLine({ postedAsType, postedBusinessName, legalName }) {
  if (postedAsType === 'BUSINESS') return `${postedBusinessName || legalName || 'Your business'} — Business`;
  return `${legalName || 'You'} — Individual/Household`;
}

/** A posting's status as the shared Display/Badge's `value` ("OPEN" → "open"). */
export function badgeValue(status) {
  return String(status || 'OPEN').toLowerCase();
}

/**
 * The second line of a card on "My postings", by what the posting is now
 * (prototype 2.10, 2.10p, 2.10w): fill count first, then what matters for that status.
 */
export function cardMeta(p, now = Date.now()) {
  // 2.10g: a posting hidden after reports reads only this — never a report count (FR-DISPUTE-02).
  if (isHiddenPending(p)) return 'Hidden pending review';
  const fill = fillText(p);
  switch (p.status) {
    case 'FILLED':
      return `${fill} · Starts ${formatStartShort(p.startAt, now)}`;
    case 'WITHDRAWN':
      return `${fill} · Withdrawn by you${p.applicantCount === 0 ? ' · no one had applied' : ''}`;
    case 'EXPIRED':
      return `${fill} · Expired ${formatDate(p.expiresAt || p.startAt)}`;
    default: {
      const waiting = p.pendingApplicantCount ?? 0;
      const applicants = waiting > 0 ? `${plural(waiting, 'applicant')} waiting` : 'no applicants yet';
      return `${fill} · Starts ${formatStartShort(p.startAt, now)} · ${applicants}`;
    }
  }
}

/**
 * The owner detail's fill line (prototype 2.11p, 2.11x, 2.11f).
 * @param {string} [workerName] - the selected worker, when exactly one slot is filled and known
 */
export function detailFill(p, workerName) {
  const fill = fillText(p);
  if (isHiddenPending(p)) return `${fill} · Hidden from browse pending review`; // 2.11g
  switch (p.status) {
    case 'WITHDRAWN':
      return `${fill} · Withdrawn by you${p.applicantCount === 0 ? ' — no one had applied' : ''}`;
    case 'EXPIRED':
      return `${fill} · Expired ${formatDate(p.expiresAt || p.startAt)}`;
    case 'FILLED':
      return `${fill}${workerName ? ` · ${workerName}` : ''} · Starts ${formatStartFull(p.startAt)}`;
    default:
      return `${fill} · Starts ${formatStartFull(p.startAt)}`;
  }
}

// ---------------------------------------------------------------------------
// Hidden pending review (2.10g, 2.11g)
// ---------------------------------------------------------------------------

/** An Open posting hidden from Browse after reports (autoHiddenAt set); editing and withdrawal pause. */
export function isHiddenPending(p) {
  return Boolean(p?.autoHiddenAt) && p.status === 'OPEN';
}

// 2.10g `hiddenNote` and 2.11g `hiddenNote`, word for word.
export const HIDDEN_NOTE_LIST =
  "This posting was hidden from browse after reports and is being reviewed by YouthLink. You'll be notified of the outcome — restored or removed. Nothing else on your account is affected.";
export const HIDDEN_NOTE_DETAIL =
  "YouthLink is reviewing this posting. Editing and withdrawal are paused until the review ends — you'll be told whether it is restored or removed.";

// ---------------------------------------------------------------------------
// Editing (2.11pe, 2.11de, 2.11e, 2.11e2, 2.11c — FR-POST-11)
// ---------------------------------------------------------------------------

const pad2 = (n) => String(n).padStart(2, '0');

/** "2026-08-29" — the stored start as the Start date field holds it (device time). */
export function toDateInput(value) {
  const d = new Date(value);
  if (isNaN(d.getTime())) return '';
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

/** "05:00" — the stored start as the Start time field holds it (24-hour, as on the create form). */
export function toTimeInput(value) {
  const d = new Date(value);
  if (isNaN(d.getTime())) return '';
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

/** The two start fields back into one ISO instant, or '' while either is missing or invalid. */
export function combineStart(date, time) {
  if (!date || !time) return '';
  // "9:00" is as valid as "09:00", but only the padded form parses as an ISO time.
  const match = /^(\d{1,2}):(\d{2})$/.exec(time.trim());
  if (!match) return '';
  const d = new Date(`${date}T${match[1].padStart(2, '0')}:${match[2]}:00`);
  if (isNaN(d.getTime())) return '';
  // A date that doesn't exist (2026-02-31) rolls over to the next month instead of failing.
  if (toDateInput(d) !== date) return '';
  return d.toISOString();
}

/** "Pay (Rs, per worker)" / "Pay (Rs, per day)" — the edit form's Pay label. */
export function editPayLabel(p) {
  return `Pay (Rs, ${PER_UNIT[p.payRateUnit] || 'per worker'})`;
}

/**
 * Which editable fields the form now differs on, as the PATCH body. Only these are sent;
 * the server decides what each change means.
 */
export function editChanges(posting, form) {
  const changes = {};
  if (form.title.trim() !== posting.title) changes.title = form.title.trim();
  if (posting.payKind !== 'UNPAID' && form.payAmount !== '' && Number(form.payAmount) !== Number(posting.payAmount)) {
    changes.payAmount = Number(form.payAmount);
  }
  if (form.workersNeeded !== '' && Number(form.workersNeeded) !== Number(posting.workersNeeded)) {
    changes.workersNeeded = Number(form.workersNeeded);
  }
  if (posting.arrangementType !== 'GIG' && form.schedule.trim() !== (posting.schedule || '')) {
    changes.schedule = form.schedule.trim();
  }
  const startAt = combineStart(form.startDate, form.startTime);
  if (startAt && new Date(startAt).getTime() !== new Date(posting.startAt).getTime()) changes.startAt = startAt;
  return changes;
}

/** "Start time changed from 5:00 AM." — 2.11e `editedNote`; one line per changed material field. */
export function editedNotes(posting, changes) {
  const notes = [];
  if (changes.startAt) {
    const before = new Date(posting.startAt);
    const sameDay = toDateInput(changes.startAt) === toDateInput(before);
    notes.push(sameDay ? `Start time changed from ${formatTime(before)}.` : `Start changed from ${formatStartFull(before)}.`);
  }
  if (changes.payAmount != null) notes.push(`Pay changed from ${formatLKR(posting.payAmount)}.`);
  if (changes.workersNeeded != null) notes.push(`Workers needed changed from ${posting.workersNeeded}.`);
  if (changes.schedule != null) notes.push('Schedule changed.');
  return notes;
}

/** The change types a worker has to re-confirm (FR-POST-11 / FR-ENG-09); title is minor. */
export function hasMaterialChange(changes) {
  return ['payAmount', 'workersNeeded', 'schedule', 'startAt'].some((k) => changes[k] != null);
}

/**
 * FR-ENG-09: an engaged worker has the shorter of 48 hours and half the time left before
 * the start to re-confirm (database-schema.md, MaterialChangeRequest.deadline).
 * @returns {Date}
 */
export function reconfirmDeadline(startAt, now = Date.now()) {
  const left = Math.max(0, new Date(startAt).getTime() - now);
  return new Date(now + Math.min(48 * 60 * 60 * 1000, left / 2));
}

/** 2.11e2's ConfirmDialog body: what moves, the re-confirm deadline, who else is told. */
export function saveDialogBody(posting, changes, now = Date.now()) {
  const parts = [];
  if (changes.startAt) parts.push(`The start time moves to ${formatTime(new Date(changes.startAt))} and urgency is re-checked.`);
  if (changes.payAmount != null) parts.push(`Pay changes to ${formatLKR(changes.payAmount)}.`);
  if (changes.workersNeeded != null) parts.push(`Workers needed changes to ${changes.workersNeeded}.`);
  if (changes.schedule != null) parts.push('The schedule changes.');
  if (changes.title != null && parts.length === 0) parts.push('The title changes.');

  if (hasMaterialChange(changes)) {
    const start = changes.startAt || posting.startAt;
    // The worker's name isn't in the posting the server returns, so this says "each engaged worker".
    parts.push(
      `Each engaged worker has until ${formatStartFull(reconfirmDeadline(start, now))} to re-confirm — if they don't accept by then, that engagement moves into cancellation.`,
    );
    const waiting = posting.pendingApplicantCount ?? 0;
    if (waiting > 0) {
      parts.push(`The ${plural(waiting, 'pending applicant')} ${waiting === 1 ? 'is' : 'are'} told ${changes.startAt ? 'the new time' : 'what changed'}.`);
    }
  }
  return parts.join(' ');
}

// 2.11e `materialChangeWarning` body, word for word.
export const MATERIAL_CHANGE_WARNING =
  "Changing pay, the start date or time, the location, the number of workers or the category asks each engaged worker to re-confirm. If they don't accept in time, that engagement moves into cancellation.";

// 2.11pe / 2.11de `applyNote`, word for word.
export const APPLY_NOTE =
  'No one is engaged yet, so changes apply as soon as you save. Save stays off until you change something; anyone who has applied is told what changed.';

// 2.11c `pausedNote`, word for word.
export const PAUSED_NOTE =
  "Editing is paused until the re-confirmation is answered. Withdraw isn't available once a place is filled — to end an engagement, cancel it from Engagements.";

/**
 * 2.11c `changeNote`: what changed and when the worker must answer. The pending request's
 * `changeSummary` is Engagement's JSON (its keys aren't fixed in database-schema.md), so only
 * the deadline — a real column — is always shown; the start time is named when the summary has one.
 */
export function changeNote(request) {
  if (!request) return '';
  const start = request.changeSummary?.startAt ?? request.changeSummary?.startTime;
  const what = start ? `Start time changed to ${formatTime(new Date(start))} · ` : '';
  return `${what}Each engaged worker has until ${formatStartFull(request.deadline)} to re-confirm — see responses`;
}
