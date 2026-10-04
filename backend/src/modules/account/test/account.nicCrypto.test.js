// account.nicCrypto.test.js
// FR-ACC-04 (NIC stored as entered, never verified), FR-ACC-05 (one account per NIC) and
// NFR-SEC-03 (NIC encrypted at rest, only the last four shown) — nicCrypto.js on its own.
//
// The property that matters most is determinism: the partial unique index on User.nicEncrypted
// only catches a duplicate NIC when the same NIC always encrypts to the same ciphertext
// (docs/database-schema.md, User indexes). A random-IV scheme would pass every other test here
// and still let duplicate accounts through, so that is tested first and from several angles.
import { jest } from "@jest/globals";
import testConfig from "./testConfig.js";

jest.unstable_mockModule("../../../config/index.js", () => ({ default: testConfig }));

const { normalizeNic, encryptNic, decryptNic, getNicLast4 } = await import("../nicCrypto.js");

describe("FR-ACC-05: the same NIC always produces the same ciphertext", () => {
  test("encrypting one NIC twice gives identical output", () => {
    expect(encryptNic("200012345678")).toBe(encryptNic("200012345678"));
  });

  test("letter case and surrounding spaces do not create a second ciphertext", () => {
    // Otherwise "200012345v" and " 200012345V " would register as two different people.
    const base = encryptNic("200012345V");
    expect(encryptNic("200012345v")).toBe(base);
    expect(encryptNic("  200012345V  ")).toBe(base);
  });

  test("different NICs give different ciphertexts", () => {
    expect(encryptNic("200012345678")).not.toBe(encryptNic("200012345679"));
    expect(encryptNic("200012345V")).not.toBe(encryptNic("200012345X"));
  });

  test("the IV is derived from the NIC: the same NIC gives the same IV, another NIC another IV", () => {
    const ivOf = (nic) => encryptNic(nic).split(":")[0];
    expect(ivOf("200012345678")).toBe(ivOf("200012345678"));
    expect(ivOf("200012345678")).not.toBe(ivOf("199512345679"));
  });
});

describe("NFR-SEC-03: the stored value is ciphertext, not the NIC", () => {
  test("the stored value has the documented ivHex:ciphertextHex shape and does not contain the NIC", () => {
    const stored = encryptNic("200012345678");
    expect(stored).toMatch(/^[0-9a-f]{32}:([0-9a-f]{32})+$/);
    expect(stored).not.toContain("200012345678");
  });

  test("decrypting gives back the normalised NIC", () => {
    expect(decryptNic(encryptNic("200012345678"))).toBe("200012345678");
    expect(decryptNic(encryptNic(" 200012345v "))).toBe("200012345V");
  });

  test("a malformed stored value is rejected with one consistent error", () => {
    for (const bad of ["", "not-hex", "abcd", "00:11", `${"0".repeat(32)}:${"0".repeat(30)}`]) {
      expect(() => decryptNic(bad)).toThrow("decryptNic received a malformed nicEncrypted value");
    }
  });

  test("a tampered ciphertext is rejected rather than decrypted to something else", () => {
    const [iv, ciphertext] = encryptNic("200012345678").split(":");
    // Flip the last byte of the ciphertext: the padding check then fails.
    const flipped = ciphertext.slice(0, -2) + (ciphertext.slice(-2) === "00" ? "01" : "00");
    expect(() => decryptNic(`${iv}:${flipped}`)).toThrow();
  });
});

describe("FR-ACC-04 / NFR-SEC-03: normalising and the last four characters", () => {
  test("normalising trims and upper-cases, and changes nothing else", () => {
    expect(normalizeNic(" 200012345v ")).toBe("200012345V");
    expect(normalizeNic("200012345678")).toBe("200012345678");
  });

  test("an empty or non-string NIC is refused", () => {
    for (const bad of ["", "   ", null, undefined, 200012345678]) {
      expect(() => normalizeNic(bad)).toThrow("normalizeNic requires a non-empty string");
    }
  });

  test("the last four are taken from the normalised NIC (what Settings shows as •••• 5678)", () => {
    expect(getNicLast4("200012345678")).toBe("5678");
    expect(getNicLast4("200012345v")).toBe("345V");
  });

  test("a NIC shorter than four characters has no last four", () => {
    expect(() => getNicLast4("12")).toThrow("getNicLast4 requires a NIC of at least 4 characters");
  });
});
