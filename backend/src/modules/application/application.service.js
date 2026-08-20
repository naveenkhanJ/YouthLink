/**
 * Applying & Selection services — business rules and data access.
 *
 * Epic: FR-APPLY  ·  Owner: Naveenkhan
 *
 * This is where the acceptance criteria in docs/requirements.md are actually enforced. It uses
 * the one shared Prisma client (../../lib/prisma.js) and reuses the Gig Posting module's own rules
 * for a posting's status (syncPostingStatus, computeFillStatus, expireDuePostings) by import, so a
 * rule about postings lives in one place.
 *
 * ROW LOCKING. Every action that changes an application's state — apply, withdraw, select,
 * decline, and the automatic Not-selected resolution — first takes a lock on the POSTING row with
 * `SELECT … FOR UPDATE` inside its transaction, then re-reads what it decides on. Prisma's
 * $transaction alone does not stop two requests reading the same row before either writes (see
 * AGENTS.md, "Prisma's $transaction alone does not give you row-level locking"). Locking the
 * posting makes everything that happens to one posting's applications run one at a time, which
 * closes the races the end-to-end review found: six parallel applies by one worker made two rows,
 * and a double tap on Select answered "That value is already in use". The lock is always the
 * posting's, so two actions can never wait on each other in opposite orders.
 */
import { randomInt } from "node:crypto";
import prisma from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";
import { syncPostingStatus, computeFillStatus, getGigPostingById } from "../posting/posting.service.js";
import { expireDuePostings } from "../posting/posting.expiry.js";
import { completionRateFromRecords, revealedRatingsWhere } from "../rating/rating.service.js";
import {
  ratingStats,
  tierFor,
  compareApplicants,
  describeEndorsers,
} from "./application.trust.js";
import {
  applicationReceived,
  applicationSelected,
  applicationDeclined,
  applicationNotSelected,
  applicationTermsChanged,
} from "./application.notifications.js";

export const NOTE_MAX_LENGTH = 300;
const DAY_MS = 24 * 60 * 60 * 1000;

// FR-APPLY-12 (amended 2026-09-24): a decided or withdrawn application stays on the worker's
// list for 30 days after it resolved; a pending one always shows.
export const RESOLVED_WINDOW_DAYS = 30;

// The reasons a posting stops accepting applications (FR-APPLY-09): it filled (FR-POST-18),
// expired (FR-POST-13) or its employer withdrew it (FR-POST-12).
export const RESOLVE_REASONS = ["WITHDRAWN", "EXPIRED", "FILLED"];

// The material fields FR-POST-11 lists that this module can describe to a pending applicant.
const MATERIAL_FIELDS = ["startAt", "payAmount", "workersNeeded", "schedule"];

// User-facing messages: full sentences with a full stop (docs/decisions.md, 2026-08-27).
export const MESSAGES = {
  postingNotFound: "This posting could not be found.",
  applicationNotFound: "This application could not be found.",
  // 3.12g's own caption for a posting under review.
  postingPaused: "Applications are paused while this posting is reviewed.",
  postingClosed: "This posting is no longer accepting applications.",
  alreadyApplied: "You have already applied to this posting.",
  noteTooLong: `Your note can be at most ${NOTE_MAX_LENGTH} characters.`,
  onlyPendingWithdrawn: "Only a pending application can be withdrawn.",
  onlyPendingSelected: "Only a pending application can be selected.",
  onlyPendingDeclined: "Only a pending application can be declined.",
  postingFull: "Every place on this posting is already filled.",
  postingClosedForSelection: "This posting has closed, so no one else can be selected.",
  notYourPosting: "Only the employer who posted this gig can do that.",
};

/**
 * Lock one posting's row until the surrounding transaction ends (see ROW LOCKING above).
 * @param {object} tx - the transaction client
 * @param {string} gigPostingId
 */
async function lockPosting(tx, gigPostingId) {
  await tx.$queryRaw`SELECT "id" FROM "GigPosting" WHERE "id" = ${gigPostingId} FOR UPDATE`;
}

/**
 * FR-POST-13's contract for other modules: a posting is live only while its status is OPEN AND
 * its expiry has not passed — the sweep can lag a few minutes behind the clock.
 */
function isPastExpiry(posting, now = new Date()) {
  return Boolean(posting.expiresAt) && new Date(posting.expiresAt).getTime() <= now.getTime();
}

/** The name the worker knows the employer by: the business name when it posts as a Business. */
function employerDisplayName(posting, employer) {
  if (posting.postedAsType === "BUSINESS" && posting.postedBusinessName) return posting.postedBusinessName;
  return employer?.legalName ?? "";
}

/**
 * Why a Not-selected application was closed, read from its posting (FR-APPLY-09). The application
 * row has no reason column, so the posting's own end state is the record of it.
 */
function notSelectedReason(posting) {
  if (posting.status === "WITHDRAWN") return "WITHDRAWN";
  if (posting.status === "EXPIRED") return "EXPIRED";
  return "FILLED";
}

/**
 * FR-ENG-02: an Unpaid internship has no payment checkpoint — arrival and completion only.
 * Every other engagement has all three.
 */
function hasPaymentCheckpoint(posting) {
  return !(posting.arrangementType === "INTERNSHIP" && posting.payKind === "UNPAID");
}

/**
 * FR-ENG-01: a distinct 6-digit numeric code for each checkpoint — arrival, completion and, when
 * the engagement has one, payment. Generated here, at selection, because selection is when the
 * Engagement is created (FR-APPLY-06) and FR-ENG-01 amended 2026-09-24 gives each Engagement one
 * set of codes for its whole life. `crypto.randomInt` is a cryptographically secure source, so a
 * code cannot be predicted from an earlier one. The codes are kept different from each other so a
 * code from one checkpoint can never also be the right answer at another.
 *
 * @param {boolean} withPayment
 * @param {(min: number, max: number) => number} [random] - injectable for tests
 * @returns {{ arrivalCode: string, completionCode: string, paymentCode: string|null }}
 */
export function generateCheckpointCodes(withPayment, random = randomInt) {
  const needed = withPayment ? 3 : 2;
  const codes = [];
  while (codes.length < needed) {
    const code = String(random(0, 1_000_000)).padStart(6, "0"); // 000000-999999
    if (!codes.includes(code)) codes.push(code);
  }
  return { arrivalCode: codes[0], completionCode: codes[1], paymentCode: withPayment ? codes[2] : null };
}

// ---------------------------------------------------------------------------
// FR-APPLY-02 — Apply
// ---------------------------------------------------------------------------

/**
 * FR-APPLY-02 — one application per worker per posting, entering Pending. A WITHDRAWN application
 * does not count (FR-APPLY-03 lets the worker apply again while the posting is open); a declined
 * or not-selected one does — "this can't be undone for this posting" (4.9).
 *
 * Refused when the posting is hidden pending review (FR-DISPUTE-02), closed, or past its expiry.
 * The employer is told a new application arrived (FR-NOTIF-04, 3.10ea).
 *
 * @param {{ workerId: string, gigPostingId: string, note?: string|null }} input
 */
async function apply({ workerId, gigPostingId, note }) {
  if (note != null && typeof note !== "string") {
    throw AppError.badRequest("Some details need fixing.", { note: "The note must be text." });
  }
  // An empty or whitespace-only note is no note: it is optional (FR-APPLY-02 criterion 2).
  const cleanNote = (note ?? "").trim();
  if (cleanNote.length > NOTE_MAX_LENGTH) {
    throw AppError.badRequest("Some details need fixing.", { note: MESSAGES.noteTooLong });
  }

  // Close anything that is due first, so a posting past its start reads as Expired.
  await expireDuePostings();

  return prisma.$transaction(async (tx) => {
    await lockPosting(tx, gigPostingId);
    const posting = await tx.gigPosting.findUnique({
      where: { id: gigPostingId },
      select: { id: true, title: true, employerId: true, status: true, expiresAt: true, autoHiddenAt: true },
    });
    if (!posting) throw AppError.notFound(MESSAGES.postingNotFound);
    if (posting.autoHiddenAt) throw AppError.conflict(MESSAGES.postingPaused);
    if (posting.status !== "OPEN" || isPastExpiry(posting)) throw AppError.conflict(MESSAGES.postingClosed);

    // Read under the lock: a second request from the same worker waits above until this one
    // commits, then finds this application here.
    const existing = await tx.application.findFirst({
      where: { gigPostingId, workerId, status: { not: "WITHDRAWN" } },
      select: { id: true },
    });
    if (existing) throw AppError.conflict(MESSAGES.alreadyApplied);

    const application = await tx.application.create({
      data: { gigPostingId, workerId, note: cleanNote || null },
    });

    const worker = await tx.user.findUnique({ where: { id: workerId }, select: { legalName: true } });
    await tx.notification.create({
      data: applicationReceived({
        employerId: posting.employerId,
        application,
        posting,
        workerName: worker?.legalName ?? "",
      }),
    });

    return application;
  });
}

// ---------------------------------------------------------------------------
// FR-APPLY-03 — Withdraw
// ---------------------------------------------------------------------------

/**
 * FR-APPLY-03 — the worker withdraws their own Pending application; the pool stops counting it.
 * Someone else's application answers "not found", so ids cannot be probed.
 *
 * No notification is written to the employer: the schema's NotificationType has no value for a
 * withdrawal and no requirement asks for one (see the report on APPLY-E2E-22).
 */
async function withdraw({ applicationId, workerId }) {
  const found = await prisma.application.findUnique({
    where: { id: applicationId },
    select: { workerId: true, gigPostingId: true },
  });
  if (!found || found.workerId !== workerId) throw AppError.notFound(MESSAGES.applicationNotFound);

  return prisma.$transaction(async (tx) => {
    await lockPosting(tx, found.gigPostingId);
    const application = await tx.application.findUnique({ where: { id: applicationId } });
    if (application.status !== "PENDING") throw AppError.conflict(MESSAGES.onlyPendingWithdrawn);
    return tx.application.update({
      where: { id: applicationId },
      data: { status: "WITHDRAWN", withdrawnAt: new Date() },
    });
  });
}

// ---------------------------------------------------------------------------
// FR-APPLY-04 / FR-APPLY-05 — the applicant pool
// ---------------------------------------------------------------------------

/**
 * FR-APPLY-04 / FR-APPLY-05 — the pool for the employer who owns the posting.
 *
 * Every application that was not withdrawn is listed (a withdrawn one leaves the pool,
 * FR-APPLY-03); selected, declined and not-selected rows stay "for your records" (4.5s, 4.5d,
 * 4.5x). Each row carries exactly what the 4.5 row and the 4.6 detail show: name, phone-verified,
 * rating average and count, completion rate and jobs, the active endorsements (count, and who
 * vouched for what), the note, and the tier. No dispute or case history is ever read here —
 * only aggregate figures (FR-APPLY-05 criterion 3). A selected applicant's phone is included,
 * because selection is what reveals it to the employer (FR-APPLY-07, 4.8).
 *
 * @returns {Promise<{ posting: object, applicants: object[] }>}
 */
async function getApplicantPool({ gigPostingId, employerId }) {
  // A posting past its expiry is closed first, so its pending applicants are resolved (4.5x).
  await expireDuePostings();

  const posting = await prisma.gigPosting.findUnique({
    where: { id: gigPostingId },
    select: {
      id: true,
      employerId: true,
      title: true,
      status: true,
      arrangementType: true,
      workersNeeded: true,
      filledCount: true,
      startAt: true,
      expiresAt: true,
      createdAt: true,
      autoHiddenAt: true,
    },
  });
  if (!posting) throw AppError.notFound(MESSAGES.postingNotFound);
  if (posting.employerId !== employerId) throw AppError.forbidden(MESSAGES.notYourPosting);

  const applications = await prisma.application.findMany({
    where: { gigPostingId, status: { not: "WITHDRAWN" } },
    include: {
      engagement: { select: { id: true, status: true } },
      worker: {
        select: {
          id: true,
          legalName: true,
          phone: true,
          phoneVerifiedAt: true,
          // FR-RATE-02 and FR-RATE-06: only revealed ratings that an Admin has not removed count —
          // the Ratings module's own definition of "revealed", so pool and profile agree.
          ratingsReceived: { where: revealedRatingsWhere(), select: { score: true } },
          completionRecords: { select: { outcome: true, weight: true } },
          endorsementsReceived: {
            where: { revokedAt: null },
            orderBy: { createdAt: "asc" },
            select: { attributes: true, endorser: { select: { legalName: true } } },
          },
        },
      },
    },
  });

  const rows = applications.map(({ worker, engagement, ...application }) => {
    const { ratingAverage, exactAverage, ratingCount } = ratingStats(worker.ratingsReceived);
    // FR-RATE-03, the Ratings module's one definition (weighted; null with no records).
    const { completionRate, jobCount } = completionRateFromRecords(worker.completionRecords);
    const endorsers = describeEndorsers(worker.endorsementsReceived);
    const endorsementCount = endorsers.length;
    return {
      applicationId: application.id,
      status: application.status,
      note: application.note,
      appliedAt: application.appliedAt,
      decidedAt: application.decidedAt,
      worker: {
        id: worker.id,
        displayName: worker.legalName,
        phoneVerified: Boolean(worker.phoneVerifiedAt),
        // FR-APPLY-07: the phone is revealed only by this worker's own selection.
        phone: application.status === "SELECTED" ? worker.phone : null,
      },
      tier: tierFor({ ratingCount, endorsementCount }),
      ratingAverage,
      ratingCount,
      completionRate,
      jobCount,
      endorsementCount,
      endorsers,
      engagement: engagement ? { id: engagement.id, status: engagement.status } : null,
      notSelectedReason: application.status === "NOT_SELECTED" ? notSelectedReason(posting) : null,
      exactAverage, // for the sort only, removed below
    };
  });

  rows.sort(compareApplicants);

  const { employerId: _owner, autoHiddenAt, ...postingFields } = posting;
  return {
    posting: { ...postingFields, isHidden: Boolean(autoHiddenAt) },
    applicants: rows.map(({ exactAverage: _exact, ...row }) => row),
  };
}

// ---------------------------------------------------------------------------
// FR-APPLY-09 — the automatic Not-selected resolution (YL-174)
// ---------------------------------------------------------------------------

/**
 * FR-APPLY-09 — every application still Pending on a posting that has stopped accepting
 * applications becomes Not selected, with `decidedAt`, and its applicant is told
 * (APPLICATION_NOT_SELECTED). Called by the Gig Posting module when a posting is withdrawn or
 * expires, and by select() below when the last place fills.
 *
 * Safe to call twice: the second call finds nothing Pending and resolves nothing, so nobody is
 * notified twice. It holds the posting lock while it reads and writes, so an application selected
 * or withdrawn at the same instant is either resolved here or not at all — never both.
 *
 * @param {string} gigPostingId
 * @param {"WITHDRAWN"|"EXPIRED"|"FILLED"} reason
 * @param {object} [db] - a transaction client to run inside (select() passes its own)
 * @returns {Promise<{ resolved: number }>}
 */
export async function resolvePendingApplicants(gigPostingId, reason, db = null) {
  if (!RESOLVE_REASONS.includes(reason)) {
    // A programming error in the caller, not something a user did.
    throw new TypeError(`resolvePendingApplicants: unknown reason "${reason}"`);
  }

  const run = async (tx) => {
    await lockPosting(tx, gigPostingId);
    const posting = await tx.gigPosting.findUnique({
      where: { id: gigPostingId },
      select: { id: true, title: true },
    });
    if (!posting) return { resolved: 0 };

    const pending = await tx.application.findMany({
      where: { gigPostingId, status: "PENDING" },
      select: { id: true, workerId: true },
    });
    if (pending.length === 0) return { resolved: 0 };

    await tx.application.updateMany({
      where: { id: { in: pending.map((a) => a.id) }, status: "PENDING" },
      data: { status: "NOT_SELECTED", decidedAt: new Date() },
    });
    await tx.notification.createMany({
      data: pending.map((application) => applicationNotSelected({ application, posting, reason })),
    });
    return { resolved: pending.length };
  };

  return db ? run(db) : prisma.$transaction(run);
}

// ---------------------------------------------------------------------------
// FR-APPLY-06 / FR-APPLY-07 — Select
// ---------------------------------------------------------------------------

/**
 * FR-APPLY-06 — the employer selects one applicant, in any session, up to the number of workers
 * needed; each selection creates one independent Engagement with its own check-in codes
 * (FR-ENG-01, FR-ENG-02). FR-APPLY-07 — contacts are revealed at this worker's own selection
 * moment: `contactRevealedAt` is set now, and the employer gets the worker's phone back (4.8).
 *
 * The posting's fill count goes up by one and its status is brought in line by the Gig Posting
 * module's own rule (syncPostingStatus). When that fills the last place, every applicant still
 * Pending is resolved as Not selected in the same transaction (FR-APPLY-09, FR-POST-18).
 *
 * The response never carries the check-in codes: the payment code belongs to the worker, and the
 * Engagement screens show each party only the code it holds.
 */
async function select({ applicationId, employerId }) {
  await expireDuePostings();

  const found = await prisma.application.findUnique({
    where: { id: applicationId },
    select: { gigPostingId: true },
  });
  if (!found) throw AppError.notFound(MESSAGES.applicationNotFound);

  return prisma.$transaction(async (tx) => {
    await lockPosting(tx, found.gigPostingId);
    const application = await tx.application.findUnique({
      where: { id: applicationId },
      include: {
        worker: { select: { legalName: true, phone: true } },
        gigPosting: { include: { employer: { select: { legalName: true } } } },
      },
    });
    const posting = application.gigPosting;

    if (posting.employerId !== employerId) throw AppError.forbidden(MESSAGES.notYourPosting);
    if (application.status !== "PENDING") throw AppError.conflict(MESSAGES.onlyPendingSelected);
    if (posting.status === "FILLED" || posting.filledCount >= posting.workersNeeded) {
      throw AppError.conflict(MESSAGES.postingFull);
    }
    if (posting.status !== "OPEN" || isPastExpiry(posting)) {
      throw AppError.conflict(MESSAGES.postingClosedForSelection);
    }

    const now = new Date();
    await tx.application.update({
      where: { id: applicationId },
      data: { status: "SELECTED", decidedAt: now },
    });

    const withPayment = hasPaymentCheckpoint(posting);
    const codes = generateCheckpointCodes(withPayment);
    const engagement = await tx.engagement.create({
      data: {
        applicationId,
        gigPostingId: posting.id,
        workerId: application.workerId,
        employerId,
        contactRevealedAt: now,
        arrivalCode: codes.arrivalCode,
        completionCode: codes.completionCode,
        paymentCode: codes.paymentCode,
        // database-schema.md: null — not PENDING — when the payment checkpoint does not exist.
        paymentStatus: withPayment ? "PENDING" : null,
      },
      select: { id: true, status: true },
    });

    // Fill count first, then the Gig Posting module's own status rule, on this transaction.
    await tx.gigPosting.update({ where: { id: posting.id }, data: { filledCount: { increment: 1 } } });
    await syncPostingStatus(posting.id, tx);
    const filledCount = posting.filledCount + 1;
    const postingStatus = computeFillStatus(filledCount, posting.workersNeeded);

    await tx.notification.create({
      data: applicationSelected({
        application,
        posting,
        employerName: employerDisplayName(posting, posting.employer),
        engagementId: engagement.id,
      }),
    });

    let resolved = 0;
    if (postingStatus === "FILLED") {
      ({ resolved } = await resolvePendingApplicants(posting.id, "FILLED", tx));
    }

    return {
      engagementId: engagement.id,
      engagementStatus: engagement.status,
      applicationId,
      gigPostingId: posting.id,
      postingTitle: posting.title,
      filledCount,
      workersNeeded: posting.workersNeeded,
      postingStatus,
      resolvedAsNotSelected: resolved,
      worker: { id: application.workerId, displayName: application.worker.legalName, phone: application.worker.phone },
    };
  });
}

// ---------------------------------------------------------------------------
// FR-APPLY-08 — Decline
// ---------------------------------------------------------------------------

/**
 * FR-APPLY-08 — the employer declines one Pending applicant at any time, whatever places remain,
 * and the applicant is told at once (APPLICATION_DECLINED). No reason is attached.
 */
async function decline({ applicationId, employerId }) {
  const found = await prisma.application.findUnique({
    where: { id: applicationId },
    select: { gigPostingId: true },
  });
  if (!found) throw AppError.notFound(MESSAGES.applicationNotFound);

  return prisma.$transaction(async (tx) => {
    await lockPosting(tx, found.gigPostingId);
    const application = await tx.application.findUnique({
      where: { id: applicationId },
      include: { gigPosting: { select: { id: true, title: true, employerId: true } } },
    });
    if (application.gigPosting.employerId !== employerId) throw AppError.forbidden(MESSAGES.notYourPosting);
    if (application.status !== "PENDING") throw AppError.conflict(MESSAGES.onlyPendingDeclined);

    const updated = await tx.application.update({
      where: { id: applicationId },
      data: { status: "DECLINED", decidedAt: new Date() },
    });
    await tx.notification.create({
      data: applicationDeclined({ application, posting: application.gigPosting }),
    });
    return updated;
  });
}

// ---------------------------------------------------------------------------
// FR-APPLY-12 — the worker's own list
// ---------------------------------------------------------------------------

// Resolved rows follow the pending ones in the order every drawn list uses (4.3n, 4.3r, 4.3w):
// Selected, then Not selected, then Declined, then Withdrawn — the latest resolution first
// within each state.
const RESOLVED_ORDER = { SELECTED: 1, NOT_SELECTED: 2, DECLINED: 3, WITHDRAWN: 4 };

/** When a posting closes: its expiry, or — for an older row without one — the FR-POST-13 rule. */
function closesAt(posting) {
  if (posting.expiresAt) return new Date(posting.expiresAt);
  if (posting.arrangementType === "GIG") return new Date(posting.startAt);
  return new Date(new Date(posting.createdAt).getTime() + 30 * DAY_MS);
}

/**
 * FR-APPLY-12 — every pending application, and every decided or withdrawn one from the last 30
 * days (amended 2026-09-24), each with its posting and current state; a pending one with the date
 * its posting closes and, on a multi-slot posting, the fill status. Pending first, soonest closing
 * first. Postings past their expiry are closed first, so no application on a closed posting is
 * ever shown as Pending (criterion 4).
 *
 * The employer's phone and the address are deliberately not here: a selected application's life
 * continues on its Engagement (4.3r "Contact shared — see engagement").
 *
 * @param {{ workerId: string, now?: Date }} input
 */
async function getMyApplications({ workerId, now = new Date() }) {
  await expireDuePostings(now);
  const since = new Date(now.getTime() - RESOLVED_WINDOW_DAYS * DAY_MS);

  const applications = await prisma.application.findMany({
    where: {
      workerId,
      OR: [{ status: "PENDING" }, { decidedAt: { gte: since } }, { withdrawnAt: { gte: since } }],
    },
    include: {
      gigPosting: {
        select: {
          id: true,
          title: true,
          status: true,
          arrangementType: true,
          startAt: true,
          expiresAt: true,
          createdAt: true,
          workersNeeded: true,
          filledCount: true,
          postedAsType: true,
          postedBusinessName: true,
          employer: { select: { legalName: true } },
        },
      },
      engagement: { select: { id: true, status: true, cancelledByUserId: true } },
    },
  });

  const rows = applications.map(({ gigPosting, engagement, ...application }) => ({
    id: application.id,
    status: application.status,
    appliedAt: application.appliedAt,
    decidedAt: application.decidedAt,
    withdrawnAt: application.withdrawnAt,
    posting: {
      id: gigPosting.id,
      title: gigPosting.title,
      status: gigPosting.status,
      arrangementType: gigPosting.arrangementType,
      closesAt: closesAt(gigPosting),
      workersNeeded: gigPosting.workersNeeded,
      filledCount: gigPosting.filledCount,
      // 4.4's dialog names who stops seeing the application ("Saman Stores will no longer see it").
      employerName: employerDisplayName(gigPosting, gigPosting.employer),
    },
    engagement: engagement
      ? { id: engagement.id, status: engagement.status, cancelledByYou: engagement.cancelledByUserId === workerId }
      : null,
    notSelectedReason: application.status === "NOT_SELECTED" ? notSelectedReason(gigPosting) : null,
  }));

  rows.sort((a, b) => {
    const aPending = a.status === "PENDING";
    const bPending = b.status === "PENDING";
    if (aPending !== bPending) return aPending ? -1 : 1;
    if (aPending) return a.posting.closesAt.getTime() - b.posting.closesAt.getTime();
    if (a.status !== b.status) return RESOLVED_ORDER[a.status] - RESOLVED_ORDER[b.status];
    const resolvedTime = (row) => new Date(row.decidedAt ?? row.withdrawnAt ?? row.appliedAt).getTime();
    return resolvedTime(b) - resolvedTime(a);
  });

  return rows;
}

// ---------------------------------------------------------------------------
// FR-APPLY-01 — the listing detail a worker opens before applying (3.12)
// ---------------------------------------------------------------------------

/**
 * FR-APPLY-01 — what the job-seeker's listing detail shows: the posting at general-area precision
 * (FR-POST-08), the employer's trust signals (display name, business bio when it posts as a
 * Business, the phone-verified badge), and whether this worker already has a live application.
 *
 * The posting is read through the Gig Posting module's own getGigPostingById, which closes due
 * postings, hides a posting under review from everyone but its owner, and redacts the address.
 * Only the fields the screen needs are passed on.
 */
async function getListingDetail({ gigPostingId, workerId }) {
  const posting = await getGigPostingById(gigPostingId, workerId);
  if (!posting) throw AppError.notFound(MESSAGES.postingNotFound);

  const [employer, mine] = await Promise.all([
    prisma.user.findUnique({
      where: { id: posting.employerId },
      select: { legalName: true, phoneVerifiedAt: true },
    }),
    prisma.application.findFirst({
      where: { gigPostingId, workerId, status: { not: "WITHDRAWN" } },
      select: { id: true, status: true },
    }),
  ]);

  return {
    posting: {
      id: posting.id,
      title: posting.title,
      description: posting.description,
      category: posting.category,
      arrangementType: posting.arrangementType,
      payKind: posting.payKind,
      payAmount: posting.payAmount,
      payRateUnit: posting.payRateUnit,
      workersNeeded: posting.workersNeeded,
      filledCount: posting.filledCount,
      startAt: posting.startAt,
      schedule: posting.schedule,
      isUrgent: posting.isUrgent,
      status: posting.status,
      expiresAt: posting.expiresAt,
      locationAreaLabel: posting.locationAreaLabel,
    },
    employer: {
      displayName: employerDisplayName(posting, employer),
      postedAsType: posting.postedAsType,
      businessBio: posting.postedAsType === "BUSINESS" ? posting.postedBusinessBio : null,
      phoneVerified: Boolean(employer?.phoneVerifiedAt),
    },
    myApplication: mine,
  };
}

// ---------------------------------------------------------------------------
// FR-APPLY-10 — pending applicants told of a material change (YL-175)
// ---------------------------------------------------------------------------

/**
 * FR-APPLY-10 (amended 2026-09-23) — every applicant still Pending on the posting is told what
 * changed (APPLICATION_TERMS_CHANGED: "{title} changed" / "what changed · you can withdraw if it
 * no longer suits you"), before or after other places fill. Informed, not asked: an engaged worker
 * is asked to re-confirm through the Engagement module instead (MATERIAL_CHANGE, FR-ENG-09).
 *
 * Called by the Gig Posting module after an edit is saved, with the material fields it changed.
 *
 * @param {string} gigPostingId
 * @param {string[]} changedFields - e.g. ["payAmount", "startAt"]
 * @returns {Promise<{ notified: number }>}
 */
export async function notifyPendingApplicantsOfChange(gigPostingId, changedFields = []) {
  const material = (changedFields ?? []).filter((field) => MATERIAL_FIELDS.includes(field));
  if (material.length === 0) return { notified: 0 };

  const posting = await prisma.gigPosting.findUnique({
    where: { id: gigPostingId },
    select: {
      id: true,
      title: true,
      startAt: true,
      payKind: true,
      payAmount: true,
      payRateUnit: true,
      workersNeeded: true,
      schedule: true,
    },
  });
  if (!posting) return { notified: 0 };

  const pending = await prisma.application.findMany({
    where: { gigPostingId, status: "PENDING" },
    select: { id: true, workerId: true },
  });
  if (pending.length === 0) return { notified: 0 };

  await prisma.notification.createMany({
    data: pending.map((application) => applicationTermsChanged({ application, posting, changedFields: material })),
  });
  return { notified: pending.length };
}

export default {
  apply,
  withdraw,
  getApplicantPool,
  select,
  decline,
  getMyApplications,
  getListingDetail,
  resolvePendingApplicants,
  notifyPendingApplicantsOfChange,
};
