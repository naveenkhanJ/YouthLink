/**
 * Screen manifest for the FR-ENDORSE module (prototype M8) — Afham.
 *
 * This is the ONLY file you edit to add a screen. RootNavigator collects every
 * module's manifest automatically, so four people can add screens in parallel
 * without ever touching the same file.
 *
 * Two halves that never meet (M8-endorsement.md): the job-seeker's own code (8.1 / 8.1b), and the
 * Verifier's side — enter a code, search by phone, vouch, and manage what they vouched for. The
 * Verifier's two tab hubs, EndorsementMine (Endorsements) and EndorsementEnterCode (Vouch), are
 * named in ShellTabBar's ROUTE_BY_TAB. The 8.6 / 8.7 prompts are dialogs over other modules'
 * screens (Apply, My applications) and have no route of their own.
 */
import EndorsementShareCodeScreen from "./EndorsementShareCodeScreen";
import EndorsementEnterCodeScreen from "./EndorsementEnterCodeScreen";
import EndorsementSearchScreen from "./EndorsementSearchScreen";
import EndorsementVouchScreen from "./EndorsementVouchScreen";
import EndorsementVouchedScreen from "./EndorsementVouchedScreen";
import EndorsementMineScreen from "./EndorsementMineScreen";

const NO_HEADER = { headerShown: false };

export default [
  // 8.1 / 8.1b / 8.1s: the job-seeker's own code and its share sheet, or the closed window.
  { name: "EndorsementShareCode", component: EndorsementShareCodeScreen, options: NO_HEADER },
  // 8.2: the Vouch tab — "Have a code to enter?" (also where a new Verifier lands, FR-ENDORSE-15).
  { name: "EndorsementEnterCode", component: EndorsementEnterCodeScreen, options: NO_HEADER },
  // 8.3 / 8.3m / 8.3n / 8.3d: one person by phone, or none.
  { name: "EndorsementSearch", component: EndorsementSearchScreen, options: NO_HEADER },
  // 8.4: the vouch itself.
  { name: "EndorsementVouch", component: EndorsementVouchScreen, options: NO_HEADER },
  // 8.4e: live — replaces 8.4, so Back cannot return to a vouch already given.
  { name: "EndorsementVouched", component: EndorsementVouchedScreen, options: { ...NO_HEADER, gestureEnabled: false } },
  // 8.5 / 8.5c / 8.5d / 8.5z: the Endorsements tab — what the Verifier has vouched for.
  { name: "EndorsementMine", component: EndorsementMineScreen, options: NO_HEADER },
];
