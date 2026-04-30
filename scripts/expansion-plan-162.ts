#!/usr/bin/env tsx
/**
 * Plano de expansão — classifica 162 SKUs em lotes por objetivo.
 * Gera roteiro de rollout em batches.
 * Uso: pnpm tsx scripts/expansion-plan-162.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';
config({ path: path.join(process.cwd(), '.env.local') });

import { prisma } from '../src/lib/prisma';
import { getCopyV4BySku } from '../src/lib/store-v2/copy-v2';

const LOTE_PATH = path.join(process.cwd(), 'data', 'store-v2', 'lote-ancora-skus.json');
const AUDIT_PATH = path.join(process.cwd(), 'scripts', 'generated', 'audit-copy-premium-162.json');
const OUTPUT = path.join(process.cwd(), 'scripts', 'generated', 'expansion-plan-162.json');

const OBJETIVO_ORDEM: Record<string, number> = {
  'Emagrecimento & Metabolismo': 1,
  'Ansiedade & Humor': 2,
  'Sono': 3,
  'Cabelo': 4,
  'Intestino': 5,
  'Imunidade': 6,
  'Energia & Performance': 7,
  'Hormonal & Libido': 8,
  'Articulações': 9,
  'Detox & Fígado': 10,
  'Pele & Beleza': 11,
  'Menopausa & TPM': 12,
  'Lipedema': 13,
  'Saúde': 99,
};

function hasContent(s: string | null | undefined, minLen = 20): boolean {
  return typeof s === 'string' && s.trim().length >= minLen;
}

async function main() {
  const loteSkus = fs.existsSync(LOTE_PATH)
    ? (JSON.parse(fs.readFileSync(LOTE_PATH, 'utf-8')) as { skus?: string[] }).skus ?? []
    : [];

  const audit = fs.existsSync(AUDIT_PATH)
    ? JSON.parse(fs.readFileSync(AUDIT_PATH, 'utf-8'))
    : { results: [] };
  type AuditRow = { sku: string; score_copy_0_10?: number };
  const auditBySku = new Map<string, AuditRow>((audit.results ?? []).map((r: AuditRow) => [r.sku, r]));

  const products = await prisma.product.findMany({
    where: { active: true },
    select: { sku: true, slug: true, name: true, objective: true, activeIngredients: true },
    orderBy: { priorityRank: 'asc' },
  });

  const byObjective: Record<string, Array<{
    sku: string;
    slug: string;
    nome: string;
    status: 'ja_pronto' | 'quase_pronto' | 'precisa_copy' | 'precisa_dados';
    noLoteAncora: boolean;
    score_copy?: number;
    composition_ok: boolean;
    prioridade_comercial: number;
    facilidade_replicacao: number;
  }>> = {};

  for (const p of products) {
    const sku = p.sku ?? '';
    const obj = p.objective ?? 'Saúde';
    const copy = getCopyV4BySku(sku);
    const auditRow = auditBySku.get(sku);

    const composition_ok = hasContent(p.activeIngredients);
    const mechanism_ok = hasContent(copy?.mechanism_summary, 30);
    const para_que_serve_ok = hasContent(copy?.para_que_serve, 50);
    const faq_ok = (copy?.faq ?? '').split('|').length >= 6;
    const advertencias_ok = hasContent(copy?.advertencias_completo, 50) || hasContent(copy?.cautions, 20);

    let status: 'ja_pronto' | 'quase_pronto' | 'precisa_copy' | 'precisa_dados' = 'precisa_copy';
    if (loteSkus.includes(sku)) {
      status = 'ja_pronto';
    } else if (composition_ok && mechanism_ok && (para_que_serve_ok || faq_ok)) {
      status = 'quase_pronto';
    } else if (!composition_ok && !copy) {
      status = 'precisa_dados';
    }

    const prioridade_comercial = OBJETIVO_ORDEM[obj] ?? 50;
    const facilidade_replicacao =
      (composition_ok ? 2 : 0) + (mechanism_ok ? 2 : 0) + (para_que_serve_ok ? 2 : 0) + (faq_ok ? 2 : 0) + (advertencias_ok ? 1 : 0);

    if (!byObjective[obj]) byObjective[obj] = [];
    byObjective[obj].push({
      sku,
      slug: p.slug ?? '',
      nome: p.name ?? '',
      status,
      noLoteAncora: loteSkus.includes(sku),
      score_copy: auditRow?.score_copy_0_10,
      composition_ok,
      prioridade_comercial,
      facilidade_replicacao,
    });
  }

  const batches: Array<{
    batch: number;
    objetivo: string;
    skus: string[];
    total: number;
    ja_prontos: number;
    quase_prontos: number;
    prioridade: number;
    dependencia_dados: 'baixa' | 'media' | 'alta';
    facilidade: number;
  }> = [];

  const objOrder = Object.keys(byObjective).sort(
    (a, b) => (OBJETIVO_ORDEM[a] ?? 99) - (OBJETIVO_ORDEM[b] ?? 99)
  );

  let batchNum = 1;
  for (const obj of objOrder) {
    const items = byObjective[obj];
    const ja = items.filter((i) => i.status === 'ja_pronto').length;
    const quase = items.filter((i) => i.status === 'quase_pronto').length;
    const mediaFacilidade = items.length ? items.reduce((s, i) => s + i.facilidade_replicacao, 0) / items.length : 0;
    const dependencia =
      mediaFacilidade >= 6 ? 'baixa' : mediaFacilidade >= 3 ? 'media' : 'alta';

    batches.push({
      batch: batchNum++,
      objetivo: obj,
      skus: items.map((i) => i.sku),
      total: items.length,
      ja_prontos: ja,
      quase_prontos: quase,
      prioridade: OBJETIVO_ORDEM[obj] ?? 50,
      dependencia_dados: dependencia,
      facilidade: Math.round(mediaFacilidade * 10) / 10,
    });
  }

  const report = {
    generatedAt: new Date().toISOString(),
    loteAncoraCount: loteSkus.length,
    totalSkus: products.length,
    byObjective,
    batches,
    resumo: {
      ja_prontos: products.filter((p) => loteSkus.includes(p.sku ?? '')).length,
      quase_prontos: 0,
      precisa_copy: 0,
      precisa_dados: 0,
    },
  };

  report.resumo.ja_prontos = Object.values(byObjective).flat().filter((i) => i.status === 'ja_pronto').length;
  report.resumo.quase_prontos = Object.values(byObjective).flat().filter((i) => i.status === 'quase_pronto').length;
  report.resumo.precisa_copy = Object.values(byObjective).flat().filter((i) => i.status === 'precisa_copy').length;
  report.resumo.precisa_dados = Object.values(byObjective).flat().filter((i) => i.status === 'precisa_dados').length;

  const outDir = path.dirname(OUTPUT);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(report, null, 2), 'utf-8');

  console.log('\n📋 Plano de Expansão 162 SKUs');
  console.log('   Já prontos (lote âncora):', report.resumo.ja_prontos);
  console.log('   Quase prontos:', report.resumo.quase_prontos);
  console.log('   Precisam copy:', report.resumo.precisa_copy);
  console.log('   Precisam dados:', report.resumo.precisa_dados);
  console.log('   Batches:', batches.length);
  console.log('   Output:', OUTPUT);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
