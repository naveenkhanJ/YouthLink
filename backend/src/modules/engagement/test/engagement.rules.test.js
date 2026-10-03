// engagement.rules.test.js
// FR-ENG-01 (order and custody of the check-in codes), FR-ENG-02 (no payment checkpoint for an
// unpaid internship) and FR-ENG-14 (the viewer's owed action, and how long a finished engagement
// stays listed) — the pure rules in engagement.rules.js. No database.
import {
  cancellationPreview,
  cancellationRegime,
  codeHeldBy,
  hasPaymentCheckpoint,
  isListed,
  lateReason,
  liveCheckpoint,
  nextActionFor,
  nextCheckpoint,
  ratingWindow,
} from "../engagement.rules.js";

const HOUR = 3600e3;
const DAY = 24 * HOUR;
const now = new Date("2026-08-29T10:00:00Z");

const gig = { arrangementType: "GIG", payKind: "FIXED_TOTAL", startAt: new Date(now.getTime() - 2 * HOUR) };
const unpaidInternship = { arrangementType: "INTERNSHIP", payKind: "UNPAID", startAt: gig.startAt };
const partTime = { arrangementType: "PART_TIME", payKind: "RATE", startAt: gig.startAt };

function engagement(overrides = {}) {
  return {
    id: "e1",
    workerId: "w1",
    employerId: "m1",
    status: "ACTIVE",
    arrivalStatus: "PENDING",
    completionStatus: "PENDING",
    paymentStatus: null,
    arrivalCode: "358176",
    completionCode: "274065",
    paymentCode: "731942",
    startedAt: null,
    ratingOpenedAt: null,
    ratingEnforced: true,
    ratings: [],
    materialChangeRequests: [],
    cancellationRequests: [],
    ...overrides,
  };
}

describe("FR-ENG-01: the checkpoints run in order", () => {
  test("arrival first, then completion, then payment", () => {
    expect(nextCheckpoint(engagement(), gig)).toBe("arrival");
    expect(nextCheckpoint(engagement({ arrivalStatus: "CONFIRMED" }), gig)).toBe("completion");
    expect(nextCheckpoint(engagement({ arrivalStatus: "CONFIRMED", completionStatus: "CONFIRMED" }), gig)).toBe("payment");
  });

  test("nothing is live before the start: the arrival code is issued at the start", () => {
    const later = { ...gig, startAt: new Date(now.getTime() + 5 * HOUR) };
    expect(liveCheckpoint(engagement(), later, now)).toBeNull();
    expect(codeHeldBy(engagement(), later, "EMPLOYER", now)).toBeNull();
  });
});

describe("FR-ENG-01: custody — each party gets only the code it holds", () => {
  test("arrival: the employer holds it, the worker gets nothing", () => {
    expect(codeHeldBy(engagement(), gig, "EMPLOYER", now)).toBe("358176");
    expect(codeHeldBy(engagement(), gig, "WORKER", now)).toBeNull();
  });

  test("completion: still the employer's", () => {
    const eng = engagement({ arrivalStatus: "CONFIRMED" });
    expect(codeHeldBy(eng, gig, "EMPLOYER", now)).toBe("274065");
    expect(codeHeldBy(eng, gig, "WORKER", now)).toBeNull();
  });

  test("payment: custody flips — the worker holds it, the employer gets nothing", () => {
    const eng = engagement({ arrivalStatus: "CONFIRMED", completionStatus: "CONFIRMED", paymentStatus: "PENDING" });
    expect(codeHeldBy(eng, gig, "WORKER", now)).toBe("731942");
    expect(codeHeldBy(eng, gig, "EMPLOYER", now)).toBeNull();
  });

  test("a disputed engagement shows no code to anyone", () => {
    const eng = engagement({ status: "DISPUTED", arrivalStatus: "UNABLE_TO_CONFIRM" });
    expect(codeHeldBy(eng, gig, "EMPLOYER", now)).toBeNull();
  });
});

describe("FR-ENG-02: an unpaid internship has no payment checkpoint", () => {
  test("unpaid internship: two checkpoints; paid and stipend internships keep three", () => {
    expect(hasPaymentCheckpoint(unpaidInternship)).toBe(false);
    expect(hasPaymentCheckpoint({ arrangementType: "INTERNSHIP", payKind: "STIPEND" })).toBe(true);
    expect(hasPaymentCheckpoint(gig)).toBe(true);
  });

  test("after completion there is nothing left to confirm", () => {
    const eng = engagement({ arrivalStatus: "CONFIRMED", completionStatus: "CONFIRMED" });
    expect(nextCheckpoint(eng, unpaidInternship)).toBeNull();
    expect(nextActionFor(eng, unpaidInternship, "w1", now)).toBeNull();
  });
});

describe("FR-ENG-14: the next action is only what the VIEWER owes", () => {
  test("arrival: the worker enters, the employer shows", () => {
    expect(nextActionFor(engagement(), gig, "w1", now)).toEqual({ kind: "CODE", checkpoint: "arrival", role: "ENTERER" });
    expect(nextActionFor(engagement(), gig, "m1", now)).toEqual({ kind: "CODE", checkpoint: "arrival", role: "HOLDER" });
  });

  test("payment: the worker shows, the employer enters", () => {
    const eng = engagement({ arrivalStatus: "CONFIRMED", completionStatus: "CONFIRMED", paymentStatus: "PENDING" });
    expect(nextActionFor(eng, gig, "w1", now)).toMatchObject({ checkpoint: "payment", role: "HOLDER" });
    expect(nextActionFor(eng, gig, "m1", now)).toMatchObject({ checkpoint: "payment", role: "ENTERER" });
  });

  test("a pending re-confirmation is the worker's; the employer's row shows no action for it", () => {
    const deadline = new Date(now.getTime() + 18 * HOUR);
    const eng = engagement({
      materialChangeRequests: [{ status: "PENDING", deadline, changeSummary: { startAt: { from: 1, to: 2 } } }],
    });
    const later = { ...gig, startAt: new Date(now.getTime() + 36 * HOUR) };
    expect(nextActionFor(eng, later, "w1", now)).toEqual({ kind: "RECONFIRM", deadline, changedFields: ["startAt"] });
    expect(nextActionFor(eng, later, "m1", now)).toBeNull();
  });

  test("an open cancellation request is owed by the party who did not send it", () => {
    const deadline = new Date(now.getTime() + 48 * HOUR);
    const eng = engagement({ cancellationRequests: [{ status: "PENDING", requestedByUserId: "w1", deadline }] });
    expect(nextActionFor(eng, gig, "m1", now)).toEqual({ kind: "RESPOND_CANCELLATION", deadline });
    // The requester owes nothing for it; their row falls through to the checkpoint.
    expect(nextActionFor(eng, gig, "w1", now)).toMatchObject({ kind: "CODE" });
  });

  test("a completed engagement owes a rating until the viewer rates", () => {
    const eng = engagement({ status: "COMPLETED", ratingOpenedAt: new Date(now.getTime() - DAY) });
    expect(nextActionFor(eng, gig, "w1", now)).toEqual({ kind: "RATE" });
    const rated = { ...eng, ratings: [{ raterId: "w1", revealedAt: null }] };
    expect(nextActionFor(rated, gig, "w1", now)).toBeNull();
    expect(nextActionFor(rated, gig, "m1", now)).toEqual({ kind: "RATE" });
  });

  test("no rating is owed once the 14-day window has closed, nor on a cancelled engagement", () => {
    const closed = engagement({ status: "ENDED", ratingOpenedAt: new Date(now.getTime() - 15 * DAY) });
    expect(nextActionFor(closed, partTime, "w1", now)).toBeNull();
    const cancelled = engagement({ status: "CANCELLED", ratingOpenedAt: now, ratingEnforced: false });
    expect(nextActionFor(cancelled, gig, "w1", now)).toBeNull();
  });
});

describe("FR-ENG-14: a finished engagement stays 30 days after its rating window closes", () => {
  test("the window closes at the reveal, or 14 days after it opened", () => {
    const opened = new Date(now.getTime() - 3 * DAY);
    const revealed = new Date(now.getTime() - 2 * DAY);
    const eng = engagement({ ratingOpenedAt: opened, ratings: [{ raterId: "w1", revealedAt: revealed }] });
    expect(ratingWindow(eng, now).closesAt).toEqual(revealed);
    expect(ratingWindow(engagement({ ratingOpenedAt: opened }), now).closesAt).toEqual(new Date(opened.getTime() + 14 * DAY));
  });

  test("shown at 30 days after the window closed, gone after", () => {
    // Opened 43 days ago: the window closed 29 days ago — still listed.
    const recent = engagement({ status: "ENDED", ratingOpenedAt: new Date(now.getTime() - 43 * DAY) });
    expect(isListed(recent, partTime, "w1", now)).toBe(true);
    // Opened 45 days ago: closed 31 days ago — gone.
    const old = engagement({ status: "ENDED", ratingOpenedAt: new Date(now.getTime() - 45 * DAY) });
    expect(isListed(old, partTime, "w1", now)).toBe(false);
  });

  test("Active and Disputed always show, however old", () => {
    const longAgo = new Date(now.getTime() - 400 * DAY);
    expect(isListed(engagement({ ratingOpenedAt: longAgo }), gig, "w1", now)).toBe(true);
    expect(isListed(engagement({ status: "DISPUTED", ratingOpenedAt: longAgo }), gig, "w1", now)).toBe(true);
  });

  test("a cancelled row without ratingOpenedAt is timed from the cancellation", () => {
    const old = engagement({ status: "CANCELLED", cancelledAt: new Date(now.getTime() - 50 * DAY) });
    expect(isListed(old, gig, "w1", now)).toBe(false);
  });
});

describe("FR-ENG-05/06: the regime is decided at the moment of cancelling", () => {
  test("more than 48 hours to the start is a request; 48 hours or less is immediate", () => {
    expect(cancellationRegime(new Date(now.getTime() + 48 * HOUR + 1), now)).toBe("REGULAR");
    expect(cancellationRegime(new Date(now.getTime() + 48 * HOUR), now)).toBe("URGENT");
    expect(cancellationRegime(new Date(now.getTime() + 12 * HOUR), now)).toBe("URGENT");
  });
});

describe("FR-ENG-06: Late", () => {
  const start = new Date(now.getTime() + 12 * HOUR);

  test("under 6 hours before the start is Late, however it was booked", () => {
    const soon = new Date(now.getTime() + 5 * HOUR);
    expect(lateReason({ startAt: soon, engagementCreatedAt: new Date(now.getTime() - 10 * HOUR), now })).toBe("UNDER_6_HOURS");
  });

  test("created three days before the start, cancelled 12 hours before: Late", () => {
    const created = new Date(start.getTime() - 3 * DAY);
    expect(lateReason({ startAt: start, engagementCreatedAt: created, now })).toBe("BOOKED_AHEAD");
  });

  test("created 30 hours before the start, cancelled 12 hours before: not Late", () => {
    const created = new Date(start.getTime() - 30 * HOUR);
    expect(lateReason({ startAt: start, engagementCreatedAt: created, now })).toBeNull();
  });

  test("booked well ahead but more than 24 hours to go: not Late", () => {
    const later = new Date(now.getTime() + 30 * HOUR);
    expect(lateReason({ startAt: later, engagementCreatedAt: new Date(now.getTime() - 5 * DAY), now })).toBeNull();
  });

  test("the preview never calls a regular cancellation Late", () => {
    const far = { startAt: new Date(now.getTime() + 5 * DAY) };
    expect(cancellationPreview({ createdAt: new Date(now.getTime() - 10 * DAY) }, far, now)).toMatchObject({
      regime: "REGULAR",
      isLate: false,
      lateReason: null,
    });
  });
});
