// dispute.service.test.js
// FR-DISPUTE-01 (report: fixed reasons, anonymity, one per reporter), FR-DISPUTE-02 (three
// distinct reporters auto-hide, silently), FR-DISPUTE-03/04 + FR-NOTIF-12 (openDisputeCase: the
// respondent, the 48-hour window, the notification), FR-DISPUTE-04/05 (respond once, inside the
// window; 3 images of 5 MB per party), FR-DISPUTE-07 (the case as either party sees it) — with
// Prisma and the file system replaced by mocks. The mock's transaction runs the callback against
// the same client; a throw inside it is what would roll a real transaction back.
import { jest } from "@jest/globals";

const prismaMock = {
  gigPosting: { findUnique: jest.fn(), updateMany: jest.fn() },
  user: { findUnique: jest.fn(), updateMany: jest.fn() },
  engagement: { findUnique: jest.fn() },
  report: { findFirst: jest.fn(), create: jest.fn(), findMany: jest.fn() },
  disputeCase: { findFirst: jest.fn(), findUnique: jest.fn(), findMany: jest.fn(), create: jest.fn(), updateMany: jest.fn() },
  disputeEvidence: { count: jest.fn(), create: jest.fn(), findUnique: jest.fn() },
  notification: { create: jest.fn(), createMany: jest.fn() },
  $transaction: jest.fn(),
  $queryRaw: jest.fn(),
};
const fsMock = { mkdir: jest.fn(), writeFile: jest.fn(), unlink: jest.fn() };

jest.unstable_mockModule("../../../lib/prisma.js", () => ({ default: prismaMock }));
jest.unstable_mockModule("fs/promises", () => ({ ...fsMock, default: fsMock }));

const { default: service, MESSAGES, UPLOADS_ROOT } = await import("../dispute.service.js");
const { disputeUploadBodyParser } = await import("../dispute.routes.js");

const HOUR = 3600e3;
const now = new Date("2026-08-31T09:00:00Z");

async function attempt(promise) {
  try {
    return await promise;
  } catch (err) {
    return err;
  }
}

/** The SQL text of every raw query (the FOR UPDATE locks). */
const lockedTables = () =>
  prismaMock.$queryRaw.mock.calls.map(([strings]) => strings.join("?").match(/FROM "(\w+)"/)[1]);

beforeEach(() => {
  jest.resetAllMocks();
  prismaMock.$transaction.mockImplementation(async (fn) => fn(prismaMock));
  prismaMock.disputeCase.updateMany.mockResolvedValue({ count: 0 });
  fsMock.mkdir.mockResolvedValue(undefined);
  fsMock.writeFile.mockResolvedValue(undefined);
  fsMock.unlink.mockResolvedValue(undefined);
});

// ---------------------------------------------------------------------------
// FR-DISPUTE-01 / 02 — reports
// ---------------------------------------------------------------------------

describe("FR-DISPUTE-01: filing a report", () => {
  const posting = { id: "p1", employerId: "m1", autoHiddenAt: null };
  const file = (input) =>
    attempt(service.fileReport({ reporterId: "w1", targetType: "POSTING", targetId: "p1", reason: "FRAUD_SCAM", now, ...input }));

  beforeEach(() => {
    prismaMock.gigPosting.findUnique.mockResolvedValue({ ...posting });
    prismaMock.report.findFirst.mockResolvedValue(null);
    prismaMock.report.create.mockImplementation(async ({ data }) => ({ id: "r1", ...data }));
    prismaMock.report.findMany.mockResolvedValue([{ reporterId: "w1" }]);
  });

  test("a reason from the fixed list is required", async () => {
    for (const reason of [undefined, "", "SPAM", "fraud_scam"]) {
      const err = await file({ reason });
      expect(err.status).toBe(400);
      expect(err.message).toBe(MESSAGES.reportReason);
    }
    expect(prismaMock.report.create).not.toHaveBeenCalled();
  });

  test("one report queues, hides nothing, and the response never names anyone or the hide state", async () => {
    const result = await file({ detail: "  Asks for a registration fee up front.  " });
    expect(result).toEqual({
      report: {
        id: "r1",
        targetType: "POSTING",
        targetId: "p1",
        reason: "FRAUD_SCAM",
        detail: "Asks for a registration fee up front.",
        status: "QUEUED",
        createdAt: now,
      },
      alreadyReported: false,
    });
    expect(prismaMock.report.create.mock.calls[0][0].data).toMatchObject({ reporterId: "w1", targetGigPostingId: "p1" });
    expect(prismaMock.gigPosting.updateMany).not.toHaveBeenCalled();
    // FR-DISPUTE-02 amendment A25: nobody is notified at any report.
    expect(prismaMock.notification.create).not.toHaveBeenCalled();
    expect(lockedTables()).toEqual(["GigPosting"]);
  });

  test("detail is optional and capped at 300 characters (9.1)", async () => {
    expect((await file({ detail: "x".repeat(301) })).status).toBe(400);
    const ok = await file({ detail: "x".repeat(300) });
    expect(ok.report.detail).toHaveLength(300);
    const blank = await file({ detail: "   " });
    expect(blank.report.detail).toBeNull();
  });

  test("you can't report your own posting, or yourself", async () => {
    const own = await attempt(service.fileReport({ reporterId: "m1", targetType: "POSTING", targetId: "p1", reason: "OTHER", now }));
    expect(own.status).toBe(400);
    expect(own.message).toBe(MESSAGES.ownPosting);

    prismaMock.user.findUnique.mockResolvedValue({ id: "w1", accountStatus: "ACTIVE", deletedAt: null });
    const self = await file({ targetType: "USER", targetId: "w1" });
    expect(self.status).toBe(400);
    expect(self.message).toBe(MESSAGES.ownProfile);
  });

  test("an unknown target type or a missing target is refused", async () => {
    expect((await file({ targetType: "COMMENT" })).status).toBe(400);
    prismaMock.gigPosting.findUnique.mockResolvedValue(null);
    expect((await file({})).status).toBe(404);
  });

  test("the same reporter again, while their report is queued: success, no second row", async () => {
    prismaMock.report.findFirst.mockResolvedValue({ id: "r0", reporterId: "w1", targetGigPostingId: "p1", reason: "OTHER", status: "QUEUED", createdAt: now });
    const result = await file({});
    expect(result.alreadyReported).toBe(true);
    expect(result.report.id).toBe("r0");
    expect(prismaMock.report.create).not.toHaveBeenCalled();
  });

  test("an engagement: only a party, only while Active, and the row targets the engagement alone", async () => {
    prismaMock.engagement.findUnique.mockResolvedValue({ id: "e1", workerId: "w1", employerId: "m1", status: "ACTIVE" });
    const ok = await file({ targetType: "ENGAGEMENT", targetId: "e1", reason: "HARASSMENT" });
    expect(ok.report.targetType).toBe("ENGAGEMENT");
    const data = prismaMock.report.create.mock.calls[0][0].data;
    expect(data).toMatchObject({ targetEngagementId: "e1" });
    expect(data).not.toHaveProperty("targetUserId");
    // Engagement reports never hide anything.
    expect(prismaMock.report.findMany).not.toHaveBeenCalled();

    const outsider = await attempt(service.fileReport({ reporterId: "x9", targetType: "ENGAGEMENT", targetId: "e1", reason: "OTHER", now }));
    expect(outsider.status).toBe(403);

    prismaMock.engagement.findUnique.mockResolvedValue({ id: "e1", workerId: "w1", employerId: "m1", status: "COMPLETED" });
    const done = await file({ targetType: "ENGAGEMENT", targetId: "e1" });
    expect(done.status).toBe(409);
  });
});

describe("FR-DISPUTE-02: the third independent report auto-hides", () => {
  beforeEach(() => {
    prismaMock.report.findFirst.mockResolvedValue(null);
    prismaMock.report.create.mockImplementation(async ({ data }) => ({ id: "r3", ...data }));
    prismaMock.gigPosting.findUnique.mockResolvedValue({ id: "p1", employerId: "m1", autoHiddenAt: null });
    prismaMock.gigPosting.updateMany.mockResolvedValue({ count: 1 });
  });

  test("three distinct reporters among queued reports hide the posting, silently", async () => {
    prismaMock.report.findMany.mockResolvedValue([{ reporterId: "a" }, { reporterId: "b" }, { reporterId: "w1" }]);
    const result = await service.fileReport({ reporterId: "w1", targetType: "POSTING", targetId: "p1", reason: "FRAUD_SCAM", now });
    expect(prismaMock.report.findMany).toHaveBeenCalledWith({
      where: { targetGigPostingId: "p1", status: "QUEUED" },
      distinct: ["reporterId"],
      select: { reporterId: true },
    });
    expect(prismaMock.gigPosting.updateMany).toHaveBeenCalledWith({
      where: { id: "p1", autoHiddenAt: null },
      data: { autoHiddenAt: now },
    });
    expect(prismaMock.notification.create).not.toHaveBeenCalled();
    expect(prismaMock.notification.createMany).not.toHaveBeenCalled();
    expect(JSON.stringify(result)).not.toMatch(/hidden/i);
  });

  test("two distinct reporters hide nothing", async () => {
    prismaMock.report.findMany.mockResolvedValue([{ reporterId: "a" }, { reporterId: "w1" }]);
    await service.fileReport({ reporterId: "w1", targetType: "POSTING", targetId: "p1", reason: "OTHER", now });
    expect(prismaMock.gigPosting.updateMany).not.toHaveBeenCalled();
  });

  test("a profile is hidden the same way", async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: "u7", accountStatus: "ACTIVE", deletedAt: null, autoHiddenAt: null });
    prismaMock.user.updateMany.mockResolvedValue({ count: 1 });
    prismaMock.report.findMany.mockResolvedValue([{ reporterId: "a" }, { reporterId: "b" }, { reporterId: "w1" }]);
    await service.fileReport({ reporterId: "w1", targetType: "USER", targetId: "u7", reason: "HARASSMENT", now });
    expect(prismaMock.user.updateMany).toHaveBeenCalledWith({ where: { id: "u7", autoHiddenAt: null }, data: { autoHiddenAt: now } });
    expect(lockedTables()).toEqual(["User"]);
  });
});

// ---------------------------------------------------------------------------
// FR-DISPUTE-03 / 04 — opening a case
// ---------------------------------------------------------------------------

const engagement = {
  id: "e1",
  gigPostingId: "p1",
  workerId: "w1",
  employerId: "m1",
  gigPosting: { title: "Shop assistant — weekend", postedAsType: "BUSINESS", postedBusinessName: "Saman Stores" },
  worker: { legalName: "Kavindu Perera" },
  employer: { legalName: "Saman Silva", businessName: "Saman Stores" },
};

describe("FR-DISPUTE-03 / FR-NOTIF-12: openDisputeCase", () => {
  beforeEach(() => {
    prismaMock.disputeCase.findFirst.mockResolvedValue(null);
    prismaMock.disputeCase.create.mockImplementation(async ({ data }) => ({ id: "dc1", ...data }));
  });

  test("the other party responds within 48 hours and is told, with the case and the deadline", async () => {
    const { disputeCase, created } = await service.openDisputeCase(prismaMock, {
      engagement,
      triggerType: "UNABLE_TO_CONFIRM",
      raisedByUserId: "w1",
      checkpoint: "arrival",
      now,
    });
    expect(created).toBe(true);
    expect(disputeCase).toMatchObject({
      engagementId: "e1",
      triggerType: "UNABLE_TO_CONFIRM",
      raisedByUserId: "w1",
      respondentUserId: "m1",
      respondentDeadline: new Date(now.getTime() + 48 * HOUR),
      status: "AWAITING_RESPONSE",
    });
    expect(prismaMock.notification.create).toHaveBeenCalledTimes(1);
    expect(prismaMock.notification.create.mock.calls[0][0].data).toEqual({
      userId: "m1",
      type: "DISPUTE_OPENED",
      payload: {
        disputeCaseId: "dc1",
        engagementId: "e1",
        gigPostingId: "p1",
        postingTitle: "Shop assistant — weekend",
        title: "Shop assistant — weekend",
        triggerType: "UNABLE_TO_CONFIRM",
        checkpoint: "arrival",
        counterpartName: "Kavindu Perera",
        openedByName: "Kavindu Perera",
        respondBy: new Date(now.getTime() + 48 * HOUR),
      },
    });
  });

  test("an engagement with a case still open gets no second one", async () => {
    prismaMock.disputeCase.findFirst.mockResolvedValue({ id: "dc0", status: "UNDER_REVIEW" });
    const { disputeCase, created } = await service.openDisputeCase(prismaMock, {
      engagement,
      triggerType: "END_ENGAGEMENT_ISSUE",
      raisedByUserId: "m1",
      now,
    });
    expect(created).toBe(false);
    expect(disputeCase.id).toBe("dc0");
    expect(prismaMock.disputeCase.create).not.toHaveBeenCalled();
    expect(prismaMock.notification.create).not.toHaveBeenCalled();
  });

  test("a stalled auto-flag: no raiser, no respondent, no window, Under review, both told", async () => {
    await service.openDisputeCase(prismaMock, { engagement, triggerType: "STALLED_AUTO_FLAG", now });
    expect(prismaMock.disputeCase.create.mock.calls[0][0].data).toMatchObject({
      raisedByUserId: null,
      respondentUserId: null,
      respondentDeadline: null,
      status: "UNDER_REVIEW",
    });
    const rows = prismaMock.notification.createMany.mock.calls[0][0].data;
    expect(rows.map((r) => [r.userId, r.type, r.payload.stalled, r.payload.counterpartName])).toEqual([
      ["w1", "DISPUTE_OPENED", true, "Saman Stores"],
      ["m1", "DISPUTE_OPENED", true, "Kavindu Perera"],
    ]);
  });
});

// ---------------------------------------------------------------------------
// FR-DISPUTE-07 — the case as either party sees it
// ---------------------------------------------------------------------------

const deadline = new Date(now.getTime() + 46 * HOUR);
function caseRow(overrides = {}) {
  return {
    id: "dc1",
    engagementId: "e1",
    reportId: null,
    triggerType: "UNABLE_TO_CONFIRM",
    raisedByUserId: "w1",
    respondentUserId: "m1",
    respondentDeadline: deadline,
    respondentStatement: null,
    respondedAt: null,
    status: "AWAITING_RESPONSE",
    moderatorAccountId: null,
    adminAccountId: null,
    resolution: null,
    resolutionNotes: "internal triage notes",
    resolvedAt: null,
    createdAt: new Date(now.getTime() - 2 * HOUR),
    engagement: { ...engagement, status: "DISPUTED", arrivalStatus: "UNABLE_TO_CONFIRM", completionStatus: "PENDING", paymentStatus: null },
    evidence: [],
    clarifications: [],
    ...overrides,
  };
}

describe("FR-DISPUTE-07: the case", () => {
  test("9.2 and 9.2r: the same case, each party named by the other, the window visible to both", async () => {
    prismaMock.disputeCase.findUnique.mockResolvedValue(caseRow());
    const asRaiser = await service.getCase({ caseId: "dc1", userId: "w1", now });
    const asRespondent = await service.getCase({ caseId: "dc1", userId: "m1", now });
    expect(asRaiser).toMatchObject({
      status: "AWAITING_RESPONSE",
      triggerType: "UNABLE_TO_CONFIRM",
      checkpoint: "arrival",
      viewerRole: "RAISER",
      postingTitle: "Shop assistant — weekend",
      counterpartName: "Saman Stores",
      openedByMe: true,
      respondentDeadline: deadline,
      hasResponded: false,
      canRespond: false,
      clarificationRequest: null,
      outcome: null,
    });
    expect(asRespondent).toMatchObject({ viewerRole: "RESPONDENT", counterpartName: "Kavindu Perera", canRespond: true, respondentDeadline: deadline });
    // Staff-only and identity fields never leave the server.
    for (const body of [asRaiser, asRespondent]) {
      const text = JSON.stringify(body);
      expect(text).not.toContain("internal triage notes");
      expect(body).not.toHaveProperty("raisedByUserId");
      expect(body).not.toHaveProperty("respondentUserId");
    }
  });

  test("anyone outside the case gets 403; a missing case 404", async () => {
    prismaMock.disputeCase.findUnique.mockResolvedValue(caseRow());
    expect((await attempt(service.getCase({ caseId: "dc1", userId: "x9", now }))).status).toBe(403);
    prismaMock.disputeCase.findUnique.mockResolvedValue(null);
    expect((await attempt(service.getCase({ caseId: "dc1", userId: "w1", now }))).status).toBe(404);
  });

  test("FR-DISPUTE-04: reading a case whose window has lapsed settles it to Under review", async () => {
    prismaMock.disputeCase.findUnique.mockResolvedValue(caseRow());
    const later = new Date(deadline.getTime() + 1);
    const body = await service.getCase({ caseId: "dc1", userId: "m1", now: later });
    expect(prismaMock.disputeCase.updateMany).toHaveBeenCalledWith({
      where: { status: "AWAITING_RESPONSE", respondentDeadline: { lte: later }, id: "dc1" },
      data: { status: "UNDER_REVIEW" },
    });
    expect(body).toMatchObject({ status: "UNDER_REVIEW", canRespond: false });
  });

  test("9.2f: the outcome is visible to both, from each side", async () => {
    const resolvedAt = new Date(now.getTime() - HOUR);
    prismaMock.disputeCase.findUnique.mockResolvedValue(
      caseRow({ status: "RESOLVED", resolution: "RULED_FOR_RAISER", resolvedAt, adminAccountId: "a1" }),
    );
    const asRaiser = await service.getCase({ caseId: "dc1", userId: "w1", now });
    const asRespondent = await service.getCase({ caseId: "dc1", userId: "m1", now });
    expect(asRaiser.outcome).toEqual({ resolution: "RULED_FOR_RAISER", resolvedAt, decidedBy: "ADMIN", inViewersFavour: true });
    expect(asRespondent.outcome.inViewersFavour).toBe(false);
  });

  test("9.2c: an open clarification request for the viewer is shown with its deadline", async () => {
    const qDeadline = new Date(now.getTime() + 20 * HOUR);
    prismaMock.disputeCase.findUnique.mockResolvedValue(
      caseRow({
        status: "UNDER_REVIEW",
        clarifications: [{ id: "q1", question: "What time did you arrive?", deadline: qDeadline, respondedAt: null, createdAt: now }],
      }),
    );
    const body = await service.getCase({ caseId: "dc1", userId: "w1", now });
    expect(body.clarificationRequest).toEqual({ id: "q1", question: "What time did you arrive?", deadline: qDeadline });
    // Only the viewer's own questions are read.
    expect(prismaMock.disputeCase.findUnique.mock.calls[0][0].include.clarifications.where).toEqual({ requestedFromUserId: "w1" });
  });

  test("a stalled case: both parties are just PARTY, no window", async () => {
    prismaMock.disputeCase.findUnique.mockResolvedValue(
      caseRow({ triggerType: "STALLED_AUTO_FLAG", raisedByUserId: null, respondentUserId: null, respondentDeadline: null, status: "UNDER_REVIEW" }),
    );
    const body = await service.getCase({ caseId: "dc1", userId: "m1", now });
    expect(body).toMatchObject({ viewerRole: "PARTY", checkpoint: null, canRespond: false, respondentDeadline: null });
    expect(body.evidence.canAdd).toBe(false);
  });

  test("NFR-PRIV-05: a report-type case names no counterpart", async () => {
    prismaMock.disputeCase.findUnique.mockResolvedValue(caseRow({ triggerType: "REPORT", reportId: "r1" }));
    const body = await service.getCase({ caseId: "dc1", userId: "m1", now });
    expect(body.counterpartName).toBeNull();
  });

  test("by engagement: the open case, or null when there has never been one", async () => {
    prismaMock.engagement.findUnique.mockResolvedValue({ id: "e1", workerId: "w1", employerId: "m1" });
    prismaMock.disputeCase.findMany.mockResolvedValue([]);
    expect(await service.getCaseForEngagement({ engagementId: "e1", userId: "w1", now })).toBeNull();

    prismaMock.disputeCase.findMany.mockResolvedValue([{ id: "dc1", status: "UNDER_REVIEW" }, { id: "dc0", status: "RESOLVED" }]);
    prismaMock.disputeCase.findUnique.mockResolvedValue(caseRow());
    const body = await service.getCaseForEngagement({ engagementId: "e1", userId: "w1", now });
    expect(body.id).toBe("dc1");
    expect(prismaMock.disputeCase.findUnique.mock.calls[0][0].where).toEqual({ id: "dc1" });

    expect((await attempt(service.getCaseForEngagement({ engagementId: "e1", userId: "x9", now }))).status).toBe(403);
  });
});

// ---------------------------------------------------------------------------
// FR-DISPUTE-04 / 05 — responding, evidence
// ---------------------------------------------------------------------------

const JPEG = Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0]), Buffer.alloc(100)]);
const PNG = Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), Buffer.alloc(100)]);
const jpeg = () => ({ mimeType: "image/jpeg", dataBase64: JPEG.toString("base64") });
const png = () => ({ mimeType: "image/png", dataBase64: PNG.toString("base64") });

describe("FR-DISPUTE-04: the respondent's answer (9.3)", () => {
  let current;
  beforeEach(() => {
    current = caseRow();
    prismaMock.disputeCase.findUnique.mockImplementation(async () => ({ ...current }));
    prismaMock.disputeCase.updateMany.mockImplementation(async ({ where, data }) => {
      if (where.respondedAt === null && current.respondedAt) return { count: 0 };
      if (where.respondentDeadline) return { count: 0 }; // the lapse sweep: nothing lapsed
      Object.assign(current, data);
      return { count: 1 };
    });
    prismaMock.disputeEvidence.count.mockResolvedValue(0);
    prismaMock.disputeEvidence.create.mockResolvedValue({});
  });

  const respond = (userId, body, at = now) => attempt(service.respondToCase({ caseId: "dc1", userId, now: at, ...body }));

  test("statement and photos: recorded once, the case moves to Under review, files stored under uploads/disputes/<case>", async () => {
    const body = await respond("m1", { statement: "  My brother was there and the worker did arrive.  ", images: [jpeg(), png()] });
    expect(current).toMatchObject({
      respondentStatement: "My brother was there and the worker did arrive.",
      respondedAt: now,
      status: "UNDER_REVIEW",
    });
    expect(body).toMatchObject({ status: "UNDER_REVIEW", hasResponded: true, canRespond: false });
    expect(lockedTables()).toEqual(["DisputeCase"]);
    const urls = prismaMock.disputeEvidence.create.mock.calls.map(([{ data }]) => data.imageUrl);
    expect(urls).toHaveLength(2);
    expect(urls[0]).toMatch(/^disputes\/dc1\/[0-9a-f-]{36}\.jpg$/);
    expect(urls[1]).toMatch(/^disputes\/dc1\/[0-9a-f-]{36}\.png$/);
    expect(prismaMock.disputeEvidence.create.mock.calls[0][0].data).toMatchObject({ disputeCaseId: "dc1", submittedByUserId: "m1" });
    expect(fsMock.writeFile).toHaveBeenCalledTimes(2);
    expect(fsMock.writeFile.mock.calls[0][0].startsWith(UPLOADS_ROOT)).toBe(true);
    expect(fsMock.writeFile.mock.calls[0][1].equals(JPEG)).toBe(true);
  });

  test("only the respondent, and only once", async () => {
    const raiser = await respond("w1", { statement: "Hello." });
    expect(raiser.status).toBe(403);
    expect(raiser.message).toBe(MESSAGES.notRespondent);
    expect((await respond("x9", { statement: "Hello." })).status).toBe(403);

    await respond("m1", { statement: "First." });
    const again = await respond("m1", { statement: "Second." });
    expect(again.status).toBe(409);
    expect(again.message).toBe(MESSAGES.alreadyResponded);
    expect(current.respondentStatement).toBe("First.");
  });

  test("not after the window has closed", async () => {
    const err = await respond("m1", { statement: "Late." }, new Date(deadline.getTime() + 1));
    expect(err.status).toBe(409);
    expect(err.message).toBe(MESSAGES.windowClosed);
    expect(current.respondedAt).toBeNull();
  });

  test("a statement over 300 characters, or an empty response, is refused", async () => {
    const long = await respond("m1", { statement: "x".repeat(301) });
    expect(long.message).toBe(MESSAGES.statementTooLong);
    const empty = await respond("m1", { statement: "   " });
    expect(empty.status).toBe(400);
    expect(empty.message).toBe(MESSAGES.emptyResponse);
    // Photos alone are a response: evidence is optional, and so is the statement.
    const photosOnly = await respond("m1", { images: [jpeg()] });
    expect(photosOnly.hasResponded).toBe(true);
  });

  test("FR-DISPUTE-05: a 4th image is blocked, counting what the party already attached", async () => {
    const four = await respond("m1", { statement: "x", images: [jpeg(), jpeg(), jpeg(), jpeg()] });
    expect(four.status).toBe(400);
    expect(four.message).toBe(MESSAGES.tooManyImages);

    prismaMock.disputeEvidence.count.mockResolvedValue(2);
    const over = await respond("m1", { statement: "x", images: [jpeg(), jpeg()] });
    expect(over.status).toBe(400);
    expect(over.message).toBe(MESSAGES.tooManyImages);
    expect(fsMock.writeFile).not.toHaveBeenCalled();
    expect(current.respondedAt).toBeNull();
  });

  test("FR-DISPUTE-05: a file over 5MB is blocked; a wrong type or an unreadable file too", async () => {
    const big = Buffer.concat([Buffer.from([0xff, 0xd8, 0xff]), Buffer.alloc(5 * 1024 * 1024)]);
    const tooBig = await respond("m1", { images: [{ mimeType: "image/jpeg", dataBase64: big.toString("base64") }] });
    expect(tooBig.status).toBe(400);
    expect(tooBig.message).toBe(MESSAGES.imageTooLarge);

    const gif = await respond("m1", { images: [{ mimeType: "image/gif", dataBase64: JPEG.toString("base64") }] });
    expect(gif.message).toBe(MESSAGES.imageType);

    const lying = await respond("m1", { images: [{ mimeType: "image/png", dataBase64: JPEG.toString("base64") }] });
    expect(lying.message).toBe(MESSAGES.imageUnreadable);

    const garbage = await respond("m1", { images: [{ mimeType: "image/jpeg", dataBase64: "not base64!!" }] });
    expect(garbage.message).toBe(MESSAGES.imageUnreadable);
    expect(fsMock.writeFile).not.toHaveBeenCalled();
  });

  test("exactly 5MB is allowed", async () => {
    const exact = Buffer.concat([Buffer.from([0xff, 0xd8, 0xff]), Buffer.alloc(5 * 1024 * 1024 - 3)]);
    const body = await respond("m1", { images: [{ mimeType: "image/jpeg", dataBase64: exact.toString("base64") }] });
    expect(body.hasResponded).toBe(true);
  });

  test("files written for a response that then fails are removed", async () => {
    prismaMock.disputeEvidence.create.mockResolvedValueOnce({}).mockRejectedValueOnce(new Error("db down"));
    const err = await respond("m1", { statement: "x", images: [jpeg(), png()] });
    expect(err.message).toBe("db down");
    expect(fsMock.unlink).toHaveBeenCalledTimes(2);
  });
});

describe("FR-DISPUTE-05: evidence from either party", () => {
  let current;
  beforeEach(() => {
    current = caseRow();
    prismaMock.disputeCase.findUnique.mockImplementation(async () => ({ ...current }));
    prismaMock.disputeEvidence.count.mockResolvedValue(0);
    prismaMock.disputeEvidence.create.mockResolvedValue({});
  });

  test("the raiser may attach while the window is open; it changes nothing about the case", async () => {
    const body = await service.addEvidence({ caseId: "dc1", userId: "w1", images: [jpeg()], now });
    expect(prismaMock.disputeEvidence.create.mock.calls[0][0].data.submittedByUserId).toBe("w1");
    expect(body.status).toBe("AWAITING_RESPONSE");
  });

  test("not after the window, not with no images, not by an outsider, and 3 per party", async () => {
    const late = await attempt(service.addEvidence({ caseId: "dc1", userId: "w1", images: [jpeg()], now: new Date(deadline.getTime() + 1) }));
    expect(late.status).toBe(409);
    const none = await attempt(service.addEvidence({ caseId: "dc1", userId: "w1", images: [], now }));
    expect(none.message).toBe(MESSAGES.noImages);
    const outsider = await attempt(service.addEvidence({ caseId: "dc1", userId: "x9", images: [jpeg()], now }));
    expect(outsider.status).toBe(403);
    prismaMock.disputeEvidence.count.mockResolvedValue(3);
    const fourth = await attempt(service.addEvidence({ caseId: "dc1", userId: "w1", images: [jpeg()], now }));
    expect(fourth.message).toBe(MESSAGES.tooManyImages);
  });

  test("an image is served only to the party who submitted it", async () => {
    prismaMock.disputeEvidence.findUnique.mockResolvedValue({ id: "ev1", imageUrl: "disputes/dc1/abc.jpg", submittedByUserId: "w1" });
    const file = await service.getEvidenceFile({ evidenceId: "ev1", userId: "w1" });
    expect(file.contentType).toBe("image/jpeg");
    expect(file.absolutePath.startsWith(UPLOADS_ROOT.replace(/[\\/]$/, ""))).toBe(true);
    expect((await attempt(service.getEvidenceFile({ evidenceId: "ev1", userId: "m1" }))).status).toBe(403);

    prismaMock.disputeEvidence.findUnique.mockResolvedValue({ id: "ev2", imageUrl: "../../etc/passwd", submittedByUserId: "w1" });
    expect((await attempt(service.getEvidenceFile({ evidenceId: "ev2", userId: "w1" }))).status).toBe(404);
  });
});

describe("the upload body parser for app.js", () => {
  test("reads only the two upload routes; everything else is left to the global parser", () => {
    const next = jest.fn();
    disputeUploadBodyParser({ method: "POST", path: "/reports", headers: {} }, {}, next);
    disputeUploadBodyParser({ method: "GET", path: "/cases/dc1", headers: {} }, {}, next);
    expect(next).toHaveBeenCalledTimes(2);
  });
});
