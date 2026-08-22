/**
 * Firebase phone-OTP verification flow, shared between RegisterScreen.js
 * and LoginScreen.js's OTP mode — both need the identical
 * signInWithPhoneNumber → confirm → getIdToken sequence and error
 * handling, only what happens with the resulting ID token differs
 * (RegisterScreen holds it for the rest of the form; LoginScreen sends it
 * straight to loginOtp()). Extracted after a code-review pass flagged the
 * two copies as a real drift risk, same reasoning as api/client.js's
 * parseApiError() extraction.
 */
import { useState } from "react";
import { getAuth, signInWithPhoneNumber, getIdToken } from "@react-native-firebase/auth";

export default function usePhoneVerification() {
  const [phone, setPhone] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const [sendingCode, setSendingCode] = useState(false);
  const [confirmingCode, setConfirmingCode] = useState(false);

  async function sendCode() {
    setError(null);
    if (!phone.trim()) {
      setError("Phone number is required.");
      return;
    }
    setSendingCode(true);
    try {
      const result = await signInWithPhoneNumber(getAuth(), phone.trim());
      setConfirmationResult(result);
    } catch (err) {
      setError(err.message || "Could not send a verification code.");
    } finally {
      setSendingCode(false);
    }
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
    if (!code.trim()) {
      setError("Enter the code you received.");
      return;
    }
    setConfirmingCode(true);
    try {
      const userCredential = await confirmationResult.confirm(code.trim());
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
    sendCode,
    confirmCode,
  };
}
