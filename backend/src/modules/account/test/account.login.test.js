// account.login.test.js
// FR-ACC-07 (password and code login, same generic message for a wrong password and an unknown
// number), FR-ACC-09 / NFR-SEC-02 (5 consecutive wrong passwords pause the password path for
// 15 minutes; the remaining-attempts warning only when 2 or fewer are left) and the suspension
// messages of prototype 1.6sus / 1.7sus — account.service.js's loginWithPassword() and
// loginWithOtp(), with the database and Firebase replaced by mocks.
//
// The row lock (SELECT ... FOR UPDATE) that makes these decisions safe under concurrent requests
// cannot be shown with a mock; the API tests against a real PostgreSQL cover the lockout end to end.
import { jest } from "@jest/globals";
import testConfig from "./testConfig.js";

// The locked row as the transaction reads it; each test sets what it needs.
let lockedRow;
const tx = { $queryRaw: jest.fn(), user: { update: jest.fn() } };
const prismaMock = {
  user: { findFirst: jest.fn(), update: jest.fn() },
  $transaction: jest.fn(),
};
const verifyFirebaseIdToken = jest.fn();

jest.unstable_mockModule("../../../config/index.js", () => ({ default: testConfig }));
jest.unstable_mockModule("../../../lib/prisma.js", () => ({ default: prismaMock }));
jest.unstable_mockModule("../firebaseAuth.js", () => ({ verifyFirebaseIdToken }));

const { default: service } = await import("../account.service.js");
const { hashPassword } = await import("../passwordHash.js");

jest.setTimeout(30000); // every password login runs bcrypt, even for an unknown number

const PASSWORD = "Password123!";
const GENERIC =
  "We couldn't log you in with those details. Check your number and password, or reset your password.";
const LOCKED =
  "Too many attempts — password login is paused for 15 minutes. You can log in with a code instead.";

let passwordHash;
let user;

beforeAll(async () => {
  passwordHash = await hashPassword(PASSWORD);
});

beforeEach(() => {
  jest.resetAllMocks();
  user = {
    id: "user-1",
    phone: "+94770000001",
    passwordHash,
    accountStatus: "ACTIVE",
    suspendedAt: null,
  };
  lockedRow = { failedLoginAttempts: 0, lockedUntil: null };
  prismaMock.user.findFirst.mockImplementation(async () => user);
  prismaMock.$transaction.mockImplementation(async (fn) => fn(tx));
  tx.$queryRaw.mockImplementation(async () => [lockedRow]);
  // Apply each write to the row, so consecutive attempts see the previous attempt's result.
  tx.user.update.mockImplementation(async ({ data }) => Object.assign(lockedRow, data));
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => jest.restoreAllMocks());

/** One password login attempt; returns the AppError or the success result. */
async function attempt(password) {
  try {
    return await service.loginWithPassword({ phone: "+94770000001", password });
  } catch (err) {
    return err;
  }
}

describe("FR-ACC-07: password login", () => {
  test("the right password signs in and returns a token", async () => {
    const result = await attempt(PASSWORD);
    expect(result.token).toEqual(expect.any(String));
    expect(result.user.id).toBe("user-1");
  });

  test("a phone typed with spaces or dashes still finds the account", async () => {
    await service.loginWithPassword({ phone: "+94 77-000 0001", password: PASSWORD });
    expect(prismaMock.user.findFirst.mock.calls[0][0].where.phone).toBe("+94770000001");
  });

  test("an unknown number and a wrong password get the same message (no enumeration)", async () => {
    const wrong = await attempt("wrong-password");
    user = null;
    const unknown = await attempt(PASSWORD);
    expect(wrong.status).toBe(401);
    expect(unknown.status).toBe(401);
    expect(wrong.message).toBe(GENERIC);
    expect(unknown.message).toBe(GENERIC);
  });

  test("a missing phone or password is a 400 naming the field", async () => {
    await expect(service.loginWithPassword({ password: PASSWORD })).rejects.toMatchObject({
      status: 400,
      fields: { phone: "Required" },
    });
    await expect(service.loginWithPassword({ phone: "+94770000001" })).rejects.toMatchObject({
      status: 400,
      fields: { password: "Required" },
    });
  });
});

describe("FR-ACC-09 / NFR-SEC-02: the 5-attempt lockout", () => {
  test("attempts 1-2 show the plain message, 3-4 the remaining count, the 5th pauses the path", async () => {
    const messages = [];
    for (let i = 1; i <= 5; i++) messages.push((await attempt("wrong-password")).message);
    expect(messages[0]).toBe(GENERIC);
    expect(messages[1]).toBe(GENERIC);
    expect(messages[2]).toBe(
      "We couldn't log you in with those details. 2 attempts left before password login is paused for 15 minutes.",
    );
    expect(messages[3]).toBe(
      "We couldn't log you in with those details. 1 attempt left before password login is paused for 15 minutes.",
    );
    expect(messages[4]).toBe(LOCKED);
  });

  test("the pause lasts 15 minutes and answers 423", async () => {
    const before = Date.now();
    for (let i = 0; i < 4; i++) await attempt("wrong-password");
    const fifth = await attempt("wrong-password");
    expect(fifth.status).toBe(423);
    const lockMs = lockedRow.lockedUntil.getTime() - before;
    expect(lockMs).toBeGreaterThanOrEqual(15 * 60 * 1000);
    expect(lockMs).toBeLessThan(15 * 60 * 1000 + 5000);
  });

  test("while paused, even the right password is refused", async () => {
    lockedRow = { failedLoginAttempts: 0, lockedUntil: new Date(Date.now() + 10 * 60 * 1000) };
    const result = await attempt(PASSWORD);
    expect(result.status).toBe(423);
    expect(result.message).toBe(LOCKED);
  });

  test("after the pause ends, a wrong password starts a fresh count instead of re-locking", async () => {
    lockedRow = { failedLoginAttempts: 4, lockedUntil: new Date(Date.now() - 1000) };
    const result = await attempt("wrong-password");
    expect(result.status).toBe(401);
    expect(lockedRow.failedLoginAttempts).toBe(1);
  });

  test("a right password before the 5th clears the count", async () => {
    for (let i = 0; i < 3; i++) await attempt("wrong-password");
    expect(lockedRow.failedLoginAttempts).toBe(3);
    await attempt(PASSWORD);
    expect(lockedRow).toEqual({ failedLoginAttempts: 0, lockedUntil: null });
  });

  test("the attempt is decided inside a transaction that locks the row (FOR UPDATE)", async () => {
    await attempt("wrong-password");
    const sql = tx.$queryRaw.mock.calls[0][0].join("?");
    expect(sql).toMatch(/FOR UPDATE/);
  });
});

describe("Suspended accounts (prototype 1.6sus / 1.7sus)", () => {
  test("password path: revealed only after the right password, naming the code path", async () => {
    user.accountStatus = "SUSPENDED";
    const wrong = await attempt("wrong-password");
    expect(wrong.message).toBe(GENERIC); // a wrong password learns nothing about the account
    const right = await attempt(PASSWORD);
    expect(right.status).toBe(403);
    expect(right.message).toMatch(/^This account has been suspended\./);
    expect(right.message).toContain("Logging in with a code will not work either");
  });

  test("code path: refused, naming the password path", async () => {
    user.suspendedAt = new Date();
    verifyFirebaseIdToken.mockResolvedValue({ phoneNumber: "+94770000001", uid: "u" });
    await expect(service.loginWithOtp({ idToken: "t" })).rejects.toMatchObject({
      status: 403,
      message: expect.stringContaining("Trying the password instead will not work either"),
    });
  });
});

describe("FR-ACC-07 / FR-ACC-08: code login through Firebase", () => {
  test("works during a password lockout and lifts it", async () => {
    lockedRow = { failedLoginAttempts: 0, lockedUntil: new Date(Date.now() + 10 * 60 * 1000) };
    verifyFirebaseIdToken.mockResolvedValue({ phoneNumber: "+94770000001", uid: "u" });
    const result = await service.loginWithOtp({ idToken: "t" });
    expect(result.token).toEqual(expect.any(String));
    expect(lockedRow).toEqual({ failedLoginAttempts: 0, lockedUntil: null });
  });

  test("a token Firebase rejects is a 401", async () => {
    verifyFirebaseIdToken.mockRejectedValue(new Error("bad"));
    await expect(service.loginWithOtp({ idToken: "t" })).rejects.toMatchObject({ status: 401 });
  });

  test("a verified number with no account is a 401", async () => {
    user = null;
    verifyFirebaseIdToken.mockResolvedValue({ phoneNumber: "+94770000099", uid: "u" });
    await expect(service.loginWithOtp({ idToken: "t" })).rejects.toMatchObject({
      status: 401,
      message: "No account found for this phone number.",
    });
  });
});
