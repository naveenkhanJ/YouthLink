/**
 * DEMO-ONLY screen manifest — integration showcase branch.
 *
 * ===========================================================================
 * Only exists on `demo/integration-showcase`. Never merge into develop.
 * ===========================================================================
 *
 * Follows the same manifest shape as every module's own <module>.screens.js,
 * so RootNavigator collects it identically and the demo scaffolding needs no
 * special handling in that file beyond one import and the initial route.
 */
import DemoHubScreen from "./DemoHubScreen";
import DemoBrowseScreen from "./DemoBrowseScreen";
import DemoNotificationsScreen from "./DemoNotificationsScreen";

export default [
  {
    name: "DemoHub",
    component: DemoHubScreen,
    options: { title: "YouthLink — Demo" },
  },
  {
    name: "DemoBrowse",
    component: DemoBrowseScreen,
    options: { title: "Browse postings" },
  },
  {
    name: "DemoNotifications",
    component: DemoNotificationsScreen,
    options: { title: "Notifications" },
  },
];
