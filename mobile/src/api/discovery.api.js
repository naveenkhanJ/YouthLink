/**
 * Discovery & Search API calls (FR-DISC) — Pawan.
 */
import { request } from "./client.js";

/**
 * Browse open gigs around a centre (FR-DISC-01..05). GET /api/discovery
 *
 * @param {object} params
 * @param {number} [params.lat] - device position (with lng)…
 * @param {number} [params.lng]
 * @param {string} [params.area] - …or a manually chosen area's name (FR-DISC-02)
 * @param {string} [params.category] - GigCategory value, e.g. "EVENT_SETUP"
 * @param {string} [params.arrangementType] - "GIG" | "PART_TIME" | "INTERNSHIP"
 * @param {string} [params.keyword] - matched against title and description (FR-DISC-04)
 * @param {string} [params.sortBy] - "urgent" (default) | "closest" | "newest" | "pay"
 * @returns {Promise<{ centreLabel: string, radiusKm: number, widened: boolean, postings: object[] }>}
 */
export function browseGigs(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value != null && value !== "") query.append(key, String(value));
  });
  const queryString = query.toString();
  return request(`/api/discovery${queryString ? `?${queryString}` : ""}`, { method: "GET" });
}

/**
 * The areas a search can be centred on — the same list postings are placed in (FR-POST-08), served
 * by the Gig Posting module. GET /api/postings/areas
 *
 * @returns {Promise<{ areas: Array<{ name: string, district: string, aliases: string[] }> }>}
 */
export function listAreas() {
  return request("/api/postings/areas", { method: "GET" });
}
