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
import { getAuth, signInWithPhoneNumber, getIdToken } from "@react-native-firebase/auth";
import { COUNTRY_CODE, LOCAL_DIGITS } from "../phoneFormat";

// 30s is a judgment call, not a spec'd value — long enough to discourage
// spamming Firebase's own rate limits, short enough that a genuinely
// undelivered SMS doesn't leave someone stuck waiting.
const RESEND_COOLDOWN_SECONDS = 30;

function formatLocalNumber(digits) {
  // "771234567" -> "77 123 4567", matching how Sri Lankan mobile numbers
  // are conventionally grouped (carrier prefix, then 3+4).
  return [digits.slice(0, 2), digits.slice(2, 5), digits.slice(5)]
    .filter(Boolean)
    .join(" ");
}

export default function usePhoneVerification() {
  const [phone, setPhone] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const [sendingCode, setSendingCode] = useState(false);
  const [confirmingCode, setConfirmingCode] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const cooldownTimer = useRef(null);

  useEffect(() => {
    return () => clearInterval(cooldownTimer.current);
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

  async function sendCode() {
    setError(null);
    // Defensive, not reachable through the UI as built — PhoneField caps
    // input at 9 digits and every "Send code"/"Resend code" button is
    // disabled until this is true. Kept anyway: this hook doesn't control
    // how it's consumed, and a cheap boundary check here is the same
    // "trust internal code, validate at the edge" reasoning the backend
    // already applies to itself.
    if (phone.length !== LOCAL_DIGITS) {
      setError(`Enter a ${LOCAL_DIGITS}-digit phone number.`);
      return;
    }
    setSendingCode(true);
    try {
      const result = await signInWithPhoneNumber(getAuth(), COUNTRY_CODE + phone);
      setConfirmationResult(result);
      setCode("");
      startCooldown();
    } catch (err) {
      setError(err.message || "Could not send a verification code.");
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
    setConfirmationResult(null);
    setCode("");
    setError(null);
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
    if (code.length !== 6) {
      setError("Enter the 6-digit code.");
      return;
    }
    setConfirmingCode(true);
    try {
      const userCredential = await confirmationResult.confirm(code);
      if (!userCredential) {
        setError("That code didn't work. Try again.");
        return;
      }
      const idToken = await getIdToken(userCredential.user);
      await onVerified(idToken);
    } catch (err) {
      setError(err.message || "That code didn't work. Try again.");
    } finally {
      setConfirmingCode(false);
    }
  }

  return {
    phone,
    setPhone,
    confirmationResult,
    code,
    setCode,
    error,
    sendingCode,
    confirmingCode,
    resendCooldown,
    formattedPhone: `${COUNTRY_CODE} ${formatLocalNumber(phone)}`,
    sendCode,
    confirmCode,
    changeNumber,
  };
}
