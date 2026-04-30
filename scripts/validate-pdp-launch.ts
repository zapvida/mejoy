#!/usr/bin/env tsx
/**
 * Valida TODOS os 162 produtos para lançamento PDP.
 * Garante: sem markdown cru, sem duplicação, seções obrigatórias.
 * Uso: pnpm run copy:validate:pdp
 */

import * as fs from 'fs';
import * as path from 'path';
import { parseCSV } from './lib/copy-utils';
import {
  getCopyV4BySku,
  formatDescriptionForRenderer,
  getBenefitsStructured,
  getHeroBullets,
  parseParaQueServe,
  parseReferences,
  parseFaqFromV2,
} from '../src/lib/store-v2/copy-v2';

const BLUEPRINT_PATH = path.join(process.cwd(), 'data', 'store-v2', 'copy', 'copy-blueprint-v4.csv');

interface ValidationResult {
  sku: string;
  productName: string;
  ok: boolean;
  errors: string[];
  warnings: string[];
}

function validateOne(row: Record<string, string>): ValidationResult {
  const sku = (row.sku ?? '').trim();
  const productName = (row.productName ?? row.normalizedProductName ?? sku).slice(0, 50);
  const objective = row.objective ?? 'Saúde';
  const errors: string[] = [];
  const warnings: string[] = [];

  const copy = getCopyV4BySku(sku);
  if (!copy) {
    return { sku, productName, ok: false, errors: ['Sem linha no blueprint'], warnings: [] };
  }

  const description = formatDescriptionForRenderer(copy.description_md);
  const benefitsStructured = getBenefitsStructured(
    copy.description_md,
    copy.hero_benefit,
    copy.shortBenefit
  );
  const heroBullets = getHeroBullets(
    copy.hero_benefit,
    copy.shortBenefit,
    objective,
    sku
  );
  const faq = parseFaqFromV2(copy.faq);
  const references = parseReferences(copy.references);
  const paraQueServe = parseParaQueServe(copy.para_que_serve);
  const clickableReferences = references.filter((r) =>
    /(https?:\/\/|doi\.org|pubmed\.ncbi\.nlm\.nih\.gov|ncbi\.nlm\.nih\.gov)/i.test(r)
  );

  if (description.includes('||') || description.includes(' | ')) {
    errors.push('Markdown cru na description (| ou ||)');
  }
  const benefitsWithRaw = benefitsStructured.filter(
    (b) => b.title.includes('||') || b.title.includes('##') || b.desc.includes('||') || b.desc.includes('##')
  );
  if (benefitsWithRaw.length > 0) {
    errors.push(`Benefícios com markdown cru: ${benefitsWithRaw.length}`);
  }
  const uniqueKeys = new Set(heroBullets.map((b) => b.toLowerCase().replace(/\s+/g, ' ').slice(0, 50)));
  if (heroBullets.length !== uniqueKeys.size) {
    errors.push('Hero bullets duplicados');
  }
  if (description.length < 30 && !copy.shortBenefit) {
    errors.push('Description muito curta e sem shortBenefit');
  }
  if (benefitsStructured.length === 0 && !copy.hero_benefit) {
    warnings.push('Sem benefícios estruturados nem hero_benefit');
  }
  if (heroBullets.length < 5) {
    errors.push(`Hero bullets com ${heroBullets.length} itens (mínimo 5)`);
  }
  if (faq.length < 5) {
    errors.push(`FAQ com ${faq.length} pares (mínimo 5)`);
  }
  if (references.length < 3) {
    errors.push(`Referências com ${references.length} itens (mínimo 3)`);
  }
  if (clickableReferences.length < 3) {
    errors.push(`Referências clicáveis com ${clickableReferences.length} itens (mínimo 3)`);
  }
  if (paraQueServe.length < 5) {
    errors.push(`para_que_serve com ${paraQueServe.length} pares (mínimo 5)`);
  }

  const ok = errors.length === 0;
  return { sku, productName, ok, errors, warnings };
}

function main() {
  if (!fs.existsSync(BLUEPRINT_PATH)) {
    console.error('❌ copy-blueprint-v4.csv não encontrado.');
    process.exit(1);
  }

  const content = fs.readFileSync(BLUEPRINT_PATH, 'utf-8');
  const { rows } = parseCSV(content);

  console.log('🔍 Validando TODOS os produtos para lançamento PDP...\n');

  const results: ValidationResult[] = [];
  for (const row of rows) {
    const sku = (row.sku ?? '').trim();
    if (!sku) continue;
    results.push(validateOne(row));
  }

  const passed = results.filter((r) => r.ok);
  const failed = results.filter((r) => !r.ok);
  const withWarnings = results.filter((r) => r.ok && r.warnings.length > 0);

  console.log(`📊 Resultado: ${passed.length}/${results.length} OK`);
  if (failed.length > 0) {
    console.log(`\n❌ FALHAS (${failed.length}):`);
    failed.slice(0, 15).forEach((r) => {
      console.log(`   ${r.sku} ${r.productName}: ${r.errors.join('; ')}`);
    });
    if (failed.length > 15) {
      console.log(`   ... e mais ${failed.length - 15} produtos`);
    }
  }
  if (withWarnings.length > 0 && withWarnings.length <= 20) {
    console.log(`\n⚠️ Com avisos (${withWarnings.length}): ${withWarnings.map((r) => r.sku).join(', ')}`);
  } else if (withWarnings.length > 20) {
    console.log(`\n⚠️ ${withWarnings.length} produtos com avisos (não bloqueantes)`);
  }

  console.log('\n' + (failed.length === 0 ? '✅ Validação APROVADA — pronto para lançamento.' : '❌ Validação REPROVADA — corrigir falhas antes do deploy.'));
  process.exit(failed.length > 0 ? 1 : 0);
}

main();
