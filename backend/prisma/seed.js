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
import { findArea } from "../src/modules/posting/posting.areas.js";

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
      // FR-ENG-01: three distinct 6-digit codes, generated at selection (APPLY-E2E-21: the earlier
      // letter codes could not be typed into the numeric code boxes).
      arrivalCode: "482913",
      completionCode: "605274",
      paymentCode: "739158",
      paymentStatus: "PENDING",
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
      arrivalCode: "318640",
      arrivalStatus: "CONFIRMED",
      arrivalConfirmedAt: at(-10 * DAY),
      completionCode: "927351",
      completionStatus: "CONFIRMED",
      completionConfirmedAt: completedAt,
      // A paid gig completes at the payment checkpoint (FR-ENG-01), which also opens rating.
      paymentCode: "164802",
      paymentStatus: "CONFIRMED",
      paymentConfirmedAt: completedAt,
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
      arrivalCode: "550417",
      arrivalStatus: "CONFIRMED",
      arrivalConfirmedAt: at(-5 * HOUR),
      completionCode: "283906",
      paymentCode: "641739",
      paymentStatus: "PENDING",
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
      arrivalCode: "706128",
      completionCode: "839452",
      paymentCode: "215960",
      paymentStatus: "PENDING",
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

  // -------------------------------------------------------------------------
  // 6. Viva demonstration data (integration/viva-demo). Added on top of everything above, which
  //    Account's and Gig Posting's tests and checklists rely on: nothing above changed except the
  //    check-in codes, now 6-digit numbers as FR-ENG-01 requires. Each block below is a state the
  //    real flows produce, for one member's demonstration.
  // -------------------------------------------------------------------------
  console.log("Creating viva demonstration data...");

  /** A posting's area fields, taken from the server's area list as a real posting is (FR-POST-08). */
  const place = (areaName, address) => {
    const area = findArea(areaName);
    if (!area) throw new Error(`Seed: "${areaName}" is not in posting.areas.js`);
    return { locationAddress: address, locationAreaLabel: area.name, locationLat: area.lat, locationLng: area.lng };
  };

  // People. Lanka Events, Nethmi, Tharindu and Kavindu are the prototype's own cast (M4's pool for
  // an event crew, M6's "4.6 from 12 ratings · 92% completion").
  const lankaEvents = await prisma.user.create({
    data: {
      ...baseUser,
      role: "EMPLOYER",
      phone: "+94770000011",
      ...nic("198812345678"),
      legalName: "Ruwan Jayasekara",
      birthdate: new Date("1988-05-02"),
      postingAsType: "BUSINESS",
      businessName: "Lanka Events (Pvt) Ltd",
    },
  });
  const lankaFields = { postedAsType: "BUSINESS", postedBusinessName: "Lanka Events (Pvt) Ltd" };
  const nethmi = await prisma.user.create({
    data: {
      ...baseUser,
      role: "YOUTH_JOB_SEEKER",
      phone: "+94770000008",
      ...nic("200212345678"),
      legalName: "Nethmi Jayasinghe",
      birthdate: new Date("2002-05-03"),
      bio: "Event crew lead with two agencies. Reliable and on time.",
    },
  });
  const tharindu = await prisma.user.create({
    data: {
      ...baseUser,
      role: "YOUTH_JOB_SEEKER",
      phone: "+94770000009",
      ...nic("200312345678"),
      legalName: "Tharindu Silva",
      birthdate: new Date("2003-05-03"),
    },
  });
  const kavindu = await prisma.user.create({
    data: {
      ...baseUser,
      role: "YOUTH_JOB_SEEKER",
      phone: "+94770000010",
      ...nic("200412345678"),
      legalName: "Kavindu Perera",
      birthdate: new Date("2004-05-02"),
    },
  });

  // 6a. Nethmi's history for the three-tier pool (FR-APPLY-04) and the completion rate (FR-RATE-03):
  //     12 completed gigs, each rated both ways and revealed, plus one early cancellation of her
  //     own — 12 / 13 = 92% completion, 12 jobs, average 4.6 (55 / 12 = 4.58).
  const nethmiScores = [5, 5, 5, 5, 5, 5, 5, 4, 4, 4, 4, 4];
  for (let i = 0; i < nethmiScores.length; i++) {
    const startAt = at(-(40 - i * 3) * DAY);
    const doneAt = new Date(startAt.getTime() + 6 * HOUR);
    const posting = await prisma.gigPosting.create({
      data: {
        employerId: lankaEvents.id,
        title: `Event crew — job ${i + 1}`,
        description: "Set up staging and seating, then clear down after the event.",
        category: "EVENT_SETUP",
        arrangementType: "GIG",
        payKind: "FIXED_TOTAL",
        payAmount: 4000,
        ...lankaFields,
        ...place("Colombo 07", "Lanka Events store, Colombo 07"),
        workersNeeded: 1,
        filledCount: 1,
        startAt,
        expiresAt: startAt,
        status: "FILLED",
        createdAt: new Date(startAt.getTime() - 3 * DAY),
      },
    });
    const application = await prisma.application.create({
      data: {
        gigPostingId: posting.id,
        workerId: nethmi.id,
        status: "SELECTED",
        appliedAt: new Date(startAt.getTime() - 2 * DAY),
        decidedAt: new Date(startAt.getTime() - 2 * DAY + HOUR),
      },
    });
    const engagement = await prisma.engagement.create({
      data: {
        applicationId: application.id,
        gigPostingId: posting.id,
        workerId: nethmi.id,
        employerId: lankaEvents.id,
        status: "COMPLETED",
        contactRevealedAt: application.decidedAt,
        arrivalCode: String(310000 + i * 7919).slice(0, 6),
        arrivalStatus: "CONFIRMED",
        arrivalConfirmedAt: startAt,
        completionCode: String(520000 + i * 6007).slice(0, 6),
        completionStatus: "CONFIRMED",
        completionConfirmedAt: doneAt,
        paymentCode: String(840000 + i * 5003).slice(0, 6),
        paymentStatus: "CONFIRMED",
        paymentConfirmedAt: doneAt,
        startedAt: startAt,
        ratingOpenedAt: doneAt,
      },
    });
    const revealedAt = new Date(doneAt.getTime() + DAY); // the second rating landed a day later
    await prisma.rating.createMany({
      data: [
        { engagementId: engagement.id, raterId: lankaEvents.id, rateeId: nethmi.id, score: nethmiScores[i], submittedAt: doneAt, revealedAt },
        { engagementId: engagement.id, raterId: nethmi.id, rateeId: lankaEvents.id, score: 5, submittedAt: revealedAt, revealedAt },
      ],
    });
    await prisma.completionRecord.create({
      data: { userId: nethmi.id, engagementId: engagement.id, outcome: "COMPLETED", recordedAt: doneAt },
    });
  }
  // Her one early cancellation (FR-ENG-06/07: more than 24 h ahead, weight 1.0). Cancelled
  // engagements can still be rated, but nobody is held to it (FR-RATE-05).
  const cancelledStart = at(-45 * DAY);
  const cancelledPosting = await prisma.gigPosting.create({
    data: {
      employerId: lankaEvents.id,
      title: "Event crew — Kandy weekend",
      description: "Two days of setup and clear-down at a Kandy venue.",
      category: "EVENT_SETUP",
      arrangementType: "GIG",
      payKind: "FIXED_TOTAL",
      payAmount: 7000,
      ...lankaFields,
      ...place("Kandy", "Lanka Events stall, Kandy"),
      workersNeeded: 1,
      filledCount: 0,
      startAt: cancelledStart,
      expiresAt: cancelledStart,
      status: "EXPIRED",
      createdAt: new Date(cancelledStart.getTime() - 8 * DAY),
    },
  });
  const cancelledApp = await prisma.application.create({
    data: {
      gigPostingId: cancelledPosting.id,
      workerId: nethmi.id,
      status: "SELECTED",
      appliedAt: new Date(cancelledStart.getTime() - 7 * DAY),
      decidedAt: new Date(cancelledStart.getTime() - 6 * DAY),
    },
  });
  const cancelledAt = new Date(cancelledStart.getTime() - 4 * DAY);
  const cancelledEng = await prisma.engagement.create({
    data: {
      applicationId: cancelledApp.id,
      gigPostingId: cancelledPosting.id,
      workerId: nethmi.id,
      employerId: lankaEvents.id,
      status: "CANCELLED",
      contactRevealedAt: cancelledApp.decidedAt,
      arrivalCode: "275813",
      completionCode: "649027",
      paymentCode: "830164",
      paymentStatus: "PENDING",
      cancelledAt,
      cancelledByUserId: nethmi.id,
      cancellationReason: "SCHEDULE_CONFLICT",
      isLateCancellation: false,
      ratingOpenedAt: cancelledAt,
      ratingEnforced: false,
    },
  });
  await prisma.completionRecord.create({
    data: { userId: nethmi.id, engagementId: cancelledEng.id, outcome: "EARLY_CANCELLATION", weight: 1.0, recordedAt: cancelledAt },
  });

  // Tharindu has no history but Sunil vouched for him: the pool's second tier (FR-APPLY-04).
  await prisma.endorsement.create({
    data: {
      endorserId: endorser.id,
      workerId: tharindu.id,
      attributes: ["PUNCTUALITY", "SPECIFIC_SKILL"],
      reason: "Tharindu helped set up our school's sports meet. Strong and always on time.",
      entryPoint: "PHONE_SEARCH",
    },
  });

  // Nethmi is vouched for by two community endorsers as well as having a history, so the pool shows
  // "Endorsed ×2" beside her ratings (M4 4.5/4.6 draw her that way). One active endorsement per
  // endorser per worker, so two different endorsers.
  for (const [i, who] of [
    { phone: "+94770000012", nicNumber: "196512345678", legalName: "K. Rathnayake", code: "KRTNYK", attributes: ["RELIABILITY"] },
    { phone: "+94770000013", nicNumber: "196812345678", legalName: "M. Perera", code: "MPRERA", attributes: ["PUNCTUALITY", "HONESTY"] },
  ].entries()) {
    const extraEndorser = await prisma.user.create({
      data: {
        ...baseUser,
        role: "COMMUNITY_ENDORSER",
        phone: who.phone,
        ...nic(who.nicNumber),
        legalName: who.legalName,
        birthdate: new Date("1965-01-01"),
        endorsementCode: who.code,
      },
    });
    await prisma.endorsement.create({
      data: {
        endorserId: extraEndorser.id,
        workerId: nethmi.id,
        attributes: who.attributes,
        reason: i === 0 ? "Nethmi ran our stage crew twice and never missed a call time." : null,
        entryPoint: "PHONE_SEARCH",
      },
    });
  }

  // 6b. Naveenkhan — the applicant pool, all three tiers on one Open posting of Kamal's (M4 4.5):
  //     Nethmi (history) first, then Tharindu (endorsed), then Kavindu (new); tiers 2 and 3 are
  //     earliest application first (YL-173).
  const poolPosting = await prisma.gigPosting.create({
    data: {
      employerId: employer.id,
      title: "Weekend event crew (3 needed)",
      description: "Set up staging and seating for a weekend event, then clear down. Gloves provided.",
      category: "EVENT_SETUP",
      arrangementType: "GIG",
      payKind: "FIXED_TOTAL",
      payAmount: 6000,
      ...businessFields,
      ...place("Colombo 05", "14 Havelock Road, Colombo 05"),
      workersNeeded: 3,
      startAt: at(4 * DAY),
      expiresAt: at(4 * DAY),
      status: "OPEN",
      createdAt: at(-10 * HOUR),
    },
  });
  await prisma.application.createMany({
    data: [
      { gigPostingId: poolPosting.id, workerId: kavindu.id, status: "PENDING", note: "Available all weekend — I've done two event setups.", appliedAt: at(-6 * HOUR) },
      { gigPostingId: poolPosting.id, workerId: tharindu.id, status: "PENDING", note: "Free from Saturday 4 AM. Strong, punctual — this would be my first gig on YouthLink.", appliedAt: at(-5 * HOUR) },
      { gigPostingId: poolPosting.id, workerId: nethmi.id, status: "PENDING", note: "Free all weekend — I've run event setups for two agencies and can lead a crew.", appliedAt: at(-3 * HOUR) },
    ],
  });

  // 6c. Pawan — Browse (FR-DISC-01/03/05). Open postings around Nugegoda, all within 5 km of it,
  //     mixing urgency, category, arrangement and pay; and one at Malabe, about 8.5 km from
  //     Homagama. From Homagama nothing is within 5 km, so the search widens 5 km at a time until
  //     5 gigs are in range — 15 km with this data (FR-DISC-01, M3 3.2).
  const openNear = [
    { employerId: employer.id, fields: businessFields, title: "Parcel delivery helper", category: "DELIVERY", arrangementType: "GIG", payKind: "FIXED_TOTAL", payAmount: 2800, area: ["Colombo 05", "22 Park Road, Colombo 05"], workersNeeded: 1, startIn: 20 * HOUR, createdAgo: 2 * HOUR },
    { employerId: lankaEvents.id, fields: lankaFields, title: "Wedding hall setup crew", category: "EVENT_SETUP", arrangementType: "GIG", payKind: "FIXED_TOTAL", payAmount: 5500, area: ["Sri Jayewardenepura Kotte", "Lanka Events hall, Kotte Road"], workersNeeded: 3, startIn: 36 * HOUR, createdAgo: 5 * HOUR },
    { employerId: employer2.id, fields: { postedAsType: "INDIVIDUAL" }, title: "Home cleaning — Saturday", category: "CLEANING", arrangementType: "GIG", payKind: "FIXED_TOTAL", payAmount: 3000, area: ["Dehiwala", "8 Hill Street, Dehiwala"], workersNeeded: 1, startIn: 3 * DAY, createdAgo: 26 * HOUR },
    { employerId: lankaEvents.id, fields: lankaFields, title: "Weekend café barista", category: "FOOD_SERVICE", arrangementType: "PART_TIME", payKind: "RATE", payAmount: 1800, payRateUnit: "DAY", schedule: "Sat and Sun, 8 am to 2 pm", area: ["Nugegoda", "Lanka Events café, High Level Road, Nugegoda"], workersNeeded: 1, startIn: 6 * DAY, createdAgo: 30 * HOUR },
    { employerId: employer2.id, fields: { postedAsType: "INDIVIDUAL" }, title: "Primary English tutor", category: "TUTORING", arrangementType: "PART_TIME", payKind: "RATE", payAmount: 2500, payRateUnit: "WEEK", schedule: "Tue and Thu, 4 to 6 pm", area: ["Maharagama", "41 Old Road, Maharagama"], workersNeeded: 1, startIn: 5 * DAY, createdAgo: 2 * DAY },
    { employerId: lankaEvents.id, fields: lankaFields, title: "Events office internship", category: "EVENT_SETUP", arrangementType: "INTERNSHIP", payKind: "STIPEND", payAmount: 15000, payRateUnit: "MONTH", schedule: "Weekdays, 9 am to 3 pm", area: ["Colombo 06", "Lanka Events office, Colombo 06"], workersNeeded: 1, startIn: 10 * DAY, createdAgo: 3 * DAY },
    { employerId: employer.id, fields: businessFields, title: "Moving help — Malabe", category: "MOVING", arrangementType: "GIG", payKind: "FIXED_TOTAL", payAmount: 4500, area: ["Malabe", "3 Kaduwela Road, Malabe"], workersNeeded: 2, startIn: 4 * DAY, createdAgo: 8 * HOUR },
  ];
  for (const gig of openNear) {
    const startAt = at(gig.startIn);
    const createdAt = at(-gig.createdAgo);
    await prisma.gigPosting.create({
      data: {
        employerId: gig.employerId,
        title: gig.title,
        description: `${gig.title}. Details are shared with the selected worker.`,
        category: gig.category,
        arrangementType: gig.arrangementType,
        payKind: gig.payKind,
        payAmount: gig.payAmount,
        payRateUnit: gig.payRateUnit ?? null,
        schedule: gig.schedule ?? null,
        ...gig.fields,
        ...place(...gig.area),
        workersNeeded: gig.workersNeeded,
        startAt,
        // FR-POST-13: a Gig expires at its start; the others 30 days after posting.
        expiresAt: gig.arrangementType === "GIG" ? startAt : new Date(createdAt.getTime() + 30 * DAY),
        isUrgent: gig.startIn <= 48 * HOUR, // FR-POST-07
        status: "OPEN",
        createdAt,
      },
    });
  }

  // Notifications (FR-NOTIF-01/02): both workers last browsed near Nugegoda; Amal has opted in to
  // urgent alerts, Nimali keeps the default (new-gig notices on, urgent off). A gig posted near
  // Nugegoda therefore reaches Amal as URGENT_GIG (if urgent) and Nimali as NEW_GIG (if not).
  await prisma.user.update({
    where: { id: worker.id },
    data: { notifyUrgentOptIn: true, lastBrowseLat: 6.87, lastBrowseLng: 79.89, lastBrowseAt: at(-1 * DAY) },
  });
  await prisma.user.update({
    where: { id: worker2.id },
    data: { lastBrowseLat: 6.87, lastBrowseLng: 79.89, lastBrowseAt: at(-2 * DAY) },
  });

  // 6d. Naveenkhan — engagements at every checkpoint (FR-ENG-01/02/12/14), started already so their
  //     codes can be used. Each comes from a selection, so each has its SELECTED application.
  let codeSeed = 0;
  async function engaged({ employerId, fields, workerId, posting, engagement, appliedAgo = 2 * DAY }) {
    const created = await prisma.gigPosting.create({
      data: {
        employerId,
        ...fields,
        workersNeeded: 1,
        filledCount: 1,
        status: "FILLED",
        ...posting,
      },
    });
    const application = await prisma.application.create({
      data: {
        gigPostingId: created.id,
        workerId,
        status: "SELECTED",
        appliedAt: at(-appliedAgo),
        decidedAt: at(-appliedAgo + HOUR),
      },
    });
    // Selection always generates the codes (FR-ENG-01: three distinct 6-digit numbers; an unpaid
    // internship has no payment checkpoint — FR-ENG-02), so every demo engagement has them unless the
    // caller says otherwise. Without them the detail would show "No check-in codes were issued".
    codeSeed += 7919;
    const unpaid = created.arrangementType === "INTERNSHIP" && created.payKind === "UNPAID";
    const defaultCodes = {
      arrivalCode: String(100000 + (codeSeed % 899999)).slice(0, 6),
      completionCode: String(100000 + ((codeSeed * 3) % 899999)).slice(0, 6),
      paymentCode: unpaid ? null : String(100000 + ((codeSeed * 7) % 899999)).slice(0, 6),
      paymentStatus: unpaid ? null : "PENDING",
    };
    return prisma.engagement.create({
      data: {
        applicationId: application.id,
        gigPostingId: created.id,
        workerId,
        employerId,
        contactRevealedAt: application.decidedAt,
        ...defaultCodes,
        ...engagement,
      },
    });
  }
  const gigPay = { arrangementType: "GIG", payKind: "FIXED_TOTAL" };

  // Arrival not yet confirmed: Kamal shows the arrival code, Amal enters it (5.4 / 5.5a).
  await engaged({
    employerId: employer.id, fields: businessFields, workerId: worker.id,
    posting: { ...gigPay, title: "Shelf restock — this morning", description: "Restock the shelves before opening.", category: "RETAIL", payAmount: 2500, ...place("Colombo 04", "78 Duplication Rd, Colombo 04"), startAt: at(-1 * HOUR), expiresAt: at(-1 * HOUR), createdAt: at(-3 * DAY) },
    engagement: { status: "ACTIVE", arrivalCode: "358176", completionCode: "274065", paymentCode: "731942", paymentStatus: "PENDING" },
  });
  // Arrived, completion next (5.5).
  await engaged({
    employerId: employer.id, fields: businessFields, workerId: worker.id,
    posting: { ...gigPay, title: "Warehouse sorting", description: "Sort incoming stock in the back store.", category: "RETAIL", payAmount: 3000, ...place("Colombo 01", "123 Main St, Colombo"), startAt: at(-3 * HOUR), expiresAt: at(-3 * HOUR), createdAt: at(-4 * DAY) },
    engagement: { status: "ACTIVE", arrivalCode: "912047", arrivalStatus: "CONFIRMED", arrivalConfirmedAt: at(-3 * HOUR), startedAt: at(-3 * HOUR), completionCode: "386215", paymentCode: "570839", paymentStatus: "PENDING" },
  });
  // Completed, payment next: custody flips — Nimali holds the payment code, Lanka Events enters it.
  await engaged({
    employerId: lankaEvents.id, fields: lankaFields, workerId: worker2.id,
    posting: { ...gigPay, title: "Stage teardown — Nugegoda", description: "Take down the stage after a school concert.", category: "EVENT_SETUP", payAmount: 4000, ...place("Nugegoda", "Nugegoda town hall"), startAt: at(-6 * HOUR), expiresAt: at(-6 * HOUR), createdAt: at(-3 * DAY) },
    engagement: { status: "ACTIVE", arrivalCode: "264951", arrivalStatus: "CONFIRMED", arrivalConfirmedAt: at(-6 * HOUR), startedAt: at(-6 * HOUR), completionCode: "731806", completionStatus: "CONFIRMED", completionConfirmedAt: at(-30 * MINUTE), paymentCode: "408273", paymentStatus: "PENDING" },
  });
  // A part-time job under way: closes only through End Engagement (FR-ENG-12). Not Dilrukshi's:
  // Account's deletion test deletes her account and needs her to have no active engagement.
  await engaged({
    employerId: lankaEvents.id, fields: lankaFields, workerId: worker2.id, appliedAgo: 10 * DAY,
    posting: { arrangementType: "PART_TIME", payKind: "RATE", payAmount: 1500, payRateUnit: "DAY", schedule: "Mon, Wed, Fri - 3 to 7 pm", title: "Box office assistant", description: "Sell tickets at the box office and help with seating.", category: "EVENT_SETUP", ...place("Dehiwala", "Lanka Events box office, Galle Road, Dehiwala"), startAt: at(-7 * DAY), expiresAt: at(3 * DAY), createdAt: at(-27 * DAY) },
    engagement: { status: "ACTIVE", arrivalCode: "615204", arrivalStatus: "CONFIRMED", arrivalConfirmedAt: at(-7 * DAY), startedAt: at(-7 * DAY) },
  });
  // An unpaid internship: no payment checkpoint — completion completes it (FR-ENG-02).
  await engaged({
    employerId: employer.id, fields: businessFields, workerId: worker.id,
    posting: { arrangementType: "INTERNSHIP", payKind: "UNPAID", payAmount: null, title: "Stockroom internship", description: "Learn how a retail stockroom runs.", category: "RETAIL", ...place("Colombo 03", "456 Galle Rd, Colombo"), startAt: at(-2 * HOUR), expiresAt: at(28 * DAY), createdAt: at(-2 * DAY) },
    engagement: { status: "ACTIVE", arrivalCode: "147302", completionCode: "859614", paymentCode: null, paymentStatus: null },
  });

  // 6e. Pawan — rating (FR-RATE-01/02). A gig completed yesterday that neither side has rated yet:
  //     the live double-blind between Amal and Kamal.
  const yesterday = at(-1 * DAY);
  const engToRate = await engaged({
    employerId: employer.id, fields: businessFields, workerId: worker.id, appliedAgo: 4 * DAY,
    posting: { ...gigPay, title: "Stock count — Saturday", description: "Count stock for the quarterly check.", category: "RETAIL", payAmount: 3000, ...place("Colombo 01", "123 Main St, Colombo"), startAt: at(-2 * DAY), expiresAt: at(-2 * DAY), createdAt: at(-5 * DAY) },
    engagement: { status: "COMPLETED", arrivalCode: "503718", arrivalStatus: "CONFIRMED", arrivalConfirmedAt: at(-2 * DAY), startedAt: at(-2 * DAY), completionCode: "690452", completionStatus: "CONFIRMED", completionConfirmedAt: yesterday, paymentCode: "128649", paymentStatus: "CONFIRMED", paymentConfirmedAt: yesterday, ratingOpenedAt: yesterday },
  });
  await prisma.completionRecord.create({
    data: { userId: worker.id, engagementId: engToRate.id, outcome: "COMPLETED", recordedAt: yesterday },
  });
  // A window that closed a day ago on Lanka Events' rating alone: on the first read it is revealed
  // at the deadline, and Nimali can no longer rate (6.1f, 6.3s — FR-RATE-02 as amended).
  const fifteenDaysAgo = at(-15 * DAY);
  const engClosed = await engaged({
    employerId: lankaEvents.id, fields: lankaFields, workerId: worker2.id, appliedAgo: 18 * DAY,
    posting: { ...gigPay, title: "Exhibition stall helper", description: "Staff a trade-fair stall for a day.", category: "EVENT_SETUP", payAmount: 3500, ...place("Colombo 07", "BMICH, Colombo 07"), startAt: at(-16 * DAY), expiresAt: at(-16 * DAY), createdAt: at(-20 * DAY) },
    engagement: { status: "COMPLETED", arrivalCode: "836025", arrivalStatus: "CONFIRMED", arrivalConfirmedAt: at(-16 * DAY), startedAt: at(-16 * DAY), completionCode: "472913", completionStatus: "CONFIRMED", completionConfirmedAt: fifteenDaysAgo, paymentCode: "905386", paymentStatus: "CONFIRMED", paymentConfirmedAt: fifteenDaysAgo, ratingOpenedAt: fifteenDaysAgo },
  });
  await prisma.rating.create({
    data: { engagementId: engClosed.id, raterId: lankaEvents.id, rateeId: worker2.id, score: 4, submittedAt: at(-14 * DAY) },
  });
  await prisma.completionRecord.create({
    data: { userId: worker2.id, engagementId: engClosed.id, outcome: "COMPLETED", recordedAt: fifteenDaysAgo },
  });

  // 6f. Naveenkhan — cancellation (FR-ENG-05/06). Not-yet-started engagements in each regime.
  // A regular request waiting for Nimali's answer: Lanka Events asked an hour ago, a week before
  // the start, so Nimali has 48 hours to accept or reject (5.9). Not Dilrukshi's (see 6d).
  const engAsked = await engaged({
    employerId: lankaEvents.id, fields: lankaFields, workerId: worker2.id, appliedAgo: 3 * DAY,
    posting: { arrangementType: "PART_TIME", payKind: "RATE", payAmount: 1800, payRateUnit: "DAY", schedule: "Sat and Sun, 9 am to 5 pm", title: "Ticket desk — weekend shows", description: "Run the ticket desk for weekend shows.", category: "EVENT_SETUP", ...place("Colombo 07", "Lanka Events theatre, Colombo 07"), startAt: at(7 * DAY), expiresAt: at(28 * DAY), createdAt: at(-2 * DAY) },
    engagement: { status: "ACTIVE", arrivalCode: "193467", createdAt: at(-3 * DAY + HOUR) },
  });
  await prisma.cancellationRequest.create({
    data: {
      engagementId: engAsked.id,
      requestedByUserId: lankaEvents.id,
      reason: "SCHEDULE_CONFLICT",
      isUrgentEngagement: false,
      requestedAt: at(-1 * HOUR),
      deadline: at(47 * HOUR), // 48 hours from the request
      status: "PENDING",
    },
  });
  // Starts in 5 days: either side can send a regular request from scratch (5.7t).
  await engaged({
    employerId: employer.id, fields: businessFields, workerId: worker.id, appliedAgo: 2 * DAY,
    posting: { ...gigPay, title: "Inventory audit — next week", description: "Help count and label stock for an audit.", category: "RETAIL", payAmount: 3500, ...place("Colombo 01", "123 Main St, Colombo"), startAt: at(5 * DAY), expiresAt: at(5 * DAY), createdAt: at(-3 * DAY) },
    engagement: { status: "ACTIVE", arrivalCode: "724591", completionCode: "368014", paymentCode: "952730", paymentStatus: "PENDING" },
  });
  // Starts in 12 hours but was booked 3 days ago: cancelling now is immediate and Late (within 24 h
  // of a start booked more than 48 h ahead — FR-ENG-06), 5.10 / 5.7e.
  await engaged({
    employerId: employer.id, fields: businessFields, workerId: worker.id, appliedAgo: 4 * DAY,
    posting: { ...gigPay, title: "Delivery van loader", description: "Load the delivery van for the evening run.", category: "DELIVERY", payAmount: 2000, ...place("Colombo 03", "456 Galle Rd, Colombo"), startAt: at(12 * HOUR), expiresAt: at(12 * HOUR), isUrgent: true, createdAt: at(-5 * DAY) },
    engagement: { status: "ACTIVE", arrivalCode: "846102", completionCode: "517386", paymentCode: "203958", paymentStatus: "PENDING", createdAt: at(-3 * DAY) },
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
  console.log("\n--- Viva demonstration data (section 6) ---");
  console.log("Employer:         +94770000011  (Ruwan Jayasekara, Business \"Lanka Events (Pvt) Ltd\")");
  console.log("Youth Job-Seeker: +94770000008  (Nethmi Jayasinghe — 4.6 from 12 ratings · 92% completion · 12 jobs)");
  console.log("Youth Job-Seeker: +94770000009  (Tharindu Silva — new, endorsed by Sunil)");
  console.log("Youth Job-Seeker: +94770000010  (Kavindu Perera — new)");
  console.log("POOL       Weekend event crew (3 needed)  (Kamal; Nethmi / Tharindu / Kavindu pending — three tiers)");
  console.log("BROWSE     6 open postings within 5 km of Nugegoda (2 urgent) + Moving help — Malabe (from Homagama the radius widens to 15 km)");
  console.log("NOTIFY     Amal opted in to urgent alerts, Amal and Nimali last browsed near Nugegoda");
  console.log("ENGAGE     Amal / Shelf restock — this morning     arrival next (Kamal shows 358176)");
  console.log("ENGAGE     Amal / Warehouse sorting                completion next (Kamal shows 386215)");
  console.log("ENGAGE     Nimali / Stage teardown — Nugegoda      payment next (Nimali shows 408273 to Lanka Events)");
  console.log("ENGAGE     Nimali / Box office assistant           part-time under way (Lanka Events) — End Engagement");
  console.log("ENGAGE     Amal / Stockroom internship             unpaid: arrival then completion only (Kamal shows 147302)");
  console.log("RATE       Amal + Kamal / Stock count — Saturday   completed yesterday, nobody has rated");
  console.log("RATE       Nimali / Exhibition stall helper        window closed on Lanka Events' rating alone");
  console.log("CANCEL     Nimali / Ticket desk — weekend shows    Lanka Events asked to cancel; Nimali to answer within 48 h");
  console.log("CANCEL     Amal / Inventory audit — next week      starts in 5 days: a regular request (48 h window)");
  console.log("CANCEL     Amal / Delivery van loader              starts in 12 h, booked 3 days ago: immediate and Late");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
