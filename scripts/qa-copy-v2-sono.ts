#!/usr/bin/env tsx
/**
 * QA do piloto Copy v2 — cluster Sono.
 * Verifica integridade dos dados v2 para as 11 PDPs do piloto.
 * Uso: pnpm run copy:qa-sono
 */

import * as fs from 'fs';
import * as path from 'path';

const V2_PATH = path.join(process.cwd(), 'data', 'store-v2', 'copy', 'copy-blueprint-v2.csv');
const CATALOG_REPORT = path.join(process.cwd(), 'scripts', 'generated', 'catalog-report.json');
const REPORT_PATH = path.join(process.cwd(), 'scripts', 'generated', 'copy-v2-sono-qa-report.json');

const SONO_SKUS = [
  'MEJOY-0152', 'MEJOY-0153', 'MEJOY-0154', 'MEJOY-0155', 'MEJOY-0156',
  'MEJOY-0157', 'MEJOY-0158', 'MEJOY-0159', 'MEJOY-0160', 'MEJOY-0161', 'MEJOY-0162',
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
  const report: {
    generatedAt: string;
    flag: { name: string; expected: string; note: string };
    sonoPilot: { sku: string; productName: string; slug: string | null; checks: Record<string, { ok: boolean; value?: string; issue?: string }> }[];
    summary: { total: number; passed: number; failed: number; issues: string[] };
  } = {
    generatedAt: new Date().toISOString(),
    flag: {
      name: 'NEXT_PUBLIC_COPY_V2_PILOT',
      expected: '1',
      note: 'Verificar manualmente em .env.local e Vercel Production',
    },
    sonoPilot: [],
    summary: { total: 0, passed: 0, failed: 0, issues: [] },
  };

  if (!fs.existsSync(V2_PATH)) {
    report.summary.issues.push('copy-blueprint-v2.csv não encontrado');
    fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
    fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), 'utf-8');
    console.error('❌ copy-blueprint-v2.csv não encontrado');
    process.exit(1);
  }

  const v2Content = fs.readFileSync(V2_PATH, 'utf-8');
  const v2Rows = parseCSV(v2Content);
  const v2BySku = new Map<string, Record<string, string>>();
  for (const row of v2Rows) {
    const sku = (row.sku ?? '').trim();
    if (sku) v2BySku.set(sku, row);
  }

  let slugMap: Record<string, string> = {};
  if (fs.existsSync(CATALOG_REPORT)) {
    try {
      const cat = JSON.parse(fs.readFileSync(CATALOG_REPORT, 'utf-8'));
      const slugs = (cat.slugs ?? []) as { sku: string; slug: string }[];
      slugMap = Object.fromEntries(slugs.map((s) => [s.sku, s.slug]));
    } catch {
      report.summary.issues.push('catalog-report.json inválido ou ausente');
    }
  }

  const requiredFields = ['hero_benefit', 'shortBenefit', 'description_md', 'faq', 'cautions', 'seoTitle', 'seoDescription', 'seo_h1'];

  for (const sku of SONO_SKUS) {
    const row = v2BySku.get(sku);
    const slug = slugMap[sku] ?? null;
    const checks: Record<string, { ok: boolean; value?: string; issue?: string }> = {};

    if (!row) {
      report.sonoPilot.push({
        sku,
        productName: '?',
        slug,
        checks: { _missing: { ok: false, issue: 'SKU não encontrado no v2' } },
      });
      report.summary.failed++;
      report.summary.issues.push(`${sku}: não encontrado no v2`);
      continue;
    }

    const productName = row.productName ?? row.normalizedProductName ?? '?';

    for (const field of requiredFields) {
      const val = (row[field] ?? '').trim();
      const ok = val.length > 0;
      checks[field] = ok ? { ok: true, value: val.length > 80 ? val.slice(0, 80) + '...' : val } : { ok: false, issue: 'vazio' };
    }

    const faqPairs = (row.faq ?? '').split(/\s*\|\s*/).filter(Boolean);
    const faqOk = faqPairs.length >= 4;
    checks.faq_pairs = faqOk ? { ok: true, value: `${faqPairs.length / 2} pares Q&A` } : { ok: false, issue: `apenas ${faqPairs.length} partes (mín. 4)` };

    const allOk = Object.values(checks).every((c) => c.ok);
    report.sonoPilot.push({ sku, productName, slug, checks });
    report.summary.total++;
    if (allOk) report.summary.passed++;
    else report.summary.failed++;
  }

  report.summary.issues.push(...report.sonoPilot.filter((p) => Object.values(p.checks).some((c) => !c.ok)).map((p) => `${p.sku}: campos incompletos`));

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), 'utf-8');

  console.log('✅ QA Copy v2 Sono concluído');
  console.log(`   Total: ${report.summary.total}`);
  console.log(`   OK: ${report.summary.passed}`);
  console.log(`   Com issues: ${report.summary.failed}`);
  console.log(`   Relatório: ${REPORT_PATH}`);
}

main();
