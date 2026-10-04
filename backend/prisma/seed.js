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

  // A third employer, whose posting is hidden pending review (section 4): the owner's view of
  // FR-DISPUTE-02's auto-hide (prototype 2.10g, 2.11g).
  const employer3 = await prisma.user.create({
    data: {
      ...baseUser,
      role: "EMPLOYER",
      phone: "+94770000007",
      ...nic("198512345678"),
      legalName: "R. Gunasekara",
      birthdate: new Date("1985-07-10"),
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
      expiresAt: at(30 * HOUR), // FR-POST-13: a Gig expires when it starts
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
      expiresAt: at(30 * DAY), // FR-POST-13: a part-time job expires 30 days after posting
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
  // 4. Posting states for the owner's screens (prototype M2: 2.10w/2.11x, 2.10/2.11ex, 2.11c,
  //    2.10g/2.11g). Each row is what the real flow leaves behind: withdrawal sets
  //    status+withdrawnAt (FR-POST-12); expiry flips an Open posting at its start and closes only
  //    the unfilled slots (FR-POST-13); a material edit after a fill keeps the posting Open and
  //    creates one PENDING MaterialChangeRequest per engaged worker (FR-POST-11, FR-ENG-09); the
  //    third independent report sets autoHiddenAt (FR-DISPUTE-02).
  // -------------------------------------------------------------------------
  console.log("Creating posting states (withdrawn, expired, hidden, awaiting re-confirmation)...");
  const gigBase = {
    arrangementType: "GIG",
    payKind: "FIXED_TOTAL",
    ...businessFields,
    locationAddress: "23 Temple Road, Colombo 04",
    locationLat: 6.9147,
    locationLng: 79.8553,
    locationAreaLabel: "Colombo 04",
  };

  // WITHDRAWN before anyone applied: 0 of 3, "no one had applied".
  await prisma.gigPosting.create({
    data: {
      ...gigBase,
      employerId: employer.id,
      title: "Weekend market stall helpers",
      description: "Set up and run a market stall on Saturday morning.",
      category: "RETAIL",
      payAmount: 4000,
      workersNeeded: 3,
      startAt: at(4 * DAY),
      expiresAt: at(4 * DAY),
      status: "WITHDRAWN",
      withdrawnAt: at(-2 * DAY),
      createdAt: at(-3 * DAY),
    },
  });

  // EXPIRED, nobody selected: its start passed three days ago ("0 of 2 filled · Expired").
  await prisma.gigPosting.create({
    data: {
      ...gigBase,
      employerId: employer.id,
      title: "Event teardown — Sunday",
      description: "Take down staging and chairs after a weekend event.",
      category: "EVENT_SETUP",
      payAmount: 3500,
      workersNeeded: 2,
      startAt: at(-3 * DAY),
      expiresAt: at(-3 * DAY),
      status: "EXPIRED",
      createdAt: at(-6 * DAY),
    },
  });

  // EXPIRED with one slot filled: only the unfilled slot closed; the engagement carries on.
  const stageCrew = await prisma.gigPosting.create({
    data: {
      ...gigBase,
      employerId: employer.id,
      title: "Stage crew — weekend",
      description: "Load in and rig the stage for a weekend show.",
      category: "EVENT_SETUP",
      payAmount: 4000,
      workersNeeded: 2,
      filledCount: 1,
      startAt: at(-5 * HOUR),
      expiresAt: at(-5 * HOUR),
      status: "EXPIRED",
      createdAt: at(-2 * DAY),
    },
  });
  const appStage = await prisma.application.create({
    data: {
      gigPostingId: stageCrew.id,
      workerId: worker2.id,
      status: "SELECTED",
      appliedAt: at(-30 * HOUR),
      decidedAt: at(-28 * HOUR),
    },
  });
  await prisma.engagement.create({
    data: {
      applicationId: appStage.id,
      gigPostingId: stageCrew.id,
      workerId: worker2.id,
      employerId: employer.id,
      status: "ACTIVE",
      contactRevealedAt: at(-28 * HOUR),
      arrivalCode: "ARR321",
      arrivalStatus: "CONFIRMED",
      arrivalConfirmedAt: at(-5 * HOUR),
      completionCode: "CMP654",
      startedAt: at(-5 * HOUR),
    },
  });

  // OPEN, 1 of 3 filled, an edit awaiting the engaged worker's re-confirmation (2.11c): the
  // start moved from 38 h to 40 h away, so the deadline is the shorter of 48 h and half the time
  // left. One applicant is still Pending and is told about the change (FR-APPLY-10).
  const eventCrew = await prisma.gigPosting.create({
    data: {
      ...gigBase,
      employerId: employer.id,
      title: "Event setup crew (3 needed)",
      description: "Help set up staging and seating for a weekend event. Gloves provided.",
      category: "EVENT_SETUP",
      payAmount: 6000,
      workersNeeded: 3,
      filledCount: 1,
      startAt: at(40 * HOUR),
      expiresAt: at(40 * HOUR),
      isUrgent: true,
      status: "OPEN",
      createdAt: at(-6 * HOUR),
    },
  });
  const appCrewAmal = await prisma.application.create({
    data: {
      gigPostingId: eventCrew.id,
      workerId: worker.id,
      status: "SELECTED",
      appliedAt: at(-5 * HOUR),
      decidedAt: at(-4 * HOUR),
    },
  });
  await prisma.application.create({
    data: {
      gigPostingId: eventCrew.id,
      workerId: worker2.id,
      status: "PENDING",
      note: "Free all weekend.",
      appliedAt: at(-3 * HOUR),
    },
  });
  const engCrew = await prisma.engagement.create({
    data: {
      applicationId: appCrewAmal.id,
      gigPostingId: eventCrew.id,
      workerId: worker.id,
      employerId: employer.id,
      status: "ACTIVE",
      contactRevealedAt: at(-4 * HOUR),
      arrivalCode: "ARR246",
      completionCode: "CMP135",
    },
  });
  await prisma.materialChangeRequest.create({
    data: {
      gigPostingId: eventCrew.id,
      engagementId: engCrew.id,
      changeSummary: { startAt: { from: at(38 * HOUR).toISOString(), to: at(40 * HOUR).toISOString() } },
      proposedAt: at(-1 * HOUR),
      // shorter of 48 h and half the time left to the new start (41 h): 20.5 h after the proposal
      deadline: at(19 * HOUR + 30 * MINUTE),
      status: "PENDING",
    },
  });

  // HIDDEN pending review: the third independent report landed a day ago (FR-DISPUTE-02). The owner
  // sees the status, never a count; everyone else gets "not found".
  const hiddenPosting = await prisma.gigPosting.create({
    data: {
      ...gigBase,
      employerId: employer3.id,
      postedAsType: "INDIVIDUAL",
      postedBusinessName: null,
      title: "Data entry — work from home",
      description: "Easy online work, pay is sent after you buy a starter kit.",
      category: "RETAIL",
      payAmount: 4500,
      locationAddress: "5 School Lane, Maharagama",
      locationLat: 6.8473,
      locationLng: 79.9266,
      locationAreaLabel: "Maharagama",
      workersNeeded: 1,
      startAt: at(3 * DAY),
      expiresAt: at(3 * DAY),
      status: "OPEN",
      autoHiddenAt: at(-1 * DAY),
      createdAt: at(-4 * DAY),
    },
  });
  await prisma.report.createMany({
    data: [worker, worker2, endorser].map((reporter, i) => ({
      reporterId: reporter.id,
      targetGigPostingId: hiddenPosting.id,
      reason: "FRAUD_SCAM",
      detail: "Asks for money before any work.",
      createdAt: at(-30 * HOUR + i * HOUR),
    })),
  });

  // -------------------------------------------------------------------------
  // 5. Endorsement — the verifier vouching for the first worker.
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
  console.log("Employer:         +94770000007  (R. Gunasekara, Individual; one posting hidden pending review)");
  console.log("Verifier:         +94770000003  (Sunil Teacher, code SNLTCH)");
  console.log("Admin:            +94770000004");
  console.log("\n--- Engagement states seeded ---");
  console.log("ACTIVE     Amal  / Store Helper Needed        (applicant Nimali still PENDING)");
  console.log("COMPLETED  Amal  / Shop assistant — weekend    (both ratings revealed)");
  console.log("ENDED      Nimali / Grade 8 maths tutoring     (employer rated, hidden; Nimali can still rate)");
  console.log("ENDED      Amal  / Evening cashier             (14 days passed; one rating revealed, submission closed)");
  console.log("\n--- Posting states seeded (Kamal Silva unless noted) ---");
  console.log("WITHDRAWN  Weekend market stall helpers   (0 of 3, no applicants)");
  console.log("EXPIRED    Event teardown — Sunday        (0 of 2, start passed 3 days ago)");
  console.log("EXPIRED    Stage crew — weekend           (1 of 2; Nimali's engagement carries on)");
  console.log("OPEN       Event setup crew (3 needed)    (1 of 3; re-confirmation PENDING for Amal; Nimali applied)");
  console.log("HIDDEN     Data entry — work from home    (R. Gunasekara; 3 reports, autoHiddenAt set)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
