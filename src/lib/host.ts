// src/lib/host.ts
export function isBrowser() {
  return typeof window !== 'undefined';
}

export function getHostname(): string | null {
  if (!isBrowser()) return null;
  try {
    return window.location.hostname.toLowerCase();
  } catch {
    return null;
  }
}

export function isZapFarmDomain(): boolean {
  const h = getHostname();
  if (!h) return false;
  return h === 'zapfarm.com.br' || h === 'www.zapfarm.com.br' || h === 'zapfarm.com' || h === 'www.zapfarm.com';
}

