/**
 * How the endorsement screens word and format what the server sends — Afham.
 * Kept apart from the screens so each rule is stated once.
 */

/**
 * 8.1: the code is displayed spaced ("K 7 X A 2 B") so it reads as six symbols, not a word.
 * Display only — the value stored, shared and compared stays unspaced ("K7XA2B").
 * @param {string} code
 */
export function spacedCode(code) {
  return (code ?? "").split("").join(" ");
}

/**
 * 8.3m: "+94771234567" → "+94 77 123 4567", the grouping PhoneField draws.
 * @param {string} phone - E.164, as the server returns it.
 */
export function displayPhone(phone) {
  const local = (phone ?? "").replace(/^\+94/, "");
  return `+94 ${[local.slice(0, 2), local.slice(2, 5), local.slice(5)].filter(Boolean).join(" ")}`;
}

/**
 * 8.5 `trackRecord` (FR-ENDORSE-11): "3 endorsed, 1 went on to build a good rating". Both numbers
 * come from the server, which derives them live — never copied, never cached here.
 * @param {{ endorsedCount: number, goodRatingCount: number }} trackRecord
 */
export function trackRecordLine({ endorsedCount, goodRatingCount }) {
  return `${endorsedCount} endorsed, ${goodRatingCount} went on to build a good rating`;
}

/**
 * 8.4 attributeChips, in the drawn order: the enum value the API takes, and the chip's label
 * (the same labels the server returns for display, backend application.trust.js ATTRIBUTE_LABELS).
 */
export const ATTRIBUTES = [
  { value: "PUNCTUALITY", label: "Punctuality" },
  { value: "HONESTY", label: "Honesty" },
  { value: "RELIABILITY", label: "Reliability" },
  { value: "SPECIFIC_SKILL", label: "Specific skill" },
  { value: "LENGTH_OF_ACQUAINTANCE", label: "Long acquaintance" },
];

/** FR-ENDORSE-04: the reason's cap. */
export const REASON_MAX_LENGTH = 300;
