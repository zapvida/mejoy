#!/usr/bin/env tsx
/**
 * Gera copy-blueprint-v3.csv — camada editorial premium sobre o v2.
 * Adiciona colunas de enriquecimento semântico, SEO e diferenciação.
 * NÃO substitui o v2. Uso: pnpm run copy:blueprint:v3
 */

import * as fs from 'fs';
import * as path from 'path';

const V2_PATH = path.join(process.cwd(), 'data', 'store-v2', 'copy', 'copy-blueprint-v2.csv');
const OUTPUT_PATH = path.join(process.cwd(), 'data', 'store-v2', 'copy', 'copy-blueprint-v3.csv');
const REPORT_PATH = path.join(process.cwd(), 'scripts', 'generated', 'copy-blueprint-v3-report.json');

const PRIORITY_CLUSTERS = ['Sono', 'Menopausa & TPM', 'Lipedema'];
const NL = ' | ';

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') inQuotes = !inQuotes;
    else if (c === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else if (c !== '\n' && c !== '\r') current += c;
  }
  result.push(current.trim());
  return result;
}

function parseCSV(content: string): Record<string, string>[] {
  const lines = content.split(/\r?\n/).filter((l) => l.length > 0);
  if (lines.length < 2) return [];
  const headers = parseCSVLine(lines[0]);
  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((h, j) => {
      row[h] = values[j] ?? '';
    });
    rows.push(row);
  }
  return rows;
}

function escapeCSV(val: string): string {
  const v = (val || '').replace(/\r?\n/g, NL).replace(/"/g, '""');
  if (v.includes(',') || v.includes('"')) return `"${v}"`;
  return v;
}

/** Enriquecimento por cluster — dados específicos para diferenciação. */
const ENRICHMENT: Record<string, Record<string, Record<string, string>>> = {
  Sono: {
    'MEJOY-0152': {
      search_intent_primary: 'comprar gaba para dormir',
      search_intent_secondary: 'gaba suplemento sono',
      top_questions_real: 'GABA ajuda a dormir? | GABA 200 mg ou 400 mg? | GABA tem efeito colateral?',
      science_summary: 'GABA é um neurotransmissor inibitório. Estudos sugerem que suplementação pode auxiliar no relaxamento. Resultados variam.',
      evidence_level: 'moderate',
      best_fit_profile: 'Quem busca relaxamento leve e início com dose menor.',
      not_for_whom: 'Não substitui tratamento médico para insônia crônica.',
      what_makes_this_formula_different: 'Dose 200 mg — ponto de partida para quem nunca usou GABA.',
      comparison_note: 'Versão 400 mg para quem já usa ou precisa de dose maior.',
      content_angle: 'relaxamento natural',
      blog_support_topics: 'gaba e sono; neurotransmissores; relaxamento',
    },
    'MEJOY-0153': {
      search_intent_primary: 'gaba 400 mg para sono',
      search_intent_secondary: 'gaba dose alta dormir',
      top_questions_real: 'GABA 400 mg é forte? | Diferença entre GABA 200 e 400?',
      science_summary: 'Dose maior de GABA. Literatura sugere que doses variam conforme necessidade individual.',
      evidence_level: 'moderate',
      best_fit_profile: 'Quem já usa GABA ou precisa de dose mais concentrada.',
      not_for_whom: 'Iniciantes podem preferir 200 mg.',
      what_makes_this_formula_different: 'Dose 400 mg — maior concentração para relaxamento mais intenso.',
      comparison_note: 'Versão 200 mg para início suave.',
      content_angle: 'dose concentrada',
      blog_support_topics: 'gaba dose; sono profundo',
    },
    'MEJOY-0154': {
      search_intent_primary: 'melatonina 3 mg comprar',
      search_intent_secondary: 'melatonina para dormir',
      top_questions_real: 'Melatonina 3 mg é suficiente? | Melatonina regula sono?',
      science_summary: 'Melatonina é o hormônio do sono. Estudos mostram que pode auxiliar na regulação do ciclo circadiano.',
      evidence_level: 'strong',
      best_fit_profile: 'Quem busca dose padrão para regular o ciclo do sono.',
      not_for_whom: 'Quem precisa de dose maior ou já usa 5 mg.',
      what_makes_this_formula_different: 'Dose 3 mg — referência para regulação do ciclo.',
      comparison_note: '5 mg para quem precisa de maior duração ou dose mais alta.',
      content_angle: 'regulação do ciclo',
      blog_support_topics: 'melatonina; ciclo circadiano; jet lag',
    },
    'MEJOY-0155': {
      search_intent_primary: 'melatonina 5 mg 100 caps',
      search_intent_secondary: 'melatonina dose alta',
      top_questions_real: 'Melatonina 5 mg funciona? | 100 cápsulas dura quanto?',
      science_summary: 'Dose 5 mg com embalagem de 100 cápsulas. Melatonina auxilia na indução do sono.',
      evidence_level: 'strong',
      best_fit_profile: 'Quem já conhece melatonina e quer maior duração da embalagem.',
      not_for_whom: 'Iniciantes podem preferir 3 mg.',
      what_makes_this_formula_different: '5 mg + 100 cápsulas — economia e dose mais alta.',
      comparison_note: '30 cápsulas para teste; 3 mg para dose menor.',
      content_angle: 'maior duração',
      blog_support_topics: 'melatonina 5 mg; duração do sono',
    },
    'MEJOY-0156': {
      search_intent_primary: 'melatonina 5 mg 30 caps',
      search_intent_secondary: 'melatonina teste',
      top_questions_real: 'Melatonina 5 mg 30 caps vale a pena?',
      science_summary: 'Dose 5 mg em embalagem menor para teste ou uso pontual.',
      evidence_level: 'strong',
      best_fit_profile: 'Quem quer testar melatonina 5 mg sem comprometer com 100 cápsulas.',
      not_for_whom: 'Uso contínuo — preferir 100 cápsulas.',
      what_makes_this_formula_different: '30 cápsulas — ideal para experimentar dose 5 mg.',
      comparison_note: '100 cápsulas para uso prolongado.',
      content_angle: 'teste e viagem',
      blog_support_topics: 'melatonina viagem; teste de dose',
    },
    'MEJOY-0157': {
      search_intent_primary: 'mulungu para dormir',
      search_intent_secondary: 'mulungu relaxamento',
      top_questions_real: 'Mulungu ajuda a dormir? | Mulungu é natural?',
      science_summary: 'Mulungu é planta tradicional brasileira. Estudos preliminares sugerem potencial para relaxamento.',
      evidence_level: 'emerging',
      best_fit_profile: 'Quem prefere fitoterápicos e plantas tradicionais.',
      not_for_whom: 'Quem busca evidência forte de nível farmacológico.',
      what_makes_this_formula_different: 'Planta brasileira com tradição de uso para relaxamento.',
      comparison_note: 'Diferente de melatonina — atua mais no relaxamento que no ciclo.',
      content_angle: 'fitoterapia brasileira',
      blog_support_topics: 'mulungu; plantas para sono; fitoterapia',
    },
    'MEJOY-0158': {
      search_intent_primary: 'passiflora para sono',
      search_intent_secondary: 'passiflora relaxamento',
      top_questions_real: 'Passiflora dá sono? | Passiflora ou valeriana?',
      science_summary: 'Passiflora é usada tradicionalmente para relaxamento e sono leve. Alguns estudos sugerem benefício.',
      evidence_level: 'moderate',
      best_fit_profile: 'Quem busca sono leve, sem sedação forte.',
      not_for_whom: 'Insônia severa — considerar avaliação médica.',
      what_makes_this_formula_different: 'Efeito mais suave — ideal para sono leve e ansiedade noturna.',
      comparison_note: 'Valeriana tende a ser mais sedativa; Passiflora mais suave.',
      content_angle: 'sono leve',
      blog_support_topics: 'passiflora; maracujá; ansiedade noturna',
    },
    'MEJOY-0159': {
      search_intent_primary: 'proslepp para dormir',
      search_intent_secondary: 'proslepp sono',
      top_questions_real: 'O que é Proslepp? | Proslepp funciona?',
      science_summary: 'Proslepp é extrato de cereja. Contém melatonina natural e outros compostos que podem auxiliar no sono.',
      evidence_level: 'moderate',
      best_fit_profile: 'Quem prefere fontes naturais de melatonina.',
      not_for_whom: 'Quem precisa de dose exata e controlada de melatonina.',
      what_makes_this_formula_different: 'Fonte natural de melatonina — cereja Montmorency.',
      comparison_note: 'Melatonina sintética tem dose mais precisa.',
      content_angle: 'indução natural',
      blog_support_topics: 'cereja e sono; melatonina natural',
    },
    'MEJOY-0160': {
      search_intent_primary: 'relora 250 mg comprar',
      search_intent_secondary: 'relora para sono',
      top_questions_real: 'Relora ajuda a dormir? | Relora 250 ou 500?',
      science_summary: 'Relora é combinação de magnolia e phellodendron. Estudos sugerem apoio ao relaxamento e redução de cortisol.',
      evidence_level: 'moderate',
      best_fit_profile: 'Quem tem dificuldade para desligar por estresse ou cortisol alto.',
      not_for_whom: 'Quem busca sedação forte imediata.',
      what_makes_this_formula_different: '250 mg — dose padrão para relaxamento e sono.',
      comparison_note: '500 mg para quem precisa de dose mais concentrada.',
      content_angle: 'cortisol e sono',
      blog_support_topics: 'relora; cortisol; estresse e sono',
    },
    'MEJOY-0161': {
      search_intent_primary: 'relora 500 mg',
      search_intent_secondary: 'relora dose alta',
      top_questions_real: 'Relora 500 mg é forte?',
      science_summary: 'Dose concentrada de Relora. Pode auxiliar quando 250 mg não é suficiente.',
      evidence_level: 'moderate',
      best_fit_profile: 'Quem já usa Relora 250 ou tem necessidade maior.',
      not_for_whom: 'Iniciantes — começar com 250 mg.',
      what_makes_this_formula_different: '500 mg — dose concentrada para relaxamento intenso.',
      comparison_note: '250 mg para início.',
      content_angle: 'dose concentrada',
      blog_support_topics: 'relora dose; estresse crônico',
    },
    'MEJOY-0162': {
      search_intent_primary: 'valeriana para dormir',
      search_intent_secondary: 'valeriana comprar',
      top_questions_real: 'Valeriana induz sono? | Valeriana ou melatonina?',
      science_summary: 'Valeriana é uma das plantas mais estudadas para sono. Metanálises sugerem benefício para indução do sono.',
      evidence_level: 'moderate',
      best_fit_profile: 'Quem busca fitoterápico com boa base de estudos para indução do sono.',
      not_for_whom: 'Gestantes e lactantes.',
      what_makes_this_formula_different: 'Tradição longa de uso e evidência científica moderada.',
      comparison_note: 'Passiflora tende a ser mais suave; Valeriana mais sedativa.',
      content_angle: 'indução do sono',
      blog_support_topics: 'valeriana; fitoterapia sono; plantas sedativas',
    },
  },
  'Menopausa & TPM': {
    'MEJOY-0141': {
      search_intent_primary: 'amora negra menopausa',
      best_fit_profile: 'Mulheres em transição menopausal buscando suporte natural.',
      what_makes_this_formula_different: 'Amora negra com tradição de uso para bem-estar feminino.',
      content_angle: 'transição natural',
    },
    'MEJOY-0145': {
      search_intent_primary: 'composto menopausa comprar',
      best_fit_profile: 'Mulheres com sintomas da menopausa que preferem fórmula combinada.',
      what_makes_this_formula_different: 'Fórmula combinada para múltiplos sintomas.',
      content_angle: 'suporte amplo',
    },
    'MEJOY-0150': {
      search_intent_primary: 'vitex agnus castus TPM',
      best_fit_profile: 'Mulheres com TPM ou irregularidade menstrual.',
      what_makes_this_formula_different: 'Vitex — uma das plantas mais estudadas para ciclo feminino.',
      content_angle: 'TPM e ciclo',
    },
  },
  Lipedema: {
    'MEJOY-0132': {
      search_intent_primary: 'centella asiática lipedema',
      best_fit_profile: 'Quem busca apoio à circulação e saúde dos tecidos.',
      what_makes_this_formula_different: 'Centella com estudos em suporte à microcirculação.',
      content_angle: 'circulação e tecidos',
    },
    'MEJOY-0140': {
      search_intent_primary: 'dimpless lipedema',
      best_fit_profile: 'Pacientes com indicação médica para Dimpless.',
      what_makes_this_formula_different: 'Fórmula específica com orientação médica.',
      content_angle: 'suporte especializado',
    },
  },
};

function getEnrichment(objective: string, sku: string): Record<string, string> {
  const cluster = ENRICHMENT[objective];
  if (!cluster) return {};
  return cluster[sku] ?? {};
}

function computeScores(row: Record<string, string>, enrichment: Record<string, string>): { editorial: number; semantic: number; differentiation: number } {
  let editorial = 50;
  let semantic = 50;
  let differentiation = 50;

  if (row.hero_benefit?.length > 30) editorial += 10;
  if (row.description_md?.length > 200) editorial += 5;
  if (row.faq?.split(/\|/).length >= 4) editorial += 5;
  if (enrichment.science_summary) editorial += 10;
  if (enrichment.best_fit_profile) editorial += 10;
  if (enrichment.what_makes_this_formula_different) differentiation += 20;
  if (enrichment.comparison_note) differentiation += 15;
  if (enrichment.top_questions_real) semantic += 15;
  if (enrichment.search_intent_primary) semantic += 10;

  return {
    editorial: Math.min(100, editorial),
    semantic: Math.min(100, semantic),
    differentiation: Math.min(100, differentiation),
  };
}

function main() {
  if (!fs.existsSync(V2_PATH)) {
    console.error('❌ copy-blueprint-v2.csv não encontrado');
    process.exit(1);
  }

  const v2Rows = parseCSV(fs.readFileSync(V2_PATH, 'utf-8'));
  const v2Headers = Object.keys(v2Rows[0] ?? {});

  const v3Headers = [
    ...v2Headers,
    'search_intent_primary',
    'search_intent_secondary',
    'top_questions_real',
    'science_summary',
    'evidence_level',
    'best_fit_profile',
    'not_for_whom',
    'what_makes_this_formula_different',
    'comparison_note',
    'content_angle',
    'blog_support_topics',
    'internal_link_targets',
    'editorial_score',
    'semantic_depth_score',
    'differentiation_score',
  ];

  const v3Rows: string[][] = [v3Headers];
  let enrichedCount = 0;

  for (const row of v2Rows) {
    const sku = row.sku?.trim();
    if (!sku) continue;

    const objective = row.objective ?? '';
    const enrichment = getEnrichment(objective, sku);
    const scores = computeScores(row, enrichment);

    const internalLinks = row.internal_links ?? `/c/${objective.toLowerCase().replace(/\s*&\s*/g, '-').replace(/\s+/g, '-')} | /produtos`;

    const v3Row: Record<string, string> = {
      ...row,
      search_intent_primary: enrichment.search_intent_primary ?? row.search_intent ?? '',
      search_intent_secondary: enrichment.search_intent_secondary ?? '',
      top_questions_real: enrichment.top_questions_real ?? row.questions_people_ask ?? '',
      science_summary: enrichment.science_summary ?? '',
      evidence_level: enrichment.evidence_level ?? '',
      best_fit_profile: enrichment.best_fit_profile ?? row.who_is_it_for ?? '',
      not_for_whom: enrichment.not_for_whom ?? '',
      what_makes_this_formula_different: enrichment.what_makes_this_formula_different ?? '',
      comparison_note: enrichment.comparison_note ?? '',
      content_angle: enrichment.content_angle ?? '',
      blog_support_topics: enrichment.blog_support_topics ?? '',
      internal_link_targets: internalLinks,
      editorial_score: String(scores.editorial),
      semantic_depth_score: String(scores.semantic),
      differentiation_score: String(scores.differentiation),
    };

    if (Object.keys(enrichment).length > 0) enrichedCount++;

    v3Rows.push(v3Headers.map((h) => escapeCSV(v3Row[h] ?? '')));
  }

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });

  fs.writeFileSync(OUTPUT_PATH, v3Rows.map((r) => r.join(',')).join('\n'), 'utf-8');

  fs.writeFileSync(
    REPORT_PATH,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        totalRows: v3Rows.length - 1,
        enrichedCount,
        priorityClusters: PRIORITY_CLUSTERS,
        newColumns: v3Headers.filter((h) => !v2Headers.includes(h)),
      },
      null,
      2
    ),
    'utf-8'
  );

  console.log('✅ Copy Blueprint v3 gerado');
  console.log(`   Output: ${OUTPUT_PATH}`);
  console.log(`   Linhas: ${v3Rows.length - 1}`);
  console.log(`   Enriquecidos (Sono): ${enrichedCount}`);
  console.log(`   Novas colunas: ${v3Headers.length - v2Headers.length}`);
  console.log(`   Relatório: ${REPORT_PATH}`);
}

main();
