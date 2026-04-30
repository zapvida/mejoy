#!/usr/bin/env tsx
/**
 * Smoke Launch — validação HTTP para soft launch.
 * Home, busca, favoritos, cart, PDPs âncora, APIs Store V2.
 * Uso: BASE_URL=http://localhost:3000 pnpm tsx scripts/smoke-launch.ts
 *      BASE_URL=https://www.mejoy.com.br pnpm tsx scripts/smoke-launch.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';
config({ path: path.join(process.cwd(), '.env.local') });
import { parseCSV } from './lib/copy-utils';

const BASE = process.env.BASE_URL || 'http://localhost:3000';
const LOTE_PATH = path.join(process.cwd(), 'data', 'store-v2', 'lote-ancora-skus.json');
const COPY_V4_PATH = path.join(process.cwd(), 'data', 'store-v2', 'copy', 'copy-blueprint-v4.csv');
const OUTPUT = path.join(process.cwd(), 'scripts', 'generated', 'smoke-launch-report.json');

interface CheckResult {
  name: string;
  url: string;
  status: number;
  ok: boolean;
  ms?: number;
  error?: string;
}

async function resolveSlugFromSearch(baseUrl: string, sku: string, nameHint: string): Promise<string> {
  try {
    const query = encodeURIComponent(nameHint || sku);
    const res = await fetch(`${baseUrl}/api/store-v2/search?q=${query}`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return '';
    const json = (await res.json()) as { results?: Array<{ sku?: string; slug?: string }> };
    const results = Array.isArray(json.results) ? json.results : [];
    const exact = results.find((r) => String(r.sku ?? '').toUpperCase() === sku.toUpperCase());
    if (exact?.slug) return exact.slug;
    return results[0]?.slug ?? '';
  } catch {
    return '';
  }
}

function loadProductNameBySku(): Map<string, string> {
  if (!fs.existsSync(COPY_V4_PATH)) return new Map();
  const { rows } = parseCSV(fs.readFileSync(COPY_V4_PATH, 'utf-8'));
  const map = new Map<string, string>();
  for (const row of rows) {
    const sku = String(row.sku ?? '').trim();
    if (!sku) continue;
    map.set(sku, String(row.productName ?? row.normalizedProductName ?? sku).trim());
  }
  return map;
}

async function fetchCheck(url: string, opts?: RequestInit): Promise<{ status: number; ms: number }> {
  let lastMs = 0;
  for (let attempt = 0; attempt < 2; attempt++) {
    const start = Date.now();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const res = await fetch(url, {
        redirect: 'manual',
        headers: { Accept: 'text/html,application/json' },
        signal: controller.signal,
        ...opts,
      });
      clearTimeout(timeout);
      return { status: res.status, ms: Date.now() - start };
    } catch {
      clearTimeout(timeout);
      lastMs = Date.now() - start;
      if (attempt === 0) {
        await new Promise((resolve) => setTimeout(resolve, 700));
      }
    }
  }
  return { status: 0, ms: lastMs };
}

async function main() {
  const results: CheckResult[] = [];
  let failed = 0;

  const checks: Array<{ name: string; url: string; method?: string; expect?: number[] }> = [
    { name: 'Home', url: `${BASE}/` },
    { name: 'Search', url: `${BASE}/search` },
    { name: 'Favoritos', url: `${BASE}/favoritos` },
    { name: 'Cart', url: `${BASE}/cart` },
    { name: 'Checkout', url: `${BASE}/checkout` },
    { name: 'API Health', url: `${BASE}/api/health` },
    { name: 'API Health Store V2', url: `${BASE}/api/health/store-v2` },
    { name: 'API Health Catalog', url: `${BASE}/api/health/catalog` },
    { name: 'API Cart GET', url: `${BASE}/api/store-v2/cart`, method: 'GET' },
    { name: 'API Search', url: `${BASE}/api/store-v2/search?q=akkermat` },
  ];

  for (const c of checks) {
    const { status, ms } = await fetchCheck(c.url, c.method ? { method: c.method } : undefined);
    const expect = c.expect ?? [200, 301, 302, 308];
    const ok = expect.includes(status) || (status >= 200 && status < 400);
    if (!ok) failed++;
    results.push({
      name: c.name,
      url: c.url,
      status,
      ok,
      ms,
    });
  }

  // PDPs lote âncora
  let loteSlugs: string[] = [];
  if (fs.existsSync(LOTE_PATH)) {
    const lote = JSON.parse(fs.readFileSync(LOTE_PATH, 'utf-8'));
    const skus = lote.skus ?? lote.rolloutOrder ?? [];
    const nameBySku = loadProductNameBySku();
    try {
      const { prisma } = await import('../src/lib/prisma');
      const products = await prisma.product.findMany({
        where: { sku: { in: skus }, active: true },
        select: { slug: true },
      });
      loteSlugs = products.map((p) => p.slug).filter(Boolean) as string[];
      await prisma.$disconnect();
    } catch {
      // Fallback sem banco local: resolve slug via API de busca + copy local.
      for (const sku of skus) {
        const nameHint = nameBySku.get(sku) ?? String(sku);
        const slug = await resolveSlugFromSearch(BASE, sku, nameHint);
        if (slug) loteSlugs.push(slug);
      }
      loteSlugs = Array.from(new Set(loteSlugs));
    }
  }

  const pdpResults: CheckResult[] = [];
  const pdpLimit = process.env.PDP_LIMIT ? parseInt(process.env.PDP_LIMIT, 10) : 6;
  for (const slug of loteSlugs.slice(0, pdpLimit)) {
    const url = `${BASE}/p/${slug}`;
    const { status, ms } = await fetchCheck(url);
    const ok = status === 200 || status === 301 || status === 308;
    if (!ok) failed++;
    pdpResults.push({ name: `PDP ${slug}`, url, status, ok, ms });
  }
  results.push(...pdpResults);

  const outDir = path.dirname(OUTPUT);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const report = {
    generatedAt: new Date().toISOString(),
    baseUrl: BASE,
    total: results.length,
    ok: results.filter((r) => r.ok).length,
    failed,
    passed: failed === 0,
    results,
  };
  fs.writeFileSync(OUTPUT, JSON.stringify(report, null, 2), 'utf-8');

  console.log('\n🔍 Smoke Launch @', BASE);
  console.log('   OK:', report.ok, '| Failed:', failed);
  for (const r of results) {
    const icon = r.ok ? '✅' : '❌';
    console.log(`   ${icon} ${r.name}: ${r.status} (${r.ms ?? 0}ms)`);
  }
  console.log('   Report:', OUTPUT);
  if (failed > 0) {
    console.error('\n❌ Smoke Launch FAILED');
    process.exit(1);
  }
  console.log('\n✅ Smoke Launch PASSED');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
