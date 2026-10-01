/**
 * Small in-memory rate limiters for the account endpoints that cannot be protected by
 * the password lockout: the 6-digit reset code (a million combinations is guessable
 * without a limit), reset-request volume (each one sends an SMS the project pays for),
 * and the password re-entry on phone change.
 *
 * Kept in process memory on purpose. There is no column to hold a counter (the schema
 * is fixed) and the API runs as a single instance, so a Map is enough; it resets when
 * the server restarts, which only ever gives an attacker a fresh window, never locks a
 * real user out for longer than the window. Move to a shared store if the API is ever
 * scaled to more than one instance.
 */
const buckets = new Map(); // key -> { count, resetAt }

function bucket(key, windowMs) {
  const now = Date.now();
  let b = buckets.get(key);
  if (!b || b.resetAt <= now) {
    b = { count: 0, resetAt: now + windowMs };
    buckets.set(key, b);
  }
  // Drop expired entries now and then so the map cannot grow without bound.
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k);
  }
  return b;
}

/** True when `key` has already used up `max` attempts inside the current window. */
function isBlocked(key, max, windowMs) {
  return bucket(key, windowMs).count >= max;
}

/** Counts one attempt against `key`; returns the new count. */
function record(key, windowMs) {
  const b = bucket(key, windowMs);
  b.count += 1;
  return b.count;
}

/** Forgets `key`, e.g. after a successful verification. */
function clear(key) {
  buckets.delete(key);
}

export { isBlocked, record, clear };
