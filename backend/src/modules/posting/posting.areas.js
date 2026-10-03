// posting.areas.js
// The single list of areas a posting can be placed in (FR-POST-08).
//
// The employer picks the posting's area from this list on the Location step (frame 2.6), and
// the server takes the posting's public area label AND its coordinates from the chosen entry —
// never from the request. That closes two holes found in the end-to-end run of 2026-10-04: a
// street address typed without a comma became the public "area" (POST-E2E-01), and an area the
// app didn't know was silently placed at Colombo's centre (POST-E2E-02).
//
// Each entry is { name, district, lat, lng }: `name` is what workers see ("Colombo 04",
// "Dehiwala", "Hambantota"), `district` is the plain district name, and the point is the area's
// centre to 4 decimals. Browsing workers only ever get it rounded to about 1 km
// (posting.location.js).
//
// SOURCES
//   1. The first 30 entries are kept, values unchanged, from the app's earlier table
//      (mobile/src/screens/posting/sriLankaAreas.js, now deleted):
//        - Colombo 01, 03, 04 and 07: the same points the development seed uses, so seeded and
//          newly posted gigs agree (the seed's Colombo 01 point is nearer Maradana than the Fort).
//        - Every other kept entry: OpenStreetMap Nominatim (https://nominatim.openstreetmap.org),
//          looked up 2026-10-03, the area's own centre point.
//      Their districts are GeoNames' district for the same place; the Colombo suburbs it doesn't
//      list (Mount Lavinia, Kotte, Battaramulla, Malabe) are in Colombo District.
//   2. The rest come from GeoNames (https://www.geonames.org/), dump files LK.zip and
//      admin2Codes.txt from https://download.geonames.org/export/dump/, downloaded 2026-10-06.
//      Licence: Creative Commons Attribution 4.0 (CC BY 4.0) — this header is the attribution.
//      Selection rule: every populated place (feature class P) in Sri Lanka with population
//      >= 10,000, plus the capital town of each of the 25 districts not already in (only
//      Gampaha). The name is GeoNames' `asciiname`; the district comes from admin2Codes.txt
//      ("Colombo District" -> "Colombo"). Provincial capitals carry no district code in GeoNames;
//      each is the capital of the district of the same name. Katunayaka, the one other place
//      without a code, is in Gampaha District. Seven GeoNames places are the same town as a kept
//      entry (Galle, Kandy, Kelaniya, Maharagama, Moratuwa, Negombo, Wattala) and keep the kept
//      entry's point. Where two places would share a name, the name is written "Name (District)"
//      (none do in this list).
//
// To add an area later: append one line, with its source, and keep names unique.

export const AREAS = [
  { name: 'Colombo 01', district: 'Colombo', lat: 6.9271, lng: 79.8612 }, // the development seed's point
  { name: 'Colombo 02', district: 'Colombo', lat: 6.9247, lng: 79.8502 }, // Slave Island
  { name: 'Colombo 03', district: 'Colombo', lat: 6.9, lng: 79.85 }, // the development seed's point
  { name: 'Colombo 04', district: 'Colombo', lat: 6.9147, lng: 79.8553 }, // the development seed's point
  { name: 'Colombo 05', district: 'Colombo', lat: 6.8862, lng: 79.8652 }, // Havelock Town
  { name: 'Colombo 06', district: 'Colombo', lat: 6.877, lng: 79.8603 }, // Wellawatte
  { name: 'Colombo 07', district: 'Colombo', lat: 6.9087, lng: 79.8645 }, // the development seed's point
  { name: 'Colombo 08', district: 'Colombo', lat: 6.9148, lng: 79.8776 }, // Borella
  { name: 'Colombo 09', district: 'Colombo', lat: 6.9327, lng: 79.8803 }, // Dematagoda
  { name: 'Colombo 10', district: 'Colombo', lat: 6.9284, lng: 79.8648 }, // Maradana
  { name: 'Colombo 11', district: 'Colombo', lat: 6.9328, lng: 79.8549 }, // Pettah
  { name: 'Colombo 12', district: 'Colombo', lat: 6.9364, lng: 79.8624 }, // Hulftsdorp
  { name: 'Colombo 13', district: 'Colombo', lat: 6.948, lng: 79.8598 }, // Kotahena
  { name: 'Colombo 14', district: 'Colombo', lat: 6.9435, lng: 79.8734 }, // Grandpass
  { name: 'Colombo 15', district: 'Colombo', lat: 6.9625, lng: 79.864 }, // Mutwal
  { name: 'Dehiwala', district: 'Colombo', lat: 6.8513, lng: 79.8659 },
  { name: 'Mount Lavinia', district: 'Colombo', lat: 6.8317, lng: 79.8626 },
  { name: 'Nugegoda', district: 'Colombo', lat: 6.87, lng: 79.8882 },
  { name: 'Maharagama', district: 'Colombo', lat: 6.8473, lng: 79.9266 },
  { name: 'Kotte', district: 'Colombo', lat: 6.8883, lng: 79.9187 },
  { name: 'Rajagiriya', district: 'Colombo', lat: 6.9095, lng: 79.8962 },
  { name: 'Battaramulla', district: 'Colombo', lat: 6.9022, lng: 79.9195 },
  { name: 'Malabe', district: 'Colombo', lat: 6.9041, lng: 79.9546 },
  { name: 'Moratuwa', district: 'Colombo', lat: 6.7747, lng: 79.8826 },
  { name: 'Ratmalana', district: 'Colombo', lat: 6.8197, lng: 79.8682 },
  { name: 'Kelaniya', district: 'Gampaha', lat: 6.9502, lng: 79.9171 },
  { name: 'Wattala', district: 'Gampaha', lat: 6.9899, lng: 79.8927 },
  { name: 'Negombo', district: 'Gampaha', lat: 7.2094, lng: 79.8331 },
  { name: 'Kandy', district: 'Kandy', lat: 7.2931, lng: 80.635 },
  { name: 'Galle', district: 'Galle', lat: 6.0328, lng: 80.2149 },
  { name: 'Ambalangoda', district: 'Galle', lat: 6.2355, lng: 80.0538 }, // GeoNames 1251574
  { name: 'Ambalantota', district: 'Hambantota', lat: 6.1196, lng: 81.0214 }, // GeoNames 1251568
  { name: 'Ampara', district: 'Ampara', lat: 7.2975, lng: 81.682 }, // GeoNames 1251459
  { name: 'Anuradhapura', district: 'Anuradhapura', lat: 8.3122, lng: 80.4131 }, // GeoNames 1251081
  { name: 'Badulla', district: 'Badulla', lat: 6.9802, lng: 81.0577 }, // GeoNames 1250615
  { name: 'Battaramulla South', district: 'Colombo', lat: 6.8964, lng: 79.9181 }, // GeoNames 1250164
  { name: 'Batticaloa', district: 'Batticaloa', lat: 7.7102, lng: 81.6924 }, // GeoNames 1250161
  { name: 'Beliatta', district: 'Hambantota', lat: 6.0496, lng: 80.7325 }, // GeoNames 1250066
  { name: 'Bentota', district: 'Galle', lat: 6.426, lng: 79.9958 }, // GeoNames 1249978
  { name: 'Beruwala', district: 'Kalutara', lat: 6.4788, lng: 79.9828 }, // GeoNames 1249931
  { name: 'Chilaw', district: 'Puttalam', lat: 7.5758, lng: 79.7953 }, // GeoNames 1249145
  { name: 'Colombo', district: 'Colombo', lat: 6.9355, lng: 79.8487 }, // GeoNames 1248991
  { name: 'Dambulla', district: 'Matale', lat: 7.86, lng: 80.6517 }, // GeoNames 1248749
  { name: 'Dehiwala-Mount Lavinia', district: 'Colombo', lat: 6.8402, lng: 79.8712 }, // GeoNames 1234569
  { name: 'Devinuwara', district: 'Matara', lat: 5.9283, lng: 80.5888 }, // GeoNames 1248158
  { name: 'Eravur Town', district: 'Batticaloa', lat: 7.7782, lng: 81.6038 }, // GeoNames 1246924
  { name: 'Gampaha', district: 'Gampaha', lat: 7.0897, lng: 79.9925 }, // GeoNames 1246007, district capital
  { name: 'Gampola', district: 'Kandy', lat: 7.1643, lng: 80.5696 }, // GeoNames 1246000
  { name: 'Hambantota', district: 'Hambantota', lat: 6.1241, lng: 81.1185 }, // GeoNames 1244926
  { name: 'Hanwella Ihala', district: 'Colombo', lat: 6.9012, lng: 80.0852 }, // GeoNames 1244773
  { name: 'Hatton', district: 'Nuwara Eliya', lat: 6.8916, lng: 80.5955 }, // GeoNames 1244596
  { name: 'Hendala', district: 'Gampaha', lat: 6.9909, lng: 79.883 }, // GeoNames 1244397
  { name: 'Homagama', district: 'Colombo', lat: 6.844, lng: 80.0024 }, // GeoNames 1243936
  { name: 'Ja Ela', district: 'Gampaha', lat: 7.0744, lng: 79.8919 }, // GeoNames 1242835
  { name: 'Jaffna', district: 'Jaffna', lat: 9.6685, lng: 80.0074 }, // GeoNames 1242833
  { name: 'Kalmunai', district: 'Ampara', lat: 7.409, lng: 81.8347 }, // GeoNames 1242110
  { name: 'Kalutara', district: 'Kalutara', lat: 6.5831, lng: 79.9593 }, // GeoNames 1241964
  { name: 'Kandana', district: 'Gampaha', lat: 7.048, lng: 79.8937 }, // GeoNames 1241750
  { name: 'Kataragama', district: 'Moneragala', lat: 6.4134, lng: 81.3346 }, // GeoNames 1241076
  { name: 'Katunayaka', district: 'Gampaha', lat: 7.1699, lng: 79.8884 }, // GeoNames 1240935
  { name: 'Kegalle', district: 'Kegalle', lat: 7.2523, lng: 80.3436 }, // GeoNames 1240723
  { name: 'Kilinochchi', district: 'Kilinochchi', lat: 9.3961, lng: 80.3982 }, // GeoNames 1240372
  { name: 'Kolonnawa', district: 'Colombo', lat: 6.9329, lng: 79.8848 }, // GeoNames 1239593
  { name: 'Kotikawatta', district: 'Colombo', lat: 6.9269, lng: 79.9095 }, // GeoNames 1239047
  { name: 'Kurunegala', district: 'Kurunegala', lat: 7.4839, lng: 80.3683 }, // GeoNames 1237980
  { name: 'Mannar', district: 'Mannar', lat: 8.9895, lng: 79.8784 }, // GeoNames 1236150
  { name: 'Matale', district: 'Matale', lat: 7.4698, lng: 80.6217 }, // GeoNames 1235855
  { name: 'Matara', district: 'Matara', lat: 5.9485, lng: 80.5353 }, // GeoNames 1235846
  { name: 'Monaragala', district: 'Moneragala', lat: 6.8714, lng: 81.3487 }, // GeoNames 1234808
  { name: 'Mullaittivu', district: 'Mullaitivu', lat: 9.268, lng: 80.815 }, // GeoNames 1234393
  { name: 'Mulleriyawa', district: 'Colombo', lat: 6.933, lng: 79.9297 }, // GeoNames 1234378
  { name: 'Nuwara Eliya', district: 'Nuwara Eliya', lat: 6.9708, lng: 80.7829 }, // GeoNames 1232783
  { name: 'Panadura', district: 'Kalutara', lat: 6.7132, lng: 79.9026 }, // GeoNames 1231410
  { name: 'Peliyagoda', district: 'Gampaha', lat: 6.9685, lng: 79.8836 }, // GeoNames 1230613
  { name: 'Pita Kotte', district: 'Colombo', lat: 6.8905, lng: 79.9015 }, // GeoNames 1230089
  { name: 'Point Pedro', district: 'Jaffna', lat: 9.8167, lng: 80.2333 }, // GeoNames 1229989
  { name: 'Polonnaruwa', district: 'Polonnaruwa', lat: 7.9397, lng: 81.0027 }, // GeoNames 1229901
  { name: 'Pottuvil', district: 'Ampara', lat: 6.8762, lng: 81.8267 }, // GeoNames 1229724
  { name: 'Puttalam', district: 'Puttalam', lat: 8.0362, lng: 79.8283 }, // GeoNames 1229293
  { name: 'Ratnapura', district: 'Ratnapura', lat: 6.6858, lng: 80.4036 }, // GeoNames 1228730
  { name: 'Sri Jayewardenepura Kotte', district: 'Colombo', lat: 6.883, lng: 79.9071 }, // GeoNames 1238992
  { name: 'Tangalle', district: 'Hambantota', lat: 6.0234, lng: 80.7974 }, // GeoNames 1227037
  { name: 'Trincomalee', district: 'Trincomalee', lat: 8.5778, lng: 81.2289 }, // GeoNames 1226260
  { name: 'Vakarai', district: 'Batticaloa', lat: 8.1333, lng: 81.4333 }, // GeoNames 1225187
  { name: 'Valvedditturai', district: 'Jaffna', lat: 9.8167, lng: 80.1667 }, // GeoNames 1225142
  { name: 'Vavuniya', district: 'Vavuniya', lat: 8.7514, lng: 80.4971 }, // GeoNames 1225018
  { name: 'Weligama', district: 'Matara', lat: 5.975, lng: 80.4297 }, // GeoNames 1223738
  { name: 'Welisara', district: 'Gampaha', lat: 7.0281, lng: 79.9014 }, // GeoNames 1223648
  { name: 'Wellawaya', district: 'Moneragala', lat: 6.7369, lng: 81.1028 }, // GeoNames 11126122
];

// Well-known suburbs and older names that employers write instead of the listed area; each
// resolves to the entry named on the right. Kept from the app's earlier table.
export const ALIASES = {
  fort: 'Colombo 01',
  'slave island': 'Colombo 02',
  kollupitiya: 'Colombo 03',
  bambalapitiya: 'Colombo 04',
  'havelock town': 'Colombo 05',
  wellawatte: 'Colombo 06',
  'cinnamon gardens': 'Colombo 07',
  borella: 'Colombo 08',
  maradana: 'Colombo 10',
  pettah: 'Colombo 11',
  kotahena: 'Colombo 13',
  'sri jayawardenepura kotte': 'Kotte',
};

/**
 * The comparison key for an area name: lower-case, a trailing " area" dropped, runs of spaces
 * collapsed, and "Colombo 4" padded to "colombo 04" — so "colombo 4 area" and "Colombo 04" match.
 */
export function normaliseArea(text) {
  const clean = String(text ?? '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/ area$/, '')
    .trim();
  return clean.replace(/^colombo (\d)$/, 'colombo 0$1');
}

// Built once at load: normalised name -> entry, with each alias pointing at its target's entry.
const BY_KEY = new Map(AREAS.map((area) => [normaliseArea(area.name), area]));
for (const [alias, target] of Object.entries(ALIASES)) {
  BY_KEY.set(normaliseArea(alias), BY_KEY.get(normaliseArea(target)));
}

/**
 * The listed area a piece of text names, or null when it names none.
 *
 * @param {string} text - e.g. "Colombo 04", "colombo 4", "Dehiwala area", "Kollupitiya"
 * @returns {{ name: string, district: string, lat: number, lng: number } | null}
 */
export function findArea(text) {
  return BY_KEY.get(normaliseArea(text)) ?? null;
}

/**
 * What GET /api/postings/areas returns, sorted by name: each area's name and district, plus the
 * aliases that resolve to it (e.g. Colombo 03 -> ["kollupitiya"]) so the app's picker can find
 * "Colombo 03" when the employer types "Kollu". Coordinates are not sent: the app never needs them.
 *
 * @returns {Array<{ name: string, district: string, aliases: string[] }>}
 */
export function listAreas() {
  return AREAS.map(({ name, district }) => ({
    name,
    district,
    aliases: Object.keys(ALIASES).filter((alias) => ALIASES[alias] === name),
  })).sort((a, b) => a.name.localeCompare(b.name));
}
