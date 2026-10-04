/**
 * Areas offered by the manual location fallback (FR-DISC-02, prototype screen 3.4) — Pawan.
 *
 * Each area is searched from its approximate town centre. Browse records that centre (rounded to
 * about 1 km) as the youth's browse location, exactly as it would a device location
 * (FR-POST-10 amendment, 2026-09-25), so a manually chosen area also drives gig notifications.
 *
 * Kept alphabetical so the picker is easy to scan.
 */
const AREAS = [
  { label: "Anuradhapura", lat: 8.3114, lng: 80.4037 },
  { label: "Badulla", lat: 6.9934, lng: 81.055 },
  { label: "Batticaloa", lat: 7.731, lng: 81.6747 },
  { label: "Colombo", lat: 6.9271, lng: 79.8612 },
  { label: "Dehiwala", lat: 6.8511, lng: 79.8659 },
  { label: "Galle", lat: 6.0535, lng: 80.221 },
  { label: "Gampaha", lat: 7.084, lng: 79.9939 },
  { label: "Homagama", lat: 6.8441, lng: 80.0026 },
  { label: "Jaffna", lat: 9.6615, lng: 80.0255 },
  { label: "Kaduwela", lat: 6.9333, lng: 79.9833 },
  { label: "Kalutara", lat: 6.5854, lng: 79.9607 },
  { label: "Kandy", lat: 7.2906, lng: 80.6337 },
  { label: "Kiribathgoda", lat: 6.98, lng: 79.929 },
  { label: "Kottawa", lat: 6.8412, lng: 79.9654 },
  { label: "Kurunegala", lat: 7.4818, lng: 80.3609 },
  { label: "Maharagama", lat: 6.848, lng: 79.9265 },
  { label: "Matara", lat: 5.9549, lng: 80.555 },
  { label: "Moratuwa", lat: 6.773, lng: 79.8816 },
  { label: "Negombo", lat: 7.2083, lng: 79.8358 },
  { label: "Nugegoda", lat: 6.8649, lng: 79.8997 },
  { label: "Panadura", lat: 6.7132, lng: 79.9026 },
  { label: "Ratnapura", lat: 6.6828, lng: 80.3992 },
  { label: "Trincomalee", lat: 8.5874, lng: 81.2152 },
  { label: "Wattala", lat: 6.9897, lng: 79.8916 },
];

export default AREAS;
