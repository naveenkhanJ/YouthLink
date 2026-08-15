/**
 * Mobile app configuration.
 *
 * API_BASE_URL note: on an Android emulator, "localhost" means the emulator
 * itself, not your machine. Use 10.0.2.2 to reach a server running on your
 * computer. On a physical device, use your machine's LAN IP address.
 */
export const API_BASE_URL = "http://10.0.2.2:3000";

// Firebase config is added by whoever wires up phone authentication first
// (FR-ACC-08, Account Management epic). It is not a secret — Firebase web
// config is public by design — but it still belongs here rather than inline.
export const FIREBASE_CONFIG = null;
