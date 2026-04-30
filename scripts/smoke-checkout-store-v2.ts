#!/usr/bin/env tsx
/**
 * Smoke técnico do checkout Store V2.
 * Valida rotas e APIs sem executar pagamento real.
 * Uso: BASE_URL=http://localhost:3000 pnpm tsx scripts/smoke-checkout-store-v2.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';
config({ path: path.join(process.cwd(), '.env.local') });
import { parseCSV } from './lib/copy-utils';

const BASE = process.env.BASE_URL || 'http://localhost:3000';
const LOTE_PATH = path.join(process.cwd(), 'data', 'store-v2', 'lote-ancora-skus.json');
const COPY_V4_PATH = path.join(process.cwd(), 'data', 'store-v2', 'copy', 'copy-blueprint-v4.csv');
const OUTPUT = path.join(process.cwd(), 'scripts', 'generated', 'smoke-checkout-report.json');

async function fetchCheck(url: string, opts?: RequestInit): Promise<{ status: number; ok: boolean; body?: string }> {
  try {
    const res = await fetch(url, {
      redirect: 'manual',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      ...opts,
    });
    const body = await res.text();
    return { status: res.status, ok: res.status >= 200 && res.status < 400, body };
  } catch (e) {
    return { status: 0, ok: false };
  }
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

async function main() {
  const results: Array<{ name: string; status: number; ok: boolean; note?: string }> = [];
  let failed = 0;

  console.log('\n🔍 Smoke Checkout Store V2 @', BASE);

  // 1. Health payments (503 = envs não configuradas, aceitável em local)
  const hp = await fetchCheck(`${BASE}/api/health/payments`);
  const hpOk = hp.status === 200 || hp.status === 503;
  results.push({ name: 'API Health Payments', status: hp.status, ok: hpOk, note: hp.status === 503 ? '503 = envs não configuradas' : undefined });
  if (!hpOk) failed++;
  console.log(hpOk ? '✅' : '❌', 'API Health Payments:', hp.status, hp.status === 503 ? '(envs)' : '');

  // 2. Cart GET (vazio)
  const cartGet = await fetchCheck(`${BASE}/api/store-v2/cart`, { method: 'GET' });
  results.push({ name: 'API Cart GET', status: cartGet.status, ok: cartGet.ok });
  if (!cartGet.ok) failed++;
  console.log(cartGet.ok ? '✅' : '❌', 'API Cart GET:', cartGet.status);

  // 3. Cart POST add item (requer slug válido)
  let sampleSlug = '';
  if (fs.existsSync(LOTE_PATH)) {
    const lote = JSON.parse(fs.readFileSync(LOTE_PATH, 'utf-8'));
    const skus = lote.skus ?? [];
    const nameBySku = loadProductNameBySku();
    try {
      const { prisma } = await import('../src/lib/prisma');
      const p = await prisma.product.findFirst({
        where: { sku: { in: skus }, active: true },
        select: { slug: true },
      });
      sampleSlug = p?.slug ?? '';
      await prisma.$disconnect();
    } catch {
      const firstSku = String(skus[0] ?? '');
      if (firstSku) {
        const nameHint = nameBySku.get(firstSku) ?? firstSku;
        sampleSlug = await resolveSlugFromSearch(BASE, firstSku, nameHint);
      }
    }
  }
  if (!sampleSlug) {
    const sampleResp = await fetch(`${BASE}/api/store-v2/catalog/sample-slug`);
    const sampleJson = await sampleResp.json().catch(() => ({}));
    sampleSlug = sampleJson?.slug ?? 'akkermat-150-mg-30-capsulas';
  }

  const sessionId = `smoke-${Date.now()}`;
  const cartPost = await fetchCheck(`${BASE}/api/store-v2/cart`, {
    method: 'POST',
    body: JSON.stringify({ productSlug: sampleSlug, quantity: 1 }),
    headers: { 'Content-Type': 'application/json', 'X-Session-Id': sessionId },
  });
  results.push({
    name: 'API Cart POST (add item)',
    status: cartPost.status,
    ok: cartPost.ok,
    note: cartPost.ok ? `slug: ${sampleSlug}` : undefined,
  });
  if (!cartPost.ok) failed++;
  console.log(cartPost.ok ? '✅' : '❌', 'API Cart POST add:', cartPost.status);

  // 4. Calculate shipping (POST com body)
  const shipResp = await fetchCheck(`${BASE}/api/store-v2/checkout/calculate-shipping`, {
    method: 'POST',
    body: JSON.stringify({ cep: '01310100', subtotalCents: 5000 }),
    headers: { 'Content-Type': 'application/json' },
  });
  results.push({ name: 'API Calculate Shipping', status: shipResp.status, ok: shipResp.ok });
  if (!shipResp.ok) failed++;
  console.log(shipResp.ok ? '✅' : '❌', 'API Calculate Shipping:', shipResp.status);

  // 5. Create payment — dry run (sem dados reais, esperamos 400)
  const createResp = await fetchCheck(`${BASE}/api/store-v2/create-payment`, {
    method: 'POST',
    body: JSON.stringify({
      nome: 'Teste Smoke',
      email: 'smoke@test.local',
      telefone: '11999999999',
      cartId: 'smoke-test-cart-id',
      paymentMethod: 'PIX',
    }),
    headers: { 'Content-Type': 'application/json' },
  });
  const createOk = createResp.status === 200 || createResp.status === 400;
  results.push({
    name: 'API Create Payment (dry)',
    status: createResp.status,
    ok: createOk,
    note: createResp.status === 400 ? '400 esperado (cart inválido)' : createResp.status === 200 ? '200 = pagamento criado' : 'erro',
  });
  if (!createOk) failed++;
  console.log(createOk ? '✅' : '❌', 'API Create Payment:', createResp.status, createResp.status === 400 ? '(validação OK)' : '');

  // 6. Páginas
  const pages = [
    { name: 'Checkout page', url: `${BASE}/checkout` },
    { name: 'Checkout success', url: `${BASE}/checkout/sucesso` },
  ];
  for (const p of pages) {
    const r = await fetchCheck(p.url);
    results.push({ name: p.name, status: r.status, ok: r.ok });
    if (!r.ok) failed++;
    console.log(r.ok ? '✅' : '❌', p.name + ':', r.status);
  }

  const report = {
    generatedAt: new Date().toISOString(),
    baseUrl: BASE,
    total: results.length,
    ok: results.filter((r) => r.ok).length,
    failed,
    passed: failed === 0,
    results,
  };

  const outDir = path.dirname(OUTPUT);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(report, null, 2), 'utf-8');

  console.log('\n   Report:', OUTPUT);
  if (failed > 0) {
    console.error('\n❌ Smoke Checkout FAILED');
    process.exit(1);
  }
  console.log('\n✅ Smoke Checkout PASSED');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
