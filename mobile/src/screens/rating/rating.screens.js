/**
 * Screen manifest for the FR-RATE module — Pawan (Sprint 4).
 *
 * This is the ONLY file you edit to add a screen. RootNavigator collects every module's manifest
 * automatically. Every screen here draws its own Chrome/ScreenHeader, so the navigator's native
 * header is off — otherwise each screen would show two.
 *
 * All three take { engagementId } and ask the server which moment it is, handing over to the right
 * one if opened at the wrong moment — so a caller can always open RatingRate:
 *   RatingRate      RateEngagementScreen   6.1 / 6.1e / 6.6 (rate), 6.1f (closed at reveal)
 *   RatingAwaiting  AwaitingRevealScreen   6.2 / 6.2e / 6.6b / 6.6d / 6.6nb (your rating is in)
 *   RatingRevealed  RevealedRatingsScreen  6.3 / 6.3p / 6.3s (both ratings, or what was revealed)
 */
import RateEngagementScreen from "./RateEngagementScreen.js";
import AwaitingRevealScreen from "./AwaitingRevealScreen.js";
import RevealedRatingsScreen from "./RevealedRatingsScreen.js";

export default [
  { name: "RatingRate", component: RateEngagementScreen, options: { headerShown: false } },
  { name: "RatingAwaiting", component: AwaitingRevealScreen, options: { headerShown: false } },
  { name: "RatingRevealed", component: RevealedRatingsScreen, options: { headerShown: false } },
];
