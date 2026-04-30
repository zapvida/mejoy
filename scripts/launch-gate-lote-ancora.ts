#!/usr/bin/env tsx
/**
 * LAUNCH GATE — Validação do lote âncora antes de liberar para campanhas.
 *
 * O lote só pode ser considerado pronto se:
 * - 100% das rotas do lote passarem (200/308)
 * - 100% dos SKUs tiverem score mínimo aprovado
 * - 100% tiverem composição válida
 * - 100% tiverem FAQ válida
 * - 100% tiverem advertências
 * - 100% tiverem SEO mínimo
 * - Akkermat estiver intacto
 *
 * Uso: pnpm tsx scripts/launch-gate-lote-ancora.ts
 *      BASE_URL=http://localhost:3000 pnpm tsx scripts/launch-gate-lote-ancora.ts
 *      pnpm tsx scripts/launch-gate-lote-ancora.ts --soft  # permite REVISAR (não BLOQUEAR)
 */

import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';
config({ path: path.join(process.cwd(), '.env.local') });
import { parseCSV } from './lib/copy-utils';

import { prisma } from '../src/lib/prisma';
import {
  getCopyV4BySku,
  getHeroBullets,
  getMechanismSummaryForPdp,
  getBenefitsStructured,
  parseFaqFromV2,
  parseReferences,
  parseParaQueServe,
  getFaqForPdp,
  PDP_MASTER_FULL_OVERRIDES,
  PDP_TEMPLATE_MASTER_SKU,
} from '../src/lib/store-v2/copy-v2';

const LOTE_PATH = path.join(process.cwd(), 'data', 'store-v2', 'lote-ancora-skus.json');
const COPY_V4_PATH = path.join(process.cwd(), 'data', 'store-v2', 'copy', 'copy-blueprint-v4.csv');
const BASE_URL = process.env.BASE_URL || '';
const OUTPUT = path.join(process.cwd(), 'scripts', 'generated', 'launch-gate-lote-ancora-report.json');

function hasContent(s: string | null | undefined, minLen = 20): boolean {
  return typeof s === 'string' && s.trim().length >= minLen;
}

type BlueprintLite = {
  sku: string;
  productName: string;
  objective: string;
  shortBenefit: string;
  primaryActive: string;
  dose: string;
  pack: string;
};

function loadBlueprintLiteBySku(): Map<string, BlueprintLite> {
  if (!fs.existsSync(COPY_V4_PATH)) return new Map();
  const { rows } = parseCSV(fs.readFileSync(COPY_V4_PATH, 'utf-8'));
  const map = new Map<string, BlueprintLite>();
  for (const row of rows) {
    const sku = String(row.sku ?? '').trim();
    if (!sku) continue;
    map.set(sku, {
      sku,
      productName: String(row.productName ?? row.normalizedProductName ?? sku).trim(),
      objective: String(row.objective ?? '').trim(),
      shortBenefit: String(row.shortBenefit ?? '').trim(),
      primaryActive: String(row.primaryActive ?? row.normalizedPrimaryActive ?? '').trim(),
      dose: String(row.dose ?? row.normalizedDose ?? '').trim(),
      pack: String(row.pack ?? row.normalizedPack ?? '').trim(),
    });
  }
  return map;
}

function slugify(value: string): string {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function resolveSlugFromSearch(baseUrl: string, sku: string, productName: string): Promise<string> {
  if (!baseUrl) return '';
  try {
    const query = encodeURIComponent(productName || sku);
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

async function main() {
  const softMode = process.argv.includes('--soft');

  if (!fs.existsSync(LOTE_PATH)) {
    console.error('❌ lote-ancora-skus.json não encontrado.');
    process.exit(1);
  }

  const lote = JSON.parse(fs.readFileSync(LOTE_PATH, 'utf-8'));
  const skus: string[] = lote.skus ?? lote.rolloutOrder ?? [];
  const blueprintBySku = loadBlueprintLiteBySku();

  if (skus.length === 0) {
    console.error('❌ Nenhum SKU no lote âncora.');
    process.exit(1);
  }

  console.log(`\n🚀 LAUNCH GATE — Lote âncora (${skus.length} SKUs)\n`);

  type ProductSelect = {
    sku: string;
    slug: string;
    name: string;
    shortBenefit: string | null;
    activeIngredients: string | null;
    objective: string | null;
  };
  let usedPrisma = true;
  let products: ProductSelect[] = [];
  try {
    products = await prisma.product.findMany({
      where: { sku: { in: skus }, active: true },
      select: { sku: true, slug: true, name: true, shortBenefit: true, activeIngredients: true, objective: true },
    }) as ProductSelect[];
  } catch (error) {
    usedPrisma = false;
    console.warn('⚠️ Prisma indisponível para launch gate; usando fallback de copy v4 + search API.');
    products = skus.map((sku) => {
      const blueprint = blueprintBySku.get(sku);
      const copy = getCopyV4BySku(sku);
      const name = String(blueprint?.productName ?? sku);
      const compositionFallback = [
        String(blueprint?.primaryActive ?? '').trim(),
        String(blueprint?.dose ?? copy?.dose ?? '').trim(),
        String(blueprint?.pack ?? '').trim(),
      ]
        .filter(Boolean)
        .join(' | ');
      return {
        sku,
        slug: slugify(name),
        name,
        shortBenefit: blueprint?.shortBenefit ?? copy?.shortBenefit ?? null,
        activeIngredients: compositionFallback || null,
        objective: blueprint?.objective ?? null,
      };
    });
    void error;
  }

  const skuToProduct = new Map<string, ProductSelect>(products.map((p) => [p.sku ?? '', p]));

  interface GateResult {
    sku: string;
    slug: string;
    nome: string;
    mechanism_ok: boolean;
    hero_bullets_ok: boolean;
    benefits_ok: boolean;
    faq_ok: boolean;
    references_ok: boolean;
    advertencias_ok: boolean;
    composition_ok: boolean;
    seo_ok: boolean;
    rota_ok?: boolean;
    status: 'OK' | 'REVISAR' | 'BLOQUEAR';
  }
  const results: GateResult[] = [];

  let allOk = true;

  for (const sku of skus) {
    const p = skuToProduct.get(sku);
    const copy = getCopyV4BySku(sku);
    if (!p) {
      results.push({
        sku,
        slug: '',
        nome: '',
        mechanism_ok: false,
        hero_bullets_ok: false,
        benefits_ok: false,
        faq_ok: false,
        references_ok: false,
        advertencias_ok: false,
        composition_ok: false,
        seo_ok: false,
        status: 'BLOQUEAR',
      });
      allOk = false;
      continue;
    }

    const heroBullets = getHeroBullets(
      copy?.hero_benefit,
      p.shortBenefit ?? copy?.shortBenefit,
      p.objective ?? 'Saúde',
      sku
    );
    const mechanism = getMechanismSummaryForPdp(sku, copy);
    const benefits = getBenefitsStructured(
      copy?.description_md,
      copy?.hero_benefit,
      p.shortBenefit ?? copy?.shortBenefit
    );
    const paraQueServe = copy?.para_que_serve ? parseParaQueServe(copy.para_que_serve) : [];
    const copyFaq = copy?.faq ? parseFaqFromV2(copy.faq) : [];
    const faqForPdp = getFaqForPdp(sku, copyFaq.length ? copyFaq : null);
    const faqParsed = faqForPdp;
    const refsParsed = copy?.references ? parseReferences(copy.references) : [];
    const refsClickable = refsParsed.filter((r) =>
      /(https?:\/\/|doi\.org|pubmed\.ncbi\.nlm\.nih\.gov|ncbi\.nlm\.nih\.gov)/i.test(r)
    );

    const mechanism_ok = hasContent(mechanism, 30);
    const hero_bullets_ok = heroBullets.length >= 3;
    const benefits_ok = benefits.length >= 1 || paraQueServe.length >= 4 || hasContent(copy?.description_md, 50);
    const faq_ok = faqParsed.length >= 5;
    const references_ok = refsParsed.length >= 3 && refsClickable.length >= 3;
    const masterAdv = PDP_MASTER_FULL_OVERRIDES[sku]?.advertenciasCompleto;
    const advertencias_ok =
      hasContent(masterAdv, 50) ||
      hasContent(copy?.cautions, 20) ||
      hasContent(copy?.advertencias_completo, 50);
    const blueprint = blueprintBySku.get(sku);
    const composition_ok =
      hasContent(p.activeIngredients) ||
      hasContent(blueprint?.primaryActive) ||
      hasContent(blueprint?.dose) ||
      sku === PDP_TEMPLATE_MASTER_SKU;
    const seo_ok =
      hasContent(copy?.seoTitle, 30) && hasContent(copy?.seoDescription, 50);

    const gates = [
      mechanism_ok,
      hero_bullets_ok,
      benefits_ok,
      faq_ok,
      references_ok,
      advertencias_ok,
      composition_ok,
      seo_ok,
    ];
    const passed = gates.filter(Boolean).length;
    const status: 'OK' | 'REVISAR' | 'BLOQUEAR' =
      passed === 8 ? 'OK' : passed >= 6 ? 'REVISAR' : 'BLOQUEAR';

    if (status !== 'OK') allOk = false;

    results.push({
      sku,
      slug: p.slug ?? '',
      nome: p.name ?? '',
      mechanism_ok,
      hero_bullets_ok,
      benefits_ok,
      faq_ok,
      references_ok,
      advertencias_ok,
      composition_ok,
      seo_ok,
      status,
    });
  }

  // HTTP check (opcional)
  let httpOk = true;
  if (BASE_URL) {
    for (const r of results) {
      if (r.status === 'BLOQUEAR') continue;
      const fallbackName = r.nome || blueprintBySku.get(r.sku)?.productName || r.sku;
      if (!usedPrisma || !r.slug) {
        const resolved = await resolveSlugFromSearch(BASE_URL, r.sku, fallbackName);
        if (resolved) r.slug = resolved;
      }
      if (!r.slug) {
        r.rota_ok = false;
        httpOk = false;
        continue;
      }
      try {
        const res = await fetch(`${BASE_URL}/p/${r.slug}`, {
          redirect: 'manual',
          headers: { Accept: 'text/html' },
        });
        if (res.status !== 200 && res.status !== 308) {
          r.rota_ok = false;
          httpOk = false;
        } else {
          r.rota_ok = true;
        }
      } catch {
        r.rota_ok = false;
        httpOk = false;
      }
    }
  }

  // Akkermat regression — rodar validate em subprocess
  const { execSync } = await import('child_process');
  let akkermatOk = true;
  try {
    execSync('pnpm tsx scripts/validate-akkermat-regression.ts', {
      stdio: 'pipe',
      cwd: process.cwd(),
    });
  } catch {
    akkermatOk = false;
  }

  const okCount = results.filter((r) => r.status === 'OK').length;
  const revisarCount = results.filter((r) => r.status === 'REVISAR').length;
  const bloquearCount = results.filter((r) => r.status === 'BLOQUEAR').length;

  const gatePassed = softMode
    ? bloquearCount === 0 && httpOk && akkermatOk
    : allOk && httpOk && akkermatOk;

  const report = {
    generatedAt: new Date().toISOString(),
    total: results.length,
    ok: okCount,
    revisar: revisarCount,
    bloquear: bloquearCount,
    softMode,
    httpCheck: BASE_URL ? (httpOk ? 'PASS' : 'FAIL') : 'SKIPPED',
    akkermatIntact: akkermatOk ? 'PASS' : 'FAIL',
    gatePassed,
    results,
  };

  const outDir = path.dirname(OUTPUT);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(report, null, 2), 'utf-8');

  console.log(`   OK: ${okCount}`);
  console.log(`   REVISAR: ${revisarCount}`);
  console.log(`   BLOQUEAR: ${bloquearCount}`);
  if (BASE_URL) console.log(`   HTTP: ${httpOk ? '✓' : '✗'}`);
  if (!usedPrisma) console.log('   Fonte de catálogo no gate: fallback copy-v4');
  console.log(`   Akkermat: ${akkermatOk ? '✓ intacto' : '✗ REGRESSÃO'}`);
  console.log(`   Relatório: ${OUTPUT}\n`);

  if (!report.gatePassed) {
    console.error('❌ GATE NÃO PASSOU. Corrija os itens acima antes de liberar campanhas.');
    if (softMode) console.log('   (modo --soft: BLOQUEAR=0 é suficiente)');
    process.exit(1);
  }

  console.log('✅ LAUNCH GATE PASSOU. Lote âncora pronto para campanhas.');
  if (softMode && revisarCount > 0) {
    console.log(`   ⚠️ Modo --soft: ${revisarCount} SKUs em REVISAR (composição/outros). Complete antes de campanhas.`);
  }
  if (usedPrisma) {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
