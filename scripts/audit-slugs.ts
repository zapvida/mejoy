#!/usr/bin/env tsx
/**
 * Audita slugs: matriz (blueprint) vs DB.
 * Carrega .env.local para DATABASE_URL.
 * Gera relatório de divergências e SLUG_ALIASES para catalog.ts.
 * Uso: pnpm tsx scripts/audit-slugs.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';
config({ path: path.join(process.cwd(), '.env.local') });
import { prisma } from '../src/lib/prisma';

const V4_PATH = path.join(process.cwd(), 'data', 'store-v2', 'copy', 'copy-blueprint-v4.csv');
const OUTPUT = path.join(process.cwd(), 'scripts', 'generated', 'slug-audit.json');

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

function slugFromBlueprint(row: Record<string, string>): string {
  const base = (row.normalizedProductName || row.productName || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  const pack = (row.normalizedPack || row.pack || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return pack ? `${base}-${pack}` : base;
}

async function main() {
  const content = fs.readFileSync(V4_PATH, 'utf-8');
  const lines = content.split(/\r?\n/).filter((l) => l.length > 0);
  const headers = parseCSVLine(lines[0]);

  const matrix: Record<string, string> = {};
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((h, j) => {
      row[h] = values[j] ?? '';
    });
    const sku = (row.sku ?? '').trim();
    if (!sku) continue;
    matrix[sku] = slugFromBlueprint(row);
  }

  const dbProducts = await prisma.product.findMany({
    where: { active: true },
    select: { sku: true, slug: true },
  });

  const dbBySku = Object.fromEntries(dbProducts.map((p) => [p.sku, p.slug]));
  const divergences: { sku: string; slug_matriz: string; slug_db: string }[] = [];
  const aliases: Record<string, string> = {};

  for (const [sku, slugMatriz] of Object.entries(matrix)) {
    const slugDb = dbBySku[sku];
    if (!slugDb) continue;
    if (slugMatriz !== slugDb) {
      divergences.push({ sku, slug_matriz: slugMatriz, slug_db: slugDb });
      aliases[slugMatriz] = slugDb;
    }
  }

  const outDir = path.dirname(OUTPUT);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  fs.writeFileSync(
    OUTPUT,
    JSON.stringify(
      {
        total_matrix: Object.keys(matrix).length,
        total_db: dbProducts.length,
        divergences_count: divergences.length,
        divergences,
        aliases,
      },
      null,
      2
    ),
    'utf-8'
  );

  console.log('✅ Slug audit:', OUTPUT);
  console.log('  Matriz:', Object.keys(matrix).length);
  console.log('  DB:', dbProducts.length);
  console.log('  Divergências:', divergences.length);
  if (divergences.length > 0) {
    console.log('');
    console.log('Aliases para catalog.ts:');
    console.log(JSON.stringify(aliases, null, 2));
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
