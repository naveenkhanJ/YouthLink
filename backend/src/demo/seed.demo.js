/**
 * DEMO-ONLY SEED — integration showcase branch. NOT part of any epic.
 *
 * ===========================================================================
 * Only exists on `demo/integration-showcase`. Never merge into develop.
 *   Seed:  node src/demo/seed.demo.js
 *   Wipe:  node src/demo/seed.demo.js --wipe
 * ===========================================================================
 *
 * Creates the fixtures the demo needs that no screen can currently produce:
 *
 *   1. An EMPLOYER account. Registration (FR-ACC-01) requires a Firebase
 *      ID token, and Firebase only has two test numbers configured — one is
 *      already the worker account. Without this, nothing can post a gig at all.
 *
 *   2. Rating history on some workers. Naveenkhan's three-tier applicant sort
 *      (FR-APPLY-04) is the centrepiece of his slice, but tier 1 is "workers
 *      with rating history" and nothing in the system writes a Rating or
 *      CompletionRecord yet — Engagement Lifecycle and Ratings are both
 *      deferred, unowned slices. His own code comments say to expect tier 1 to
 *      be empty. This seeds the history so all three tiers visibly separate.
 *
 * Every row is written directly through Prisma, deliberately bypassing the
 * real registration flow — this is fixture data, not a demonstration of
 * anything. Everything it creates is tagged so --wipe can find it again.
 */
import prisma from "../lib/prisma.js";
import { hashPassword } from "../modules/account/passwordHash.js";
import { encryptNic, getNicLast4 } from "../modules/account/nicCrypto.js";

// Every seeded account uses this password and a phone in this block, so --wipe
// can identify demo rows without touching anything a real flow created.
const DEMO_PASSWORD = "Demo1234";
const DEMO_PHONE_PREFIX = "+9477999";

/** Builds the User fields the schema requires, so callers stay readable. */
async function makeUser({ phone, legalName, role, nic, businessName }) {
  return {
    role,
    phone,
    phoneVerifiedAt: new Date(),
    passwordHash: await hashPassword(DEMO_PASSWORD),
    nicEncrypted: encryptNic(nic),
    nicLast4: getNicLast4(nic),
    legalName,
    birthdate: new Date("1999-05-15"),
    accountStatus: "ACTIVE",
    tosAcceptedAt: new Date(),
    ...(businessName
      ? { postingAsType: "BUSINESS", businessName }
      : {}),
  };
}

/** Hours from now, as a Date — postings need a start at least 2h out (FR-POST-05). */
function hoursFromNow(h) {
  return new Date(Date.now() + h * 60 * 60 * 1000);
}

async function wipe() {
  const demoUsers = await prisma.user.findMany({
    where: { phone: { startsWith: DEMO_PHONE_PREFIX } },
    select: { id: true },
  });
  const ids = demoUsers.map((u) => u.id);
  if (ids.length === 0) {
    console.log("Nothing to wipe — no demo accounts found.");
    return;
  }

  // Order matters: children before parents, or the foreign keys reject it.
  const postings = await prisma.gigPosting.findMany({
    where: { employerId: { in: ids } },
    select: { id: true },
  });
  const postingIds = postings.map((p) => p.id);

  await prisma.rating.deleteMany({ where: { rateeId: { in: ids } } });
  await prisma.completionRecord.deleteMany({ where: { userId: { in: ids } } });
  await prisma.endorsement.deleteMany({ where: { workerId: { in: ids } } });
  await prisma.notification.deleteMany({ where: { userId: { in: ids } } });
  await prisma.engagement.deleteMany({
    where: { OR: [{ workerId: { in: ids } }, { gigPostingId: { in: postingIds } }] },
  });
  await prisma.application.deleteMany({
    where: { OR: [{ workerId: { in: ids } }, { gigPostingId: { in: postingIds } }] },
  });
  await prisma.gigPosting.deleteMany({ where: { id: { in: postingIds } } });
  await prisma.user.deleteMany({ where: { id: { in: ids } } });

  console.log(`Wiped ${ids.length} demo accounts and everything attached to them.`);
}

async function seed() {
  await wipe(); // idempotent — re-running the seed never stacks duplicates

  // --- The employer, and a community endorser to make endorsements real -----
  const employer = await prisma.user.create({
    data: await makeUser({
      phone: `${DEMO_PHONE_PREFIX}001`,
      legalName: "Nimal Perera",
      role: "EMPLOYER",
      nic: "199012345671",
      businessName: "Perera Catering Services",
    }),
  });

  const endorser = await prisma.user.create({
    data: await makeUser({
      phone: `${DEMO_PHONE_PREFIX}002`,
      legalName: "Kamala Silva",
      role: "COMMUNITY_ENDORSER",
      nic: "197512345672",
    }),
  });

  // --- Three workers, one per applicant tier -------------------------------
  // Tier 1: has revealed rating history. Tier 2: no history but endorsed.
  // Tier 3: neither — new to YouthLink.
  const tier1 = await prisma.user.create({
    data: await makeUser({
      phone: `${DEMO_PHONE_PREFIX}011`,
      legalName: "Dilani Fernando",
      role: "YOUTH_JOB_SEEKER",
      nic: "200212345673",
    }),
  });
  const tier2 = await prisma.user.create({
    data: await makeUser({
      phone: `${DEMO_PHONE_PREFIX}012`,
      legalName: "Ruwan Jayasuriya",
      role: "YOUTH_JOB_SEEKER",
      nic: "200312345674",
    }),
  });
  const tier3 = await prisma.user.create({
    data: await makeUser({
      phone: `${DEMO_PHONE_PREFIX}013`,
      legalName: "Sanduni Bandara",
      role: "YOUTH_JOB_SEEKER",
      nic: "200412345675",
    }),
  });

  // --- Postings ------------------------------------------------------------
  // Urgent one starts inside FR-POST-07's 24-48h window; the other is well
  // outside it, so the computed urgency flag visibly differs between them.
  const urgentPosting = await prisma.gigPosting.create({
    data: {
      employerId: employer.id,
      title: "Kitchen assistant for weekend event",
      description:
        "Help prepare and serve food at a 200-guest wedding reception. No experience needed, training provided on the day.",
      category: "FOOD_SERVICE",
      arrangementType: "GIG",
      // FR-POST-04: a Gig is a fixed total per worker, with no rate unit.
      payKind: "FIXED_TOTAL",
      payAmount: 4500,
      postedAsType: "BUSINESS",
      postedBusinessName: "Perera Catering Services",
      postedBusinessBio: "Family-run catering business serving Colombo since 2011.",
      locationAddress: "142/3 Galle Road, Bambalapitiya",
      locationLat: 6.8905,
      locationLng: 79.8565,
      locationAreaLabel: "Bambalapitiya, Colombo 04",
      workersNeeded: 2,
      startAt: hoursFromNow(30),
      schedule: "Saturday 4pm - 11pm",
      isUrgent: true,
    },
  });

  const normalPosting = await prisma.gigPosting.create({
    data: {
      employerId: employer.id,
      title: "Weekend retail floor assistant",
      description:
        "Assist customers, restock shelves and handle the till at a clothing store. Saturdays and Sundays, ongoing.",
      category: "RETAIL",
      arrangementType: "PART_TIME",
      payKind: "RATE",
      payAmount: 32000,
      payRateUnit: "MONTH",
      postedAsType: "BUSINESS",
      postedBusinessName: "Perera Catering Services",
      locationAddress: "88 Duplication Road, Kollupitiya",
      locationLat: 6.9105,
      locationLng: 79.8503,
      locationAreaLabel: "Kollupitiya, Colombo 03",
      workersNeeded: 1,
      startAt: hoursFromNow(24 * 10),
      schedule: "Sat & Sun, 9am - 5pm",
      isUrgent: false,
    },
  });

  // --- Rating history for the tier-1 worker --------------------------------
  // Needs a completed Engagement to hang off, which needs an Application.
  // This is past work, unrelated to the two postings above.
  const pastPosting = await prisma.gigPosting.create({
    data: {
      employerId: employer.id,
      title: "Event setup crew (completed)",
      description: "Past engagement, seeded so the tier-1 worker has real rating history.",
      category: "EVENT_SETUP",
      arrangementType: "GIG",
      payKind: "FIXED_TOTAL",
      payAmount: 6000,
      postedAsType: "BUSINESS",
      postedBusinessName: "Perera Catering Services",
      locationAddress: "5 Independence Avenue, Colombo 07",
      locationLat: 6.9061,
      locationLng: 79.8687,
      locationAreaLabel: "Cinnamon Gardens, Colombo 07",
      workersNeeded: 1,
      filledCount: 1,
      startAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      status: "FILLED",
      isUrgent: false,
    },
  });

  const pastApplication = await prisma.application.create({
    data: {
      gigPostingId: pastPosting.id,
      workerId: tier1.id,
      status: "SELECTED",
      decidedAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000),
    },
  });

  const pastEngagement = await prisma.engagement.create({
    data: {
      applicationId: pastApplication.id,
      gigPostingId: pastPosting.id,
      workerId: tier1.id,
      employerId: employer.id,
      status: "COMPLETED",
      endedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    },
  });

  // revealedAt must be set — getApplicantPool only counts revealed ratings,
  // which is the double-blind rule (FR-RATE-02) working as intended.
  await prisma.rating.create({
    data: {
      engagementId: pastEngagement.id,
      raterId: employer.id,
      rateeId: tier1.id,
      score: 5,
      revealedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.completionRecord.create({
    data: { userId: tier1.id, engagementId: pastEngagement.id, outcome: "COMPLETED", weight: 1.0 },
  });

  // --- Endorsement for the tier-2 worker -----------------------------------
  await prisma.endorsement.create({
    data: {
      endorserId: endorser.id,
      workerId: tier2.id,
      reason: "Known him three years through the community centre. Reliable and punctual.",
      entryPoint: "CODE",
    },
  });

  // --- Applications, so the pool has something to sort ---------------------
  // Deliberately applied in reverse tier order, so the pool being correctly
  // sorted is visible rather than coincidental.
  for (const worker of [tier3, tier2, tier1]) {
    await prisma.application.create({
      data: {
        gigPostingId: urgentPosting.id,
        workerId: worker.id,
        note: `${worker.legalName.split(" ")[0]} is available for the full shift.`,
      },
    });
  }

  console.log(`
Demo data seeded.

  Employer         ${employer.phone}   ${employer.legalName} (Perera Catering Services)
  Endorser         ${endorser.phone}   ${endorser.legalName}
  Worker tier 1    ${tier1.phone}   ${tier1.legalName}   5-star history, 100% completion
  Worker tier 2    ${tier2.phone}   ${tier2.legalName}   endorsed, no history
  Worker tier 3    ${tier3.phone}   ${tier3.legalName}   new to YouthLink

  Password for all seeded accounts: ${DEMO_PASSWORD}

  Postings         "${urgentPosting.title}"  (urgent, 2 slots, 3 applicants)
                   "${normalPosting.title}"  (not urgent, 1 slot)

Real Firebase test accounts are untouched — +94770000001 still works for the
OTP login path, and +94770000002 is still free to register live.
`);
}

const wipeOnly = process.argv.includes("--wipe");

(wipeOnly ? wipe() : seed())
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
