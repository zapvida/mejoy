#!/usr/bin/env tsx
/**
 * Mescla export do Supabase (products) com pricing-content-v1 (priceCents).
 * Uso: pnpm catalog:merge SUPABASE_EXPORT.csv
 *
 * O export do Supabase tem: sku, shortBenefit, description, seoTitle, seoDescription
 * (sem priceCents). Este script adiciona priceCents e compareAtCents do pricing existente.
 *
 * Saída: data/store-v2/pricing-content-v1.csv (sobrescreve ou --output)
 */

import * as fs from 'fs';
import * as path from 'path';

const PRICING_CSV_PATH = path.join(process.cwd(), 'data', 'store-v2', 'pricing-content-v1.csv');

function parseCSV(content: string): Record<string, string>[] {
  const lines = content.split(/\r?\n/).filter((l) => l.length > 0);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map((h) => h.trim());
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

function escapeCsv(s: string): string {
  if (!s) return '';
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${(s || '').replace(/"/g, '""')}"`;
  }
  return s;
}

function main() {
  const supabasePath = process.argv[2];
  const outputArg = process.argv[3];
  const outputPath =
    outputArg === '--overwrite'
      ? PRICING_CSV_PATH
      : outputArg
        ? path.resolve(outputArg)
        : path.join(path.dirname(PRICING_CSV_PATH), 'pricing-content-merged.csv');

  if (!supabasePath || !fs.existsSync(supabasePath)) {
    console.error('Uso: pnpm catalog:merge <SUPABASE_EXPORT.csv> [caminho_saida | --overwrite]');
    console.error('  --overwrite: sobrescreve pricing-content-v1.csv');
    console.error('  caminho_saida: grava em arquivo específico (padrão: pricing-content-merged.csv)');
    process.exit(1);
  }

  const supabaseContent = fs.readFileSync(supabasePath, 'utf-8');
  const supabaseRows = parseCSV(supabaseContent);

  const pricingBySku = new Map<
    string,
    { priceCents: string; compareAtCents: string; shortBenefit: string; description: string; seoTitle: string; seoDescription: string }
  >();
  if (fs.existsSync(PRICING_CSV_PATH)) {
    const pricingContent = fs.readFileSync(PRICING_CSV_PATH, 'utf-8');
    const pricingRows = parseCSV(pricingContent);
    for (const p of pricingRows) {
      const sku = (p.sku || '').trim();
      if (sku)
        pricingBySku.set(sku, {
          priceCents: p.priceCents || '9900',
          compareAtCents: p.compareAtCents || '',
          shortBenefit: p.shortBenefit || '',
          description: p.description || '',
          seoTitle: p.seoTitle || '',
          seoDescription: p.seoDescription || '',
        });
    }
  }

  const header = 'sku,priceCents,nome,compareAtCents,shortBenefit,description,seoTitle,seoDescription';
  const lines: string[] = [header];

  const isEmpty = (s: string) => !s || s.trim() === '' || s.toLowerCase() === 'null';

  for (const r of supabaseRows) {
    const sku = (r.sku || '').trim();
    if (!sku) continue;
    const pricing = pricingBySku.get(sku) || {
      priceCents: '9900',
      compareAtCents: '',
      shortBenefit: '',
      description: '',
      seoTitle: '',
      seoDescription: '',
    };
    // Prefer Supabase quando preenchido; senão usa pricing existente
    const shortBenefit = !isEmpty(r.shortBenefit) ? (r.shortBenefit || '').replace(/Moonjoy/gi, 'Me Joy') : pricing.shortBenefit;
    const description = !isEmpty(r.description) ? (r.description || '').replace(/Moonjoy/gi, 'Me Joy') : pricing.description;
    const seoTitle = !isEmpty(r.seoTitle) ? (r.seoTitle || '').replace(/Moonjoy/gi, 'Me Joy') : pricing.seoTitle;
    const seoDescription = !isEmpty(r.seoDescription) ? (r.seoDescription || '').replace(/Moonjoy/gi, 'Me Joy') : pricing.seoDescription;
    const nome = (seoTitle || '').replace(/\s*\|\s*Me Joy\s*$/i, '').trim() || (pricing.seoTitle || '').replace(/\s*\|\s*Me Joy\s*$/i, '').trim();
    lines.push(
      [
        sku,
        pricing.priceCents,
        escapeCsv(nome || sku),
        pricing.compareAtCents,
        escapeCsv(shortBenefit || 'Fórmula manipulada com qualidade. Entrega nacional.'),
        escapeCsv(description || shortBenefit || 'Fórmula manipulada. Use conforme orientação profissional.'),
        escapeCsv(seoTitle || `${sku} | Me Joy`),
        escapeCsv(seoDescription || 'Fórmula manipulada. Entrega em todo Brasil. Me Joy.'),
      ].join(',')
    );
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, lines.join('\n'));
  console.log('✅ CSV mesclado:', outputPath);
  console.log('   Linhas:', lines.length - 1);
  if (outputPath !== PRICING_CSV_PATH) {
    console.log('   Para usar: cp', outputPath, PRICING_CSV_PATH);
  }
  console.log('   Próximo passo: pnpm catalog:pricing:sql');
}

main();
