/**
 * The identifier an account-recovery request is tied to (FR-ACC-10 E8).
 *
 * The recovery status and confirm endpoints are unauthenticated: the only thing that says "this
 * is the device that asked" is this value. So it must be unguessable — anyone who learned it could
 * read the outcome and, once an Admin approves, set a new password. The SERVER generates it
 * (crypto.randomBytes) and returns it from the request call; the app keeps it in the
 * Keystore-backed SecureStore so it survives the app being closed (the request can take a day to
 * review) and never leaves the device except in the status and confirm calls.
 */
import * as SecureStore from "expo-secure-store";

const KEY = "youthlink.recoveryDeviceId";

/** Remembers the id the server issued for this device's recovery request. */
export async function saveRecoveryDeviceId(id) {
  await SecureStore.setItemAsync(KEY, id);
}

/** The stored id, or null when no request was ever started on this device. */
export async function peekRecoveryDeviceId() {
  return SecureStore.getItemAsync(KEY);
}
