const URL = process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

export async function markEventProcessed(evtId: string, ttlSec = 7 * 24 * 3600): Promise<boolean> {
  try {
    if (URL && TOKEN) {
      const key = `stripe:evt:${evtId}`;
      const setr = await fetch(`${URL}/setnx/${encodeURIComponent(key)}/1`, {
        headers: { Authorization: `Bearer ${TOKEN}` }
      });
      const created = (await setr.text()) === '1';
      if (created) {
        await fetch(`${URL}/expire/${encodeURIComponent(key)}/${ttlSec}`, {
          headers: { Authorization: `Bearer ${TOKEN}` }
        });
      }
      return created; // true => 1a vez
    }
  } catch {}
  // Fallback (in-memory): process only first time while instance lives
  (global as any).__evt ||= new Set<string>();
  const set: Set<string> = (global as any).__evt;
  if (set.has(evtId)) return false;
  set.add(evtId);
  return true;
}
