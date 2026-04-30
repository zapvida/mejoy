type RateResult = { ok: true } | { ok: false; retryAfterSec: number };

const BUCKETS = new Map<string, { tokens: number; updatedAt: number }>();

async function inMemoryLimit(key: string, limit: number, windowMs: number): Promise<RateResult> {
  const now = Date.now();
  const b = BUCKETS.get(key) ?? { tokens: limit, updatedAt: now };
  const elapsed = now - b.updatedAt;
  const refill = Math.floor(elapsed / windowMs) * limit;
  b.tokens = Math.min(limit, b.tokens + (refill > 0 ? refill : 0));
  b.updatedAt = now;
  if (b.tokens > 0) {
    b.tokens -= 1;
    BUCKETS.set(key, b);
    return { ok: true };
  }
  const retryAfterSec = Math.ceil((windowMs - (elapsed % windowMs)) / 1000);
  return { ok: false, retryAfterSec };
}

async function upstashLimit(key: string, limit: number, windowSec: number): Promise<RateResult> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return inMemoryLimit(key, limit, windowSec * 1000);

  // Sliding window aproximado usando INCR + EXPIRE
  const r = await fetch(`${url}/incr/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const count = Number(await r.text());
  if (count === 1) {
    await fetch(`${url}/expire/${encodeURIComponent(key)}/${windowSec}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
  if (count <= limit) return { ok: true };
  const ttlRes = await fetch(`${url}/ttl/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const ttl = Number(await ttlRes.text());
  return { ok: false, retryAfterSec: Math.max(1, ttl) };
}

export async function checkRate(key: string, limit = 60, windowSec = 60): Promise<RateResult> {
  try {
    return await upstashLimit(key, limit, windowSec);
  } catch {
    return inMemoryLimit(key, limit, windowSec * 1000);
  }
}
