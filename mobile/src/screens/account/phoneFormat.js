/**
 * Sri Lanka phone-number format — Account Management module only.
 * Shared by PhoneField.js, usePhoneVerification.js, and LoginScreen.js's
 * password-login path (which assembles the same "+94" + 9 digits shape
 * by hand, since it never goes through the hook) — a review pass flagged
 * both COUNTRY_CODE and the digit count as duplicated across files, a
 * real risk that a future format change updates one and not the other.
 * Extracted here rather than into usePhoneVerification.js itself so a
 * plain UI component (PhoneField.js) doesn't have to import a hook to
 * get a constant out of it.
 */
export const COUNTRY_CODE = "+94";
export const LOCAL_DIGITS = 9;
