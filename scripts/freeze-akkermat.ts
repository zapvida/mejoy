#!/usr/bin/env tsx
/**
 * FREEZE ABSOLUTO DO AKKERMAT — Template Mestre PDP
 *
 * Modo padrão:
 * - Gera snapshot de trabalho em scripts/generated (não versionado).
 *
 * Modo imutável/versionado:
 * - Use --update-baseline para atualizar o baseline oficial versionado.
 * - O baseline oficial é consumido por validate-akkermat-regression.ts.
 *
 * Uso:
 *   pnpm tsx scripts/freeze-akkermat.ts
 *   pnpm tsx scripts/freeze-akkermat.ts --update-baseline
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  PDP_TEMPLATE_MASTER_SKU,
  PDP_MASTER_OVERRIDES,
  PDP_MASTER_FULL_OVERRIDES,
  PDP_MASTER_COMPARE_AT_FALLBACK_CENTS,
} from '../src/lib/store-v2/copy-v2';

const GENERATED_OUTPUT = path.join(process.cwd(), 'scripts', 'generated', 'akkermat-freeze-snapshot.json');
const BASELINE_OUTPUT = path.join(process.cwd(), 'scripts', 'baselines', 'akkermat-freeze-snapshot.json');

/** Ordem oficial das seções da PDP (igual ao Akkermat). Não alterar. */
const PDP_SECTION_ORDER = [
  'breadcrumb',
  'galeria',
  'titulo_h1',
  'form_display',
  'subtitulo_mechanism',
  'rating',
  'hero_bullets',
  'trust_line',
  'bloco_decisorio',
  'calculadora_frete',
  'trust_bar',
  'o_que_e',
  'video',
  'como_funciona',
  'para_que_serve',
  'o_que_torna_diferente',
  'para_quem_e_ideal',
  'como_usar',
  'composicao',
  'advertencias',
  'referencias',
  'faq',
  'como_funciona_compra',
  'avaliacoes',
  'quem_viu_viu_tambem',
  'sticky_cta_desktop',
  'sticky_cta_mobile',
] as const;

/** Elementos obrigatórios do first fold (visíveis sem scroll). */
const FIRST_FOLD_ELEMENTS = [
  'breadcrumb',
  'galeria',
  'titulo_h1',
  'subtitulo_mechanism',
  'rating',
  'hero_bullets',
  'trust_line',
  'bloco_decisorio',
];

/** Textos-chave que devem aparecer na PDP do Akkermat (para validação de regressão visual). */
const AKKERMAT_TEXT_SIGNATURES = {
  hero_bullets: [
    'Reduz o apetite e aumenta a saciedade naturalmente',
    'Apoia o metabolismo e a queima de calorias',
    'Sensação de saciedade prolongada entre as refeições',
    'Apoio à redução de medidas de forma saudável',
    'Dose eficaz de 150 mg por cápsula para resultados visíveis',
  ],
  mechanism_summary:
    'Coma menos, queime mais. A fórmula que ajuda a controlar o apetite e a acelerar o metabolismo — resultados visíveis quando associada à dieta equilibrada.',
  trust_line: 'Troca em 7 dias · Frete grátis acima de R$ 190',
  faq_first_question: 'O que é Akkermat 150 mg?',
  what_is_it_contains: 'Akkermat 150 mg',
  best_fit_contains: 'Ideal para quem busca apoio ao metabolismo',
};

function writeJson(filePath: string, payload: unknown) {
  const outDir = path.dirname(filePath);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), 'utf-8');
}

function buildSnapshot() {
  const masterOverrides = PDP_MASTER_OVERRIDES[PDP_TEMPLATE_MASTER_SKU];
  const fullOverrides = PDP_MASTER_FULL_OVERRIDES[PDP_TEMPLATE_MASTER_SKU];

  if (!masterOverrides || !fullOverrides) {
    console.error('❌ PDP_MASTER_OVERRIDES ou PDP_MASTER_FULL_OVERRIDES não contém MEJOY-0048. FREEZE FALHOU.');
    process.exit(1);
  }

  return {
    generatedAt: new Date().toISOString(),
    sku: PDP_TEMPLATE_MASTER_SKU,
    slug: 'akkermat-150-mg-30-capsulas',
    url: 'http://localhost:3000/p/akkermat-150-mg-30-capsulas',

    sectionOrder: PDP_SECTION_ORDER,
    firstFoldElements: FIRST_FOLD_ELEMENTS,

    heroBullets: masterOverrides.heroBullets,
    mechanismSummary: masterOverrides.mechanismSummary,

    fullOverrides: {
      paraQueServeCount: fullOverrides.paraQueServe?.length ?? 0,
      paraQueServeTitles: fullOverrides.paraQueServe?.map((p) => p.title) ?? [],
      faqCount: fullOverrides.faq?.length ?? 0,
      faqQuestions: fullOverrides.faq?.map((f) => f.q) ?? [],
      hasWhatIsIt: !!fullOverrides.whatIsIt,
      hasBestFitProfile: !!fullOverrides.bestFitProfile,
      hasWhatMakesDifferent: !!fullOverrides.whatMakesDifferent,
      hasScienceSummary: !!fullOverrides.scienceSummary,
      hasAdvertenciasCompleto: !!fullOverrides.advertenciasCompleto,
      hasActiveIngredients: !!fullOverrides.activeIngredients,
    },

    compareAtFallbackCents: PDP_MASTER_COMPARE_AT_FALLBACK_CENTS,
    textSignatures: AKKERMAT_TEXT_SIGNATURES,
    heroBulletsChecksum: masterOverrides.heroBullets.join('|').length,
    mechanismSummaryLength: masterOverrides.mechanismSummary.length,
  };
}

function main() {
  const updateBaseline = process.argv.includes('--update-baseline');
  const snapshot = buildSnapshot();

  writeJson(GENERATED_OUTPUT, snapshot);
  if (updateBaseline) {
    writeJson(BASELINE_OUTPUT, snapshot);
  }

  console.log('✅ FREEZE AKKERMAT concluído');
  console.log(`   SKU: ${snapshot.sku}`);
  console.log(`   Seções: ${snapshot.sectionOrder.length}`);
  console.log(`   Hero bullets: ${snapshot.heroBullets.length}`);
  console.log(`   FAQ: ${snapshot.fullOverrides.faqCount} pares`);
  console.log(`   Para que serve: ${snapshot.fullOverrides.paraQueServeCount} itens`);
  console.log(`   Snapshot de trabalho: ${GENERATED_OUTPUT}`);
  if (updateBaseline) {
    console.log(`   Baseline versionado atualizado: ${BASELINE_OUTPUT}`);
  } else if (!fs.existsSync(BASELINE_OUTPUT)) {
    console.log('   ⚠️ Baseline versionado ainda não existe. Rode com --update-baseline para criar.');
  } else {
    console.log(`   Baseline versionado preservado: ${BASELINE_OUTPUT}`);
  }
}

main();
