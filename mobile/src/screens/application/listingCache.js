/**
 * Listings already loaded this session, kept on the phone — NFR-USE-01 ("already-loaded listings
 * viewable without a live network connection") and prototype 3.12ofl. Added 2026-10-18.
 *
 * In memory, for as long as the app runs — the same lifetime as Browse's cached results (3.1ofl,
 * discoverySession.js), so a listing reached from offline Browse is always one that can open. A
 * listing's detail is only ever read from here when the server cannot be reached; it is replaced
 * every time the server answers.
 */
const cache = new Map(); // gigPostingId -> the last listing-detail response

export function rememberListing(gigPostingId, detail) {
  if (gigPostingId && detail) cache.set(gigPostingId, detail);
}

export function cachedListing(gigPostingId) {
  return cache.get(gigPostingId) ?? null;
}
