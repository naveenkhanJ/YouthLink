/**
 * Development stand-in for the Admin's review of an account-recovery request (FR-ACC-10 E8).
 *
 * Owner: Afham (shared tooling). In the finished product an Admin approves or rejects these on the
 * dashboard (M11 11.8rec1-3), which this project has not built. The mobile side is complete — the
 * person submits their details (1.8rec2), waits (1.8rec3), and on approval sets a new password
 * (1.8rec4 -> 1.9) — so this script plays the Admin for a demonstration or a local test.
 *
 * Run from backend/:
 *   node prisma/review-recovery.js list                       requests awaiting review
 *   node prisma/review-recovery.js approve [deviceId-prefix]  approve the latest (or the one named)
 *   node prisma/review-recovery.js reject  [deviceId-prefix]  reject it
 *
 * It only touches requests that are AWAITING_REVIEW and refuses to run in production. A request
 * whose details matched no account (userId is empty) cannot be approved: there is nobody whose
 * password it could reset.
 */
import prisma from "../src/lib/prisma.js";
import config from "../src/config/index.js";

if (config.env === "production") {
  console.error("Refusing to run in production: recovery requests are reviewed by an Admin.");
  process.exit(1);
}

const [action = "list", deviceArg] = process.argv.slice(2);
if (!["list", "approve", "reject"].includes(action)) {
  console.error("Usage: node prisma/review-recovery.js list | approve [deviceId-prefix] | reject [deviceId-prefix]");
  process.exit(1);
}

async function main() {
  const waiting = await prisma.accountRecoveryRequest.findMany({
    where: {
      status: "AWAITING_REVIEW",
      ...(deviceArg ? { deviceId: { startsWith: deviceArg } } : {}),
    },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { phone: true, legalName: true } } },
  });

  if (action === "list") {
    if (waiting.length === 0) console.log("No recovery requests are awaiting review.");
    for (const r of waiting) {
      console.log(
        `${r.id}  device ${r.deviceId.slice(0, 8)}…  submitted ${r.createdAt.toISOString()}  ` +
          (r.user ? `matches ${r.user.legalName} (${r.user.phone})` : "matches NO account"),
      );
    }
    return;
  }

  const request = waiting[0];
  if (!request) {
    console.error("No matching request is awaiting review.");
    process.exitCode = 1;
    return;
  }
  if (action === "approve" && !request.userId) {
    console.error("That request matched no account, so there is nothing to approve.");
    process.exitCode = 1;
    return;
  }

  await prisma.accountRecoveryRequest.update({
    where: { id: request.id },
    data: { status: action === "approve" ? "APPROVED" : "REJECTED", reviewedAt: new Date() },
  });
  console.log(
    `${action === "approve" ? "Approved" : "Rejected"} the request from device ${request.deviceId.slice(0, 8)}…` +
      (request.user ? ` for ${request.user.legalName}.` : "."),
  );
}

try {
  await main();
} finally {
  await prisma.$disconnect();
}
