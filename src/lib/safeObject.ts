/**
 * Safe object serialization for SSR/JSON
 * Replaces undefined values with null to prevent serialization errors
 */
export function safeJson<T>(value: T): T {
  // substitui undefined por null para serialização Next/SSR
  return JSON.parse(JSON.stringify(value, (_k, v) => (v === undefined ? null : v)));
}
