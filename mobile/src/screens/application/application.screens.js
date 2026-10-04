/**
 * Screen manifest for the FR-APPLY module — Naveenkhan.
 *
 * This is the ONLY file you edit to add a screen. RootNavigator collects every
 * module's manifest automatically, so four people can add screens in parallel
 * without ever touching the same file.
 */
import ListingDetailScreen from "./ListingDetailScreen";
import ApplyScreen from "./ApplyScreen";
import MyApplicationsScreen from "./MyApplicationsScreen";
import ApplicantPoolScreen from "./ApplicantPoolScreen";

export default [
  {
    name: "ApplicationListingDetail",
    component: ListingDetailScreen,
    options: { title: "Listing" },
  },
  {
    name: "ApplicationApply",
    component: ApplyScreen,
    options: { title: "Apply" },
  },
  {
    name: "ApplicationMine",
    component: MyApplicationsScreen,
    options: { title: "My applications" },
  },
  {
    name: "ApplicationApplicantPool",
    component: ApplicantPoolScreen,
    options: { title: "Applicants" },
  },
];
