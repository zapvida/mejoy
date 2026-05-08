export type Utm = Partial<{
  utm_source: string; utm_medium: string; utm_campaign: string; utm_content: string; utm_term: string;
  gclid: string; fbclid: string; ttclid: string; msclkid: string; referrer: string; first_landing: string;
}>;

const UTM_KEY = 'zapfarm_utms_v1';
const MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000;

export function captureUtms(now = Date.now()) {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  const q = url.searchParams;
  const current: Utm = {};
  const maybe = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','gclid','fbclid','ttclid','msclkid'] as const;
  maybe.forEach(k => { const v = q.get(k); if (v) current[k] = v; });

  const existingRaw = localStorage.getItem(UTM_KEY);
  let existing: { data: Utm; ts: number } | null = existingRaw ? JSON.parse(existingRaw) : null;

  // primeira visita
  if (!existing?.data?.first_landing) {
    current.first_landing = window.location.pathname + window.location.search;
  } else {
    current.first_landing = existing.data.first_landing;
  }
  current.referrer = document.referrer || existing?.data?.referrer || '';

  const merged: Utm = { ...(existing?.data || {}), ...current };
  localStorage.setItem(UTM_KEY, JSON.stringify({ data: merged, ts: now }));

  // cookie leve (para SSR/leads)
  document.cookie = `${UTM_KEY}=${encodeURIComponent(JSON.stringify(merged))};path=/;max-age=${MAX_AGE_MS/1000}`;
}

export function getUtms(): Utm {
  if (typeof window === 'undefined') return {};
  const raw = localStorage.getItem(UTM_KEY);
  if (!raw) return {};
  try { return (JSON.parse(raw) as {data: Utm}).data || {}; } catch { return {}; }
}

export function appendUtmsToUrl(href: string): string {
  if (typeof window === 'undefined') return href;
  const u = new URL(href, window.location.origin);
  const utm = getUtms();
  Object.entries(utm).forEach(([k, v]) => { if (v && !u.searchParams.get(k)) u.searchParams.set(k, String(v)); });
  return u.pathname + u.search + u.hash;
}

// TODO(backcompat-2025-10-23) - Overload para compatibilidade com 3 args
export function withUtm(href: string, _medium?: string, _source?: string): string {
  return href; // Manter comportamento atual (ignorando extras) até revisão posterior
}

// Alias para compatibilidade
export const withUtmLegacy = appendUtmsToUrl;
