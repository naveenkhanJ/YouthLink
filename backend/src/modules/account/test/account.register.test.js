// account.register.test.js
// FR-ACC-01 (registration as one atomic submission), FR-ACC-03 (18 and over, from the birthdate
// only), FR-ACC-04 (NIC shape, stored encrypted), FR-ACC-05 (one account per phone, NIC and email)
// and FR-ACC-08 (the phone counts as verified only after the server checks the Firebase token) —
// account.service.js's register(), with the database and Firebase replaced by mocks.
//
// What these tests cannot show is that the real database refuses a duplicate: that is the partial
// unique indexes' job and is covered by the API tests against a real PostgreSQL.
import { jest } from "@jest/globals";
import testConfig from "./testConfig.js";

const prismaMock = {
  user: { findFirst: jest.fn(), create: jest.fn() },
  emailVerificationToken: { create: jest.fn() },
};
const verifyFirebaseIdToken = jest.fn();

jest.unstable_mockModule("../../../config/index.js", () => ({ default: testConfig }));
jest.unstable_mockModule("../../../lib/prisma.js", () => ({ default: prismaMock }));
jest.unstable_mockModule("../firebaseAuth.js", () => ({ verifyFirebaseIdToken }));

const { default: service } = await import("../account.service.js");
const { encryptNic } = await import("../nicCrypto.js");
const { verifyToken } = await import("../../../lib/jwt.js");

jest.setTimeout(20000); // registration hashes the password with bcrypt

/** A birthdate exactly `years` years ago today, give or take `days`. */
function birthdateYearsAgo(years, days = 0) {
  const d = new Date();
  d.setUTCFullYear(d.getUTCFullYear() - years);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

const VALID = {
  role: "YOUTH_JOB_SEEKER",
  idToken: "firebase-id-token",
  password: "Password123!",
  email: "  Amal.Perera@Example.com ",
  nic: "200012345678",
  birthdate: "2000-01-15",
  legalName: "  Amal Perera  ",
  tosAccepted: true,
};

/** Calls register() and returns the AppError it threw. */
async function registerError(input) {
  try {
    await service.register(input);
  } catch (err) {
    return err;
  }
  throw new Error("register() was expected to fail but succeeded");
}

beforeEach(() => {
  jest.resetAllMocks();
  verifyFirebaseIdToken.mockResolvedValue({ phoneNumber: "+94770000091", uid: "firebase-uid" });
  prismaMock.user.findFirst.mockResolvedValue(null);
  prismaMock.user.create.mockImplementation(async ({ data }) => ({ id: "new-user", ...data }));
  prismaMock.emailVerificationToken.create.mockResolvedValue({});
  jest.spyOn(console, "log").mockImplementation(() => {}); // the [Mock Email] line
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => jest.restoreAllMocks());

describe("FR-ACC-01: field checks before anything else runs", () => {
  test("a missing or malformed field is a 400 naming each field", async () => {
    const err = await registerError({ role: "ADMIN", tosAccepted: "yes" });
    expect(err.status).toBe(400);
    expect(Object.keys(err.fields).sort()).toEqual(
      ["birthdate", "idToken", "legalName", "nic", "password", "role", "tosAccepted"].sort(),
    );
    expect(verifyFirebaseIdToken).not.toHaveBeenCalled();
    expect(prismaMock.user.create).not.toHaveBeenCalled();
  });

  test("password length: 7 and 65 characters are refused, 8 and 64 accepted", async () => {
    expect((await registerError({ ...VALID, password: "a".repeat(7) })).fields.password).toBeDefined();
    expect((await registerError({ ...VALID, password: "a".repeat(65) })).fields.password).toBeDefined();
    await expect(service.register({ ...VALID, password: "a".repeat(8) })).resolves.toBeDefined();
    await expect(service.register({ ...VALID, password: "a b ".repeat(16) })).resolves.toBeDefined();
  });

  test("FR-ACC-04: NIC shape is 12 digits, or 9 digits and V or X, and nothing more is checked", async () => {
    for (const ok of ["200012345678", "200012345V", "200012345v", "200012345X"]) {
      prismaMock.user.create.mockClear();
      await expect(service.register({ ...VALID, nic: ok })).resolves.toBeDefined();
    }
    for (const bad of ["20001234567", "2000123456789", "200012345", "200012345A", "ABCDEFGHIJKL"]) {
      expect((await registerError({ ...VALID, nic: bad })).fields.nic).toBeDefined();
    }
  });

  test("email is optional, but a malformed one is refused", async () => {
    await expect(service.register({ ...VALID, email: undefined })).resolves.toBeDefined();
    expect((await registerError({ ...VALID, email: "not-an-email" })).fields.email).toBeDefined();
  });

  test("legal name: blank is refused, 100 characters accepted, 101 refused", async () => {
    expect((await registerError({ ...VALID, legalName: "   " })).fields.legalName).toBe("Required");
    await expect(service.register({ ...VALID, legalName: "x".repeat(100) })).resolves.toBeDefined();
    expect((await registerError({ ...VALID, legalName: "x".repeat(101) })).fields.legalName).toBeDefined();
  });

  test("terms not accepted is refused before the phone is verified", async () => {
    const err = await registerError({ ...VALID, tosAccepted: false });
    expect(err.status).toBe(400);
    expect(err.fields).toEqual({ tosAccepted: "Required" });
    expect(verifyFirebaseIdToken).not.toHaveBeenCalled();
  });
});

describe("FR-ACC-03: 18 and over, from the birthdate alone", () => {
  test("one day short of 18 is refused", async () => {
    const err = await registerError({ ...VALID, birthdate: birthdateYearsAgo(18, 1) });
    expect(err.status).toBe(400);
    expect(err.fields.birthdate).toBe("Must indicate an age of 18 or older");
  });

  test("18 today is accepted", async () => {
    await expect(service.register({ ...VALID, birthdate: birthdateYearsAgo(18) })).resolves.toBeDefined();
  });

  test("an impossible date is refused", async () => {
    expect((await registerError({ ...VALID, birthdate: "2000-13-45" })).fields.birthdate).toBeDefined();
  });
});

describe("FR-ACC-08: the phone comes only from a server-verified Firebase token", () => {
  test("a token Firebase rejects is a 401 and nothing is created", async () => {
    verifyFirebaseIdToken.mockRejectedValue(new Error("expired"));
    const err = await registerError(VALID);
    expect(err.status).toBe(401);
    expect(err.message).toBe("Phone verification failed or has expired. Verify your phone again.");
    expect(prismaMock.user.create).not.toHaveBeenCalled();
  });

  test("the stored phone is the one in the verified token, marked verified now", async () => {
    await service.register(VALID);
    const { data } = prismaMock.user.create.mock.calls[0][0];
    expect(data.phone).toBe("+94770000091");
    expect(data.phoneVerifiedAt).toBeInstanceOf(Date);
  });
});

describe("FR-ACC-05: duplicates are refused with a field-level message", () => {
  test.each([
    ["phone", 0, 409, { phone: "Already registered" }],
    ["NIC", 1, 409, { nic: "Already registered" }],
    ["email", 2, 409, { email: "Already in use" }],
  ])("an existing %s", async (_label, whichLookup, status, fields) => {
    // register() runs three lookups in a fixed order: phone, NIC, email.
    let call = 0;
    prismaMock.user.findFirst.mockImplementation(async () => (call++ === whichLookup ? { id: "someone" } : null));
    const err = await registerError(VALID);
    expect(err.status).toBe(status);
    expect(err.fields).toEqual(fields);
    expect(prismaMock.user.create).not.toHaveBeenCalled();
  });

  test("the NIC lookup uses the deterministic ciphertext, so a case-different NIC is found", async () => {
    await service.register({ ...VALID, nic: "200012345v" });
    const nicLookup = prismaMock.user.findFirst.mock.calls[1][0];
    expect(nicLookup.where.nicEncrypted).toBe(encryptNic("200012345V"));
  });

  test("a race lost at the database (unique index, P2002) is a 409, not a server error", async () => {
    prismaMock.user.create.mockRejectedValue(Object.assign(new Error("unique"), { code: "P2002" }));
    const err = await registerError(VALID);
    expect(err.status).toBe(409);
  });
});

describe("FR-ACC-01 / NFR-SEC-03: what is stored, and the result", () => {
  test("NIC encrypted with only its last four in clear, email lower-cased, name trimmed, password hashed", async () => {
    await service.register(VALID);
    const { data } = prismaMock.user.create.mock.calls[0][0];
    expect(data.nicEncrypted).toBe(encryptNic("200012345678"));
    expect(JSON.stringify(data)).not.toContain("200012345678");
    expect(data.nicLast4).toBe("5678");
    expect(data.email).toBe("amal.perera@example.com");
    expect(data.legalName).toBe("Amal Perera");
    expect(data.passwordHash).toMatch(/^\$2[aby]\$12\$/);
    expect(data.accountStatus).toBe("ACTIVE");
    expect(data.tosAcceptedAt).toBeInstanceOf(Date);
  });

  test("an employer starts as Individual/Household; other roles have no posting type", async () => {
    await service.register({ ...VALID, role: "EMPLOYER" });
    expect(prismaMock.user.create.mock.calls[0][0].data.postingAsType).toBe("INDIVIDUAL");
    await service.register({ ...VALID, role: "COMMUNITY_ENDORSER" });
    expect(prismaMock.user.create.mock.calls[1][0].data.postingAsType).toBeNull();
  });

  test("an email given at signup gets a single-use confirmation link, stored only as a hash", async () => {
    await service.register(VALID);
    const { data } = prismaMock.emailVerificationToken.create.mock.calls[0][0];
    expect(data.purpose).toBe("SIGNUP");
    expect(data.email).toBe("amal.perera@example.com");
    expect(data.token).toMatch(/^[0-9a-f]{64}$/); // a SHA-256 hex digest
    const printed = console.log.mock.calls.map((c) => c[0]).join("\n");
    expect(printed).toContain("[Mock Email] for amal.perera@example.com:");
    expect(printed).not.toContain(data.token); // the link carries the raw token, the row only its hash
  });

  test("the new person is signed in: the result carries a token for the new account", async () => {
    const result = await service.register(VALID);
    expect(verifyToken(result.token).sub).toBe("new-user");
  });
});
