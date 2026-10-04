/**
 * The role's bottom tab bar, wired to the app's navigation — docs/prototype/MNAV-shells.md.
 *
 * `TabBar` only draws the bar. The screens that sit on a tab (My postings, the Post a Gig form's
 * first step, Profile) each draw this component as their last child, so a tap moves to the
 * right place from any of them with no per-module navigation code:
 *
 *   - a tab whose screen has been built and registered by its module opens that screen;
 *   - any other tab opens the Home shell on that tab, which shows the prototype's own shell copy
 *     until the owning module registers its screen (see `ROUTE_BY_TAB`).
 *
 * To make a new hub reachable from the bar, add one line to `ROUTE_BY_TAB`. A route that no module
 * has registered in this build is never navigated to, so an unbuilt module cannot crash the bar.
 *
 * Opening a screen that is already in the stack goes back to it (React Navigation's `navigate`),
 * so moving between tabs does not pile screens up.
 */
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../auth/AuthContext";
import TabBar from "./TabBar";

const TABBAR_ROLE = {
  YOUTH_JOB_SEEKER: "worker",
  EMPLOYER: "employer",
  COMMUNITY_ENDORSER: "verifier",
};

// Tab key (TabBar.js TABS_BY_ROLE) -> the route that module registered for that hub.
const ROUTE_BY_TAB = {
  worker: { profile: "ProfileOwn" },
  employer: { postings: "PostingList", postGig: "PostingCreate", profile: "ProfileOwn" },
  verifier: { profile: "ProfileOwn" },
};

/** The TabBar role ("worker" | "employer" | "verifier") for a signed-in user, or undefined. */
export function tabBarRoleFor(user) {
  return TABBAR_ROLE[user?.role];
}

/** True when a module has registered `name` in this build. */
export function isRouteRegistered(navigation, name) {
  return navigation.getState().routeNames.includes(name);
}

/** The route a tab opens for a role, if it has a registered one. */
export function routeForTab(navigation, role, key) {
  const name = ROUTE_BY_TAB[role]?.[key];
  return name && isRouteRegistered(navigation, name) ? name : undefined;
}

/**
 * Opens a tab: its own screen when it has one, otherwise the Home shell on that tab.
 * Used by this bar and by the Home shell's own bar.
 */
export function openShellTab(navigation, role, key) {
  const route = routeForTab(navigation, role, key);
  if (route) navigation.navigate(route);
  else navigation.navigate("Home", { tab: key });
}

/**
 * @param {object} props
 * @param {string} props.active - key of the tab this screen sits on (TabBar.js TABS_BY_ROLE)
 * @param {boolean} [props.notificationBadge]
 */
export default function ShellTabBar({ active, notificationBadge = false }) {
  const { user } = useAuth();
  const navigation = useNavigation();
  const role = tabBarRoleFor(user);
  if (!role) return null; // signed out: there is no shell to navigate

  return (
    <TabBar
      role={role}
      activeTab={active}
      notificationBadge={notificationBadge}
      onTabPress={(key) => {
        if (key !== active) openShellTab(navigation, role, key);
      }}
    />
  );
}
