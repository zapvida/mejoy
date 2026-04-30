#!/usr/bin/env tsx
/**
 * Valida PDPs via HTTP real — rota funcional, sem achismos.
 * Uso: BASE_URL=http://localhost:3000 pnpm tsx scripts/validate-pdps-http.ts
 * Requer: dev server rodando + DATABASE_URL para slugs do DB.
 */

import { config } from 'dotenv';
import * as path from 'path';
config({ path: path.join(process.cwd(), '.env.local') });

import * as fs from 'fs';
import { prisma } from '../src/lib/prisma';

const BASE = process.env.BASE_URL || 'http://localhost:3000';
const OUTPUT = path.join(process.cwd(), 'scripts', 'generated', 'pdp-validation-http.json');

async function fetchStatus(url: string): Promise<{ status: number; ok: boolean }> {
  try {
    const res = await fetch(url, { redirect: 'manual', headers: { Accept: 'text/html' } });
    return { status: res.status, ok: res.status >= 200 && res.status < 400 };
  } catch {
    return { status: 0, ok: false };
  }
}

async function main() {
  const limit = process.env.PDP_LIMIT ? parseInt(process.env.PDP_LIMIT, 10) : undefined;
  const products = await prisma.product.findMany({
    where: { active: true },
    select: { sku: true, slug: true },
    orderBy: { priorityRank: 'asc' },
    take: limit,
  });

  const slugAuditPath = path.join(process.cwd(), 'scripts', 'generated', 'slug-audit.json');
  const slugAudit = fs.existsSync(slugAuditPath)
    ? JSON.parse(fs.readFileSync(slugAuditPath, 'utf-8'))
    : { aliases: {} as Record<string, string> };
  const aliases = slugAudit.aliases || {};

  const results: Array<{
    sku: string;
    slug_db: string;
    slug_matriz?: string;
    rota_ok: boolean;
    status: number;
    redirect_ok: boolean;
    status_final: string;
  }> = [];

  let ok = 0;
  let fail = 0;

  for (const p of products) {
    const slugDb = p.slug;
    const url = `${BASE}/p/${slugDb}`;
    const { status, ok: routeOk } = await fetchStatus(url);
    const redirectOk = status === 301 || status === 308;
    const rotaOk = routeOk || redirectOk;

    if (rotaOk) ok++;
    else fail++;

    let statusFinal = 'BLOQUEAR';
    if (rotaOk && status === 200) statusFinal = 'PREMIUM_VALIDADO_REAL';
    else if (rotaOk && redirectOk) statusFinal = 'FUNCIONAL_VALIDADO_REAL';
    else if (status === 404) statusFinal = 'BLOQUEAR';

    const slugMatriz = Object.entries(aliases).find(([, v]) => v === slugDb)?.[0];

    results.push({
      sku: p.sku ?? '',
      slug_db: slugDb,
      slug_matriz: slugMatriz,
      rota_ok: rotaOk,
      status,
      redirect_ok: redirectOk,
      status_final: statusFinal,
    });
  }

  const outDir = path.dirname(OUTPUT);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(results, null, 2), 'utf-8');

  console.log('✅ PDP HTTP validation:', OUTPUT);
  console.log('  PREMIUM_VALIDADO_REAL:', results.filter((r) => r.status_final === 'PREMIUM_VALIDADO_REAL').length);
  console.log('  FUNCIONAL_VALIDADO_REAL:', results.filter((r) => r.status_final === 'FUNCIONAL_VALIDADO_REAL').length);
  console.log('  BLOQUEAR:', results.filter((r) => r.status_final === 'BLOQUEAR').length);
  console.log('  Rotas OK:', ok, '| Falhas:', fail);

  await prisma.$disconnect();

  if (fail > 0) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
