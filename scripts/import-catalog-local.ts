#!/usr/bin/env tsx
/**
 * Importa catálogo localmente (banco definido em DATABASE_URL)
 * Uso: STORE_V2_SEED_PRICE_CENTS=9900 pnpm tsx scripts/import-catalog-local.ts
 */
import path from 'path';
import { importCatalogFromCSV } from '../src/lib/catalog/import-csv';
import { prisma } from '../src/lib/prisma';

async function main() {
  const csvPath = path.join(process.cwd(), 'data', 'catalogo_master_mejoy_seed_200.csv');
  console.log('Importando de', csvPath);
  console.log('STORE_V2_SEED_PRICE_CENTS:', process.env.STORE_V2_SEED_PRICE_CENTS || '(não definido)');

  const result = await importCatalogFromCSV(csvPath, prisma);

  console.log('Resultado:', {
    created: result.created,
    updated: result.updated,
    total: result.total,
    errors: result.errors.length,
  });
  if (result.errors.length > 0) {
    console.error('Erros:', result.errors.slice(0, 5));
  }

  const count = await prisma.product.count();
  console.log('Total de produtos no banco:', count);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
