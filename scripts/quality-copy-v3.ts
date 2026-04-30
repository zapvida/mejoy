#!/usr/bin/env tsx
/**
 * Gera relatório de qualidade editorial do copy-blueprint-v3.
 * Uso: pnpm run copy:quality:v3
 */

import * as fs from 'fs';
import * as path from 'path';

const V3_PATH = path.join(process.cwd(), 'data', 'store-v2', 'copy', 'copy-blueprint-v3.csv');
const REPORT_PATH = path.join(process.cwd(), 'scripts', 'generated', 'copy-v3-quality-report.json');

const PRIORITY_SKUS = [
  ...Array.from({ length: 11 }, (_, i) => `MEJOY-0${152 + i}`),
  ...Array.from({ length: 11 }, (_, i) => `MEJOY-0${141 + i}`),
  ...Array.from({ length: 9 }, (_, i) => `MEJOY-0${132 + i}`),
];

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

function main() {
  if (!fs.existsSync(V3_PATH)) {
    console.error('❌ copy-blueprint-v3.csv não encontrado');
    process.exit(1);
  }

  const rows = parseCSV(fs.readFileSync(V3_PATH, 'utf-8'));

  const byObjective = new Map<string, Record<string, string>[]>();
  for (const row of rows) {
    const obj = row.objective ?? 'Outros';
    const list = byObjective.get(obj) ?? [];
    list.push(row);
    byObjective.set(obj, list);
  }

  const repetitionIssues: { sku: string; cluster: string; heroSimilarTo: string }[] = [];
  for (const [obj, list] of byObjective) {
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const a = (list[i].hero_benefit ?? '').toLowerCase();
        const b = (list[j].hero_benefit ?? '').toLowerCase();
        const wordsA = new Set(a.split(/\s+/).filter((w) => w.length > 4));
        const wordsB = new Set(b.split(/\s+/).filter((w) => w.length > 4));
        const overlap = [...wordsA].filter((w) => wordsB.has(w)).length;
        const minWords = Math.min(wordsA.size, wordsB.size);
        if (minWords > 0 && overlap / minWords > 0.8) {
          repetitionIssues.push({
            sku: list[j].sku ?? '',
            cluster: obj,
            heroSimilarTo: list[i].sku ?? '',
          });
        }
      }
    }
  }

  const needsReview: string[] = [];
  for (const row of rows) {
    const score = parseInt(row.editorial_score ?? '0', 10);
    const diff = parseInt(row.differentiation_score ?? '0', 10);
    const hasScience = (row.science_summary ?? '').trim().length > 0;
    if (PRIORITY_SKUS.includes(row.sku ?? '') && (!hasScience || score < 60 || diff < 50)) {
      needsReview.push(row.sku ?? '');
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    totalProducts: rows.length,
    priorityClustersEnriched: ['Sono', 'Menopausa & TPM', 'Lipedema'],
    repetitionIssues: repetitionIssues.length,
    repetitionDetails: repetitionIssues.slice(0, 20),
    needsHumanReview: [...new Set(needsReview)],
    avgEditorialScore: Math.round(
      rows.reduce((s, r) => s + parseInt(r.editorial_score ?? '0', 10), 0) / rows.length
    ),
    avgDifferentiationScore: Math.round(
      rows.reduce((s, r) => s + parseInt(r.differentiation_score ?? '0', 10), 0) / rows.length
    ),
  };

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), 'utf-8');

  console.log('✅ Relatório de qualidade v3 gerado');
  console.log(`   Produtos: ${report.totalProducts}`);
  console.log(`   Média editorial_score: ${report.avgEditorialScore}`);
  console.log(`   Média differentiation_score: ${report.avgDifferentiationScore}`);
  console.log(`   Repetições detectadas: ${report.repetitionIssues}`);
  console.log(`   Revisão humana sugerida: ${report.needsHumanReview.length} SKUs`);
  console.log(`   Relatório: ${REPORT_PATH}`);
}

main();
