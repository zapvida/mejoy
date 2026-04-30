export function getHost(req: Request | { headers?: Headers | Record<string, string | string[]> }): string {
  const headers = (req as any).headers || {};
  const h = (headers.get ? headers.get('x-forwarded-host') : (headers['x-forwarded-host'] as string))
    || (headers.get ? headers.get('host') : (headers['host'] as string))
    || '';
  return String(h).toLowerCase().split(',')[0].trim();
}

