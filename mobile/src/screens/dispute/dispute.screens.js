/**
 * Reports & Disputes screens (M9, user side) — registered with the app's navigator by
 * RootNavigator.js, which collects every module's manifest.
 *
 * Prefix every screen name with "Dispute" (screen names are global).
 *
 * Route names other modules use:
 *   - DisputeCase    { disputeCaseId?, engagementId? }   the 9.2 family — 5.6 and End engagement
 *                    after opening a case, 5.2s / 5.3s "Open the dispute case", a DISPUTE_OPENED
 *                    notification
 *   - DisputeReport  { targetType, targetId, context? }  9.1 → 9.1d — "Report this listing" (3.12g),
 *                    the applicant detail, an active engagement's detail
 *   - DisputeRespond { disputeCaseId }                   9.3 → 9.3e — 9.2r's "Respond"
 */
import DisputeCaseScreen from "./DisputeCaseScreen";
import DisputeReportScreen from "./DisputeReportScreen";
import DisputeRespondScreen from "./DisputeRespondScreen";

export default [
  { name: "DisputeCase", component: DisputeCaseScreen, options: { headerShown: false } },
  { name: "DisputeReport", component: DisputeReportScreen, options: { headerShown: false } },
  { name: "DisputeRespond", component: DisputeRespondScreen, options: { headerShown: false } },
];
