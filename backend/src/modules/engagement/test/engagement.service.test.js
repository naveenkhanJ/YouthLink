// engagement.service.test.js
// FR-ENG-01/02/04 (code verification: custody, wrong codes recorded, single use, order, per-
// engagement codes), FR-ENG-12 (End Engagement routing), FR-ENG-09 (the worker's answer to a
// material change) and FR-ENG-14 (the list) — engagement.service.js with Prisma replaced by an
// in-memory mock. The mock's transaction runs the callback against the same client; a throw
// inside it is what would roll a real transaction back.
import { jest } from "@jest/globals";

const prismaMock = {
  engagement: { findUnique: jest.fn(), findMany: jest.fn(), update: jest.fn(), updateMany: jest.fn() },
  completionRecord: { create: jest.fn() },
  notification: { create: jest.fn(), createMany: jest.fn() },
  materialChangeRequest: { findFirst: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), updateMany: jest.fn() },
  cancellationRequest: { create: jest.fn(), findMany: jest.fn(), findFirst: jest.fn(), findUnique: jest.fn(), updateMany: jest.fn() },
  gigPosting: { findUnique: jest.fn(), updateMany: jest.fn() },
  $transaction: jest.fn(),
  $queryRaw: jest.fn(),
};
const syncPostingStatus = jest.fn();

jest.unstable_mockModule("../../../lib/prisma.js", () => ({ default: prismaMock }));
jest.unstable_mockModule("../../posting/posting.service.js", () => ({ syncPostingStatus }));

const { default: service } = await import("../engagement.service.js");

const HOUR = 3600e3;
const DAY = 24 * HOUR;
const now = new Date("2026-08-29T10:00:00Z");

const gig = {
  id: "p1",
  title: "Shop assistant — weekend",
  arrangementType: "GIG",
  payKind: "FIXED_TOTAL",
  startAt: new Date(now.getTime() - 2 * HOUR),
  postedAsType: "BUSINESS",
  postedBusinessName: "Saman Stores",
};

let row; // the engagement as the database holds it; writes are applied to it

function engagementRow(overrides = {}) {
  return {
    id: "e1",
    gigPostingId: "p1",
    workerId: "w1",
    employerId: "m1",
    status: "ACTIVE",
    arrivalStatus: "PENDING",
    completionStatus: "PENDING",
    paymentStatus: null,
    arrivalCode: "358176",
    completionCode: "274065",
    paymentCode: "731942",
    arrivalFailedAttempts: 0,
    completionFailedAttempts: 0,
    paymentFailedAttempts: 0,
    startedAt: null,
    ratingOpenedAt: null,
    ratingEnforced: true,
    gigPosting: gig,
    worker: { id: "w1", legalName: "Kavindu Perera", phone: "+94770000005", phoneVerifiedAt: now },
    employer: { id: "m1", legalName: "Saman Silva", businessName: "Saman Stores", phone: "+94770000002", phoneVerifiedAt: now },
    ratings: [],
    materialChangeRequests: [],
    cancellationRequests: [],
    ...overrides,
  };
}

/** Does `where` (the subset the service uses) match the current row? */
function matches(where) {
  return Object.entries(where).every(([key, value]) => {
    if (key === "id") return value === row.id;
    if (key === "OR") return value.some((alt) => matches(alt));
    return row[key] === value;
  });
}

beforeEach(() => {
  jest.resetAllMocks();
  row = engagementRow();
  prismaMock.$transaction.mockImplementation(async (fn) => fn(prismaMock));
  // resolveOverdue (run before every read): nothing overdue unless a test says so.
  prismaMock.cancellationRequest.findMany.mockResolvedValue([]);
  prismaMock.materialChangeRequest.findMany.mockResolvedValue([]);
  prismaMock.engagement.findUnique.mockImplementation(async () => ({ ...row }));
  prismaMock.engagement.update.mockImplementation(async ({ data }) => {
    for (const [key, value] of Object.entries(data)) {
      row[key] = value && typeof value === "object" && "increment" in value ? row[key] + value.increment : value;
    }
    return { ...row };
  });
  prismaMock.engagement.updateMany.mockImplementation(async ({ where, data }) => {
    if (!matches(where)) return { count: 0 };
    Object.assign(row, data);
    return { count: 1 };
  });
});

async function attempt(promise) {
  try {
    return await promise;
  } catch (err) {
    return err;
  }
}

const verify = (userId, checkpoint, code) =>
  attempt(service.verifyCheckpointCode({ engagementId: "e1", userId, checkpoint, code, now }));

describe("FR-ENG-01: verifying a checkpoint code", () => {
  test("the worker enters the employer's arrival code; arrival is confirmed and the start recorded", async () => {
    const result = await verify("w1", "arrival", "358176");
    expect(result).toMatchObject({ checkpoint: "arrival", engagementStatus: "ACTIVE", nextCheckpoint: "completion" });
    expect(row.arrivalStatus).toBe("CONFIRMED");
    expect(row.startedAt).toEqual(now);
  });

  test("the code holder cannot enter their own code (custody)", async () => {
    const err = await verify("m1", "arrival", "358176");
    expect(err.status).toBe(403);
    const flipped = await verify("w1", "payment", "731942");
    expect(flipped.status).toBe(403); // payment is entered by the employer
  });

  test("a wrong code is answered 400 AND the failed attempt is recorded, never locked", async () => {
    for (let i = 1; i <= 3; i += 1) {
      const err = await verify("w1", "arrival", "000000");
      expect(err.status).toBe(400);
      expect(err.message).toBe("Incorrect code. Please ask the employer to check their screen.");
      expect(row.arrivalFailedAttempts).toBe(i);
    }
    // Still not locked: the right code works after three misses.
    await expect(verify("w1", "arrival", "358176")).resolves.toMatchObject({ checkpoint: "arrival" });
  });

  test("the wrong-code write is not thrown inside the transaction (so it commits)", async () => {
    let threwInside = false;
    prismaMock.$transaction.mockImplementation(async (fn) => {
      try {
        return await fn(prismaMock);
      } catch (err) {
        threwInside = true;
        throw err;
      }
    });
    await verify("w1", "arrival", "123456");
    expect(threwInside).toBe(false);
    expect(row.arrivalFailedAttempts).toBe(1);
  });

  test("single use: confirming the same checkpoint again is refused", async () => {
    await verify("w1", "arrival", "358176");
    const again = await verify("w1", "arrival", "358176");
    expect(again.status).toBe(409);
  });

  test("a code from another checkpoint is rejected as a wrong code", async () => {
    const err = await verify("w1", "arrival", "274065"); // the completion code, at arrival
    expect(err.status).toBe(400);
    expect(row.arrivalStatus).toBe("PENDING");
  });

  test("checkpoints run in order: completion before arrival is refused", async () => {
    const err = await verify("w1", "completion", "274065");
    expect(err.status).toBe(409);
    expect(row.completionStatus).toBe("PENDING");
  });

  test("an engagement without codes fails safely — no fallback code is ever accepted", async () => {
    row = engagementRow({ arrivalCode: null });
    for (const code of ["358176", "274065", "731942"]) {
      const err = await verify("w1", "arrival", code);
      expect(err.status).toBe(409);
    }
    expect(row.arrivalStatus).toBe("PENDING");
  });

  test("letters are refused before any lookup", async () => {
    const err = await verify("w1", "arrival", "ARR123");
    expect(err.status).toBe(400);
    expect(prismaMock.$transaction).not.toHaveBeenCalled();
  });

  test("the payment code completes a gig, opens rating and records completion", async () => {
    row = engagementRow({ arrivalStatus: "CONFIRMED", completionStatus: "CONFIRMED", paymentStatus: "PENDING" });
    const result = await verify("m1", "payment", "731942");
    expect(result).toMatchObject({ completed: true, engagementStatus: "COMPLETED" });
    expect(row.status).toBe("COMPLETED");
    expect(row.ratingOpenedAt).toEqual(now);
    expect(prismaMock.completionRecord.create).toHaveBeenCalledWith({
      data: { userId: "w1", engagementId: "e1", outcome: "COMPLETED", weight: 1.0 },
    });
    // FR-NOTIF-11: rating opens now, so both parties are told, each with the other's name.
    expect(prismaMock.notification.create).not.toHaveBeenCalled();
    const [{ data }] = prismaMock.notification.createMany.mock.calls[0];
    expect(data).toEqual([
      expect.objectContaining({ userId: "w1", type: "RATING_WINDOW_OPEN", payload: expect.objectContaining({ party: "WORKER", counterpartName: "Saman Stores" }) }),
      expect.objectContaining({ userId: "m1", type: "RATING_WINDOW_OPEN", payload: expect.objectContaining({ party: "EMPLOYER", counterpartName: "Kavindu Perera" }) }),
    ]);
  });

  test("a wrong payment code tells the employer to ask the worker", async () => {
    row = engagementRow({ arrivalStatus: "CONFIRMED", completionStatus: "CONFIRMED", paymentStatus: "PENDING" });
    const err = await verify("m1", "payment", "358176");
    expect(err.message).toBe("Incorrect code. Please ask the worker to show their payment code.");
    expect(row.paymentFailedAttempts).toBe(1);
  });
});

describe("FR-ENG-02: unpaid internship", () => {
  test("completion is the last checkpoint: the engagement completes with no payment step", async () => {
    row = engagementRow({
      arrivalStatus: "CONFIRMED",
      paymentCode: null,
      gigPosting: { ...gig, arrangementType: "INTERNSHIP", payKind: "UNPAID" },
    });
    const result = await verify("w1", "completion", "274065");
    expect(result).toMatchObject({ completed: true, nextCheckpoint: null });
    expect(row.status).toBe("COMPLETED");
    expect(row.paymentStatus).toBeNull();
    const err = await verify("m1", "payment", "731942");
    expect(err.status).toBe(409);
  });

  test("a paid gig's completion leaves payment pending instead", async () => {
    row = engagementRow({ arrivalStatus: "CONFIRMED" });
    const result = await verify("w1", "completion", "274065");
    expect(result).toMatchObject({ completed: false, nextCheckpoint: "payment" });
    expect(row.paymentStatus).toBe("PENDING");
    expect(row.status).toBe("ACTIVE");
  });
});

describe("FR-ENG-01 custody in the detail response", () => {
  test("the worker never receives the employer's codes, and the employer never the worker's", async () => {
    const asWorker = await service.getEngagementById({ engagementId: "e1", userId: "w1", now });
    const asEmployer = await service.getEngagementById({ engagementId: "e1", userId: "m1", now });
    for (const body of [asWorker, asEmployer]) {
      expect(body).not.toHaveProperty("arrivalCode");
      expect(body).not.toHaveProperty("completionCode");
      expect(body).not.toHaveProperty("paymentCode");
    }
    expect(asWorker.myCode).toBeNull();
    expect(asEmployer.myCode).toBe("358176");
    expect(JSON.stringify(asWorker)).not.toContain("358176");
  });

  test("at payment the worker holds the code and the employer sees none", async () => {
    row = engagementRow({ arrivalStatus: "CONFIRMED", completionStatus: "CONFIRMED", paymentStatus: "PENDING" });
    const asWorker = await service.getEngagementById({ engagementId: "e1", userId: "w1", now });
    const asEmployer = await service.getEngagementById({ engagementId: "e1", userId: "m1", now });
    expect(asWorker.myCode).toBe("731942");
    expect(asEmployer.myCode).toBeNull();
    expect(JSON.stringify(asEmployer)).not.toMatch(/731942|274065|358176/);
  });

  test("an unpaid internship's detail has no payment checkpoint", async () => {
    row = engagementRow({ gigPosting: { ...gig, arrangementType: "INTERNSHIP", payKind: "UNPAID" } });
    const body = await service.getEngagementById({ engagementId: "e1", userId: "w1", now });
    expect(body.checkpoints.payment).toBeNull();
  });

  test("before the start the detail offers cancelling, with the rule that would apply now", async () => {
    row = engagementRow({
      createdAt: new Date(now.getTime() - 3 * DAY),
      gigPosting: { ...gig, startAt: new Date(now.getTime() + 12 * HOUR) },
    });
    const body = await service.getEngagementById({ engagementId: "e1", userId: "m1", now });
    expect(body.canCancel).toBe(true);
    expect(body.cancelPreview).toMatchObject({ regime: "URGENT", isLate: true, lateReason: "BOOKED_AHEAD" });
  });

  test("an open request: no second cancel, and each side knows whose request it is", async () => {
    row = engagementRow({
      gigPosting: { ...gig, startAt: new Date(now.getTime() + 7 * DAY) },
      cancellationRequests: [{ id: "r1", status: "PENDING", requestedByUserId: "w1", reason: "OTHER", deadline: now }],
    });
    const asWorker = await service.getEngagementById({ engagementId: "e1", userId: "w1", now });
    const asEmployer = await service.getEngagementById({ engagementId: "e1", userId: "m1", now });
    expect(asWorker.canCancel).toBe(false);
    expect(asWorker.pendingCancellation.requestedByMe).toBe(true);
    expect(asEmployer.pendingCancellation.requestedByMe).toBe(false);
  });

  test("a cancelled engagement says how it was settled, and whether it was late", async () => {
    const cancelledAt = new Date(now.getTime() - DAY);
    row = engagementRow({
      status: "CANCELLED",
      cancelledAt,
      cancelledByUserId: "w1",
      isLateCancellation: true,
      createdAt: new Date(cancelledAt.getTime() - DAY),
      gigPosting: { ...gig, startAt: new Date(cancelledAt.getTime() + 2 * HOUR) },
      cancellationRequests: [{ id: "r1", status: "IMMEDIATE", requestedByUserId: "w1", deadline: null }],
    });
    const body = await service.getEngagementById({ engagementId: "e1", userId: "w1", now });
    expect(body.cancellation).toMatchObject({ byMe: true, isLate: true, lateReason: "UNDER_6_HOURS", via: "IMMEDIATE" });
  });

  test("someone outside the engagement gets 403", async () => {
    const err = await attempt(service.getEngagementById({ engagementId: "e1", userId: "x9", now }));
    expect(err.status).toBe(403);
  });
});

describe("FR-ENG-14: the list", () => {
  test("each row carries the viewer's own next action, and an old finished row is left out", async () => {
    prismaMock.engagement.findMany.mockResolvedValue([
      engagementRow(),
      engagementRow({ id: "e2", status: "ENDED", ratingOpenedAt: new Date(now.getTime() - 60 * DAY) }),
    ]);
    const asWorker = await service.listEngagements({ userId: "w1", role: "YOUTH_JOB_SEEKER", now });
    expect(asWorker).toEqual([
      {
        id: "e1",
        status: "ACTIVE",
        counterpartyName: "Saman Stores",
        postingTitle: "Shop assistant — weekend",
        gigPostingId: "p1",
        hasPendingChange: false,
        nextAction: { kind: "CODE", checkpoint: "arrival", role: "ENTERER" },
      },
    ]);
    expect(prismaMock.engagement.findMany.mock.calls[0][0].where).toEqual({ workerId: "w1" });

    const asEmployer = await service.listEngagements({ userId: "m1", role: "EMPLOYER", now });
    expect(asEmployer[0]).toMatchObject({ counterpartyName: "Kavindu Perera", nextAction: { role: "HOLDER" } });
  });
});

describe("FR-ENG-12: End Engagement", () => {
  const partTime = { ...gig, title: "Grade 8 maths tutoring", arrangementType: "PART_TIME", payKind: "RATE" };
  const end = (userId, somethingWentWrong) =>
    attempt(service.endEngagement({ engagementId: "e1", userId, somethingWentWrong, now }));

  beforeEach(() => {
    row = engagementRow({ gigPosting: partTime, arrivalStatus: "CONFIRMED", startedAt: partTime.startAt });
  });

  test('"no": Ended, rating opens for both, completion recorded, the other party told', async () => {
    const result = await end("w1", false);
    expect(result).toEqual({ engagementStatus: "ENDED", next: "rating" });
    expect(row).toMatchObject({ status: "ENDED", endIssueFlag: false, endedByUserId: "w1", ratingOpenedAt: now });
    expect(prismaMock.completionRecord.create).toHaveBeenCalledTimes(1);
    const sent = prismaMock.notification.create.mock.calls.map(([{ data }]) => [data.userId, data.type]);
    expect(sent).toEqual([["m1", "END_ENGAGEMENT"]]);
    // FR-NOTIF-11: rating opens for both, so both are told.
    const opened = prismaMock.notification.createMany.mock.calls[0][0].data.map((n) => [n.userId, n.type]);
    expect(opened).toEqual([["w1", "RATING_WINDOW_OPEN"], ["m1", "RATING_WINDOW_OPEN"]]);
  });

  test('"yes": the dispute route — Disputed, no rating, no completion record, the other party told', async () => {
    const result = await end("m1", true);
    expect(result).toEqual({ engagementStatus: "DISPUTED", next: "dispute" });
    expect(row).toMatchObject({ status: "DISPUTED", endIssueFlag: true, ratingOpenedAt: null });
    expect(prismaMock.completionRecord.create).not.toHaveBeenCalled();
    const sent = prismaMock.notification.create.mock.calls.map(([{ data }]) => [data.userId, data.type]);
    expect(sent).toEqual([["w1", "END_ENGAGEMENT"]]);
  });

  test("before it has started it routes to cancellation instead", async () => {
    row = engagementRow({ gigPosting: { ...partTime, startAt: new Date(now.getTime() + 3 * DAY) } });
    const err = await end("w1", false);
    expect(err.status).toBe(409);
    expect(err.code).toBe("ROUTE_TO_CANCEL");
    expect(row.status).toBe("ACTIVE");
  });

  test("a one-off gig has no End Engagement", async () => {
    row = engagementRow();
    const err = await end("w1", false);
    expect(err.status).toBe(409);
  });

  test("the answer is required", async () => {
    const err = await end("w1", undefined);
    expect(err.status).toBe(400);
  });
});

describe("FR-ENG-09: the worker's answer to a material change", () => {
  const request = { id: "r1", engagementId: "e1", status: "PENDING", deadline: new Date(now.getTime() + 18 * HOUR) };
  const answer = (userId, accept, at = now) =>
    attempt(service.reconfirmMaterialChange({ engagementId: "e1", userId, accept, now: at }));

  beforeEach(() => {
    row = engagementRow({ gigPosting: { ...gig, startAt: new Date(now.getTime() + 36 * HOUR) } });
    prismaMock.materialChangeRequest.findFirst.mockResolvedValue({ ...request });
    prismaMock.materialChangeRequest.updateMany.mockResolvedValue({ count: 1 });
    prismaMock.gigPosting.updateMany.mockResolvedValue({ count: 1 });
  });

  test("accept: the request is Accepted and the engagement carries on", async () => {
    const result = await answer("w1", true);
    expect(result).toEqual({ accepted: true, engagementStatus: "ACTIVE" });
    expect(prismaMock.materialChangeRequest.updateMany).toHaveBeenCalledWith({
      where: { id: "r1", status: "PENDING" },
      data: { status: "ACCEPTED", respondedAt: now },
    });
    expect(row.status).toBe("ACTIVE");
  });

  test("decline: cancelled at once as the employer's change, nothing against the worker, the place reopens", async () => {
    const result = await answer("w1", false);
    expect(result).toEqual({ accepted: false, engagementStatus: "CANCELLED" });
    expect(prismaMock.materialChangeRequest.updateMany.mock.calls[0][0].data).toEqual({
      status: "DECLINED_ROUTED_TO_CANCELLATION",
      respondedAt: now,
    });
    // database-schema.md: the declined change is written as an IMMEDIATE request by the employer.
    expect(prismaMock.cancellationRequest.create.mock.calls[0][0].data).toMatchObject({
      requestedByUserId: "m1",
      status: "IMMEDIATE",
      deadline: null,
    });
    expect(row).toMatchObject({ status: "CANCELLED", cancelledByUserId: "m1", ratingEnforced: false, ratingOpenedAt: now });
    expect(prismaMock.completionRecord.create).not.toHaveBeenCalled();
    expect(prismaMock.gigPosting.updateMany).toHaveBeenCalledWith({
      where: { id: "p1", filledCount: { gt: 0 } },
      data: { filledCount: { decrement: 1 } },
    });
    expect(syncPostingStatus).toHaveBeenCalledWith("p1", prismaMock);
  });

  test("accepting after the window has closed is refused", async () => {
    const err = await answer("w1", true, new Date(request.deadline.getTime() + 1));
    expect(err.status).toBe(409);
  });

  test("only the engaged worker answers", async () => {
    const err = await answer("m1", true);
    expect(err.status).toBe(403);
  });

  test("with nothing pending there is nothing to answer", async () => {
    prismaMock.materialChangeRequest.findFirst.mockResolvedValue(null);
    const err = await answer("w1", true);
    expect(err.status).toBe(409);
  });
});

describe("5.12: Change responses (FR-ENG-09 / FR-ENG-11, the employer's side)", () => {
  test("one row per worker for the latest change only; another employer gets 403", async () => {
    prismaMock.gigPosting.findUnique.mockResolvedValue({ id: "p1", title: "Event setup crew (3 needed)", employerId: "m1" });
    const proposed = new Date(now.getTime() - HOUR);
    const older = new Date(now.getTime() - 5 * DAY);
    const deadline = new Date(now.getTime() + 17 * HOUR);
    prismaMock.materialChangeRequest.findMany.mockResolvedValue([
      { status: "PENDING", proposedAt: proposed, deadline, respondedAt: null, changeSummary: { startAt: {} }, engagement: { id: "e1", worker: { legalName: "Nethmi Jayasinghe" } } },
      { status: "ACCEPTED", proposedAt: proposed, deadline, respondedAt: now, changeSummary: { startAt: {} }, engagement: { id: "e2", worker: { legalName: "Tharindu Silva" } } },
      { status: "ACCEPTED", proposedAt: older, deadline: older, respondedAt: older, changeSummary: { payAmount: {} }, engagement: { id: "e1", worker: { legalName: "Nethmi Jayasinghe" } } },
    ]);
    const result = await service.getChangeResponses({ gigPostingId: "p1", userId: "m1" });
    expect(result.responses.map((r) => [r.workerName, r.status])).toEqual([
      ["Nethmi Jayasinghe", "PENDING"],
      ["Tharindu Silva", "ACCEPTED"],
    ]);
    const err = await attempt(service.getChangeResponses({ gigPostingId: "p1", userId: "m2" }));
    expect(err.status).toBe(403);
  });
});

describe("FR-ENG-03: unable to confirm", () => {
  test("the live checkpoint → UNABLE_TO_CONFIRM, the engagement Disputed, the other party told", async () => {
    const result = await service.unableToConfirm({ engagementId: "e1", userId: "w1", checkpoint: "arrival", now });
    expect(result).toEqual({ engagementStatus: "DISPUTED" });
    expect(row).toMatchObject({ arrivalStatus: "UNABLE_TO_CONFIRM", status: "DISPUTED" });
    const sent = prismaMock.notification.create.mock.calls.map(([{ data }]) => [data.userId, data.type]);
    expect(sent).toEqual([["m1", "DISPUTE_OPENED"]]);
  });

  test("a checkpoint that is not the live one is refused", async () => {
    const err = await attempt(service.unableToConfirm({ engagementId: "e1", userId: "w1", checkpoint: "completion", now }));
    expect(err.status).toBe(409);
    expect(row.status).toBe("ACTIVE");
  });

  test("only on an Active engagement, and only by a party", async () => {
    const outsider = await attempt(service.unableToConfirm({ engagementId: "e1", userId: "x9", checkpoint: "arrival", now }));
    expect(outsider.status).toBe(403);
    row = engagementRow({ status: "COMPLETED", arrivalStatus: "CONFIRMED", completionStatus: "CONFIRMED" });
    const done = await attempt(service.unableToConfirm({ engagementId: "e1", userId: "w1", checkpoint: "arrival", now }));
    expect(done.status).toBe(409);
    expect(row.status).toBe("COMPLETED");
  });

  test("before the start nothing is live, so nothing can be reported", async () => {
    row = engagementRow({ gigPosting: { ...gig, startAt: new Date(now.getTime() + 5 * HOUR) } });
    const err = await attempt(service.unableToConfirm({ engagementId: "e1", userId: "w1", checkpoint: "arrival", now }));
    expect(err.status).toBe(409);
  });
});

describe("notification types", () => {
  test("every notification type the module writes exists in the schema's NotificationType enum", async () => {
    const { readFileSync } = await import("fs");
    const schema = readFileSync(new URL("../../../../prisma/schema.prisma", import.meta.url), "utf8");
    const block = schema.match(/enum NotificationType \{([\s\S]*?)\}/)[1];
    const allowed = new Set(block.split(/\r?\n/).map((line) => line.replace(/\/\/.*$/, "").trim()).filter(Boolean));
    const written = [];
    for (const file of ["../engagement.service.js", "../engagement.cancellation.js"]) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      written.push(...[...source.matchAll(/notify\(tx, [^,]+, "([A-Z_]+)"/g)].map((m) => m[1]));
    }
    expect(written.length).toBeGreaterThan(4);
    for (const type of written) expect(allowed).toContain(type);
  });
});
