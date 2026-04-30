#!/usr/bin/env tsx
/**
 * Gera copy-blueprint-v2.csv — base editorial premium.
 * Lê v1 (congelado), aplica normalização forte, adiciona colunas editoriais,
 * compliance score, reescreve copy por cluster. NÃO altera DB/pricing/site.
 * Uso: pnpm run copy:blueprint:v2
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  normalizeProductName,
  normalizePrimaryActive,
  normalizeDose,
  normalizePack,
  normalizeFormDisplay,
  detectCatalogConflict,
  type NormalizationIssue,
} from './lib/copy-normalizer';

const V1_PATH = path.join(process.cwd(), 'data', 'store-v2', 'copy', 'copy-blueprint-v1.csv');
const CATALOG_PATH = path.join(process.cwd(), 'data', 'store-v2', 'catalogo_mejoy_validado_v2.csv');
const OUTPUT_PATH = path.join(process.cwd(), 'data', 'store-v2', 'copy', 'copy-blueprint-v2.csv');
const GENERATED_DIR = path.join(process.cwd(), 'scripts', 'generated');
const NORM_ISSUES_PATH = path.join(GENERATED_DIR, 'copy-normalization-issues.json');
const REPORT_PATH = path.join(GENERATED_DIR, 'copy-blueprint-v2-report.json');

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

const HIGH_RISK_BASE_NAMES = ['Tadalafila', 'Orlistat', 'Minoxidil', 'MINOXDIL', 'Progesterona', 'Ioimbina', 'IOMBINA'];
const MEDIUM_RISK_PATTERNS = ['hormonal', 'transdérmica', 'composto menopausa', 'composto libido', 'lipedema'];

const PRIORITY_CLUSTERS = ['Sono', 'Menopausa & TPM', 'Lipedema'];
const NL = ' | ';
const DISCLAIMER =
  ' Consulte um profissional de saúde antes do uso. Gestantes, lactantes e crianças devem consultar médico antes do uso. Este produto não substitui uma alimentação equilibrada e hábitos saudáveis.';

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

function sentenceCase(s: string): string {
  const t = (s || '').trim();
  if (!t) return '';
  return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
}

function truncateAtWord(s: string, maxLen: number): string {
  if (s.length <= maxLen) return s;
  const cut = s.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(' ');
  return lastSpace > maxLen * 0.7 ? cut.slice(0, lastSpace) : cut;
}

function escapeCSV(val: string): string {
  const v = (val || '').replace(/\r?\n/g, NL).replace(/"/g, '""');
  if (v.includes(',') || v.includes('"')) return `"${v}"`;
  return v;
}

function getComplianceRisk(
  productName: string,
  primaryActive: string,
  shortBenefit: string,
  niche: string
): { risk: 'low' | 'medium' | 'high'; notes: string } {
  const combined = `${productName} ${primaryActive} ${shortBenefit} ${niche}`.toLowerCase();
  const isHigh =
    HIGH_RISK_BASE_NAMES.some(
      (b) =>
        productName.toUpperCase().includes(b.toUpperCase()) || primaryActive.toUpperCase().includes(b.toUpperCase())
    ) || /progesterona transdérmica|ioimbina/i.test(combined);
  if (isHigh)
    return {
      risk: 'high',
      notes: 'Produto sensível: requer prescrição ou avaliação médica. Revisão obrigatória.',
    };

  const isMedium =
    MEDIUM_RISK_PATTERNS.some((p) => combined.includes(p)) ||
    /anti-inflamatório|reposição|crescimento|redução de absorção|redução de gordura|ondas de calor|antienvelhecimento categórico/i.test(
      shortBenefit
    );
  if (isMedium)
    return {
      risk: 'medium',
      notes: 'Linguagem ou nicho sensível. Sugerida revisão antes de publicação.',
    };

  return { risk: 'low', notes: '' };
}

function buildV2Content(
  row: Record<string, string>,
  normIssues: NormalizationIssue[],
  sku: string
): Record<string, string> {
  const productName = row.productName ?? '';
  const normalizedProductName = normalizeProductName(productName, normIssues, sku);
  const primaryActive = row.primaryActive ?? '';
  const normalizedPrimaryActive = normalizePrimaryActive(primaryActive, normIssues, sku);
  const dose = row.dose ?? '—';
  const normalizedDose = dose === '—' ? '—' : normalizeDose(dose, normIssues, sku);
  const formKey = (row.formKey ?? 'caps').toLowerCase();
  const pack = row.pack ?? '';
  const normalizedPack = normalizePack(pack, normIssues, sku);
  const shortBenefit = row.shortBenefit ?? '';
  const objective = row.objective ?? '';
  const niche = row.niche ?? '';
  const isPriority = PRIORITY_CLUSTERS.includes(objective);
  const slug = OBJECTIVE_TO_SLUG[objective] || 'produtos';

  const { risk: compliance_risk, notes: compliance_notes } = getComplianceRisk(
    normalizedProductName,
    normalizedPrimaryActive,
    shortBenefit,
    niche
  );
  const medical_review_needed = compliance_risk === 'high' ? 'yes' : 'no';
  const review_status = compliance_risk === 'high' ? 'needs_review' : 'draft';

  const needs_catalog_review = detectCatalogConflict(
    normalizedProductName,
    normalizedDose,
    normalizedPack,
    formKey,
    sku
  )
    ? 'yes'
    : 'no';

  const formDisplay = normalizeFormDisplay(formKey);
  const search_intent = isPriority ? 'commercial' : 'mixed';

  const hero_benefit = shortBenefit || `${normalizedProductName} em ${formDisplay}, para quem busca apoio nutricional.`;

  const problem_statement =
    objective === 'Sono'
      ? 'Dificuldade para relaxar, desligar ou manter uma rotina noturna equilibrada.'
      : objective === 'Menopausa & TPM'
        ? 'Desconfortos do ciclo hormonal, alterações de humor ou sintomas da menopausa.'
        : objective === 'Lipedema'
          ? 'Bem-estar corporal e suporte para quem convive com lipedema.'
          : objective === 'Cabelo'
            ? 'Preocupação com saúde dos fios, couro cabeludo ou queda capilar.'
            : objective === 'Emagrecimento & Metabolismo'
              ? 'Busca por apoio ao metabolismo e hábitos saudáveis.'
              : objective === 'Articulações'
                ? 'Desconforto articular, mobilidade ou recuperação.'
                : objective === 'Intestino'
                  ? 'Digestão, regularidade intestinal ou equilíbrio da microbiota.'
                  : objective === 'Imunidade'
                    ? 'Suporte ao sistema imunológico e defesas do organismo.'
                    : objective === 'Ansiedade & Humor'
                      ? 'Estresse, foco ou equilíbrio emocional.'
                      : 'Bem-estar geral e suporte nutricional.';

  const who_is_it_for =
    objective === 'Sono'
      ? 'Quem busca apoio ao relaxamento no fim do dia e uma rotina noturna mais equilibrada.'
      : objective === 'Menopausa & TPM'
        ? 'Mulheres que buscam apoio durante a menopausa ou em fases de alteração hormonal.'
        : objective === 'Lipedema'
          ? 'Quem busca suporte para o bem-estar corporal e cuidados com lipedema.'
          : `Quem busca apoio para ${niche.toLowerCase()}.`;

  const when_to_consider =
    'Quando há interesse em suporte nutricional e o profissional de saúde indicar o uso.';

  const differentiators = `${normalizedPrimaryActive}${normalizedDose !== '—' ? ` ${normalizedDose}` : ''} | ${normalizedPack} | ${formDisplay} | Fórmula manipulada`;

  const description_md = `## O que é${NL}${NL}${normalizedProductName} é uma fórmula manipulada que pode auxiliar no suporte ao seu objetivo.${NL}${NL}## Para quem pode fazer sentido${NL}${NL}${who_is_it_for}${NL}${NL}## Diferenciais da fórmula${NL}${NL}- ${differentiators.replace(' | ', NL + '- ')}${NL}- ${shortBenefit || 'Pode auxiliar no suporte nutricional.'}${NL}${NL}## Como usar${NL}${NL}${formKey === 'topical' || formKey === 'cream' || formKey === 'shampoo' ? 'Aplique' : 'Utilize'} conforme orientação de profissional de saúde. Apresentação: ${normalizedPack}.${NL}${NL}## Cuidados${NL}${NL}Gestantes, lactantes e crianças devem consultar médico antes do uso.${compliance_risk === 'high' ? ' Produto sob prescrição. Requer avaliação médica.' : ''}${DISCLAIMER}`;

  const faqItems = [
    `O que é ${normalizedProductName}? | ${normalizedProductName} é uma fórmula manipulada com ${normalizedPrimaryActive}, que pode auxiliar no suporte nutricional.`,
    `Como usar ${normalizedProductName}? | ${formKey === 'topical' || formKey === 'cream' ? 'Aplique' : 'Utilize'} conforme orientação de profissional de saúde.`,
    `${normalizedProductName} tem contraindicações? | Gestantes, lactantes e crianças devem consultar médico antes do uso.`,
    `Posso tomar ${normalizedProductName} com outros suplementos? | Consulte um profissional de saúde para orientação personalizada.`,
    `${normalizedProductName} substitui alimentação? | Não. Este produto não substitui uma alimentação equilibrada e hábitos saudáveis.`,
  ];
  const faq = faqItems.slice(0, 6).join(' | ');

  const cautions =
    compliance_risk === 'high'
      ? 'Produto sob prescrição. Requer avaliação médica. Gestantes, lactantes e crianças devem consultar médico.'
      : 'Gestantes, lactantes e crianças devem consultar médico antes do uso.';

  const seoTitle = `${normalizedProductName} | Me Joy`;
  let seoDescription = row.seoDescription ?? '';
  seoDescription = sentenceCase(seoDescription);
  seoDescription = truncateAtWord(seoDescription, 155);

  const seo_h1 = normalizedProductName;

  const baseKw = normalizedProductName.toLowerCase().replace(/[()[\]{}|]/g, ' ').replace(/\s+/g, ' ').trim();
  const primKw = normalizedPrimaryActive.toLowerCase().replace(/[()[\]{}|]/g, ' ').replace(/\s+/g, ' ').trim();
  const keywords_primary = [baseKw, primKw, `${objective.toLowerCase()} manipulado`, 'me joy']
    .filter((v, i, a) => a.indexOf(v) === i)
    .slice(0, 5)
    .join(';');

  const keywords_secondary = [
    niche.toLowerCase(),
    formDisplay,
    'suplemento',
    'fórmula manipulada',
    'farmácia de manipulação',
    'entrega nacional',
    ...keywords_primary.split(';'),
  ]
    .filter((v, i, a) => a.indexOf(v) === i)
    .slice(0, 12)
    .join(';');

  const questions_people_ask = [
    `O que é ${normalizedProductName}?`,
    `Como usar ${normalizedProductName}?`,
    `${normalizedProductName} funciona?`,
    `${normalizedProductName} tem contraindicações?`,
  ].join(' | ');

  const semantic_entities = [normalizedPrimaryActive, objective, niche, formDisplay].filter(Boolean).join(';');

  const internal_links = `/c/${slug} | /produtos`;

  return {
    sku,
    productName: normalizedProductName,
    normalizedProductName,
    objective,
    niche,
    primaryActive: normalizedPrimaryActive,
    normalizedPrimaryActive,
    dose: normalizedDose,
    normalizedDose,
    formKey,
    normalizedFormDisplay: formDisplay,
    pack: normalizedPack,
    normalizedPack,
    hero_benefit,
    shortBenefit,
    problem_statement,
    who_is_it_for,
    when_to_consider,
    differentiators,
    description_md,
    faq,
    cautions,
    seoTitle,
    seoDescription,
    seo_h1,
    search_intent,
    questions_people_ask,
    keywords_primary,
    keywords_secondary,
    semantic_entities,
    internal_links,
    compliance_risk,
    compliance_notes,
    medical_review_needed,
    review_status,
    needs_catalog_review,
  };
}

function main() {
  if (!fs.existsSync(V1_PATH)) {
    console.error('❌ copy-blueprint-v1.csv não encontrado:', V1_PATH);
    process.exit(1);
  }

  const v1Rows = parseCSV(fs.readFileSync(V1_PATH, 'utf-8'));
  if (v1Rows.length !== 162) {
    console.error(`❌ v1 deve ter 162 linhas, tem ${v1Rows.length}`);
    process.exit(1);
  }

  const normIssues: NormalizationIssue[] = [];
  const catalogConflicts: string[] = [];
  const complianceCounts = { low: 0, medium: 0, high: 0 };

  const v2Header = [
    'sku',
    'productName',
    'normalizedProductName',
    'objective',
    'niche',
    'primaryActive',
    'normalizedPrimaryActive',
    'dose',
    'normalizedDose',
    'formKey',
    'normalizedFormDisplay',
    'pack',
    'normalizedPack',
    'hero_benefit',
    'shortBenefit',
    'problem_statement',
    'who_is_it_for',
    'when_to_consider',
    'differentiators',
    'description_md',
    'faq',
    'cautions',
    'seoTitle',
    'seoDescription',
    'seo_h1',
    'search_intent',
    'questions_people_ask',
    'keywords_primary',
    'keywords_secondary',
    'semantic_entities',
    'internal_links',
    'compliance_risk',
    'compliance_notes',
    'medical_review_needed',
    'review_status',
    'needs_catalog_review',
  ];

  const v2Rows: string[][] = [v2Header];
  const highRiskSkus: string[] = [];

  for (const row of v1Rows) {
    const sku = row.sku?.trim();
    if (!sku) continue;
    const v2 = buildV2Content(row, normIssues, sku);
    complianceCounts[v2.compliance_risk as keyof typeof complianceCounts]++;
    if (v2.needs_catalog_review === 'yes') catalogConflicts.push(sku);
    if (v2.compliance_risk === 'high') highRiskSkus.push(sku);
    v2Rows.push(v2Header.map((h) => v2[h] ?? ''));
  }

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.mkdirSync(GENERATED_DIR, { recursive: true });

  const csv = v2Rows.map((r) => r.map(escapeCSV).join(',')).join('\n');
  fs.writeFileSync(OUTPUT_PATH, csv, 'utf-8');

  fs.writeFileSync(
    NORM_ISSUES_PATH,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        totalIssues: normIssues.length,
        issues: normIssues.slice(0, 100),
      },
      null,
      2
    ),
    'utf-8'
  );

  fs.writeFileSync(
    REPORT_PATH,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        totalRows: v2Rows.length - 1,
        expectedRows: 162,
        compliance: complianceCounts,
        highRiskSkus,
        catalogConflicts,
        normalizationIssuesCount: normIssues.length,
        priorityClusters: PRIORITY_CLUSTERS,
      },
      null,
      2
    ),
    'utf-8'
  );

  console.log('✅ Copy Blueprint v2 gerado');
  console.log(`   Output: ${OUTPUT_PATH}`);
  console.log(`   Linhas: ${v2Rows.length - 1}`);
  console.log(`   Compliance: low=${complianceCounts.low} medium=${complianceCounts.medium} high=${complianceCounts.high}`);
  console.log(`   High risk (revisão): ${highRiskSkus.length} SKUs`);
  console.log(`   Conflitos catálogo: ${catalogConflicts.length}`);
  console.log(`   Normalização: ${normIssues.length} correções`);
  console.log(`   Relatório: ${REPORT_PATH}`);
}

main();
