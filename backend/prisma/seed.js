/**
 * Shared development seed — `npx prisma db seed` (configured in prisma.config.ts).
 *
 * Owner: Afham (shared components). Gives every module realistic data from the
 * others so nobody waits on anyone (docs/workflow/agent-protocol.md §4.4):
 * Applying builds against postings, Engagement/Rating against engagements in
 * every state they have to handle, Endorsement against a verifier and a worker.
 *
 * DESTRUCTIVE: it empties every table before inserting. It therefore refuses to
 * run when NODE_ENV is "production" or when DATABASE_URL does not point at this
 * machine, unless you pass --allow-remote on purpose.
 *
 * All dates are relative to "now", so the data stays plausible whenever it is
 * run (an "ended 3 days ago" engagement is always 3 days old).
 *
 * Every row is a state the real flows can produce (see the comments on each
 * block); nothing here is a shortcut the application itself could not reach.
 */
import { PrismaClient } from "../generated/prisma/client.js";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "../src/modules/account/passwordHash.js";
import { encryptNic, getNicLast4 } from "../src/modules/account/nicCrypto.js";
import config from "../src/config/index.js";

// ---------------------------------------------------------------------------
// Safety guard — runs before any connection is opened.
// ---------------------------------------------------------------------------
const LOCAL_HOSTS = ["localhost", "127.0.0.1", "::1", "[::1]"];

function assertSafeToWipe() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Refusing to seed: NODE_ENV is 'production'.");
  }
  let host;
  try {
    host = new URL(config.databaseUrl).hostname;
  } catch {
    throw new Error("Refusing to seed: DATABASE_URL is not a valid URL.");
  }
  if (!LOCAL_HOSTS.includes(host) && !process.argv.includes("--allow-remote")) {
    throw new Error(
      `Refusing to seed: DATABASE_URL points at '${host}', not this machine. ` +
        "The seed deletes every row. Re-run with --allow-remote only if that is intended.",
    );
  }
}

// ---------------------------------------------------------------------------
// Time helpers
// ---------------------------------------------------------------------------
const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const now = Date.now();
/** A date `ms` from now (negative = in the past). */
const at = (ms) => new Date(now + ms);

assertSafeToWipe();

const pool = new pg.Pool({ connectionString: config.databaseUrl });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function truncateEverything() {
  // Every table in the public schema except Prisma's own bookkeeping, so a
  // table added by a later migration is wiped too (the old hard-coded list
  // silently missed any it did not name).
  const tables = await prisma.$queryRaw`
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public' AND tablename <> '_prisma_migrations'
  `;
  const list = tables.map((t) => `"${t.tablename}"`).join(", ");
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${list} CASCADE`);
}

async function main() {
  console.log("Seeding database...");
  console.log("Truncating tables...");
  await truncateEverything();

  const passwordHash = await hashPassword("Password123!");

  // -------------------------------------------------------------------------
  // 1. Users — every account is ACTIVE with a verified phone and ToS accepted,
  //    the state registration (FR-ACC-01) leaves behind.
  // -------------------------------------------------------------------------
  console.log("Creating users...");
  const baseUser = {
    passwordHash,
    phoneVerifiedAt: new Date(now - 30 * DAY),
    tosAcceptedAt: new Date(now - 30 * DAY),
    accountStatus: "ACTIVE",
  };
  const nic = (n) => ({ nicEncrypted: encryptNic(n), nicLast4: getNicLast4(n) });

  // Verified email on the first worker so the email channel of password reset
  // (FR-ACC-10) can be exercised against seeded data.
  const worker = await prisma.user.create({
    data: {
      ...baseUser,
      role: "YOUTH_JOB_SEEKER",
      phone: "+94770000001",
      email: "amal@example.com",
      emailVerifiedAt: new Date(now - 30 * DAY),
      ...nic("200012345678"),
      legalName: "Amal Perera",
      birthdate: new Date("2000-01-01"),
      bio: "Enthusiastic and reliable worker.",
    },
  });

  const employer = await prisma.user.create({
    data: {
      ...baseUser,
      role: "EMPLOYER",
      phone: "+94770000002",
      ...nic("198012345678"),
      legalName: "Kamal Silva",
      birthdate: new Date("1980-01-01"),
      postingAsType: "BUSINESS",
      businessName: "Silva Retailers",
    },
  });

  const endorser = await prisma.user.create({
    data: {
      ...baseUser,
      role: "COMMUNITY_ENDORSER",
      phone: "+94770000003",
      ...nic("197012345678"),
      legalName: "Sunil Teacher",
      birthdate: new Date("1970-01-01"),
      endorsementCode: "SNLTCH",
    },
  });

  const worker2 = await prisma.user.create({
    data: {
      ...baseUser,
      role: "YOUTH_JOB_SEEKER",
      phone: "+94770000005",
      ...nic("200112345678"),
      legalName: "Nimali Fernando",
      birthdate: new Date("2001-06-15"),
    },
  });

  const employer2 = await prisma.user.create({
    data: {
      ...baseUser,
      role: "EMPLOYER",
      phone: "+94770000006",
      ...nic("199012345678"),
      legalName: "Dilrukshi Herath",
      birthdate: new Date("1990-03-20"),
      postingAsType: "INDIVIDUAL",
    },
  });

  await prisma.adminAccount.create({
    data: { phone: "+94770000004", passwordHash, role: "ADMIN" },
  });

  // -------------------------------------------------------------------------
  // 2. Postings — a spread of arrangement types, pay kinds and states.
  //    FR-POST-04: a Gig is a fixed total only; Part-time is a rate with a unit.
  // -------------------------------------------------------------------------
  console.log("Creating postings...");
  const businessFields = {
    postedAsType: "BUSINESS",
    postedBusinessName: "Silva Retailers",
  };

  // OPEN, urgent (starts in under 48 h — FR-POST-07), 2 slots, 1 already filled.
  const gigUrgent = await prisma.gigPosting.create({
    data: {
      employerId: employer.id,
      title: "Store Helper Needed",
      description: "Help organize shelves and manage inventory for the weekend.",
      category: "RETAIL",
      arrangementType: "GIG",
      payKind: "FIXED_TOTAL",
      payAmount: 2500,
      ...businessFields,
      locationAddress: "123 Main St, Colombo",
      locationLat: 6.9271,
      locationLng: 79.8612,
      locationAreaLabel: "Colombo 01",
      workersNeeded: 2,
      filledCount: 1,
      startAt: at(30 * HOUR),
      isUrgent: true,
      status: "OPEN",
    },
  });

  // OPEN part-time job, nobody has applied yet.
  await prisma.gigPosting.create({
    data: {
      employerId: employer.id,
      title: "Flyer Distribution",
      description: "Distribute flyers around the neighborhood.",
      category: "DELIVERY",
      arrangementType: "PART_TIME",
      payKind: "RATE",
      payAmount: 2000,
      payRateUnit: "WEEK",
      ...businessFields,
      locationAddress: "456 Galle Rd, Colombo",
      locationLat: 6.9,
      locationLng: 79.85,
      locationAreaLabel: "Colombo 03",
      workersNeeded: 1,
      startAt: at(5 * DAY),
      status: "OPEN",
    },
  });

  // Past one-off gig, fully filled, worked and completed.
  const gigDone = await prisma.gigPosting.create({
    data: {
      employerId: employer.id,
      title: "Shop assistant — weekend",
      description: "Cover the till and restock over the weekend.",
      category: "RETAIL",
      arrangementType: "GIG",
      payKind: "FIXED_TOTAL",
      payAmount: 3000,
      ...businessFields,
      locationAddress: "78 Duplication Rd, Colombo",
      locationLat: 6.9147,
      locationLng: 79.8553,
      locationAreaLabel: "Colombo 04",
      workersNeeded: 1,
      filledCount: 1,
      startAt: at(-10 * DAY),
      status: "FILLED",
    },
  });

  // Part-time posting by an individual employer; its engagement has been ended.
  const tutoring = await prisma.gigPosting.create({
    data: {
      employerId: employer2.id,
      title: "Grade 8 maths tutoring",
      description: "Two evenings a week with a Grade 8 student.",
      category: "TUTORING",
      arrangementType: "PART_TIME",
      payKind: "RATE",
      payAmount: 1500,
      payRateUnit: "WEEK",
      postedAsType: "INDIVIDUAL",
      locationAddress: "12 Flower Rd, Colombo",
      locationLat: 6.9087,
      locationLng: 79.8645,
      locationAreaLabel: "Colombo 07",
      workersNeeded: 1,
      filledCount: 1,
      startAt: at(-20 * DAY),
      status: "FILLED",
    },
  });

  // Older part-time posting, ended more than 14 days ago (reveal window passed).
  const cashier = await prisma.gigPosting.create({
    data: {
      employerId: employer.id,
      title: "Evening cashier",
      description: "Evening shifts at the till, three days a week.",
      category: "RETAIL",
      arrangementType: "PART_TIME",
      payKind: "RATE",
      payAmount: 800,
      payRateUnit: "DAY",
      ...businessFields,
      locationAddress: "123 Main St, Colombo",
      locationLat: 6.9271,
      locationLng: 79.8612,
      locationAreaLabel: "Colombo 01",
      workersNeeded: 1,
      filledCount: 1,
      startAt: at(-40 * DAY),
      status: "FILLED",
    },
  });

  // -------------------------------------------------------------------------
  // 3. Applications and Engagements. Selecting an applicant (FR-APPLY-06) sets
  //    the Application to SELECTED and spawns exactly one Engagement.
  // -------------------------------------------------------------------------
  console.log("Creating applications and engagements...");

  // Applicant pool of the urgent gig: one selected, one still pending.
  const appSelected = await prisma.application.create({
    data: {
      gigPostingId: gigUrgent.id,
      workerId: worker.id,
      status: "SELECTED",
      note: "I live nearby and can start immediately.",
      appliedAt: at(-5 * HOUR),
      decidedAt: at(-3 * HOUR),
    },
  });
  await prisma.application.create({
    data: {
      gigPostingId: gigUrgent.id,
      workerId: worker2.id,
      status: "PENDING",
      note: "Available all weekend.",
      appliedAt: at(-2 * HOUR),
    },
  });

  // ACTIVE engagement: selected, contact revealed, nothing exchanged yet.
  await prisma.engagement.create({
    data: {
      applicationId: appSelected.id,
      gigPostingId: gigUrgent.id,
      workerId: worker.id,
      employerId: employer.id,
      status: "ACTIVE",
      contactRevealedAt: at(-3 * HOUR),
      arrivalCode: "ARR123",
      completionCode: "CMP456",
    },
  });

  // COMPLETED gig: both checkpoints confirmed, both ratings submitted, and
  // revealed together the moment the second one landed (FR-RATE-02).
  const completedAt = at(-9 * DAY);
  const appDone = await prisma.application.create({
    data: {
      gigPostingId: gigDone.id,
      workerId: worker.id,
      status: "SELECTED",
      appliedAt: at(-12 * DAY),
      decidedAt: at(-11 * DAY),
    },
  });
  const engDone = await prisma.engagement.create({
    data: {
      applicationId: appDone.id,
      gigPostingId: gigDone.id,
      workerId: worker.id,
      employerId: employer.id,
      status: "COMPLETED",
      contactRevealedAt: at(-11 * DAY),
      arrivalCode: "ARR789",
      arrivalStatus: "CONFIRMED",
      arrivalConfirmedAt: at(-10 * DAY),
      completionCode: "CMP012",
      completionStatus: "CONFIRMED",
      completionConfirmedAt: completedAt,
      startedAt: at(-10 * DAY),
      ratingOpenedAt: completedAt,
    },
  });
  await prisma.rating.createMany({
    data: [
      {
        engagementId: engDone.id,
        raterId: employer.id,
        rateeId: worker.id,
        score: 5,
        submittedAt: at(-8 * DAY),
        revealedAt: at(-7 * DAY),
      },
      {
        engagementId: engDone.id,
        raterId: worker.id,
        rateeId: employer.id,
        score: 4,
        submittedAt: at(-7 * DAY),
        revealedAt: at(-7 * DAY),
      },
    ],
  });
  await prisma.completionRecord.create({
    data: {
      userId: worker.id,
      engagementId: engDone.id,
      outcome: "COMPLETED",
      recordedAt: completedAt,
    },
  });

  // ENDED part-time engagement, rating window OPEN: the employer ended it with
  // "nothing went wrong" (FR-ENG-12) and has rated; the worker has not yet, so
  // the employer's rating is still hidden (FR-RATE-02, double-blind).
  const endedRecently = at(-3 * DAY);
  const appTutoring = await prisma.application.create({
    data: {
      gigPostingId: tutoring.id,
      workerId: worker2.id,
      status: "SELECTED",
      appliedAt: at(-23 * DAY),
      decidedAt: at(-22 * DAY),
    },
  });
  const engTutoring = await prisma.engagement.create({
    data: {
      applicationId: appTutoring.id,
      gigPostingId: tutoring.id,
      workerId: worker2.id,
      employerId: employer2.id,
      status: "ENDED",
      contactRevealedAt: at(-22 * DAY),
      arrivalStatus: "CONFIRMED",
      arrivalConfirmedAt: at(-20 * DAY),
      startedAt: at(-20 * DAY),
      endedAt: endedRecently,
      endedByUserId: employer2.id,
      endIssueFlag: false,
      ratingOpenedAt: endedRecently,
    },
  });
  await prisma.rating.create({
    data: {
      engagementId: engTutoring.id,
      raterId: employer2.id,
      rateeId: worker2.id,
      score: 4,
      submittedAt: at(-2 * DAY),
      // revealedAt stays null: only one side has rated and 14 days have not passed.
    },
  });
  await prisma.completionRecord.create({
    data: {
      userId: worker2.id,
      engagementId: engTutoring.id,
      outcome: "COMPLETED",
      recordedAt: endedRecently,
    },
  });

  // ENDED part-time engagement whose 14 days have passed with ONE rating: it was
  // revealed at the deadline and submission is now closed for the party who
  // stayed silent (FR-RATE-02 as amended — the employer never rated).
  const endedLongAgo = at(-20 * DAY);
  const appCashier = await prisma.application.create({
    data: {
      gigPostingId: cashier.id,
      workerId: worker.id,
      status: "SELECTED",
      appliedAt: at(-43 * DAY),
      decidedAt: at(-42 * DAY),
    },
  });
  const engCashier = await prisma.engagement.create({
    data: {
      applicationId: appCashier.id,
      gigPostingId: cashier.id,
      workerId: worker.id,
      employerId: employer.id,
      status: "ENDED",
      contactRevealedAt: at(-42 * DAY),
      arrivalStatus: "CONFIRMED",
      arrivalConfirmedAt: at(-40 * DAY),
      startedAt: at(-40 * DAY),
      endedAt: endedLongAgo,
      endedByUserId: worker.id,
      endIssueFlag: false,
      ratingOpenedAt: endedLongAgo,
    },
  });
  await prisma.rating.create({
    data: {
      engagementId: engCashier.id,
      raterId: worker.id,
      rateeId: employer.id,
      score: 3,
      submittedAt: at(-19 * DAY),
      revealedAt: new Date(endedLongAgo.getTime() + 14 * DAY),
    },
  });
  await prisma.completionRecord.create({
    data: {
      userId: worker.id,
      engagementId: engCashier.id,
      outcome: "COMPLETED",
      recordedAt: endedLongAgo,
    },
  });

  // -------------------------------------------------------------------------
  // 4. Endorsement — the verifier vouching for the first worker.
  // -------------------------------------------------------------------------
  console.log("Creating endorsements...");
  await prisma.endorsement.create({
    data: {
      endorserId: endorser.id,
      workerId: worker.id,
      attributes: ["RELIABILITY"],
      reason: "Amal is always on time.",
      entryPoint: "CODE",
    },
  });

  console.log("Seed completed successfully!");
  console.log("\n--- Test accounts (password for all: Password123!) ---");
  console.log("Youth Job-Seeker: +94770000001  (Amal Perera, verified email amal@example.com)");
  console.log("Youth Job-Seeker: +94770000005  (Nimali Fernando)");
  console.log("Employer:         +94770000002  (Kamal Silva, Business)");
  console.log("Employer:         +94770000006  (Dilrukshi Herath, Individual)");
  console.log("Verifier:         +94770000003  (Sunil Teacher, code SNLTCH)");
  console.log("Admin:            +94770000004");
  console.log("\n--- Engagement states seeded ---");
  console.log("ACTIVE     Amal  / Store Helper Needed        (applicant Nimali still PENDING)");
  console.log("COMPLETED  Amal  / Shop assistant — weekend    (both ratings revealed)");
  console.log("ENDED      Nimali / Grade 8 maths tutoring     (employer rated, hidden; Nimali can still rate)");
  console.log("ENDED      Amal  / Evening cashier             (14 days passed; one rating revealed, submission closed)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
