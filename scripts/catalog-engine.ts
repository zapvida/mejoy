#!/usr/bin/env tsx
/**
 * Catalog Engine — valida, normaliza, gera SQL apply/rollback e report.
 * Uso: pnpm catalog:dry (--dry-run) | pnpm catalog:sql
 */

import * as fs from 'fs';
import * as path from 'path';

const CATALOG_PATH = path.join(process.cwd(), 'data', 'store-v2', 'catalogo_mejoy_validado_v2.csv');
const PRICING_PATH = path.join(process.cwd(), 'data', 'store-v2', 'pricing-content-v3-validado.csv');
const GENERATED_DIR = path.join(process.cwd(), 'scripts', 'generated');
const APPLY_SQL = path.join(GENERATED_DIR, 'catalog-apply.sql');
const ROLLBACK_SQL = path.join(GENERATED_DIR, 'catalog-rollback.sql');
const REPORT_JSON = path.join(GENERATED_DIR, 'catalog-report.json');

const FORMS_ALLOWED = ['caps', 'powder', 'topical', 'sachet', 'drops', 'cream', 'shampoo'];
const NICHE_TO_OBJECTIVE: Record<string, string> = {
  'Ansiedade e Estresse': 'Ansiedade & Humor',
  Articulação: 'Articulações',
  Capilar: 'Cabelo',
  Emagrecimento: 'Emagrecimento & Metabolismo',
  'Hepato Detox': 'Detox & Fígado',
  Imunidade: 'Imunidade',
  Intestino: 'Intestino',
  'Libido e Disposição': 'Hormonal & Libido',
  Lipedema: 'Lipedema',
  'Menopausa/TPM': 'Menopausa & TPM',
  Sono: 'Sono',
};
const SENSITIVE_BASE_NAMES = ['Tadalafila', 'Orlistat', 'Minoxidil', 'MINOXDIL'];

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') inQuotes = !inQuotes;
    else if (c === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else if (c !== '\n' && c !== '\r') current += c;
  }
  result.push(current.trim());
  return result;
}

function parseCSV(content: string): Record<string, string>[] {
  const lines = content.split(/\r?\n/).filter((l) => l.length > 0);
  if (lines.length < 2) return [];
  const headers = parseCSVLine(lines[0]);
  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((h, j) => {
      row[h] = values[j] ?? '';
    });
    rows.push(row);
  }
  return rows;
}

function collapseSpaces(s: string): string {
  return (s || '').replace(/\s{2,}/g, ' ').trim();
}

function fixBaseNameForSlug(s: string): string {
  return collapseSpaces(
    (s || '')
      .replace(/\bASWHAGANDA\b/gi, 'Ashwagandha')
      .replace(/\bINDIANDO\b/gi, 'Indiano')
  );
}

function normalizeSlugPart(s: string): string {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function slugFromRow(base: string, dose: string, pack: string, sku: string, used: Set<string>): string {
  const parts = [normalizeSlugPart(base), normalizeSlugPart(dose), normalizeSlugPart(pack)].filter(Boolean);
  let s = parts.join('-') || sku.toLowerCase();
  let final = s;
  let n = 0;
  while (used.has(final)) {
    n++;
    final = `${s}-${n}`;
  }
  used.add(final);
  return final;
}

function escapeSql(s: string): string {
  return (s || '').replace(/'/g, "''");
}

function fail(msg: string): never {
  console.error('❌', msg);
  process.exit(1);
}

interface MergedRow {
  sku: string;
  slug: string;
  name: string;
  objective: string;
  formKey: string;
  packSizeDisplay: string;
  priceCents: number;
  shortBenefit: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  requiresRx: boolean;
  whatsappFlow: string;
}

function main() {
  const dryRun = process.argv.includes('--dry-run');

  if (!fs.existsSync(CATALOG_PATH)) fail(`Catálogo não encontrado: ${CATALOG_PATH}`);
  if (!fs.existsSync(PRICING_PATH)) fail(`Pricing validado não encontrado: ${PRICING_PATH}`);

  const catalog = parseCSV(fs.readFileSync(CATALOG_PATH, 'utf-8'));
  const pricing = parseCSV(fs.readFileSync(PRICING_PATH, 'utf-8'));

  const pricingBySku = new Map<string, Record<string, string>>();
  for (const r of pricing) {
    const sku = r.sku?.trim();
    if (sku) pricingBySku.set(sku, r);
  }

  const catalogSkus = new Set(catalog.map((r) => r.sku?.trim()).filter(Boolean));
  if (catalog.length !== 162) fail(`Catálogo deve ter 162 linhas, tem ${catalog.length}`);

  const skuSet = new Set<string>();
  const slugUsed = new Set<string>();
  const errors: string[] = [];
  const merged: MergedRow[] = [];
  const sensitive: string[] = [];

  for (const cat of catalog) {
    const sku = cat.sku?.trim();
    if (!sku) continue;
    if (skuSet.has(sku)) errors.push(`SKU duplicado: ${sku}`);
    skuSet.add(sku);

    const niche = cat.niche?.trim();
    const objective = NICHE_TO_OBJECTIVE[niche ?? ''];
    if (!objective) errors.push(`Niche não mapeado: "${niche}" (SKU ${sku})`);

    const formKey = (cat.form_key || 'caps').toLowerCase();
    if (!FORMS_ALLOWED.includes(formKey)) errors.push(`formKey inválido: ${formKey} (SKU ${sku})`);

    const priceCents = parseInt(cat.priceCents ?? '0', 10);
    if (priceCents <= 0) errors.push(`priceCents <= 0: ${sku}`);
    if (priceCents === 9900) errors.push(`priceCents = 9900 (mock): ${sku}`);

    const priceRow = pricingBySku.get(sku);
    const seoDesc = priceRow?.seoDescription ?? '';
    if (seoDesc.length > 155) errors.push(`seoDescription > 155: ${sku} (${seoDesc.length})`);

    const base = fixBaseNameForSlug(cat.base_name?.trim() ?? '');
    const dose = cat.dose?.trim() ?? '';
    const pack = cat.pack?.trim() ?? '';
    const slug = slugFromRow(base, dose, pack, sku, slugUsed);

    const name = priceRow?.nome ?? cat.name ?? '';
    const isSensitive =
      SENSITIVE_BASE_NAMES.some((b) => base.toUpperCase().includes(b.toUpperCase())) ||
      name.toUpperCase().includes('TADALAFILA') ||
      name.toUpperCase().includes('ORLISTAT') ||
      name.toUpperCase().includes('MINOXIDIL');
    if (isSensitive) sensitive.push(sku);

    merged.push({
      sku,
      slug,
      name,
      objective: objective ?? niche ?? '',
      formKey,
      packSizeDisplay: pack || '—',
      priceCents,
      shortBenefit: priceRow?.shortBenefit ?? '',
      description: priceRow?.description ?? '',
      seoTitle: priceRow?.seoTitle ?? `${name} | MeJoy`,
      seoDescription: seoDesc,
      requiresRx: isSensitive,
      whatsappFlow: isSensitive ? 'rx_upload' : 'none',
    });
  }

  // Validação: slugs não podem conter typos conhecidos
  const SLUG_FORBIDDEN = ['aswhaganda', 'indiando', 'aswhag', 'indiand'];
  for (const r of merged) {
    const slugLower = r.slug.toLowerCase();
    for (const bad of SLUG_FORBIDDEN) {
      if (slugLower.includes(bad)) {
        errors.push(`Slug com typo: ${r.slug} (SKU ${r.sku})`);
        break;
      }
    }
  }

  if (errors.length > 0) {
    errors.forEach((e) => console.error('❌', e));
    fail(`${errors.length} erro(s) de validação`);
  }

  fs.mkdirSync(GENERATED_DIR, { recursive: true });

  const applyParts: string[] = [
    '-- Catalog Apply: INSERT MEJOY-* + soft-disable MJOY-*',
    'BEGIN;',
    '',
    '-- 1) Soft-disable MJOY-*',
    "UPDATE store_v2_products SET active = false, status = 'draft' WHERE sku LIKE 'MJOY-%';",
    '',
    '-- 2) INSERT MEJOY-* products',
  ];

  for (const r of merged) {
    applyParts.push(`INSERT INTO store_v2_products (
  id, sku, slug, name, "shortName", description, "shortBenefit", "activeIngredients", "formDisplay", "formKey", "packSizeDisplay",
  objective, category, "requiresRx", "requiresValidation", "canSubscribe", "subscribeDiscountPct", "subscriptionPlanDefault",
  "leadTimeDays", "shippingClass", "seoTitle", "seoDescription", tags, "whatsappFlow", "builderTemplateId", "upsellParametrizado",
  "priorityRank", status, active, images, badges, "createdAt", "updatedAt"
) VALUES (
  gen_random_uuid()::text,
  '${escapeSql(r.sku)}',
  '${escapeSql(r.slug)}',
  '${escapeSql(r.name)}',
  NULL,
  '${escapeSql(r.description)}',
  '${escapeSql(r.shortBenefit)}',
  NULL,
  NULL,
  '${escapeSql(r.formKey)}',
  '${escapeSql(r.packSizeDisplay)}',
  '${escapeSql(r.objective)}',
  NULL,
  ${r.requiresRx},
  ${r.requiresRx},
  true,
  10,
  'MENSAL',
  2,
  'PADRAO',
  '${escapeSql(r.seoTitle)}',
  '${escapeSql(r.seoDescription)}',
  '{}',
  '${escapeSql(r.whatsappFlow)}',
  NULL,
  false,
  0,
  'active',
  true,
  '{}',
  '{}',
  NOW(),
  NOW()
) ON CONFLICT (sku) DO UPDATE SET
  "shortBenefit" = EXCLUDED."shortBenefit",
  description = EXCLUDED.description,
  "seoTitle" = EXCLUDED."seoTitle",
  "seoDescription" = EXCLUDED."seoDescription",
  status = 'active',
  active = true,
  "updatedAt" = NOW();`);
  }

  applyParts.push('');
  applyParts.push('-- 3) INSERT variants (usa productId do produto recém-inserido)');
  for (const r of merged) {
    applyParts.push(`INSERT INTO store_v2_product_variants (id, "productId", sku, name, "priceCents", stock)
SELECT gen_random_uuid()::text, p.id, '${escapeSql(r.sku)}', '${escapeSql(r.packSizeDisplay)}', ${r.priceCents}, 0
FROM store_v2_products p WHERE p.sku = '${escapeSql(r.sku)}'
ON CONFLICT (sku) DO NOTHING;`);
  }

  applyParts.push('');
  applyParts.push('COMMIT;');

  const rollbackParts: string[] = [
    '-- Catalog Rollback: reativar MJOY-* + remover MEJOY-*',
    'BEGIN;',
    '',
    '-- 1) Remover variantes MEJOY-*',
    "DELETE FROM store_v2_product_variants WHERE sku LIKE 'MEJOY-%';",
    '',
    '-- 2) Remover produtos MEJOY-*',
    "DELETE FROM store_v2_products WHERE sku LIKE 'MEJOY-%';",
    '',
    "-- 3) Reativar MJOY-*",
    "UPDATE store_v2_products SET active = true, status = 'active' WHERE sku LIKE 'MJOY-%';",
    '',
    'COMMIT;',
  ];

  fs.writeFileSync(APPLY_SQL, applyParts.join('\n'), 'utf-8');
  fs.writeFileSync(ROLLBACK_SQL, rollbackParts.join('\n'), 'utf-8');

  let slugDiffs: { sku: string; oldSlug: string; newSlug: string }[] = [];
  if (fs.existsSync(REPORT_JSON)) {
    try {
      const prev = JSON.parse(fs.readFileSync(REPORT_JSON, 'utf-8'));
      const prevBySku = new Map<string, string>((prev.slugs || []).map((s: { sku: string; slug: string }) => [s.sku, s.slug]));
      slugDiffs = merged
        .filter((r) => prevBySku.get(r.sku) && prevBySku.get(r.sku) !== r.slug)
        .map((r) => ({ sku: r.sku, oldSlug: prevBySku.get(r.sku)!, newSlug: r.slug }))
        .slice(0, 30);
    } catch {
      // ignore
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    dryRun,
    counts: {
      mejoyActive: merged.length,
      mjoyInactive: 0,
      slugDiffsCount: slugDiffs.length,
    },
    extrasRemoved: pricing.length - catalog.length > 0 ? pricing.length - catalog.length : 0,
    sensitive: sensitive,
    slugs: merged.map((r) => ({ sku: r.sku, slug: r.slug })),
    slugDiffsTop30: slugDiffs,
  };

  fs.writeFileSync(REPORT_JSON, JSON.stringify(report, null, 2), 'utf-8');

  console.log('✅ Catalog Engine');
  console.log(`   Apply:  ${APPLY_SQL}`);
  console.log(`   Rollback: ${ROLLBACK_SQL}`);
  console.log(`   Report: ${REPORT_JSON}`);
  console.log(`   MEJOY: ${merged.length} | Sensíveis: ${sensitive.length}`);
  if (dryRun) console.log('   (dry-run: SQL gerado, não aplicado)');
}

main();
