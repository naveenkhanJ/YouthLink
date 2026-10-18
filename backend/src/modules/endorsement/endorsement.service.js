/**
 * Community Endorsement services — business rules and data access.
 *
 * Epic: FR-ENDORSE
 * Requirements:
 *   - FR-ENDORSE-02: a persistent 6-character code for each eligible worker (screens 8.1 / 8.1b / 8.1s),
 *     entered by a Verifier to vouch (8.2).
 *   - FR-ENDORSE-03: a Verifier finds an eligible worker by phone number (8.3 / 8.3m / 8.3d), with one
 *     generic miss that never says whether an account exists (NFR-PRIV-04).
 *   - FR-ENDORSE-04 / -08 / -09: the vouch itself — live at once, optional attributes and reason, one
 *     active endorsement per Verifier per worker, the worker notified (8.4 / 8.4e).
 *   - FR-ENDORSE-05: eligibility = zero rated engagements, closing for good at the first rating.
 *   - FR-ENDORSE-07: a Verifier revokes their own endorsement; the worker is told (8.5c).
 *   - FR-ENDORSE-11: the Verifier's private track record, "N endorsed, M went on to build a good
 *     rating", computed live (8.5).
 *   - FR-ENDORSE-13 / -14: the two one-time prompts for a zero-history worker (bio prompt 8.6,
 *     endorsement suggestion 8.7).
 * FR-ENDORSE-12 (the payoff notification) fires when a rating is revealed, so it lives in
 * endorsement.hooks.js, which the Ratings module calls.
 *
 * Actors: a Verifier is ActorRole COMMUNITY_ENDORSER; the endorsed worker is a YOUTH_JOB_SEEKER.
 * requireAuth (mounted in app.js) has already refused suspended and deleted callers.
 */
import crypto from "crypto";
import prisma from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";
import { revealedRatingsWhere } from "../rating/rating.service.js";
import { ATTRIBUTE_LABELS } from "../application/application.trust.js";
import { everRevealedWhere, GOOD_RATING_THRESHOLD } from "./endorsement.hooks.js";

const VERIFIER = "COMMUNITY_ENDORSER";
const WORKER = "YOUTH_JOB_SEEKER";

// The fixed attribute list (FR-ENDORSE-04, schema enum EndorsementAttribute), in display order.
const ATTRIBUTES = Object.keys(ATTRIBUTE_LABELS);
const ENTRY_POINTS = ["CODE", "PHONE_SEARCH"];
const REASON_MAX = 300;

// FR-ENDORSE-14 (amended 2026-09-23): only an employer's decision counts as "unselected" —
// Declined (FR-APPLY-08) and Not selected (FR-APPLY-09). A withdrawal is the worker's own choice.
const UNSELECTED_STATUSES = ["DECLINED", "NOT_SELECTED"];
const UNSELECTED_FOR_SUGGESTION = 3;

// Exact copy from docs/prototype/M8-endorsement.md, "States not drawn" and 8.3d.
export const CODE_MISS = "That code didn't work. Check it with the person who shared it.";
export const PHONE_MISS = "No one to show for that number.";
export const ALREADY_VOUCHED = "You already vouch for them.";
// Machine-readable codes so the app can branch without parsing the copy (AppError's `code`).
const NO_MATCH_CODE = "NO_ELIGIBLE_MATCH";
const ALREADY_VOUCHED_CODE = "ALREADY_VOUCHED";

// ---------------------------------------------------------------------------
// The endorsement code (FR-ENDORSE-02)
// ---------------------------------------------------------------------------

// Letters and digits without the pairs people misread when a code is read out or typed from a
// WhatsApp message: 0/O and 1/I. 32 symbols, so 32^6 ≈ 1.07 billion codes.
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 6;
const CODE_ATTEMPTS = 5;

/**
 * A fresh 6-character code, unspaced ("K7XA2B"). The spaced "K 7 X A 2 B" on 8.1 is display only.
 * crypto.randomInt, not Math.random: a code is a way to reach a person, so it must not be guessable
 * from the codes around it.
 */
export function generateEndorsementCode() {
  let code = "";
  for (let i = 0; i < CODE_LENGTH; i += 1) code += CODE_ALPHABET[crypto.randomInt(CODE_ALPHABET.length)];
  return code;
}

/**
 * What a typed code is compared as: spaces removed (someone may copy the spaced display form) and
 * upper-cased. Anything that is not then six letters/digits cannot be a code.
 * @returns {string|null}
 */
export function normaliseCode(code) {
  if (typeof code !== "string") return null;
  const value = code.replace(/\s+/g, "").toUpperCase();
  return /^[A-Z0-9]{6}$/.test(value) ? value : null;
}

/**
 * FR-ENDORSE-02 / 8.1s: the text handed to the OS share sheet. Names the product, gives the code
 * unspaced, and says what to do with it — it arrives in a chat with no other context.
 */
export function shareTextFor(code) {
  return `My YouthLink endorsement code: ${code} — enter it in the app to vouch for me.`;
}

/**
 * A phone number as typed into 8.3, in the stored E.164 form ("+94771234567"). Strips spaces,
 * dashes and brackets exactly as account.service.js does for password login, and also accepts the
 * two local forms a Sri Lankan number is written in ("0771234567", "771234567"), since 8.3's field
 * shows "+94" as a fixed prefix and the app may send only the part after it.
 * @returns {string|null}
 */
export function normalisePhone(phone) {
  if (typeof phone !== "string") return null;
  let value = phone.replace(/[\s\-()]/g, "");
  if (/^0\d{9}$/.test(value)) value = `+94${value.slice(1)}`;
  else if (/^\d{9}$/.test(value)) value = `+94${value}`;
  else if (/^94\d{9}$/.test(value)) value = `+${value}`;
  return value.length > 0 ? value : null;
}

// ---------------------------------------------------------------------------
// Eligibility (FR-ENDORSE-05) — one definition, used by every entry point and by the profile
// ---------------------------------------------------------------------------

/**
 * Prisma `where` (on User) for "a worker someone may vouch for right now":
 *   - a Youth Job-Seeker on an active account (not pending, suspended or deleted), and
 *   - zero rated engagements: firstRatingReceivedAt is still null (stamped once by
 *     endorsement.hooks.js, which is what makes the closure permanent), and no revealed rating has
 *     been received either — which also covers a 14-day window that closed but was never written
 *     down, and data that predates the stamp. A removed rating still counts: removal does not
 *     reopen the window ("even if their history later returns to zero").
 * Being one query, a match and a miss cost the same, so the generic miss cannot be told apart by
 * timing either (product-overview.md §8).
 * @param {Date} [now]
 */
export function eligibleWorkerWhere(now = new Date()) {
  return {
    role: WORKER,
    accountStatus: "ACTIVE",
    suspendedAt: null,
    deletedAt: null,
    firstRatingReceivedAt: null,
    ratingsReceived: { none: everRevealedWhere(revealedRatingsWhere(now)) },
  };
}

/**
 * FR-ENDORSE-05: is this person currently eligible to be vouched for (and to see their code)?
 * Shared with the Profile module so the profile and the endorsement screens can never disagree.
 * @param {string} userId
 * @param {object} [client] - a Prisma client or transaction client.
 * @returns {Promise<boolean>}
 */
export async function isEligibleForEndorsement(userId, client = prisma) {
  const count = await client.user.count({ where: { id: userId, ...eligibleWorkerWhere() } });
  return count > 0;
}

/** The eligible worker matching `where` (a code or a phone), or null. */
function findEligibleWorker(where, client = prisma) {
  return client.user.findFirst({
    where: { ...where, ...eligibleWorkerWhere() },
    select: { id: true, legalName: true, phone: true },
  });
}

/** FR-ENDORSE-08: does this Verifier already have an active endorsement of this worker? */
async function hasActiveEndorsement(endorserId, workerId, client = prisma) {
  const count = await client.endorsement.count({ where: { endorserId, workerId, revokedAt: null } });
  return count > 0;
}

function assertVerifier(user) {
  if (user?.role !== VERIFIER) throw AppError.forbidden("Only a Community Verifier can vouch for someone.");
}

function assertWorker(user) {
  if (user?.role !== WORKER) throw AppError.forbidden("Only a job-seeker has an endorsement code.");
}

const codeMiss = () => new AppError(404, CODE_MISS, undefined, NO_MATCH_CODE);
const phoneMiss = () => new AppError(404, PHONE_MISS, undefined, NO_MATCH_CODE);
const alreadyVouched = () => new AppError(409, ALREADY_VOUCHED, undefined, ALREADY_VOUCHED_CODE);

/**
 * The partial unique index Endorsement_endorser_worker_active_unique (one ACTIVE endorsement per
 * endorser per worker, raw SQL — not @@unique) fails as Prisma's P2002, or as Postgres's own 23505
 * when it reaches us unwrapped.
 */
function isUniqueViolation(err) {
  return err?.code === "P2002" || err?.code === "23505" || err?.cause?.code === "23505";
}

// ---------------------------------------------------------------------------
// The worker's side: my code (8.1 / 8.1b)
// ---------------------------------------------------------------------------

/**
 * Stores a code for the worker if they have none yet, and returns the one they have. Persistent:
 * once set it never changes, so a code already shared keeps working while they are eligible.
 * The `endorsementCode: null` guard makes two simultaneous first visits agree on one code; a
 * collision with someone else's code (the column is unique) just draws again.
 */
async function ensureCode(userId) {
  const current = await prisma.user.findUnique({ where: { id: userId }, select: { endorsementCode: true } });
  if (current?.endorsementCode) return current.endorsementCode;

  for (let attempt = 0; attempt < CODE_ATTEMPTS; attempt += 1) {
    const code = generateEndorsementCode();
    try {
      const { count } = await prisma.user.updateMany({
        where: { id: userId, endorsementCode: null },
        data: { endorsementCode: code },
      });
      if (count === 1) return code;
      // Another request from the same person stored one first: use theirs.
      const winner = await prisma.user.findUnique({ where: { id: userId }, select: { endorsementCode: true } });
      return winner.endorsementCode;
    } catch (err) {
      if (!isUniqueViolation(err)) throw err;
    }
  }
  throw new Error("Could not allocate a unique endorsement code.");
}

/**
 * FR-ENDORSE-02: the worker's own code, while they are eligible (8.1); nothing once the window has
 * closed (8.1b — "No code, no button", and no greyed-out code either).
 * @param {{ user: { id: string, role: string } }} input
 * @returns {Promise<{ eligible: boolean, code: string|null, shareText: string|null }>}
 */
export async function getMyCode({ user }) {
  assertWorker(user);
  if (!(await isEligibleForEndorsement(user.id))) {
    return { eligible: false, code: null, shareText: null };
  }
  const code = await ensureCode(user.id);
  return { eligible: true, code, shareText: shareTextFor(code) };
}

// ---------------------------------------------------------------------------
// The Verifier's side: finding the person (8.2, 8.3)
// ---------------------------------------------------------------------------

/**
 * FR-ENDORSE-02 (8.2 "Check code"): who a code belongs to, if they can still be vouched for.
 * An unknown code and the code of someone whose window has closed get the same 404 and the same
 * words — saying "the window closed" would confirm the account exists (M8, States not drawn).
 * A code for someone this Verifier already vouches for is refused here, on 8.2 (M8).
 * @param {{ user: object, code: unknown }} input
 * @returns {Promise<{ workerId: string, name: string }>}
 */
export async function lookupCode({ user, code }) {
  assertVerifier(user);
  const value = normaliseCode(code);
  if (!value) throw codeMiss();

  const worker = await findEligibleWorker({ endorsementCode: value });
  if (!worker) throw codeMiss();
  if (await hasActiveEndorsement(user.id, worker.id)) throw alreadyVouched();
  return { workerId: worker.id, name: worker.legalName };
}

/**
 * FR-ENDORSE-03 (8.3): one eligible worker by phone, or the one generic miss. Never a list
 * (NFR-PRIV-04), and never anything beyond a name and the matched number (8.3m).
 * No account, someone who is not a job-seeker, someone no longer eligible, a suspended or deleted
 * account — all the same 404 "No one to show for that number."
 * An eligible person this Verifier already vouches for IS returned, with alreadyVouched: true —
 * 8.3m then shows "You already vouch for them" and no Vouch button (M8, States not drawn).
 * @param {{ user: object, phone: unknown }} input
 * @returns {Promise<{ workerId: string, name: string, phone: string, alreadyVouched: boolean }>}
 */
export async function searchByPhone({ user, phone }) {
  assertVerifier(user);
  const value = normalisePhone(phone);
  if (!value) throw phoneMiss();

  const worker = await findEligibleWorker({ phone: value });
  if (!worker) throw phoneMiss();
  return {
    workerId: worker.id,
    name: worker.legalName,
    phone: worker.phone,
    alreadyVouched: await hasActiveEndorsement(user.id, worker.id),
  };
}

// ---------------------------------------------------------------------------
// The vouch (8.4 / 8.4e)
// ---------------------------------------------------------------------------

/**
 * FR-ENDORSE-04: the attributes as stored — only values from the fixed list, each once, in the
 * list's order. Missing or empty is valid: neither field may block the single-action path.
 */
export function validateAttributes(attributes) {
  if (attributes === undefined || attributes === null) return [];
  if (!Array.isArray(attributes) || attributes.some((a) => !ATTRIBUTES.includes(a))) {
    throw AppError.badRequest("Choose attributes from the list.", { attributes: "Invalid" });
  }
  return ATTRIBUTES.filter((a) => attributes.includes(a));
}

/** FR-ENDORSE-04: the optional "How do you know this person?" — trimmed, ≤ 300, empty = none. */
export function validateReason(reason) {
  if (reason === undefined || reason === null) return null;
  if (typeof reason !== "string") throw AppError.badRequest("A reason must be text.", { reason: "Invalid" });
  const text = reason.trim();
  if (text.length === 0) return null;
  if (text.length > REASON_MAX) {
    throw AppError.badRequest(`A reason can be up to ${REASON_MAX} characters.`, { reason: "Too long" });
  }
  return text;
}

/** An endorsement as the Verifier's own screens show it: only the attributes actually selected. */
function describeGiven(row, workerName) {
  return {
    id: row.id,
    workerId: row.workerId,
    workerName,
    reason: row.reason,
    attributes: (row.attributes ?? []).map((a) => ATTRIBUTE_LABELS[a]).filter(Boolean),
    entryPoint: row.entryPoint,
    createdAt: row.createdAt,
    revokedAt: row.revokedAt,
    active: row.revokedAt === null,
  };
}

/**
 * FR-ENDORSE-04 / -08 / -09: "I vouch for this person".
 *
 * Live the moment it is stored — there is no pending state (8.4e "there's no review step"). The
 * worker's row is locked (SELECT … FOR UPDATE) for the decision, because two things could
 * otherwise change underneath it: a rating being revealed (the reveal hook writes the same row, so
 * it either finishes first and we see the window closed, or waits for us — FR-ENDORSE-02's third
 * criterion), and the same Verifier submitting from two devices (the second waits and finds the
 * first). The partial unique index is the backstop, and its failure is the same refusal.
 *
 * A worker who is no longer eligible gets the same generic miss as the screen they came from, so
 * a vouch cannot be used to learn more than the lookup did.
 *
 * @param {{ user: object, workerId: unknown, attributes?: unknown, reason?: unknown, entryPoint: unknown }} input
 */
export async function createEndorsement({ user, workerId, attributes, reason, entryPoint }) {
  assertVerifier(user);
  if (!ENTRY_POINTS.includes(entryPoint)) {
    throw AppError.badRequest("entryPoint must be CODE or PHONE_SEARCH.", { entryPoint: "Invalid" });
  }
  if (typeof workerId !== "string" || workerId.length === 0) {
    throw AppError.badRequest("Say who you are vouching for.", { workerId: "Required" });
  }
  const chosen = validateAttributes(attributes);
  const text = validateReason(reason);
  const miss = entryPoint === "CODE" ? codeMiss : phoneMiss;

  try {
    return await prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT "id" FROM "User" WHERE "id" = ${workerId} FOR UPDATE`;

      const worker = await findEligibleWorker({ id: workerId }, tx);
      if (!worker) throw miss();
      if (await hasActiveEndorsement(user.id, workerId, tx)) throw alreadyVouched();

      const endorser = await tx.user.findUnique({ where: { id: user.id }, select: { legalName: true } });
      const created = await tx.endorsement.create({
        data: { endorserId: user.id, workerId, attributes: chosen, reason: text, entryPoint },
      });

      // FR-ENDORSE-09 / FR-NOTIF-07: "{name} vouched for you" · opens their own profile.
      await tx.notification.create({
        data: {
          userId: workerId,
          type: "ENDORSEMENT_RECEIVED",
          payload: { endorsementId: created.id, endorserName: endorser.legalName },
        },
      });
      return { endorsement: describeGiven(created, worker.legalName) };
    });
  } catch (err) {
    if (isUniqueViolation(err)) throw alreadyVouched();
    throw err;
  }
}

// ---------------------------------------------------------------------------
// My endorsements (8.5) and revoking (8.5c)
// ---------------------------------------------------------------------------

/**
 * FR-ENDORSE-11: which of these workers "went on to build a good rating" — at least one revealed,
 * unremoved rating received and a current exact average of 4.0 or more. Live: it is recomputed on
 * every call, so a worker whose average falls below 4.0 drops out of M at once.
 * @param {string[]} workerIds
 * @returns {Promise<Set<string>>}
 */
async function workersWithGoodRating(workerIds, client = prisma) {
  if (workerIds.length === 0) return new Set();
  const groups = await client.rating.groupBy({
    by: ["rateeId"],
    where: { rateeId: { in: workerIds }, ...revealedRatingsWhere() },
    _avg: { score: true },
    _count: { _all: true },
  });
  return new Set(
    groups
      .filter((g) => g._count._all > 0 && g._avg.score !== null && g._avg.score >= GOOD_RATING_THRESHOLD)
      .map((g) => g.rateeId),
  );
}

/**
 * 8.5: everything this Verifier has vouched for, newest first, revoked rows included and kept in
 * place (a revoked row "stays in place rather than moving to the bottom"), plus the track record.
 *
 * The track record is returned here and nowhere else: this endpoint only ever answers for the
 * caller's own endorsements, so no one else can see N or M (FR-ENDORSE-11, amended 2026-08-27).
 *   N = active (non-revoked) endorsements;  M = of those, workers with a good rating now.
 *
 * @param {{ user: object }} input
 */
export async function listGiven({ user }) {
  assertVerifier(user);
  const rows = await prisma.endorsement.findMany({
    where: { endorserId: user.id },
    orderBy: { createdAt: "desc" },
    include: { worker: { select: { legalName: true } } },
  });

  const active = rows.filter((r) => r.revokedAt === null);
  const good = await workersWithGoodRating([...new Set(active.map((r) => r.workerId))]);

  const endorsements = rows.map((row) => ({
    ...describeGiven(row, row.worker.legalName),
    countsTowardGoodRating: row.revokedAt === null && good.has(row.workerId),
  }));
  return {
    trackRecord: {
      endorsedCount: active.length,
      goodRatingCount: active.filter((r) => good.has(r.workerId)).length,
    },
    endorsements,
  };
}

/**
 * FR-ENDORSE-07: revoke one of the caller's own endorsements. It stops displaying from now on;
 * nothing already done while it was live is undone. No reason is asked for or stored. The worker
 * is told (ENDORSEMENT_REVOKED, FR-NOTIF-07) — "{name} revoked their endorsement".
 *
 * The `revokedAt: null` guard on the update makes a double tap revoke once and notify once.
 * @param {{ user: object, endorsementId: string }} input
 * @returns {Promise<{ endorsement: { id: string, revokedAt: Date } }>}
 */
export async function revokeEndorsement({ user, endorsementId }) {
  assertVerifier(user);
  return prisma.$transaction(async (tx) => {
    const now = new Date();
    const { count } = await tx.endorsement.updateMany({
      where: { id: endorsementId, endorserId: user.id, revokedAt: null },
      data: { revokedAt: now },
    });
    if (count === 0) {
      const existing = await tx.endorsement.findFirst({
        where: { id: endorsementId, endorserId: user.id },
        select: { id: true },
      });
      // Someone else's endorsement is reported exactly like a missing one.
      if (!existing) throw AppError.notFound("This endorsement could not be found.");
      throw AppError.conflict("You've already revoked this endorsement.");
    }

    const row = await tx.endorsement.findUnique({
      where: { id: endorsementId },
      select: { id: true, workerId: true, endorser: { select: { legalName: true } } },
    });
    await tx.notification.create({
      data: {
        userId: row.workerId,
        type: "ENDORSEMENT_REVOKED",
        payload: { endorsementId: row.id, endorserName: row.endorser.legalName },
      },
    });
    return { endorsement: { id: row.id, revokedAt: now } };
  });
}

// ---------------------------------------------------------------------------
// One-time prompts for a zero-history worker (FR-ENDORSE-13, FR-ENDORSE-14)
// ---------------------------------------------------------------------------

/**
 * Whether the app should show either one-time prompt now. "One-time" is show-once-ever
 * (database-schema.md, judgement call 7): once the app reports it shown (setPromptsShown), never again.
 *
 *   showBioPrompt (FR-ENDORSE-13, 8.6): zero history, no bio, never shown, and no application
 *     submitted yet — the prompt comes "after signup or before … first application".
 *   showEndorsementSuggestion (FR-ENDORSE-14, 8.7): zero history, no active endorsement, never
 *     shown, and at least 3 applications ended Declined or Not selected (withdrawn ones excluded).
 *
 * Anyone who is not a job-seeker simply gets two falses.
 * @param {{ user: object }} input
 * @returns {Promise<{ showBioPrompt: boolean, showEndorsementSuggestion: boolean }>}
 */
export async function getPrompts({ user }) {
  if (user?.role !== WORKER) return { showBioPrompt: false, showEndorsementSuggestion: false };

  const [me, eligible, applied, unselected, endorsed] = await Promise.all([
    prisma.user.findUnique({
      where: { id: user.id },
      select: { bio: true, bioPromptShownAt: true, endorsementSuggestionShownAt: true },
    }),
    isEligibleForEndorsement(user.id),
    prisma.application.count({ where: { workerId: user.id } }),
    prisma.application.count({ where: { workerId: user.id, status: { in: UNSELECTED_STATUSES } } }),
    prisma.endorsement.count({ where: { workerId: user.id, revokedAt: null } }),
  ]);

  const hasBio = typeof me?.bio === "string" && me.bio.trim().length > 0;
  return {
    showBioPrompt: eligible && !hasBio && !me?.bioPromptShownAt && applied === 0,
    showEndorsementSuggestion:
      eligible && endorsed === 0 && !me?.endorsementSuggestionShownAt && unselected >= UNSELECTED_FOR_SUGGESTION,
  };
}

/**
 * Records that a one-time prompt was shown, so it never shows again. Idempotent: the `null` guard
 * keeps the first time, and a repeat is a no-op.
 * @param {{ user: object, bioPromptShown?: unknown, endorsementSuggestionShown?: unknown }} input
 */
export async function setPromptsShown({ user, bioPromptShown, endorsementSuggestionShown }) {
  assertWorker(user);
  const flags = { bioPromptShown, endorsementSuggestionShown };
  for (const [name, value] of Object.entries(flags)) {
    if (value !== undefined && value !== true) {
      throw AppError.badRequest(`${name} can only be true.`, { [name]: "Invalid" });
    }
  }
  if (bioPromptShown !== true && endorsementSuggestionShown !== true) {
    throw AppError.badRequest("Say which prompt was shown.");
  }

  const now = new Date();
  if (bioPromptShown) {
    await prisma.user.updateMany({ where: { id: user.id, bioPromptShownAt: null }, data: { bioPromptShownAt: now } });
  }
  if (endorsementSuggestionShown) {
    await prisma.user.updateMany({
      where: { id: user.id, endorsementSuggestionShownAt: null },
      data: { endorsementSuggestionShownAt: now },
    });
  }
  return getPrompts({ user });
}

export default {
  getMyCode,
  lookupCode,
  searchByPhone,
  createEndorsement,
  listGiven,
  revokeEndorsement,
  getPrompts,
  setPromptsShown,
  isEligibleForEndorsement,
};
