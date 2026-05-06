import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { detectTenantByHost } from '@/lib/tenancy/tenant';

const KEYS = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','gclid','fbclid','ttclid','msclkid','ref','handoff','handoff_id','correlation_id'];

function isHtml(req: NextRequest) {
  const a = req.headers.get('accept') || '';
  return a.includes('text/html');
}

/** Defina DEBUG_PAGE_NAV=1 no .env.local para diagnosticar rajadas de GET (Document) em LP/triagem. */
function debugPageNav(pathname: string, req: NextRequest) {
  if (process.env.DEBUG_PAGE_NAV !== '1') return;
  const watch = pathname === '/emagrecimento' || pathname.startsWith('/triagem');
  if (!watch || !isHtml(req)) return;
  const mode = req.headers.get('sec-fetch-mode') ?? '';
  const purpose = req.headers.get('purpose') ?? req.headers.get('sec-purpose') ?? '';
  console.log('[mj-debug-nav]', new Date().toISOString(), pathname, { mode, purpose });
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const host = req.headers.get('host') || '';

  debugPageNav(url.pathname, req);

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
    /**
     * Report-Only — não bloqueia o browser; antes listava só Stripe em script-src mas a LP/triagem
     * carregam GTM/GA/Meta/Clarity/Bing, gerando dezenas de avisos falsos (“página quebrando”).
     * `unsafe-inline` cobre snippets do Next/GTM até migrar para nonce.
     */
    const csp = [
      "default-src 'self'",
      "base-uri 'self'",
      "img-src 'self' data: blob: https:",
      "style-src 'self' 'unsafe-inline' https:",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' blob: https://js.stripe.com https://www.googletagmanager.com https://www.google-analytics.com https://analytics.google.com https://connect.facebook.net https://scripts.clarity.ms https://www.clarity.ms https://scripts.bing.com",
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
