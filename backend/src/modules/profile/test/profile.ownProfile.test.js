// profile.ownProfile.test.js
// FR-PROF-01 (the profile a person sees of themselves), FR-PROF-02 (Phone verified is shown; nothing
// implies the NIC was checked), FR-PROF-06 (trust signals computed, not stored) and FR-RATE-03's
// completion rate (a late cancellation weighs 2.0, an early one 1.0) — profile.service.js's
// getOwnProfile(), with the database replaced by a mock that returns the aggregates it asks for.
import { jest } from "@jest/globals";
import testConfig from "../../account/test/testConfig.js";

const prismaMock = {
  user: { findUnique: jest.fn() },
  rating: { aggregate: jest.fn(), count: jest.fn() },
  completionRecord: { groupBy: jest.fn() },
  endorsement: { findMany: jest.fn(), count: jest.fn() },
  engagement: { count: jest.fn() },
};

jest.unstable_mockModule("../../../config/index.js", () => ({ default: testConfig }));
jest.unstable_mockModule("../../../lib/prisma.js", () => ({ default: prismaMock }));

const { default: service } = await import("../profile.service.js");

const WORKER = {
  id: "w1",
  role: "YOUTH_JOB_SEEKER",
  legalName: "Nimali Fernando",
  phoneVerifiedAt: new Date("2026-09-01"),
  bio: "Weekend events and data entry.",
  deletedAt: null,
};

/** Completion records grouped by outcome, as Prisma's groupBy returns them. */
const group = (outcome, count, weight) => ({ outcome, _count: { _all: count }, _sum: { weight } });

beforeEach(() => {
  jest.resetAllMocks();
  prismaMock.user.findUnique.mockResolvedValue(WORKER);
  prismaMock.rating.aggregate.mockResolvedValue({ _avg: { score: null }, _count: { _all: 0 } });
  prismaMock.rating.count.mockResolvedValue(0);
  prismaMock.completionRecord.groupBy.mockResolvedValue([]);
  prismaMock.endorsement.findMany.mockResolvedValue([]);
  prismaMock.endorsement.count.mockResolvedValue(0);
  prismaMock.engagement.count.mockResolvedValue(0);
});

describe("FR-RATE-03: completion rate (prototype 1.18n and 1.18nc, Nethmi Jayasinghe)", () => {
  test("1.18n: 12 completed jobs and 1 early cancellation give 92% completion, 12 jobs", async () => {
    prismaMock.completionRecord.groupBy.mockResolvedValue([group("COMPLETED", 12, 12), group("EARLY_CANCELLATION", 1, 1)]);
    const { trust } = await service.getOwnProfile({ userId: "w1" });
    expect(trust.completionRate).toBe(92); // 12 / 13
    expect(trust.jobCount).toBe(12);
  });

  test("1.18nc: after one late cancellation (weight 2.0), 80%, jobs unchanged", async () => {
    prismaMock.completionRecord.groupBy.mockResolvedValue([
      group("COMPLETED", 12, 12),
      group("EARLY_CANCELLATION", 1, 1),
      group("LATE_CANCELLATION", 1, 2),
    ]);
    const { trust } = await service.getOwnProfile({ userId: "w1" });
    expect(trust.completionRate).toBe(80); // 12 / 15
    expect(trust.jobCount).toBe(12);
  });

  test("a no-show credit counts for the person but is not a job", async () => {
    prismaMock.completionRecord.groupBy.mockResolvedValue([group("COMPLETED", 3, 3), group("NO_SHOW_RELIABLE_CREDIT", 1, 1)]);
    const { trust } = await service.getOwnProfile({ userId: "w1" });
    expect(trust.completionRate).toBe(100);
    expect(trust.jobCount).toBe(3);
  });

  test("no records: no rate at all rather than 0%", async () => {
    const { trust } = await service.getOwnProfile({ userId: "w1" });
    expect(trust.completionRate).toBeNull();
    expect(trust.jobCount).toBe(0);
  });
});

describe("FR-PROF-06: the star rating", () => {
  test("only revealed, unremoved ratings are averaged, rounded to one decimal", async () => {
    prismaMock.rating.aggregate.mockResolvedValue({ _avg: { score: 4.5833 }, _count: { _all: 12 } });
    const { trust } = await service.getOwnProfile({ userId: "w1" });
    expect(prismaMock.rating.aggregate.mock.calls[0][0].where).toEqual({
      rateeId: "w1",
      revealedAt: { not: null },
      removedAt: null,
    });
    expect(trust).toMatchObject({ tier: "history", ratingAverage: 4.6, ratingCount: 12 });
  });

  test("no revealed rating yet: the zero-history tier with no average", async () => {
    const { trust } = await service.getOwnProfile({ userId: "w1" });
    expect(trust).toMatchObject({ tier: "zeroHistory", ratingAverage: null, ratingCount: 0 });
  });
});

describe("FR-PROF-01 / FR-PROF-02: identity on the profile", () => {
  test("Phone verified is reported, and nothing about the NIC is", async () => {
    const profile = await service.getOwnProfile({ userId: "w1" });
    expect(profile.phoneVerified).toBe(true);
    expect(JSON.stringify(profile)).not.toMatch(/nic/i);
  });

  test("a Business employer is shown by its business name and business bio", async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: "e1",
      role: "EMPLOYER",
      legalName: "Kamal Silva",
      postingAsType: "BUSINESS",
      businessName: "Lanka Events",
      businessBio: "Event crews since 2019.",
      bio: "personal bio, not shown",
      phoneVerifiedAt: new Date(),
      deletedAt: null,
    });
    const profile = await service.getOwnProfile({ userId: "e1" });
    expect(profile.displayName).toBe("Lanka Events");
    expect(profile.bio).toBe("Event crews since 2019.");
  });

  test("an Individual employer is shown by the legal name, with no bio", async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: "e1",
      role: "EMPLOYER",
      legalName: "Kamal Silva",
      postingAsType: "INDIVIDUAL",
      businessName: null,
      businessBio: null,
      phoneVerifiedAt: new Date(),
      deletedAt: null,
    });
    const profile = await service.getOwnProfile({ userId: "e1" });
    expect(profile.displayName).toBe("Kamal Silva");
    expect(profile.bio).toBeNull();
  });

  test("a deleted account has no profile: the session ends", async () => {
    prismaMock.user.findUnique.mockResolvedValue({ ...WORKER, deletedAt: new Date() });
    await expect(service.getOwnProfile({ userId: "w1" })).rejects.toMatchObject({ status: 401, code: "SESSION_ENDED" });
  });
});

describe("Role-specific parts of the profile", () => {
  test("worker: active endorsements, newest first, with the prototype's attribute labels", async () => {
    prismaMock.endorsement.findMany.mockResolvedValue([
      { endorser: { legalName: "Sunil Teacher" }, reason: "My student for three years.", attributes: ["PUNCTUALITY", "LENGTH_OF_ACQUAINTANCE"] },
    ]);
    const profile = await service.getOwnProfile({ userId: "w1" });
    expect(prismaMock.endorsement.findMany.mock.calls[0][0].where).toEqual({ workerId: "w1", revokedAt: null });
    expect(profile.endorsements).toEqual([
      { endorserName: "Sunil Teacher", reason: "My student for three years.", attributes: ["Punctuality", "Long acquaintance"] },
    ]);
    expect(profile.endorsedBy).toBe("Sunil Teacher");
  });

  test("worker: the endorsement code closes once any rating has been received (FR-ENDORSE-05)", async () => {
    expect((await service.getOwnProfile({ userId: "w1" })).endorsementCodeClosed).toBe(false);
    prismaMock.rating.count.mockResolvedValue(1);
    expect((await service.getOwnProfile({ userId: "w1" })).endorsementCodeClosed).toBe(true);
  });

  test("employer: completed engagements count COMPLETED and ENDED (E2E-08)", async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: "e1", role: "EMPLOYER", legalName: "Kamal Silva", phoneVerifiedAt: new Date(), deletedAt: null });
    prismaMock.engagement.count.mockResolvedValue(2);
    const profile = await service.getOwnProfile({ userId: "e1" });
    expect(prismaMock.engagement.count.mock.calls[0][0].where).toEqual({
      employerId: "e1",
      status: { in: ["COMPLETED", "ENDED"] },
    });
    expect(profile.employer).toEqual({ completedEngagements: 2 });
  });

  test("verifier: member since and the number of active endorsements given", async () => {
    const since = new Date("2026-03-01");
    prismaMock.user.findUnique.mockResolvedValue({ id: "v1", role: "COMMUNITY_ENDORSER", legalName: "Sunil Teacher", createdAt: since, phoneVerifiedAt: new Date(), deletedAt: null });
    prismaMock.endorsement.count.mockResolvedValue(4);
    const profile = await service.getOwnProfile({ userId: "v1" });
    expect(prismaMock.endorsement.count.mock.calls[0][0].where).toEqual({ endorserId: "v1", revokedAt: null });
    expect(profile.verifier).toEqual({ since, endorsedCount: 4 });
  });
});
