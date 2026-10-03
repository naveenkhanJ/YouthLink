// account.session.test.js
// FR-ACC-07 (stateless JWT session), NFR-REL-02 (a suspension takes effect on the very next
// request) and the FR-ACC-10 / FR-ACC-11 amendments (a password reset or change ends every
// session issued before it) — jwt.js, accountStatus.js and the shared requireAuth middleware.
// The database is replaced by a mock; requireAuth's single user lookup is what each test sets.
import { jest } from "@jest/globals";
import jwt from "jsonwebtoken";
import testConfig from "./testConfig.js";

const prismaMock = { user: { findUnique: jest.fn() } };
jest.unstable_mockModule("../../../config/index.js", () => ({ default: testConfig }));
jest.unstable_mockModule("../../../lib/prisma.js", () => ({ default: prismaMock }));

const { signToken, verifyToken } = await import("../../../lib/jwt.js");
const { isSuspended } = await import("../../../lib/accountStatus.js");
const { default: requireAuth } = await import("../../../middleware/requireAuth.js");

const ACTIVE_USER = {
  id: "user-1",
  role: "YOUTH_JOB_SEEKER",
  accountStatus: "ACTIVE",
  suspendedAt: null,
  deletedAt: null,
  passwordChangedAt: null,
};

/** Runs requireAuth on a request with the given Authorization header; returns what it passed on. */
async function runRequireAuth(authorization) {
  const req = { headers: authorization === undefined ? {} : { authorization } };
  const next = jest.fn();
  await requireAuth(req, {}, next);
  expect(next).toHaveBeenCalledTimes(1);
  return { error: next.mock.calls[0][0], user: req.user };
}

beforeEach(() => jest.resetAllMocks());

describe("FR-ACC-07: tokens", () => {
  test("a signed token carries the user id and lasts 30 days", () => {
    const payload = verifyToken(signToken({ sub: "user-1" }));
    expect(payload.sub).toBe("user-1");
    expect(payload.exp - payload.iat).toBe(30 * 24 * 60 * 60);
  });

  test("a token signed with another secret, or altered, is refused", () => {
    const foreign = jwt.sign({ sub: "user-1" }, "some-other-secret");
    expect(() => verifyToken(foreign)).toThrow();
    const token = signToken({ sub: "user-1" });
    const [header, , signature] = token.split(".");
    const forgedBody = Buffer.from(JSON.stringify({ sub: "user-2", iat: 1 })).toString("base64url");
    expect(() => verifyToken(`${header}.${forgedBody}.${signature}`)).toThrow();
  });

  test("an expired token is refused", () => {
    const expired = jwt.sign({ sub: "user-1", exp: Math.floor(Date.now() / 1000) - 10 }, testConfig.jwtSecret);
    expect(() => verifyToken(expired)).toThrow();
  });
});

describe("NFR-REL-02: what counts as suspended", () => {
  test("either the status or a suspension timestamp is enough", () => {
    expect(isSuspended({ accountStatus: "ACTIVE", suspendedAt: null })).toBe(false);
    expect(isSuspended({ accountStatus: "SUSPENDED", suspendedAt: null })).toBe(true);
    expect(isSuspended({ accountStatus: "ACTIVE", suspendedAt: new Date() })).toBe(true);
  });
});

describe("requireAuth: the one authentication check for every protected route", () => {
  test("no header, or a header that is not a Bearer token, is 401 without SESSION_ENDED", async () => {
    for (const header of [undefined, "", "Basic abc", "Bearer"]) {
      const { error } = await runRequireAuth(header);
      expect(error.status).toBe(401);
      expect(error.code).toBeUndefined();
    }
    expect(prismaMock.user.findUnique).not.toHaveBeenCalled();
  });

  test("an invalid token ends the session (401 SESSION_ENDED)", async () => {
    const { error } = await runRequireAuth("Bearer not-a-token");
    expect(error.status).toBe(401);
    expect(error.code).toBe("SESSION_ENDED");
  });

  test("a valid token for an active account passes and sets req.user", async () => {
    prismaMock.user.findUnique.mockResolvedValue(ACTIVE_USER);
    const { error, user } = await runRequireAuth(`Bearer ${signToken({ sub: "user-1" })}`);
    expect(error).toBeUndefined();
    expect(user).toEqual(ACTIVE_USER);
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { id: "user-1" } }));
  });

  test("a deleted or missing account ends the session", async () => {
    const token = `Bearer ${signToken({ sub: "user-1" })}`;
    for (const row of [null, { ...ACTIVE_USER, deletedAt: new Date() }, { ...ACTIVE_USER, accountStatus: "DELETED" }]) {
      prismaMock.user.findUnique.mockResolvedValue(row);
      const { error } = await runRequireAuth(token);
      expect(error.status).toBe(401);
      expect(error.code).toBe("SESSION_ENDED");
    }
  });

  test("NFR-REL-02: a suspension is refused on the next request, with 403 SESSION_ENDED", async () => {
    prismaMock.user.findUnique.mockResolvedValue({ ...ACTIVE_USER, accountStatus: "SUSPENDED", suspendedAt: new Date() });
    const { error } = await runRequireAuth(`Bearer ${signToken({ sub: "user-1" })}`);
    expect(error.status).toBe(403);
    expect(error.code).toBe("SESSION_ENDED");
  });

  test("a token issued before the last password change is refused; one issued after it is not", async () => {
    const changedAt = new Date("2026-10-04T06:00:00.000Z");
    const changedSeconds = changedAt.getTime() / 1000;
    prismaMock.user.findUnique.mockResolvedValue({ ...ACTIVE_USER, passwordChangedAt: changedAt });

    const before = jwt.sign({ sub: "user-1", iat: changedSeconds - 1 }, testConfig.jwtSecret, { expiresIn: "30d" });
    expect((await runRequireAuth(`Bearer ${before}`)).error.code).toBe("SESSION_ENDED");

    // Issued in the same second as the change (the login right after a reset): still valid.
    const sameSecond = jwt.sign({ sub: "user-1", iat: changedSeconds }, testConfig.jwtSecret, { expiresIn: "30d" });
    expect((await runRequireAuth(`Bearer ${sameSecond}`)).error).toBeUndefined();
  });

  test("a password lockout does NOT end existing sessions (lockedUntil is not checked here)", async () => {
    // docs/decisions.md: the lockout applies to the password-login endpoint only. The middleware
    // does not even select lockedUntil, so a locked account's open sessions keep working.
    prismaMock.user.findUnique.mockResolvedValue({ ...ACTIVE_USER, lockedUntil: new Date(Date.now() + 60_000) });
    const { error } = await runRequireAuth(`Bearer ${signToken({ sub: "user-1" })}`);
    expect(error).toBeUndefined();
    expect(prismaMock.user.findUnique.mock.calls[0][0].select).not.toHaveProperty("lockedUntil");
  });
});
