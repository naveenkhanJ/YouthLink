/**
 * Screen manifest for the FR-RATE module — Pawan (Sprint 4).
 *
 * Screen names:
 *   - RatingRate: RateEngagementScreen (6.1 / 6.1e / 6.1f)
 *   - RatingAwaiting: AwaitingRevealScreen (6.2 / 6.2e)
 *   - RatingRevealed: RevealedRatingsScreen (6.3 / 6.3p)
 */
import RateEngagementScreen from "./RateEngagementScreen.js";
import AwaitingRevealScreen from "./AwaitingRevealScreen.js";
import RevealedRatingsScreen from "./RevealedRatingsScreen.js";

export default [
  {
    name: "RatingRate",
    component: RateEngagementScreen,
    options: { title: "Rate" },
  },
  {
    name: "RatingAwaiting",
    component: AwaitingRevealScreen,
    options: { title: "Rating" },
  },
  {
    name: "RatingRevealed",
    component: RevealedRatingsScreen,
    options: { title: "Ratings" },
  },
];
