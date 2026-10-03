/**
 * Screen manifest for the FR-ENG module — Naveenkhan.
 *
 * This is the ONLY file you edit to add a screen. RootNavigator collects every
 * module's manifest automatically, so four people can add screens in parallel
 * without ever touching the same file.
 *
 * Every screen draws its own header (the shared ScreenHeader, or the list's own title), so the
 * navigator's native header is off on all of them — otherwise each screen would show two.
 *
 * Route names other modules use:
 *   - EngagementList                         the Engagements tab (worker and employer)
 *   - EngagementDetail  { engagementId }     e.g. the posting detail's "See engagement"; the
 *                                            rating screens popTo it
 *   - EngagementChangeResponses { gigPostingId }  the posting detail's change note (2.11c)
 *   - EngagementCancelRequest { engagementId }   the respond screen (5.9) — a CANCELLATION_REQUEST
 *                                            notification's target
 */
import EngagementListScreen from "./EngagementListScreen";
import EngagementDetailScreen from "./EngagementDetailScreen";
import EngagementCodeScreen from "./EngagementCodeScreen";
import EngagementUnableToConfirmScreen from "./EngagementUnableToConfirmScreen";
import EngagementCancelScreen from "./EngagementCancelScreen";
import EngagementReconfirmScreen from "./EngagementReconfirmScreen";
import EngagementChangeResponsesScreen from "./EngagementChangeResponsesScreen";
import EngagementCancelSentScreen from "./EngagementCancelSentScreen";
import EngagementCancelRequestScreen from "./EngagementCancelRequestScreen";

export default [
  { name: "EngagementList", component: EngagementListScreen, options: { headerShown: false } },
  { name: "EngagementDetail", component: EngagementDetailScreen, options: { headerShown: false } },
  { name: "EngagementCode", component: EngagementCodeScreen, options: { headerShown: false } },
  { name: "EngagementUnableToConfirm", component: EngagementUnableToConfirmScreen, options: { headerShown: false } },
  { name: "EngagementCancel", component: EngagementCancelScreen, options: { headerShown: false } },
  { name: "EngagementCancelSent", component: EngagementCancelSentScreen, options: { headerShown: false } },
  { name: "EngagementCancelRequest", component: EngagementCancelRequestScreen, options: { headerShown: false } },
  { name: "EngagementReconfirm", component: EngagementReconfirmScreen, options: { headerShown: false } },
  { name: "EngagementChangeResponses", component: EngagementChangeResponsesScreen, options: { headerShown: false } },
];
