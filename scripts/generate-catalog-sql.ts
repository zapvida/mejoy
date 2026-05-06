#!/usr/bin/env tsx
/**
 * Gera SQL para importar catálogo Store V2 (copiar no Supabase SQL Editor)
 * Uso: pnpm tsx scripts/generate-catalog-sql.ts
 * Preço seed: R$ 99 quando CSV não tem preço (definir PRICE_CENTS=9900)
 */

import * as fs from 'fs';
import * as path from 'path';

const FORMS_ALLOWED = ['caps', 'powder', 'topical', 'sachet', 'drops', 'cream', 'shampoo'];
const WHATSAPP_FLOWS = ['none', 'rx_upload'];

const PRICE_CENTS = parseInt(process.env.PRICE_CENTS || '9900', 10); // R$ 99 padrão

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

function normalizeSlug(slug: string, sku: string, used: Set<string>): string {
  let s = slug
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  if (!s) s = sku.toLowerCase().replace(/\s+/g, '-');
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

function toPgArray(arr: string[]): string {
  if (arr.length === 0) return "'{}'";
  return `ARRAY[${arr.map((t) => `'${escapeSql(t)}'`).join(',')}]::text[]`;
}

async function main() {
  const csvPath = path.join(process.cwd(), 'data', 'catalogo_master_mejoy_seed_200.csv');
  if (!fs.existsSync(csvPath)) {
    console.error('CSV não encontrado:', csvPath);
    process.exit(1);
  }

  const content = fs.readFileSync(csvPath, 'utf-8');
  const rows = parseCSV(content);
  const slugUsed = new Set<string>();

  const products: string[] = [];
  const variants: string[] = [];
  const prices: string[] = [];

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const sku = (r.sku || '').trim();
    const name = (r.name || '').trim();
    const objective = (r.objective_primary || '').trim();
    const formKey = ((r.form_key || 'caps').toLowerCase());
    const whatsappFlow = ((r.whatsapp_flow || 'none').toLowerCase());

    if (!sku || !name || !objective) continue;
    if (!FORMS_ALLOWED.includes(formKey)) continue;
    if (!WHATSAPP_FLOWS.includes(whatsappFlow)) continue;

    const slug = normalizeSlug(r.seo_slug || '', sku, slugUsed);
    const priceCents = PRICE_CENTS;
    const status = 'active';
    const tags = (r.tags || '')
      .split(';')
      .map((t) => t.replace(/&/g, '-').trim())
      .filter(Boolean);
    const seoTitle = (r.seo_title || name).replace(/MeJoy/gi, 'MeJoy');
    const requiresRx = r.requires_rx === 'True';
    const requiresValidation = r.requires_validation === 'True';
    const canSubscribe = r.can_subscribe !== 'False';
    const subscribeDiscountPct = parseInt(r.subscription_discount_pct || '10', 10);
    const leadTimeDays = parseInt(r.lead_time_days || '2', 10);
    const priorityRank = parseInt(r.priority_rank || '0', 10);
    const upsellParametrizado = r.upsell_parametrizado === 'True';

    // ID determinístico por SKU para referência entre tabelas
    const productId = `'c' || substr(md5('mejoy-' || '${escapeSql(sku)}'), 1, 24)`;

    const now = "NOW()";
    products.push(`(
  ${productId},
  '${escapeSql(sku)}',
  '${escapeSql(slug)}',
  '${escapeSql(name)}',
  '${escapeSql(name)}',
  NULL,
  '${escapeSql(r.short_benefit || '')}',
  '${escapeSql(r.active_ingredients || '')}',
  '${escapeSql(r.form_display || '')}',
  '${escapeSql(formKey)}',
  '${escapeSql(r.pack_size_display || '')}',
  '${escapeSql(objective)}',
  ${r.category_nav ? `'${escapeSql(r.category_nav)}'` : 'NULL'},
  ${requiresRx},
  ${requiresValidation},
  ${canSubscribe},
  ${subscribeDiscountPct},
  '${escapeSql(r.subscription_plan_default || 'MENSAL')}',
  ${leadTimeDays},
  '${escapeSql(r.shipping_class || 'PADRAO')}',
  '${escapeSql(seoTitle)}',
  NULL,
  ${toPgArray(tags)},
  '${escapeSql(whatsappFlow)}',
  '${escapeSql(r.builder_template_id || '')}',
  ${upsellParametrizado},
  ${priorityRank},
  '${status}',
  true,
  '{}',
  '{}',
  ${now},
  ${now}
)`);

    variants.push(`(
  'c' || substr(md5('v-' || '${escapeSql(sku)}'), 1, 24),
  ${productId},
  '${escapeSql(sku)}',
  '${escapeSql(r.pack_size_display || '')}',
  ${priceCents},
  0
)`);

    prices.push(`(
  'c' || substr(md5('pv-' || '${escapeSql(sku)}'), 1, 24),
  ${productId},
  ${priceCents},
  NULL,
  ${now},
  NULL
)`);
  }

  const sql = `-- Catálogo Store V2 — gerado por scripts/generate-catalog-sql.ts
-- PRICE_CENTS=${PRICE_CENTS} (R$ ${(PRICE_CENTS / 100).toFixed(2)})
-- Execute no Supabase SQL Editor: https://supabase.com/dashboard/project/xbfhvepljmcaztpjbryn/sql/new

-- 1) Produtos (IGNORE conflitos de sku/slug para reexecução)
INSERT INTO store_v2_products (
  id, sku, slug, name, "shortName", description, "shortBenefit", "activeIngredients",
  "formDisplay", "formKey", "packSizeDisplay", objective, category, "requiresRx", "requiresValidation",
  "canSubscribe", "subscribeDiscountPct", "subscriptionPlanDefault", "leadTimeDays", "shippingClass",
  "seoTitle", "seoDescription", tags, "whatsappFlow", "builderTemplateId", "upsellParametrizado",
  "priorityRank", status, active, images, badges, "createdAt", "updatedAt"
) VALUES
${products.join(',\n')}
ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  "shortBenefit" = EXCLUDED."shortBenefit",
  "activeIngredients" = EXCLUDED."activeIngredients",
  "formDisplay" = EXCLUDED."formDisplay",
  "formKey" = EXCLUDED."formKey",
  "packSizeDisplay" = EXCLUDED."packSizeDisplay",
  objective = EXCLUDED.objective,
  category = EXCLUDED.category,
  status = EXCLUDED.status,
  "updatedAt" = NOW();

-- 2) Variantes (UPSERT por sku)
INSERT INTO store_v2_product_variants (id, "productId", sku, name, "priceCents", stock)
SELECT v.id, p.id, v.sku, v.name, v."priceCents", v.stock
FROM (VALUES
${variants.map((v) => v.replace(/\$\{productId\}/g, "p.id")).join(',\n')}
) AS v(id, pid, sku, name, "priceCents", stock)
JOIN store_v2_products p ON p.sku = SUBSTRING(v.sku FROM 1 FOR LENGTH(v.sku))
ON CONFLICT (sku) DO UPDATE SET "priceCents" = EXCLUDED."priceCents";

-- 3) Price versions (apenas se não existir)
INSERT INTO store_v2_price_versions ("productId", "priceCents", "compareAtCents", "validFrom")
SELECT p.id, ${PRICE_CENTS}, NULL, NOW()
FROM store_v2_products p
WHERE NOT EXISTS (SELECT 1 FROM store_v2_price_versions pv WHERE pv."productId" = p.id);
`;

  // O ON CONFLICT e VALUES precisam de sintaxe correta. O problema é que usei productId como expressão
  // Vou simplificar: usar subquery para pegar o id do produto por sku
  // Na verdade o INSERT de variants precisa do productId real. Vou refazer:
  // Para variants: INSERT ... SELECT ... FROM store_v2_products onde sku = X
  // Assim não precisamos de IDs determinísticos nas variantes.

  // Refazendo de forma mais simples - sem dependência entre INSERTs com expressões complexas
  const sqlSimple = `-- Catálogo Store V2 — execute no Supabase SQL Editor
-- URL: https://supabase.com/dashboard/project/xbfhvepljmcaztpjbryn/sql/new

-- Limpar se quiser reimportar (CUIDADO: apaga tudo)
-- TRUNCATE store_v2_price_versions, store_v2_product_variants, store_v2_products CASCADE;

-- Inserir produtos (ON CONFLICT faz update)
INSERT INTO store_v2_products (
  id, sku, slug, name, "shortName", description, "shortBenefit", "activeIngredients",
  "formDisplay", "formKey", "packSizeDisplay", objective, category, "requiresRx", "requiresValidation",
  "canSubscribe", "subscribeDiscountPct", "subscriptionPlanDefault", "leadTimeDays", "shippingClass",
  "seoTitle", "seoDescription", tags, "whatsappFlow", "builderTemplateId", "upsellParametrizado",
  "priorityRank", status, active, images, badges, "createdAt", "updatedAt"
) VALUES
${products.join(',\n')}
ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name, slug = EXCLUDED.slug, "shortBenefit" = EXCLUDED."shortBenefit",
  "activeIngredients" = EXCLUDED."activeIngredients", "formDisplay" = EXCLUDED."formDisplay",
  "formKey" = EXCLUDED."formKey", "packSizeDisplay" = EXCLUDED."packSizeDisplay",
  objective = EXCLUDED.objective, category = EXCLUDED.category, status = EXCLUDED.status,
  "updatedAt" = NOW();
`;

  const productsFixed = products.map((p) => {
    return p.replace(/\$\{productId\}/g, () => {
      // Cada product tem um sku - o productId é 'c'||substr(md5('mejoy-'||sku),1,24)
      // Mas no VALUES não podemos referenciar outra coluna. Precisamos gerar o id direto.
      // Solução: no INSERT de products, o id é a primeira coluna. Então cada linha tem seu id.
      const skuMatch = p.match(/'([^']+)',\s*\n\s*'([^']+)'/);
      const sku = skuMatch ? skuMatch[1] : '';
      return `'c' || substr(md5('mejoy-' || '${sku}'), 1, 24)`;
    });
  });

  // O problema: em products, a primeira coluna é "id". Estou usando productId como expressão que referencia sku da MESMA linha.
  const productsFinal = products.map((p, idx) => {
    const sku = rows[idx]?.sku || '';
    return p.replace(/'\c' \|\| substr\(md5\('mejoy-' \|\| '([^']*)'\), 1, 24\)/, `'c' || substr(md5('mejoy-' || '${escapeSql(sku)}'), 1, 24)`);
  });

  // Na verdade o replace está errado. Deixa eu ver o que products contém.
  // products.push(`( ${productId}, '${escapeSql(sku)}', ...)`)
  // productId = `'c' || substr(md5('mejoy-' || '${escapeSql(sku)}'), 1, 24)` - isso não é válido, está misturando SQL com template. O resultado seria uma string SQL com a expressão.
  // Na verdade productId está sendo usado como string que será inserida no SQL. Então o resultado é literalmente 'c' || substr(md5('mejoy-' || 'sku'), 1, 24) - mas o sku precisa estar escapado dentro das aspas.
  // Correto: productId = `'c' || substr(md5('mejoy-' || '${escapeSql(sku)}'), 1, 24)` - isso gera uma expressão SQL que quando executada vai avaliar com o sku. Mas espera - no VALUES cada linha é independente. Então em cada linha precisamos do sku daquela linha. O sku está na segunda coluna da mesma linha. Em PostgreSQL não podemos referenciar outra coluna no VALUES. Então precisamos que cada linha tenha o id já calculado.
  // Melhor: calcular o id em JS e colocar como literal.
  const productIdFor = (s: string) => {
    const hash = require('crypto').createHash('md5').update('mejoy-' + s).digest('hex').slice(0, 24);
    return 'c' + hash;
  };

  const productsWithIds: Array<{
    pid: string;
    vid: string;
    pvid: string;
    sku: string;
    slug: string;
    name: string;
    objective: string;
    formKey: string;
    tags: string[];
    seoTitle: string;
    r: Record<string, string>;
  }> = [];
  for (let idx = 0; idx < rows.length; idx++) {
    const r = rows[idx];
    const sku = (r.sku || '').trim();
    const formKey = (r.form_key || 'caps').toLowerCase();
    const whatsappFlow = (r.whatsapp_flow || 'none').toLowerCase();
    if (!sku || !FORMS_ALLOWED.includes(formKey) || !WHATSAPP_FLOWS.includes(whatsappFlow)) continue;
    const slug = normalizeSlug(r.seo_slug || '', r.sku, slugUsed);
    const name = r.name.trim();
    const objective = r.objective_primary.trim();
    const tags = (r.tags || '').split(';').map((t) => t.replace(/&/g, '-').trim()).filter(Boolean);
    const seoTitle = (r.seo_title || name).replace(/MeJoy/gi, 'MeJoy');
    const pid = productIdFor(sku);
    const vid = productIdFor('v-' + sku);
    const pvid = productIdFor('pv-' + sku);
    productsWithIds.push({ pid, vid, pvid, sku, slug, name, objective, formKey, tags, seoTitle, r });
  }

  const productsSql = productsWithIds
    .map(
      (x) =>
        `('${x.pid}','${escapeSql(x.sku)}','${escapeSql(x.slug)}','${escapeSql(x.name)}','${escapeSql(x.name)}',NULL,'${escapeSql(x.r.short_benefit || '')}','${escapeSql(x.r.active_ingredients || '')}','${escapeSql(x.r.form_display || '')}','${escapeSql(x.formKey)}','${escapeSql(x.r.pack_size_display || '')}','${escapeSql(x.objective)}',${x.r.category_nav ? `'${escapeSql(x.r.category_nav)}'` : 'NULL'},${x.r.requires_rx === 'True'},${x.r.requires_validation === 'True'},${x.r.can_subscribe !== 'False'},${parseInt(x.r.subscription_discount_pct || '10', 10)},'${escapeSql(x.r.subscription_plan_default || 'MENSAL')}',${parseInt(x.r.lead_time_days || '2', 10)},'${escapeSql(x.r.shipping_class || 'PADRAO')}','${escapeSql(x.seoTitle)}',NULL,${toPgArray(x.tags)},'${(x.r.whatsapp_flow || 'none').toLowerCase()}','${escapeSql(x.r.builder_template_id || '')}',${x.r.upsell_parametrizado === 'True'},${parseInt(x.r.priority_rank || '0', 10)},'active',true,'{}','{}',NOW(),NOW())`
    )
    .join(',\n');

  const variantsSql = productsWithIds
    .map(
      (x) =>
        `('${x.vid}','${x.pid}','${escapeSql(x.sku)}','${escapeSql(x.r.pack_size_display || '')}',${PRICE_CENTS},0)`
    )
    .join(',\n');

  const pricesSql = productsWithIds
    .map((x) => `('${x.pvid}','${x.pid}',${PRICE_CENTS},NULL,NOW(),NULL)`)
    .join(',\n');

  const fullSql = `-- Catálogo Store V2 — ${productsWithIds.length} produtos
-- Preço: R$ ${(PRICE_CENTS / 100).toFixed(2)} (PRICE_CENTS=${PRICE_CENTS})
-- Cole no Supabase SQL Editor: https://supabase.com/dashboard/project/xbfhvepljmcaztpjbryn/sql/new

-- 1. Produtos
INSERT INTO store_v2_products (id, sku, slug, name, "shortName", description, "shortBenefit", "activeIngredients", "formDisplay", "formKey", "packSizeDisplay", objective, category, "requiresRx", "requiresValidation", "canSubscribe", "subscribeDiscountPct", "subscriptionPlanDefault", "leadTimeDays", "shippingClass", "seoTitle", "seoDescription", tags, "whatsappFlow", "builderTemplateId", "upsellParametrizado", "priorityRank", status, active, images, badges, "createdAt", "updatedAt")
VALUES
${productsSql}
ON CONFLICT (sku) DO UPDATE SET name=EXCLUDED.name, slug=EXCLUDED.slug, status=EXCLUDED.status, "updatedAt"=NOW();

-- 2. Variantes
INSERT INTO store_v2_product_variants (id, "productId", sku, name, "priceCents", stock)
VALUES
${variantsSql}
ON CONFLICT (sku) DO UPDATE SET "priceCents"=EXCLUDED."priceCents";

-- 3. Price versions (apenas para produtos sem preço)
INSERT INTO store_v2_price_versions (id, "productId", "priceCents", "compareAtCents", "validFrom", "validTo")
SELECT * FROM (VALUES ${productsWithIds.map((x) => `('${x.pvid}','${x.pid}',${PRICE_CENTS},NULL,NOW(),NULL)`).join(',\n')}) AS v(id, "productId", "priceCents", "compareAtCents", "validFrom", "validTo")
WHERE NOT EXISTS (SELECT 1 FROM store_v2_price_versions pv WHERE pv."productId" = v."productId");
`;

  // A subquery com VALUES tem sintaxe diferente. Simplificar:
  const pricesSqlSimple = productsWithIds
    .map((x) => `('${x.pvid}','${x.pid}',${PRICE_CENTS},NULL,NOW(),NULL)`)
    .join(',\n');

  const fullSqlFixed = `-- Catálogo Store V2 — ${productsWithIds.length} produtos | R$ ${(PRICE_CENTS / 100).toFixed(2)}
-- Supabase: https://supabase.com/dashboard/project/xbfhvepljmcaztpjbryn/sql/new

INSERT INTO store_v2_products (id, sku, slug, name, "shortName", description, "shortBenefit", "activeIngredients", "formDisplay", "formKey", "packSizeDisplay", objective, category, "requiresRx", "requiresValidation", "canSubscribe", "subscribeDiscountPct", "subscriptionPlanDefault", "leadTimeDays", "shippingClass", "seoTitle", "seoDescription", tags, "whatsappFlow", "builderTemplateId", "upsellParametrizado", "priorityRank", status, active, images, badges, "createdAt", "updatedAt")
VALUES
${productsSql}
ON CONFLICT (sku) DO UPDATE SET name=EXCLUDED.name, slug=EXCLUDED.slug, status=EXCLUDED.status, "updatedAt"=NOW();

INSERT INTO store_v2_product_variants (id, "productId", sku, name, "priceCents", stock)
VALUES
${variantsSql}
ON CONFLICT (sku) DO UPDATE SET "priceCents"=EXCLUDED."priceCents";

INSERT INTO store_v2_price_versions (id, "productId", "priceCents", "compareAtCents", "validFrom", "validTo")
VALUES
${pricesSqlSimple}
ON CONFLICT DO NOTHING;
`;

  // ON CONFLICT DO NOTHING precisa de constraint. A tabela price_versions tem PK em id, não em productId. Então pode dar duplicate key se rodar 2x. Melhor: usar ON CONFLICT (id) DO NOTHING - não, o conflito seria em productId se tivéssemos unique. Não temos. Então INSERT direto - na segunda execução vai dar erro de id duplicado. Melhor usar uma abordagem que evite duplicatas: inserir apenas onde não existe.
  // INSERT ... WHERE NOT EXISTS. Para isso precisamos de um INSERT SELECT.
  const pricesInsert = `INSERT INTO store_v2_price_versions (id, "productId", "priceCents", "compareAtCents", "validFrom", "validTo")
SELECT v.id, v."productId", v."priceCents", v."compareAtCents", v."validFrom", v."validTo"
FROM (VALUES
${productsWithIds.map((x, i) => `('${x.pvid}','${x.pid}',${PRICE_CENTS},NULL,NOW()::timestamptz,NULL)`).join(',\n')}
) AS v(id, "productId", "priceCents", "compareAtCents", "validFrom", "validTo")
WHERE NOT EXISTS (SELECT 1 FROM store_v2_price_versions pv WHERE pv."productId" = v."productId"::text);
`;

  const finalSql = `-- Catálogo Store V2 — ${productsWithIds.length} produtos | R$ ${(PRICE_CENTS / 100).toFixed(2)}
-- Cole no Supabase SQL Editor: https://supabase.com/dashboard/project/xbfhvepljmcaztpjbryn/sql/new

-- 1. Produtos
INSERT INTO store_v2_products (id, sku, slug, name, "shortName", description, "shortBenefit", "activeIngredients", "formDisplay", "formKey", "packSizeDisplay", objective, category, "requiresRx", "requiresValidation", "canSubscribe", "subscribeDiscountPct", "subscriptionPlanDefault", "leadTimeDays", "shippingClass", "seoTitle", "seoDescription", tags, "whatsappFlow", "builderTemplateId", "upsellParametrizado", "priorityRank", status, active, images, badges, "createdAt", "updatedAt")
VALUES
${productsSql}
ON CONFLICT (sku) DO UPDATE SET name=EXCLUDED.name, slug=EXCLUDED.slug, status=EXCLUDED.status, "updatedAt"=NOW();

-- 2. Variantes
INSERT INTO store_v2_product_variants (id, "productId", sku, name, "priceCents", stock)
VALUES
${variantsSql}
ON CONFLICT (sku) DO UPDATE SET "priceCents"=EXCLUDED."priceCents";

-- 3. Price versions (apenas novos) — usa productId real de store_v2_products (evita FK violation)
INSERT INTO store_v2_price_versions (id, "productId", "priceCents", "compareAtCents", "validFrom", "validTo")
SELECT gen_random_uuid()::text, p.id, ${PRICE_CENTS}, NULL, NOW(), NULL
FROM store_v2_products p
WHERE NOT EXISTS (SELECT 1 FROM store_v2_price_versions pv WHERE pv."productId" = p.id);
`;

  const outPath = path.join(process.cwd(), 'scripts', 'catalog-import.sql');
  fs.writeFileSync(outPath, finalSql);
  console.log('✅ SQL gerado:', outPath);
  console.log('   Produtos:', productsWithIds.length);
  console.log('   Preço:', `R$ ${(PRICE_CENTS / 100).toFixed(2)}`);
  console.log('\nPróximo passo:');
  console.log('1. Abra https://supabase.com/dashboard/project/xbfhvepljmcaztpjbryn/sql/new');
  console.log('2. Cole o conteúdo de scripts/catalog-import.sql');
  console.log('3. Execute (Run)');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
