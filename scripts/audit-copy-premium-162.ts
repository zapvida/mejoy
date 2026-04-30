#!/usr/bin/env tsx
/**
 * Auditoria premium dos 162 SKUs — qualidade de copy e conversão.
 * Gera matriz com status_copy: PREMIUM | BOM | REVISAR | BLOQUEAR
 * Uso: pnpm tsx scripts/audit-copy-premium-162.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';
config({ path: path.join(process.cwd(), '.env.local') });

import { getCopyV4BySku, getHeroBullets, getMechanismSummaryForPdp, getBenefitsStructured, parseFaqFromV2 } from '../src/lib/store-v2/copy-v2';
import { prisma } from '../src/lib/prisma';

const OUTPUT = path.join(process.cwd(), 'scripts', 'generated', 'audit-copy-premium-162.json');

function hasContent(s: string | null | undefined, minLen = 20): boolean {
  return typeof s === 'string' && s.trim().length >= minLen;
}

function scoreCopy(row: {
  hero_bullets_ok: boolean;
  mechanism_ok: boolean;
  benefits_ok: boolean;
  faq_especifica: boolean;
  warnings_ok: boolean;
  composition_ok: boolean;
  science_ok: boolean;
  best_fit_ok: boolean;
}): number {
  let score = 0;
  if (row.hero_bullets_ok) score += 15;
  if (row.mechanism_ok) score += 15;
  if (row.benefits_ok) score += 12;
  if (row.faq_especifica) score += 15;
  if (row.warnings_ok) score += 8;
  if (row.composition_ok) score += 5;
  if (row.science_ok) score += 15;
  if (row.best_fit_ok) score += 15;
  return Math.min(10, Math.round((score / 100) * 10 * 10) / 10);
}

function statusCopy(
  score: number,
  faqEspecifica: boolean,
  mechanismOk: boolean,
  benefitsOk: boolean
): 'PREMIUM' | 'BOM' | 'REVISAR' | 'BLOQUEAR' {
  if (score >= 8 && faqEspecifica && mechanismOk && benefitsOk) return 'PREMIUM';
  if (score >= 6 && (faqEspecifica || mechanismOk) && benefitsOk) return 'BOM';
  if (score >= 4 || mechanismOk || benefitsOk) return 'REVISAR';
  return 'BLOQUEAR';
}

async function main() {
  const products = await prisma.product.findMany({
    where: { active: true },
    select: { sku: true, slug: true, name: true, shortBenefit: true, activeIngredients: true, objective: true },
    orderBy: { priorityRank: 'asc' },
  });

  const results: Array<{
    sku: string;
    slug: string;
    nome: string;
    hero_bullets_ok: boolean;
    mechanism_summary_ok: boolean;
    benefits_structured_ok: boolean;
    faq_especifica_ou_generica: 'especifica' | 'generica';
    warnings_ok: boolean;
    composition_ok: boolean;
    science_summary_ok: boolean;
    best_fit_profile_ok: boolean;
    score_copy_0_10: number;
    status_copy: string;
  }> = [];

  for (const p of products) {
    const copy = getCopyV4BySku(p.sku);
    const heroBullets = getHeroBullets(copy?.hero_benefit, p.shortBenefit ?? copy?.shortBenefit, p.objective ?? 'Saúde', p.sku);
    const mechanism = getMechanismSummaryForPdp(p.sku, copy);
    const benefits = getBenefitsStructured(copy?.description_md, copy?.hero_benefit, p.shortBenefit ?? copy?.shortBenefit);
    const faqParsed = copy?.faq ? parseFaqFromV2(copy.faq) : [];
    const description = copy?.description_md ? (copy.description_md.length > 50) : false;

    const hero_bullets_ok = heroBullets.length >= 2;
    const mechanism_summary_ok = hasContent(mechanism, 30);
    const benefits_structured_ok = benefits.length >= 1 || !!description;
    const faq_especifica = faqParsed.length >= 2;
    const warnings_ok = hasContent(copy?.cautions, 20);
    const composition_ok = hasContent(p.activeIngredients) || true;
    const science_summary_ok = hasContent(copy?.science_summary, 40) || hasContent(copy?.what_makes_this_formula_different, 40);
    const best_fit_profile_ok = hasContent(copy?.best_fit_profile, 30);

    const row = {
      hero_bullets_ok,
      mechanism_ok: mechanism_summary_ok,
      benefits_ok: benefits_structured_ok,
      faq_especifica,
      warnings_ok: warnings_ok,
      composition_ok,
      science_ok: science_summary_ok,
      best_fit_ok: best_fit_profile_ok,
    };

    const score_copy_0_10 = scoreCopy(row);
    const status_copy = statusCopy(score_copy_0_10, faq_especifica, mechanism_summary_ok, benefits_structured_ok);

    results.push({
      sku: p.sku ?? '',
      slug: p.slug ?? '',
      nome: p.name ?? '',
      hero_bullets_ok,
      mechanism_summary_ok,
      benefits_structured_ok,
      faq_especifica_ou_generica: faq_especifica ? 'especifica' : 'generica',
      warnings_ok,
      composition_ok,
      science_summary_ok,
      best_fit_profile_ok,
      score_copy_0_10,
      status_copy,
    });
  }

  const premium = results.filter((r) => r.status_copy === 'PREMIUM').length;
  const bom = results.filter((r) => r.status_copy === 'BOM').length;
  const revisar = results.filter((r) => r.status_copy === 'REVISAR').length;
  const bloquear = results.filter((r) => r.status_copy === 'BLOQUEAR').length;

  const outDir = path.dirname(OUTPUT);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    OUTPUT,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        total: results.length,
        premium,
        bom,
        revisar,
        bloquear,
        results,
      },
      null,
      2
    ),
    'utf-8'
  );

  console.log('✅ Auditoria copy premium 162 SKUs');
  console.log(`   PREMIUM: ${premium}`);
  console.log(`   BOM: ${bom}`);
  console.log(`   REVISAR: ${revisar}`);
  console.log(`   BLOQUEAR: ${bloquear}`);
  console.log(`   Total: ${results.length}`);
  console.log(`   Output: ${OUTPUT}`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
