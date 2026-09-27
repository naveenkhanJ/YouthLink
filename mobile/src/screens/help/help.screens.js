/**
 * Help/FAQ (MHF) manifest — a shared module (docs/module-ownership.md's
 * Sprint 3 shared-prerequisite queue), not owned by any single epic, per
 * the same "your module's manifest" convention every other module uses.
 */
import HelpIndexScreen from "./HelpIndexScreen";
import HelpCheckInScreen from "./HelpCheckInScreen";
import HelpEndorsementScreen from "./HelpEndorsementScreen";
import HelpDisputesScreen from "./HelpDisputesScreen";
import HelpAccountAccessScreen from "./HelpAccountAccessScreen";

export default [
  { name: "HelpIndex", component: HelpIndexScreen, options: { headerShown: false } },
  { name: "HelpCheckIn", component: HelpCheckInScreen, options: { headerShown: false } },
  { name: "HelpEndorsement", component: HelpEndorsementScreen, options: { headerShown: false } },
  { name: "HelpDisputes", component: HelpDisputesScreen, options: { headerShown: false } },
  { name: "HelpAccountAccess", component: HelpAccountAccessScreen, options: { headerShown: false } },
];
