// account.api.integration.test.js
// API tests for the Account module and the own profile, against a REAL PostgreSQL database and
// the real Express app (src/app.js) over HTTP. Nothing in the module is mocked except one thing:
// the Firebase ID-token check (firebaseAuth.js), because a genuine Firebase token can only come
// from a phone completing an SMS check. The stand-in accepts tokens of the form
// "test-verified:+94770000091" and returns that number, exactly as the real check returns the
// number Firebase verified. Everything the stand-in is wrapped by — what the server does with the
// verified number — runs for real.
//
// What this adds over the unit tests: the partial unique indexes, the row locks under concurrent
// requests, single use of codes and links, sessions ended by a password change, the anonymising
// delete, and the profile figures checked against the database itself.
//
// HOW TO RUN (from backend/). It needs its own, disposable database: the suite applies the
// migrations and runs the seed, which EMPTIES every table.
//
//   createdb youthlink_test            (or CREATE DATABASE youthlink_test; in psql)
//   TEST_DATABASE_URL="postgresql://postgres:PASSWORD@localhost:5432/youthlink_test" npm test
//
// (Windows PowerShell: $env:TEST_DATABASE_URL="postgresql://..."; npm test)
// Without TEST_DATABASE_URL the suite is skipped, so `npm test` alone never needs a database.
// The database name must contain "test" and the host must be this machine, or the suite refuses
// to run: it must never be pointed at the development or any shared database.
import { jest } from "@jest/globals";
import { execSync } from "child_process";
import { createHash } from "crypto";

const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL;
const describeWithDb = TEST_DATABASE_URL ? describe : describe.skip;

// The server's whole configuration for this run. Set before the app is imported (config/index.js
// reads it at import time) and handed to the migrate and seed commands, so the seeded NICs are
// encrypted with the same keys the app uses to look them up.
const TEST_ENV = {
  NODE_ENV: "test",
  DATABASE_URL: TEST_DATABASE_URL,
  NIC_ENCRYPTION_KEY: "a1".repeat(32),
  NIC_IV_KEY: "b2".repeat(32),
  JWT_SECRET: "integration-test-jwt-secret",
  FIREBASE_SERVICE_ACCOUNT_PATH: "unused-the-firebase-check-is-stubbed.json",
  PUBLIC_BASE_URL: "http://localhost",
};

const verifyFirebaseIdToken = jest.fn(async (idToken) => {
  const match = /^test-verified:(\+94\d{9})$/.exec(idToken || "");
  if (!match) throw new Error("not a test-verified token");
  return { phoneNumber: match[1], uid: `uid-${match[1]}` };
});
jest.unstable_mockModule("../firebaseAuth.js", () => ({ verifyFirebaseIdToken }));

const PASSWORD = "Password123!"; // every seeded account's password (prisma/seed.js)
const SEEDED = {
  amal: "+94770000001", // worker, verified email, ACTIVE engagement, revealed ratings
  kamal: "+94770000002", // employer posting as Business ("Silva Retailers"), ACTIVE engagement
  sunil: "+94770000003", // verifier
  nimali: "+94770000005", // worker
  dilrukshi: "+94770000006", // individual employer, ENDED engagement, has given a rating
};

jest.setTimeout(120000); // bcrypt runs on every password check, and the setup migrates and seeds

let server;
let baseUrl;
let prisma;
const responseBodies = []; // every response body, scanned at the end for leaked secrets
const consoleLines = []; // the [Mock SMS] / [Mock Email] lines the server prints

/** One HTTP request to the running app. */
async function api(method, path, { body, token } = {}) {
  const res = await fetch(baseUrl + path, {
    method,
    headers: {
      "content-type": "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  responseBodies.push(text);
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = undefined;
  }
  return { status: res.status, body: json, text };
}

const login = (phone, password = PASSWORD) => api("POST", "/api/account/login/password", { body: { phone, password } });
async function tokenFor(phone, password = PASSWORD) {
  const res = await login(phone, password);
  expect(res.status).toBe(200);
  return res.body.token;
}

/** The secret in the most recent [Mock SMS]/[Mock Email] line for `destination`. */
function lastDelivered(kind, destination) {
  const prefix = `[Mock ${kind}] for ${destination}: `;
  const line = [...consoleLines].reverse().find((l) => l.startsWith(prefix));
  if (!line) throw new Error(`nothing was delivered by ${kind} to ${destination}`);
  return line.slice(prefix.length);
}
const tokenInLink = (link) => new URL(link).searchParams.get("token");

let registerCounter = 0;
/** Registers a new account through the API with a fresh number; returns { phone, token, user }. */
async function registerNew(overrides = {}) {
  registerCounter += 1;
  const phone = overrides.phone ?? `+947711${String(registerCounter).padStart(5, "0")}`;
  const nic = overrides.nic ?? `19990${String(registerCounter).padStart(7, "0")}`;
  const res = await api("POST", "/api/account/register", {
    body: {
      role: "YOUTH_JOB_SEEKER",
      idToken: `test-verified:${phone}`,
      password: PASSWORD,
      nic,
      birthdate: "1999-05-20",
      legalName: `Test Person ${registerCounter}`,
      tosAccepted: true,
      ...overrides,
      phone: undefined,
    },
  });
  expect(res.status).toBe(201);
  return { phone, nic, token: res.body.token, user: res.body.user };
}

describeWithDb("Account API against a real database", () => {
  beforeAll(async () => {
    const { hostname, pathname } = new URL(TEST_DATABASE_URL);
    if (!/test/i.test(pathname) || !["localhost", "127.0.0.1", "::1", "[::1]"].includes(hostname)) {
      throw new Error(
        `Refusing to run: TEST_DATABASE_URL must be a database on this machine whose name contains "test" (got ${hostname}${pathname}).`,
      );
    }
    Object.assign(process.env, TEST_ENV);
    const env = { ...process.env, ...TEST_ENV };
    execSync("npx prisma migrate deploy", { env, stdio: "pipe" });
    execSync("node prisma/seed.js", { env, stdio: "pipe" });

    jest.spyOn(console, "log").mockImplementation((...args) => consoleLines.push(args.join(" ")));
    jest.spyOn(console, "error").mockImplementation(() => {});

    const { default: app } = await import("../../../app.js");
    ({ default: prisma } = await import("../../../lib/prisma.js"));
    await new Promise((resolve) => {
      server = app.listen(0, "127.0.0.1", resolve);
    });
    baseUrl = `http://127.0.0.1:${server.address().port}`;
  });

  afterAll(async () => {
    if (server) await new Promise((resolve) => server.close(resolve));
    if (prisma) await prisma.$disconnect();
    jest.restoreAllMocks();
  });

  // ---------------------------------------------------------------------------------------------
  describe("FR-ACC-01 / 03 / 04 / 05 / 08: registration", () => {
    test("creates an ACTIVE account, signs the person in, and stores the NIC only as ciphertext", async () => {
      const res = await api("POST", "/api/account/register", {
        body: {
          role: "YOUTH_JOB_SEEKER",
          idToken: "test-verified:+94770000091",
          password: PASSWORD,
          email: "  New.Person@Example.com ",
          nic: "199812345671",
          birthdate: "1998-02-03",
          legalName: "New Person",
          tosAccepted: true,
        },
      });
      expect(res.status).toBe(201);
      expect(res.body.token).toEqual(expect.any(String));
      expect(res.body.user).toMatchObject({ phone: "+94770000091", nicLast4: "5671", email: "new.person@example.com", emailVerified: false });

      const row = await prisma.user.findUnique({ where: { id: res.body.user.id } });
      expect(row.accountStatus).toBe("ACTIVE");
      expect(row.phoneVerifiedAt).toBeInstanceOf(Date);
      expect(row.tosAcceptedAt).toBeInstanceOf(Date);
      expect(row.nicEncrypted).not.toContain("199812345671");
      expect(row.passwordHash).toMatch(/^\$2[aby]\$12\$/);

      // The new token works straight away.
      expect((await api("GET", "/api/account/me", { token: res.body.token })).status).toBe(200);
    });

    test("FR-ACC-01 AC4: the signup email is confirmed once through its link, and the link is single use", async () => {
      const link = lastDelivered("Email", "new.person@example.com");
      const first = await fetch(`${baseUrl}/api/account/verify-email?token=${tokenInLink(link)}`);
      expect(first.status).toBe(200);
      expect(await first.text()).toContain("Email confirmed");
      const row = await prisma.user.findFirst({ where: { phone: "+94770000091" } });
      expect(row.emailVerifiedAt).toBeInstanceOf(Date);

      const again = await fetch(`${baseUrl}/api/account/verify-email?token=${tokenInLink(link)}`);
      expect(again.status).toBe(400);
      expect(await again.text()).toContain("Link no longer valid");
    });

    test("FR-ACC-05: an already registered phone, NIC or verified email is refused with 409", async () => {
      const base = {
        role: "YOUTH_JOB_SEEKER",
        password: PASSWORD,
        birthdate: "1999-01-01",
        legalName: "Duplicate Attempt",
        tosAccepted: true,
      };
      const phoneTaken = await api("POST", "/api/account/register", {
        body: { ...base, idToken: `test-verified:${SEEDED.amal}`, nic: "199911111111" },
      });
      expect(phoneTaken.status).toBe(409);
      expect(phoneTaken.body.fields).toEqual({ phone: "Already registered" });

      const nicTaken = await api("POST", "/api/account/register", {
        body: { ...base, idToken: "test-verified:+94770000095", nic: "198012345678" }, // Kamal's NIC
      });
      expect(nicTaken.status).toBe(409);
      expect(nicTaken.body.fields).toEqual({ nic: "Already registered" });

      const emailTaken = await api("POST", "/api/account/register", {
        body: { ...base, idToken: "test-verified:+94770000095", nic: "199911111111", email: "AMAL@example.com" },
      });
      expect(emailTaken.status).toBe(409);
      expect(emailTaken.body.fields).toEqual({ email: "Already in use" });
      expect(await prisma.user.count({ where: { phone: "+94770000095" } })).toBe(0);
    });

    test("FR-ACC-05: a NIC typed with a lower-case v is the same NIC", async () => {
      await registerNew({ nic: "199912345V" });
      const res = await api("POST", "/api/account/register", {
        body: {
          role: "YOUTH_JOB_SEEKER",
          idToken: "test-verified:+94770000096",
          password: PASSWORD,
          nic: "199912345v",
          birthdate: "1999-01-01",
          legalName: "Case Variant",
          tosAccepted: true,
        },
      });
      expect(res.status).toBe(409);
      expect(res.body.fields).toEqual({ nic: "Already registered" });
    });

    test("FR-ACC-05: the database itself refuses a duplicate NIC (the partial unique index), even past the service", async () => {
      const amal = await prisma.user.findFirst({ where: { phone: SEEDED.amal } });
      await expect(
        prisma.user.create({
          data: {
            role: "YOUTH_JOB_SEEKER",
            phone: "+94770000097",
            phoneVerifiedAt: new Date(),
            passwordHash: "x",
            nicEncrypted: amal.nicEncrypted,
            nicLast4: amal.nicLast4,
            legalName: "Index Check",
            birthdate: new Date("1999-01-01"),
            tosAcceptedAt: new Date(),
          },
        }),
      ).rejects.toMatchObject({ code: "P2002" });
    });

    test("FR-ACC-03: under 18 is refused and nothing is stored", async () => {
      const birthdate = new Date();
      birthdate.setUTCFullYear(birthdate.getUTCFullYear() - 17);
      const res = await api("POST", "/api/account/register", {
        body: {
          role: "YOUTH_JOB_SEEKER",
          idToken: "test-verified:+94770000098",
          password: PASSWORD,
          nic: "200912345678",
          birthdate: birthdate.toISOString().slice(0, 10),
          legalName: "Too Young",
          tosAccepted: true,
        },
      });
      expect(res.status).toBe(400);
      expect(res.body.fields).toEqual({ birthdate: "Must indicate an age of 18 or older" });
      expect(await prisma.user.count({ where: { phone: "+94770000098" } })).toBe(0);
    });

    test("FR-ACC-08: a phone that did not pass verification cannot register", async () => {
      const res = await api("POST", "/api/account/register", {
        body: {
          role: "YOUTH_JOB_SEEKER",
          idToken: "a-token-firebase-would-reject",
          password: PASSWORD,
          nic: "199922222222",
          birthdate: "1999-01-01",
          legalName: "Unverified",
          tosAccepted: true,
        },
      });
      expect(res.status).toBe(401);
      expect(await prisma.user.count({ where: { legalName: "Unverified" } })).toBe(0);
    });

    test("FR-ACC-05: the availability check reports a taken phone and email", async () => {
      const res = await api("POST", "/api/account/check-availability", {
        body: { phone: "+94 77 000 0001", email: "Amal@Example.com" },
      });
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ phoneTaken: true, emailTaken: true });
    });
  });

  // ---------------------------------------------------------------------------------------------
  describe("FR-ACC-07 / FR-ACC-09 / NFR-SEC-02: login and the password lockout", () => {
    test("the right password signs in; the answer carries no secret", async () => {
      const res = await login(SEEDED.kamal);
      expect(res.status).toBe(200);
      expect(res.body.user).toMatchObject({ phone: SEEDED.kamal, role: "EMPLOYER", nicLast4: "5678" });
      expect(res.text).not.toMatch(/passwordHash|nicEncrypted/);
    });

    test("a wrong password and an unknown number get the same 401 message", async () => {
      const wrong = await login(SEEDED.kamal, "not-the-password");
      const unknown = await login("+94779999999", PASSWORD);
      expect(wrong.status).toBe(401);
      expect(unknown.status).toBe(401);
      expect(wrong.body.error).toBe(unknown.body.error);
    });

    test("5 wrong passwords pause the password path; open sessions and code login keep working", async () => {
      const openSession = await tokenFor(SEEDED.nimali);
      const messages = [];
      for (let i = 0; i < 5; i++) messages.push(await login(SEEDED.nimali, "wrong-password"));
      expect(messages.slice(0, 4).map((r) => r.status)).toEqual([401, 401, 401, 401]);
      expect(messages[2].body.error).toContain("2 attempts left before password login is paused for 15 minutes.");
      expect(messages[4].status).toBe(423);

      const row = await prisma.user.findFirst({ where: { phone: SEEDED.nimali } });
      const minutes = (row.lockedUntil.getTime() - Date.now()) / 60000;
      expect(minutes).toBeGreaterThan(14);
      expect(minutes).toBeLessThanOrEqual(15);

      // The right password is refused while paused.
      expect((await login(SEEDED.nimali)).status).toBe(423);
      // A session opened before the lockout still works (docs/decisions.md).
      expect((await api("GET", "/api/account/me", { token: openSession })).status).toBe(200);
      // Code login works and lifts the pause.
      const otp = await api("POST", "/api/account/login/otp", { body: { idToken: `test-verified:${SEEDED.nimali}` } });
      expect(otp.status).toBe(200);
      const cleared = await prisma.user.findFirst({ where: { phone: SEEDED.nimali } });
      expect(cleared.lockedUntil).toBeNull();
      expect(cleared.failedLoginAttempts).toBe(0);
      expect((await login(SEEDED.nimali)).status).toBe(200);
    });

    test("10 wrong passwords sent at the same moment still end in a lockout", async () => {
      // A behaviour check under concurrent requests. It does NOT by itself prove the row lock:
      // bcrypt spreads the requests out enough that they rarely overlap. The next test does.
      const { phone } = await registerNew();
      const results = await Promise.all(Array.from({ length: 10 }, () => login(phone, "wrong-password")));
      expect(results.filter((r) => r.status === 423).length).toBeGreaterThanOrEqual(1);
      const row = await prisma.user.findFirst({ where: { phone } });
      expect(row.lockedUntil).not.toBeNull();
      expect((await login(phone)).status).toBe(423);
    });

    test("a login decides under a row lock: it waits while another transaction holds the user's row", async () => {
      // The lockout decision must not be made from a row another request is changing
      // (account.service.js, loginWithPassword: SELECT ... FOR UPDATE). Hold that row locked from a
      // second connection; a correct-password login, which writes nothing on a clean account,
      // can only wait if it asks for the same lock itself.
      const { phone, user } = await registerNew();
      let release;
      const released = new Promise((resolve) => {
        release = resolve;
      });
      let holding;
      const locked = new Promise((resolve) => {
        holding = resolve;
      });
      const holder = prisma.$transaction(
        async (tx) => {
          await tx.$queryRaw`SELECT "id" FROM "User" WHERE "id" = ${user.id} FOR UPDATE`;
          holding();
          await released;
        },
        { timeout: 30000 },
      );
      await locked;

      let finished = false;
      const pending = login(phone).then((res) => {
        finished = true;
        return res;
      });
      await new Promise((r) => setTimeout(r, 2000)); // ample time for bcrypt and the query
      expect(finished).toBe(false);

      release();
      await holder;
      expect((await pending).status).toBe(200);
    });

    test("NFR-REL-02: a suspension ends an open session on its next request, and both login paths refuse", async () => {
      const token = await tokenFor(SEEDED.sunil);
      await prisma.user.updateMany({ where: { phone: SEEDED.sunil }, data: { accountStatus: "SUSPENDED", suspendedAt: new Date() } });
      try {
        const me = await api("GET", "/api/account/me", { token });
        expect(me.status).toBe(403);
        expect(me.body.code).toBe("SESSION_ENDED");
        const pw = await login(SEEDED.sunil);
        expect(pw.status).toBe(403);
        expect(pw.body.error).toContain("Logging in with a code will not work either");
        const otp = await api("POST", "/api/account/login/otp", { body: { idToken: `test-verified:${SEEDED.sunil}` } });
        expect(otp.status).toBe(403);
        expect(otp.body.error).toContain("Trying the password instead will not work either");
      } finally {
        await prisma.user.updateMany({ where: { phone: SEEDED.sunil }, data: { accountStatus: "ACTIVE", suspendedAt: null } });
      }
    });
  });

  // ---------------------------------------------------------------------------------------------
  describe("FR-ACC-11: change password from Settings", () => {
    test("a wrong current password is a field error, not a sign-out; success ends every other session", async () => {
      const { phone } = await registerNew();
      const deviceA = await tokenFor(phone);
      const deviceB = await tokenFor(phone);

      const wrong = await api("POST", "/api/account/password/change", {
        token: deviceA,
        body: { currentPassword: "not-it", newPassword: "NewPassword456!" },
      });
      expect(wrong.status).toBe(400);
      expect(wrong.body.code).toBeUndefined();
      expect(wrong.body.fields).toEqual({ currentPassword: "Incorrect password" });

      // Tokens carry whole seconds; wait so the change is in a later second than the logins.
      await new Promise((r) => setTimeout(r, 1100));
      const ok = await api("POST", "/api/account/password/change", {
        token: deviceA,
        body: { currentPassword: PASSWORD, newPassword: "NewPassword456!" },
      });
      expect(ok.status).toBe(200);

      expect((await api("GET", "/api/account/me", { token: ok.body.token })).status).toBe(200); // this device
      for (const old of [deviceA, deviceB]) {
        const res = await api("GET", "/api/account/me", { token: old });
        expect(res.status).toBe(401);
        expect(res.body.code).toBe("SESSION_ENDED");
      }
      expect((await login(phone)).status).toBe(401);
      expect((await login(phone, "NewPassword456!")).status).toBe(200);
    });

    test("6 wrong current passwords in 15 minutes are rate limited, even with the right one", async () => {
      const { token } = await registerNew();
      for (let i = 0; i < 5; i++) {
        await api("POST", "/api/account/password/change", { token, body: { currentPassword: "nope-nope", newPassword: "Another123!" } });
      }
      const sixth = await api("POST", "/api/account/password/change", {
        token,
        body: { currentPassword: PASSWORD, newPassword: "Another123!" },
      });
      expect(sixth.status).toBe(429);
    });
  });

  // ---------------------------------------------------------------------------------------------
  describe("FR-ACC-10: forgotten password by SMS code and by email link", () => {
    test("SMS: code, wrong code refused, right code gives a single-use token, new password ends old sessions", async () => {
      const { phone } = await registerNew();
      const oldSession = await tokenFor(phone);

      const channels = await api("POST", "/api/account/reset-password/channels", { body: { phone } });
      expect(channels.body).toEqual({ phone, email: null, emailVerified: false });

      expect((await api("POST", "/api/account/reset-password/request", { body: { phone, channel: "PHONE" } })).status).toBe(200);
      const code = lastDelivered("SMS", phone);
      expect(code).toMatch(/^\d{6}$/);

      const wrongCode = code === "000000" ? "000001" : "000000";
      expect((await api("POST", "/api/account/reset-password/verify", { body: { phone, code: wrongCode } })).status).toBe(401);
      const verified = await api("POST", "/api/account/reset-password/verify", { body: { phone, code } });
      expect(verified.status).toBe(200);
      // The code is consumed: it cannot be used a second time.
      expect((await api("POST", "/api/account/reset-password/verify", { body: { phone, code } })).status).toBe(401);

      await new Promise((r) => setTimeout(r, 1100));
      const confirm = await api("POST", "/api/account/reset-password/confirm", {
        body: { token: verified.body.token, newPassword: "ResetPassword789!" },
      });
      expect(confirm.status).toBe(200);
      const reuse = await api("POST", "/api/account/reset-password/confirm", {
        body: { token: verified.body.token, newPassword: "SomethingElse1!" },
      });
      expect(reuse.status).toBe(401);

      expect((await api("GET", "/api/account/me", { token: oldSession })).body.code).toBe("SESSION_ENDED");
      expect((await login(phone)).status).toBe(401);
      expect((await login(phone, "ResetPassword789!")).status).toBe(200);
    });

    test("SMS: after 5 wrong codes even the right code is refused (429)", async () => {
      const { phone } = await registerNew();
      await api("POST", "/api/account/reset-password/request", { body: { phone, channel: "PHONE" } });
      const code = lastDelivered("SMS", phone);
      const wrongCode = code === "000000" ? "000001" : "000000";
      for (let i = 0; i < 5; i++) await api("POST", "/api/account/reset-password/verify", { body: { phone, code: wrongCode } });
      expect((await api("POST", "/api/account/reset-password/verify", { body: { phone, code } })).status).toBe(429);
    });

    test("email: a masked address is offered; the link opens a form once and is dead after use", async () => {
      const channels = await api("POST", "/api/account/reset-password/channels", { body: { phone: SEEDED.amal } });
      expect(channels.body).toEqual({ phone: SEEDED.amal, email: "a***@example.com", emailVerified: true });

      await api("POST", "/api/account/reset-password/request", { body: { phone: SEEDED.amal, channel: "EMAIL" } });
      const token = tokenInLink(lastDelivered("Email", "amal@example.com"));
      // Stored only as a hash: the raw token in the link is not in the database.
      expect(await prisma.emailVerificationToken.count({ where: { token } })).toBe(0);
      expect(await prisma.emailVerificationToken.count({ where: { token: createHash("sha256").update(token).digest("hex") } })).toBe(1);

      const page = await (await fetch(`${baseUrl}/api/account/reset-password/page?token=${token}`)).text();
      expect(page).toContain("Set new password");

      const confirm = await api("POST", "/api/account/reset-password/confirm", { body: { token, newPassword: "AmalNew123!" } });
      expect(confirm.status).toBe(200);
      const spent = await (await fetch(`${baseUrl}/api/account/reset-password/page?token=${token}`)).text();
      expect(spent).toContain("Link no longer valid");
      expect(spent).not.toContain("Set new password");
      expect((await login(SEEDED.amal, "AmalNew123!")).status).toBe(200);
    });
  });

  // ---------------------------------------------------------------------------------------------
  describe("FR-ACC-10 E8: account recovery reviewed by an Admin", () => {
    async function requestRecovery(fields) {
      const res = await api("POST", "/api/account/recovery/request", { body: fields });
      expect(res.status).toBe(200);
      expect(res.body.deviceId).toMatch(/^[0-9a-f]{64}$/);
      return res.body.deviceId;
    }

    test("pending, then approved; only the requesting device can set the new password, once", async () => {
      const deviceId = await requestRecovery({ nic: "197012345678", birthdate: "1970-01-01", legalName: "sunil teacher" });
      expect((await api("GET", `/api/account/recovery/status?deviceId=${deviceId}`)).body).toEqual({ status: "pending" });
      expect((await api("POST", "/api/account/recovery/confirm", { body: { deviceId, newPassword: "Recovered123!" } })).status).toBe(401);

      // What node prisma/review-recovery.js approve does.
      await prisma.accountRecoveryRequest.updateMany({ where: { deviceId }, data: { status: "APPROVED", reviewedAt: new Date() } });
      expect((await api("GET", `/api/account/recovery/status?deviceId=${deviceId}`)).body).toEqual({ status: "approved" });

      const otherDevice = "f".repeat(64);
      expect((await api("GET", `/api/account/recovery/status?deviceId=${otherDevice}`)).status).toBe(404);
      expect((await api("POST", "/api/account/recovery/confirm", { body: { deviceId: otherDevice, newPassword: "Recovered123!" } })).status).toBe(401);

      expect((await api("POST", "/api/account/recovery/confirm", { body: { deviceId, newPassword: "Recovered123!" } })).status).toBe(200);
      expect((await api("GET", `/api/account/recovery/status?deviceId=${deviceId}`)).body).toEqual({ status: "used" });
      expect((await api("POST", "/api/account/recovery/confirm", { body: { deviceId, newPassword: "Again12345!" } })).status).toBe(401);
      expect((await login(SEEDED.sunil, "Recovered123!")).status).toBe(200);
    });

    test("a rejected request shows as rejected; details that match nobody look the same from outside", async () => {
      const deviceId = await requestRecovery({ nic: "123456789V", birthdate: "1995-05-05", legalName: "Nobody At All" });
      const row = await prisma.accountRecoveryRequest.findFirst({ where: { deviceId } });
      expect(row.userId).toBeNull();
      await prisma.accountRecoveryRequest.updateMany({ where: { deviceId }, data: { status: "REJECTED", reviewedAt: new Date() } });
      expect((await api("GET", `/api/account/recovery/status?deviceId=${deviceId}`)).body).toEqual({ status: "rejected" });
    });

    test("a guessable device id is refused", async () => {
      expect((await api("GET", "/api/account/recovery/status?deviceId=dummy-device-id")).status).toBe(400);
    });
  });

  // ---------------------------------------------------------------------------------------------
  describe("FR-ACC-12 to FR-ACC-16: the Settings screens", () => {
    test("FR-ACC-15: display name up to 100 characters, shown on the profile at once", async () => {
      const { token } = await registerNew();
      const tooLong = await api("PATCH", "/api/account/display-name", { token, body: { legalName: "x".repeat(101) } });
      expect(tooLong.status).toBe(400);
      expect(tooLong.body.error).toBe("Display name must be 100 characters or fewer.");
      const ok = await api("PATCH", "/api/account/display-name", { token, body: { legalName: "  Renamed Person  " } });
      expect(ok.body).toEqual({ legalName: "Renamed Person" });
      expect((await api("GET", "/api/profiles/me", { token })).body.displayName).toBe("Renamed Person");
    });

    test("FR-ACC-13: NIC correction needs the password, refuses another person's NIC, accepts a new one", async () => {
      const { token } = await registerNew();
      const wrongPassword = await api("PUT", "/api/account/nic", { token, body: { password: "nope", nic: "199933333333" } });
      expect(wrongPassword.status).toBe(400);
      expect(wrongPassword.body.fields).toEqual({ password: "Incorrect password" });
      const someoneElses = await api("PUT", "/api/account/nic", { token, body: { password: PASSWORD, nic: "198012345678" } });
      expect(someoneElses.status).toBe(409);
      const ok = await api("PUT", "/api/account/nic", { token, body: { password: PASSWORD, nic: "199933333333" } });
      expect(ok.body).toEqual({ nicLast4: "3333" });
      expect((await api("GET", "/api/account/me", { token })).body.nicLast4).toBe("3333");
    });

    test("FR-ACC-14: an email change waits for its link; the old address stays until then; cancel kills the link", async () => {
      const { token, phone } = await registerNew({ email: "first@example.com" });
      await fetch(`${baseUrl}/api/account/verify-email?token=${tokenInLink(lastDelivered("Email", "first@example.com"))}`);

      const pending = await api("POST", "/api/account/email/change", { token, body: { email: "Second@Example.com" } });
      expect(pending.body).toEqual({ pendingEmail: "second@example.com" });
      const me = (await api("GET", "/api/account/me", { token })).body;
      expect(me).toMatchObject({ email: "first@example.com", emailVerified: true, pendingEmail: "second@example.com" });

      const link = lastDelivered("Email", "second@example.com");
      expect((await fetch(`${baseUrl}/api/account/verify-email?token=${tokenInLink(link)}`)).status).toBe(200);
      expect((await api("GET", "/api/account/me", { token })).body).toMatchObject({ email: "second@example.com", emailVerified: true, pendingEmail: null });

      // A third change, cancelled: its link no longer works.
      await api("POST", "/api/account/email/change", { token, body: { email: "third@example.com" } });
      const cancelledLink = lastDelivered("Email", "third@example.com");
      await api("POST", "/api/account/email/cancel", { token });
      expect((await fetch(`${baseUrl}/api/account/verify-email?token=${tokenInLink(cancelledLink)}`)).status).toBe(400);
      expect((await prisma.user.findFirst({ where: { phone } })).email).toBe("second@example.com");

      // An address already confirmed on another account is refused.
      const taken = await api("POST", "/api/account/email/change", { token, body: { email: "amal@example.com" } });
      expect(taken.status).toBe(409);
    });

    test("FR-ACC-02 / FR-ACC-16: posting as Business needs a name; back to Individual clears it; workers cannot", async () => {
      const kamal = await tokenFor(SEEDED.kamal);
      const noName = await api("PATCH", "/api/account/posting-as", { token: kamal, body: { postingAsType: "BUSINESS", businessName: "  " } });
      expect(noName.status).toBe(400);
      const longBio = await api("PATCH", "/api/account/posting-as", {
        token: kamal,
        body: { postingAsType: "BUSINESS", businessName: "Silva Retailers", businessBio: "b".repeat(301) },
      });
      expect(longBio.status).toBe(400);
      const individual = await api("PATCH", "/api/account/posting-as", { token: kamal, body: { postingAsType: "INDIVIDUAL" } });
      expect(individual.body).toEqual({ postingAsType: "INDIVIDUAL", businessName: null, businessBio: null });
      expect((await api("GET", "/api/profiles/me", { token: kamal })).body.displayName).toBe("Kamal Silva");
      const business = await api("PATCH", "/api/account/posting-as", {
        token: kamal,
        body: { postingAsType: "BUSINESS", businessName: "Silva Retailers", businessBio: "Family shop since 1998." },
      });
      expect(business.body.businessName).toBe("Silva Retailers");
      expect((await api("GET", "/api/profiles/me", { token: kamal })).body.displayName).toBe("Silva Retailers");

      const worker = (await registerNew()).token;
      expect((await api("PATCH", "/api/account/posting-as", { token: worker, body: { postingAsType: "INDIVIDUAL" } })).status).toBe(403);
    });

    test("FR-ACC-12: phone change needs the password and a verified new number; the old number stops working", async () => {
      const { token, phone } = await registerNew();
      const wrongPassword = await api("POST", "/api/account/phone/change", {
        token,
        body: { password: "nope", idToken: "test-verified:+94770000081" },
      });
      expect(wrongPassword.status).toBe(400);
      expect(wrongPassword.body.fields).toEqual({ password: "Incorrect password" });
      const taken = await api("POST", "/api/account/phone/change", {
        token,
        body: { password: PASSWORD, idToken: `test-verified:${SEEDED.kamal}` },
      });
      expect(taken.status).toBe(409);
      const ok = await api("POST", "/api/account/phone/change", {
        token,
        body: { password: PASSWORD, idToken: "test-verified:+94770000081" },
      });
      expect(ok.body).toEqual({ success: true, phone: "+94770000081" });
      expect((await login(phone)).status).toBe(401);
      expect((await login("+94770000081")).status).toBe(200);
    });
  });

  // ---------------------------------------------------------------------------------------------
  describe("FR-PROF-01 / 02 / 06: the own profile, checked against the database", () => {
    test("worker: rating average over revealed, unremoved ratings and the weighted completion rate", async () => {
      const amalRow = await prisma.user.findFirst({ where: { phone: SEEDED.amal } });
      const token = await tokenFor(SEEDED.amal, "AmalNew123!"); // reset earlier in this run
      const profile = (await api("GET", "/api/profiles/me", { token })).body;

      // Computed here straight from the tables, independently of profile.service.js.
      const [{ avg, count }] = await prisma.$queryRaw`
        SELECT AVG("score")::float AS avg, COUNT(*)::int AS count FROM "Rating"
        WHERE "rateeId" = ${amalRow.id} AND "revealedAt" IS NOT NULL AND "removedAt" IS NULL`;
      const [{ credited, total }] = await prisma.$queryRaw`
        SELECT COALESCE(SUM("weight") FILTER (WHERE "outcome" IN ('COMPLETED', 'NO_SHOW_RELIABLE_CREDIT')), 0)::float AS credited,
               COALESCE(SUM("weight"), 0)::float AS total
        FROM "CompletionRecord" WHERE "userId" = ${amalRow.id}`;

      expect(count).toBeGreaterThan(0); // the seed gives Amal a revealed rating
      expect(profile.trust.ratingCount).toBe(count);
      expect(profile.trust.ratingAverage).toBe(Math.round(avg * 10) / 10);
      expect(profile.trust.completionRate).toBe(total > 0 ? Math.round((credited / total) * 100) : null);
      expect(profile.phoneVerified).toBe(true);
      expect(JSON.stringify(profile)).not.toMatch(/nic/i);
    });

    test("employer: completed engagements count COMPLETED and ENDED; verifier: endorsements given", async () => {
      const dilrukshi = await prisma.user.findFirst({ where: { phone: SEEDED.dilrukshi } });
      const expected = await prisma.engagement.count({ where: { employerId: dilrukshi.id, status: { in: ["COMPLETED", "ENDED"] } } });
      const profile = (await api("GET", "/api/profiles/me", { token: await tokenFor(SEEDED.dilrukshi) })).body;
      expect(profile.employer.completedEngagements).toBe(expected);

      const sunil = await prisma.user.findFirst({ where: { phone: SEEDED.sunil } });
      const endorsed = await prisma.endorsement.count({ where: { endorserId: sunil.id, revokedAt: null } });
      const verifier = (await api("GET", "/api/profiles/me", { token: await tokenFor(SEEDED.sunil, "Recovered123!") })).body;
      expect(verifier.verifier.endorsedCount).toBe(endorsed);
    });
  });

  // ---------------------------------------------------------------------------------------------
  describe("FR-ACC-17 / NFR-PRIV-03: account deletion", () => {
    test("blocked while an engagement is active, naming it", async () => {
      const token = await tokenFor(SEEDED.kamal);
      const status = await api("GET", "/api/account/deletion", { token });
      expect(status.body.blocked).toBe(true);
      expect(status.body.engagement.title).toEqual(expect.any(String));
      const attempt = await api("POST", "/api/account/delete", { token, body: { password: PASSWORD } });
      expect(attempt.status).toBe(409);
      expect((await prisma.user.findFirst({ where: { phone: SEEDED.kamal } })).deletedAt).toBeNull();
    });

    test("anonymises the person, keeps their engagements and ratings, ends the session, frees the number", async () => {
      const before = await prisma.user.findFirst({ where: { phone: SEEDED.dilrukshi } });
      const ratingsBefore = await prisma.rating.count({ where: { OR: [{ raterId: before.id }, { rateeId: before.id }] } });
      const engagementsBefore = await prisma.engagement.count({ where: { OR: [{ workerId: before.id }, { employerId: before.id }] } });
      expect(engagementsBefore).toBeGreaterThan(0);
      const token = await tokenFor(SEEDED.dilrukshi);

      expect((await api("GET", "/api/account/deletion", { token })).body).toEqual({ blocked: false, engagement: null });
      const wrong = await api("POST", "/api/account/delete", { token, body: { password: "nope" } });
      expect(wrong.status).toBe(400);
      expect(wrong.body.fields).toEqual({ password: "Incorrect password" });
      expect((await api("POST", "/api/account/delete", { token, body: { password: PASSWORD } })).status).toBe(200);

      const after = await prisma.user.findUnique({ where: { id: before.id } });
      expect(after).toMatchObject({
        accountStatus: "DELETED",
        phone: `deleted-${before.id}`,
        email: null,
        nicEncrypted: `deleted:${before.id}`,
        legalName: "Deleted user",
        businessName: null,
      });
      expect(after.birthdate.toISOString().slice(0, 10)).toBe("1900-01-01");
      expect(after.deletedAt).toBeInstanceOf(Date);
      expect(after.passwordHash).not.toBe(before.passwordHash);

      expect(await prisma.rating.count({ where: { OR: [{ raterId: before.id }, { rateeId: before.id }] } })).toBe(ratingsBefore);
      expect(await prisma.engagement.count({ where: { OR: [{ workerId: before.id }, { employerId: before.id }] } })).toBe(engagementsBefore);

      const me = await api("GET", "/api/account/me", { token });
      expect(me.status).toBe(401);
      expect(me.body.code).toBe("SESSION_ENDED");
      expect((await login(SEEDED.dilrukshi)).status).toBe(401);

      // The number and the NIC can register again.
      const again = await api("POST", "/api/account/register", {
        body: {
          role: "EMPLOYER",
          idToken: `test-verified:${SEEDED.dilrukshi}`,
          password: PASSWORD,
          nic: "199012345678",
          birthdate: "1990-03-20",
          legalName: "Dilrukshi Herath",
          tosAccepted: true,
        },
      });
      expect(again.status).toBe(201);
    });
  });

  // ---------------------------------------------------------------------------------------------
  describe("Security smoke checks", () => {
    test("every signed-in route answers 401 without a token", async () => {
      const routes = [
        ["POST", "/api/account/phone/change"],
        ["POST", "/api/account/password/change"],
        ["GET", "/api/account/me"],
        ["POST", "/api/account/email/change"],
        ["POST", "/api/account/email/cancel"],
        ["GET", "/api/account/deletion"],
        ["POST", "/api/account/delete"],
        ["PATCH", "/api/account/posting-as"],
        ["PUT", "/api/account/nic"],
        ["PATCH", "/api/account/display-name"],
        ["GET", "/api/profiles/me"],
      ];
      for (const [method, path] of routes) {
        const res = await api(method, path, { body: method === "GET" ? undefined : {} });
        expect([method, path, res.status]).toEqual([method, path, 401]);
      }
    });

    test("the availability check is limited to 30 a minute per caller (E2E-16)", async () => {
      // Earlier tests in this run used one; count up from wherever that leaves the limit.
      const statuses = [];
      for (let i = 0; i < 31; i++) {
        statuses.push((await api("POST", "/api/account/check-availability", { body: { phone: "+94770000001" } })).status);
      }
      expect(statuses.filter((s) => s === 200).length).toBe(29);
      expect(statuses.slice(-2)).toEqual([429, 429]);
    });

    test("no response in this whole run contained a password hash or an encrypted NIC", () => {
      expect(responseBodies.length).toBeGreaterThan(100);
      for (const body of responseBodies) {
        expect(body).not.toMatch(/passwordHash|nicEncrypted|\$2[aby]\$12\$/);
      }
    });
  });
});
