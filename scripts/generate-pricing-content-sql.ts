#!/usr/bin/env tsx
/**
 * Gera SQL UPDATE + rollback para preços e conteúdo do catálogo Store V2.
 * Uso: pnpm catalog:pricing:sql
 *
 * Entrada: data/store-v2/pricing-content-v1.csv
 * Se não existir, gera CSV a partir do catálogo com heurística de preço.
 *
 * Saída:
 * - scripts/generated/store-v2-pricing-content-update.sql
 * - scripts/generated/store-v2-pricing-content-rollback.sql
 */

import * as fs from 'fs';
import * as path from 'path';

const CATALOG_PATH = path.join(process.cwd(), 'data', 'catalogo_master_mejoy_seed_200.csv');
const PRICING_CSV_PATH = path.join(process.cwd(), 'data', 'store-v2', 'pricing-content-v1.csv');
const GENERATED_DIR = path.join(process.cwd(), 'scripts', 'generated');
const UPDATE_SQL_PATH = path.join(GENERATED_DIR, 'store-v2-pricing-content-update.sql');
const ROLLBACK_SQL_PATH = path.join(GENERATED_DIR, 'store-v2-pricing-content-rollback.sql');

// Faixas por formKey + packSize (mediana em centavos). Posicionamento médio.
const PRICE_BY_FORM: Record<string, { min: number; med: number; max: number }> = {
  topical: { min: 2900, med: 5590, max: 8900 },
  caps: { min: 3500, med: 6590, max: 14900 },
  powder: { min: 4500, med: 8590, max: 12900 },
  drops: { min: 3500, med: 6590, max: 9900 },
  cream: { min: 3900, med: 6590, max: 9900 },
  shampoo: { min: 3900, med: 6590, max: 8900 },
  sachet: { min: 4500, med: 7990, max: 11900 },
};

// Premium: topo da faixa. Médio: mediana. Baixo: abaixo da mediana.
const PREMIUM_INGREDIENTS = [
  'berberina', 'resveratrol', 'coenzima', 'ashwagandha', 'omega', 'probiotico',
  'ácido hialurônico', 'acido hialuronico', 'glucosamina', 'boswellia',
];
const LOW_INGREDIENTS = ['psyllium', 'inulina', 'boldo', 'alcachofra', 'óleo de hortelã', 'oleo de hortela'];

function parseCSV(content: string): Record<string, string>[] {
  const lines = content.split(/\r?\n/).filter((l) => l.length > 0);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map((h) => h.trim());
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

function roundPsych(cents: number): number {
  const rounded = Math.round(cents / 100) * 100;
  const lastTwo = rounded % 100;
  if (lastTwo === 0) return rounded - 10; // 9900 em vez de 10000
  return rounded;
}

function getPremiumScore(name: string, ingredients: string): number {
  const text = `${(name || '').toLowerCase()} ${(ingredients || '').toLowerCase()}`;
  if (PREMIUM_INGREDIENTS.some((p) => text.includes(p))) return 1.2;
  if (LOW_INGREDIENTS.some((p) => text.includes(p))) return 0.85;
  return 1;
}

function generatePrice(formKey: string, packSize: string, name: string, ingredients: string, requiresRx: boolean): number {
  const key = formKey.toLowerCase();
  const band = PRICE_BY_FORM[key] ?? PRICE_BY_FORM.caps;
  let base = band.med;
  const score = getPremiumScore(name, ingredients);
  base = Math.round(base * score);
  if (requiresRx) base = Math.min(base, band.med); // rx = mais competitivo
  base = Math.max(band.min, Math.min(band.max, base));
  return roundPsych(base);
}

function sanitizeBrand(s: string): string {
  return (s || '').replace(/Moonjoy/gi, 'Me Joy');
}

function escapeSql(s: string): string {
  return (s || '').replace(/'/g, "''").replace(/\\/g, '\\\\');
}

interface PricingRow {
  sku: string;
  priceCents: number;
  compareAtCents?: number | null; // opcional: "preço de" (riscado). Se vazio, não exibe desconto.
  shortBenefit: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
}

function generateFromCatalog(): PricingRow[] {
  const content = fs.readFileSync(CATALOG_PATH, 'utf-8');
  const rows = parseCSV(content);
  const result: PricingRow[] = [];
  for (const r of rows) {
    const sku = (r.sku || '').trim();
    const name = (r.name || '').trim();
    if (!sku || !name) continue;
    const formKey = (r.form_key || 'caps').toLowerCase();
    const packSize = r.pack_size_display || '';
    const ingredients = r.active_ingredients || '';
    const requiresRx = r.requires_rx === 'True';
    const objective = r.objective_primary || 'Saúde';
    const priceCents = generatePrice(formKey, packSize, name, ingredients, requiresRx);
    const shortBenefit = `Fórmula manipulada para apoiar ${objective.toLowerCase()}. Qualidade e entrega nacional.`;
    const description = `${name} é uma fórmula manipulada que pode contribuir para seu bem-estar. Composição: ${ingredients || 'conforme prescrição'}. Use conforme orientação do seu médico ou nutricionista. Manter em local seco, longe da luz. Consulte um profissional de saúde antes do uso.`;
    const seoTitle = sanitizeBrand(`${name} | Me Joy`);
    const seoDescription = sanitizeBrand(`${name}. Fórmula manipulada. Entrega em todo Brasil. Me Joy.`);
    result.push({ sku, priceCents, compareAtCents: null, shortBenefit, description, seoTitle, seoDescription });
  }
  return result;
}

function loadPricingCSV(): PricingRow[] {
  const content = fs.readFileSync(PRICING_CSV_PATH, 'utf-8');
  const rows = parseCSV(content);
  const result: PricingRow[] = [];
  for (const r of rows) {
    const sku = (r.sku || '').trim();
    if (!sku) continue;
    const priceCents = parseInt(r.priceCents || '9900', 10);
    const compareAtRaw = (r.compareAtCents ?? r.compare_at_cents ?? '').trim();
    const compareAtCents = compareAtRaw ? parseInt(compareAtRaw, 10) : null;
    const shortBenefit = sanitizeBrand(r.shortBenefit || '');
    const description = sanitizeBrand(r.description || '');
    const seoTitle = sanitizeBrand(r.seoTitle || '');
    const seoDescription = sanitizeBrand(r.seoDescription || '');
    result.push({
      sku,
      priceCents: priceCents > 0 ? roundPsych(priceCents) : 9900,
      compareAtCents: compareAtCents != null && compareAtCents > 0 ? compareAtCents : null,
      shortBenefit: shortBenefit || `Fórmula manipulada com qualidade. Entrega nacional.`,
      description: description || shortBenefit || `Fórmula manipulada. Use conforme orientação profissional.`,
      seoTitle: seoTitle || `${sku} | Me Joy`,
      seoDescription: seoDescription || `Fórmula manipulada. Entrega em todo Brasil. Me Joy.`,
    });
  }
  return result;
}

function main() {
  let rows: PricingRow[];
  if (fs.existsSync(PRICING_CSV_PATH)) {
    console.log('📂 Usando CSV existente:', PRICING_CSV_PATH);
    rows = loadPricingCSV();
  } else {
    console.log('📂 CSV não encontrado. Gerando a partir do catálogo (heurística)...');
    rows = generateFromCatalog();
    fs.mkdirSync(path.dirname(PRICING_CSV_PATH), { recursive: true });
    const csvHeader = 'sku,priceCents,nome,compareAtCents,shortBenefit,description,seoTitle,seoDescription';
    const csvLines = rows.map(
      (r) => {
        const nome = (r.seoTitle || '').replace(/\s*\|\s*Me Joy\s*$/i, '').trim();
        return `${r.sku},${r.priceCents},"${nome.replace(/"/g, '""')}",${r.compareAtCents ?? ''},"${(r.shortBenefit || '').replace(/"/g, '""')}","${(r.description || '').replace(/"/g, '""')}","${(r.seoTitle || '').replace(/"/g, '""')}","${(r.seoDescription || '').replace(/"/g, '""')}"`;
      }
    );
    fs.writeFileSync(PRICING_CSV_PATH, [csvHeader, ...csvLines].join('\n'));
    console.log('✅ CSV gerado:', PRICING_CSV_PATH);
  }

  if (rows.length === 0) {
    console.error('❌ Nenhuma linha para processar.');
    process.exit(1);
  }

  // Validar: nenhum priceCents = 0
  const zeroPrices = rows.filter((r) => r.priceCents <= 0);
  if (zeroPrices.length > 0) {
    console.error('❌ priceCents = 0 encontrado em:', zeroPrices.map((r) => r.sku).join(', '));
    process.exit(1);
  }

  // Validar: não todos iguais
  const uniquePrices = new Set(rows.map((r) => r.priceCents));
  if (uniquePrices.size === 1 && rows.length > 10) {
    console.error('❌ Todos os preços são iguais. Esperado: variação por formKey.');
    process.exit(1);
  }

  // Validar: Moonjoy
  const moonjoyRows = rows.filter(
    (r) =>
      /moonjoy/i.test(r.seoTitle) ||
      /moonjoy/i.test(r.seoDescription) ||
      /moonjoy/i.test(r.shortBenefit) ||
      /moonjoy/i.test(r.description)
  );
  if (moonjoyRows.length > 0) {
    console.error('❌ "Moonjoy" encontrado em:', moonjoyRows.map((r) => r.sku).join(', '));
    process.exit(1);
  }

  // Validar: compliance
  const forbidden = /cura|trata|reverte|garantido|100%\s*eficaz/i;
  const complianceViolations = rows.filter(
    (r) => forbidden.test(r.description) || forbidden.test(r.shortBenefit) || forbidden.test(r.seoDescription)
  );
  if (complianceViolations.length > 0) {
    console.error('❌ Compliance: palavras proibidas em:', complianceViolations.map((r) => r.sku).join(', '));
    process.exit(1);
  }

  fs.mkdirSync(GENERATED_DIR, { recursive: true });

  // UPDATE variants
  const variantUpdates = rows
    .map((r) => `  ('${escapeSql(r.sku)}', ${r.priceCents})`)
    .join(',\n');

  // UPDATE products (textos)
  const productUpdates = rows
    .map(
      (r) =>
        `  ('${escapeSql(r.sku)}', '${escapeSql(r.shortBenefit)}', '${escapeSql(r.description)}', '${escapeSql(r.seoTitle)}', '${escapeSql(r.seoDescription)}')`
    )
    .join(',\n');

  // compareAtCents: opcional. Atualiza store_v2_price_versions (preço "de" riscado).
  const rowsWithCompare = rows.filter((r) => r.compareAtCents != null && r.compareAtCents > r.priceCents);
  const compareUpdates =
    rowsWithCompare.length > 0
      ? rowsWithCompare
          .map((r) => `  ('${escapeSql(r.sku)}', ${r.compareAtCents})`)
          .join(',\n')
      : '';

  const updateSql = `-- Store V2: Atualização de preços e conteúdo (${rows.length} produtos)
-- Gerado por scripts/generate-pricing-content-sql.ts
-- Execute no Supabase SQL Editor APÓS o rollback (backup)

-- 1. Variantes (priceCents)
UPDATE store_v2_product_variants v
SET "priceCents" = c."priceCents"
FROM (VALUES
${variantUpdates}
) AS c(sku, "priceCents")
WHERE v.sku = c.sku;

-- 2. Produtos (shortBenefit, description, seoTitle, seoDescription)
UPDATE store_v2_products p
SET
  "shortBenefit" = c."shortBenefit",
  description = c.description,
  "seoTitle" = c."seoTitle",
  "seoDescription" = c."seoDescription"
FROM (VALUES
${productUpdates}
) AS c(sku, "shortBenefit", description, "seoTitle", "seoDescription")
WHERE p.sku = c.sku;
${
  compareUpdates
    ? `
-- 3. Price versions (compareAtCents = preço "de" riscado, opcional)
UPDATE store_v2_price_versions pv
SET "compareAtCents" = c."compareAtCents"
FROM (VALUES
${compareUpdates}
) AS c(sku, "compareAtCents")
JOIN store_v2_products p ON p.sku = c.sku
WHERE pv."productId" = p.id AND pv."validTo" IS NULL;
`
    : ''
}
`;

  // Rollback: volta para 9900 e texto genérico
  const rollbackSql = `-- Store V2: ROLLBACK de preços e conteúdo
-- Execute ANTES do update para ter backup, ou use este para reverter.
-- Restaura: priceCents=9900, textos genéricos, compareAtCents=NULL

-- 1. Variantes: todos para 9900
UPDATE store_v2_product_variants SET "priceCents" = 9900;

-- 2. Produtos: textos genéricos
UPDATE store_v2_products SET
  "shortBenefit" = 'Fórmula manipulada para apoiar seu objetivo com praticidade e recorrência.',
  description = NULL,
  "seoTitle" = name || ' | Me Joy',
  "seoDescription" = NULL;

-- 3. Price versions: remove preço "de" (riscado)
UPDATE store_v2_price_versions SET "compareAtCents" = NULL WHERE "validTo" IS NULL;
`;

  fs.writeFileSync(UPDATE_SQL_PATH, updateSql);
  fs.writeFileSync(ROLLBACK_SQL_PATH, rollbackSql);

  console.log('✅ SQL gerado:');
  console.log('   ', UPDATE_SQL_PATH);
  console.log('   ', ROLLBACK_SQL_PATH);
  console.log('   Produtos:', rows.length);
  console.log('   Preços únicos:', uniquePrices.size);
  console.log('   Faixa:', Math.min(...rows.map((r) => r.priceCents)) / 100, '-', Math.max(...rows.map((r) => r.priceCents)) / 100, 'R$');
}

try {
  main();
} catch (e) {
  console.error(e);
  process.exit(1);
}
