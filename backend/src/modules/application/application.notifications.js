/**
 * Applying & Selection — the Notification rows this module writes, and their wording.
 *
 * Epic: FR-APPLY  ·  Owner: Naveenkhan
 *
 * Every row carries the ids a screen needs to open the right place (gigPostingId, applicationId)
 * and the posting title. Where the prototype draws the notification (M3 3.10x, 3.10ea, 3.10n) the
 * payload also carries its `title` and `body` exactly as drawn, so the notification history shows
 * the same words whichever module renders it. Only types in the schema's NotificationType enum are
 * used — a value outside it makes Prisma reject the whole write.
 */

const TIME_ZONE = "Asia/Colombo"; // every date the product shows is Sri Lanka time

/**
 * "Sat 29 Aug 2026, 7:00 AM" — the prototype's full start format (3.10x "The start moved to
 * Sat 29 Aug 2026, 7:00 AM"), in Sri Lanka time whatever the server's own time zone is.
 * @param {Date|string} value
 */
export function formatStartFull(value) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: TIME_ZONE,
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
      .formatToParts(new Date(value))
      .map((p) => [p.type, p.value]),
  );
  return `${parts.weekday} ${parts.day} ${parts.month} ${parts.year}, ${parts.hour}:${parts.minute} ${parts.dayPeriod.toUpperCase()}`;
}

/** "Rs 6,000" — design-system.md §9: Rs, a space, thousands separators, no decimals. */
function formatRs(amount) {
  return `Rs ${Math.round(Number(amount)).toLocaleString("en-US")}`;
}

const PER_UNIT = { DAY: "per day", WEEK: "per week", MONTH: "per month" };

/** The worker-facing pay string of design-system.md §9 ("Rs 6,000 for the job", "Rs 1,800 per day"). */
export function payLine(posting) {
  const rs = formatRs(posting.payAmount ?? 0);
  const per = PER_UNIT[posting.payRateUnit];
  switch (posting.payKind) {
    case "RATE":
      return per ? `${rs} ${per}` : rs;
    case "PAID":
      return per ? `${rs} ${per}` : `${rs} for the job`;
    case "STIPEND":
      return per ? `${rs} stipend ${per}` : `${rs} stipend`;
    case "UNPAID":
      return "Unpaid";
    default: // FIXED_TOTAL
      return `${rs} for the job`;
  }
}

/**
 * What changed, for FR-APPLY-10's notification body. Only the start-time sentence is drawn
 * (3.10x: "The start moved to Sat 29 Aug 2026, 7:00 AM"); the other three follow the same
 * pattern for the other material fields FR-POST-11 lists. Several changes are joined with " · ".
 *
 * @param {object} posting - the posting as it is AFTER the edit
 * @param {string[]} changedFields - e.g. ["startAt", "payAmount"]
 */
export function describeChanges(posting, changedFields = []) {
  const sentences = [];
  if (changedFields.includes("startAt")) sentences.push(`The start moved to ${formatStartFull(posting.startAt)}`);
  if (changedFields.includes("payAmount")) sentences.push(`The pay changed to ${payLine(posting)}`);
  if (changedFields.includes("workersNeeded")) sentences.push(`Workers needed changed to ${posting.workersNeeded}`);
  if (changedFields.includes("schedule")) sentences.push(`The schedule changed to ${posting.schedule}`);
  return sentences.join(" · ");
}

/** FR-NOTIF-04 — the employer is told a new application arrived (3.10ea). */
export function applicationReceived({ employerId, application, posting, workerName }) {
  return {
    userId: employerId,
    type: "APPLICATION_RECEIVED",
    payload: {
      applicationId: application.id,
      gigPostingId: posting.id,
      postingTitle: posting.title,
      title: `New applicant for ${posting.title}`,
      body: workerName,
    },
  };
}

/** FR-APPLY-06 / FR-NOTIF-04 — the worker is told they were selected (3.10n). */
export function applicationSelected({ application, posting, employerName, engagementId }) {
  return {
    userId: application.workerId,
    type: "APPLICATION_SELECTED",
    payload: {
      applicationId: application.id,
      engagementId, // the row opens the engagement (A11)
      gigPostingId: posting.id,
      postingTitle: posting.title,
      title: `You're selected for ${posting.title}`,
      body: `Starts ${formatStartFull(posting.startAt)} · ${employerName}`,
    },
  };
}

/**
 * FR-APPLY-08 — the worker is told at once that they were declined. Its wording is not drawn
 * anywhere in the prototype, so the row carries data only; the notification history words it.
 */
export function applicationDeclined({ application, posting }) {
  return {
    userId: application.workerId,
    type: "APPLICATION_DECLINED",
    payload: { applicationId: application.id, gigPostingId: posting.id, postingTitle: posting.title },
  };
}

/**
 * FR-APPLY-09 — the worker is told their application was closed as Not selected, and why: the
 * posting filled, expired or was withdrawn. Not drawn either, so data only (with the reason).
 */
export function applicationNotSelected({ application, posting, reason }) {
  return {
    userId: application.workerId,
    type: "APPLICATION_NOT_SELECTED",
    payload: { applicationId: application.id, gigPostingId: posting.id, postingTitle: posting.title, reason },
  };
}

/**
 * FR-APPLY-10 (amended 2026-09-23) — a Pending applicant is told the posting changed:
 * type APPLICATION_TERMS_CHANGED, title "{title} changed", body "what changed · you can withdraw
 * if it no longer suits you". It opens the applicant's own list (FR-APPLY-12), so it carries
 * `opens: "applications"` for the notification history to route on.
 */
export function applicationTermsChanged({ application, posting, changedFields }) {
  return {
    userId: application.workerId,
    type: "APPLICATION_TERMS_CHANGED",
    payload: {
      applicationId: application.id,
      gigPostingId: posting.id,
      postingTitle: posting.title,
      changedFields,
      opens: "applications",
      title: `${posting.title} changed`,
      body: `${describeChanges(posting, changedFields)} · you can withdraw if it no longer suits you`,
    },
  };
}
