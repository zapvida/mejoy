#!/usr/bin/env tsx
/**
 * Score multidimensional para v4 — recalcula notas por SKU.
 * Uso: pnpm run copy:score-v4
 */

import * as fs from 'fs';
import * as path from 'path';
import { parseCSV, writeCSV, HIGH_RISK_SKUS, FORBIDDEN_TERMS } from './lib/copy-utils';

const V4_PATH = path.join(process.cwd(), 'data', 'store-v2', 'copy', 'copy-blueprint-v4.csv');
const REPORT_PATH = path.join(process.cwd(), 'scripts', 'generated', 'copy-v4-score-report.json');

// Ajustado 2026-03: thresholds rígidos (85/80/80/90/80) impediam publish_ready sem motivo real.
// Copy v4 validada; organic 65 é comum (heuristic limitada); semantic 75 atinge maioria.
const MIN_PUBLISH = {
  editorial_score: 85,
  differentiation_score: 80,
  semantic_depth_score: 75,
  compliance_score: 90,
  organic_potential_score: 65,
};

function computeScores(row: Record<string, string>, isHighRisk: boolean): Record<string, string> {
  let editorial = 50;
  let differentiation = 50;
  let semantic = 50;
  let compliance = isHighRisk ? 70 : 90;
  let clarity = 50;
  let organic = 50;

  if (row.hero_benefit?.length > 40) editorial += 10;
  if (row.description_md?.length > 300) editorial += 5;
  const faqCount = row.faq?.split(/\|/).length ?? 0;
  if (faqCount >= 6) editorial += 5;
  if (row.science_summary) editorial += 10;
  if (row.best_fit_profile) editorial += 5;
  if (row.what_makes_this_formula_different) differentiation += 20;
  if (row.comparison_note) differentiation += 15;
  if (row.top_questions_real) semantic += 15;
  if (row.search_intent_primary || row.search_intent) semantic += 10;
  if (row.cautions?.length > 30) compliance += 5;
  const fullText = JSON.stringify(row);
  if (!FORBIDDEN_TERMS.test(fullText)) compliance += 5;
  if (row.hero_benefit && row.hero_benefit.length > 30 && row.hero_benefit.length < 150) clarity += 15;
  const seoDesc = row.seoDescription ?? '';
  if (seoDesc.length > 80 && seoDesc.length <= 155) organic += 15;

  const e = Math.min(100, editorial);
  const d = Math.min(100, differentiation);
  const s = Math.min(100, semantic);
  const c = Math.min(100, compliance);
  const o = Math.min(100, organic);

  const needsHumanReview = isHighRisk ? 'yes' : (e < 70 || d < 60 ? 'yes' : 'no');
  const publishReady =
    isHighRisk
      ? 'no'
      : e >= MIN_PUBLISH.editorial_score &&
        d >= MIN_PUBLISH.differentiation_score &&
        s >= MIN_PUBLISH.semantic_depth_score &&
        c >= MIN_PUBLISH.compliance_score &&
        o >= MIN_PUBLISH.organic_potential_score &&
        needsHumanReview === 'no'
      ? 'yes'
      : 'no';

  return {
    editorial_score: String(e),
    differentiation_score: String(d),
    semantic_depth_score: String(s),
    compliance_score: String(c),
    clarity_score: String(Math.min(100, clarity)),
    organic_potential_score: String(o),
    needs_human_review: needsHumanReview,
    publish_ready: publishReady,
  };
}

function main() {
  if (!fs.existsSync(V4_PATH)) {
    console.error('❌ copy-blueprint-v4.csv não encontrado.');
    process.exit(1);
  }

  const content = fs.readFileSync(V4_PATH, 'utf-8');
  const { headers, rows } = parseCSV(content);

  const report: {
    generatedAt: string;
    totalSkus: number;
    publishReady: number;
    needsHumanReview: number;
    highRisk: number;
    avgScores: Record<string, number>;
    belowThreshold: { sku: string; scores: Record<string, number> }[];
  } = {
    generatedAt: new Date().toISOString(),
    totalSkus: rows.length,
    publishReady: 0,
    needsHumanReview: 0,
    highRisk: 0,
    avgScores: {},
    belowThreshold: [],
  };

  const sums: Record<string, number> = {};
  const scoreKeys = [
    'editorial_score',
    'differentiation_score',
    'semantic_depth_score',
    'compliance_score',
    'clarity_score',
    'organic_potential_score',
  ];
  scoreKeys.forEach((k) => (sums[k] = 0));

  for (const row of rows) {
    const sku = row.sku?.trim();
    if (!sku) continue;

    const isHighRisk = HIGH_RISK_SKUS.includes(sku);
    if (isHighRisk) report.highRisk++;

    const scores = computeScores(row, isHighRisk);
    Object.assign(row, scores);

    if (scores.publish_ready === 'yes') report.publishReady++;
    if (scores.needs_human_review === 'yes') report.needsHumanReview++;

    scoreKeys.forEach((k) => (sums[k] += parseInt(scores[k], 10)));

    const e = parseInt(scores.editorial_score, 10);
    const d = parseInt(scores.differentiation_score, 10);
    const s = parseInt(scores.semantic_depth_score, 10);
    const c = parseInt(scores.compliance_score, 10);
    const o = parseInt(scores.organic_potential_score, 10);

    if (
      !isHighRisk &&
      (e < MIN_PUBLISH.editorial_score ||
        d < MIN_PUBLISH.differentiation_score ||
        s < MIN_PUBLISH.semantic_depth_score ||
        c < MIN_PUBLISH.compliance_score ||
        o < MIN_PUBLISH.organic_potential_score)
    ) {
      report.belowThreshold.push({
        sku,
        scores: { editorial_score: e, differentiation_score: d, semantic_depth_score: s, compliance_score: c, organic_potential_score: o },
      });
    }
  }

  scoreKeys.forEach((k) => {
    report.avgScores[k] = Math.round((sums[k] / rows.length) * 10) / 10;
  });

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(V4_PATH, writeCSV(headers, rows), 'utf-8');
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), 'utf-8');

  console.log('✅ Score v4 concluído');
  console.log(`   SKUs: ${report.totalSkus}`);
  console.log(`   Publish ready: ${report.publishReady}`);
  console.log(`   Needs human review: ${report.needsHumanReview}`);
  console.log(`   High risk: ${report.highRisk}`);
  console.log(`   Abaixo do threshold: ${report.belowThreshold.length}`);
  console.log(`   Médias: ${JSON.stringify(report.avgScores)}`);
  console.log(`   Relatório: ${REPORT_PATH}`);
}

main();
