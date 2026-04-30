#!/usr/bin/env tsx
/**
 * Hardening final do copy-blueprint-v4 para lançamento:
 * - FAQ com mínimo de 5 pares
 * - para_que_serve com mínimo de 5 pares
 * - how_to_use_bullets com mínimo de 3 itens
 * - advertencias_completo obrigatório
 * - seoDescription <= 155
 */

import * as fs from 'fs';
import * as path from 'path';
import { parseCSV, writeCSV } from './lib/copy-utils';

const BLUEPRINT_PATH = path.join(process.cwd(), 'data', 'store-v2', 'copy', 'copy-blueprint-v4.csv');
const REPORT_PATH = path.join(process.cwd(), 'scripts', 'generated', 'copy-launch-harden-report.json');

const DEFAULT_WARNINGS =
  'Imagens meramente ilustrativas. Manter em local seco, longe da luz e do calor. Manter fora do alcance das crianças. Gestantes, lactantes e crianças devem consultar médico antes do uso. Este produto não substitui uma alimentação equilibrada e hábitos saudáveis.';

function splitPipe(text: string): string[] {
  return (text ?? '').split(/\s*\|\s*/).map((s) => s.trim()).filter(Boolean);
}

function sanitizeText(text: string, max = 180): string {
  const normalized = (text ?? '').replace(/\s+/g, ' ').trim();
  if (normalized.length <= max) return normalized;
  return normalized.slice(0, max - 1).trimEnd() + '…';
}

function getObjectiveBenefits(objective: string): Array<{ title: string; desc: string }> {
  const base: Record<string, Array<{ title: string; desc: string }>> = {
    'Ansiedade & Humor': [
      { title: 'Equilíbrio emocional', desc: 'Pode auxiliar na estabilidade do humor ao longo do dia.' },
      { title: 'Apoio ao estresse', desc: 'Pode apoiar a resposta do organismo em períodos de maior pressão.' },
      { title: 'Mais clareza mental', desc: 'Pode contribuir para foco e bem-estar na rotina.' },
      { title: 'Sono mais regular', desc: 'Pode favorecer relaxamento, quando associado a hábitos saudáveis.' },
      { title: 'Rotina sustentável', desc: 'Uso diário com orientação profissional para resultados consistentes.' },
      { title: 'Complemento seguro', desc: 'Atua como apoio nutricional, sem substituir conduta médica.' },
    ],
    'Emagrecimento & Metabolismo': [
      { title: 'Controle do apetite', desc: 'Pode auxiliar na saciedade e no manejo da fome entre refeições.' },
      { title: 'Apoio metabólico', desc: 'Pode apoiar o metabolismo energético em conjunto com rotina saudável.' },
      { title: 'Gestão de peso', desc: 'Pode contribuir para o gerenciamento de peso com acompanhamento.' },
      { title: 'Mais consistência', desc: 'Ajuda a manter disciplina no plano alimentar e na rotina.' },
      { title: 'Suporte diário', desc: 'Uso contínuo pode favorecer evolução progressiva dos resultados.' },
      { title: 'Abordagem equilibrada', desc: 'Apoio nutricional sem promessas absolutas.' },
    ],
    'Sono': [
      { title: 'Relaxamento noturno', desc: 'Pode auxiliar na transição para o período de descanso.' },
      { title: 'Qualidade do sono', desc: 'Pode contribuir para noites mais reparadoras.' },
      { title: 'Rotina de descanso', desc: 'Pode ajudar na regularidade do ciclo sono-vigília.' },
      { title: 'Menos despertares', desc: 'Pode apoiar maior continuidade do sono em algumas pessoas.' },
      { title: 'Recuperação diária', desc: 'Sono de melhor qualidade contribui para disposição no dia seguinte.' },
      { title: 'Complemento da higiene do sono', desc: 'Potencializa resultados quando associado a hábitos noturnos adequados.' },
    ],
    'Cabelo': [
      { title: 'Saúde capilar', desc: 'Pode apoiar o cuidado global dos fios e do couro cabeludo.' },
      { title: 'Fortalecimento dos fios', desc: 'Pode auxiliar na resistência e qualidade da fibra capilar.' },
      { title: 'Rotina de manutenção', desc: 'Pode contribuir para continuidade do tratamento capilar.' },
      { title: 'Apoio ao crescimento saudável', desc: 'Pode favorecer ambiente nutricional para o ciclo capilar.' },
      { title: 'Cuidado diário', desc: 'Integra bem com higiene e manejo adequados dos fios.' },
      { title: 'Suporte complementar', desc: 'Não substitui avaliação dermatológica quando necessária.' },
    ],
    'Intestino': [
      { title: 'Conforto digestivo', desc: 'Pode auxiliar no bem-estar intestinal no dia a dia.' },
      { title: 'Equilíbrio intestinal', desc: 'Pode apoiar a função digestiva e intestinal.' },
      { title: 'Menos desconfortos', desc: 'Pode contribuir para redução de sintomas inespecíficos digestivos.' },
      { title: 'Rotina alimentar', desc: 'Funciona melhor com hidratação e dieta adequadas.' },
      { title: 'Bem-estar geral', desc: 'Saúde intestinal pode refletir em energia e disposição.' },
      { title: 'Apoio contínuo', desc: 'Uso regular com orientação profissional quando indicado.' },
    ],
    'Imunidade': [
      { title: 'Defesa do organismo', desc: 'Pode apoiar o funcionamento fisiológico do sistema imune.' },
      { title: 'Suporte antioxidante', desc: 'Pode auxiliar na proteção celular contra estresse oxidativo.' },
      { title: 'Recuperação diária', desc: 'Pode contribuir para manutenção da vitalidade.' },
      { title: 'Rotina preventiva', desc: 'Atua como suporte nutricional em hábitos de prevenção.' },
      { title: 'Saúde global', desc: 'Pode somar ao cuidado com sono, alimentação e atividade física.' },
      { title: 'Uso responsável', desc: 'Deve ser utilizado conforme orientação profissional.' },
    ],
    'Articulações': [
      { title: 'Mobilidade', desc: 'Pode auxiliar na manutenção da mobilidade articular.' },
      { title: 'Conforto articular', desc: 'Pode contribuir para rotina mais confortável.' },
      { title: 'Suporte estrutural', desc: 'Pode apoiar tecidos envolvidos no movimento.' },
      { title: 'Atividade diária', desc: 'Pode ajudar na continuidade de atividades cotidianas.' },
      { title: 'Apoio ao envelhecimento saudável', desc: 'Pode complementar estratégias de cuidado articular.' },
      { title: 'Uso contínuo orientado', desc: 'Resultados tendem a ser graduais e individuais.' },
    ],
    'Detox & Fígado': [
      { title: 'Suporte hepático', desc: 'Pode auxiliar no suporte funcional do fígado.' },
      { title: 'Equilíbrio metabólico', desc: 'Pode apoiar processos fisiológicos ligados ao metabolismo.' },
      { title: 'Ação antioxidante', desc: 'Pode contribuir para proteção celular em contexto hepático.' },
      { title: 'Rotina de cuidado', desc: 'Potencializa resultados com alimentação equilibrada.' },
      { title: 'Bem-estar digestivo', desc: 'Pode favorecer sensação de leveza em alguns perfis.' },
      { title: 'Complemento seguro', desc: 'Não substitui acompanhamento médico quando necessário.' },
    ],
    'Hormonal & Libido': [
      { title: 'Equilíbrio hormonal', desc: 'Pode apoiar o equilíbrio em fases de maior oscilação.' },
      { title: 'Vitalidade', desc: 'Pode contribuir para energia e disposição na rotina.' },
      { title: 'Bem-estar sexual', desc: 'Pode auxiliar no suporte ao bem-estar íntimo.' },
      { title: 'Qualidade de vida', desc: 'Pode colaborar para rotina mais estável e confortável.' },
      { title: 'Acompanhamento profissional', desc: 'Uso orientado melhora segurança e previsibilidade.' },
      { title: 'Abordagem individual', desc: 'Resposta varia conforme perfil e contexto de cada pessoa.' },
    ],
    'Menopausa & TPM': [
      { title: 'Conforto hormonal', desc: 'Pode auxiliar no bem-estar em fases hormonais desafiadoras.' },
      { title: 'Apoio aos sintomas vasomotores', desc: 'Pode contribuir para rotina mais confortável.' },
      { title: 'Equilíbrio emocional', desc: 'Pode apoiar estabilidade do humor ao longo do ciclo.' },
      { title: 'Qualidade do sono', desc: 'Pode favorecer melhor recuperação noturna em alguns perfis.' },
      { title: 'Disposição diária', desc: 'Pode contribuir para energia e bem-estar geral.' },
      { title: 'Suporte com orientação', desc: 'Uso deve considerar contexto clínico individual.' },
    ],
    'Lipedema': [
      { title: 'Conforto circulatório', desc: 'Pode apoiar cuidado da circulação periférica.' },
      { title: 'Suporte ao manejo do lipedema', desc: 'Pode integrar estratégias de cuidado clínico e comportamental.' },
      { title: 'Bem-estar nas pernas', desc: 'Pode contribuir para rotina com mais conforto.' },
      { title: 'Apoio metabólico', desc: 'Pode auxiliar em estratégias complementares de saúde.' },
      { title: 'Abordagem multidisciplinar', desc: 'Melhor resultado com orientação médica e hábitos saudáveis.' },
      { title: 'Uso contínuo responsável', desc: 'Resposta é individual e deve ser monitorada.' },
    ],
  };
  return base[objective] ?? [
    { title: 'Apoio ao objetivo de saúde', desc: 'Pode auxiliar no objetivo principal deste produto.' },
    { title: 'Suporte diário', desc: 'Pode contribuir para mais consistência na rotina de cuidado.' },
    { title: 'Bem-estar geral', desc: 'Pode apoiar a qualidade de vida quando associado a hábitos saudáveis.' },
    { title: 'Uso orientado', desc: 'Deve ser utilizado com orientação profissional quando necessário.' },
    { title: 'Evolução gradual', desc: 'Resultados tendem a ser progressivos e individuais.' },
  ];
}

function buildFaq(productName: string): Array<{ q: string; a: string }> {
  return [
    {
      q: `O que é ${productName}?`,
      a: `${productName} é uma fórmula manipulada de suporte nutricional para o objetivo indicado na página.`,
    },
    {
      q: `Como devo usar ${productName}?`,
      a: 'Siga a orientação do seu médico ou nutricionista e respeite a posologia informada.',
    },
    {
      q: `${productName} funciona para todo mundo?`,
      a: 'A resposta varia de pessoa para pessoa e depende do contexto clínico e dos hábitos de vida.',
    },
    {
      q: `${productName} tem contraindicações?`,
      a: 'Gestantes, lactantes, crianças e pessoas em tratamento devem consultar profissional de saúde antes do uso.',
    },
    {
      q: `Posso combinar ${productName} com outros suplementos?`,
      a: 'Pode haver interação. Consulte um profissional para avaliar a combinação ideal e segura para seu caso.',
    },
  ];
}

function toFaqPipe(faq: Array<{ q: string; a: string }>): string {
  return faq.flatMap((f) => [f.q, f.a]).map((s) => sanitizeText(s, 260)).join(' | ');
}

function main() {
  if (!fs.existsSync(BLUEPRINT_PATH)) {
    console.error('❌ copy-blueprint-v4.csv não encontrado.');
    process.exit(1);
  }

  const { headers, rows } = parseCSV(fs.readFileSync(BLUEPRINT_PATH, 'utf-8'));
  let faqUpdated = 0;
  let paraUpdated = 0;
  let howToUseUpdated = 0;
  let warningsUpdated = 0;
  let seoTrimmed = 0;
  let seoTitleUpdated = 0;
  let mechanismUpdated = 0;

  for (const row of rows) {
    const productName = (row.productName ?? row.normalizedProductName ?? 'este produto').trim();
    const objective = (row.objective ?? '').trim();
    const pack = (row.pack ?? row.normalizedPack ?? row.normalizedFormDisplay ?? '').trim();

    const faqParts = splitPipe(row.faq ?? '');
    const faqPairs = Math.floor(faqParts.length / 2);
    if (faqPairs < 5) {
      row.faq = toFaqPipe(buildFaq(productName));
      faqUpdated++;
    }

    const paraParts = splitPipe(row.para_que_serve ?? '');
    const paraPairs = Math.floor(paraParts.length / 2);
    if (paraPairs < 5) {
      const benefits = getObjectiveBenefits(objective).slice(0, 6);
      row.para_que_serve = benefits
        .flatMap((b) => [sanitizeText(b.title, 80), sanitizeText(b.desc, 200)])
        .join(' | ');
      paraUpdated++;
    } else {
      const normalized: string[] = [];
      for (let i = 0; i < paraParts.length - 1; i += 2) {
        normalized.push(sanitizeText(paraParts[i] ?? '', 80));
        normalized.push(sanitizeText(paraParts[i + 1] ?? paraParts[i] ?? '', 200));
      }
      row.para_que_serve = normalized.join(' | ');
    }

    const howToUse = splitPipe(row.how_to_use_bullets ?? '')
      .map((s) => s.replace(/^[-*]\s*/, '').trim())
      .filter(Boolean);
    if (howToUse.length < 3) {
      const bullets = [
        howToUse[0] || 'Tomar conforme orientação profissional.',
        howToUse[1] || (pack ? `Apresentação: ${pack}.` : 'Respeite a posologia indicada na página.'),
        howToUse[2] || 'Não exceder a recomendação de uso.',
      ];
      row.how_to_use_bullets = bullets.map((b) => `- ${sanitizeText(b, 120)}`).join(' | ');
      howToUseUpdated++;
    } else {
      row.how_to_use_bullets = howToUse.slice(0, 6).map((b) => `- ${sanitizeText(b, 120)}`).join(' | ');
    }

    if (!(row.advertencias_completo ?? '').trim()) {
      row.advertencias_completo = DEFAULT_WARNINGS;
      warningsUpdated++;
    } else {
      row.advertencias_completo = sanitizeText(row.advertencias_completo, 420);
    }

    if ((row.seoDescription ?? '').length > 155) {
      row.seoDescription = sanitizeText(row.seoDescription, 155);
      seoTrimmed++;
    }

    const seoTitle = (row.seoTitle ?? '').trim();
    if (seoTitle.length < 30) {
      row.seoTitle = sanitizeText(`${productName} | MeJoy Farmácia de Manipulação`, 70);
      seoTitleUpdated++;
    }

    const mechanism = (row.mechanism_summary ?? '').trim();
    if (mechanism.length < 30) {
      const base = (row.science_summary ?? '').trim() || (row.hero_benefit ?? '').trim() || (row.shortBenefit ?? '').trim();
      const fallback = base.length >= 30
        ? base
        : `${productName} pode auxiliar no objetivo de ${objective || 'saúde'} com uso orientado e rotina consistente.`;
      row.mechanism_summary = sanitizeText(fallback, 200);
      mechanismUpdated++;
    }
  }

  fs.writeFileSync(BLUEPRINT_PATH, writeCSV(headers, rows), 'utf-8');

  const report = {
    generatedAt: new Date().toISOString(),
    totalRows: rows.length,
    faqUpdated,
    paraUpdated,
    howToUseUpdated,
    warningsUpdated,
    seoTrimmed,
    seoTitleUpdated,
    mechanismUpdated,
  };
  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), 'utf-8');

  console.log('✅ Harden copy de lançamento concluído');
  console.log(`   FAQ atualizados: ${faqUpdated}`);
  console.log(`   para_que_serve atualizados: ${paraUpdated}`);
  console.log(`   how_to_use atualizados: ${howToUseUpdated}`);
  console.log(`   advertências atualizadas: ${warningsUpdated}`);
  console.log(`   seoDescription truncadas: ${seoTrimmed}`);
  console.log(`   seoTitle reforçados: ${seoTitleUpdated}`);
  console.log(`   mechanism_summary reforçados: ${mechanismUpdated}`);
  console.log(`   Relatório: ${REPORT_PATH}`);
}

main();
