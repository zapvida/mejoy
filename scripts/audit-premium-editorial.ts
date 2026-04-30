#!/usr/bin/env tsx
/**
 * Auditoria premium editorial dos 162 SKUs (sem alterar código/layout).
 * Classificação:
 * - OK_PREMIUM
 * - AJUSTE_COPY
 * - AJUSTE_FIRST_FOLD
 * - AJUSTE_CORPO
 * - AJUSTE_COMPLETO
 */

import * as fs from 'fs';
import * as path from 'path';
import { parseCSV, writeCSV } from './lib/copy-utils';
import { getHeroBullets, parseFaqFromV2, parseParaQueServe, parseHowToUseBullets, parseReferences } from '../src/lib/store-v2/copy-v2';

type PremiumClass =
  | 'OK_PREMIUM'
  | 'AJUSTE_COPY'
  | 'AJUSTE_FIRST_FOLD'
  | 'AJUSTE_CORPO'
  | 'AJUSTE_COMPLETO';

interface PremiumAuditItem {
  sku: string;
  productName: string;
  objective: string;
  classification: PremiumClass;
  firstFoldScore: number;
  bodyScore: number;
  editorialScore: number;
  heroBulletsCount: number;
  faqCount: number;
  paraQueServePairs: number;
  referencesCount: number;
  clickableReferencesCount: number;
  genericHits: number;
  issues: string[];
}

const BLUEPRINT_PATH = path.join(process.cwd(), 'data', 'store-v2', 'copy', 'copy-blueprint-v4.csv');
const OUTPUT_JSON = path.join(process.cwd(), 'scripts', 'generated', 'premium-editorial-audit.json');
const OUTPUT_CSV = path.join(process.cwd(), 'scripts', 'generated', 'premium-editorial-audit.csv');
const MASTER_SKU = 'MEJOY-0048';

const REQUIRED_SECTIONS = [
  '## O que é',
  '## Para quem pode fazer sentido',
  '## Diferenciais da fórmula',
  '## Como usar',
  '## Cuidados',
];

const GENERIC_PATTERNS = [
  'é uma fórmula manipulada que pode auxiliar no suporte ao seu objetivo',
  'uso orientado e rotina consistente',
  'apoio ao objetivo de saúde do produto',
  'fórmula manipulada com qualidade',
  'complemento para hábitos saudáveis',
  'uso prático para rotina diária',
  'benefício associado ao objetivo',
  'suporte prático para',
  'quem busca apoio para',
];

function norm(s: string): string {
  return (s ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function splitPipe(text: string): string[] {
  return (text ?? '').split(/\s*\|\s*/).map((s) => s.trim()).filter(Boolean);
}

function countGenericHits(...chunks: string[]): number {
  const blob = norm(chunks.join(' '));
  let hits = 0;
  for (const pattern of GENERIC_PATTERNS) {
    if (blob.includes(norm(pattern))) hits++;
  }
  return hits;
}

function extractUrl(reference: string): string | null {
  const fromUrl = reference.match(/https?:\/\/[^\s)]+/i)?.[0];
  if (fromUrl) return fromUrl.replace(/[.,;]+$/, '');
  const doi = reference.match(/\b10\.\d{4,9}\/[-._;()/:A-Z0-9]+\b/i)?.[0];
  if (doi) return `https://doi.org/${doi}`;
  return null;
}

function toCsv(items: PremiumAuditItem[]): string {
  const headers = [
    'sku',
    'productName',
    'objective',
    'classification',
    'firstFoldScore',
    'bodyScore',
    'editorialScore',
    'heroBulletsCount',
    'faqCount',
    'paraQueServePairs',
    'referencesCount',
    'clickableReferencesCount',
    'genericHits',
    'issues',
  ];
  const rows = items.map((i) => ({
    sku: i.sku,
    productName: i.productName,
    objective: i.objective,
    classification: i.classification,
    firstFoldScore: String(i.firstFoldScore),
    bodyScore: String(i.bodyScore),
    editorialScore: String(i.editorialScore),
    heroBulletsCount: String(i.heroBulletsCount),
    faqCount: String(i.faqCount),
    paraQueServePairs: String(i.paraQueServePairs),
    referencesCount: String(i.referencesCount),
    clickableReferencesCount: String(i.clickableReferencesCount),
    genericHits: String(i.genericHits),
    issues: i.issues.join(' | '),
  }));
  return writeCSV(headers, rows);
}

function classify(
  firstFoldScore: number,
  bodyScore: number,
  editorialScore: number,
  genericHits: number,
  structuralCritical: boolean
): PremiumClass {
  if (structuralCritical) return 'AJUSTE_COMPLETO';
  if (firstFoldScore < 55 && bodyScore < 55) return 'AJUSTE_COMPLETO';
  if (firstFoldScore < 65) return 'AJUSTE_FIRST_FOLD';
  if (bodyScore < 70) return 'AJUSTE_CORPO';
  if (editorialScore < 75 || genericHits > 0) return 'AJUSTE_COPY';
  return 'OK_PREMIUM';
}

function main() {
  if (!fs.existsSync(BLUEPRINT_PATH)) {
    console.error('❌ copy-blueprint-v4.csv não encontrado.');
    process.exit(1);
  }

  const { rows } = parseCSV(fs.readFileSync(BLUEPRINT_PATH, 'utf-8'));
  const items: PremiumAuditItem[] = [];

  for (const row of rows) {
    const sku = (row.sku ?? '').trim();
    if (!sku) continue;

    const productName = (row.productName ?? row.normalizedProductName ?? sku).trim();
    const objective = (row.objective ?? 'Saúde').trim();
    const description = (row.description_md ?? '').trim();
    const mechanism = (row.mechanism_summary ?? '').trim();
    const shortBenefit = (row.shortBenefit ?? '').trim();
    const heroBenefit = (row.hero_benefit ?? '').trim();
    const bestFit = (row.best_fit_profile ?? '').trim();

    const heroBullets = getHeroBullets(heroBenefit, shortBenefit, objective, sku).slice(0, 5);
    const faq = parseFaqFromV2(row.faq ?? '');
    const para = parseParaQueServe(row.para_que_serve ?? '');
    const howToUse = parseHowToUseBullets(row.how_to_use_bullets ?? '');
    const refs = parseReferences(row.references ?? '');
    const clickableRefs = refs.filter((r) => !!extractUrl(r));

    const genericHits = countGenericHits(
      shortBenefit,
      heroBenefit,
      mechanism,
      description,
      row.para_que_serve ?? '',
      row.faq ?? ''
    );

    const issues: string[] = [];
    const missingSections = REQUIRED_SECTIONS.filter((sec) => !description.includes(sec));
    if (missingSections.length) issues.push('SECOES_FALTANDO');
    if (heroBullets.length < 5) issues.push('FIRST_FOLD_BULLETS<5');
    if (mechanism.length < 120) issues.push('SUBTITULO_CURTO');
    if (shortBenefit.length < 60) issues.push('SHORT_BENEFIT_FRACO');
    if (bestFit.length < 70) issues.push('BEST_FIT_FRACO');
    if (faq.length < 5) issues.push('FAQ<5');
    if (para.length < 5) issues.push('PARA_QUE_SERVE<5');
    if (howToUse.length < 3) issues.push('COMO_USAR<3');
    if ((row.advertencias_completo ?? '').trim().length < 160) issues.push('ADVERTENCIAS_CURTAS');
    if (refs.length < 3) issues.push('REFERENCES<3');
    if (clickableRefs.length < 3) issues.push('CLICKABLE_REFERENCES<3');
    if (genericHits > 0) issues.push('TEXTO_GENERICO');

    const firstFoldScore =
      (heroBullets.length >= 5 ? 35 : heroBullets.length * 6) +
      (mechanism.length >= 120 ? 25 : Math.round((Math.min(mechanism.length, 120) / 120) * 25)) +
      (shortBenefit.length >= 60 ? 20 : Math.round((Math.min(shortBenefit.length, 60) / 60) * 20)) +
      (heroBenefit.length >= 80 ? 20 : Math.round((Math.min(heroBenefit.length, 80) / 80) * 20));

    const bodyScore =
      (missingSections.length === 0 ? 30 : Math.max(0, 30 - missingSections.length * 7)) +
      (para.length >= 5 ? 20 : para.length * 4) +
      (faq.length >= 5 ? 15 : faq.length * 3) +
      (howToUse.length >= 3 ? 10 : howToUse.length * 3) +
      ((row.advertencias_completo ?? '').trim().length >= 160 ? 10 : 4) +
      (refs.length >= 3 && clickableRefs.length >= 3 ? 15 : 5);

    const editorialScore =
      Math.max(0, Math.round((firstFoldScore * 0.45 + bodyScore * 0.55) - genericHits * 4));

    const structuralCritical =
      refs.length < 3 ||
      clickableRefs.length < 3 ||
      faq.length < 5 ||
      para.length < 5 ||
      heroBullets.length < 5 ||
      missingSections.length > 1;

    let classification = classify(firstFoldScore, bodyScore, editorialScore, genericHits, structuralCritical);
    if (sku === MASTER_SKU) {
      // Akkermat é baseline protegido: não deve ser reescrito por este fluxo.
      classification = 'OK_PREMIUM';
    }

    items.push({
      sku,
      productName,
      objective,
      classification,
      firstFoldScore,
      bodyScore,
      editorialScore,
      heroBulletsCount: heroBullets.length,
      faqCount: faq.length,
      paraQueServePairs: para.length,
      referencesCount: refs.length,
      clickableReferencesCount: clickableRefs.length,
      genericHits,
      issues,
    });
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    total: items.length,
    okPremium: items.filter((i) => i.classification === 'OK_PREMIUM').length,
    ajusteCopy: items.filter((i) => i.classification === 'AJUSTE_COPY').length,
    ajusteFirstFold: items.filter((i) => i.classification === 'AJUSTE_FIRST_FOLD').length,
    ajusteCorpo: items.filter((i) => i.classification === 'AJUSTE_CORPO').length,
    ajusteCompleto: items.filter((i) => i.classification === 'AJUSTE_COMPLETO').length,
    averageEditorialScore:
      items.length > 0
        ? Number((items.reduce((acc, i) => acc + i.editorialScore, 0) / items.length).toFixed(1))
        : 0,
  };

  fs.mkdirSync(path.dirname(OUTPUT_JSON), { recursive: true });
  fs.writeFileSync(OUTPUT_JSON, JSON.stringify({ summary, items }, null, 2), 'utf-8');
  fs.writeFileSync(OUTPUT_CSV, toCsv(items), 'utf-8');

  console.log('✅ Auditoria premium editorial concluída');
  console.log(`   Total: ${summary.total}`);
  console.log(`   OK_PREMIUM: ${summary.okPremium}`);
  console.log(`   AJUSTE_COPY: ${summary.ajusteCopy}`);
  console.log(`   AJUSTE_FIRST_FOLD: ${summary.ajusteFirstFold}`);
  console.log(`   AJUSTE_CORPO: ${summary.ajusteCorpo}`);
  console.log(`   AJUSTE_COMPLETO: ${summary.ajusteCompleto}`);
  console.log(`   Score médio editorial: ${summary.averageEditorialScore}`);
  console.log(`   JSON: ${OUTPUT_JSON}`);
  console.log(`   CSV: ${OUTPUT_CSV}`);
}

main();
