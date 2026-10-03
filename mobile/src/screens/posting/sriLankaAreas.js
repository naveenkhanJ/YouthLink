/**
 * A small gazetteer of Sri Lankan areas -> map coordinates (FR-POST-08, D-2) — Lahiru.
 *
 * A real map pin needs a native map package and an API key, which is a later release. Until then
 * the employer types an address, the coarse area is derived from it ("23 Temple Road, Colombo 04"
 * -> "Colombo 04"), and the posting's coordinates come from this table, so two postings in
 * different places no longer share one point. Radius search and distance sort read these values
 * on the server; browsing workers only ever see them rounded to about 1 km.
 *
 * SOURCES — each point is the centre of the area, accurate to about 1 km:
 *   - Colombo 01, 03, 04 and 07: the same values the development seed uses, so seeded and newly
 *     posted gigs agree (note: the seed's Colombo 01 point is nearer Maradana than the Fort).
 *   - Every other area: OpenStreetMap Nominatim (https://nominatim.openstreetmap.org), looked up
 *     2026-10-03, the area's own centre point.
 *
 * An address whose area is not listed falls back to the Colombo centre (see `coordsForArea`).
 */

/** Colombo 01 — the fallback for any area not in the table. */
export const COLOMBO_CENTRE = { lat: 6.9271, lng: 79.8612 };

const AREA_COORDS = {
  'colombo 01': { lat: 6.9271, lng: 79.8612 },
  'colombo 02': { lat: 6.9247, lng: 79.8502 }, // Slave Island
  'colombo 03': { lat: 6.9, lng: 79.85 },
  'colombo 04': { lat: 6.9147, lng: 79.8553 },
  'colombo 05': { lat: 6.8862, lng: 79.8652 }, // Havelock Town
  'colombo 06': { lat: 6.877, lng: 79.8603 }, // Wellawatte
  'colombo 07': { lat: 6.9087, lng: 79.8645 },
  'colombo 08': { lat: 6.9148, lng: 79.8776 }, // Borella
  'colombo 09': { lat: 6.9327, lng: 79.8803 }, // Dematagoda
  'colombo 10': { lat: 6.9284, lng: 79.8648 }, // Maradana
  'colombo 11': { lat: 6.9328, lng: 79.8549 }, // Pettah
  'colombo 12': { lat: 6.9364, lng: 79.8624 }, // Hulftsdorp
  'colombo 13': { lat: 6.948, lng: 79.8598 }, // Kotahena
  'colombo 14': { lat: 6.9435, lng: 79.8734 }, // Grandpass
  'colombo 15': { lat: 6.9625, lng: 79.864 }, // Mutwal
  dehiwala: { lat: 6.8513, lng: 79.8659 },
  'mount lavinia': { lat: 6.8317, lng: 79.8626 },
  nugegoda: { lat: 6.87, lng: 79.8882 },
  maharagama: { lat: 6.8473, lng: 79.9266 },
  kotte: { lat: 6.8883, lng: 79.9187 },
  rajagiriya: { lat: 6.9095, lng: 79.8962 },
  battaramulla: { lat: 6.9022, lng: 79.9195 },
  malabe: { lat: 6.9041, lng: 79.9546 },
  moratuwa: { lat: 6.7747, lng: 79.8826 },
  ratmalana: { lat: 6.8197, lng: 79.8682 },
  kelaniya: { lat: 6.9502, lng: 79.9171 },
  wattala: { lat: 6.9899, lng: 79.8927 },
  negombo: { lat: 7.2094, lng: 79.8331 },
  kandy: { lat: 7.2931, lng: 80.635 },
  galle: { lat: 6.0328, lng: 80.2149 },
};

// A few well-known suburbs that employers write instead of the postal area. Same points.
const ALIASES = {
  fort: 'colombo 01',
  'slave island': 'colombo 02',
  kollupitiya: 'colombo 03',
  bambalapitiya: 'colombo 04',
  'havelock town': 'colombo 05',
  wellawatte: 'colombo 06',
  'cinnamon gardens': 'colombo 07',
  borella: 'colombo 08',
  maradana: 'colombo 10',
  pettah: 'colombo 11',
  kotahena: 'colombo 13',
  'sri jayawardenepura kotte': 'kotte',
};

/** Lower-case, drop a trailing "area", collapse spaces, and pad "Colombo 4" to "colombo 04". */
function normalise(label) {
  const clean = String(label ?? '')
    .toLowerCase()
    .replace(/\s+area$/, '')
    .replace(/\s+/g, ' ')
    .trim();
  return clean.replace(/^colombo (\d)$/, 'colombo 0$1');
}

/**
 * The coordinates for an area label such as "Colombo 04", "Dehiwala" or "Dehiwala area".
 * Matching ignores case and a trailing "area". An unrecognised label returns the Colombo centre —
 * nothing is drawn for "area not recognised", so the form never blocks on it.
 *
 * @param {string} label
 * @returns {{ lat: number, lng: number }}
 */
export function coordsForArea(label) {
  const key = normalise(label);
  const found = AREA_COORDS[key] ?? AREA_COORDS[ALIASES[key]];
  return found ? { ...found } : { ...COLOMBO_CENTRE };
}
