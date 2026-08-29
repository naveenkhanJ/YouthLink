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
 * The signed-in user's notifications. Makes FR-APPLY-08 (decline) and
 * FR-APPLY-09 (automatic not-selected) visible; Applying & Selection writes
 * these rows but nothing read them back.
 * @returns {Promise<Array<object>>}
 */
export function listNotifications() {
  return request("/api/demo/notifications");
}
