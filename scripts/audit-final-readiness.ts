#!/usr/bin/env tsx
/**
 * Auditoria final SKU a SKU para lançamento oficial.
 * Classificação:
 * - OK_FINAL
 * - AJUSTE_EDITORIAL
 * - AJUSTE_ESTRUTURAL
 * - BLOQUEAR
 */

import * as fs from 'fs';
import * as path from 'path';
import { parseCSV } from './lib/copy-utils';
import {
  getCopyV4BySku,
  getHeroBullets,
  parseFaqFromV2,
  parseParaQueServe,
  parseReferences,
} from '../src/lib/store-v2/copy-v2';

type FinalClass = 'OK_FINAL' | 'AJUSTE_EDITORIAL' | 'AJUSTE_ESTRUTURAL' | 'BLOQUEAR';

interface ItemReport {
  sku: string;
  productName: string;
  objective: string;
  classification: FinalClass;
  heroBullets: number;
  faqCount: number;
  paraQueServeCount: number;
  referencesCount: number;
  clickableReferencesCount: number;
  missingSections: string[];
  firstFoldMirrorOk: boolean;
  editorialSignalsOk: number;
  notes: string[];
}

const BLUEPRINT_PATH = path.join(process.cwd(), 'data', 'store-v2', 'copy', 'copy-blueprint-v4.csv');
const OUTPUT_JSON = path.join(process.cwd(), 'scripts', 'generated', 'final-readiness-audit.json');
const OUTPUT_CSV = path.join(process.cwd(), 'scripts', 'generated', 'final-readiness-audit.csv');

const REQUIRED_SECTIONS = [
  '## O que é',
  '## Para quem pode fazer sentido',
  '## Diferenciais da fórmula',
  '## Como usar',
  '## Cuidados',
];

function normalizeText(text: string): string {
  return String(text ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function splitPipe(text: string): string[] {
  return String(text ?? '')
    .split(/\s*\|\s*/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function extractKeywords(text: string): string[] {
  const stop = new Set(['para', 'com', 'sem', 'mais', 'menos', 'uma', 'um', 'de', 'do', 'da', 'dos', 'das', 'que', 'por', 'ao']);
  return normalizeText(text)
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length >= 5 && !stop.has(w));
}

function firstFoldMirrorCheck(heroBullets: string[], paraQueServe: Array<{ title: string; desc: string }>): boolean {
  if (heroBullets.length < 5 || paraQueServe.length < 5) return false;
  const paraText = normalizeText(paraQueServe.map((p) => `${p.title} ${p.desc}`).join(' '));
  let matched = 0;
  for (const bullet of heroBullets) {
    const keywords = extractKeywords(bullet).slice(0, 3);
    if (keywords.some((k) => paraText.includes(k))) {
      matched++;
    }
  }
  return matched >= 2;
}

function extractUrl(reference: string): string | null {
  const m = reference.match(/https?:\/\/[^\s)]+/i)?.[0];
  return m ? m.replace(/[.,;]+$/, '') : null;
}

function domainOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return '';
  }
}

function toCsv(items: ItemReport[]): string {
  const headers = [
    'sku',
    'productName',
    'objective',
    'classification',
    'heroBullets',
    'faqCount',
    'paraQueServeCount',
    'referencesCount',
    'clickableReferencesCount',
    'missingSections',
    'firstFoldMirrorOk',
    'editorialSignalsOk',
    'notes',
  ];
  const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const rows = items.map((item) => [
    esc(item.sku),
    esc(item.productName),
    esc(item.objective),
    esc(item.classification),
    esc(String(item.heroBullets)),
    esc(String(item.faqCount)),
    esc(String(item.paraQueServeCount)),
    esc(String(item.referencesCount)),
    esc(String(item.clickableReferencesCount)),
    esc(item.missingSections.join(' | ')),
    esc(item.firstFoldMirrorOk ? 'yes' : 'no'),
    esc(String(item.editorialSignalsOk)),
    esc(item.notes.join(' | ')),
  ].join(','));
  return [headers.join(','), ...rows].join('\n');
}

function main() {
  if (!fs.existsSync(BLUEPRINT_PATH)) {
    console.error('❌ Blueprint v4 não encontrado.');
    process.exit(1);
  }

  const { rows } = parseCSV(fs.readFileSync(BLUEPRINT_PATH, 'utf-8'));
  const report: ItemReport[] = [];

  for (const row of rows) {
    const sku = (row.sku ?? '').trim();
    if (!sku) continue;
    const productName = (row.productName ?? row.normalizedProductName ?? sku).trim();
    const objective = (row.objective ?? 'Saúde').trim();

    const copy = getCopyV4BySku(sku);
    const description = copy?.description_md ?? row.description_md ?? '';
    const hero = getHeroBullets(copy?.hero_benefit, copy?.shortBenefit, objective, sku);
    const faq = parseFaqFromV2(copy?.faq ?? row.faq ?? '');
    const paraQueServe = parseParaQueServe(copy?.para_que_serve ?? row.para_que_serve ?? '');
    const refs = parseReferences(copy?.references ?? row.references ?? '');
    const clickableRefs = refs.filter((r) => /(https?:\/\/|doi\.org|pubmed\.ncbi\.nlm\.nih\.gov|ncbi\.nlm\.nih\.gov)/i.test(r));

    const missingSections = REQUIRED_SECTIONS.filter((sec) => !description.includes(sec));
    const firstFoldMirrorOk = firstFoldMirrorCheck(hero, paraQueServe);

    const seoTitle = (copy?.seoTitle ?? row.seoTitle ?? '').trim();
    const seoDescription = (copy?.seoDescription ?? row.seoDescription ?? '').trim();
    const mechanism = (copy?.mechanism_summary ?? row.mechanism_summary ?? '').trim();
    const shortBenefit = (copy?.shortBenefit ?? row.shortBenefit ?? '').trim();
    const heroBenefit = (copy?.hero_benefit ?? row.hero_benefit ?? '').trim();
    const refsDomains = new Set(
      refs.map(extractUrl).filter(Boolean).map((u) => domainOf(u!)).filter(Boolean)
    );
    const faqUseful = faq.filter((f) => (f.q ?? '').trim().length >= 12 && (f.a ?? '').trim().length >= 45).length >= 4;

    const editorialSignals = [
      heroBenefit.length >= 40,
      shortBenefit.length >= 28,
      mechanism.length >= 40,
      seoTitle.length >= 30,
      seoDescription.length >= 80 && seoDescription.length <= 155,
      faqUseful,
      refsDomains.size >= 2,
    ];
    const editorialSignalsOk = editorialSignals.filter(Boolean).length;

    const notes: string[] = [];
    if (faq.length < 5) notes.push('FAQ<5');
    if (paraQueServe.length < 5) notes.push('PARA_QUE_SERVE<5');
    if (refs.length < 3) notes.push('REFERENCES<3');
    if (clickableRefs.length < 3) notes.push('CLICKABLE_REFERENCES<3');
    if (hero.length < 5) notes.push('HERO_BULLETS<5');
    if (missingSections.length > 0) notes.push('SECOES_OBRIGATORIAS_FALTANDO');
    if (!firstFoldMirrorOk) notes.push('FIRST_FOLD_MIRROR_FRACO');
    if (editorialSignalsOk < 5) notes.push('SINAL_EDITORIAL_BAIXO');

    let classification: FinalClass;
    const block =
      faq.length < 5 ||
      paraQueServe.length < 5 ||
      refs.length < 3 ||
      clickableRefs.length < 3 ||
      hero.length < 5;
    if (block) {
      classification = 'BLOQUEAR';
    } else if (missingSections.length > 0 || !firstFoldMirrorOk) {
      classification = 'AJUSTE_ESTRUTURAL';
    } else if (editorialSignalsOk < 5) {
      classification = 'AJUSTE_EDITORIAL';
    } else {
      classification = 'OK_FINAL';
    }

    report.push({
      sku,
      productName,
      objective,
      classification,
      heroBullets: hero.length,
      faqCount: faq.length,
      paraQueServeCount: paraQueServe.length,
      referencesCount: refs.length,
      clickableReferencesCount: clickableRefs.length,
      missingSections,
      firstFoldMirrorOk,
      editorialSignalsOk,
      notes,
    });
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    total: report.length,
    okFinal: report.filter((r) => r.classification === 'OK_FINAL').length,
    ajusteEditorial: report.filter((r) => r.classification === 'AJUSTE_EDITORIAL').length,
    ajusteEstrutural: report.filter((r) => r.classification === 'AJUSTE_ESTRUTURAL').length,
    bloquear: report.filter((r) => r.classification === 'BLOQUEAR').length,
  };

  fs.mkdirSync(path.dirname(OUTPUT_JSON), { recursive: true });
  fs.writeFileSync(OUTPUT_JSON, JSON.stringify({ summary, items: report }, null, 2), 'utf-8');
  fs.writeFileSync(OUTPUT_CSV, toCsv(report), 'utf-8');

  console.log('✅ Auditoria final concluída');
  console.log(`   Total: ${summary.total}`);
  console.log(`   OK_FINAL: ${summary.okFinal}`);
  console.log(`   AJUSTE_EDITORIAL: ${summary.ajusteEditorial}`);
  console.log(`   AJUSTE_ESTRUTURAL: ${summary.ajusteEstrutural}`);
  console.log(`   BLOQUEAR: ${summary.bloquear}`);
  console.log(`   JSON: ${OUTPUT_JSON}`);
  console.log(`   CSV: ${OUTPUT_CSV}`);
}

main();
