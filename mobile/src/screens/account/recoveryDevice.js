/**
 * The identifier an account-recovery request is tied to (FR-ACC-10 E8).
 *
 * The recovery status and confirm endpoints are unauthenticated: the only thing that says "this
 * is the device that asked" is this value. So it must be unguessable — anyone who learned it could
 * read the outcome and, once an Admin approves, set a new password. It is generated once from a
 * cryptographically secure source and kept in the Keystore-backed SecureStore, so it survives the
 * app being closed (the request can take a day to review) but never leaves the device except in
 * these calls.
 */
import * as SecureStore from "expo-secure-store";

const KEY = "youthlink.recoveryDeviceId";
const ID_BYTES = 32; // 64 hex characters: within the server's 32–128 [A-Za-z0-9_-] rule

/** @returns {string} 64 hex characters from the platform CSPRNG. */
function randomId() {
  const source = globalThis.crypto;
  if (!source || typeof source.getRandomValues !== "function") {
    // Never fall back to Math.random: a predictable id here is an account-takeover risk.
    throw new Error("This device can't start an account recovery request.");
  }
  const bytes = source.getRandomValues(new Uint8Array(ID_BYTES));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Returns this device's recovery id, creating and storing one on first use. */
export async function getRecoveryDeviceId() {
  const existing = await SecureStore.getItemAsync(KEY);
  if (existing) return existing;
  const created = randomId();
  await SecureStore.setItemAsync(KEY, created);
  return created;
}

/** The stored id, or null when no request was ever started on this device. */
export async function peekRecoveryDeviceId() {
  return SecureStore.getItemAsync(KEY);
}
