// endorsement.service.test.js
// FR-ENDORSE-02 (the worker's code), -03 (phone search, generic miss), -04 (the vouch: optional
// attributes and reason), -05 (eligibility closes at the first revealed rating), -07 (revoke, worker
// told), -08 (one active endorsement per Verifier per worker; several Verifiers fine), -09 (worker
// told of a vouch), -11 (live "N endorsed, M went on to build a good rating"), -12 (payoff on the
// first rating at 4.0+), -13 / -14 (the one-time prompts) — with the Prisma client mocked.
import { jest } from "@jest/globals";

const prismaMock = {
  $transaction: jest.fn(),
  $queryRaw: jest.fn(),
  user: { findUnique: jest.fn(), findFirst: jest.fn(), count: jest.fn(), updateMany: jest.fn() },
  endorsement: {
    count: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    updateMany: jest.fn(),
  },
  rating: { groupBy: jest.fn(), count: jest.fn() },
  notification: { create: jest.fn(), createMany: jest.fn() },
  application: { count: jest.fn() },
};
jest.unstable_mockModule("../../../lib/prisma.js", () => ({ default: prismaMock }));

const {
  generateEndorsementCode,
  normaliseCode,
  normalisePhone,
  shareTextFor,
  validateAttributes,
  validateReason,
  getMyCode,
  lookupCode,
  searchByPhone,
  createEndorsement,
  listGiven,
  revokeEndorsement,
  getPrompts,
  setPromptsShown,
  CODE_MISS,
  PHONE_MISS,
  ALREADY_VOUCHED,
} = await import("../endorsement.service.js");
const { onRatingsRevealed } = await import("../endorsement.hooks.js");
const { revealedRatingsWhere } = await import("../../rating/rating.service.js");

const VERIFIER = { id: "v1", role: "COMMUNITY_ENDORSER" };
const VERIFIER_2 = { id: "v2", role: "COMMUNITY_ENDORSER" };
const YOUTH = { id: "w1", role: "YOUTH_JOB_SEEKER" };
const EMPLOYER = { id: "e1", role: "EMPLOYER" };
const KAVINDU = { id: "w1", legalName: "Kavindu Perera", phone: "+94771234567" };

beforeEach(() => {
  jest.resetAllMocks();
  prismaMock.$transaction.mockImplementation((fn) => fn(prismaMock));
  prismaMock.$queryRaw.mockResolvedValue([{ id: "w1" }]);
  prismaMock.endorsement.count.mockResolvedValue(0);
  prismaMock.endorsement.findFirst.mockResolvedValue(null);
  prismaMock.user.findUnique.mockResolvedValue({ legalName: "Sunil Bandara", endorsementCode: null });
  prismaMock.endorsement.create.mockImplementation(({ data }) =>
    Promise.resolve({ id: "end-1", createdAt: new Date(), revokedAt: null, ...data }),
  );
});

/** The error a call rejects with, so two errors can be compared field by field. */
async function errorOf(promise) {
  try {
    await promise;
  } catch (err) {
    return { status: err.status, message: err.message, code: err.code };
  }
  throw new Error("expected a rejection");
}

describe("FR-ENDORSE-02: the code itself", () => {
  test("six characters, letters and digits, never the misreadable 0 O 1 I", () => {
    for (let i = 0; i < 500; i += 1) {
      const code = generateEndorsementCode();
      expect(code).toMatch(/^[A-Z2-9]{6}$/);
      expect(code).not.toMatch(/[0O1I]/);
    }
  });

  test("a typed code is compared unspaced and upper-case (8.1 displays K 7 X A 2 B)", () => {
    expect(normaliseCode("k 7 x a 2 b")).toBe("K7XA2B");
    expect(normaliseCode("K7XA2")).toBeNull();
    expect(normaliseCode(123456)).toBeNull();
  });

  test("8.1s share text, word for word, with the code unspaced", () => {
    expect(shareTextFor("K7XA2B")).toBe(
      "My YouthLink endorsement code: K7XA2B — enter it in the app to vouch for me.",
    );
  });
});

describe("FR-ENDORSE-02 / -05: GET /me/code (8.1 / 8.1b)", () => {
  test("an eligible worker with no code gets one, stored unspaced and only if still unset", async () => {
    prismaMock.user.count.mockResolvedValue(1);
    prismaMock.user.updateMany.mockResolvedValue({ count: 1 });
    const result = await getMyCode({ user: YOUTH });

    const { where, data } = prismaMock.user.updateMany.mock.calls[0][0];
    expect(where).toEqual({ id: "w1", endorsementCode: null });
    expect(data.endorsementCode).toMatch(/^[A-Z2-9]{6}$/);
    expect(result).toEqual({ eligible: true, code: data.endorsementCode, shareText: shareTextFor(data.endorsementCode) });
  });

  test("persistent: a worker who already has a code keeps it", async () => {
    prismaMock.user.count.mockResolvedValue(1);
    prismaMock.user.findUnique.mockResolvedValue({ endorsementCode: "K7XA2B" });
    await expect(getMyCode({ user: YOUTH })).resolves.toMatchObject({ eligible: true, code: "K7XA2B" });
    expect(prismaMock.user.updateMany).not.toHaveBeenCalled();
  });

  test("a code already taken by someone else is drawn again", async () => {
    prismaMock.user.count.mockResolvedValue(1);
    prismaMock.user.updateMany
      .mockRejectedValueOnce(Object.assign(new Error("unique"), { code: "P2002" }))
      .mockResolvedValueOnce({ count: 1 });
    const { code } = await getMyCode({ user: YOUTH });
    expect(prismaMock.user.updateMany).toHaveBeenCalledTimes(2);
    expect(code).toBe(prismaMock.user.updateMany.mock.calls[1][0].data.endorsementCode);
  });

  test("window closed: no code at all — not even the stored one (8.1b)", async () => {
    prismaMock.user.count.mockResolvedValue(0);
    prismaMock.user.findUnique.mockResolvedValue({ endorsementCode: "K7XA2B" });
    await expect(getMyCode({ user: YOUTH })).resolves.toEqual({ eligible: false, code: null, shareText: null });
  });

  test("eligibility is one query: active job-seeker, never stamped, no revealed rating (removed ones too)", async () => {
    prismaMock.user.count.mockResolvedValue(0);
    await getMyCode({ user: YOUTH });
    const { where } = prismaMock.user.count.mock.calls[0][0];
    expect(where).toMatchObject({
      id: "w1",
      role: "YOUTH_JOB_SEEKER",
      accountStatus: "ACTIVE",
      suspendedAt: null,
      deletedAt: null,
      firstRatingReceivedAt: null,
    });
    // The Ratings module's "revealed" rule, minus removedAt: removal never reopens the window.
    const { removedAt, ...revealed } = revealedRatingsWhere();
    expect(removedAt).toBeNull();
    expect(where.ratingsReceived.none).toEqual({ OR: [revealed.OR[0], expect.any(Object)] });
    expect(where.ratingsReceived.none).not.toHaveProperty("removedAt");
  });

  test("only a job-seeker has a code", async () => {
    await expect(getMyCode({ user: VERIFIER })).rejects.toMatchObject({ status: 403 });
  });
});

describe("FR-ENDORSE-02: POST /lookup-code (8.2)", () => {
  test("a valid code for an eligible worker names them", async () => {
    prismaMock.user.findFirst.mockResolvedValue(KAVINDU);
    await expect(lookupCode({ user: VERIFIER, code: "k7xa2b" })).resolves.toEqual({ workerId: "w1", name: "Kavindu Perera" });
    const { where } = prismaMock.user.findFirst.mock.calls[0][0];
    expect(where).toMatchObject({ endorsementCode: "K7XA2B", firstRatingReceivedAt: null, role: "YOUTH_JOB_SEEKER" });
  });

  test("an unknown code and a closed window are indistinguishable: same status, words and code", async () => {
    // Both are the same single query returning nothing — the eligibility rule is part of the lookup.
    prismaMock.user.findFirst.mockResolvedValue(null);
    const unknown = await errorOf(lookupCode({ user: VERIFIER, code: "ZZZZZZ" }));
    const closed = await errorOf(lookupCode({ user: VERIFIER, code: "K7XA2B" }));
    const malformed = await errorOf(lookupCode({ user: VERIFIER, code: "12" }));
    expect(unknown).toEqual({ status: 404, message: CODE_MISS, code: "NO_ELIGIBLE_MATCH" });
    expect(closed).toEqual(unknown);
    expect(malformed).toEqual(unknown);
    expect(CODE_MISS).toBe("That code didn't work. Check it with the person who shared it.");
  });

  test("a code for someone this Verifier already vouches for is refused on 8.2", async () => {
    prismaMock.user.findFirst.mockResolvedValue(KAVINDU);
    prismaMock.endorsement.count.mockResolvedValue(1);
    await expect(errorOf(lookupCode({ user: VERIFIER, code: "K7XA2B" }))).resolves.toEqual({
      status: 409,
      message: "You already vouch for them.",
      code: "ALREADY_VOUCHED",
    });
  });

  test("only a Verifier can look a code up", async () => {
    await expect(lookupCode({ user: YOUTH, code: "K7XA2B" })).rejects.toMatchObject({ status: 403 });
    await expect(lookupCode({ user: EMPLOYER, code: "K7XA2B" })).rejects.toMatchObject({ status: 403 });
  });
});

describe("FR-ENDORSE-03: POST /search-phone (8.3)", () => {
  test("phone formats normalise to the stored E.164 form", () => {
    expect(normalisePhone("+94 77 123 4567")).toBe("+94771234567");
    expect(normalisePhone("077-123-4567")).toBe("+94771234567");
    expect(normalisePhone("77 123 4567")).toBe("+94771234567");
    expect(normalisePhone("94771234567")).toBe("+94771234567");
    expect(normalisePhone("   ")).toBeNull();
  });

  test("a match returns one person — name and matched number only (8.3m)", async () => {
    prismaMock.user.findFirst.mockResolvedValue(KAVINDU);
    const result = await searchByPhone({ user: VERIFIER, phone: "77 123 4567" });
    expect(result).toEqual({ workerId: "w1", name: "Kavindu Perera", phone: "+94771234567", alreadyVouched: false });
    expect(prismaMock.user.findFirst.mock.calls[0][0].where).toMatchObject({ phone: "+94771234567", accountStatus: "ACTIVE" });
  });

  test("someone already vouched for is shown with alreadyVouched (8.3m, no Vouch button)", async () => {
    prismaMock.user.findFirst.mockResolvedValue(KAVINDU);
    prismaMock.endorsement.count.mockResolvedValue(1);
    await expect(searchByPhone({ user: VERIFIER, phone: "+94771234567" })).resolves.toMatchObject({ alreadyVouched: true });
  });

  test("no account and an ineligible account get the same generic answer (8.3d)", async () => {
    prismaMock.user.findFirst.mockResolvedValue(null);
    const noAccount = await errorOf(searchByPhone({ user: VERIFIER, phone: "+94719990000" }));
    const ineligible = await errorOf(searchByPhone({ user: VERIFIER, phone: "+94771234567" }));
    const empty = await errorOf(searchByPhone({ user: VERIFIER, phone: "" }));
    expect(noAccount).toEqual({ status: 404, message: PHONE_MISS, code: "NO_ELIGIBLE_MATCH" });
    expect(ineligible).toEqual(noAccount);
    expect(empty).toEqual(noAccount);
    expect(PHONE_MISS).toBe("No one to show for that number.");
  });

  test("only a Verifier can search", async () => {
    await expect(searchByPhone({ user: YOUTH, phone: "+94771234567" })).rejects.toMatchObject({ status: 403 });
  });
});

describe("FR-ENDORSE-04: attribute and reason validation", () => {
  test("attributes are optional; only the fixed list; deduplicated, in list order", () => {
    expect(validateAttributes(undefined)).toEqual([]);
    expect(validateAttributes([])).toEqual([]);
    expect(validateAttributes(["RELIABILITY", "PUNCTUALITY", "RELIABILITY"])).toEqual(["PUNCTUALITY", "RELIABILITY"]);
    expect(() => validateAttributes(["KINDNESS"])).toThrow(expect.objectContaining({ status: 400 }));
    expect(() => validateAttributes("PUNCTUALITY")).toThrow(expect.objectContaining({ status: 400 }));
  });

  test("reason: optional, trimmed, up to 300 characters, blank means none", () => {
    expect(validateReason(undefined)).toBeNull();
    expect(validateReason("   ")).toBeNull();
    expect(validateReason("  My neighbour — known him 8 years ")).toBe("My neighbour — known him 8 years");
    expect(validateReason("x".repeat(300))).toHaveLength(300);
    expect(() => validateReason("x".repeat(301))).toThrow(expect.objectContaining({ status: 400 }));
  });
});

describe("FR-ENDORSE-04 / -08 / -09: POST / — the vouch (8.4 / 8.4e)", () => {
  test("no attributes and no reason: accepted, live at once, the worker told", async () => {
    prismaMock.user.findFirst.mockResolvedValue(KAVINDU);
    const { endorsement } = await createEndorsement({ user: VERIFIER, workerId: "w1", entryPoint: "CODE" });

    expect(prismaMock.endorsement.create).toHaveBeenCalledWith({
      data: { endorserId: "v1", workerId: "w1", attributes: [], reason: null, entryPoint: "CODE" },
    });
    // No pending state: the stored row is active (revokedAt null) and nothing else is required.
    expect(endorsement).toMatchObject({ workerName: "Kavindu Perera", attributes: [], reason: null, active: true });
    expect(prismaMock.notification.create).toHaveBeenCalledWith({
      data: { userId: "w1", type: "ENDORSEMENT_RECEIVED", payload: { endorsementId: "end-1", endorserName: "Sunil Bandara" } },
    });
  });

  test("selected attributes and a reason are stored; only the selected ones come back, as labels", async () => {
    prismaMock.user.findFirst.mockResolvedValue(KAVINDU);
    const { endorsement } = await createEndorsement({
      user: VERIFIER,
      workerId: "w1",
      entryPoint: "PHONE_SEARCH",
      attributes: ["RELIABILITY", "PUNCTUALITY"],
      reason: " My neighbour — known him 8 years ",
    });
    expect(prismaMock.endorsement.create.mock.calls[0][0].data).toMatchObject({
      attributes: ["PUNCTUALITY", "RELIABILITY"],
      reason: "My neighbour — known him 8 years",
      entryPoint: "PHONE_SEARCH",
    });
    expect(endorsement.attributes).toEqual(["Punctuality", "Reliability"]);
  });

  test("the worker's row is locked before eligibility is re-checked", async () => {
    prismaMock.user.findFirst.mockResolvedValue(KAVINDU);
    await createEndorsement({ user: VERIFIER, workerId: "w1", entryPoint: "CODE" });
    expect(prismaMock.$queryRaw.mock.calls[0][0].join("?")).toMatch(/FROM "User" WHERE "id" = \? FOR UPDATE/);
    expect(prismaMock.$queryRaw.mock.invocationCallOrder[0]).toBeLessThan(prismaMock.user.findFirst.mock.invocationCallOrder[0]);
    expect(prismaMock.user.findFirst.mock.calls[0][0].where).toMatchObject({ id: "w1", firstRatingReceivedAt: null });
  });

  test("FR-ENDORSE-02 criterion 3: a worker who has since been rated is refused, nothing stored", async () => {
    prismaMock.user.findFirst.mockResolvedValue(null);
    await expect(errorOf(createEndorsement({ user: VERIFIER, workerId: "w1", entryPoint: "CODE" }))).resolves.toEqual({
      status: 404,
      message: CODE_MISS,
      code: "NO_ELIGIBLE_MATCH",
    });
    await expect(createEndorsement({ user: VERIFIER, workerId: "w1", entryPoint: "PHONE_SEARCH" })).rejects.toMatchObject({
      status: 404,
      message: PHONE_MISS,
    });
    expect(prismaMock.endorsement.create).not.toHaveBeenCalled();
    expect(prismaMock.notification.create).not.toHaveBeenCalled();
  });

  test("FR-ENDORSE-08: the same Verifier vouching twice is refused", async () => {
    prismaMock.user.findFirst.mockResolvedValue(KAVINDU);
    prismaMock.endorsement.count.mockResolvedValue(1);
    await expect(createEndorsement({ user: VERIFIER, workerId: "w1", entryPoint: "CODE" })).rejects.toMatchObject({
      status: 409,
      message: ALREADY_VOUCHED,
    });
    expect(prismaMock.endorsement.count.mock.calls[0][0].where).toEqual({ endorserId: "v1", workerId: "w1", revokedAt: null });
    expect(prismaMock.endorsement.create).not.toHaveBeenCalled();
  });

  test("FR-ENDORSE-08: two devices at once — the partial unique index's failure is the same refusal", async () => {
    prismaMock.user.findFirst.mockResolvedValue(KAVINDU);
    prismaMock.endorsement.create.mockRejectedValue(Object.assign(new Error("unique"), { code: "P2002" }));
    await expect(createEndorsement({ user: VERIFIER, workerId: "w1", entryPoint: "CODE" })).rejects.toMatchObject({
      status: 409,
      message: "You already vouch for them.",
    });
  });

  test("FR-ENDORSE-08: a second Verifier is accepted alongside the first", async () => {
    prismaMock.user.findFirst.mockResolvedValue(KAVINDU);
    // v1 already vouches; v2 does not — the check is per Verifier.
    prismaMock.endorsement.count.mockImplementation(({ where }) => Promise.resolve(where.endorserId === "v1" ? 1 : 0));
    await expect(createEndorsement({ user: VERIFIER_2, workerId: "w1", entryPoint: "PHONE_SEARCH" })).resolves.toHaveProperty(
      "endorsement",
    );
    expect(prismaMock.endorsement.create.mock.calls[0][0].data.endorserId).toBe("v2");
  });

  test("bad input is refused before the database: entry point, attributes, reason, workerId", async () => {
    await expect(createEndorsement({ user: VERIFIER, workerId: "w1", entryPoint: "LINK" })).rejects.toMatchObject({ status: 400 });
    await expect(
      createEndorsement({ user: VERIFIER, workerId: "w1", entryPoint: "CODE", attributes: ["KINDNESS"] }),
    ).rejects.toMatchObject({ status: 400 });
    await expect(
      createEndorsement({ user: VERIFIER, workerId: "w1", entryPoint: "CODE", reason: "x".repeat(301) }),
    ).rejects.toMatchObject({ status: 400 });
    await expect(createEndorsement({ user: VERIFIER, entryPoint: "CODE" })).rejects.toMatchObject({ status: 400 });
    expect(prismaMock.$transaction).not.toHaveBeenCalled();
  });

  test("only a Verifier can vouch", async () => {
    await expect(createEndorsement({ user: YOUTH, workerId: "w2", entryPoint: "CODE" })).rejects.toMatchObject({ status: 403 });
  });
});

describe("FR-ENDORSE-07: POST /:id/revoke (8.5c)", () => {
  test("revokes the caller's own active endorsement and tells the worker, with no reason", async () => {
    prismaMock.endorsement.updateMany.mockResolvedValue({ count: 1 });
    prismaMock.endorsement.findUnique.mockResolvedValue({ id: "end-1", workerId: "w1", endorser: { legalName: "Sunil Bandara" } });
    const { endorsement } = await revokeEndorsement({ user: VERIFIER, endorsementId: "end-1" });

    const { where, data } = prismaMock.endorsement.updateMany.mock.calls[0][0];
    expect(where).toEqual({ id: "end-1", endorserId: "v1", revokedAt: null });
    expect(Object.keys(data)).toEqual(["revokedAt"]);
    expect(endorsement).toEqual({ id: "end-1", revokedAt: data.revokedAt });
    expect(prismaMock.notification.create).toHaveBeenCalledWith({
      data: { userId: "w1", type: "ENDORSEMENT_REVOKED", payload: { endorsementId: "end-1", endorserName: "Sunil Bandara" } },
    });
  });

  test("someone else's endorsement, or none, is 404; an already-revoked one is 409; neither notifies", async () => {
    prismaMock.endorsement.updateMany.mockResolvedValue({ count: 0 });
    prismaMock.endorsement.findFirst.mockResolvedValueOnce(null);
    await expect(revokeEndorsement({ user: VERIFIER, endorsementId: "end-x" })).rejects.toMatchObject({ status: 404 });
    prismaMock.endorsement.findFirst.mockResolvedValueOnce({ id: "end-1" });
    await expect(revokeEndorsement({ user: VERIFIER, endorsementId: "end-1" })).rejects.toMatchObject({ status: 409 });
    expect(prismaMock.notification.create).not.toHaveBeenCalled();
  });

  test("only a Verifier can revoke", async () => {
    await expect(revokeEndorsement({ user: YOUTH, endorsementId: "end-1" })).rejects.toMatchObject({ status: 403 });
  });
});

describe("FR-ENDORSE-11: GET /given — the track record, live (8.5)", () => {
  const row = (id, workerId, legalName, extra = {}) => ({
    id,
    workerId,
    worker: { legalName },
    reason: null,
    attributes: [],
    entryPoint: "CODE",
    createdAt: new Date(),
    revokedAt: null,
    ...extra,
  });
  const group = (rateeId, avg, count) => ({ rateeId, _avg: { score: avg }, _count: { _all: count } });

  beforeEach(() => {
    prismaMock.endorsement.findMany.mockResolvedValue([
      row("a", "w1", "Kavindu Perera", { attributes: ["RELIABILITY", "PUNCTUALITY"], reason: "My neighbour — known him 8 years" }),
      row("b", "w2", "Ishara Fernando"),
      row("c", "w3", "Chamara Wickramasinghe"), // endorsed, not yet rated
      row("d", "w4", "W. Dilshan", { revokedAt: new Date() }), // revoked: out of N even though rated 5.0
    ]);
    prismaMock.rating.groupBy.mockResolvedValue([group("w1", 3.9, 4), group("w2", 4.0, 1)]);
  });

  test("N counts active endorsements; M those whose worker has a rating and an average of 4.0+", async () => {
    const { trackRecord, endorsements } = await listGiven({ user: VERIFIER });
    expect(trackRecord).toEqual({ endorsedCount: 3, goodRatingCount: 1 });
    expect(endorsements.map((e) => [e.workerName, e.active, e.countsTowardGoodRating])).toEqual([
      ["Kavindu Perera", true, false], // 3.9: below 4.0, out of M
      ["Ishara Fernando", true, true], // exactly 4.0 counts
      ["Chamara Wickramasinghe", true, false], // no rating yet: not in M
      ["W. Dilshan", false, false], // revoked: kept in place, in neither N nor M
    ]);
  });

  test("the averages come from revealed, unremoved ratings of the active workers only, newest endorsement first", async () => {
    await listGiven({ user: VERIFIER });
    expect(prismaMock.endorsement.findMany.mock.calls[0][0]).toMatchObject({
      where: { endorserId: "v1" },
      orderBy: { createdAt: "desc" },
    });
    const { where } = prismaMock.rating.groupBy.mock.calls[0][0];
    expect(where.rateeId).toEqual({ in: ["w1", "w2", "w3"] });
    expect(where.removedAt).toBeNull();
    expect(where.OR).toBeDefined();
  });

  test("only the selected attributes are shown, as the prototype's labels", async () => {
    const { endorsements } = await listGiven({ user: VERIFIER });
    expect(endorsements[0].attributes).toEqual(["Reliability", "Punctuality"]);
    expect(endorsements[1].attributes).toEqual([]);
  });

  test("8.5z: no endorsements, a zero track record and no rating query", async () => {
    prismaMock.endorsement.findMany.mockResolvedValue([]);
    await expect(listGiven({ user: VERIFIER })).resolves.toEqual({ trackRecord: { endorsedCount: 0, goodRatingCount: 0 }, endorsements: [] });
    expect(prismaMock.rating.groupBy).not.toHaveBeenCalled();
  });

  test("private: only a Verifier's own list exists — nobody else can ask for it", async () => {
    await expect(listGiven({ user: YOUTH })).rejects.toMatchObject({ status: 403 });
    await expect(listGiven({ user: EMPLOYER })).rejects.toMatchObject({ status: 403 });
  });
});

describe("FR-ENDORSE-05 / FR-ENDORSE-12: onRatingsRevealed (called by the Ratings module)", () => {
  const reveal = (score, extra = {}) => ({
    engagementId: "eng-1",
    workerId: "w1",
    workerName: "Kavindu Perera",
    ratings: [
      { rateeId: "w1", score },
      { rateeId: "e1", score: 5 },
    ],
    revealedAt: new Date("2026-09-10T10:00:00Z"),
    revealedWhere: revealedRatingsWhere(),
    ...extra,
  });

  beforeEach(() => {
    prismaMock.user.updateMany.mockResolvedValue({ count: 1 });
    prismaMock.rating.count.mockResolvedValue(0);
    prismaMock.endorsement.findMany.mockResolvedValue([{ endorserId: "v1" }, { endorserId: "v2" }]);
  });

  test("the first revealed rating closes the window for good: stamped once, at the reveal", async () => {
    await onRatingsRevealed(prismaMock, reveal(3));
    expect(prismaMock.user.updateMany).toHaveBeenCalledWith({
      where: { id: "w1", role: "YOUTH_JOB_SEEKER", firstRatingReceivedAt: null },
      data: { firstRatingReceivedAt: new Date("2026-09-10T10:00:00Z") },
    });
  });

  test("first rated engagement at 4.0 or more: every active endorser is told it paid off", async () => {
    await expect(onRatingsRevealed(prismaMock, reveal(4))).resolves.toEqual({ firstRating: true, payoffNotified: 2 });
    expect(prismaMock.endorsement.findMany.mock.calls[0][0].where).toEqual({ workerId: "w1", revokedAt: null });
    expect(prismaMock.notification.createMany).toHaveBeenCalledWith({
      data: ["v1", "v2"].map((userId) => ({
        userId,
        type: "ENDORSEMENT_PAYOFF",
        payload: { workerId: "w1", workerName: "Kavindu Perera" },
      })),
    });
  });

  test("first rating below 4.0: window closes, nobody is told", async () => {
    await expect(onRatingsRevealed(prismaMock, reveal(3))).resolves.toEqual({ firstRating: true, payoffNotified: 0 });
    expect(prismaMock.notification.createMany).not.toHaveBeenCalled();
  });

  test("not the first rating (already stamped): no payoff, even at 5 stars", async () => {
    prismaMock.user.updateMany.mockResolvedValue({ count: 0 });
    await onRatingsRevealed(prismaMock, reveal(5));
    expect(prismaMock.notification.createMany).not.toHaveBeenCalled();
  });

  test("an earlier rating that was revealed but never stamped means this one is not the first", async () => {
    prismaMock.rating.count.mockResolvedValue(1);
    await onRatingsRevealed(prismaMock, reveal(5));
    const { where } = prismaMock.rating.count.mock.calls[0][0];
    expect(where).toMatchObject({ rateeId: "w1", engagementId: { not: "eng-1" } });
    expect(where).not.toHaveProperty("removedAt"); // a removed first rating was still the first
    expect(prismaMock.notification.createMany).not.toHaveBeenCalled();
  });

  test("the worker was not rated in this engagement: their window stays open", async () => {
    await onRatingsRevealed(prismaMock, reveal(5, { ratings: [{ rateeId: "e1", score: 5 }] }));
    expect(prismaMock.user.updateMany).not.toHaveBeenCalled();
  });
});

describe("FR-ENDORSE-13 / -14: GET and PATCH /me/prompts", () => {
  /** A worker's state for getPrompts: the counts it asks for, by query. */
  function worker({ eligible = true, bio = null, bioShown = null, suggestionShown = null, applied = 0, unselected = 0, endorsed = 0 } = {}) {
    prismaMock.user.findUnique.mockResolvedValue({ bio, bioPromptShownAt: bioShown, endorsementSuggestionShownAt: suggestionShown });
    prismaMock.user.count.mockResolvedValue(eligible ? 1 : 0);
    prismaMock.application.count.mockImplementation(({ where }) => Promise.resolve(where.status ? unselected : applied));
    prismaMock.endorsement.count.mockResolvedValue(endorsed);
  }

  test("bio prompt: a zero-history worker with no bio who has not applied yet", async () => {
    worker();
    await expect(getPrompts({ user: YOUTH })).resolves.toEqual({ showBioPrompt: true, showEndorsementSuggestion: false });
  });

  test("bio prompt does not recur: bio filled, already shown, already applied, or rating history", async () => {
    for (const state of [{ bio: "Weekend events." }, { bioShown: new Date() }, { applied: 1 }, { eligible: false }]) {
      worker(state);
      expect((await getPrompts({ user: YOUTH })).showBioPrompt).toBe(false);
    }
  });

  test("suggestion: 3 Declined / Not selected outcomes, unendorsed, zero history, never shown", async () => {
    worker({ applied: 4, unselected: 3 });
    expect((await getPrompts({ user: YOUTH })).showEndorsementSuggestion).toBe(true);
    const unselectedQuery = prismaMock.application.count.mock.calls.find((c) => c[0].where.status)[0];
    // Withdrawn is not an unselected outcome (amended 2026-09-23); pending never was.
    expect(unselectedQuery.where).toEqual({ workerId: "w1", status: { in: ["DECLINED", "NOT_SELECTED"] } });
  });

  test("suggestion does not show: two unselected (+ a withdrawal), endorsed, already shown, or rated", async () => {
    for (const state of [
      { applied: 3, unselected: 2 },
      { unselected: 3, endorsed: 1 },
      { unselected: 3, suggestionShown: new Date() },
      { unselected: 3, eligible: false },
    ]) {
      worker(state);
      expect((await getPrompts({ user: YOUTH })).showEndorsementSuggestion).toBe(false);
    }
  });

  test("anyone but a job-seeker gets no prompts", async () => {
    await expect(getPrompts({ user: VERIFIER })).resolves.toEqual({ showBioPrompt: false, showEndorsementSuggestion: false });
  });

  test("PATCH records a prompt as shown once — the first time is kept", async () => {
    worker();
    await setPromptsShown({ user: YOUTH, bioPromptShown: true, endorsementSuggestionShown: true });
    const [bio, suggestion] = prismaMock.user.updateMany.mock.calls.map((c) => c[0]);
    expect(bio.where).toEqual({ id: "w1", bioPromptShownAt: null });
    expect(bio.data.bioPromptShownAt).toBeInstanceOf(Date);
    expect(suggestion.where).toEqual({ id: "w1", endorsementSuggestionShownAt: null });
  });

  test("PATCH refuses anything but true, an empty body, and non-job-seekers", async () => {
    await expect(setPromptsShown({ user: YOUTH, bioPromptShown: false })).rejects.toMatchObject({ status: 400 });
    await expect(setPromptsShown({ user: YOUTH })).rejects.toMatchObject({ status: 400 });
    await expect(setPromptsShown({ user: VERIFIER, bioPromptShown: true })).rejects.toMatchObject({ status: 403 });
    expect(prismaMock.user.updateMany).not.toHaveBeenCalled();
  });
});
