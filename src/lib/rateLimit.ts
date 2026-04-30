type Key = string;
const bucket = new Map<Key, { tokens: number; ts: number }>();

export function rateLimit(key: Key, limit=200, windowMs=30_000) {
  const now = Date.now();
  const entry = bucket.get(key) ?? { tokens: limit, ts: now };
  const refill = Math.floor((now - entry.ts) / windowMs) * limit;
  entry.tokens = Math.min(limit, entry.tokens + Math.max(0, refill));
  entry.ts = refill ? now : entry.ts;
  if (entry.tokens <= 0) { bucket.set(key, entry); return false; }
  entry.tokens -= 1; bucket.set(key, entry); return true;
}

export function assertRateLimit(key: Key, limit=200, windowMs=30_000): void {
  if (!rateLimit(key, limit, windowMs)) {
    throw new Error('Rate limit exceeded');
  }
}