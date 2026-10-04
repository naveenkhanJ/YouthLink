/**
 * Screen manifest for the FR-ENG module — Naveenkhan.
 *
 * This is the ONLY file you edit to add a screen. RootNavigator collects every
 * module's manifest automatically, so four people can add screens in parallel
 * without ever touching the same file.
 */
import EngagementListScreen from "./EngagementListScreen";
import EngagementDetailScreen from "./EngagementDetailScreen";
import EngagementEndScreen from "./EngagementEndScreen";
import EngagementCodeScreen from "./EngagementCodeScreen";
import EngagementUnableToConfirmScreen from "./EngagementUnableToConfirmScreen";
import EngagementCancelScreen from "./EngagementCancelScreen";
import EngagementReconfirmScreen from "./EngagementReconfirmScreen";

export default [
  {
    name: "EngagementList",
    component: EngagementListScreen,
    options: { title: "My engagements" },
  },
  {
    name: "EngagementDetail",
    component: EngagementDetailScreen,
    options: { title: "Engagement" },
  },
  {
    name: "EngagementEnd",
    component: EngagementEndScreen,
    options: { title: "End engagement" },
  },
  {
    name: "EngagementCode",
    component: EngagementCodeScreen,
    options: { title: "Check-in" },
  },
  {
    name: "EngagementUnableToConfirm",
    component: EngagementUnableToConfirmScreen,
    options: { title: "Unable to confirm" },
  },
  {
    name: "EngagementCancel",
    component: EngagementCancelScreen,
    options: { title: "Cancel engagement" },
  },
  {
    name: "EngagementReconfirm",
    component: EngagementReconfirmScreen,
    options: { title: "Posting changed" },
  },
];
