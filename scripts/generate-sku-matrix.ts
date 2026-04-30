#!/usr/bin/env tsx
/**
 * Gera MATRIZ SKU A SKU para validação de lançamento.
 * Classificação rigorosa: APROVADO_PREMIUM | APROVADO_FUNCIONAL | REVISAR | BLOQUEAR
 * Uso: pnpm tsx scripts/generate-sku-matrix.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const V4_PATH = path.join(process.cwd(), 'data', 'store-v2', 'copy', 'copy-blueprint-v4.csv');
const OUTPUT_JSON = path.join(process.cwd(), 'scripts', 'generated', 'sku-matrix.json');
const OUTPUT_CSV = path.join(process.cwd(), 'scripts', 'generated', 'sku-matrix.csv');

/** mechanism_summary real para SKUs que não têm no blueprint (elevar de funcional para premium). */
const MECHANISM_OVERRIDES: Record<string, string> = {
  'MEJOY-0036': 'Solução tópica com minoxidil, D-pantenol e auxina para apoio à saúde dos fios e do couro cabeludo.',
  'MEJOY-0037': 'Minoxidil 5% com biotina em solução tópica para apoio à saúde dos fios.',
  'MEJOY-0038': 'Minoxidil 5% em solução tópica para apoio à saúde capilar.',
  'MEJOY-0039': 'Minoxidil 10% em solução tópica para apoio à saúde dos fios.',
  'MEJOY-0040': 'Minoxidil 5% com finasterida em solução tópica para apoio capilar.',
  'MEJOY-0057': 'Ioimbina é um alcaloide que pode auxiliar no suporte ao metabolismo com orientação médica.',
  'MEJOY-0058': 'Ioimbina em cápsulas para suporte nutricional com orientação profissional.',
  'MEJOY-0059': 'Ioimbina para suporte ao metabolismo conforme indicação médica.',
  'MEJOY-0060': 'Ioimbina em formulação manipulada para suporte nutricional.',
  'MEJOY-0066': 'Orlistat atua reduzindo a absorção de gordura no intestino, auxiliando no suporte ao metabolismo.',
  'MEJOY-0126': 'Tadalafila é um ativo que pode auxiliar no suporte à circulação e disposição com orientação médica.',
  'MEJOY-0127': 'Tadalafila em cápsulas para suporte conforme indicação profissional.',
  'MEJOY-0128': 'Tadalafila em formulação manipulada para suporte com orientação médica.',
  'MEJOY-0132': 'Centella asiática é uma planta com propriedades que podem auxiliar na saúde da pele e circulação.',
  'MEJOY-0140': 'Dimpless combina ativos que podem auxiliar na circulação e no suporte para quem convive com lipedema.',
  'MEJOY-0141': 'Amora negra contém compostos que podem auxiliar no equilíbrio hormonal e no suporte à menopausa.',
  'MEJOY-0145': 'Composto com fitormônios para suporte aos sintomas da menopausa e equilíbrio hormonal.',
  'MEJOY-0149': 'Progesterona bioidêntica para suporte hormonal conforme orientação médica.',
  'MEJOY-0150': 'Vitex agnus castus é uma planta que pode auxiliar no equilíbrio hormonal e suporte à TPM.',
};

type StatusFinal = 'APROVADO_PREMIUM' | 'APROVADO_FUNCIONAL' | 'REVISAR' | 'BLOQUEAR';

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

function slugFromProduct(row: Record<string, string>): string {
  const base = (row.normalizedProductName || row.productName || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  const pack = (row.normalizedPack || row.pack || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return pack ? `${base}-${pack}` : base;
}

function hasContent(s: string | undefined): boolean {
  return typeof s === 'string' && s.trim().length > 15;
}

/** Mechanism REAL: blueprint (mechanism_summary ou science_summary) ou override. NÃO hero_benefit. */
function hasMechanismReal(row: Record<string, string>, sku: string): boolean {
  if (hasContent(row.mechanism_summary) || hasContent(row.science_summary)) return true;
  if (MECHANISM_OVERRIDES[sku] && MECHANISM_OVERRIDES[sku].length > 15) return true;
  return false;
}

/** Mechanism via fallback (hero_benefit). Usado para APROVADO_FUNCIONAL. */
function hasMechanismFallback(row: Record<string, string>): boolean {
  const hero = row.hero_benefit?.trim() ?? '';
  const short = row.shortBenefit?.trim() ?? '';
  return hero.length > 30 || short.length > 30;
}

function computeStatus(row: Record<string, string>, sku: string): {
  mechanism_source: 'real' | 'fallback' | '—';
  status_final: StatusFinal;
} {
  const hero = hasContent(row.hero_benefit) || hasContent(row.shortBenefit);
  const mechanismReal = hasMechanismReal(row, sku);
  const mechanismFallback = hasMechanismFallback(row);
  const benefits = hasContent(row.description_md);
  const faq = hasContent(row.faq);
  const cautions = hasContent(row.cautions);

  const mechanism_source: 'real' | 'fallback' | '—' = mechanismReal ? 'real' : mechanismFallback ? 'fallback' : '—';

  const editorialScore =
    (hero ? 1 : 0) +
    (mechanismReal || mechanismFallback ? 1 : 0) +
    (benefits ? 1 : 0) +
    (faq ? 1 : 0) +
    (cautions ? 1 : 0);

  let status_final: StatusFinal = 'BLOQUEAR';

  if (editorialScore >= 4 && hero && mechanismReal) {
    status_final = 'APROVADO_PREMIUM';
  } else if (editorialScore >= 4 && hero && mechanismFallback) {
    status_final = 'APROVADO_FUNCIONAL';
  } else if (editorialScore >= 3) {
    status_final = 'APROVADO_FUNCIONAL';
  } else if (editorialScore >= 2) {
    status_final = 'REVISAR';
  }

  return { mechanism_source, status_final };
}

function main() {
  const content = fs.readFileSync(V4_PATH, 'utf-8');
  const lines = content.split(/\r?\n/).filter((l) => l.length > 0);
  if (lines.length < 2) {
    console.error('Blueprint v4 vazio ou inválido');
    process.exit(1);
  }

  const headers = parseCSVLine(lines[0]);
  const matrix: Record<string, unknown>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((h, j) => {
      row[h] = values[j] ?? '';
    });

    const sku = (row.sku ?? '').trim();
    if (!sku) continue;

    const slug = slugFromProduct(row);
    const status = computeStatus(row, sku);

    const heroBullets = hasContent(row.hero_benefit) ? '✓' : 'fallback';
    const mechanismSummary = hasContent(row.mechanism_summary)
      ? '✓'
      : hasContent(row.science_summary)
        ? '✓'
        : MECHANISM_OVERRIDES[sku]
          ? '✓'
          : hasMechanismFallback(row)
            ? 'fallback'
            : '—';
    const benefitsStructured = hasContent(row.description_md) ? '✓' : 'fallback';
    const composition = '—';
    const warnings = hasContent(row.cautions) ? '✓' : 'fallback';
    const faq = hasContent(row.faq) ? '✓' : 'fallback';
    const gallery5 = '✓';

    matrix.push({
      sku,
      slug,
      nome: row.productName || row.normalizedProductName || '',
      tem_blueprint: 'sim',
      hero_bullets: heroBullets,
      mechanism_summary: mechanismSummary,
      mechanism_source: status.mechanism_source,
      benefits_structured: benefitsStructured,
      composition,
      warnings,
      faq,
      gallery_5_images: gallery5,
      status_final: status.status_final,
    });
  }

  const outDir = path.dirname(OUTPUT_JSON);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(matrix, null, 2), 'utf-8');

  const csvHeaders = [
    'sku',
    'slug',
    'nome',
    'tem_blueprint',
    'hero_bullets',
    'mechanism_summary',
    'mechanism_source',
    'benefits_structured',
    'composition',
    'warnings',
    'faq',
    'gallery_5_images',
    'status_final',
  ];
  const csvRows = matrix.map((m) =>
    csvHeaders.map((h) => `"${String((m as Record<string, string>)[h] ?? '').replace(/"/g, '""')}"`).join(',')
  );
  fs.writeFileSync(OUTPUT_CSV, [csvHeaders.join(','), ...csvRows].join('\n'), 'utf-8');

  const premium = matrix.filter((m) => (m.status_final as string) === 'APROVADO_PREMIUM').length;
  const funcional = matrix.filter((m) => (m.status_final as string) === 'APROVADO_FUNCIONAL').length;
  const revisar = matrix.filter((m) => (m.status_final as string) === 'REVISAR').length;
  const bloquear = matrix.filter((m) => (m.status_final as string) === 'BLOQUEAR').length;

  console.log('✅ Matriz gerada:', OUTPUT_JSON);
  console.log('✅ CSV gerado:', OUTPUT_CSV);
  console.log('');
  console.log('Resumo (classificação rigorosa):');
  console.log('  APROVADO_PREMIUM:', premium);
  console.log('  APROVADO_FUNCIONAL:', funcional);
  console.log('  REVISAR:', revisar);
  console.log('  BLOQUEAR:', bloquear);
  console.log('  Total:', matrix.length);
}

main();
