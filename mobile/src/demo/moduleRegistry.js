/**
 * DEMO-ONLY module registry — integration showcase branch. NOT part of any epic.
 *
 * ===========================================================================
 * Only exists on `demo/integration-showcase`. Never merge into develop.
 * ===========================================================================
 *
 * Reads the SAME per-module screen manifests RootNavigator reads, and pairs
 * each with its owner and epic so the hub can group screens by whose slice
 * they belong to.
 *
 * The point of reading the manifests rather than hardcoding a screen list:
 * three of the four slices still have work in flight on other machines. When
 * anyone pushes a screen, they edit only their own manifest — as the project's
 * navigation design already requires — and it appears in this hub with no
 * change to any demo file. A module with nothing pushed yet renders as an
 * explicit "no screens yet" row rather than silently vanishing, so the demo
 * shows an honest picture of what exists.
 *
 * Ownership and epic names come from docs/module-ownership.md.
 */
import accountScreens from "../screens/account/account.screens";
import postingScreens from "../screens/posting/posting.screens";
import discoveryScreens from "../screens/discovery/discovery.screens";
import applicationScreens from "../screens/application/application.screens";
import notificationScreens from "../screens/notification/notification.screens";

/**
 * Sprint 1–2 slices, in the order the core loop runs: post -> discover ->
 * apply -> select. Account Management leads because every other slice needs
 * a signed-in user first.
 */
export const ACTIVE_MODULES = [
  {
    key: "account",
    title: "Account Management",
    epic: "FR-ACC",
    owner: "Afham",
    screens: accountScreens,
  },
  {
    key: "posting",
    title: "Gig Posting",
    epic: "FR-POST",
    owner: "Lahiru",
    screens: postingScreens,
  },
  {
    key: "discovery",
    title: "Discovery & Search",
    epic: "FR-DISC",
    owner: "Pawan",
    screens: discoveryScreens,
  },
  {
    key: "application",
    title: "Applying & Selection",
    epic: "FR-APPLY",
    owner: "Naveenkhan",
    screens: applicationScreens,
  },
  {
    key: "notification",
    title: "Notifications",
    epic: "FR-NOTIF",
    owner: "Pawan",
    screens: notificationScreens,
  },
];

// The four deferred slices (Engagement Lifecycle, Ratings & Reputation,
// Profile & Trust Signals, Community Endorsement) are deliberately not listed.
// They have no owner and no sprint assigned — see docs/module-ownership.md's
// deferred-scope section — so naming them in a demo launcher only invites
// "why is that empty?" about work nobody has been asked to do yet.
