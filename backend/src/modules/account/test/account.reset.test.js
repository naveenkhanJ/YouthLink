// account.reset.test.js
// FR-ACC-10 (password reset by SMS code or email link), FR-ACC-08's amendment (the server makes its
// own 6-digit codes only for reset, phone change and admin login) and the reset web page served to
// the browser — account.service.js's reset functions, otpService.js and pages.js, with the
// database replaced by a mock. Single use and expiry of codes and links depend on the database's
// conditional updates and are covered by the API tests against a real PostgreSQL.
import { jest } from "@jest/globals";
import testConfig from "./testConfig.js";

const prismaMock = {
  user: { findFirst: jest.fn() },
  otpCode: { updateMany: jest.fn(), create: jest.fn() },
  emailVerificationToken: { create: jest.fn() },
  $transaction: jest.fn(),
};

jest.unstable_mockModule("../../../config/index.js", () => ({ default: testConfig }));
jest.unstable_mockModule("../../../lib/prisma.js", () => ({ default: prismaMock }));
jest.unstable_mockModule("../firebaseAuth.js", () => ({ verifyFirebaseIdToken: jest.fn() }));

const { default: service } = await import("../account.service.js");
const { generateOtp, verifyOtp } = await import("../otpService.js");
const { resetPasswordPage, messagePage } = await import("../pages.js");

let phoneCounter = 0;
/** A fresh number per test: the reset-request limit is kept per number for the whole process. */
function freshPhone() {
  phoneCounter += 1;
  return `+9477${String(1000000 + phoneCounter).slice(-7)}`;
}

beforeEach(() => {
  jest.resetAllMocks();
  prismaMock.$transaction.mockImplementation(async (ops) => Promise.all(ops));
  prismaMock.otpCode.updateMany.mockResolvedValue({ count: 0 });
  prismaMock.otpCode.create.mockResolvedValue({});
  prismaMock.emailVerificationToken.create.mockResolvedValue({});
  jest.spyOn(console, "log").mockImplementation(() => {});
});

afterEach(() => jest.restoreAllMocks());

describe("FR-ACC-10: which channels a number can use", () => {
  test("a verified email is offered, masked (the endpoint needs no sign-in)", async () => {
    prismaMock.user.findFirst.mockResolvedValue({ email: "kavindu@example.com", emailVerifiedAt: new Date() });
    const result = await service.resetPasswordChannels({ phone: "+94 77 000 0001" });
    expect(result).toEqual({ phone: "+94770000001", email: "k******@example.com", emailVerified: true });
  });

  test("a short local part is still masked with at least three stars", async () => {
    prismaMock.user.findFirst.mockResolvedValue({ email: "ab@example.com", emailVerifiedAt: new Date() });
    const result = await service.resetPasswordChannels({ phone: "+94770000001" });
    expect(result.email).toBe("a***@example.com");
  });

  test("an unverified email is not offered", async () => {
    prismaMock.user.findFirst.mockResolvedValue({ email: "kavindu@example.com", emailVerifiedAt: null });
    const result = await service.resetPasswordChannels({ phone: "+94770000001" });
    expect(result).toEqual({ phone: "+94770000001", email: null, emailVerified: false });
  });

  test("an unknown number gets the same answer as a number with no email (no enumeration)", async () => {
    prismaMock.user.findFirst.mockResolvedValue(null);
    const unknown = await service.resetPasswordChannels({ phone: "+94770000099" });
    expect(unknown).toEqual({ phone: "+94770000099", email: null, emailVerified: false });
  });
});

describe("FR-ACC-10: requesting a reset", () => {
  test("SMS: a 6-digit code is issued for PASSWORD_RESET and printed to the console in development", async () => {
    const phone = freshPhone();
    prismaMock.user.findFirst.mockResolvedValue({ id: "u1", phone, email: null, emailVerifiedAt: null });
    await expect(service.resetPasswordRequest({ phone, channel: "PHONE" })).resolves.toEqual({ success: true });
    const { data } = prismaMock.otpCode.create.mock.calls[0][0];
    expect(data.purpose).toBe("PASSWORD_RESET");
    expect(data.code).toMatch(/^\d{6}$/);
    expect(console.log).toHaveBeenCalledWith(`[Mock SMS] for ${phone}: ${data.code}`);
  });

  test("email: a link is issued only to a verified address; the stored token is a hash of the link's", async () => {
    const phone = freshPhone();
    prismaMock.user.findFirst.mockResolvedValue({ id: "u1", phone, email: "amal@example.com", emailVerifiedAt: new Date() });
    await service.resetPasswordRequest({ phone, channel: "EMAIL" });
    const { data } = prismaMock.emailVerificationToken.create.mock.calls[0][0];
    expect(data.purpose).toBe("PASSWORD_RESET");
    const line = console.log.mock.calls[0][0];
    const rawToken = new URL(line.split(": ")[1]).searchParams.get("token");
    expect(rawToken).toMatch(/^[0-9a-f]{64}$/);
    expect(data.token).not.toBe(rawToken);
    const { createHash } = await import("crypto");
    expect(data.token).toBe(createHash("sha256").update(rawToken).digest("hex"));
    // The link expires 15 minutes after it is made.
    expect(data.expiresAt.getTime() - Date.now()).toBeGreaterThan(14 * 60 * 1000);
    expect(data.expiresAt.getTime() - Date.now()).toBeLessThanOrEqual(15 * 60 * 1000);
  });

  test("an unknown number, or email to an unverified address, still answers success and sends nothing", async () => {
    prismaMock.user.findFirst.mockResolvedValue(null);
    await expect(service.resetPasswordRequest({ phone: freshPhone(), channel: "PHONE" })).resolves.toEqual({ success: true });
    prismaMock.user.findFirst.mockResolvedValue({ id: "u1", phone: "x", email: "a@b.com", emailVerifiedAt: null });
    await expect(service.resetPasswordRequest({ phone: freshPhone(), channel: "EMAIL" })).resolves.toEqual({ success: true });
    expect(prismaMock.otpCode.create).not.toHaveBeenCalled();
    expect(prismaMock.emailVerificationToken.create).not.toHaveBeenCalled();
    expect(console.log).not.toHaveBeenCalled();
  });

  test("more than 3 requests for one number in 15 minutes are dropped silently", async () => {
    const phone = freshPhone();
    prismaMock.user.findFirst.mockResolvedValue({ id: "u1", phone, email: null, emailVerifiedAt: null });
    for (let i = 0; i < 5; i++) {
      await expect(service.resetPasswordRequest({ phone, channel: "PHONE" })).resolves.toEqual({ success: true });
    }
    expect(prismaMock.otpCode.create).toHaveBeenCalledTimes(3);
  });

  test("an unknown channel is a 400", async () => {
    await expect(service.resetPasswordRequest({ phone: freshPhone(), channel: "FAX" })).rejects.toMatchObject({ status: 400 });
  });
});

describe("FR-ACC-08 amendment: the server's own codes", () => {
  test("a new code supersedes any live code for the same number and purpose", async () => {
    await generateOtp({ phone: "+94770000001", purpose: "PHONE_CHANGE" });
    const supersede = prismaMock.otpCode.updateMany.mock.calls[0][0];
    expect(supersede.where).toMatchObject({ phone: "+94770000001", purpose: "PHONE_CHANGE", consumedAt: null });
    expect(supersede.data.consumedAt).toBeInstanceOf(Date);
  });

  test("codes expire 5 minutes after they are made", async () => {
    await generateOtp({ phone: "+94770000001", purpose: "PASSWORD_RESET" });
    const { expiresAt } = prismaMock.otpCode.create.mock.calls[0][0].data;
    expect(expiresAt.getTime() - Date.now()).toBeGreaterThan(4.9 * 60 * 1000);
    expect(expiresAt.getTime() - Date.now()).toBeLessThanOrEqual(5 * 60 * 1000);
  });

  test("codes are always six digits, leading zeros kept", async () => {
    for (let i = 0; i < 200; i++) {
      expect(await generateOtp({ phone: "+94770000001", purpose: "PASSWORD_RESET" })).toMatch(/^\d{6}$/);
    }
  });

  test("signup and login codes are refused: Firebase handles those", async () => {
    await expect(generateOtp({ phone: "+94770000001", purpose: "SIGNUP" })).rejects.toThrow(/Firebase/);
    await expect(verifyOtp({ phone: "+94770000001", code: "123456", purpose: "LOGIN" })).rejects.toThrow(/Firebase/);
  });

  test("verifying consumes the code in one conditional update (only an unused, unexpired code matches)", async () => {
    prismaMock.otpCode.updateMany.mockResolvedValueOnce({ count: 1 }).mockResolvedValueOnce({ count: 0 });
    await expect(verifyOtp({ phone: "+94770000001", code: "123456", purpose: "PASSWORD_RESET" })).resolves.toBe(true);
    await expect(verifyOtp({ phone: "+94770000001", code: "123456", purpose: "PASSWORD_RESET" })).resolves.toBe(false);
    const { where } = prismaMock.otpCode.updateMany.mock.calls[0][0];
    expect(where).toMatchObject({ code: "123456", consumedAt: null, expiresAt: { gt: expect.any(Date) } });
  });
});

describe("The reset page served to the browser", () => {
  test("the token is embedded as a JavaScript string that cannot close the script tag", () => {
    const html = resetPasswordPage('</script><script>alert(1)</script>');
    expect(html).not.toContain("</script><script>alert(1)");
    expect(html).toContain("\\u003c/script>");
  });

  test("message pages escape their text", () => {
    const html = messagePage("<b>Title</b>", `Tom & "Jerry" <img src=x>`);
    expect(html).toContain("&lt;b&gt;Title&lt;/b&gt;");
    expect(html).toContain("Tom &amp; &quot;Jerry&quot; &lt;img src=x&gt;");
    expect(html).not.toContain("<img src=x>");
  });

  test("the page checks 8 to 64 characters and a matching confirmation before sending", () => {
    const html = resetPasswordPage("abc");
    expect(html).toContain("Password must be 8 to 64 characters.");
    expect(html).toContain('maxlength="64"');
    expect(html).toContain("/api/account/reset-password/confirm");
  });
});
