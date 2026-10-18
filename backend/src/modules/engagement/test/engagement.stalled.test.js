// engagement.stalled.test.js
// FR-ENG-13 / NFR-REL-01 — the 24-hour "Did this happen?" prompt, "Still running", and the 7-day
// auto-flag that opens a STALLED_AUTO_FLAG dispute case — plus the dispute sweep that runs them
// with FR-DISPUTE-04's lapsed response windows. Prisma replaced by an in-memory mock.
import { jest } from "@jest/globals";

const prismaMock = {
  engagement: { findUnique: jest.fn(), findMany: jest.fn(), updateMany: jest.fn() },
  disputeCase: { findFirst: jest.fn(), create: jest.fn(), updateMany: jest.fn() },
  notification: { create: jest.fn(), createMany: jest.fn() },
  $transaction: jest.fn(),
  $queryRaw: jest.fn(),
};
jest.unstable_mockModule("../../../lib/prisma.js", () => ({ default: prismaMock }));

const stalled = await import("../engagement.stalled.js");
const { runDisputeSweeps } = await import("../../dispute/dispute.sweep.js");

const HOUR = 3600e3;
const DAY = 24 * HOUR;
const start = new Date("2026-08-29T08:00:00Z");
const gig = { id: "p1", title: "Shop assistant — weekend", startAt: start, arrangementType: "GIG", postedAsType: "BUSINESS", postedBusinessName: "Saman Stores" };

let row;
function engagementRow(overrides = {}) {
  return {
    id: "e1",
    gigPostingId: "p1",
    workerId: "w1",
    employerId: "m1",
    status: "ACTIVE",
    arrivalStatus: "PENDING",
    arrivalConfirmedAt: null,
    completionStatus: "PENDING",
    completionConfirmedAt: null,
    stalledPromptSentAt: null,
    stalledFlaggedAt: null,
    stalledDismissedByWorkerAt: null,
    stalledDismissedByEmployerAt: null,
    gigPosting: gig,
    worker: { legalName: "Kavindu Perera" },
    employer: { legalName: "Saman Silva", businessName: "Saman Stores" },
    cancellationRequests: [],
    materialChangeRequests: [],
    ...overrides,
  };
}

function matches(where) {
  return Object.entries(where).every(([key, value]) => (key === "id" ? value === row.id : row[key] === value));
}

beforeEach(() => {
  jest.resetAllMocks();
  row = engagementRow();
  prismaMock.$transaction.mockImplementation(async (fn) => fn(prismaMock));
  prismaMock.engagement.findUnique.mockImplementation(async () => ({ ...row }));
  prismaMock.engagement.findMany.mockImplementation(async () => [{ id: row.id }]);
  prismaMock.engagement.updateMany.mockImplementation(async ({ where, data }) => {
    if (!matches(where)) return { count: 0 };
    Object.assign(row, data);
    return { count: 1 };
  });
  prismaMock.disputeCase.findFirst.mockResolvedValue(null);
  prismaMock.disputeCase.create.mockImplementation(async ({ data }) => ({ id: "dc1", ...data }));
  prismaMock.disputeCase.updateMany.mockResolvedValue({ count: 0 });
});

describe("FR-ENG-13: the pure rules", () => {
  test("only one-off Gigs", () => {
    expect(stalled.isOneOffGig({ arrangementType: "GIG" })).toBe(true);
    expect(stalled.isOneOffGig({ arrangementType: "PART_TIME" })).toBe(false);
    expect(stalled.isOneOffGig({ arrangementType: "INTERNSHIP" })).toBe(false);
  });

  test("the 7 days run from the latest thing either party did after the prompt; dismissing is not activity", () => {
    const prompt = new Date(start.getTime() + DAY);
    const r = engagementRow({ stalledPromptSentAt: prompt, stalledDismissedByWorkerAt: new Date(prompt.getTime() + 5 * DAY) });
    expect(stalled.lastPartyActivity(r)).toEqual(prompt);
    expect(stalled.dueForStalledFlag(r, gig, new Date(prompt.getTime() + 7 * DAY))).toBe(true);
    expect(stalled.dueForStalledFlag(r, gig, new Date(prompt.getTime() + 7 * DAY - 1))).toBe(false);

    const arrived = new Date(prompt.getTime() + 3 * DAY);
    const r2 = engagementRow({ stalledPromptSentAt: prompt, arrivalStatus: "CONFIRMED", arrivalConfirmedAt: arrived });
    expect(stalled.dueForStalledFlag(r2, gig, new Date(prompt.getTime() + 7 * DAY))).toBe(false);
    expect(stalled.dueForStalledFlag(r2, gig, new Date(arrived.getTime() + 7 * DAY))).toBe(true);
  });

  test("the prompt shows per party until dismissed, and never on a part-time job", () => {
    const r = engagementRow({ stalledPromptSentAt: start, stalledDismissedByEmployerAt: start });
    expect(stalled.stalledPromptVisible(r, gig, "WORKER")).toBe(true);
    expect(stalled.stalledPromptVisible(r, gig, "EMPLOYER")).toBe(false);
    expect(stalled.stalledPromptVisible(r, { ...gig, arrangementType: "PART_TIME" }, "WORKER")).toBe(false);
  });
});

describe("FR-ENG-13: the 24-hour prompt", () => {
  test("both parties get 'Did this happen?' once, 24 hours after the start", async () => {
    const at = new Date(start.getTime() + DAY);
    expect(await stalled.sendStalledPrompts(at)).toBe(1);
    expect(prismaMock.engagement.findMany.mock.calls[0][0].where).toEqual({
      status: "ACTIVE",
      completionStatus: "PENDING",
      stalledPromptSentAt: null,
      gigPosting: { arrangementType: "GIG", startAt: { lte: start } },
    });
    expect(row.stalledPromptSentAt).toEqual(at);
    const sent = prismaMock.notification.createMany.mock.calls[0][0].data;
    expect(sent.map((n) => [n.userId, n.type])).toEqual([["w1", "STALLED_ENGAGEMENT_PROMPT"], ["m1", "STALLED_ENGAGEMENT_PROMPT"]]);
    expect(sent[0].payload).toEqual({ engagementId: "e1", gigPostingId: "p1", postingTitle: gig.title, title: gig.title, startAt: start });

    // A second pass finds it already prompted: nothing more is sent.
    expect(await stalled.sendStalledPrompts(new Date(at.getTime() + HOUR))).toBe(0);
    expect(prismaMock.notification.createMany).toHaveBeenCalledTimes(1);
  });
});

describe("FR-ENG-13: the 7-day auto-flag", () => {
  const prompt = new Date(start.getTime() + DAY);

  test("after 7 days of silence: flagged, Disputed, a STALLED_AUTO_FLAG case Under review, both told", async () => {
    row = engagementRow({ stalledPromptSentAt: prompt });
    const at = new Date(prompt.getTime() + 7 * DAY);
    expect(await stalled.flagStalledEngagements(at)).toBe(1);
    expect(row).toMatchObject({ status: "DISPUTED", stalledFlaggedAt: at });
    expect(prismaMock.$queryRaw).toHaveBeenCalled(); // the row is locked before deciding
    expect(prismaMock.disputeCase.create.mock.calls[0][0].data).toMatchObject({
      engagementId: "e1",
      triggerType: "STALLED_AUTO_FLAG",
      raisedByUserId: null,
      respondentUserId: null,
      status: "UNDER_REVIEW",
    });
    const told = prismaMock.notification.createMany.mock.calls[0][0].data.map((n) => [n.userId, n.type, n.payload.stalled]);
    expect(told).toEqual([["w1", "DISPUTE_OPENED", true], ["m1", "DISPUTE_OPENED", true]]);
  });

  test("a code confirmed since the prompt restarts the silence; a confirmed completion ends it", async () => {
    row = engagementRow({ stalledPromptSentAt: prompt, arrivalStatus: "CONFIRMED", arrivalConfirmedAt: new Date(prompt.getTime() + 2 * DAY) });
    expect(await stalled.flagStalledEngagements(new Date(prompt.getTime() + 7 * DAY))).toBe(0);
    expect(row.status).toBe("ACTIVE");

    row = engagementRow({ stalledPromptSentAt: prompt, completionStatus: "CONFIRMED" });
    expect(await stalled.flagStalledEngagements(new Date(prompt.getTime() + 30 * DAY))).toBe(0);
    expect(prismaMock.disputeCase.create).not.toHaveBeenCalled();
  });
});

describe('FR-ENG-13 amendment: "Still running"', () => {
  test("records the caller's dismissal and changes nothing else", async () => {
    row = engagementRow({ stalledPromptSentAt: start });
    const before = { ...row };
    const result = await stalled.dismissStalledPrompt({ engagementId: "e1", userId: "m1", now: start });
    expect(result).toEqual({ stalledPrompt: { show: false } });
    expect(prismaMock.engagement.updateMany).toHaveBeenCalledWith({
      where: { id: "e1", stalledDismissedByEmployerAt: null },
      data: { stalledDismissedByEmployerAt: start },
    });
    const { stalledDismissedByEmployerAt, ...rest } = row;
    const { stalledDismissedByEmployerAt: _b, ...restBefore } = before;
    expect(stalledDismissedByEmployerAt).toEqual(start);
    expect(rest).toEqual(restBefore);
  });

  test("an outsider gets 403; with no prompt there is nothing to dismiss", async () => {
    row = engagementRow({ stalledPromptSentAt: start });
    await expect(stalled.dismissStalledPrompt({ engagementId: "e1", userId: "x9" })).rejects.toMatchObject({ status: 403 });
    row = engagementRow();
    await expect(stalled.dismissStalledPrompt({ engagementId: "e1", userId: "w1" })).rejects.toMatchObject({ status: 409 });
  });
});

describe("the dispute sweep", () => {
  test("moves lapsed response windows to Under review, then runs the stalled steps", async () => {
    prismaMock.disputeCase.updateMany.mockResolvedValue({ count: 2 });
    prismaMock.engagement.findMany.mockResolvedValue([]);
    const at = new Date("2026-09-10T00:00:00Z");
    expect(await runDisputeSweeps(at)).toEqual({ lapsed: 2, prompted: 0, flagged: 0 });
    expect(prismaMock.disputeCase.updateMany).toHaveBeenCalledWith({
      where: { status: "AWAITING_RESPONSE", respondentDeadline: { lte: at } },
      data: { status: "UNDER_REVIEW" },
    });
  });
});
