/**
 * DEMO-ONLY API calls — integration showcase branch. NOT part of any epic.
 *
 * ===========================================================================
 * Only exists on `demo/integration-showcase`. Never merge into develop.
 * ===========================================================================
 *
 * Mirrors backend/src/demo/demo.routes.js. Kept out of src/api/ because that
 * directory is one file per real backend module and these endpoints are
 * scaffolding, not a module.
 */
import { request } from "../api/client";

/**
 * Every posting still accepting applications. Stands in for Discovery
 * (FR-DISC, not yet built) so a worker can reach a posting to apply to.
 * The coarse-vs-precise location rule still applies — see FR-POST-08.
 * @returns {Promise<Array<object>>}
 */
export function browsePostings() {
  return request("/api/demo/postings");
}

/**
 * The signed-in user's notifications.
 *
 * Points at the Notifications slice's own endpoint, NOT the demo one. When
 * this screen was written that module was an empty stub, so src/demo/ carried
 * a stand-in read. Pawan's FR-NOTIF module has since landed with a real
 * GET /api/notifications that also rolls batched digest children up into
 * their parent (batchedCount / batchedItems) — which the demo endpoint does
 * not do, so reading from it showed every batched child individually and left
 * the digest UI dead. Using the real one instead; the demo route is gone.
 * @returns {Promise<Array<object>>}
 */
export function listNotifications() {
  return request("/api/notifications");
}
