/**
 * App-wide session state — who's signed in, their role, and the JWT.
 *
 * Didn't exist before this: the JWT lived only in api/client.js's module
 * variable, gone on every app restart, and nothing anywhere tracked the
 * current user or role at all. That's both account-management's "no session
 * persistence" known gap and the missing piece the neutral home entry needs
 * to route to the right role's TabBar — one fix serves both, so it lives
 * here (shared/, not screens/account/) rather than split across branches.
 *
 * Every module screen that needs "am I signed in" / "what's my role" /
 * "sign me out" should use useAuth(), not read api/client.js's token or
 * SecureStore directly.
 */
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { setAuthToken, setAuthFailureCallback } from "../api/client";

const TOKEN_KEY = "youthlink.authToken";
const USER_KEY = "youthlink.authUser";

// Set when the app signs the person out because their session ended; the login screen shows
// the "signed out for security" line (1.6s) whenever sessionEndReason is set.
export const SESSION_ENDED_REASON = "session-ended";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // "loading" only lasts through the initial SecureStore read at app boot.
  const [status, setStatus] = useState("loading");
  const [user, setUserState] = useState(null);
  // The latest user, readable from callbacks that outlive a render (a focus listener, a timer):
  // updateUser must merge onto THIS, never onto the user captured when the callback was made.
  const userRef = useRef(null);
  function setUser(next) {
    userRef.current = next;
    setUserState(next);
  }
  const [sessionEndReason, setSessionEndReason] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function restore() {
      // A failed read or a corrupt stored value must end in "signed out", never leave the
      // app on the loading spinner forever.
      try {
        const [token, userJson] = await Promise.all([
          SecureStore.getItemAsync(TOKEN_KEY),
          SecureStore.getItemAsync(USER_KEY),
        ]);
        if (cancelled) return;

        if (token && userJson) {
          const storedUser = JSON.parse(userJson);
          setAuthToken(token);
          setUser(storedUser);
          setStatus("signedIn");
          return;
        }
      } catch (err) {
        console.warn("Could not restore the saved session:", err);
        await Promise.allSettled([
          SecureStore.deleteItemAsync(TOKEN_KEY),
          SecureStore.deleteItemAsync(USER_KEY),
        ]);
      }
      if (!cancelled) setStatus("signedOut");
    }

    restore();
    
    // The text itself is drawn by the login screen (prototype 1.6s); this only records that
    // the person was signed out by the app rather than by choosing to log out.
    setAuthFailureCallback(() => {
      signOut(SESSION_ENDED_REASON);
    });
    
    return () => {
      cancelled = true;
    };
  }, []);

  async function signIn(token, signedInUser) {
    await Promise.all([
      SecureStore.setItemAsync(TOKEN_KEY, token),
      SecureStore.setItemAsync(USER_KEY, JSON.stringify(signedInUser)),
    ]);
    setAuthToken(token);
    setUser(signedInUser);
    setSessionEndReason(null); // a fresh login clears any "signed out for security" notice
    setStatus("signedIn");
  }

  /** Replaces the stored user after an edit (phone, name) so every screen shows the new value. */
  async function updateUser(changes) {
    const next = { ...userRef.current, ...changes };
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(next));
    setUser(next);
  }

  /** Swaps in a fresh token after a password change, so this device is not signed out with the rest. */
  async function replaceToken(token) {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    setAuthToken(token);
  }

  async function signOut(reason = null) {
    await Promise.all([
      SecureStore.deleteItemAsync(TOKEN_KEY),
      SecureStore.deleteItemAsync(USER_KEY),
    ]);
    setAuthToken(null);
    setUser(null);
    setSessionEndReason(reason);
    setStatus("signedOut");
  }

  const value = useMemo(
    () => ({ status, user, sessionEndReason, signIn, signOut, updateUser, replaceToken }),
    [status, user, sessionEndReason],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * @returns {{
 *   status: "loading" | "signedOut" | "signedIn",
 *   user: object | null,
 *   sessionEndReason: string | null,
 *   signIn: (token: string, user: object) => Promise<void>,
 *   signOut: (reason?: string) => Promise<void>,
 *   updateUser: (changes: object) => Promise<void>,
 *   replaceToken: (token: string) => Promise<void>,
 * }}
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth() must be called inside an AuthProvider");
  }
  return ctx;
}
