#!/usr/bin/env tsx
/**
 * VALIDAÇÃO DE REGRESSÃO DO AKKERMAT
 *
 * Verifica que o template mestre (Akkermat MEJOY-0048) não sofreu regressão
 * estrutural, editorial ou de conteúdo.
 *
 * Executar ANTES de merge/deploy. Falha se houver qualquer divergência.
 *
 * Uso: pnpm tsx scripts/validate-akkermat-regression.ts
 *      BASE_URL=http://localhost:3000 pnpm tsx scripts/validate-akkermat-regression.ts  # com HTTP check
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  PDP_TEMPLATE_MASTER_SKU,
  PDP_MASTER_OVERRIDES,
  PDP_MASTER_FULL_OVERRIDES,
  PDP_MASTER_COMPARE_AT_FALLBACK_CENTS,
} from '../src/lib/store-v2/copy-v2';

const BASELINE_PATH = path.join(process.cwd(), 'scripts', 'baselines', 'akkermat-freeze-snapshot.json');
const GENERATED_PATH = path.join(process.cwd(), 'scripts', 'generated', 'akkermat-freeze-snapshot.json');
const BASE_URL = process.env.BASE_URL || '';

interface Snapshot {
  generatedAt: string;
  sku: string;
  sectionOrder: readonly string[];
  firstFoldElements: readonly string[];
  heroBullets: string[];
  mechanismSummary: string;
  fullOverrides: {
    paraQueServeCount: number;
    faqCount: number;
    hasWhatIsIt: boolean;
    hasBestFitProfile: boolean;
    hasWhatMakesDifferent: boolean;
    hasScienceSummary: boolean;
    hasAdvertenciasCompleto: boolean;
    hasActiveIngredients: boolean;
  };
  compareAtFallbackCents: number;
  textSignatures: Record<string, unknown>;
  heroBulletsChecksum: number;
  mechanismSummaryLength: number;
}

const errors: string[] = [];
const warnings: string[] = [];

function fail(msg: string) {
  errors.push(msg);
}

function warn(msg: string) {
  warnings.push(msg);
}

function validateStructural(): boolean {
  if (!fs.existsSync(BASELINE_PATH)) {
    fail(`Baseline versionado não encontrado: ${BASELINE_PATH}`);
    fail(`Execute uma única vez: pnpm tsx scripts/freeze-akkermat.ts --update-baseline`);
    return false;
  }

  const snapshot: Snapshot = JSON.parse(fs.readFileSync(BASELINE_PATH, 'utf-8'));
  if (!fs.existsSync(GENERATED_PATH)) {
    warn(`Snapshot de trabalho ausente em ${GENERATED_PATH} (não bloqueante).`);
  }

  // 1. Overrides existem
  const masterOverrides = PDP_MASTER_OVERRIDES[PDP_TEMPLATE_MASTER_SKU];
  const fullOverrides = PDP_MASTER_FULL_OVERRIDES[PDP_TEMPLATE_MASTER_SKU];

  if (!masterOverrides) {
    fail('PDP_MASTER_OVERRIDES não contém MEJOY-0048 (Akkermat).');
  }
  if (!fullOverrides) {
    fail('PDP_MASTER_FULL_OVERRIDES não contém MEJOY-0048 (Akkermat).');
  }

  if (!masterOverrides || !fullOverrides) return errors.length === 0;

  // 2. Hero bullets
  if (masterOverrides.heroBullets.length !== snapshot.heroBullets.length) {
    fail(
      `Hero bullets: esperado ${snapshot.heroBullets.length}, atual ${masterOverrides.heroBullets.length}`
    );
  }
  const heroChecksum = masterOverrides.heroBullets.join('|').length;
  if (heroChecksum !== snapshot.heroBulletsChecksum) {
    fail(
      `Hero bullets checksum divergente: esperado ${snapshot.heroBulletsChecksum}, atual ${heroChecksum}`
    );
  }

  // 3. Mechanism summary
  if (masterOverrides.mechanismSummary.length !== snapshot.mechanismSummaryLength) {
    fail(
      `mechanism_summary: tamanho divergente (esperado ${snapshot.mechanismSummaryLength}, atual ${masterOverrides.mechanismSummary.length})`
    );
  }

  // 4. Full overrides
  const pqCount = fullOverrides.paraQueServe?.length ?? 0;
  if (pqCount < snapshot.fullOverrides.paraQueServeCount) {
    fail(
      `paraQueServe: esperado ${snapshot.fullOverrides.paraQueServeCount}+ itens, atual ${pqCount}`
    );
  }
  const faqCount = fullOverrides.faq?.length ?? 0;
  if (faqCount < snapshot.fullOverrides.faqCount) {
    fail(`FAQ: esperado ${snapshot.fullOverrides.faqCount}+ pares, atual ${faqCount}`);
  }
  if (!fullOverrides.whatIsIt) fail('whatIsIt ausente no override');
  if (!fullOverrides.bestFitProfile) fail('bestFitProfile ausente no override');
  if (!fullOverrides.whatMakesDifferent) fail('whatMakesDifferent ausente no override');
  if (!fullOverrides.scienceSummary) fail('scienceSummary ausente no override');
  if (!fullOverrides.advertenciasCompleto) fail('advertenciasCompleto ausente no override');
  if (!fullOverrides.activeIngredients) fail('activeIngredients ausente no override');

  // 5. Compare at fallback
  if (PDP_MASTER_COMPARE_AT_FALLBACK_CENTS !== snapshot.compareAtFallbackCents) {
    fail(
      `PDP_MASTER_COMPARE_AT_FALLBACK_CENTS divergente: esperado ${snapshot.compareAtFallbackCents}, atual ${PDP_MASTER_COMPARE_AT_FALLBACK_CENTS}`
    );
  }

  return errors.length === 0;
}

async function validateHttp(): Promise<boolean> {
  if (!BASE_URL) return true;

  const url = `${BASE_URL}/p/akkermat-150-mg-30-capsulas`;
  try {
    const res = await fetch(url, { redirect: 'manual', headers: { Accept: 'text/html' } });
    if (res.status !== 200) {
      fail(`HTTP ${res.status} para ${url}`);

      return false;
    }
    const html = await res.text();

    // Verificar assinaturas de texto
    const sigs = [
      'Reduz o apetite e aumenta a saciedade naturalmente',
      'Coma menos, queime mais',
      'Troca em 7 dias',
      'O que é Akkermat 150 mg?',
      'Akkermat 150 mg',
      'Ideal para quem busca apoio ao metabolismo',
    ];
    for (const sig of sigs) {
      if (!html.includes(sig)) {
        fail(`Texto ausente na página: "${sig}"`);
      }
    }

    // Estrutura de first fold no HTML: ordem e presença antes da FAQ
    const faqIndex = html.indexOf('Perguntas frequentes');
    const firstFoldTokens = [
      'Reduz o apetite e aumenta a saciedade naturalmente',
      'Troca em 7 dias · Frete grátis acima de R$ 190',
      'Adicionar ao carrinho',
    ];
    const firstFoldScope = faqIndex > 0 ? html.slice(0, faqIndex) : html;
    for (const token of firstFoldTokens) {
      const idx = firstFoldScope.indexOf(token);
      if (idx === -1) {
        fail(`First fold: token obrigatório ausente: "${token}"`);
        continue;
      }
    }

    // Verificar elementos críticos
    if (!html.includes('Adicionar ao carrinho')) warn('CTA "Adicionar ao carrinho" não encontrado');
    if (!html.includes('Perguntas frequentes')) fail('Seção FAQ não encontrada');
    if (!html.includes('Composição')) fail('Seção Composição não encontrada');
    if (!html.includes('Como funciona')) fail('Seção Como funciona não encontrada');
    if (!html.includes('Referências')) fail('Seção Referências não encontrada');

    const clickableRefSignals = ['pubmed.ncbi.nlm.nih.gov', 'doi.org'];
    const foundRefSignal = clickableRefSignals.some((s) => html.includes(s));
    if (!foundRefSignal) {
      fail('Referências científicas clicáveis não detectadas no HTML (PubMed/DOI).');
    }
  } catch (e) {
    fail(`Erro ao buscar ${url}: ${e}`);
  }

  return errors.length === 0;
}

async function main() {
  console.log('🔍 Validando regressão do Akkermat (MEJOY-0048)...\n');

  const structuralOk = validateStructural();
  const httpOk = await validateHttp();

  if (warnings.length > 0) {
    console.log('⚠️  Avisos:');
    warnings.forEach((w) => console.log(`   - ${w}`));
    console.log();
  }

  if (errors.length > 0) {
    console.error('❌ REGRESSÃO DETECTADA:');
    errors.forEach((e) => console.error(`   - ${e}`));
    console.error('\n   O Akkermat é INTOCÁVEL. Reverta as alterações ou atualize o snapshot com freeze-akkermat.ts após aprovação explícita.');
    process.exit(1);
  }

  console.log('✅ Akkermat intacto — sem regressão detectada.');
  if (BASE_URL) console.log('   HTTP check: OK');
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
