#!/usr/bin/env tsx
/**
 * Valida copy-blueprint-v3.csv com Quality Gates.
 * Uso: pnpm run copy:validate:v3
 */

import * as fs from 'fs';
import * as path from 'path';

const BLUEPRINT_PATH = path.join(process.cwd(), 'data', 'store-v2', 'copy', 'copy-blueprint-v3.csv');
const REPORT_PATH = path.join(process.cwd(), 'scripts', 'generated', 'copy-blueprint-v3-report.json');

const V3_EXTRA_COLUMNS = [
  'search_intent_primary',
  'search_intent_secondary',
  'top_questions_real',
  'science_summary',
  'evidence_level',
  'best_fit_profile',
  'not_for_whom',
  'what_makes_this_formula_different',
  'comparison_note',
  'content_angle',
  'blog_support_topics',
  'internal_link_targets',
  'editorial_score',
  'semantic_depth_score',
  'differentiation_score',
];

const FORBIDDEN_TERMS = /cura|trata|garante|100%|reverte|resultado em \d|sem efeitos colaterais/i;
const VALID_EVIDENCE = ['', 'emerging', 'moderate', 'strong'];

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
  if (!fs.existsSync(BLUEPRINT_PATH)) {
    console.error('❌ Copy Blueprint v3 não encontrado:', BLUEPRINT_PATH);
    process.exit(1);
  }

  const content = fs.readFileSync(BLUEPRINT_PATH, 'utf-8');
  const rows = parseCSV(content);
  const headers = content.split(/\r?\n/)[0]?.split(',') ?? [];

  const errors: string[] = [];
  const warnings: string[] = [];

  if (rows.length !== 162) {
    errors.push(`Linhas de dados: ${rows.length} (esperado: 162)`);
  }

  for (const col of V3_EXTRA_COLUMNS) {
    if (!headers.includes(col)) {
      errors.push(`Coluna v3 ausente: ${col}`);
    }
  }

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const sku = row.sku ?? `linha ${i + 2}`;

    if (FORBIDDEN_TERMS.test(row.hero_benefit ?? '')) {
      errors.push(`${sku}: hero_benefit contém termo proibido`);
    }
    if (FORBIDDEN_TERMS.test(row.description_md ?? '')) {
      errors.push(`${sku}: description_md contém termo proibido`);
    }

    const evidence = (row.evidence_level ?? '').trim();
    if (evidence && !VALID_EVIDENCE.includes(evidence)) {
      warnings.push(`${sku}: evidence_level inválido: ${evidence}`);
    }

    const editorialScore = parseInt(row.editorial_score ?? '0', 10);
    if (Number.isNaN(editorialScore) || editorialScore < 0 || editorialScore > 100) {
      warnings.push(`${sku}: editorial_score inválido`);
    }
  }

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(
    REPORT_PATH,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        totalRows: rows.length,
        errors,
        warnings,
        valid: errors.length === 0,
      },
      null,
      2
    ),
    'utf-8'
  );

  if (errors.length > 0) {
    console.error('❌ Copy Blueprint v3 — validação falhou');
    errors.forEach((e) => console.error('   ', e));
    process.exit(1);
  }

  console.log('✅ Copy Blueprint v3 validado');
  console.log(`   Linhas: ${rows.length}`);
  if (warnings.length > 0) {
    console.log(`   Avisos: ${warnings.length}`);
  }
  console.log(`   Relatório: ${REPORT_PATH}`);
}

main();
