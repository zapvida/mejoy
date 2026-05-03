import { authService } from '@/lib/auth';

type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];
type JsonObject = { [key: string]: JsonValue };

export async function buildAuthenticatedHeaders(
  initHeaders?: HeadersInit
): Promise<Headers> {
  const headers = new Headers(initHeaders);
  const session = await authService.getSession();

  if (session?.access_token) {
    headers.set('Authorization', `Bearer ${session.access_token}`);
    return headers;
  }

  if (process.env.NODE_ENV !== 'production') {
    const user = await authService.getUser();
    if (user?.email) {
      headers.set('X-User-Email', user.email);
    }
  }

  return headers;
}

export async function fetchWithUserSession<T = JsonObject>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<{ ok: true; data: T } | { ok: false; status: number; error: string; data?: unknown }> {
  const headers = await buildAuthenticatedHeaders(init?.headers);

  const response = await fetch(input, {
    ...init,
    headers,
    credentials: 'same-origin',
  });

  const payload = await response
    .json()
    .catch(() => null) as { error?: string } | T | null;

  if (!response.ok) {
    const error =
      payload && typeof payload === 'object' && 'error' in payload && typeof payload.error === 'string'
        ? payload.error
        : `HTTP ${response.status}`;

    return { ok: false, status: response.status, error, data: payload ?? undefined };
  }

  return { ok: true, data: payload as T };
}
