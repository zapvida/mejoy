#!/usr/bin/env tsx
/**
 * Valida texto de embalagem: produtos com nomes longos sem shortName,
 * shortBenefit muito longo. Garante que nada quebre fora da label.
 * Uso: pnpm tsx scripts/validate-label-text.ts
 */

import { config } from 'dotenv';
import * as path from 'path';
config({ path: path.join(process.cwd(), '.env.local') });

import { prisma } from '../src/lib/prisma';

const MAX_NAME_FOR_LABEL = 25;
const MAX_SHORTBENEFIT_LINES = 3;
const CHARS_PER_LINE = 40;

async function main() {
  const products = await prisma.product.findMany({
    where: { active: true },
    select: { sku: true, slug: true, name: true, shortName: true, shortBenefit: true },
  });

  const needsShortName: { sku: string; name: string; len: number }[] = [];
  const longShortBenefit: { sku: string; shortBenefit: string; len: number }[] = [];

  for (const p of products) {
    const nameLen = (p.name ?? '').length;
    if (nameLen > MAX_NAME_FOR_LABEL && !(p.shortName && p.shortName.trim())) {
      needsShortName.push({ sku: p.sku, name: p.name, len: nameLen });
    }

    const sb = p.shortBenefit ?? '';
    if (sb.length > CHARS_PER_LINE * MAX_SHORTBENEFIT_LINES) {
      longShortBenefit.push({ sku: p.sku, shortBenefit: sb, len: sb.length });
    }
  }

  console.log('\n=== Validação de texto em embalagem ===\n');

  if (needsShortName.length > 0) {
    console.log(`⚠️  ${needsShortName.length} produtos com nome > ${MAX_NAME_FOR_LABEL} chars sem shortName:\n`);
    needsShortName
      .sort((a, b) => b.len - a.len)
      .slice(0, 20)
      .forEach(({ sku, name, len }) => {
        console.log(`   ${sku} (${len} chars): ${name.slice(0, 50)}${name.length > 50 ? '...' : ''}`);
      });
    if (needsShortName.length > 20) {
      console.log(`   ... e mais ${needsShortName.length - 20}`);
    }
    console.log('');
  } else {
    console.log(`✅ Todos os produtos com nome longo têm shortName.\n`);
  }

  if (longShortBenefit.length > 0) {
    console.log(`⚠️  ${longShortBenefit.length} produtos com shortBenefit > ${CHARS_PER_LINE * MAX_SHORTBENEFIT_LINES} chars:\n`);
    longShortBenefit
      .sort((a, b) => b.len - a.len)
      .slice(0, 10)
      .forEach(({ sku, shortBenefit, len }) => {
        console.log(`   ${sku} (${len} chars): ${shortBenefit.slice(0, 60)}...`);
      });
    if (longShortBenefit.length > 10) {
      console.log(`   ... e mais ${longShortBenefit.length - 10}`);
    }
    console.log('');
  } else {
    console.log(`✅ Todos os shortBenefit estão dentro do limite.\n`);
  }

  const total = products.length;
  const ok = total - needsShortName.length;
  console.log(`Resumo: ${ok}/${total} produtos OK para label.`);
  if (needsShortName.length > 0) {
    console.log(`\nRecomendação: preencher shortName (≤${MAX_NAME_FOR_LABEL} chars) para os produtos listados.`);
  }
}

main().catch(console.error);
