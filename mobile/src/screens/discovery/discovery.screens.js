/**
 * Screen manifest for the FR-DISC module — Pawan.
 *
 * Every screen draws its own chrome (the Browse title and tab bar, or Chrome/ScreenHeader), so the
 * navigator's header is off for all of them.
 */
import DiscoveryScreen from "./DiscoveryScreen";
import LocationFallbackScreen from "./LocationFallbackScreen";
import FiltersScreen from "./FiltersScreen";
import SearchScreen from "./SearchScreen";

export default [
  {
    // 3.1 (and 3.1ldg, 3.1f, 3.1ofl, 3.2, 3.3, 3.6) — the worker's Browse tab (tab key "browse").
    name: "DiscoveryBrowse",
    component: DiscoveryScreen,
    options: { headerShown: false },
  },
  {
    // 3.4 — manual location fallback (FR-DISC-02).
    name: "DiscoveryLocation",
    component: LocationFallbackScreen,
    options: { headerShown: false },
  },
  {
    // 3.5 / 3.5c — category and arrangement filters (FR-DISC-03).
    name: "DiscoveryFilters",
    component: FiltersScreen,
    options: { headerShown: false },
  },
  {
    // 3.7 — keyword search (FR-DISC-04).
    name: "DiscoverySearch",
    component: SearchScreen,
    options: { headerShown: false },
  },
];
