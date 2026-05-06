#!/usr/bin/env tsx
/**
 * Gera copy-blueprint-v1.csv a partir de pricing + catálogo.
 * Fase A do Copy Blueprint: artefato auditável, sem alterar DB/pricing.
 * Uso: pnpm run copy:blueprint
 */

import * as fs from 'fs';
import * as path from 'path';

const CATALOG_PATH = path.join(process.cwd(), 'data', 'store-v2', 'catalogo_mejoy_validado_v2.csv');
const PRICING_PATH = path.join(process.cwd(), 'data', 'store-v2', 'pricing-content-v3-validado.csv');
const OUTPUT_PATH = path.join(process.cwd(), 'data', 'store-v2', 'copy', 'copy-blueprint-v1.csv');

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

const OBJECTIVE_TO_SLUG: Record<string, string> = {
  'Ansiedade & Humor': 'ansiedade-humor',
  Articulações: 'articulacoes',
  Cabelo: 'cabelo',
  'Emagrecimento & Metabolismo': 'emagrecimento-metabolismo',
  'Detox & Fígado': 'detox-figado',
  Imunidade: 'imunidade',
  Intestino: 'intestino',
  'Hormonal & Libido': 'hormonal-libido',
  Lipedema: 'lipedema',
  'Menopausa & TPM': 'menopausa-tpm',
  Sono: 'sono',
};

const SENSITIVE_BASE_NAMES = ['Tadalafila', 'Orlistat', 'Minoxidil', 'MINOXDIL'];

const DISCLAIMER =
  '\n\nConsulte um profissional de saúde antes do uso. Gestantes, lactantes e crianças devem consultar médico antes do uso. Este produto não substitui uma alimentação equilibrada e hábitos saudáveis.';

const RX_AVISO = ' Produto sob prescrição. Requer avaliação médica antes do uso.';

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

function fixPrimaryActive(s: string): string {
  return (s || '')
    .replace(/\bASWHAGANDA\b/gi, 'Ashwagandha')
    .replace(/\bINDIANDO\b/gi, 'Indiano')
    .replace(/\bL TEANINE\b/gi, 'L-Teanina')
    .replace(/\bL TEANINA\b/gi, 'L-Teanina')
    .replace(/\bIOMBINA\b/gi, 'Ioimbina')
    .replace(/\bIOIMBINA\b/gi, 'Ioimbina')
    .replace(/\bTRIBULLUS\b/gi, 'Tribulus')
    .replace(/\bMINOXDIL\b/gi, 'Minoxidil')
    .replace(/\bN ACETILCISTEINA\b/gi, 'N-Acetilcisteína')
    .replace(/\bAC HIALURONICO\b/gi, 'Ácido Hialurônico')
    .replace(/\bOL SEMENTE DE ABÓORA\b/gi, 'Óleo de Semente de Abóbora')
    .replace(/\bOLEO\b/gi, 'Óleo')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function sentenceCase(s: string): string {
  const t = (s || '').trim();
  if (!t) return '';
  const lower = t.toLowerCase();
  const first = lower.charAt(0).toUpperCase();
  return first + lower.slice(1);
}

function truncateAtWord(s: string, maxLen: number): string {
  if (s.length <= maxLen) return s;
  const cut = s.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(' ');
  return lastSpace > maxLen * 0.7 ? cut.slice(0, lastSpace) : cut;
}

const NL_PLACEHOLDER = ' | ';

function escapeCSV(val: string): string {
  const v = (val || '').replace(/\r?\n/g, NL_PLACEHOLDER).replace(/"/g, '""');
  if (v.includes(',') || v.includes('"')) return `"${v}"`;
  return v;
}

function buildDescriptionMd(
  productName: string,
  shortBenefit: string,
  description: string,
  primaryActive: string,
  pack: string,
  formKey: string,
  requiresRx: boolean
): string {
  const formDisplay =
    formKey === 'caps'
      ? 'cápsulas'
      : formKey === 'sachet'
        ? 'sachês'
        : formKey === 'topical'
          ? 'tópico'
          : formKey === 'cream'
            ? 'creme'
            : formKey === 'powder'
              ? 'pó'
              : formKey === 'drops'
                ? 'gotas'
                : formKey === 'shampoo'
                  ? 'shampoo'
                  : 'cápsulas';

  let oQueE = `${productName} é uma fórmula manipulada que pode contribuir para o seu bem-estar.`;
  const matchApoia = description.match(/pensada para apoiar ([^.]+)/i);
  if (matchApoia) {
    oQueE = `${productName} é uma fórmula manipulada pensada para apoiar ${matchApoia[1].trim()}.`;
  }

  const beneficios = shortBenefit || 'Pode auxiliar no suporte nutricional e no equilíbrio do organismo.';

  const comoUsar =
    formKey === 'caps' || formKey === 'sachet'
      ? `Utilize conforme orientação de profissional de saúde. Apresentação: ${formDisplay} (${pack}).`
      : formKey === 'topical' || formKey === 'cream' || formKey === 'shampoo'
        ? `Aplique conforme orientação de profissional de saúde. Apresentação: ${pack}.`
        : `Utilize conforme orientação de profissional de saúde. Apresentação: ${pack}.`;

  let cuidados = 'Gestantes, lactantes e crianças devem consultar médico antes do uso.';
  if (requiresRx) {
    cuidados += RX_AVISO;
  }

  return `## O que é

${oQueE}

## Principais benefícios

- ${beneficios}
- Composição com ${primaryActive}
- Fórmula manipulada de qualidade

## Como usar

${comoUsar}

## Cuidados

${cuidados}${DISCLAIMER}`;
}

function buildBullets(shortBenefit: string, primaryActive: string, pack: string, niche: string): string {
  const bullets: string[] = [];
  if (shortBenefit) bullets.push(shortBenefit);
  bullets.push(`Composição com ${primaryActive}`);
  bullets.push(`Apresentação: ${pack}`);
  bullets.push(`Pode auxiliar no suporte nutricional`);
  bullets.push(`Fórmula manipulada`);
  if (niche) bullets.push(`Indicado para ${niche}`);
  return bullets.slice(0, 6).join(' | ');
}

function buildFaq(productName: string, primaryActive: string): string {
  const faqs = [
    `O que é ${productName}? | ${productName} é uma fórmula manipulada com ${primaryActive}, que pode contribuir para o bem-estar.`,
    `Como usar ${productName}? | Utilize conforme orientação de profissional de saúde.`,
    `${productName} tem contraindicações? | Gestantes, lactantes e crianças devem consultar médico antes do uso.`,
    `${productName} substitui alimentação? | Não. Este produto não substitui uma alimentação equilibrada e hábitos saudáveis.`,
  ];
  return faqs.join(' | ');
}

function buildKeywords(productName: string, primaryActive: string, niche: string, objective: string): {
  primary: string;
  secondary: string;
} {
  const parts = productName.split(/[\s+]+/).filter((p) => p.length > 2);
  const primaryList = [
    productName.toLowerCase(),
    primaryActive.toLowerCase(),
    ...parts.slice(0, 3).map((p) => p.toLowerCase()),
    'mejoy',
    'manipulado',
  ].filter((v, i, a) => a.indexOf(v) === i);

  const secondaryList = [
    niche.toLowerCase(),
    objective.toLowerCase(),
    'suplemento',
    'fórmula manipulada',
    'farmácia de manipulação',
    'entrega nacional',
    ...primaryList,
  ].filter((v, i, a) => a.indexOf(v) === i);

  return {
    primary: primaryList.slice(0, 10).join(';'),
    secondary: secondaryList.slice(0, 20).join(';'),
  };
}

function buildInternalLinks(objective: string): string {
  const slug = OBJECTIVE_TO_SLUG[objective] || 'produtos';
  return `/c/${slug} | /produtos`;
}

function main() {
  if (!fs.existsSync(CATALOG_PATH)) {
    console.error('❌ Catálogo não encontrado:', CATALOG_PATH);
    process.exit(1);
  }
  if (!fs.existsSync(PRICING_PATH)) {
    console.error('❌ Pricing não encontrado:', PRICING_PATH);
    process.exit(1);
  }

  const catalog = parseCSV(fs.readFileSync(CATALOG_PATH, 'utf-8'));
  const pricing = parseCSV(fs.readFileSync(PRICING_PATH, 'utf-8'));

  if (catalog.length !== 162) {
    console.error(`❌ Catálogo deve ter 162 linhas, tem ${catalog.length}`);
    process.exit(1);
  }

  const pricingBySku = new Map<string, Record<string, string>>();
  for (const r of pricing) {
    const sku = r.sku?.trim();
    if (sku) pricingBySku.set(sku, r);
  }

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });

  const header = [
    'sku',
    'productName',
    'objective',
    'niche',
    'primaryActive',
    'dose',
    'formKey',
    'pack',
    'shortBenefit',
    'bullets',
    'description_md',
    'faq',
    'cautions',
    'seoTitle',
    'seoDescription',
    'keywords_primary',
    'keywords_secondary',
    'internal_links',
  ];

  const rows: string[][] = [header];

  for (const cat of catalog) {
    const sku = cat.sku?.trim();
    if (!sku) continue;

    const priceRow = pricingBySku.get(sku) ?? {};
    const productName = priceRow.nome ?? cat.name ?? '';
    const niche = cat.niche?.trim() ?? '';
    const objective = NICHE_TO_OBJECTIVE[niche] ?? niche;
    const baseName = cat.base_name?.trim() ?? '';
    const primaryActive = fixPrimaryActive(baseName || productName.split(/\d/)[0]?.trim() || 'Ativo');
    const dose = (cat.dose?.trim() || '—').trim();
    const formKey = (cat.form_key ?? 'caps').toLowerCase();
    const pack = cat.pack?.trim() ?? '';

    const shortBenefit = priceRow.shortBenefit ?? '';
    const description = priceRow.description ?? '';
    const seoTitle = priceRow.seoTitle ?? `${productName} | MeJoy`;
    let seoDescription = priceRow.seoDescription ?? '';
    seoDescription = sentenceCase(seoDescription);
    seoDescription = truncateAtWord(seoDescription, 155);

    const isSensitive = SENSITIVE_BASE_NAMES.some(
      (b) => baseName.toUpperCase().includes(b.toUpperCase()) || productName.toUpperCase().includes(b.toUpperCase())
    );

    const description_md = buildDescriptionMd(
      productName,
      shortBenefit,
      description,
      primaryActive,
      pack,
      formKey,
      isSensitive
    );

    const bullets = buildBullets(shortBenefit, primaryActive, pack, niche);
    const faq = buildFaq(productName, primaryActive);
    const cautions = isSensitive
      ? 'Produto sob prescrição. Requer avaliação médica. Gestantes, lactantes e crianças devem consultar médico.'
      : 'Gestantes, lactantes e crianças devem consultar médico antes do uso.';

    const { primary: keywords_primary, secondary: keywords_secondary } = buildKeywords(
      productName,
      primaryActive,
      niche,
      objective
    );
    const internal_links = buildInternalLinks(objective);

    rows.push([
      sku,
      productName,
      objective,
      niche,
      primaryActive,
      dose,
      formKey,
      pack,
      shortBenefit,
      bullets,
      description_md,
      faq,
      cautions,
      seoTitle,
      seoDescription,
      keywords_primary,
      keywords_secondary,
      internal_links,
    ]);
  }

  const csv = rows.map((r) => r.map(escapeCSV).join(',')).join('\n');
  fs.writeFileSync(OUTPUT_PATH, csv, 'utf-8');

  console.log(`✅ Copy Blueprint gerado: ${OUTPUT_PATH} (${rows.length - 1} SKUs)`);
}

main();
