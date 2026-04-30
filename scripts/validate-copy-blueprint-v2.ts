#!/usr/bin/env tsx
/**
 * Valida copy-blueprint-v2.csv com Quality Gates.
 * Uso: pnpm run copy:validate:v2
 */

import * as fs from 'fs';
import * as path from 'path';

const BLUEPRINT_PATH = path.join(process.cwd(), 'data', 'store-v2', 'copy', 'copy-blueprint-v2.csv');
const REPORT_PATH = path.join(process.cwd(), 'scripts', 'generated', 'copy-blueprint-v2-report.json');

const REQUIRED_COLUMNS = [
  'sku',
  'productName',
  'normalizedProductName',
  'objective',
  'niche',
  'primaryActive',
  'hero_benefit',
  'shortBenefit',
  'description_md',
  'faq',
  'cautions',
  'seoTitle',
  'seoDescription',
  'seo_h1',
  'keywords_primary',
  'keywords_secondary',
  'compliance_risk',
  'medical_review_needed',
  'review_status',
];

const FORBIDDEN_TERMS = /cura|trata|garante|100%|reverte|resultado em \d|sem efeitos colaterais/i;

const BAD_TOKENS = [/5-Htp\b/, /\baswhaganda\b/i, /\bindiando\b/i, /MáLico/, /MagnéSio/, /\bSelêNio\b/];

const REQUIRED_SECTIONS = ['## O que é', '## Para quem pode fazer sentido', '## Diferenciais da fórmula', '## Como usar', '## Cuidados'];

const DISCLAIMER_SNIPPET = 'Este produto não substitui uma alimentação equilibrada e hábitos saudáveis';

const VALID_COMPLIANCE = ['low', 'medium', 'high'];
const VALID_REVIEW = ['draft', 'needs_review', 'approved'];

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
    console.error('❌ Blueprint v2 não encontrado:', BLUEPRINT_PATH);
    process.exit(1);
  }

  const content = fs.readFileSync(BLUEPRINT_PATH, 'utf-8');
  const rows = parseCSV(content);

  const errors: string[] = [];

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
      errors.push(`${sku}: contém termo proibido`);
    }

    for (const bad of BAD_TOKENS) {
      if (bad.test(fullRow)) {
        errors.push(`${sku}: token malformado`);
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
      errors.push(`${sku}: description_md sem disclaimer`);
    }

    const compliance = (row.compliance_risk ?? '').toLowerCase();
    if (!VALID_COMPLIANCE.includes(compliance)) {
      errors.push(`${sku}: compliance_risk inválido: ${row.compliance_risk}`);
    }

    const review = (row.review_status ?? '').toLowerCase();
    if (!VALID_REVIEW.includes(review)) {
      errors.push(`${sku}: review_status inválido: ${row.review_status}`);
    }
  }

  if (errors.length > 0) {
    console.error('❌ QUALITY GATE FALHOU:');
    errors.slice(0, 25).forEach((e) => console.error('   ', e));
    if (errors.length > 25) console.error(`   ... e mais ${errors.length - 25} erro(s)`);
    process.exit(1);
  }

  console.log('✅ Copy Blueprint v2 validado');
  console.log(`   Linhas: ${rows.length}`);
}

main();
