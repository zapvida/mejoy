#!/usr/bin/env tsx
/**
 * Auditoria forense de rotas críticas — execução real, sem achismos.
 * Uso: BASE_URL=http://localhost:3000 pnpm tsx scripts/audit-routes-forensic.ts
 */

// Default: produção (sempre funciona). Para local: BASE_URL=http://localhost:3000
const BASE = process.env.BASE_URL || 'https://www.mejoy.com.br';

interface Result {
  url: string;
  status: number;
  timeMs: number;
  observation: string;
  error?: string;
}

async function fetchRoute(url: string): Promise<Result> {
  const start = Date.now();
  try {
    const res = await fetch(url, {
      redirect: 'manual',
      headers: { Accept: 'text/html' },
    });
    const timeMs = Date.now() - start;
    const ok = res.status >= 200 && res.status < 400;
    return {
      url,
      status: res.status,
      timeMs,
      observation: ok ? 'OK' : `HTTP ${res.status}`,
      error: res.status >= 400 ? `HTTP ${res.status}` : undefined,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      url,
      status: 0,
      timeMs: Date.now() - start,
      observation: 'FAIL',
      error: msg,
    };
  }
}

async function main() {
  const routes = [
    '/',
    '/search',
    '/favoritos',
    '/cart',
    '/p/l-teanine-200-mg-60-capsulas',
    '/p/l-teanina-200-mg-60-capsulas',
    '/p/5-htp-100-mg-60-capsulas',
    '/p/passiflora-200-mg-60-capsulas',
    '/p/ashwagandha-ginseng-indiano-500-mg-60-capsulas',
    '/p/ac-malico-magnesio-quelato-90-capsulas',
    '/c/sono',
    '/api/health',
    '/api/store-v2/search?q=teanina',
  ];

  console.log('== Auditoria Forense de Rotas ==');
  console.log(`Base: ${BASE}`);
  console.log(`Timestamp: ${new Date().toISOString()}\n`);

  const results: Result[] = [];
  for (const route of routes) {
    const r = await fetchRoute(`${BASE}${route}`);
    results.push(r);
    const icon = r.status >= 200 && r.status < 400 ? '✅' : r.status === 308 ? '↪️' : '❌';
    console.log(`${icon} ${r.status} ${r.timeMs}ms ${route} ${r.observation}`);
  }

  const failed = results.filter((r) => r.status >= 500 || r.error);
  const ok = results.filter((r) => r.status >= 200 && r.status < 400);
  const redirects = results.filter((r) => r.status === 301 || r.status === 308);

  console.log('\n== Resumo ==');
  console.log(`OK (2xx): ${ok.length}`);
  console.log(`Redirect (301/308): ${redirects.length}`);
  console.log(`Falhas (5xx/erro): ${failed.length}`);

  if (failed.length > 0) {
    console.log('\nFalhas:');
    failed.forEach((r) => console.log(`  ${r.url}: ${r.error || r.status}`));
    if (results.every((r) => r.status === 0 && r.error?.includes('fetch failed'))) {
      console.log('\n⚠️  Servidor não está rodando. Execute antes:');
      console.log('   pnpm dev   (ou pnpm start após build)');
      console.log('   Depois rode este script novamente.');
    }
    process.exit(1);
  }

  console.log('\n✅ Auditoria concluída — sem 500, sem erro de rede.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

export {};
