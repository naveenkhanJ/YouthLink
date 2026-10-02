/**
 * Firebase phone-OTP verification flow, shared between RegisterScreen.js
 * and LoginScreen.js's OTP mode — both need the identical
 * signInWithPhoneNumber → confirm → getIdToken sequence and error
 * handling, only what happens with the resulting ID token differs
 * (RegisterScreen holds it for the rest of the form; LoginScreen sends it
 * straight to loginOtp()). Extracted after a code-review pass flagged the
 * two copies as a real drift risk, same reasoning as api/client.js's
 * parseApiError() extraction.
 *
 * `phone` is the 9-digit local part only, no country code — PhoneField.js
 * enforces that shape on input; COUNTRY_CODE is prefixed here, in the one
 * place that actually talks to Firebase, not scattered across screens.
 *
 * Also owns the resend-code cooldown and the single `error` string shown
 * inline on whichever field is currently relevant (the phone field before
 * a code is sent, the code field after) — found missing/inconsistent in
 * the 2026-08-23 UI/UX audit, see .worklog/progress.md.
 */
import { useEffect, useRef, useState } from "react";
import { getAuth, signInWithPhoneNumber, getIdToken, signOut } from "@react-native-firebase/auth";
import { COUNTRY_CODE, LOCAL_DIGITS, formatLocalNumber } from "../phoneFormat";

// 30s is a judgment call, not a spec'd value — long enough to discourage
// spamming Firebase's own rate limits, short enough that a genuinely
// undelivered SMS doesn't leave someone stuck waiting.
const RESEND_COOLDOWN_SECONDS = 30;
const APP_EXPIRY_SECONDS = 5 * 60;

// The strings the prototype draws for these two situations (1.3err2, 1.3err1). Firebase's
// own messages ("[auth/invalid-verification-code] The SMS verification code used ...") are
// developer text and never reach the screen.
export const CODE_MISMATCH_MESSAGE = "That code doesn't match. Check the 6 digits and try again.";
export const CODE_EXPIRED_MESSAGE = "This code is no longer valid. Tap Resend for a new one.";
// Not drawn anywhere in M1 (there is no frame for these two), so kept plain and neutral.
const SEND_FAILED_MESSAGE = "We couldn't send the code. Check the number and try again.";
const TOO_MANY_MESSAGE = "Too many attempts. Wait a few minutes and try again.";

/** Maps a Firebase phone-auth error to the screen copy for the step it happened in. */
function messageFor(err, step) {
  const code = err?.code || "";
  if (code === "auth/code-expired" || code === "auth/session-expired") return CODE_EXPIRED_MESSAGE;
  if (code === "auth/too-many-requests") return TOO_MANY_MESSAGE;
  if (step === "confirm" && code === "auth/invalid-verification-code") return CODE_MISMATCH_MESSAGE;
  return step === "send" ? SEND_FAILED_MESSAGE : CODE_MISMATCH_MESSAGE;
}

export default function usePhoneVerification(options = {}) {
  const { onBeforeSend } = options;
  const [phone, setPhone] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const [sendingCode, setSendingCode] = useState(false);
  const [confirmingCode, setConfirmingCode] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [codeExpired, setCodeExpired] = useState(false);
  const cooldownTimer = useRef(null);
  const expiryTimer = useRef(null);

  useEffect(() => {
    return () => {
      clearInterval(cooldownTimer.current);
      clearTimeout(expiryTimer.current);
    };
  }, []);

  function startCooldown() {
    clearInterval(cooldownTimer.current);
    setResendCooldown(RESEND_COOLDOWN_SECONDS);
    cooldownTimer.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(cooldownTimer.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  /** @returns {Promise<boolean>} True when a code was sent (so the caller can move on). */
  async function sendCode() {
    setError(null);
    if (phone.length !== LOCAL_DIGITS) {
      setError(`Enter a ${LOCAL_DIGITS}-digit phone number.`);
      return false;
    }
    setSendingCode(true);
    try {
      if (onBeforeSend) {
        await onBeforeSend(phone);
      }
      const result = await signInWithPhoneNumber(getAuth(), COUNTRY_CODE + phone);
      setConfirmationResult(result);
      setCode("");
      setCodeExpired(false);
      startCooldown();
      
      clearTimeout(expiryTimer.current);
      expiryTimer.current = setTimeout(() => {
        setCodeExpired(true);
        setError(CODE_EXPIRED_MESSAGE);
      }, APP_EXPIRY_SECONDS * 1000);
      return true;
    } catch (err) {
      // onBeforeSend failures (number already registered, password missing) are our own
      // sentences and pass through untouched; only Firebase errors are translated.
      setError(err?.code?.startsWith?.("auth/") ? messageFor(err, "send") : err.message || SEND_FAILED_MESSAGE);
      return false;
    } finally {
      setSendingCode(false);
    }
  }

  /** Drops the sent code and returns to phone entry — the phone field was
   * previously left editable-but-inert after a code was sent (editing it
   * didn't actually invalidate the stale confirmationResult); this is the
   * explicit, working replacement. */
  function changeNumber() {
    clearInterval(cooldownTimer.current);
    clearTimeout(expiryTimer.current);
    setConfirmationResult(null);
    setCode("");
    setError(null);
    setCodeExpired(false);
    setResendCooldown(0);
  }

  /**
   * @param {(idToken: string) => Promise<void>} onVerified - called once
   *   the code is confirmed, with the Firebase ID token. Whatever it does
   *   next (hold the token, call an API) is the caller's concern; a
   *   rejection from it is caught and surfaced the same way as a
   *   Firebase-side failure.
   */
  async function confirmCode(onVerified) {
    setError(null);
    if (codeExpired) {
      setError(CODE_EXPIRED_MESSAGE);
      return;
    }
    if (code.length !== 6) {
      setError(CODE_MISMATCH_MESSAGE);
      return;
    }
    setConfirmingCode(true);
    try {
      const userCredential = await confirmationResult.confirm(code);
      if (!userCredential) {
        setError(CODE_MISMATCH_MESSAGE);
        return;
      }
      const idToken = await getIdToken(userCredential.user);
      // Firebase signed this device in as a side effect of confirming the code. YouthLink
      // keeps its own session (the JWT); the Firebase one is not needed afterwards, and a
      // phone number left signed in would sit on the device until the next verification.
      try {
        await signOut(getAuth());
      } catch {
        /* harmless: the ID token is already in hand */
      }
      await onVerified(idToken);
    } catch (err) {
      // An "auth/..." error came from Firebase; anything else came from our own API call in
      // onVerified (e.g. "No account found for this phone number.") and is already readable.
      setError(err?.code?.startsWith?.("auth/") ? messageFor(err, "confirm") : err.message || CODE_MISMATCH_MESSAGE);
    } finally {
      setConfirmingCode(false);
    }
  }

  /**
   * Edits the phone number. If a code was already sent to the old number it is dropped
   * first — the sent code belongs to the number it was sent to, so keeping it would let
   * someone verify one number and submit another.
   */
  function editPhone(value) {
    if (confirmationResult) changeNumber();
    setPhone(value);
  }

  return {
    phone,
    setPhone,
    editPhone,
    confirmationResult,
    code,
    setCode,
    error,
    sendingCode,
    confirmingCode,
    resendCooldown,
    codeExpired,
    formattedPhone: `${COUNTRY_CODE} ${formatLocalNumber(phone)}`,
    sendCode,
    confirmCode,
    changeNumber,
  };
}
