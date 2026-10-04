// account.passwordHash.test.js
// NFR-SEC-01 (passwords stored only as a salted, slow hash) and FR-ACC-01's password rule
// (8 to 64 characters, spaces allowed) as far as the hashing layer is concerned.
import { jest } from "@jest/globals";
import { hashPassword, verifyPassword } from "../passwordHash.js";

// bcrypt at cost 12 takes a few hundred milliseconds per call, so each test gets more time.
jest.setTimeout(20000);

describe("NFR-SEC-01: password hashing", () => {
  test("the stored value is a bcrypt hash at cost 12, never the password itself", async () => {
    const hash = await hashPassword("Password123!");
    expect(hash).toMatch(/^\$2[aby]\$12\$/);
    expect(hash).not.toContain("Password123!");
  });

  test("the right password verifies and a wrong one does not", async () => {
    const hash = await hashPassword("Password123!");
    await expect(verifyPassword("Password123!", hash)).resolves.toBe(true);
    await expect(verifyPassword("Password123?", hash)).resolves.toBe(false);
    await expect(verifyPassword("password123!", hash)).resolves.toBe(false);
  });

  test("hashing is salted: the same password gives a different hash each time", async () => {
    const [a, b] = await Promise.all([hashPassword("Password123!"), hashPassword("Password123!")]);
    expect(a).not.toBe(b);
    await expect(verifyPassword("Password123!", b)).resolves.toBe(true);
  });

  test("spaces are part of the password (FR-ACC-01 allows them)", async () => {
    const hash = await hashPassword("correct horse battery");
    await expect(verifyPassword("correct horse battery", hash)).resolves.toBe(true);
    await expect(verifyPassword("correcthorsebattery", hash)).resolves.toBe(false);
  });
});
