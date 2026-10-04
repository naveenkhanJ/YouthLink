/**
 * Discovery & Search API calls (FR-DISC) — Pawan.
 */
import { request } from "./client.js";

/**
 * Browses open gigs with location radius, filters, and sorting.
 */
export function browseGigs(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value != null && value !== "") {
      query.append(key, value);
    }
  });

  const queryString = query.toString();
  return request(`/api/discovery${queryString ? `?${queryString}` : ""}`, {
    method: "GET",
  });
}
