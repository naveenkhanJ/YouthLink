/**
 * Device location — the ONE file in the app that touches the phone's location (FR-DISC-02) — Pawan.
 *
 * Written against expo-location's API. Nothing else may import expo-location: if the package is
 * ever unavailable, this file alone changes (every function reports "unavailable") and Browse
 * falls back to the manual area picker (3.4), which is FR-DISC-02's denied path anyway.
 *
 * CONTRACT — every function resolves; none of them throws:
 *
 *   getPermissionStatus() → { status, canAskAgain }
 *   requestPermission()   → { status, canAskAgain }   (shows the OS dialogue when the OS allows)
 *       status:      "granted"      — "While using the app" or "Only this time" was chosen
 *                    "undetermined" — never asked yet: Browse asks, after its one line of context
 *                    "denied"       — refused; with canAskAgain false the OS won't show the
 *                                     dialogue again ("permanently denied", A10)
 *                    "unavailable"  — no location support on this build/phone
 *       canAskAgain: false when asking again would not show the dialogue
 *
 *   getCurrentPosition()  → { lat, lng } or null when no position could be had (location services
 *                           off, no fix in time). The position is only ever sent to our own server
 *                           as a search centre, which keeps it rounded to about 1 km (FR-POST-10).
 */
import * as Location from "expo-location";

// A browse centre only needs to be right to about a kilometre, so the balanced setting is enough —
// it answers faster and uses less battery than high accuracy.
const POSITION_OPTIONS = { accuracy: Location.Accuracy.Balanced };

// How long to wait for a fresh fix before using the phone's last known position instead. An
// emulator or a phone indoors can otherwise wait for a long time with nothing on screen.
const POSITION_TIMEOUT_MS = 10000;

const UNAVAILABLE = { status: "unavailable", canAskAgain: false };

/** expo-location's permission response, reduced to the contract above. */
function toStatus(response) {
  if (!response) return UNAVAILABLE;
  const status = response.granted ? "granted" : response.status === "undetermined" ? "undetermined" : "denied";
  return { status, canAskAgain: Boolean(response.canAskAgain) };
}

export async function getPermissionStatus() {
  try {
    return toStatus(await Location.getForegroundPermissionsAsync());
  } catch {
    return UNAVAILABLE;
  }
}

export async function requestPermission() {
  try {
    return toStatus(await Location.requestForegroundPermissionsAsync());
  } catch {
    return UNAVAILABLE;
  }
}

/** Resolves with `null` after `ms`, so a slow fix can be raced against it. */
function timeout(ms) {
  return new Promise((resolve) => setTimeout(() => resolve(null), ms));
}

export async function getCurrentPosition() {
  try {
    const fresh = await Promise.race([Location.getCurrentPositionAsync(POSITION_OPTIONS), timeout(POSITION_TIMEOUT_MS)]);
    const position = fresh ?? (await Location.getLastKnownPositionAsync());
    if (!position) return null;
    return { lat: position.coords.latitude, lng: position.coords.longitude };
  } catch {
    return null;
  }
}
