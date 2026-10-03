// posting.service.js
// Business logic + data access for gig postings. Controllers call only this
// layer, never prisma directly, so the rules stay in one place.

import prisma from '../../lib/prisma.js';
import AppError from '../../utils/AppError.js';
import { computeIsUrgent } from './posting.urgency.js';
import { sanitizePostingLocation } from './posting.location.js';
import { resolvePendingApplicants, notifyPendingApplicantsOfChange } from './posting.applicants.js';
import { expireDuePostings } from './posting.expiry.js';
import { requestReconfirmation } from './posting.reconfirm.js';
import { notifyNewGigPosted } from './posting.notify.js';

const DAY_MS = 24 * 60 * 60 * 1000;

// FR-POST-12: what the employer is told when Withdraw is refused after a fill.
// It names the two actions that do apply (lowering workers needed is a material
// change, FR-ENG-09; cancelling an Engagement is FR-ENG-05/06). Same wording as
// the prototype's `withdrawNote` on screen 2.11.
export const WITHDRAW_AFTER_FILL_MESSAGE =
  "Withdraw isn't available once a place is filled. To stop hiring, lower Workers needed in Edit posting; to end an engagement, cancel it from Engagements.";

// FR-DISPUTE-02 / prototype 2.11g: withdrawal is paused while YouthLink reviews a hidden posting.
export const WITHDRAW_HIDDEN_MESSAGE =
  'YouthLink is reviewing this posting. Withdrawal is paused until the review ends.';

// The owner's list and detail show "2 applicants waiting" (Pending only), and a
// withdrawn card says "no one had applied" (nobody, ever) — so both counts are
// needed. Prisma can't filter and total the same relation in one _count, so this
// pulls just each application's status and counts in JS; the rows themselves
// are never sent to the client.
const WITH_APPLICATION_STATUSES = { applications: { select: { status: true } } };

/** Replace the `applications` rows with `pendingApplicantCount` and `applicantCount`. */
function withApplicantCounts(posting) {
  if (!posting) return posting;
  const { applications = [], ...rest } = posting;
  return {
    ...rest,
    pendingApplicantCount: applications.filter((a) => a.status === 'PENDING').length,
    applicantCount: applications.length,
  };
}

/**
 * Who the posting is published as (FR-POST-16): the employer's own account setting, copied
 * onto the posting so later account changes don't rewrite postings already published
 * (FR-ACC-02). Read here, never taken from the request — otherwise an employer could post
 * under a business name that isn't theirs. An employer with no setting posts as an individual.
 */
async function postedAsFromAccount(employerId) {
  const account = await prisma.user.findUnique({
    where: { id: employerId },
    select: { postingAsType: true, businessName: true, businessBio: true },
  });
  const isBusiness = account?.postingAsType === 'BUSINESS';
  return {
    postedAsType: isBusiness ? 'BUSINESS' : 'INDIVIDUAL',
    postedBusinessName: isBusiness ? account.businessName?.trim() || null : null,
    postedBusinessBio: isBusiness ? account.businessBio?.trim() || null : null,
  };
}

/**
 * Creates a new gig posting for the given employer.
 * Assumes `data` has already passed posting.validators.js.
 */
export async function createGigPosting(employerId, data) {
  const postedAs = await postedAsFromAccount(employerId);
  const startAt = new Date(data.startAt);
  const createdAt = new Date();
  const posting = await prisma.gigPosting.create({
    data: {
      employerId,
      title: data.title.trim(),
      description: data.description.trim(),
      category: data.category,
      arrangementType: data.arrangementType,
      payKind: data.payKind,
      // FR-POST-04: the amount applies per worker and is only stored when the
      // pay kind has one (not UNPAID); the unit only for a RATE. Anything else
      // the client sent alongside is dropped rather than persisted.
      payAmount: data.payKind !== 'UNPAID' && data.payAmount != null ? data.payAmount : null,
      payRateUnit: data.payKind === 'RATE' ? data.payRateUnit : null,
      ...postedAs,
      locationAddress: data.locationAddress.trim(),
      locationLat: Number(data.locationLat),
      locationLng: Number(data.locationLng),
      locationAreaLabel: data.locationAreaLabel.trim(),
      workersNeeded: data.workersNeeded != null ? Number(data.workersNeeded) : 1,
      startAt,
      // FR-POST-13: a Gig expires when it starts; a Part-time job or Internship 30 days
      // after it was posted. Applied by posting.expiry.js.
      expiresAt: data.arrangementType === 'GIG' ? startAt : new Date(createdAt.getTime() + 30 * DAY_MS),
      schedule: data.schedule?.trim() || null,
      // FR-POST-07: always derived from startAt — never taken from client input,
      // even if data.isUrgent was sent. No manual override.
      isUrgent: computeIsUrgent(data.startAt),
      // FR-POST-18: status defaults to OPEN and filledCount to 0 (schema).
    },
  });

  // FR-POST-10: the alert to matching workers must never fail a posting that is already saved.
  try {
    await notifyNewGigPosted(posting.id);
  } catch (error) {
    console.error('Posting created, but the new-gig notification failed:', error);
  }
  return posting;
}

/**
 * One posting, as the given viewer may see it.
 *
 * FR-POST-08: the precise address is redacted for everyone except the owner
 * and a selected worker. The owner also gets the applicant counts.
 *
 * @returns {Promise<object|null>} null when there is no such posting
 */
export async function getGigPostingById(id, viewerUserId = null) {
  // FR-POST-13: close anything that is due first, so the status read below is current.
  await expireDuePostings();
  const posting = await prisma.gigPosting.findUnique({
    where: { id },
    include: {
      ...WITH_APPLICATION_STATUSES,
      // The two fields sanitizePostingLocation needs to spot a selected worker, plus the name
      // the owner's screen shows for an engaged worker (2.11c, 2.11e2, 2.11f).
      engagements: { select: { workerId: true, status: true, worker: { select: { legalName: true } } } },
      // FR-ENG-09: an edit waiting on a worker's re-confirmation (prototype 2.11c). Read-only
      // here — the table belongs to Engagement, which writes and resolves the request.
      materialChangeRequests: {
        where: { status: 'PENDING' },
        select: { deadline: true, changeSummary: true },
        orderBy: { proposedAt: 'desc' },
        take: 1,
      },
    },
  });
  if (!posting) return null;

  const isOwner = posting.employerId === viewerUserId;
  // Hidden pending review (FR-DISPUTE-02): out of everyone's sight but its owner's, so to anyone
  // else it simply doesn't exist. A withdrawn or expired posting stays readable by id on purpose —
  // a worker who applied still needs to open it to see what happened.
  if (posting.autoHiddenAt && !isOwner) return null;
  const { materialChangeRequests, ...withoutRequests } = posting;
  const sanitized = sanitizePostingLocation(withApplicantCounts(withoutRequests), viewerUserId);
  if (isOwner) {
    sanitized.engagedWorkers = (posting.engagements ?? [])
      .filter((e) => e.status !== 'CANCELLED')
      .map((e) => ({ legalName: e.worker?.legalName }));
    sanitized.pendingChangeRequest = materialChangeRequests?.[0] ?? null;
  } else {
    // Applicant numbers are the owner's business, not a browsing worker's.
    delete sanitized.pendingApplicantCount;
    delete sanitized.applicantCount;
  }
  return sanitized;
}

/** The employer's own postings, newest first, each with its applicant counts. */
export async function listGigPostingsByEmployer(employerId) {
  await expireDuePostings();
  // FR-POST-13 (amended 2026-09-24): an Open posting always shows; a closed one shows for
  // 30 days after it closed. There is no "closedAt" column, so the close time is
  // withdrawnAt (Withdrawn), expiresAt (Expired) or updatedAt (Filled).
  const since = new Date(Date.now() - 30 * DAY_MS);
  const postings = await prisma.gigPosting.findMany({
    where: {
      employerId,
      OR: [
        { status: 'OPEN' },
        { status: 'WITHDRAWN', withdrawnAt: { gte: since } },
        { status: 'EXPIRED', expiresAt: { gte: since } },
        { status: 'FILLED', updatedAt: { gte: since } },
      ],
    },
    orderBy: { createdAt: 'desc' },
    include: WITH_APPLICATION_STATUSES,
  });
  return postings.map(withApplicantCounts);
}

/**
 * FR-POST-12 — withdraw a posting. Allowed only while it is Open and nothing is
 * filled; distinct from cancelling an Engagement.
 *
 * The check and the change are ONE conditional UPDATE, not a read followed by a
 * write: if a selection fills the first slot between the employer opening the
 * dialog and confirming it, `filledCount: 0` no longer matches, nothing is
 * updated, and the withdrawal is refused — never a posting that is withdrawn
 * with a worker already engaged. (Prisma's $transaction alone would not give
 * this guarantee; see the note on row locking in AGENTS.md.)
 *
 * @throws {AppError} 404 when it isn't the caller's posting, 409 when it can't be withdrawn
 */
export async function withdrawGigPosting(employerId, id) {
  await expireDuePostings();
  // A posting that isn't yours is reported as not found, so ids can't be probed.
  const existing = await prisma.gigPosting.findUnique({ where: { id }, select: { employerId: true } });
  if (!existing || existing.employerId !== employerId) {
    throw AppError.notFound('Posting not found.');
  }

  const { count } = await prisma.gigPosting.updateMany({
    where: { id, employerId, status: 'OPEN', filledCount: 0, autoHiddenAt: null },
    data: { status: 'WITHDRAWN', withdrawnAt: new Date() },
  });

  if (count === 0) {
    // Nothing matched — find out why so the employer is told the right thing.
    const current = await prisma.gigPosting.findUnique({
      where: { id },
      select: { status: true, filledCount: true, autoHiddenAt: true },
    });
    // 2.11g: while a posting is hidden for review, withdrawal is paused like editing.
    if (current.autoHiddenAt) throw AppError.conflict(WITHDRAW_HIDDEN_MESSAGE);
    if (current.filledCount > 0) throw AppError.conflict(WITHDRAW_AFTER_FILL_MESSAGE);
    throw AppError.conflict('This posting is no longer open, so it cannot be withdrawn.');
  }

  // FR-POST-12 criterion 3 / FR-APPLY-09: Pending applicants become Not selected
  // and are told. A no-op until YL-174 lands — see posting.applicants.js.
  await resolvePendingApplicants(id, 'WITHDRAWN');

  return getGigPostingById(id, employerId);
}

// ---------------------------------------------------------------------------
// FR-POST-11 — Posting editing
// ---------------------------------------------------------------------------

// The fields the Edit posting screen (2.11pe / 2.11de / 2.11e) offers. Title is a minor
// change; pay, timing (start, schedule) and workers needed are material (FR-POST-11).
const MATERIAL_FIELDS = ['payAmount', 'startAt', 'schedule', 'workersNeeded'];
const EDITABLE_FIELDS = ['title', ...MATERIAL_FIELDS];

export const EDIT_REFUSED_MESSAGES = {
  closed: 'Only an open posting can be edited.',
  hidden: 'YouthLink is reviewing this posting. Editing is paused until the review ends.',
  // One re-confirmation at a time (prototype 2.11c disables Edit while one is waiting).
  reconfirmPending:
    'An earlier change is still waiting for the engaged worker to re-confirm. You can edit again once they respond.',
  changedMeanwhile: 'This posting changed while you were editing. Open it again to see how it is now.',
};

/** The editable values that differ from what is stored, as `{ field: newValue }`. */
function changedEditFields(existing, data) {
  const changes = {};
  for (const field of EDITABLE_FIELDS) {
    if (data[field] === undefined) continue;
    let next = data[field];
    let current = existing[field];
    if (field === 'title' || field === 'schedule') {
      next = String(next ?? '').trim();
      current = String(current ?? '').trim();
    } else if (field === 'startAt') {
      next = new Date(next).getTime();
      current = new Date(current).getTime();
    } else {
      next = Number(next);
      current = Number(current);
    }
    if (next !== current) changes[field] = data[field];
  }
  return changes;
}

/**
 * FR-POST-11 — edit a posting's title, pay, workers needed, start or schedule.
 * Assumes `data` has passed updateGigPostingValidators.
 *
 * Before any slot fills every change applies at once. After a fill a material change
 * (pay, timing, workers needed) is saved together with a re-confirmation request for each
 * engaged worker (posting.reconfirm.js), in ONE transaction: both happen or neither does.
 * Only one re-confirmation can be waiting at a time. A title change is always allowed.
 *
 * The write is ONE conditional UPDATE keyed on the fill count that was read: if a
 * selection fills a slot between the read and the write, nothing matches and the edit
 * is refused, never applied as "no re-confirmation needed" to a posting that now has
 * an engaged worker. (Same reasoning as withdrawGigPosting.)
 *
 * @throws {AppError} 404 not the caller's posting, 400 a rejected field, 409 it can't be edited now
 */
export async function updateGigPosting(employerId, id, data) {
  await expireDuePostings();
  const existing = await prisma.gigPosting.findUnique({ where: { id } });
  if (!existing || existing.employerId !== employerId) {
    throw AppError.notFound('Posting not found.');
  }
  if (existing.status !== 'OPEN') throw AppError.conflict(EDIT_REFUSED_MESSAGES.closed);
  if (existing.autoHiddenAt) throw AppError.conflict(EDIT_REFUSED_MESSAGES.hidden);

  const changes = changedEditFields(existing, data);
  const changedMaterial = Object.keys(changes).filter((f) => MATERIAL_FIELDS.includes(f));
  if (Object.keys(changes).length === 0) return getGigPostingById(id, employerId);

  const update = {};
  if (changes.title !== undefined) update.title = changes.title.trim();
  if (changes.payAmount !== undefined) {
    // Only a pay kind that carries an amount can have one edited.
    if (existing.payKind === 'UNPAID') throw AppError.badRequest('Some details need fixing.', { payAmount: 'This posting is unpaid, so it has no pay amount.' });
    update.payAmount = Number(changes.payAmount);
  }
  if (changes.workersNeeded !== undefined) update.workersNeeded = Number(changes.workersNeeded);
  if (changes.schedule !== undefined) {
    if (existing.arrangementType === 'GIG') throw AppError.badRequest('Some details need fixing.', { schedule: 'A one-off gig has no schedule.' });
    update.schedule = changes.schedule.trim();
  }
  if (changes.startAt !== undefined) {
    update.startAt = new Date(changes.startAt);
    // FR-POST-07: urgency is re-derived from the new start, never chosen.
    update.isUrgent = computeIsUrgent(changes.startAt);
    // FR-POST-13: a Gig expires at its start, so moving the start moves the expiry.
    if (existing.arrangementType === 'GIG') update.expiresAt = update.startAt;
  }

  // The conditional write; `db` is the transaction client when a re-confirmation goes with it.
  const applyEdit = async (db) => {
    const { count } = await db.gigPosting.updateMany({
      where: { id, employerId, status: 'OPEN', autoHiddenAt: null, filledCount: existing.filledCount },
      data: update,
    });
    if (count === 0) throw AppError.conflict(EDIT_REFUSED_MESSAGES.changedMeanwhile);
  };

  if (existing.filledCount > 0 && changedMaterial.length > 0) {
    const materialChanges = Object.fromEntries(changedMaterial.map((f) => [f, changes[f]]));
    await prisma.$transaction(async (tx) => {
      const waiting = await tx.materialChangeRequest.count({ where: { gigPostingId: id, status: 'PENDING' } });
      if (waiting > 0) throw AppError.conflict(EDIT_REFUSED_MESSAGES.reconfirmPending);
      await applyEdit(tx);
      await requestReconfirmation(
        { posting: existing, changes: materialChanges, newStartAt: update.startAt ?? existing.startAt },
        tx,
      );
    });
  } else {
    await applyEdit(prisma);
  }

  // Lowering Workers needed to the fill count makes the posting Filled (FR-POST-18); a
  // posting that stops accepting applications resolves its Pending applicants (FR-APPLY-09).
  if (update.workersNeeded !== undefined) {
    await syncPostingStatus(id);
    if (computeFillStatus(existing.filledCount, update.workersNeeded) === 'FILLED') {
      await resolvePendingApplicants(id, 'FILLED');
    }
  }
  // Anyone who has applied is told what changed (a no-op until YL-174 — posting.applicants.js).
  if (changedMaterial.length > 0) await notifyPendingApplicantsOfChange(id, changedMaterial);

  return getGigPostingById(id, employerId);
}

// ---------------------------------------------------------------------------
// FR-POST-18 — Open / Filled status
// ---------------------------------------------------------------------------

/**
 * The status a posting's fill count implies: Filled once every slot has a
 * selected worker, otherwise Open. Pure — the rule, separate from the write.
 */
export function computeFillStatus(filledCount, workersNeeded) {
  return filledCount >= workersNeeded ? 'FILLED' : 'OPEN';
}

/**
 * Bring a posting's status in line with its fill count. Called by whichever
 * module changes `filledCount` or `workersNeeded` — Applying & Selection after a
 * selection, Engagement when a slot reopens (a cancelled or early-ended
 * Engagement), Posting itself when workers needed is lowered by an edit — so the
 * rule lives in one place and nobody re-derives it.
 *
 * Only Open and Filled postings move: Withdrawn and Expired are terminal and are
 * never reopened by a fill count. It is a single UPDATE that compares the two
 * columns in the database, so it can't act on a stale read. Pass a transaction
 * client as `db` to run inside the caller's transaction.
 *
 * @param {string} postingId
 * @param {import('../../../generated/prisma/client').PrismaClient} [db]
 */
export async function syncPostingStatus(postingId, db = prisma) {
  await db.$executeRaw`
    UPDATE "GigPosting"
    SET "status" = (CASE WHEN "filledCount" >= "workersNeeded" THEN 'FILLED' ELSE 'OPEN' END)::"GigStatus",
        "updatedAt" = now()
    WHERE "id" = ${postingId}
      AND "status" IN ('OPEN', 'FILLED')`;
}
