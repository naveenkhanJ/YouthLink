// application.service.test.js
// FR-APPLY-02/03 (apply, withdraw), FR-APPLY-04/05 (the pool), FR-APPLY-06/07 (select),
// FR-APPLY-08 (decline), FR-APPLY-09 (resolvePendingApplicants, YL-174), FR-APPLY-10
// (notifyPendingApplicantsOfChange, YL-175) and FR-APPLY-12 (the 30-day window) — the service
// rules, with the Prisma client and the Gig Posting module mocked so no database is needed.
import { jest } from "@jest/globals";

// One mock client stands in for both the plain client and a transaction client: $transaction
// simply runs the callback with it, so a test can see every call made inside the transaction.
const prismaMock = {
  $queryRaw: jest.fn(),
  $transaction: jest.fn(),
  gigPosting: { findUnique: jest.fn(), update: jest.fn() },
  application: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
  },
  engagement: { create: jest.fn() },
  notification: { create: jest.fn(), createMany: jest.fn() },
  user: { findUnique: jest.fn() },
};
jest.unstable_mockModule("../../../lib/prisma.js", () => ({ default: prismaMock }));

// The Gig Posting module's own rules, reused by import. computeFillStatus is the real one-liner.
const syncPostingStatus = jest.fn();
const getGigPostingById = jest.fn();
jest.unstable_mockModule("../../posting/posting.service.js", () => ({
  syncPostingStatus,
  getGigPostingById,
  computeFillStatus: (filled, needed) => (filled >= needed ? "FILLED" : "OPEN"),
}));
const expireDuePostings = jest.fn();
jest.unstable_mockModule("../../posting/posting.expiry.js", () => ({ expireDuePostings }));

const {
  default: service,
  resolvePendingApplicants,
  notifyPendingApplicantsOfChange,
  generateCheckpointCodes,
  MESSAGES,
} = await import("../application.service.js");

const WORKER = "worker-1";
const EMPLOYER = "employer-1";
const POSTING = "posting-1";
const APP = "application-1";

beforeEach(() => {
  jest.resetAllMocks();
  prismaMock.$transaction.mockImplementation((fn) => fn(prismaMock));
  prismaMock.$queryRaw.mockResolvedValue([]);
  expireDuePostings.mockResolvedValue([]);
});

/** Was the posting's row locked (SELECT … FOR UPDATE) for this posting id? */
function lockedPosting(id) {
  return prismaMock.$queryRaw.mock.calls.some(
    ([strings, ...values]) => strings.join("?").includes("FOR UPDATE") && values.includes(id),
  );
}

const openPosting = (over = {}) => ({
  id: POSTING,
  title: "Event setup crew (3 needed)",
  employerId: EMPLOYER,
  status: "OPEN",
  expiresAt: new Date(Date.now() + 86_400_000),
  autoHiddenAt: null,
  ...over,
});

// ---------------------------------------------------------------------------
describe("FR-APPLY-02: apply", () => {
  test("creates a Pending application under a lock on the posting and tells the employer", async () => {
    prismaMock.gigPosting.findUnique.mockResolvedValue(openPosting());
    prismaMock.application.findFirst.mockResolvedValue(null);
    prismaMock.application.create.mockResolvedValue({ id: APP, status: "PENDING", workerId: WORKER });
    prismaMock.user.findUnique.mockResolvedValue({ legalName: "Kavindu Perera" });

    const application = await service.apply({ workerId: WORKER, gigPostingId: POSTING, note: "  Free all weekend.  " });

    expect(application.status).toBe("PENDING");
    expect(lockedPosting(POSTING)).toBe(true);
    expect(prismaMock.application.create).toHaveBeenCalledWith({
      data: { gigPostingId: POSTING, workerId: WORKER, note: "Free all weekend." },
    });
    expect(prismaMock.notification.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: EMPLOYER,
        type: "APPLICATION_RECEIVED",
        payload: expect.objectContaining({ title: "New applicant for Event setup crew (3 needed)", body: "Kavindu Perera" }),
      }),
    });
  });

  test("an empty note is no note — the application still succeeds", async () => {
    prismaMock.gigPosting.findUnique.mockResolvedValue(openPosting());
    prismaMock.application.findFirst.mockResolvedValue(null);
    prismaMock.application.create.mockResolvedValue({ id: APP });
    await service.apply({ workerId: WORKER, gigPostingId: POSTING, note: "   " });
    expect(prismaMock.application.create.mock.calls[0][0].data.note).toBeNull();
  });

  test("a note over 300 characters is refused before anything is read", async () => {
    await expect(
      service.apply({ workerId: WORKER, gigPostingId: POSTING, note: "x".repeat(301) }),
    ).rejects.toMatchObject({ status: 400, fields: { note: MESSAGES.noteTooLong } });
    expect(prismaMock.$transaction).not.toHaveBeenCalled();
  });

  test("a second application while one is live is blocked (read under the lock)", async () => {
    prismaMock.gigPosting.findUnique.mockResolvedValue(openPosting());
    prismaMock.application.findFirst.mockResolvedValue({ id: "earlier" });
    await expect(service.apply({ workerId: WORKER, gigPostingId: POSTING })).rejects.toMatchObject({
      status: 409,
      message: MESSAGES.alreadyApplied,
    });
    // A withdrawn application does not count (FR-APPLY-03: reapply while Open).
    expect(prismaMock.application.findFirst).toHaveBeenCalledWith({
      where: { gigPostingId: POSTING, workerId: WORKER, status: { not: "WITHDRAWN" } },
      select: { id: true },
    });
    expect(prismaMock.application.create).not.toHaveBeenCalled();
  });

  test("a posting hidden pending review refuses applications (APPLY-E2E-15)", async () => {
    prismaMock.gigPosting.findUnique.mockResolvedValue(openPosting({ autoHiddenAt: new Date() }));
    await expect(service.apply({ workerId: WORKER, gigPostingId: POSTING })).rejects.toMatchObject({
      status: 409,
      message: MESSAGES.postingPaused,
    });
  });

  test("a closed posting, or an Open one past its expiry, refuses applications", async () => {
    prismaMock.gigPosting.findUnique.mockResolvedValueOnce(openPosting({ status: "EXPIRED" }));
    await expect(service.apply({ workerId: WORKER, gigPostingId: POSTING })).rejects.toMatchObject({ status: 409 });

    prismaMock.gigPosting.findUnique.mockResolvedValueOnce(openPosting({ expiresAt: new Date(Date.now() - 1000) }));
    await expect(service.apply({ workerId: WORKER, gigPostingId: POSTING })).rejects.toMatchObject({
      status: 409,
      message: MESSAGES.postingClosed,
    });
  });

  test("an unknown posting is 404", async () => {
    prismaMock.gigPosting.findUnique.mockResolvedValue(null);
    await expect(service.apply({ workerId: WORKER, gigPostingId: POSTING })).rejects.toMatchObject({ status: 404 });
  });
});

// ---------------------------------------------------------------------------
describe("FR-APPLY-03: withdraw", () => {
  test("a Pending application becomes Withdrawn, with withdrawnAt, under the posting lock", async () => {
    prismaMock.application.findUnique
      .mockResolvedValueOnce({ workerId: WORKER, gigPostingId: POSTING })
      .mockResolvedValueOnce({ id: APP, status: "PENDING" });
    prismaMock.application.update.mockResolvedValue({ id: APP, status: "WITHDRAWN" });

    await service.withdraw({ applicationId: APP, workerId: WORKER });

    expect(lockedPosting(POSTING)).toBe(true);
    expect(prismaMock.application.update).toHaveBeenCalledWith({
      where: { id: APP },
      data: { status: "WITHDRAWN", withdrawnAt: expect.any(Date) },
    });
  });

  test("someone else's application answers not found", async () => {
    prismaMock.application.findUnique.mockResolvedValue({ workerId: "someone-else", gigPostingId: POSTING });
    await expect(service.withdraw({ applicationId: APP, workerId: WORKER })).rejects.toMatchObject({ status: 404 });
  });

  test("only a Pending application can be withdrawn", async () => {
    prismaMock.application.findUnique
      .mockResolvedValueOnce({ workerId: WORKER, gigPostingId: POSTING })
      .mockResolvedValueOnce({ id: APP, status: "SELECTED" });
    await expect(service.withdraw({ applicationId: APP, workerId: WORKER })).rejects.toMatchObject({
      status: 409,
      message: MESSAGES.onlyPendingWithdrawn,
    });
  });
});

// ---------------------------------------------------------------------------
describe("FR-APPLY-04 / FR-APPLY-05: getApplicantPool", () => {
  const worker = (id, name, { ratings = [], records = [], endorsements = [] } = {}) => ({
    id,
    legalName: name,
    phone: `+9477000${id}`,
    phoneVerifiedAt: new Date(),
    ratingsReceived: ratings.map((score) => ({ score })),
    completionRecords: records,
    endorsementsReceived: endorsements,
  });
  const application = (id, status, appliedAt, w, engagement = null) => ({
    id,
    status,
    note: `note ${id}`,
    appliedAt: new Date(appliedAt),
    decidedAt: null,
    worker: w,
    engagement,
  });

  beforeEach(() => {
    prismaMock.gigPosting.findUnique.mockResolvedValue({
      id: POSTING,
      employerId: EMPLOYER,
      title: "Event setup crew (3 needed)",
      status: "OPEN",
      workersNeeded: 3,
      filledCount: 1,
      autoHiddenAt: null,
    });
  });

  test("rows come back in tier order with the figures the 4.5 row and 4.6 detail show", async () => {
    prismaMock.application.findMany.mockResolvedValue([
      application("a3", "PENDING", "2026-08-27T03:00:00Z", worker("3", "Kavindu Perera")),
      application(
        "a2",
        "PENDING",
        "2026-08-27T02:00:00Z",
        worker("2", "Tharindu Silva", {
          endorsements: [{ endorser: { legalName: "Roshan Dias" }, attributes: ["RELIABILITY", "PUNCTUALITY"] }],
        }),
      ),
      application(
        "a1",
        "SELECTED",
        "2026-08-27T04:00:00Z",
        worker("1", "Nethmi Jayasinghe", {
          ratings: [5, 4, 5],
          records: [{ outcome: "COMPLETED", weight: 1 }, { outcome: "EARLY_CANCELLATION", weight: 1 }],
          endorsements: [
            { endorser: { legalName: "K. Rathnayake" }, attributes: ["RELIABILITY"] },
            { endorser: { legalName: "M. Perera" }, attributes: ["PUNCTUALITY", "HONESTY"] },
          ],
        }),
        { id: "eng-1", status: "ACTIVE" },
      ),
    ]);

    const { posting, applicants } = await service.getApplicantPool({ gigPostingId: POSTING, employerId: EMPLOYER });

    expect(posting).toMatchObject({ title: "Event setup crew (3 needed)", workersNeeded: 3, filledCount: 1, isHidden: false });
    expect(posting.employerId).toBeUndefined();
    expect(applicants.map((a) => a.worker.displayName)).toEqual(["Nethmi Jayasinghe", "Tharindu Silva", "Kavindu Perera"]);
    expect(applicants.map((a) => a.tier)).toEqual(["history", "endorsedNew", "new"]);
    expect(applicants[0]).toMatchObject({
      ratingAverage: 4.7,
      ratingCount: 3,
      completionRate: 50,
      jobCount: 1,
      endorsementCount: 2,
      endorsers: [
        { name: "K. Rathnayake", attributes: ["Reliability"] },
        { name: "M. Perera", attributes: ["Punctuality", "Honesty"] },
      ],
      engagement: { id: "eng-1", status: "ACTIVE" },
    });
    expect(applicants[0].exactAverage).toBeUndefined();
    // FR-APPLY-07: a phone only for the selected applicant.
    expect(applicants[0].worker.phone).toBe("+94770001");
    expect(applicants[1].worker.phone).toBeNull();
  });

  test("withdrawn applications leave the pool; only revealed, unremoved ratings count", async () => {
    prismaMock.application.findMany.mockResolvedValue([]);
    await service.getApplicantPool({ gigPostingId: POSTING, employerId: EMPLOYER });
    const query = prismaMock.application.findMany.mock.calls[0][0];
    expect(query.where).toEqual({ gigPostingId: POSTING, status: { not: "WITHDRAWN" } });
    // The Ratings module's own "revealed and not removed" filter, so pool and profile agree.
    expect(query.include.worker.select.ratingsReceived.where).toMatchObject({ removedAt: null });
    expect(query.include.worker.select.ratingsReceived.where.OR).toContainEqual({ revealedAt: { not: null } });
    expect(query.include.worker.select.endorsementsReceived.where).toEqual({ revokedAt: null });
  });

  test("another employer's posting is refused", async () => {
    await expect(service.getApplicantPool({ gigPostingId: POSTING, employerId: "other" })).rejects.toMatchObject({
      status: 403,
    });
  });
});

// ---------------------------------------------------------------------------
describe("FR-ENG-01: generateCheckpointCodes", () => {
  test("three distinct six-digit numeric codes, zero-padded", () => {
    const codes = generateCheckpointCodes(true);
    const all = [codes.arrivalCode, codes.completionCode, codes.paymentCode];
    for (const code of all) expect(code).toMatch(/^\d{6}$/);
    expect(new Set(all).size).toBe(3);
  });

  test("a repeated draw is thrown away, so the codes always differ", () => {
    const draws = [42, 42, 42, 7, 7, 999999];
    const random = jest.fn(() => draws.shift());
    expect(generateCheckpointCodes(true, random)).toEqual({
      arrivalCode: "000042",
      completionCode: "000007",
      paymentCode: "999999",
    });
  });

  test("an unpaid internship has no payment code (FR-ENG-02)", () => {
    expect(generateCheckpointCodes(false).paymentCode).toBeNull();
  });
});

// ---------------------------------------------------------------------------
describe("FR-APPLY-06 / FR-APPLY-07: select", () => {
  const pendingApplication = (postingOver = {}) => ({
    id: APP,
    status: "PENDING",
    workerId: WORKER,
    gigPostingId: POSTING,
    worker: { legalName: "Nethmi Jayasinghe", phone: "+94762345678" },
    gigPosting: {
      id: POSTING,
      title: "Event setup crew (3 needed)",
      employerId: EMPLOYER,
      status: "OPEN",
      arrangementType: "GIG",
      payKind: "FIXED_TOTAL",
      workersNeeded: 3,
      filledCount: 0,
      startAt: new Date("2026-08-29T01:30:00Z"),
      expiresAt: new Date(Date.now() + 86_400_000),
      postedAsType: "BUSINESS",
      postedBusinessName: "Lanka Events (Pvt) Ltd",
      employer: { legalName: "Kamal Silva" },
      ...postingOver,
    },
  });

  function arrange(postingOver) {
    prismaMock.application.findUnique
      .mockResolvedValueOnce({ gigPostingId: POSTING })
      .mockResolvedValueOnce(pendingApplication(postingOver));
    prismaMock.engagement.create.mockResolvedValue({ id: "eng-1", status: "ACTIVE" });
  }

  test("creates one Engagement with three distinct codes, fills a place and tells the worker", async () => {
    arrange();
    const result = await service.select({ applicationId: APP, employerId: EMPLOYER });

    expect(lockedPosting(POSTING)).toBe(true);
    expect(prismaMock.application.update).toHaveBeenCalledWith({
      where: { id: APP },
      data: { status: "SELECTED", decidedAt: expect.any(Date) },
    });
    const { data } = prismaMock.engagement.create.mock.calls[0][0];
    expect(data).toMatchObject({ applicationId: APP, workerId: WORKER, employerId: EMPLOYER, paymentStatus: "PENDING" });
    expect(data.contactRevealedAt).toBeInstanceOf(Date);
    const codes = [data.arrivalCode, data.completionCode, data.paymentCode];
    for (const code of codes) expect(code).toMatch(/^\d{6}$/);
    expect(new Set(codes).size).toBe(3);

    expect(prismaMock.gigPosting.update).toHaveBeenCalledWith({
      where: { id: POSTING },
      data: { filledCount: { increment: 1 } },
    });
    expect(syncPostingStatus).toHaveBeenCalledWith(POSTING, prismaMock); // on the same transaction
    expect(prismaMock.notification.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: WORKER,
        type: "APPLICATION_SELECTED",
        payload: expect.objectContaining({
          title: "You're selected for Event setup crew (3 needed)",
          body: "Starts Sat 29 Aug 2026, 7:00 AM · Lanka Events (Pvt) Ltd",
        }),
      }),
    });

    // The employer gets the worker's phone (FR-APPLY-07) and never a check-in code.
    expect(result).toMatchObject({ engagementId: "eng-1", filledCount: 1, postingStatus: "OPEN", resolvedAsNotSelected: 0 });
    expect(result.worker.phone).toBe("+94762345678");
    expect(JSON.stringify(result)).not.toMatch(/Code/);
  });

  test("selecting the last place fills the posting and resolves everyone still Pending", async () => {
    arrange({ workersNeeded: 3, filledCount: 2 });
    prismaMock.gigPosting.findUnique.mockResolvedValue({ id: POSTING, title: "Event setup crew (3 needed)" });
    prismaMock.application.findMany.mockResolvedValue([{ id: "a-2", workerId: "w-2" }, { id: "a-3", workerId: "w-3" }]);

    const result = await service.select({ applicationId: APP, employerId: EMPLOYER });

    expect(result).toMatchObject({ filledCount: 3, postingStatus: "FILLED", resolvedAsNotSelected: 2 });
    expect(prismaMock.application.updateMany).toHaveBeenCalledWith({
      where: { id: { in: ["a-2", "a-3"] }, status: "PENDING" },
      data: { status: "NOT_SELECTED", decidedAt: expect.any(Date) },
    });
    // It ran inside select()'s own transaction, not a second one.
    expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
  });

  test("an Unpaid internship gets arrival and completion codes only (FR-ENG-02)", async () => {
    arrange({ arrangementType: "INTERNSHIP", payKind: "UNPAID" });
    await service.select({ applicationId: APP, employerId: EMPLOYER });
    const { data } = prismaMock.engagement.create.mock.calls[0][0];
    expect(data.paymentCode).toBeNull();
    expect(data.paymentStatus).toBeNull();
    expect(data.arrivalCode).not.toBe(data.completionCode);
  });

  test("no place left: refused, nothing written", async () => {
    arrange({ workersNeeded: 2, filledCount: 2 });
    await expect(service.select({ applicationId: APP, employerId: EMPLOYER })).rejects.toMatchObject({
      status: 409,
      message: MESSAGES.postingFull,
    });
    expect(prismaMock.engagement.create).not.toHaveBeenCalled();
  });

  test("a closed posting cannot select", async () => {
    arrange({ status: "WITHDRAWN" });
    await expect(service.select({ applicationId: APP, employerId: EMPLOYER })).rejects.toMatchObject({
      status: 409,
      message: MESSAGES.postingClosedForSelection,
    });
  });

  test("another employer is refused; a decided application cannot be selected again", async () => {
    arrange();
    await expect(service.select({ applicationId: APP, employerId: "other" })).rejects.toMatchObject({ status: 403 });

    prismaMock.application.findUnique
      .mockResolvedValueOnce({ gigPostingId: POSTING })
      .mockResolvedValueOnce({ ...pendingApplication(), status: "SELECTED" });
    await expect(service.select({ applicationId: APP, employerId: EMPLOYER })).rejects.toMatchObject({
      status: 409,
      message: MESSAGES.onlyPendingSelected,
    });
  });
});

// ---------------------------------------------------------------------------
describe("FR-APPLY-08: decline", () => {
  function arrange(status = "PENDING", employerId = EMPLOYER) {
    prismaMock.application.findUnique
      .mockResolvedValueOnce({ gigPostingId: POSTING })
      .mockResolvedValueOnce({
        id: APP,
        status,
        workerId: WORKER,
        gigPosting: { id: POSTING, title: "Event setup crew (3 needed)", employerId },
      });
  }

  test("Declined at once, with decidedAt, and the applicant is notified whatever places remain", async () => {
    arrange();
    prismaMock.application.update.mockResolvedValue({ id: APP, status: "DECLINED" });
    const result = await service.decline({ applicationId: APP, employerId: EMPLOYER });

    expect(result.status).toBe("DECLINED");
    expect(lockedPosting(POSTING)).toBe(true);
    expect(prismaMock.application.update).toHaveBeenCalledWith({
      where: { id: APP },
      data: { status: "DECLINED", decidedAt: expect.any(Date) },
    });
    expect(prismaMock.notification.create).toHaveBeenCalledWith({
      data: { userId: WORKER, type: "APPLICATION_DECLINED", payload: expect.objectContaining({ applicationId: APP }) },
    });
  });

  test("only a Pending application, and only by its posting's employer", async () => {
    arrange("DECLINED");
    await expect(service.decline({ applicationId: APP, employerId: EMPLOYER })).rejects.toMatchObject({
      status: 409,
      message: MESSAGES.onlyPendingDeclined,
    });
    arrange("PENDING", "other-employer");
    await expect(service.decline({ applicationId: APP, employerId: EMPLOYER })).rejects.toMatchObject({ status: 403 });
  });
});

// ---------------------------------------------------------------------------
describe("FR-APPLY-09: resolvePendingApplicants (YL-174)", () => {
  test("every Pending application becomes Not selected with decidedAt, and each applicant is told", async () => {
    prismaMock.gigPosting.findUnique.mockResolvedValue({ id: POSTING, title: "Stage crew" });
    prismaMock.application.findMany.mockResolvedValue([{ id: "a-1", workerId: "w-1" }, { id: "a-2", workerId: "w-2" }]);

    const result = await resolvePendingApplicants(POSTING, "WITHDRAWN");

    expect(result).toEqual({ resolved: 2 });
    expect(lockedPosting(POSTING)).toBe(true);
    expect(prismaMock.application.updateMany).toHaveBeenCalledWith({
      where: { id: { in: ["a-1", "a-2"] }, status: "PENDING" },
      data: { status: "NOT_SELECTED", decidedAt: expect.any(Date) },
    });
    expect(prismaMock.notification.createMany).toHaveBeenCalledWith({
      data: [
        expect.objectContaining({ userId: "w-1", type: "APPLICATION_NOT_SELECTED", payload: expect.objectContaining({ reason: "WITHDRAWN" }) }),
        expect.objectContaining({ userId: "w-2", type: "APPLICATION_NOT_SELECTED" }),
      ],
    });
  });

  test("safe to call twice: the second call finds nothing Pending and notifies nobody", async () => {
    prismaMock.gigPosting.findUnique.mockResolvedValue({ id: POSTING, title: "Stage crew" });
    prismaMock.application.findMany.mockResolvedValue([]);
    expect(await resolvePendingApplicants(POSTING, "EXPIRED")).toEqual({ resolved: 0 });
    expect(prismaMock.application.updateMany).not.toHaveBeenCalled();
    expect(prismaMock.notification.createMany).not.toHaveBeenCalled();
  });

  test("an unknown posting resolves nothing; an unknown reason is a programming error", async () => {
    prismaMock.gigPosting.findUnique.mockResolvedValue(null);
    expect(await resolvePendingApplicants(POSTING, "FILLED")).toEqual({ resolved: 0 });
    await expect(resolvePendingApplicants(POSTING, "CANCELLED")).rejects.toThrow(TypeError);
  });

  test("runs on a caller's transaction when given one", async () => {
    const tx = {
      ...prismaMock,
      $queryRaw: jest.fn().mockResolvedValue([]),
      gigPosting: { findUnique: jest.fn().mockResolvedValue({ id: POSTING, title: "x" }) },
      application: { findMany: jest.fn().mockResolvedValue([]) },
    };
    await resolvePendingApplicants(POSTING, "FILLED", tx);
    expect(tx.$queryRaw).toHaveBeenCalled();
    expect(prismaMock.$transaction).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
describe("FR-APPLY-10: notifyPendingApplicantsOfChange (YL-175)", () => {
  const posting = {
    id: POSTING,
    title: "Event setup crew (3 needed)",
    startAt: new Date("2026-08-29T01:30:00Z"),
    payKind: "FIXED_TOTAL",
    payAmount: 6000,
    workersNeeded: 3,
  };

  test("each Pending applicant gets APPLICATION_TERMS_CHANGED with the amended title and body", async () => {
    prismaMock.gigPosting.findUnique.mockResolvedValue(posting);
    prismaMock.application.findMany.mockResolvedValue([{ id: "a-1", workerId: "w-1" }]);

    const result = await notifyPendingApplicantsOfChange(POSTING, ["startAt"]);

    expect(result).toEqual({ notified: 1 });
    expect(prismaMock.application.findMany).toHaveBeenCalledWith({
      where: { gigPostingId: POSTING, status: "PENDING" },
      select: { id: true, workerId: true },
    });
    expect(prismaMock.notification.createMany).toHaveBeenCalledWith({
      data: [
        {
          userId: "w-1",
          type: "APPLICATION_TERMS_CHANGED",
          payload: expect.objectContaining({
            applicationId: "a-1",
            gigPostingId: POSTING,
            title: "Event setup crew (3 needed) changed",
            body: "The start moved to Sat 29 Aug 2026, 7:00 AM · you can withdraw if it no longer suits you",
            opens: "applications",
          }),
        },
      ],
    });
  });

  test("no pending applicants, or no material field, notifies nobody", async () => {
    prismaMock.gigPosting.findUnique.mockResolvedValue(posting);
    prismaMock.application.findMany.mockResolvedValue([]);
    expect(await notifyPendingApplicantsOfChange(POSTING, ["payAmount"])).toEqual({ notified: 0 });
    expect(await notifyPendingApplicantsOfChange(POSTING, ["title"])).toEqual({ notified: 0 });
    expect(prismaMock.notification.createMany).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
describe("FR-APPLY-12: getMyApplications", () => {
  const NOW = new Date("2026-10-06T00:00:00Z");
  const day = (n) => new Date(NOW.getTime() + n * 86_400_000);
  const row = (id, status, posting, extra = {}) => ({
    id,
    status,
    appliedAt: day(-40),
    decidedAt: null,
    withdrawnAt: null,
    engagement: null,
    gigPosting: {
      id: `p-${id}`,
      title: `Posting ${id}`,
      status: "OPEN",
      arrangementType: "GIG",
      startAt: day(5),
      expiresAt: day(5),
      createdAt: day(-41),
      workersNeeded: 1,
      filledCount: 0,
      postedAsType: "BUSINESS",
      postedBusinessName: "Saman Stores",
      employer: { legalName: "Kamal Silva" },
      ...posting,
    },
    ...extra,
  });

  test("asks only for pending ones and those decided or withdrawn in the last 30 days", async () => {
    prismaMock.application.findMany.mockResolvedValue([]);
    await service.getMyApplications({ workerId: WORKER, now: NOW });

    expect(expireDuePostings).toHaveBeenCalled(); // closed postings resolve first (criterion 4)
    const since = day(-30);
    expect(prismaMock.application.findMany.mock.calls[0][0].where).toEqual({
      workerId: WORKER,
      OR: [{ status: "PENDING" }, { decidedAt: { gte: since } }, { withdrawnAt: { gte: since } }],
    });
  });

  test("pending first by soonest closing, then Selected, Not selected, Declined, Withdrawn", async () => {
    prismaMock.application.findMany.mockResolvedValue([
      row("withdrawn", "WITHDRAWN", {}, { withdrawnAt: day(-2) }),
      row("declined", "DECLINED", {}, { decidedAt: day(-1) }),
      row("pending-late", "PENDING", { expiresAt: day(20) }),
      row("not-selected", "NOT_SELECTED", { status: "WITHDRAWN" }, { decidedAt: day(-3) }),
      row("pending-soon", "PENDING", { expiresAt: day(2) }),
      row("selected", "SELECTED", {}, { decidedAt: day(-5), engagement: { id: "e", status: "CANCELLED", cancelledByUserId: WORKER } }),
    ]);

    const list = await service.getMyApplications({ workerId: WORKER, now: NOW });

    expect(list.map((a) => a.id)).toEqual([
      "pending-soon",
      "pending-late",
      "selected",
      "not-selected",
      "declined",
      "withdrawn",
    ]);
    expect(list[0].posting.closesAt).toEqual(day(2));
    expect(list[0].posting.employerName).toBe("Saman Stores");
    expect(list[2].engagement).toEqual({ id: "e", status: "CANCELLED", cancelledByYou: true });
    expect(list[3].notSelectedReason).toBe("WITHDRAWN");
  });
});
