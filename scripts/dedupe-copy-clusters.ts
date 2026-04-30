#!/usr/bin/env tsx
/**
 * Deduplicação entre SKUs irmãos — reduz similaridade no mesmo cluster.
 * Força ângulo diferente, público diferente, comparação explícita.
 * Uso: pnpm run copy:dedupe-clusters
 */

import * as fs from 'fs';
import * as path from 'path';
import { parseCSV, writeCSV } from './lib/copy-utils';

const V4_PATH = path.join(process.cwd(), 'data', 'store-v2', 'copy', 'copy-blueprint-v4.csv');
const REPORT_PATH = path.join(process.cwd(), 'scripts', 'generated', 'copy-v4-dedupe-report.json');

function similarity(a: string, b: string): number {
  if (!a || !b) return 0;
  const sa = new Set(a.toLowerCase().split(/\s+/).filter((w) => w.length > 2));
  const sb = new Set(b.toLowerCase().split(/\s+/).filter((w) => w.length > 2));
  let inter = 0;
  for (const w of sa) {
    if (sb.has(w)) inter++;
  }
  const union = sa.size + sb.size - inter;
  return union === 0 ? 0 : inter / union;
}

function main() {
  if (!fs.existsSync(V4_PATH)) {
    console.error('❌ copy-blueprint-v4.csv não encontrado.');
    process.exit(1);
  }

  const content = fs.readFileSync(V4_PATH, 'utf-8');
  const { headers, rows } = parseCSV(content);

  const byObjective = new Map<string, Record<string, string>[]>();
  for (const row of rows) {
    const obj = row.objective?.trim() || 'Outros';
    if (!byObjective.has(obj)) byObjective.set(obj, []);
    byObjective.get(obj)!.push(row);
  }

  const report: {
    generatedAt: string;
    clustersAnalyzed: number;
    pairsWithHighSimilarity: { cluster: string; sku1: string; sku2: string; field: string; sim: number }[];
    changes: { sku: string; field: string; reason: string }[];
  } = {
    generatedAt: new Date().toISOString(),
    clustersAnalyzed: byObjective.size,
    pairsWithHighSimilarity: [],
    changes: [],
  };

  const SIM_THRESHOLD = 0.65;

  for (const [objective, clusterRows] of byObjective) {
    if (clusterRows.length < 2) continue;

    for (const field of ['hero_benefit', 'shortBenefit', 'what_makes_this_formula_different', 'comparison_note']) {
      for (let i = 0; i < clusterRows.length; i++) {
        for (let j = i + 1; j < clusterRows.length; j++) {
          const r1 = clusterRows[i];
          const r2 = clusterRows[j];
          const v1 = r1[field] ?? '';
          const v2 = r2[field] ?? '';
          if (!v1 || !v2) continue;

          const sim = similarity(v1, v2);
          if (sim >= SIM_THRESHOLD) {
            report.pairsWithHighSimilarity.push({
              cluster: objective,
              sku1: r1.sku ?? '',
              sku2: r2.sku ?? '',
              field,
              sim: Math.round(sim * 100) / 100,
            });

            const name1 = r1.productName ?? r1.sku;
            const name2 = r2.productName ?? r2.sku;
            const dose1 = r1.dose ?? '';
            const dose2 = r2.dose ?? '';

            if (field === 'comparison_note' && !r1.comparison_note?.trim()) {
              r1.comparison_note = `Versão ${dose1}. Para dose ${dose2}, veja ${name2}.`;
              report.changes.push({ sku: r1.sku ?? '', field: 'comparison_note', reason: 'added_diff' });
            }
            if (field === 'comparison_note' && !r2.comparison_note?.trim()) {
              r2.comparison_note = `Versão ${dose2}. Para dose ${dose1}, veja ${name1}.`;
              report.changes.push({ sku: r2.sku ?? '', field: 'comparison_note', reason: 'added_diff' });
            }

            if (field === 'what_makes_this_formula_different' && (!r1.what_makes_this_formula_different || r1.what_makes_this_formula_different === r2.what_makes_this_formula_different)) {
              const diff = r1.dose ? `Dose ${r1.dose} — ponto de partida para quem busca ${objective}.` : `Fórmula específica para ${objective}.`;
              r1.what_makes_this_formula_different = diff;
              report.changes.push({ sku: r1.sku ?? '', field: 'what_makes_this_formula_different', reason: 'forced_diff' });
            }
          }
        }
      }
    }
  }

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(V4_PATH, writeCSV(headers, rows), 'utf-8');
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), 'utf-8');

  console.log('✅ Deduplicação concluída');
  console.log(`   Clusters: ${report.clustersAnalyzed}`);
  console.log(`   Pares com alta similaridade: ${report.pairsWithHighSimilarity.length}`);
  console.log(`   Alterações: ${report.changes.length}`);
  console.log(`   Relatório: ${REPORT_PATH}`);
}

main();
