// account.attemptLimiter.test.js
// The in-memory limiter behind the account endpoints the password lockout cannot cover
// (attemptLimiter.js): wrong reset codes and reset requests (FR-ACC-10), the current-password
// re-check on Settings actions, email-change requests and the availability check (E2E-16).
// Time is controlled by replacing Date.now, so no test waits.
import { jest } from "@jest/globals";
import { isBlocked, record, clear } from "../attemptLimiter.js";

const WINDOW_MS = 15 * 60 * 1000;
let now;
let key;
let keyCounter = 0;

beforeEach(() => {
  now = Date.UTC(2026, 9, 4, 6, 0, 0);
  jest.spyOn(Date, "now").mockImplementation(() => now);
  // The limiter keeps its state for the whole process, so every test uses keys of its own.
  keyCounter += 1;
  key = `test-key-${keyCounter}`;
});

afterEach(() => jest.restoreAllMocks());

test("a key is not blocked until it has used every allowed attempt", () => {
  for (let i = 1; i <= 4; i++) {
    expect(isBlocked(key, 5, WINDOW_MS)).toBe(false);
    expect(record(key, WINDOW_MS)).toBe(i);
  }
  expect(isBlocked(key, 5, WINDOW_MS)).toBe(false);
  record(key, WINDOW_MS); // the fifth
  expect(isBlocked(key, 5, WINDOW_MS)).toBe(true);
});

test("the block lifts when the window ends, with a fresh count", () => {
  for (let i = 0; i < 5; i++) record(key, WINDOW_MS);
  expect(isBlocked(key, 5, WINDOW_MS)).toBe(true);

  now += WINDOW_MS - 1;
  expect(isBlocked(key, 5, WINDOW_MS)).toBe(true);

  now += 1; // exactly the end of the window
  expect(isBlocked(key, 5, WINDOW_MS)).toBe(false);
  expect(record(key, WINDOW_MS)).toBe(1);
});

test("clearing a key (after a successful check) forgets its attempts", () => {
  for (let i = 0; i < 5; i++) record(key, WINDOW_MS);
  clear(key);
  expect(isBlocked(key, 5, WINDOW_MS)).toBe(false);
});

test("keys are independent: one person's attempts never block another's", () => {
  const other = `${key}-other`;
  for (let i = 0; i < 5; i++) record(key, WINDOW_MS);
  expect(isBlocked(key, 5, WINDOW_MS)).toBe(true);
  expect(isBlocked(other, 5, WINDOW_MS)).toBe(false);
});
