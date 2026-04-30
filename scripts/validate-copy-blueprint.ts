#!/usr/bin/env tsx
/**
 * Valida copy-blueprint-v1.csv com Quality Gates.
 * Falha se: linhas != 162, campo vazio, seoDescription > 155, termos proibidos, tokens errados, seções faltando.
 * Uso: pnpm run copy:validate
 */

import * as fs from 'fs';
import * as path from 'path';

const BLUEPRINT_PATH = path.join(process.cwd(), 'data', 'store-v2', 'copy', 'copy-blueprint-v1.csv');
const REPORT_PATH = path.join(process.cwd(), 'scripts', 'generated', 'copy-blueprint-report.json');

const REQUIRED_COLUMNS = [
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

const FORBIDDEN_TERMS = /cura|trata|garante|100%|reverte|resultado em \d|sem efeitos colaterais/i;

const BAD_TOKENS = [
  /5-Htp\b/,
  /\baswhaganda\b/i,
  /\bindiando\b/i,
  /MáLico/,
  /MagnéSio/,
  /\bEquilíBrio\b/,
  /\bFóRmula\b/,
  /\bColáGeno\b/,
  /\bTrimagnéSio\b/,
];

const REQUIRED_SECTIONS = ['## O que é', '## Principais benefícios', '## Como usar', '## Cuidados'];

const DISCLAIMER_SNIPPET = 'Este produto não substitui uma alimentação equilibrada e hábitos saudáveis';

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
    console.error('❌ Blueprint não encontrado:', BLUEPRINT_PATH);
    process.exit(1);
  }

  const content = fs.readFileSync(BLUEPRINT_PATH, 'utf-8');
  const rows = parseCSV(content);

  const errors: string[] = [];
  const warnings: string[] = [];

  if (rows.length !== 162) {
    errors.push(`Linhas de dados: ${rows.length} (esperado: 162)`);
  }

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const sku = row.sku ?? `linha ${i + 2}`;

    for (const col of REQUIRED_COLUMNS) {
      const val = (row[col] ?? '').trim();
      if (!val) {
        errors.push(`${sku}: campo obrigatório vazio: ${col}`);
      }
    }

    const seoDesc = (row.seoDescription ?? '').trim();
    if (seoDesc.length > 155) {
      errors.push(`${sku}: seoDescription tem ${seoDesc.length} chars (máx 155)`);
    }

    const fullRow = JSON.stringify(row);
    if (FORBIDDEN_TERMS.test(fullRow)) {
      errors.push(`${sku}: contém termo proibido (cura/trata/garante/100%/reverte/etc)`);
    }

    for (const bad of BAD_TOKENS) {
      if (bad.test(fullRow)) {
        errors.push(`${sku}: token errado (5-Htp, aswhaganda, indiando, MáLico, etc)`);
        break;
      }
    }

    const descMd = (row.description_md ?? '').trim();
    for (const section of REQUIRED_SECTIONS) {
      if (!descMd.includes(section)) {
        errors.push(`${sku}: description_md sem seção "${section}"`);
      }
    }
    if (!descMd.includes(DISCLAIMER_SNIPPET)) {
      errors.push(`${sku}: description_md sem disclaimer obrigatório`);
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    totalRows: rows.length,
    expectedRows: 162,
    valid: errors.length === 0,
    errorCount: errors.length,
    warningCount: warnings.length,
    errors: errors.slice(0, 50),
    warnings: warnings.slice(0, 20),
  };

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), 'utf-8');

  if (errors.length > 0) {
    console.error('❌ QUALITY GATE FALHOU:');
    errors.slice(0, 20).forEach((e) => console.error('   ', e));
    if (errors.length > 20) {
      console.error(`   ... e mais ${errors.length - 20} erro(s)`);
    }
    console.error(`\nRelatório: ${REPORT_PATH}`);
    process.exit(1);
  }

  console.log('✅ Copy Blueprint validado com sucesso');
  console.log(`   Linhas: ${rows.length}`);
  console.log(`   Relatório: ${REPORT_PATH}`);
}

main();
