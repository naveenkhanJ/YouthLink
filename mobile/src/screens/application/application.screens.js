/**
 * Screen manifest for the FR-APPLY module — Naveenkhan.
 *
 * This is the ONLY file you edit to add a screen. RootNavigator collects every
 * module's manifest automatically, so four people can add screens in parallel
 * without ever touching the same file.
 *
 * Every screen draws its own header (the shared ScreenHeader, or none on the hub and the success
 * screen, per the prototype), so the navigator's native header is off on all of them.
 *
 * Route                         Prototype            Params
 * ApplicationListingDetail      3.12 (+ variants)    { gigPostingId }
 * ApplicationApply              4.1, 4.1bnr          { gigPostingId, title, employerName }
 * ApplicationSent               4.2                  { employerName }
 * ApplicationMine               4.3*, 4.4*           none — the worker's Applications tab hub
 * ApplicationApplicantPool      4.5*, 4.9p*          { gigPostingId }
 * ApplicationApplicantDetail    4.6*, 4.9*           { gigPostingId, applicationId }
 * ApplicationConfirmSelection   4.7*                 { gigPostingId, applicationId }
 * ApplicationContactDetails     4.8*                 { gigPostingId, applicationId }
 */
import ListingDetailScreen from "./ListingDetailScreen";
import ApplyScreen from "./ApplyScreen";
import ApplicationSentScreen from "./ApplicationSentScreen";
import MyApplicationsScreen from "./MyApplicationsScreen";
import ApplicantPoolScreen from "./ApplicantPoolScreen";
import ApplicantDetailScreen from "./ApplicantDetailScreen";
import ConfirmSelectionScreen from "./ConfirmSelectionScreen";
import ContactDetailsScreen from "./ContactDetailsScreen";

const NO_HEADER = { headerShown: false };

export default [
  { name: "ApplicationListingDetail", component: ListingDetailScreen, options: NO_HEADER },
  { name: "ApplicationApply", component: ApplyScreen, options: NO_HEADER },
  // The confirmation is final: no swiping back to a form that has already been sent.
  { name: "ApplicationSent", component: ApplicationSentScreen, options: { ...NO_HEADER, gestureEnabled: false } },
  { name: "ApplicationMine", component: MyApplicationsScreen, options: NO_HEADER },
  { name: "ApplicationApplicantPool", component: ApplicantPoolScreen, options: NO_HEADER },
  { name: "ApplicationApplicantDetail", component: ApplicantDetailScreen, options: NO_HEADER },
  { name: "ApplicationConfirmSelection", component: ConfirmSelectionScreen, options: NO_HEADER },
  { name: "ApplicationContactDetails", component: ContactDetailsScreen, options: NO_HEADER },
];
