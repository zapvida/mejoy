/**
 * Smoke do import CSV Store V2
 * Valida: >=200 produtos, slugs únicos, sem formas proibidas
 */

import { config } from 'dotenv';
config({ path: '.env.local' });
config(); // fallback .env

import path from 'path';
import { importCatalogFromCSV } from '../src/lib/catalog/import-csv';
import { prisma } from '../src/lib/prisma';

const FORMS_ALLOWED = ['caps', 'powder', 'topical', 'sachet', 'drops', 'cream', 'shampoo'];

async function main() {
  const csvPath = path.join(process.cwd(), 'data', 'catalogo_master_mejoy_seed_200.csv');
  console.log('Importing from', csvPath);

  const result = await importCatalogFromCSV(csvPath, prisma);

  console.log('Import result:', {
    created: result.created,
    updated: result.updated,
    total: result.total,
    errors: result.errors.length,
  });
  if (result.errors.length > 0) {
    console.error('Errors:', result.errors.slice(0, 10));
  }

  const count = await prisma.product.count();
  const slugs = await prisma.product.findMany({ select: { slug: true } });
  const slugSet = new Set(slugs.map((p) => p.slug));
  const uniqueSlugs = slugSet.size;

  const forbiddenForms = await prisma.product.findMany({
    where: {
      formKey: { notIn: FORMS_ALLOWED },
    },
    select: { sku: true, formKey: true },
  });

  const ok =
    count >= 200 &&
    uniqueSlugs === count &&
    forbiddenForms.length === 0 &&
    result.errors.length === 0;

  if (!ok) {
    console.error('VALIDATION FAILED:');
    if (count < 200) console.error(`  - Expected >=200 products, got ${count}`);
    if (uniqueSlugs !== count) console.error(`  - Slugs not unique: ${uniqueSlugs}/${count}`);
    if (forbiddenForms.length > 0) console.error(`  - Forbidden forms:`, forbiddenForms);
    if (result.errors.length > 0) console.error(`  - Import errors: ${result.errors.length}`);
    process.exit(1);
  }

  console.log('OK: >=200 products, unique slugs, no forbidden forms');
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
