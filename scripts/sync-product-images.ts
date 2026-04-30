#!/usr/bin/env tsx
/**
 * Sincroniza imagens de produtos — convenção: public/products/{slug}.png
 *
 * 1. Lista todos os slugs do catálogo
 * 2. Verifica quais imagens existem em public/products/
 * 3. Gera relatório e SQL para popular DB (opcional)
 *
 * Uso:
 *   pnpm tsx scripts/sync-product-images.ts
 *   pnpm tsx scripts/sync-product-images.ts --copy-from=./backup-imagens
 *
 * Para adicionar imagens: coloque em public/products/{slug}.png
 * Ex: public/products/5-htp-100-mg-60-capsulas.png
 */

import * as fs from 'fs';
import * as path from 'path';
import { prisma } from '../src/lib/prisma';

const PRODUCTS_DIR = path.join(process.cwd(), 'public', 'products');
const OUTPUT = path.join(process.cwd(), 'scripts', 'generated', 'product-images-manifest.json');

async function main() {
  const copyFrom = process.argv.find((a) => a.startsWith('--copy-from='))?.split('=')[1];

  const products = await prisma.product.findMany({
    where: { active: true },
    select: { slug: true, sku: true, name: true, images: true },
    orderBy: { slug: 'asc' },
  });

  const manifest: {
    generatedAt: string;
    total: number;
    withImage: number;
    withoutImage: number;
    products: Array<{
      slug: string;
      sku: string;
      name: string;
      hasFile: boolean;
      path: string;
      dbImages: string[];
    }>;
  } = {
    generatedAt: new Date().toISOString(),
    total: products.length,
    withImage: 0,
    withoutImage: 0,
    products: [],
  };

  if (!fs.existsSync(PRODUCTS_DIR)) fs.mkdirSync(PRODUCTS_DIR, { recursive: true });

  for (const p of products) {
    const slug = p.slug ?? '';
    const filePath = path.join(PRODUCTS_DIR, `${slug}.png`);
    const hasFile = fs.existsSync(filePath);
    if (hasFile) manifest.withImage++;
    else manifest.withoutImage++;
    manifest.products.push({
      slug,
      sku: p.sku ?? '',
      name: p.name ?? '',
      hasFile,
      path: `/products/${slug}.png`,
      dbImages: Array.isArray(p.images) ? p.images : [],
    });
  }

  if (copyFrom && fs.existsSync(copyFrom)) {
    console.log(`\n📂 Copiando de ${copyFrom}...`);
    let copied = 0;
    for (const p of manifest.products) {
      const srcPng = path.join(copyFrom, `${p.slug}.png`);
      const srcSku = path.join(copyFrom, `${p.sku}.png`);
      const dst = path.join(PRODUCTS_DIR, `${p.slug}.png`);
      if (fs.existsSync(srcPng)) {
        fs.copyFileSync(srcPng, dst);
        copied++;
      } else if (fs.existsSync(srcSku)) {
        fs.copyFileSync(srcSku, dst);
        copied++;
      }
    }
    console.log(`   Copiadas: ${copied} imagens`);
  }

  const outDir = path.dirname(OUTPUT);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(manifest, null, 2), 'utf-8');

  console.log('\n📦 Manifesto de imagens de produtos');
  console.log(`   Total: ${manifest.total}`);
  console.log(`   Com arquivo: ${manifest.withImage}`);
  console.log(`   Sem arquivo: ${manifest.withoutImage}`);
  console.log(`   Relatório: ${OUTPUT}`);
  console.log('\n   Convenção: public/products/{slug}.png');
  console.log('   Ex: public/products/5-htp-100-mg-60-capsulas.png');
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
