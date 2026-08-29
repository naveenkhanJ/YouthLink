/**
 * DEMO-ONLY session store — integration showcase branch. NOT part of any epic.
 *
 * ===========================================================================
 * Only exists on `demo/integration-showcase`. Never merge into develop.
 * ===========================================================================
 *
 * Why this exists rather than a change to Account Management:
 *
 * LoginScreen.js already calls setAuthToken() and renders its own inline
 * "Welcome back" confirmation — it deliberately doesn't navigate anywhere,
 * because where a logged-in user lands is a real app-wide question nobody has
 * decided. That module is finished and is not being touched for the demo.
 *
 * So the hub keeps its own record of who is signed in. It calls the same
 * loginPassword() endpoint and the same setAuthToken() every real screen uses,
 * so there is no second auth path — just a second, demo-only way to reach the
 * first one, with one-tap switching between seeded accounts. Tapping through
 * a phone number and password on an emulator keyboard mid-demo is exactly the
 * kind of dead air worth engineering away.
 *
 * Afham's real Login and Register screens stay reachable from the hub and are
 * still the way FR-ACC-01/07 get demonstrated. This is for switching roles
 * quickly between the OTHER modules' demos.
 *
 * No persistence: the token lives in memory only, same as setAuthToken's own
 * storage. Persisting it would mean expo-secure-store, a native module, which
 * would force a full `expo run:android` rebuild — a documented multi-hour risk
 * in this project. Not worth it to survive an app restart during a demo.
 */
import { loginPassword } from "../api/account";
import { setAuthToken } from "../api/client";
import { whoAmI } from "./demo.api";

/**
 * Accounts created by backend/src/demo/seed.demo.js. Keep the two in step.
 *
 * Deliberately a fixed list, not a query of every user. Two reasons: one-tap
 * sign-in only works because every seeded account shares SEEDED_PASSWORD, and
 * an account registered through the app has a password only its creator knows;
 * and an endpoint listing all users with their roles is not something to add
 * for a launcher. So an account created via the Register screen will not show
 * up here — that is intended. Sign in to it through the real Login screen,
 * which is what that screen is for and is listed in the hub.
 */
export const SEEDED_ACCOUNTS = [
  {
    phone: "+9477999001",
    label: "Employer",
    name: "Nimal Perera",
    detail: "Perera Catering Services",
  },
  {
    phone: "+9477999011",
    label: "Worker — tier 1",
    name: "Dilani Fernando",
    detail: "5-star history, 100% completion",
  },
  {
    phone: "+9477999012",
    label: "Worker — tier 2",
    name: "Ruwan Jayasuriya",
    detail: "Endorsed, no rating history",
  },
  {
    phone: "+9477999013",
    label: "Worker — tier 3",
    name: "Sanduni Bandara",
    detail: "New to YouthLink",
  },
  {
    phone: "+9477999002",
    label: "Community endorser",
    name: "Kamala Silva",
    detail: "Vouched for Ruwan",
  },
];

export const SEEDED_PASSWORD = "Demo1234";

let session = null;
const listeners = new Set();

function emit() {
  for (const listener of listeners) listener(session);
}

/**
 * Subscribes to session changes.
 * @param {(session: object | null) => void} listener
 * @returns {() => void} Unsubscribe function, for a useEffect cleanup.
 */
export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** @returns {{ token: string, user: object } | null} */
export function getSession() {
  return session;
}

/**
 * Logs in through the real password endpoint and records the result.
 *
 * There is one auth token for the whole app, so issuing a new one IS signing
 * the previous account out — no separate step, and no way for two accounts to
 * be signed in at once. Any earlier session is dropped before the request so
 * a failure can't leave the hub showing someone who is no longer signed in.
 *
 * @param {string} phone
 * @param {string} [password]
 * @returns {Promise<object>} The signed-in user.
 */
export async function signIn(phone, password = SEEDED_PASSWORD) {
  signOut();
  const { token, user } = await loginPassword({ phone, password });
  setAuthToken(token);
  session = { token, user };
  emit();
  return user;
}

/** Clears the token so subsequent requests are unauthenticated again. */
export function signOut() {
  setAuthToken(null);
  session = null;
  emit();
}

/**
 * Reconciles this store with whoever the shared auth token actually belongs to.
 *
 * Sign-in can happen where this module cannot see it — Account Management's own
 * Login and Register screens set the shared token directly, because they are
 * finished screens with no reason to know a demo launcher exists. Without this,
 * the hub kept displaying whichever seeded fixture it last signed in itself,
 * and showed that fixture as selected, while the app was really acting as
 * somebody else entirely.
 *
 * Called by the hub whenever it regains focus. Cheap, and the only way to be
 * right without modifying a module that is deliberately not being touched.
 *
 * @returns {Promise<object|null>} The reconciled user, or null if signed out.
 */
export async function refreshFromToken() {
  try {
    const user = await whoAmI();
    // Preserve the token we hold; only the identity needed correcting.
    session = { token: session?.token ?? null, user };
  } catch (err) {
    if (err.status === 401 || err.status === 403) {
      // No usable token — genuinely signed out.
      session = null;
    } else {
      // Backend down or similar. Leave whatever is on screen rather than
      // wrongly reporting the user as signed out because the network blipped.
      return session?.user ?? null;
    }
  }
  emit();
  return session?.user ?? null;
}

/** @returns {string | null} The signed-in user's ActorRole, if any. */
export function currentRole() {
  return session?.user?.role ?? null;
}
