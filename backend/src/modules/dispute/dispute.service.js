/**
 * Reports & Disputes services — business rules and data access (the parties' side).
 *
 * Epic: FR-DISPUTE (user side)
 *
 * Implements:
 *   - FR-DISPUTE-01 / NFR-PRIV-05: the Report action on a posting, a profile, or an active
 *     engagement, with a reason from the fixed list and optional detail. The reporter's identity
 *     is never returned by any endpoint to anyone but the reporter.
 *   - FR-DISPUTE-02: three independent reports (distinct reporters, among those still queued)
 *     auto-hide the posting or profile pending review — silently: the owner is NOT notified at
 *     that moment (amendment A25).
 *   - FR-DISPUTE-03: openDisputeCase, the one way a dispute case opens from an engagement
 *     (unable to confirm, End Engagement "yes", stalled auto-flag). Called by the engagement module.
 *   - FR-DISPUTE-04 / FR-NOTIF-12: the respondent is told, and has 48 hours to respond once.
 *   - FR-DISPUTE-05: up to 3 images per party, 5 MB each, only while the window is open.
 *   - FR-DISPUTE-07: the case, as either party may see it.
 *
 * Out of scope here, deliberately: everything a Moderator or Admin does (FR-MOD-*, FR-ADM-*,
 * FR-DASH-*, FR-NOTIF-06). A case therefore stays Under review until staff act — that is the
 * correct state, not a gap. A Report is the queue entry itself: a REPORT-type DisputeCase is
 * created by a Moderator when a report "reaches the queue" (FR-DISPUTE-03), never at filing.
 */
import { randomUUID } from "crypto";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import prisma from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";
import { employerDisplayName } from "../engagement/engagement.rules.js";
import {
  AUTO_HIDE_THRESHOLD,
  EVIDENCE_MAX_BYTES,
  EVIDENCE_MAX_PER_PARTY,
  REPORT_DETAIL_MAX,
  REPORT_REASONS,
  REPORT_TARGETS,
  RESPONSE_WINDOW_MS,
  STATEMENT_MAX,
  canRespondToCase,
  caseViewerRole,
  currentCase,
  disputedCheckpoint,
  effectiveCaseStatus,
  evidenceWindowOpen,
  outcomeFavoursViewer,
} from "./dispute.rules.js";

/**
 * Where evidence files live: backend/uploads/ (git-ignored). DisputeEvidence.imageUrl stores the
 * path RELATIVE to this folder ("disputes/<caseId>/<file>"), so the folder can move without a
 * data migration.
 */
export const UPLOADS_ROOT = fileURLToPath(new URL("../../../uploads/", import.meta.url));

/** The image types FR-DISPUTE-05 evidence may be, with the extension each is stored under. */
const IMAGE_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const CONTENT_TYPE_BY_EXT = { jpg: "image/jpeg", png: "image/png", webp: "image/webp" };

// User-facing messages (house style: full sentences with periods). The two caps are 9.3's own
// words: "2 of 3 · up to 5MB each".
export const MESSAGES = {
  reportTarget: "Choose what you're reporting.",
  reportReason: "Choose a reason for the report.",
  reportDetailTooLong: `Details can be up to ${REPORT_DETAIL_MAX} characters.`,
  ownPosting: "You can't report your own posting.",
  ownProfile: "You can't report yourself.",
  postingNotFound: "This posting could not be found.",
  userNotFound: "This person could not be found.",
  engagementNotFound: "Engagement not found.",
  engagementNotActive: "You can report an engagement only while it is active.",
  caseNotFound: "This dispute case could not be found.",
  notRespondent: "Only the other party responds to this case.",
  alreadyResponded: "You've already responded to this case.",
  windowClosed: "The response window has closed.",
  statementTooLong: `Your response can be up to ${STATEMENT_MAX} characters.`,
  emptyResponse: "Write your side of what happened, or add a photo.",
  noImages: "Add at least one photo.",
  tooManyImages: `You can add up to ${EVIDENCE_MAX_PER_PARTY} photos.`,
  imageTooLarge: "Each photo can be up to 5MB.",
  imageType: "Photos must be JPEG, PNG or WebP images.",
  imageUnreadable: "This photo couldn't be read. Try choosing it again.",
};

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

/** The name a party is known by to the other: the business the posting was published as, or their own. */
function nameOf(engagement, userId) {
  return userId === engagement.workerId
    ? engagement.worker?.legalName
    : employerDisplayName(engagement.gigPosting, engagement.employer);
}

function otherPartyOf(engagement, userId) {
  return userId === engagement.workerId ? engagement.employerId : engagement.workerId;
}

function isPartyTo(engagement, userId) {
  return engagement.workerId === userId || engagement.employerId === userId;
}

/** Lock one row until the transaction ends (AGENTS.md: `$transaction` alone does not lock rows). */
async function lockRow(tx, table, id) {
  // Table names cannot be parameters; `table` is only ever one of the literals below.
  if (table === "GigPosting") await tx.$queryRaw`SELECT "id" FROM "GigPosting" WHERE "id" = ${id} FOR UPDATE`;
  else if (table === "User") await tx.$queryRaw`SELECT "id" FROM "User" WHERE "id" = ${id} FOR UPDATE`;
  else if (table === "Engagement") await tx.$queryRaw`SELECT "id" FROM "Engagement" WHERE "id" = ${id} FOR UPDATE`;
  else if (table === "DisputeCase") await tx.$queryRaw`SELECT "id" FROM "DisputeCase" WHERE "id" = ${id} FOR UPDATE`;
  else throw new Error(`lockRow: unknown table ${table}`);
}

// ---------------------------------------------------------------------------
// FR-DISPUTE-01 / 02 — Reports
// ---------------------------------------------------------------------------

const TARGET_FIELD = {
  POSTING: "targetGigPostingId",
  USER: "targetUserId",
  ENGAGEMENT: "targetEngagementId",
};

/** The report as its own reporter sees it (9.1d needs only that it was accepted). */
function presentReport(report, targetType) {
  return {
    id: report.id,
    targetType,
    targetId: report[TARGET_FIELD[targetType]],
    reason: report.reason,
    detail: report.detail ?? null,
    status: report.status,
    createdAt: report.createdAt,
  };
}

/**
 * File a report (FR-DISPUTE-01), and auto-hide the content at the third independent report
 * (FR-DISPUTE-02).
 *
 *  - A posting: anyone but its own employer. A profile: anyone but the person themselves.
 *    An engagement: only one of its two parties, only while it is Active. Exactly one target
 *    field is set on the row (database-schema.md, Report) — for an engagement that is
 *    targetEngagementId alone; the reported person is the other party, derivable from it.
 *  - The same reporter reporting the same target again while their first report is still queued
 *    creates nothing new: the answer is the same success, flagged `alreadyReported`. A second row
 *    would add nothing to the Moderator's queue and cannot move the threshold, which counts
 *    distinct reporters.
 *  - The threshold counts DISTINCT reporters among QUEUED reports ("three independent reports").
 *    A Moderator's restore dismisses the reports (FR-MOD-04, status REVIEWED), so the count starts
 *    again after one. The target row is locked first, so three reporters filing at the same moment
 *    cannot each count two and leave the content visible.
 *  - Engagement reports never hide anything: an engagement isn't publicly browsable
 *    (database-schema.md, Report).
 *  - Nobody is notified at the threshold (FR-DISPUTE-02 amendment A25), and the response never says
 *    whether the content is now hidden: that would tell the reporter when the threshold fired.
 */
async function fileReport({ reporterId, targetType, targetId, reason, detail, now = new Date() }) {
  if (!REPORT_TARGETS.includes(targetType) || typeof targetId !== "string" || !targetId.trim()) {
    throw AppError.badRequest(MESSAGES.reportTarget);
  }
  if (!REPORT_REASONS.includes(reason)) {
    throw AppError.badRequest(MESSAGES.reportReason);
  }
  let cleanDetail = null;
  if (detail !== undefined && detail !== null) {
    if (typeof detail !== "string") throw AppError.badRequest(MESSAGES.reportDetailTooLong);
    cleanDetail = detail.trim() || null;
    if (cleanDetail && cleanDetail.length > REPORT_DETAIL_MAX) {
      throw AppError.badRequest(MESSAGES.reportDetailTooLong);
    }
  }

  return prisma.$transaction(async (tx) => {
    // 1. The target exists, and this reporter may report it. Its row is locked for the count.
    if (targetType === "POSTING") {
      await lockRow(tx, "GigPosting", targetId);
      const posting = await tx.gigPosting.findUnique({
        where: { id: targetId },
        select: { id: true, employerId: true, autoHiddenAt: true },
      });
      if (!posting) throw AppError.notFound(MESSAGES.postingNotFound);
      if (posting.employerId === reporterId) throw AppError.badRequest(MESSAGES.ownPosting);
    } else if (targetType === "USER") {
      await lockRow(tx, "User", targetId);
      const user = await tx.user.findUnique({
        where: { id: targetId },
        select: { id: true, accountStatus: true, deletedAt: true, autoHiddenAt: true },
      });
      if (!user || user.deletedAt || user.accountStatus === "DELETED") throw AppError.notFound(MESSAGES.userNotFound);
      if (user.id === reporterId) throw AppError.badRequest(MESSAGES.ownProfile);
    } else {
      await lockRow(tx, "Engagement", targetId);
      const engagement = await tx.engagement.findUnique({
        where: { id: targetId },
        select: { id: true, workerId: true, employerId: true, status: true },
      });
      if (!engagement) throw AppError.notFound(MESSAGES.engagementNotFound);
      if (!isPartyTo(engagement, reporterId)) throw AppError.forbidden();
      // FR-DISPUTE-01: "within an active Engagement".
      if (engagement.status !== "ACTIVE") throw AppError.conflict(MESSAGES.engagementNotActive);
    }

    const targetWhere = { [TARGET_FIELD[targetType]]: targetId };

    // 2. One queued report per reporter per target.
    const existing = await tx.report.findFirst({
      where: { reporterId, ...targetWhere, status: "QUEUED" },
    });
    if (existing) return { report: presentReport(existing, targetType), alreadyReported: true };

    const report = await tx.report.create({
      data: { reporterId, ...targetWhere, reason, detail: cleanDetail, status: "QUEUED", createdAt: now },
    });

    // 3. FR-DISPUTE-02: the third independent report hides a posting or a profile.
    if (targetType !== "ENGAGEMENT") {
      const reporters = await tx.report.findMany({
        where: { ...targetWhere, status: "QUEUED" },
        distinct: ["reporterId"],
        select: { reporterId: true },
      });
      if (reporters.length >= AUTO_HIDE_THRESHOLD) {
        // Only if not already hidden: the first hiding moment is the one on record.
        const model = targetType === "POSTING" ? tx.gigPosting : tx.user;
        await model.updateMany({ where: { id: targetId, autoHiddenAt: null }, data: { autoHiddenAt: now } });
      }
    }

    return { report: presentReport(report, targetType), alreadyReported: false };
  });
}

// ---------------------------------------------------------------------------
// FR-DISPUTE-03 / 04 — opening a case from an engagement
// ---------------------------------------------------------------------------

/**
 * Open a dispute case for an engagement, inside the caller's transaction. The caller has already
 * moved the engagement to Disputed.
 *
 *  - Unable to confirm (FR-ENG-03) and End Engagement "yes" (FR-ENG-12): the raiser is the party
 *    who acted, the respondent the other party, who gets 48 hours (FR-DISPUTE-04) and is told now
 *    (DISPUTE_OPENED, FR-NOTIF-12 — "their 48-hour window runs from a case they have actually been
 *    told about"). The raiser is not notified: they are looking at the case they just opened.
 *  - Stalled auto-flag (FR-ENG-13): nobody raised it, so there is no respondent and no window; the
 *    case starts Under review (database-schema.md, DisputeCase) and both parties are told.
 *  - An engagement with a case still open gets no second one: the open case is returned.
 *
 * @param {object} tx - the Prisma transaction client
 * @param {{ engagement: object, triggerType: string, raisedByUserId?: string|null,
 *           checkpoint?: string|null, now?: Date }} input - `engagement` carries workerId,
 *   employerId, gigPostingId, gigPosting { title, postedAsType, postedBusinessName },
 *   worker { legalName } and employer { legalName, businessName }.
 * @returns {Promise<{ disputeCase: object, created: boolean }>}
 */
export async function openDisputeCase(tx, { engagement, triggerType, raisedByUserId = null, checkpoint = null, now = new Date() }) {
  const open = await tx.disputeCase.findFirst({
    where: { engagementId: engagement.id, status: { not: "RESOLVED" } },
    orderBy: { createdAt: "desc" },
  });
  if (open) return { disputeCase: open, created: false };

  const stalled = triggerType === "STALLED_AUTO_FLAG";
  const respondentUserId = stalled ? null : otherPartyOf(engagement, raisedByUserId);
  const respondentDeadline = stalled ? null : new Date(now.getTime() + RESPONSE_WINDOW_MS);

  const disputeCase = await tx.disputeCase.create({
    data: {
      engagementId: engagement.id,
      triggerType,
      raisedByUserId: stalled ? null : raisedByUserId,
      respondentUserId,
      respondentDeadline,
      status: stalled ? "UNDER_REVIEW" : "AWAITING_RESPONSE",
      createdAt: now,
    },
  });

  const postingTitle = engagement.gigPosting?.title;
  // `title` and `openedByName` are what the engagement module's DISPUTE_OPENED rows always carried;
  // kept so older readers of the payload still work.
  const base = {
    disputeCaseId: disputeCase.id,
    engagementId: engagement.id,
    gigPostingId: engagement.gigPostingId,
    postingTitle,
    title: postingTitle,
    triggerType,
    checkpoint,
  };

  if (stalled) {
    await tx.notification.createMany({
      data: [engagement.workerId, engagement.employerId].map((userId) => ({
        userId,
        type: "DISPUTE_OPENED",
        payload: { ...base, stalled: true, counterpartName: nameOf(engagement, otherPartyOf(engagement, userId)) },
      })),
    });
  } else {
    const raiserName = nameOf(engagement, raisedByUserId);
    await tx.notification.create({
      data: {
        userId: respondentUserId,
        type: "DISPUTE_OPENED",
        payload: { ...base, counterpartName: raiserName, openedByName: raiserName, respondBy: respondentDeadline },
      },
    });
  }

  return { disputeCase, created: true };
}

// ---------------------------------------------------------------------------
// FR-DISPUTE-04 — the window lapsing
// ---------------------------------------------------------------------------

/**
 * Every case (or one case) whose response window has closed with no response moves to Under
 * review — "review proceeds on whatever evidence is available" (FR-DISPUTE-04). One atomic update;
 * a response racing it either lands first (and moves the case itself) or finds it closed.
 * @returns {Promise<number>} how many cases moved
 */
export async function settleLapsedResponseWindows({ now = new Date(), caseId = null } = {}) {
  const where = { status: "AWAITING_RESPONSE", respondentDeadline: { lte: now } };
  if (caseId) where.id = caseId;
  const { count } = await prisma.disputeCase.updateMany({ where, data: { status: "UNDER_REVIEW" } });
  return count;
}

// ---------------------------------------------------------------------------
// FR-DISPUTE-07 — the case, as a party sees it
// ---------------------------------------------------------------------------

const CASE_INCLUDE = (userId) => ({
  engagement: {
    select: {
      id: true,
      workerId: true,
      employerId: true,
      status: true,
      arrivalStatus: true,
      completionStatus: true,
      paymentStatus: true,
      gigPostingId: true,
      gigPosting: { select: { id: true, title: true, postedAsType: true, postedBusinessName: true } },
      worker: { select: { legalName: true } },
      employer: { select: { legalName: true, businessName: true } },
    },
  },
  // Only the viewer's own evidence: FR-DISPUTE-05 makes evidence visible to Admin/Moderator, not
  // to the other party.
  evidence: { where: { submittedByUserId: userId }, select: { id: true, uploadedAt: true }, orderBy: { uploadedAt: "asc" } },
  // A Moderator's question to the viewer (FR-MOD-03, 9.2c). Staff create these; read-only here.
  clarifications: {
    where: { requestedFromUserId: userId },
    select: { id: true, question: true, deadline: true, respondedAt: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  },
});

/** A party to the case: either side of its engagement, or its raiser/respondent. */
function isPartyToCase(disputeCase, userId) {
  if (disputeCase.engagement && isPartyTo(disputeCase.engagement, userId)) return true;
  return disputeCase.raisedByUserId === userId || disputeCase.respondentUserId === userId;
}

/**
 * The case body for the 9.2 family. Never contains a reporter's identity (NFR-PRIV-05): a
 * report-type case names no counterpart at all, and no case carries raiser or respondent ids.
 */
function presentCase(dc, userId, now = new Date()) {
  const status = effectiveCaseStatus(dc, now);
  const viewerRole = caseViewerRole(dc, userId);
  const eng = dc.engagement ?? null;
  const openClarification = (dc.clarifications ?? []).find(
    (c) => !c.respondedAt && new Date(c.deadline).getTime() > now.getTime(),
  );
  const myEvidence = (dc.evidence ?? []).map((e) => ({ id: e.id, uploadedAt: e.uploadedAt }));

  return {
    id: dc.id,
    status, // AWAITING_RESPONSE | UNDER_REVIEW | ESCALATED | RESOLVED
    triggerType: dc.triggerType, // UNABLE_TO_CONFIRM | END_ENGAGEMENT_ISSUE | STALLED_AUTO_FLAG | REPORT
    checkpoint: disputedCheckpoint(eng, dc.triggerType), // "arrival" | "completion" | "payment" | null
    viewerRole, // RAISER | RESPONDENT | PARTY
    engagementId: dc.engagementId ?? null,
    postingTitle: eng?.gigPosting?.title ?? null,
    // The OTHER party's name (9.2 context line). Never for a report-type case: that would name the reporter.
    counterpartName: eng && dc.triggerType !== "REPORT" ? nameOf(eng, otherPartyOf(eng, userId)) : null,
    openedAt: dc.createdAt,
    openedByMe: viewerRole === "RAISER",
    // FR-DISPUTE-07: the window and its remaining time are visible to both parties.
    respondentDeadline: dc.respondentDeadline ?? null,
    hasResponded: Boolean(dc.respondedAt),
    canRespond: canRespondToCase(dc, userId, now),
    evidence: {
      mine: myEvidence,
      limit: EVIDENCE_MAX_PER_PARTY,
      maxBytes: EVIDENCE_MAX_BYTES,
      canAdd:
        (viewerRole === "RAISER" || viewerRole === "RESPONDENT") &&
        evidenceWindowOpen(dc, now) &&
        myEvidence.length < EVIDENCE_MAX_PER_PARTY,
    },
    // 9.2c: an open question for the viewer, with its 24-hour deadline.
    clarificationRequest: openClarification
      ? { id: openClarification.id, question: openClarification.question, deadline: openClarification.deadline }
      : null,
    // FR-DISPUTE-07: the recorded outcome, to both parties (9.2f).
    outcome:
      status === "RESOLVED"
        ? {
            resolution: dc.resolution ?? null,
            resolvedAt: dc.resolvedAt ?? null,
            decidedBy: dc.adminAccountId ? "ADMIN" : "MODERATOR",
            inViewersFavour: outcomeFavoursViewer(dc.resolution, viewerRole),
          }
        : null,
  };
}

/** GET one case. Either party only; anyone else gets 403. */
async function getCase({ caseId, userId, now = new Date() }) {
  await settleLapsedResponseWindows({ now, caseId });
  const dc = await prisma.disputeCase.findUnique({ where: { id: caseId }, include: CASE_INCLUDE(userId) });
  if (!dc) throw AppError.notFound(MESSAGES.caseNotFound);
  if (!isPartyToCase(dc, userId)) throw AppError.forbidden();
  return presentCase(dc, userId, now);
}

/** The engagement's current case (the open one, else the latest), or null if it never had one. */
async function getCaseForEngagement({ engagementId, userId, now = new Date() }) {
  if (typeof engagementId !== "string" || !engagementId) throw AppError.badRequest("Say which engagement.");
  const engagement = await prisma.engagement.findUnique({
    where: { id: engagementId },
    select: { id: true, workerId: true, employerId: true },
  });
  if (!engagement) throw AppError.notFound(MESSAGES.engagementNotFound);
  if (!isPartyTo(engagement, userId)) throw AppError.forbidden();

  const cases = await prisma.disputeCase.findMany({
    where: { engagementId },
    select: { id: true, status: true },
    orderBy: { createdAt: "desc" },
  });
  const current = currentCase(cases);
  return current ? getCase({ caseId: current.id, userId, now }) : null;
}

// ---------------------------------------------------------------------------
// FR-DISPUTE-04 / 05 — responding, and evidence
// ---------------------------------------------------------------------------

const BASE64 = /^[A-Za-z0-9+/]+={0,2}$/;

/** Does the decoded file start the way its declared type says it should? */
function looksLike(mimeType, buf) {
  if (mimeType === "image/jpeg") return buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
  if (mimeType === "image/png") return buf.length > 8 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  if (mimeType === "image/webp") return buf.length > 12 && buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP";
  return false;
}

/**
 * Validate and decode the request's images: [{ mimeType, dataBase64 }]. FR-DISPUTE-05's caps are
 * checked here per request (at most 3, each at most 5 MB decoded); the per-party total is checked
 * again inside the transaction against what is already on the case.
 * @returns {Array<{ mimeType: string, ext: string, data: Buffer }>}
 */
export function decodeImages(images) {
  if (images === undefined || images === null) return [];
  if (!Array.isArray(images)) throw AppError.badRequest(MESSAGES.imageUnreadable);
  if (images.length > EVIDENCE_MAX_PER_PARTY) throw AppError.badRequest(MESSAGES.tooManyImages);

  return images.map((image) => {
    const { mimeType, dataBase64 } = image ?? {};
    const ext = IMAGE_TYPES[mimeType];
    if (!ext) throw AppError.badRequest(MESSAGES.imageType);
    if (typeof dataBase64 !== "string") throw AppError.badRequest(MESSAGES.imageUnreadable);
    const clean = dataBase64.replace(/\s/g, "");
    if (!clean || !BASE64.test(clean)) throw AppError.badRequest(MESSAGES.imageUnreadable);
    // Checked before decoding, so an oversize file is refused without allocating it.
    const padding = clean.endsWith("==") ? 2 : clean.endsWith("=") ? 1 : 0;
    if ((clean.length * 3) / 4 - padding > EVIDENCE_MAX_BYTES) throw AppError.badRequest(MESSAGES.imageTooLarge);
    const data = Buffer.from(clean, "base64");
    if (data.length > EVIDENCE_MAX_BYTES) throw AppError.badRequest(MESSAGES.imageTooLarge);
    if (!looksLike(mimeType, data)) throw AppError.badRequest(MESSAGES.imageUnreadable);
    return { mimeType, ext, data };
  });
}

/**
 * Write the images to disk and record them, inside the caller's transaction. Returns the absolute
 * paths written, so the caller can remove them if the transaction fails.
 */
async function storeEvidence(tx, { caseId, userId, images, now, written }) {
  if (images.length === 0) return;
  const folder = path.join(UPLOADS_ROOT, "disputes", caseId);
  await mkdir(folder, { recursive: true });
  for (const image of images) {
    const fileName = `${randomUUID()}.${image.ext}`;
    const absolute = path.join(folder, fileName);
    await writeFile(absolute, image.data);
    written.push(absolute);
    await tx.disputeEvidence.create({
      data: {
        disputeCaseId: caseId,
        submittedByUserId: userId,
        // Relative to UPLOADS_ROOT, always with forward slashes.
        imageUrl: `disputes/${caseId}/${fileName}`,
        uploadedAt: now,
      },
    });
  }
}

/** Remove files written for a transaction that then failed. Best effort. */
async function removeFiles(paths) {
  await Promise.all(paths.map((p) => unlink(p).catch(() => {})));
}

/** Lock the case, read it, and refuse anyone who isn't one of its parties. */
async function loadCaseForUpdate(tx, caseId, userId) {
  await lockRow(tx, "DisputeCase", caseId);
  const dc = await tx.disputeCase.findUnique({
    where: { id: caseId },
    include: { engagement: { select: { id: true, workerId: true, employerId: true } } },
  });
  if (!dc) throw AppError.notFound(MESSAGES.caseNotFound);
  if (!isPartyToCase(dc, userId)) throw AppError.forbidden();
  return dc;
}

/**
 * The respondent's answer (FR-DISPUTE-04, prototype 9.3): a statement of up to 300 characters
 * and/or up to 3 photos. Once only, and only inside the window. It moves the case to Under review
 * — "A moderator now has both sides" (9.3e).
 *
 * At least one of the two is required: an empty submission would put "Your response is on record"
 * (9.2ur) on a record that holds nothing.
 */
async function respondToCase({ caseId, userId, statement, images, now = new Date() }) {
  let cleanStatement = null;
  if (statement !== undefined && statement !== null) {
    if (typeof statement !== "string") throw AppError.badRequest(MESSAGES.statementTooLong);
    cleanStatement = statement.trim() || null;
    if (cleanStatement && cleanStatement.length > STATEMENT_MAX) throw AppError.badRequest(MESSAGES.statementTooLong);
  }
  const decoded = decodeImages(images);
  if (!cleanStatement && decoded.length === 0) throw AppError.badRequest(MESSAGES.emptyResponse);

  await settleLapsedResponseWindows({ now, caseId });

  const written = [];
  try {
    await prisma.$transaction(async (tx) => {
      const dc = await loadCaseForUpdate(tx, caseId, userId);
      if (dc.respondentUserId !== userId) throw AppError.forbidden(MESSAGES.notRespondent);
      if (dc.respondedAt) throw AppError.conflict(MESSAGES.alreadyResponded);
      if (effectiveCaseStatus(dc, now) !== "AWAITING_RESPONSE") throw AppError.conflict(MESSAGES.windowClosed);

      const already = await tx.disputeEvidence.count({ where: { disputeCaseId: caseId, submittedByUserId: userId } });
      if (already + decoded.length > EVIDENCE_MAX_PER_PARTY) throw AppError.badRequest(MESSAGES.tooManyImages);

      await storeEvidence(tx, { caseId, userId, images: decoded, now, written });

      const { count } = await tx.disputeCase.updateMany({
        where: { id: caseId, status: "AWAITING_RESPONSE", respondedAt: null },
        data: { respondentStatement: cleanStatement, respondedAt: now, status: "UNDER_REVIEW" },
      });
      if (count === 0) throw AppError.conflict(MESSAGES.alreadyResponded);
    });
  } catch (err) {
    await removeFiles(written);
    throw err;
  }
  return getCase({ caseId, userId, now });
}

/**
 * Either party attaches evidence (FR-DISPUTE-05 "either party"), up to 3 images each, while the
 * response window is open. The raiser has no drawn screen for it; the endpoint exists so the
 * requirement holds for both sides. It never changes the case's status.
 */
async function addEvidence({ caseId, userId, images, now = new Date() }) {
  const decoded = decodeImages(images);
  if (decoded.length === 0) throw AppError.badRequest(MESSAGES.noImages);

  await settleLapsedResponseWindows({ now, caseId });

  const written = [];
  try {
    await prisma.$transaction(async (tx) => {
      const dc = await loadCaseForUpdate(tx, caseId, userId);
      const role = caseViewerRole(dc, userId);
      if (role !== "RAISER" && role !== "RESPONDENT") throw AppError.forbidden();
      if (!evidenceWindowOpen(dc, now)) throw AppError.conflict(MESSAGES.windowClosed);

      const already = await tx.disputeEvidence.count({ where: { disputeCaseId: caseId, submittedByUserId: userId } });
      if (already + decoded.length > EVIDENCE_MAX_PER_PARTY) throw AppError.badRequest(MESSAGES.tooManyImages);

      await storeEvidence(tx, { caseId, userId, images: decoded, now, written });
    });
  } catch (err) {
    await removeFiles(written);
    throw err;
  }
  return getCase({ caseId, userId, now });
}

/**
 * One evidence image, for the party who submitted it (the 9.3 thumbnails). FR-DISPUTE-05 makes
 * evidence visible to Admin/Moderator; it does not show one party's photos to the other, so
 * neither does this.
 * @returns {Promise<{ absolutePath: string, contentType: string }>}
 */
async function getEvidenceFile({ evidenceId, userId }) {
  const evidence = await prisma.disputeEvidence.findUnique({
    where: { id: evidenceId },
    select: { id: true, imageUrl: true, submittedByUserId: true },
  });
  if (!evidence) throw AppError.notFound("This photo could not be found.");
  if (evidence.submittedByUserId !== userId) throw AppError.forbidden();

  const absolutePath = path.resolve(UPLOADS_ROOT, evidence.imageUrl);
  // Never serve anything outside the uploads folder, whatever the row says.
  if (!absolutePath.startsWith(path.resolve(UPLOADS_ROOT) + path.sep)) throw AppError.notFound("This photo could not be found.");
  const ext = path.extname(absolutePath).slice(1).toLowerCase();
  return { absolutePath, contentType: CONTENT_TYPE_BY_EXT[ext] ?? "application/octet-stream" };
}

export default {
  fileReport,
  openDisputeCase,
  settleLapsedResponseWindows,
  getCase,
  getCaseForEngagement,
  respondToCase,
  addEvidence,
  getEvidenceFile,
  presentCase,
};
