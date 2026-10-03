// application.trust.test.js
// FR-APPLY-04 (the three-tier pool order, amended 2026-09-23 — YL-173) and the FR-APPLY-05
// figures the pool shows. Pure functions: no database, no mocks.
import {
  ratingStats,
  tierFor,
  compareApplicants,
  describeEndorsers,
} from "../application.trust.js";
import { formatStartFull, payLine, describeChanges } from "../application.notifications.js";

const at = (iso) => new Date(iso);

describe("FR-APPLY-04: tierFor", () => {
  test("rating history is tier 1, whatever the endorsements", () => {
    expect(tierFor({ ratingCount: 3, endorsementCount: 0 })).toBe("history");
    expect(tierFor({ ratingCount: 1, endorsementCount: 2 })).toBe("history");
  });
  test("no history but an active endorsement is tier 2", () => {
    expect(tierFor({ ratingCount: 0, endorsementCount: 1 })).toBe("endorsedNew");
  });
  test("no history and no endorsement is tier 3", () => {
    expect(tierFor({ ratingCount: 0, endorsementCount: 0 })).toBe("new");
  });
});

describe("FR-APPLY-04: compareApplicants", () => {
  const row = (name, tier, exactAverage, completionRate, appliedAt) => ({
    name,
    tier,
    exactAverage,
    completionRate,
    appliedAt: at(appliedAt),
  });

  test("tier 1 by rating, then tier 2, then tier 3 — however they arrived", () => {
    const pool = [
      row("plain", "new", null, null, "2026-08-27T02:00:00Z"),
      row("endorsed", "endorsedNew", null, null, "2026-08-27T03:00:00Z"),
      row("rated", "history", 4.6, 92, "2026-08-27T04:00:00Z"),
    ];
    expect(pool.sort(compareApplicants).map((r) => r.name)).toEqual(["rated", "endorsed", "plain"]);
  });

  test("tier 1: the higher average first", () => {
    const pool = [row("b", "history", 4.0, 100, "2026-08-27T01:00:00Z"), row("a", "history", 4.8, 50, "2026-08-27T02:00:00Z")];
    expect(pool.sort(compareApplicants).map((r) => r.name)).toEqual(["a", "b"]);
  });

  test("tier 1: an equal average is decided by the higher completion rate", () => {
    const pool = [
      row("lower", "history", 5.0, 33, "2026-08-27T01:00:00Z"),
      row("higher", "history", 5.0, 100, "2026-08-27T02:00:00Z"),
      row("no record", "history", 5.0, null, "2026-08-27T00:00:00Z"),
    ];
    expect(pool.sort(compareApplicants).map((r) => r.name)).toEqual(["higher", "lower", "no record"]);
  });

  test("tiers 2 and 3: the earlier application ranks first (YL-173)", () => {
    const pool = [
      row("late endorsed", "endorsedNew", null, null, "2026-08-27T05:00:00Z"),
      row("late plain", "new", null, null, "2026-08-27T06:00:00Z"),
      row("early plain", "new", null, null, "2026-08-27T01:00:00Z"),
      row("early endorsed", "endorsedNew", null, null, "2026-08-27T02:00:00Z"),
    ];
    expect(pool.sort(compareApplicants).map((r) => r.name)).toEqual([
      "early endorsed",
      "late endorsed",
      "early plain",
      "late plain",
    ]);
  });
});

describe("FR-APPLY-05: ratingStats and describeEndorsers", () => {
  test("average to one decimal for display, the exact value for the sort", () => {
    expect(ratingStats([{ score: 5 }, { score: 4 }, { score: 5 }])).toEqual({
      ratingAverage: 4.7,
      exactAverage: 14 / 3,
      ratingCount: 3,
    });
    expect(ratingStats([])).toEqual({ ratingAverage: null, exactAverage: null, ratingCount: 0 });
  });

  test("only the attributes an endorser selected are named", () => {
    expect(
      describeEndorsers([
        { endorser: { legalName: "K. Rathnayake" }, attributes: ["RELIABILITY"] },
        { endorser: { legalName: "M. Perera" }, attributes: [] },
      ]),
    ).toEqual([
      { name: "K. Rathnayake", attributes: ["Reliability"] },
      { name: "M. Perera", attributes: [] },
    ]);
  });
});

describe("FR-APPLY-10: notification wording", () => {
  test("dates are written in Sri Lanka time, as the prototype draws them", () => {
    // 01:30 UTC is 7:00 AM in Colombo (UTC+5:30).
    expect(formatStartFull("2026-08-29T01:30:00Z")).toBe("Sat 29 Aug 2026, 7:00 AM");
  });

  test("pay follows design-system.md §9", () => {
    expect(payLine({ payKind: "FIXED_TOTAL", payAmount: 6000 })).toBe("Rs 6,000 for the job");
    expect(payLine({ payKind: "RATE", payAmount: "1800", payRateUnit: "DAY" })).toBe("Rs 1,800 per day");
    expect(payLine({ payKind: "UNPAID" })).toBe("Unpaid");
  });

  test("the start-time change reads as 3.10x draws it", () => {
    expect(describeChanges({ startAt: "2026-08-29T01:30:00Z" }, ["startAt"])).toBe(
      "The start moved to Sat 29 Aug 2026, 7:00 AM",
    );
  });
});
