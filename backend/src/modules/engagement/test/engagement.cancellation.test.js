// engagement.cancellation.test.js
// FR-ENG-05 (a request with a 48-hour window, answered or auto-resolved against the non-responder),
// FR-ENG-06 (immediate, Late or not), FR-ENG-07 (the record against the responsible party, 2.0 /
// 1.0), FR-ENG-08 (one place reopens, with the posting row locked) and FR-ENG-09 rule 4 (a change
// not accepted in time) — engagement.cancellation.js with Prisma replaced by an in-memory mock.
import { jest } from "@jest/globals";

const prismaMock = {
  engagement: { findUnique: jest.fn(), updateMany: jest.fn() },
  cancellationRequest: { create: jest.fn(), findMany: jest.fn(), findFirst: jest.fn(), findUnique: jest.fn(), updateMany: jest.fn() },
  materialChangeRequest: { findMany: jest.fn(), findUnique: jest.fn(), updateMany: jest.fn() },
  completionRecord: { create: jest.fn() },
  notification: { create: jest.fn() },
  gigPosting: { updateMany: jest.fn() },
  $transaction: jest.fn(),
  $queryRaw: jest.fn(),
};
const syncPostingStatus = jest.fn();

jest.unstable_mockModule("../../../lib/prisma.js", () => ({ default: prismaMock }));
jest.unstable_mockModule("../../posting/posting.service.js", () => ({ syncPostingStatus }));

const { cancelEngagement, respondToCancellation, resolveOverdue, startEngagementDeadlineSweep } = await import(
  "../engagement.cancellation.js"
);

const HOUR = 3600e3;
const DAY = 24 * HOUR;
const now = new Date("2026-08-31T12:00:00Z");

let row; // the engagement row
let requests; // its cancellation requests

function engagementRow({ startIn, createdAgo = 2 * DAY, ...overrides } = {}) {
  return {
    id: "e1",
    gigPostingId: "p1",
    workerId: "w1",
    employerId: "m1",
    status: "ACTIVE",
    arrivalStatus: "PENDING",
    startedAt: null,
    createdAt: new Date(now.getTime() - createdAgo),
    gigPosting: {
      id: "p1",
      title: "Grade 8 maths tutoring",
      startAt: new Date(now.getTime() + startIn),
      postedAsType: "INDIVIDUAL",
      postedBusinessName: null,
    },
    worker: { legalName: "Kavindu Perera" },
    employer: { legalName: "Dilrukshi Herath", businessName: null },
    ...overrides,
  };
}

beforeEach(() => {
  jest.resetAllMocks();
  row = engagementRow({ startIn: 7 * DAY });
  requests = [];
  prismaMock.$transaction.mockImplementation(async (fn) => fn(prismaMock));
  prismaMock.$queryRaw.mockResolvedValue([]);
  prismaMock.engagement.findUnique.mockImplementation(async () => ({
    ...row,
    cancellationRequests: requests.filter((r) => r.status === "PENDING"),
  }));
  prismaMock.engagement.updateMany.mockImplementation(async ({ where, data }) => {
    if (where.status && row.status !== where.status) return { count: 0 };
    Object.assign(row, data);
    return { count: 1 };
  });
  prismaMock.cancellationRequest.create.mockImplementation(async ({ data }) => {
    const created = { id: `r${requests.length + 1}`, ...data };
    requests.push(created);
    return created;
  });
  prismaMock.cancellationRequest.findFirst.mockImplementation(async () => requests.find((r) => r.status === "PENDING") ?? null);
  prismaMock.cancellationRequest.findUnique.mockImplementation(async ({ where }) => requests.find((r) => r.id === where.id) ?? null);
  prismaMock.cancellationRequest.updateMany.mockImplementation(async ({ where, data }) => {
    const target = requests.find((r) => r.id === where.id && r.status === where.status);
    if (!target) return { count: 0 };
    Object.assign(target, data);
    return { count: 1 };
  });
  prismaMock.cancellationRequest.findMany.mockResolvedValue([]);
  prismaMock.materialChangeRequest.findMany.mockResolvedValue([]);
  prismaMock.materialChangeRequest.updateMany.mockResolvedValue({ count: 1 });
  prismaMock.gigPosting.updateMany.mockResolvedValue({ count: 1 });
});

async function attempt(promise) {
  try {
    return await promise;
  } catch (err) {
    return err;
  }
}

const sent = () => prismaMock.notification.create.mock.calls.map(([{ data }]) => [data.userId, data.type]);
const records = () => prismaMock.completionRecord.create.mock.calls.map(([{ data }]) => [data.userId, data.outcome, data.weight]);

describe("FR-ENG-05: more than 48 hours to the start → a request", () => {
  test("a PENDING request with a 48-hour deadline; the responder is told; nothing is cancelled yet", async () => {
    const result = await cancelEngagement({ engagementId: "e1", userId: "w1", reason: "SCHEDULE_CONFLICT", now });
    const deadline = new Date(now.getTime() + 48 * HOUR);
    expect(result).toEqual({ mode: "REQUESTED", deadline });
    expect(requests[0]).toMatchObject({ requestedByUserId: "w1", status: "PENDING", isUrgentEngagement: false, deadline });
    expect(row.status).toBe("ACTIVE");
    expect(sent()).toEqual([["m1", "CANCELLATION_REQUEST"]]);
    expect(records()).toEqual([]);
  });

  test("a reason outside the fixed list is refused", async () => {
    const err = await attempt(cancelEngagement({ engagementId: "e1", userId: "w1", reason: "BORED", now }));
    expect(err.status).toBe(400);
    expect(requests).toHaveLength(0);
  });

  test("a second request while one is pending is refused", async () => {
    await cancelEngagement({ engagementId: "e1", userId: "w1", reason: "SCHEDULE_CONFLICT", now });
    const err = await attempt(cancelEngagement({ engagementId: "e1", userId: "m1", reason: "OTHER", now }));
    expect(err.status).toBe(409);
  });

  test("an engagement that has started cannot be cancelled", async () => {
    row = engagementRow({ startIn: -HOUR });
    const err = await attempt(cancelEngagement({ engagementId: "e1", userId: "w1", reason: "OTHER", now }));
    expect(err.status).toBe(409);
    expect(row.status).toBe("ACTIVE");
  });

  test("someone outside the engagement gets 403", async () => {
    const err = await attempt(cancelEngagement({ engagementId: "e1", userId: "x9", reason: "OTHER", now }));
    expect(err.status).toBe(403);
  });
});

describe("FR-ENG-05: answering a request", () => {
  beforeEach(async () => {
    await cancelEngagement({ engagementId: "e1", userId: "m1", reason: "SCHEDULE_CONFLICT", now }); // the employer asks
    jest.clearAllMocks();
  });

  test("accept: cancelled, attributed to the requester, early (1.0) against the REQUESTER, place reopened, requester told", async () => {
    const result = await respondToCancellation({ engagementId: "e1", userId: "w1", accept: true, now });
    expect(result).toEqual({ outcome: "ACCEPTED", engagementStatus: "CANCELLED" });
    expect(row).toMatchObject({
      status: "CANCELLED",
      cancelledByUserId: "m1",
      cancellationReason: "SCHEDULE_CONFLICT",
      isLateCancellation: false, // a regular cancellation is never Late
      ratingOpenedAt: now,
      ratingEnforced: false, // FR-RATE-05
    });
    expect(records()).toEqual([["m1", "EARLY_CANCELLATION", 1.0]]);
    expect(sent()).toEqual([["m1", "CANCELLATION_RESOLVED"]]);
    expect(prismaMock.gigPosting.updateMany).toHaveBeenCalledWith({
      where: { id: "p1", filledCount: { gt: 0 } },
      data: { filledCount: { decrement: 1 } },
    });
    expect(syncPostingStatus).toHaveBeenCalledWith("p1", prismaMock);
  });

  test("the posting row is locked FOR UPDATE before its fill count changes", async () => {
    await respondToCancellation({ engagementId: "e1", userId: "w1", accept: true, now });
    const lockSql = prismaMock.$queryRaw.mock.calls.map(([strings]) => strings.join("?"));
    expect(lockSql.some((sql) => sql.includes('"GigPosting"') && sql.includes("FOR UPDATE"))).toBe(true);
    const lockOrder = prismaMock.$queryRaw.mock.invocationCallOrder.at(-1);
    expect(lockOrder).toBeLessThan(prismaMock.gigPosting.updateMany.mock.invocationCallOrder[0]);
  });

  test("don't agree: the engagement stands, no record, the requester is told", async () => {
    const result = await respondToCancellation({ engagementId: "e1", userId: "w1", accept: false, now });
    expect(result).toEqual({ outcome: "REJECTED", engagementStatus: "ACTIVE" });
    expect(row.status).toBe("ACTIVE");
    expect(records()).toEqual([]);
    expect(sent()).toEqual([["m1", "CANCELLATION_RESOLVED"]]);
    expect(prismaMock.gigPosting.updateMany).not.toHaveBeenCalled();
  });

  test("the requester cannot answer their own request", async () => {
    const err = await attempt(respondToCancellation({ engagementId: "e1", userId: "m1", accept: true, now }));
    expect(err.status).toBe(403);
  });
});

describe("FR-ENG-06: 48 hours or less → immediate", () => {
  test("not Late: takes effect at once, early (1.0) against the canceller, the other party told", async () => {
    row = engagementRow({ startIn: 12 * HOUR, createdAgo: 18 * HOUR }); // booked 30 h before the start
    const result = await cancelEngagement({ engagementId: "e1", userId: "w1", reason: "FOUND_OTHER_WORK", now });
    expect(result).toEqual({ mode: "CANCELLED", isLate: false, lateReason: null });
    expect(requests[0]).toMatchObject({ status: "IMMEDIATE", isUrgentEngagement: true, deadline: null });
    expect(row).toMatchObject({ status: "CANCELLED", cancelledByUserId: "w1", isLateCancellation: false });
    expect(records()).toEqual([["w1", "EARLY_CANCELLATION", 1.0]]);
    expect(sent()).toEqual([["m1", "CANCELLATION_RESOLVED"]]);
    expect(syncPostingStatus).toHaveBeenCalledTimes(1);
  });

  test("booked three days ahead, cancelled 12 hours before: Late, weight 2.0 against the canceller", async () => {
    row = engagementRow({ startIn: 12 * HOUR, createdAgo: 3 * DAY - 12 * HOUR });
    const result = await cancelEngagement({ engagementId: "e1", userId: "m1", reason: "OTHER", now });
    expect(result).toMatchObject({ isLate: true, lateReason: "BOOKED_AHEAD" });
    expect(records()).toEqual([["m1", "LATE_CANCELLATION", 2.0]]);
    expect(sent()).toEqual([["w1", "CANCELLATION_RESOLVED"]]);
  });

  test("under 6 hours before the start: Late", async () => {
    row = engagementRow({ startIn: 5 * HOUR, createdAgo: 20 * HOUR });
    const result = await cancelEngagement({ engagementId: "e1", userId: "w1", reason: "PERSONAL_EMERGENCY", now });
    expect(result).toMatchObject({ isLate: true, lateReason: "UNDER_6_HOURS" });
    expect(records()).toEqual([["w1", "LATE_CANCELLATION", 2.0]]);
  });
});

describe("FR-ENG-05: no answer within 48 hours resolves against the non-responder", () => {
  test("the cancellation takes effect at the deadline; the record goes against the non-responder; the requester is told", async () => {
    const deadline = new Date(now.getTime() - HOUR);
    requests.push({ id: "r1", engagementId: "e1", requestedByUserId: "m1", reason: "SCHEDULE_CONFLICT", status: "PENDING", deadline });
    prismaMock.cancellationRequest.findMany.mockResolvedValue([{ id: "r1", engagementId: "e1" }]);

    const result = await resolveOverdue({ now });
    expect(result).toEqual({ cancellations: 1, changes: 0 });
    expect(requests[0].status).toBe("AUTO_RESOLVED_NO_RESPONSE");
    expect(row).toMatchObject({ status: "CANCELLED", cancelledAt: deadline, cancelledByUserId: "m1", isLateCancellation: false });
    expect(records()).toEqual([["w1", "EARLY_CANCELLATION", 1.0]]);
    expect(sent()).toEqual([["m1", "CANCELLATION_RESOLVED"]]);
    expect(syncPostingStatus).toHaveBeenCalledWith("p1", prismaMock);
  });

  test("an answer arriving after the window finds the request already resolved", async () => {
    const deadline = new Date(now.getTime() - HOUR);
    requests.push({ id: "r1", engagementId: "e1", requestedByUserId: "m1", reason: "OTHER", status: "PENDING", deadline });
    prismaMock.cancellationRequest.findMany.mockResolvedValue([{ id: "r1", engagementId: "e1" }]);
    const err = await attempt(respondToCancellation({ engagementId: "e1", userId: "w1", accept: false, now }));
    expect(err.status).toBe(409);
    expect(row.status).toBe("CANCELLED");
  });

  test("only overdue requests are looked for, and only on Active engagements", async () => {
    await resolveOverdue({ now, userId: "w1" });
    expect(prismaMock.cancellationRequest.findMany.mock.calls[0][0].where).toEqual({
      status: "PENDING",
      deadline: { lte: now },
      engagement: { status: "ACTIVE", OR: [{ workerId: "w1" }, { employerId: "w1" }] },
    });
  });
});

describe("FR-ENG-09 rule 4: a material change not accepted in time", () => {
  test("goes the same way as declining it: cancelled as the employer's change, no record, place reopened", async () => {
    const deadline = new Date(now.getTime() - 2 * HOUR);
    prismaMock.materialChangeRequest.findMany.mockResolvedValue([{ id: "c1", engagementId: "e1" }]);
    prismaMock.materialChangeRequest.findUnique.mockResolvedValue({ id: "c1", status: "PENDING", deadline });

    const result = await resolveOverdue({ now });
    expect(result).toEqual({ cancellations: 0, changes: 1 });
    expect(prismaMock.materialChangeRequest.updateMany).toHaveBeenCalledWith({
      where: { id: "c1", status: "PENDING" },
      data: { status: "DECLINED_ROUTED_TO_CANCELLATION", respondedAt: null },
    });
    expect(row).toMatchObject({ status: "CANCELLED", cancelledByUserId: "m1", cancelledAt: deadline, ratingEnforced: false });
    expect(records()).toEqual([]);
    expect(requests[0]).toMatchObject({ requestedByUserId: "m1", status: "IMMEDIATE" });
    expect(syncPostingStatus).toHaveBeenCalledWith("p1", prismaMock);
  });
});

describe("the sweep", () => {
  test("runs on a timer that never keeps the process alive", () => {
    const timer = startEngagementDeadlineSweep(60_000);
    expect(typeof timer.hasRef === "function" ? timer.hasRef() : false).toBe(false);
    clearInterval(timer);
  });
});
