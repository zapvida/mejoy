/**
 * Session ID para carrinho anônimo Store V2
 * Usado em cookie store_v2_session
 */

export const SESSION_COOKIE = 'store_v2_session';

export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return '';
  const stored = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${SESSION_COOKIE}=`))
    ?.split('=')[1];
  if (stored) return stored;
  const id = `s_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
  document.cookie = `${SESSION_COOKIE}=${id}; path=/; max-age=2592000; samesite=lax`;
  return id;
}
