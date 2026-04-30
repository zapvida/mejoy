#!/usr/bin/env tsx
/**
 * Sincroniza activeIngredients no DB a partir do copy-blueprint-v4.
 * Usa primaryActive + dose para gerar composição mínima quando vazio.
 * Uso: pnpm tsx scripts/sync-active-ingredients-from-blueprint.ts [--dry-run]
 *       pnpm tsx scripts/sync-active-ingredients-from-blueprint.ts --all  # catálogo inteiro
 */

import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';
config({ path: path.join(process.cwd(), '.env.local') });

import { prisma } from '../src/lib/prisma';
import { parseCSV } from './lib/copy-utils';

const V4_PATH = path.join(process.cwd(), 'data', 'store-v2', 'copy', 'copy-blueprint-v4.csv');
const LOTE_PATH = path.join(process.cwd(), 'data', 'store-v2', 'lote-ancora-skus.json');

function buildComposition(primaryActive: string, dose: string, formDisplay: string): string {
  const active = (primaryActive || '').trim();
  const d = (dose || '').trim();
  const form = (formDisplay || 'cápsula').toLowerCase();
  const firstLine = active && d ? `${active} ${d}` : active || 'Composição conforme rotulagem';
  return `${firstLine}\nExcipiente q.s.p. 1 ${form}`;
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const allCatalog = process.argv.includes('--all');

  if (!fs.existsSync(V4_PATH)) {
    console.error('❌ copy-blueprint-v4.csv não encontrado.');
    process.exit(1);
  }

  const content = fs.readFileSync(V4_PATH, 'utf-8');
  const { rows } = parseCSV(content);

  const loteSkus =
    allCatalog || !fs.existsSync(LOTE_PATH)
      ? rows.map((r) => r.sku?.trim()).filter(Boolean)
      : (JSON.parse(fs.readFileSync(LOTE_PATH, 'utf-8')) as { skus?: string[] }).skus ?? [];

  const blueprintBySku = new Map(rows.map((r) => [r.sku?.trim() ?? '', r]));

  const products = await prisma.product.findMany({
    where: { sku: { in: loteSkus }, active: true },
    select: { id: true, sku: true, activeIngredients: true, formDisplay: true },
  });

  let updated = 0;
  for (const p of products) {
    const sku = p.sku?.trim();
    if (!sku) continue;
    if (p.activeIngredients && p.activeIngredients.trim().length >= 15) continue; // já tem

    const row = blueprintBySku.get(sku);
    if (!row) continue;

    const composition = buildComposition(
      row.primaryActive ?? row.normalizedPrimaryActive ?? '',
      row.dose ?? row.normalizedDose ?? '',
      p.formDisplay ?? row.normalizedFormDisplay ?? 'cápsula'
    );

    if (dryRun) {
      console.log(`  [dry-run] ${sku}: "${composition.split('\n')[0]}..."`);
      updated++;
      continue;
    }

    await prisma.product.update({
      where: { id: p.id },
      data: { activeIngredients: composition },
    });
    console.log(`  ✓ ${sku}: ${composition.split('\n')[0]}`);
    updated++;
  }

  console.log(`\n✅ ${updated} produtos atualizados.`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
