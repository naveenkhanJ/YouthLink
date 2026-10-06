/**
 * What Browse remembers for the rest of this app session — Pawan.
 *
 * FR-DISC-07: filter and sort choices are session-only — they last while the app is open and reset
 * to the defaults when it is fully closed and reopened ("Filters reset when you close the app.",
 * prototype 3.5). A plain module-level object gives exactly that: it survives moving between
 * screens and tabs, and starts fresh with every app launch. Nothing here is written to storage.
 *
 * Also kept for the session: where the search is centred (so the location question is asked once
 * per launch, on first entry to Browse — FR-DISC-02) and the last results that loaded, which Browse
 * shows read-only when the phone goes offline (NFR-USE-01, prototype 3.1ofl).
 */

export const DEFAULT_SORT = "urgent";

const session = {
  // Where the search is centred: { kind: "device", lat, lng } or { kind: "area", area: "Homagama" }.
  centre: null,
  // True once the location permission was found to be permanently denied this session (A10).
  permanentlyDenied: false,
  // FR-DISC-03 — one category and one arrangement at most; null means "any".
  filters: { category: null, arrangementType: null },
  // FR-DISC-05 — "urgent" | "closest" | "newest" | "pay".
  sortBy: DEFAULT_SORT,
  // The last browse response that loaded, with the request it answered (offline view).
  lastResult: null,
};

export function getSession() {
  return session;
}

export function setCentre(centre) {
  session.centre = centre;
}

export function setPermanentlyDenied(value) {
  session.permanentlyDenied = value;
}

export function setFilters(filters) {
  session.filters = { category: filters.category ?? null, arrangementType: filters.arrangementType ?? null };
}

export function setSort(sortBy) {
  session.sortBy = sortBy;
}

export function rememberResult(result) {
  session.lastResult = result;
}

/** The browse request's centre: { lat, lng } for the device, { area } for a chosen area. */
export function centreParams(centre) {
  return centre.kind === "area" ? { area: centre.area } : { lat: centre.lat, lng: centre.lng };
}

/** How many filters are on — the count in "Filters · 2" and "· 2 filters on" (3.1f). */
export function activeFilterCount(filters = session.filters) {
  return [filters.category, filters.arrangementType].filter(Boolean).length;
}
