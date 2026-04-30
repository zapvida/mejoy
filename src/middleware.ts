import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { detectTenantByHost } from '@/lib/tenancy/tenant';

const KEYS = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','gclid','fbclid','ttclid','msclkid','ref','handoff','handoff_id','correlation_id'];

function isHtml(req: NextRequest) {
  const a = req.headers.get('accept') || '';
  return a.includes('text/html');
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const host = req.headers.get('host') || '';

  if (/(^|:)(localhost|127\.0\.0\.1)/.test(host)) {
    return NextResponse.next();
  }

  const res = NextResponse.next();

  // Detectar tenant por host
  try {
    const tenant = detectTenantByHost(req.headers.get('host') || undefined);
    res.cookies.set('tenant', tenant.id, { httpOnly: false, path: '/' });
    // (opcional) canonical por host, se necessário em SEO:
    // res.headers.set('Link', `<https://${req.headers.get('host')}${req.nextUrl.pathname}>; rel="canonical"`);
  } catch {}

  for (const k of KEYS) {
    const v = url.searchParams.get(k);
    if (v) {
      res.cookies.set(k, v, { path: '/', maxAge: 60*60*24*90 }); // 90 dias
    }
  }

  if (isHtml(req)) {
    const csp = [
      "default-src 'self'",
      "base-uri 'self'",
      "img-src 'self' data: blob: https:",
      "style-src 'self' 'unsafe-inline' https:",
      "script-src 'self' 'unsafe-eval' https://js.stripe.com",
      "connect-src 'self' https: wss:",
      "frame-src 'self' https://js.stripe.com https://checkout.stripe.com",
      "form-action 'self' https://checkout.stripe.com",
      "frame-ancestors 'self'"
    ].join('; ');
    res.headers.set('Content-Security-Policy-Report-Only', csp);
    res.headers.set('Report-To', JSON.stringify({
      group: 'csp-endpoint',
      max_age: 10886400,
      endpoints: [{ url: `${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/security/csp-report` }]
    }));
  }

  return res;
}

// Evita capturar para estáticos e APIs
export const config = {
  matcher: [
    // manter seus matchers atuais, evitando _next/static, api, etc.
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
};
