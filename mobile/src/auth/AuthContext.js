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
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { setAuthToken, setAuthFailureCallback } from "../api/client";

const TOKEN_KEY = "youthlink.authToken";
const USER_KEY = "youthlink.authUser";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // "loading" only lasts through the initial SecureStore read at app boot.
  const [status, setStatus] = useState("loading");
  const [user, setUser] = useState(null);
  const [sessionEndReason, setSessionEndReason] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function restore() {
      const [token, userJson] = await Promise.all([
        SecureStore.getItemAsync(TOKEN_KEY),
        SecureStore.getItemAsync(USER_KEY),
      ]);
      if (cancelled) return;

      if (token && userJson) {
        setAuthToken(token);
        setUser(JSON.parse(userJson));
        setStatus("signedIn");
      } else {
        setStatus("signedOut");
      }
    }

    restore();
    
    setAuthFailureCallback(() => {
      signOut("Your session has ended. Please log in again.");
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
    setStatus("signedIn");
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
    () => ({ status, user, sessionEndReason, signIn, signOut }),
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
 * }}
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth() must be called inside an AuthProvider");
  }
  return ctx;
}
