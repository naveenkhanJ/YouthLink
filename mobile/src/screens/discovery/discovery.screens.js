/**
 * Screen manifest for the FR-DISC module — Pawan.
 */
import DiscoveryScreen from "./DiscoveryScreen";
import LocationFallbackScreen from "./LocationFallbackScreen";

export default [
  {
    name: "DiscoveryBrowse",
    component: DiscoveryScreen,
    options: { title: "Explore Gigs" },
  },
  {
    // 3.4 — manual location fallback (FR-DISC-02). Draws its own ScreenHeader.
    name: "DiscoveryLocation",
    component: LocationFallbackScreen,
    options: { headerShown: false },
  },
];
