/**
 * What the app remembers between launches that decides where a SIGNED-OUT launch begins.
 *
 * | onboardingSeen | lastPhone | signed-out launch opens at                                        |
 * |----------------|-----------|-------------------------------------------------------------------|
 * | no             | none      | the three onboarding cards (M0 0.2–0.4), then role selection (1.1) |
 * | yes            | none      | role selection (1.1): nobody has signed in on this device, or the  |
 * |                |           | account was deleted                                                |
 * | any            | a number  | Log in (1.6), the number filled in: someone has signed in here and |
 * |                |           | signed out, or their session ended                                 |
 *
 * A signed-IN launch never reads this: the saved session goes straight to the home shell. All
 * values are in SecureStore, so they survive the app being closed.
 */
import * as SecureStore from "expo-secure-store";

const ONBOARDING_KEY = "youthlink.onboardingSeen";
const LAST_PHONE_KEY = "youthlink.lastPhone";

/** @returns {Promise<{ onboardingSeen: boolean, lastPhone: string|null }>} Never throws: unreadable = "never seen". */
export async function readLaunchState() {
  try {
    const [seen, phone] = await Promise.all([
      SecureStore.getItemAsync(ONBOARDING_KEY),
      SecureStore.getItemAsync(LAST_PHONE_KEY),
    ]);
    return { onboardingSeen: Boolean(seen), lastPhone: phone || null };
  } catch {
    return { onboardingSeen: false, lastPhone: null };
  }
}

export async function markOnboardingSeen() {
  try {
    await SecureStore.setItemAsync(ONBOARDING_KEY, "1");
  } catch (err) {
    console.warn("Could not remember that onboarding was seen:", err);
  }
}

/** Remembers the number of the account that was just signed out (E.164), for the next Log in. */
export async function rememberLastPhone(phone) {
  try {
    await SecureStore.setItemAsync(LAST_PHONE_KEY, phone);
  } catch (err) {
    console.warn("Could not remember the last phone number:", err);
  }
}

/** Forgets it: used when the account no longer exists, so the next launch does not offer to log in. */
export async function forgetLastPhone() {
  try {
    await SecureStore.deleteItemAsync(LAST_PHONE_KEY);
  } catch {
    // Nothing to forget, or the store is unavailable: the next launch just shows role selection.
  }
}
