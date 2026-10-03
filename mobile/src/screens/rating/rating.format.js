/**
 * Small display helpers shared by the three rating screens (M6) — Pawan.
 */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * "18 Sep 2026" — the date format 6.2's unlock line uses.
 * @param {string|Date} value
 */
export function formatDay(value) {
  const d = new Date(value);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * The caption at the top of 6.1 / 6.2 / 6.1f / 6.3s: "Shop assistant — weekend · Saman Stores".
 * @param {{ postingTitle: string, counterpartyName: string }} state
 */
export function contextLine(state) {
  return `${state.postingTitle} · ${state.counterpartyName}`;
}

/**
 * Which screen shows a given server stage (FR-RATE-02). The three screens all call this after
 * loading, so whichever one the app opened, the person lands on the screen for the current moment —
 * e.g. "View status" opened after the other party rated goes straight to the revealed pair.
 *   OPEN             -> RatingRate      (6.1)
 *   AWAITING_REVEAL  -> RatingAwaiting  (6.2)
 *   REVEALED         -> RatingRevealed  (6.3, or 6.3s when this person never rated). The one
 *                       exception is made by RatingRate itself: opened by someone who never rated
 *                       after the reveal, it stays put and shows 6.1f ("Rating is closed").
 * @returns {"RatingRate"|"RatingAwaiting"|"RatingRevealed"|null} null for NOT_OPEN.
 */
export function screenForStage(state) {
  switch (state.stage) {
    case "OPEN":
      return "RatingRate";
    case "AWAITING_REVEAL":
      return "RatingAwaiting";
    case "REVEALED":
      return "RatingRevealed";
    default:
      return null;
  }
}
