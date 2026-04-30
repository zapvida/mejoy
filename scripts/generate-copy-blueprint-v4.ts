#!/usr/bin/env tsx
/**
 * Gera copy-blueprint-v4.csv — camada final de publicação premium.
 * Consolida v2 + v3, adiciona campos de qualidade e compliance.
 * Uso: pnpm run copy:blueprint:v4
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  parseCSV,
  writeCSV,
  NL,
  HIGH_RISK_SKUS,
  FORBIDDEN_TERMS,
} from './lib/copy-utils';

const V2_PATH = path.join(process.cwd(), 'data', 'store-v2', 'copy', 'copy-blueprint-v2.csv');
const V3_PATH = path.join(process.cwd(), 'data', 'store-v2', 'copy', 'copy-blueprint-v3.csv');
const OUTPUT_PATH = path.join(process.cwd(), 'data', 'store-v2', 'copy', 'copy-blueprint-v4.csv');
const REPORT_PATH = path.join(process.cwd(), 'scripts', 'generated', 'copy-v4-generation-report.json');

const V4_HEADERS = [
  'sku', 'productName', 'normalizedProductName', 'objective', 'niche',
  'primaryActive', 'normalizedPrimaryActive', 'dose', 'normalizedDose',
  'formKey', 'normalizedFormDisplay', 'pack', 'normalizedPack',
  'hero_benefit', 'shortBenefit', 'problem_statement', 'who_is_it_for',
  'when_to_consider', 'differentiators', 'what_makes_this_formula_different',
  'comparison_note', 'best_fit_profile', 'not_for_whom',
  'science_summary', 'evidence_level', 'mechanism_summary', 'expectation_setting',
  'description_md', 'faq', 'cautions', 'compliance_notes',
  'seo_h1', 'seoTitle', 'seoDescription',
  'search_intent', 'search_intent_primary', 'search_intent_secondary', 'top_questions_real',
  'questions_people_ask', 'semantic_entities', 'blog_support_topics', 'internal_link_targets',
  'keywords_primary', 'keywords_secondary', 'internal_links',
  'compliance_risk', 'medical_review_needed', 'review_status', 'needs_catalog_review',
  'editorial_score', 'differentiation_score', 'semantic_depth_score',
  'compliance_score', 'clarity_score', 'organic_potential_score',
  'needs_human_review', 'publish_ready',
  'para_que_serve', 'references', 'how_to_use_bullets', 'advertencias_completo', 'video_url',
];

function loadCSV(p: string): { headers: string[]; rows: Record<string, string>[] } {
  if (!fs.existsSync(p)) return { headers: [], rows: [] };
  const content = fs.readFileSync(p, 'utf-8');
  return parseCSV(content);
}

function computeScores(row: Record<string, string>, isHighRisk: boolean): Record<string, string> {
  let editorial = 50;
  let differentiation = 50;
  let semantic = 50;
  let compliance = isHighRisk ? 70 : 90;
  let clarity = 50;
  let organic = 50;

  if (row.hero_benefit?.length > 40) editorial += 10;
  if (row.description_md?.length > 300) editorial += 5;
  if (row.faq?.split(/\|/).length >= 6) editorial += 5;
  if (row.science_summary) editorial += 10;
  if (row.best_fit_profile) editorial += 5;
  if (row.what_makes_this_formula_different) differentiation += 20;
  if (row.comparison_note) differentiation += 15;
  if (row.top_questions_real) semantic += 15;
  if (row.search_intent_primary) semantic += 10;
  if (row.cautions?.length > 30) compliance += 5;
  if (!FORBIDDEN_TERMS.test(JSON.stringify(row))) compliance += 5;
  if (row.hero_benefit?.length > 30 && row.hero_benefit?.length < 150) clarity += 15;
  if (row.seoDescription?.length > 80 && row.seoDescription?.length <= 155) organic += 15;

  return {
    editorial_score: String(Math.min(100, editorial)),
    differentiation_score: String(Math.min(100, differentiation)),
    semantic_depth_score: String(Math.min(100, semantic)),
    compliance_score: String(Math.min(100, compliance)),
    clarity_score: String(Math.min(100, clarity)),
    organic_potential_score: String(Math.min(100, organic)),
    needs_human_review: isHighRisk ? 'yes' : (editorial < 70 || differentiation < 60 ? 'yes' : 'no'),
    publish_ready: isHighRisk ? 'no' : (editorial >= 70 && differentiation >= 60 && compliance >= 85 ? 'yes' : 'no'),
  };
}

function main() {
  const v2 = loadCSV(V2_PATH);
  const v3 = loadCSV(V3_PATH);
  const existingV4 = loadCSV(OUTPUT_PATH);

  if (v2.rows.length === 0) {
    console.error('❌ copy-blueprint-v2.csv não encontrado ou vazio');
    process.exit(1);
  }

  const v3BySku = new Map<string, Record<string, string>>();
  for (const r of v3.rows) {
    const sku = r.sku?.trim();
    if (sku) v3BySku.set(sku, r);
  }

  const existingV4BySku = new Map<string, Record<string, string>>();
  for (const r of existingV4.rows) {
    const sku = r.sku?.trim();
    if (sku) existingV4BySku.set(sku, r);
  }

  const v4Rows: Record<string, string>[] = [];
  const report: { generatedAt: string; totalSkus: number; fromV3: number; highRisk: number; publishReady: number } = {
    generatedAt: new Date().toISOString(),
    totalSkus: 0,
    fromV3: 0,
    highRisk: 0,
    publishReady: 0,
  };

  for (const v2Row of v2.rows) {
    const sku = v2Row.sku?.trim();
    if (!sku) continue;

    const v3Row = v3BySku.get(sku) ?? {};
    const existingV4Row = existingV4BySku.get(sku) ?? {};
    const isHighRisk = HIGH_RISK_SKUS.includes(sku);

    const internalLinks = v2Row.internal_links ?? v3Row.internal_link_targets ?? '';
    const internalLinkTargets = v3Row.internal_link_targets ?? internalLinks;

    const v4: Record<string, string> = {
      ...v2Row,
      what_makes_this_formula_different: v3Row.what_makes_this_formula_different ?? '',
      comparison_note: v3Row.comparison_note ?? '',
      best_fit_profile: v3Row.best_fit_profile ?? v2Row.who_is_it_for ?? '',
      not_for_whom: v3Row.not_for_whom ?? '',
      science_summary: v3Row.science_summary ?? '',
      evidence_level: v3Row.evidence_level ?? '',
      mechanism_summary: '',
      expectation_setting: '',
      search_intent_primary: v3Row.search_intent_primary ?? v2Row.search_intent ?? '',
      search_intent_secondary: v3Row.search_intent_secondary ?? '',
      top_questions_real: v3Row.top_questions_real ?? v2Row.questions_people_ask ?? '',
      blog_support_topics: v3Row.blog_support_topics ?? '',
      internal_links: internalLinks,
      internal_link_targets: internalLinkTargets,
      para_que_serve: existingV4Row.para_que_serve ?? '',
      references: existingV4Row.references ?? '',
      how_to_use_bullets: existingV4Row.how_to_use_bullets ?? '',
      advertencias_completo: existingV4Row.advertencias_completo ?? '',
      video_url: existingV4Row.video_url ?? '',
    };

    const scores = computeScores(v4, isHighRisk);
    Object.assign(v4, scores);

    if (!v4.mechanism_summary && v4.science_summary) {
      v4.mechanism_summary = v4.science_summary.slice(0, 200);
    }
    if (!v4.expectation_setting) {
      v4.expectation_setting = 'Resultados variam conforme cada pessoa. Consulte um profissional de saúde antes do uso.';
    }

    v4Rows.push(v4);
    report.totalSkus++;
    if (Object.keys(v3Row).length > 0) report.fromV3++;
    if (isHighRisk) report.highRisk++;
    if (v4.publish_ready === 'yes') report.publishReady++;
  }

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });

  fs.writeFileSync(OUTPUT_PATH, writeCSV(V4_HEADERS, v4Rows), 'utf-8');
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), 'utf-8');

  console.log('✅ Copy Blueprint v4 gerado');
  console.log(`   Output: ${OUTPUT_PATH}`);
  console.log(`   SKUs: ${report.totalSkus}`);
  console.log(`   Com dados v3: ${report.fromV3}`);
  console.log(`   High risk: ${report.highRisk}`);
  console.log(`   Publish ready: ${report.publishReady}`);
  console.log(`   Relatório: ${REPORT_PATH}`);
}

main();
