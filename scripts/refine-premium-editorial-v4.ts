#!/usr/bin/env tsx
/**
 * Rodada final premium editorial no copy v4.
 * - Remove texto generico
 * - Fortalece first fold (subtitulo + 5 beneficios)
 * - Melhora blocos "o que e / para quem / como usar / cuidados"
 * - Preserva Akkermat (MEJOY-0048) intacto
 */

import * as fs from 'fs';
import * as path from 'path';
import { parseCSV, writeCSV } from './lib/copy-utils';

const BLUEPRINT_PATH = path.join(process.cwd(), 'data', 'store-v2', 'copy', 'copy-blueprint-v4.csv');
const AUDIT_PATH = path.join(process.cwd(), 'scripts', 'generated', 'premium-editorial-audit.json');
const REPORT_PATH = path.join(process.cwd(), 'scripts', 'generated', 'premium-editorial-refine-report.json');

const MASTER_SKU = 'MEJOY-0048';
const NL = ' | ';

type PremiumClass =
  | 'OK_PREMIUM'
  | 'AJUSTE_COPY'
  | 'AJUSTE_FIRST_FOLD'
  | 'AJUSTE_CORPO'
  | 'AJUSTE_COMPLETO';

interface AuditItem {
  sku: string;
  classification: PremiumClass;
}

interface Profile {
  focus: string;
  audience: string;
  whenToConsider: string;
  differentiators: string[];
  hero: string[];
  paraBlocks: Array<{ title: string; desc: string }>;
  cautionExtra: string;
}

interface Ctx {
  sku: string;
  productName: string;
  objective: string;
  active: string;
  dose: string;
  pack: string;
  formKey: string;
}

const GENERIC_PATTERNS = [
  'é uma fórmula manipulada que pode auxiliar no suporte ao seu objetivo',
  'é uma formula manipulada que pode auxiliar no suporte ao seu objetivo',
  'foi formulado para apoiar saúde dos fios e couro cabeludo com formulação direcionada',
  'uso orientado e rotina consistente',
  'apoio ao objetivo de saúde do produto',
  'fórmula manipulada com qualidade',
  'formula manipulada com qualidade',
  'complemento para hábitos saudáveis',
  'complemento para habitos saudaveis',
  'uso prático para rotina diária',
  'uso pratico para rotina diaria',
  'benefício associado ao objetivo',
  'beneficio associado ao objetivo',
  'quem busca apoio para',
];

function clean(value: string | null | undefined): string {
  return (value ?? '').replace(/\s+/g, ' ').trim();
}

function normalizeDose(value: string | null | undefined): string {
  const v = clean(value);
  if (!v) return '';
  if (/^[—-]+$/u.test(v)) return '';
  if (/^(na|n\/a|nd)$/i.test(v)) return '';
  return v;
}

function normalizeActive(value: string | null | undefined): string {
  return clean(value).replace(/^[—–\-:;,.]+|[—–\-:;,.]+$/g, '').trim();
}

function hashSeed(value: string): number {
  let h = 0;
  for (const ch of String(value ?? '')) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h;
}

function normalizeToken(value: string): string {
  return clean(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function sameActiveAsProductName(active: string, productName: string): boolean {
  const a = normalizeToken(active);
  const p = normalizeToken(productName);
  if (!a || !p) return false;
  if (a.length < 3) return false;
  return p.includes(a);
}

function truncate(text: string, max: number): string {
  const n = clean(text);
  if (n.length <= max) return n;
  const sliced = n.slice(0, max - 1);
  const cut = sliced.lastIndexOf(' ');
  const safe = (cut > 40 ? sliced.slice(0, cut) : sliced).trimEnd().replace(/[.…]+$/g, '');
  return /[.!?]$/.test(safe) ? safe : `${safe}.`;
}

function hasGeneric(text: string): boolean {
  const normalized = clean(text).toLowerCase();
  return GENERIC_PATTERNS.some((p) => normalized.includes(p.toLowerCase()));
}

function humanizeActive(raw: string, fallback: string): string {
  const source = normalizeActive(raw) || normalizeActive(fallback) || 'fórmula';
  const words = source.split(/\s+/).map((w) => {
    if (/^[A-Z0-9+%()./-]{2,}$/.test(w) && (w.length <= 3 || /\d|[+%/-]/.test(w))) return w;
    return w.replace(/^([^A-Za-zÀ-ÿ]*)([A-Za-zÀ-ÿ])([\s\S]*)$/, (_m, prefix, first, rest) => {
      return `${prefix}${String(first).toUpperCase()}${String(rest).toLowerCase()}`;
    });
  });
  return words.join(' ');
}

function pickWithSeed(options: string[], seed: number, offset = 0): string {
  if (!options.length) return '';
  return options[(seed + offset) % options.length] || options[0];
}

function ptBr(text: string): string {
  return clean(text)
    .replace(/\bequilibrio\b/gi, 'equilíbrio')
    .replace(/\bemocional diario\b/gi, 'emocional diário')
    .replace(/\bmetabolico\b/gi, 'metabólico')
    .replace(/\benergetico\b/gi, 'energético')
    .replace(/\bsaude\b/gi, 'saúde')
    .replace(/\bmanutencao\b/gi, 'manutenção')
    .replace(/\bauxilio\b/gi, 'auxílio')
    .replace(/\bconstancia\b/gi, 'constância')
    .replace(/\borientacao\b/gi, 'orientação')
    .replace(/\bhabitos\b/gi, 'hábitos')
    .replace(/\btopico\b/gi, 'tópico')
    .replace(/\bclinico\b/gi, 'clínico')
    .replace(/\badesao\b/gi, 'adesão')
    .replace(/\bpressao\b/gi, 'pressão')
    .replace(/\bnutricao\b/gi, 'nutrição')
    .replace(/\bfuncao\b/gi, 'função')
    .replace(/\bpratica\b/gi, 'prática')
    .replace(/\bmedico\b/gi, 'médico')
    .replace(/\bpsicofarmacos\b/gi, 'psicofármacos')
    .replace(/\blipoico\b/gi, 'lipóico')
    .replace(/\bprotecao\b/gi, 'proteção')
    .replace(/\bdirecao\b/gi, 'direção')
    .replace(/\bforca\b/gi, 'força')
    .replace(/\brecuperacao\b/gi, 'recuperação');
}

function activeDoseLabel(ctx: Ctx): string {
  const active = humanizeActive(ctx.active, ctx.productName);
  const dose = clean(ctx.dose);
  if (!active && !dose) return 'dose definida';
  if (!dose) return active;
  return `${active} ${dose}`;
}

function formUnit(formKey: string): string {
  if (formKey === 'caps') return 'cápsula';
  if (formKey === 'sachet') return 'sachê';
  if (formKey === 'powder') return 'porção';
  if (formKey === 'topical' || formKey === 'cream') return 'aplicação';
  return 'dose';
}

function objectiveProfile(objective: string): Profile {
  const map: Record<string, Profile> = {
    'Ansiedade & Humor': {
      focus: 'equilibrio emocional, foco e manejo do estresse da rotina',
      audience: 'adultos que sentem oscilacao de humor, irritabilidade ou sobrecarga mental ao longo do dia',
      whenToConsider: 'quando ha estresse recorrente, dificuldade de desacelerar e necessidade de suporte nutricional consistente',
      differentiators: [
        'ativo selecionado para suporte de neurotransmissores e adaptacao ao estresse',
        'dose padronizada para rotina diaria com orientacao profissional',
      ],
      hero: [
        'apoio ao equilibrio emocional em dias de maior pressao',
        'suporte para foco e clareza mental sem promessas absolutas',
        'auxilio para reduzir tensao e desconforto emocional da rotina',
        'uso continuo para construir estabilidade com habitos saudaveis',
        'resultado progressivo com adesao e acompanhamento profissional',
      ],
      paraBlocks: [
        { title: 'Equilibrio emocional diario', desc: 'Pode auxiliar na estabilidade do humor durante a rotina de trabalho, estudo e vida pessoal.' },
        { title: 'Resposta ao estresse', desc: 'Ajuda a compor estrategia nutricional para periodos de maior pressao, sem substituir avaliacao clinica.' },
        { title: 'Foco com mais constancia', desc: 'Pode contribuir para clareza mental e consistencia em tarefas que exigem atencao prolongada.' },
        { title: 'Rotina mais previsivel', desc: 'Com uso orientado, pode apoiar uma rotina com menos oscilacoes e mais bem-estar.' },
        { title: 'Cuidado complementar', desc: 'Funciona melhor quando associado a sono, alimentacao e manejo de estresse no dia a dia.' },
      ],
      cautionExtra: 'Pessoas em uso de psicofarmacos devem alinhar o uso com profissional de saude.',
    },
    'Articulações': {
      focus: 'conforto articular, mobilidade e recuperacao funcional',
      audience: 'pessoas com desgaste da rotina, desconforto articular ou necessidade de suporte para movimento',
      whenToConsider: 'quando ha rigidez, sobrecarga de treino, trabalho repetitivo ou busca por apoio a longo prazo',
      differentiators: [
        'estrategia nutricional voltada para mobilidade e conforto no dia a dia',
        'dose adequada para uso continuo dentro de plano de cuidado articular',
      ],
      hero: [
        'apoio ao conforto articular para rotina com menos limitacao',
        'suporte a mobilidade e flexibilidade em atividades diarias',
        'auxilio para continuidade de treino e trabalho com mais seguranca',
        'estrategia complementar para tecido cartilaginoso e estruturas de suporte',
        'uso progressivo com expectativa realista de evolucao',
      ],
      paraBlocks: [
        { title: 'Conforto para mover', desc: 'Pode auxiliar no conforto articular em tarefas cotidianas, treino e deslocamento.' },
        { title: 'Mobilidade funcional', desc: 'Contribui para manter amplitude de movimento e continuidade da rotina.' },
        { title: 'Suporte de longo prazo', desc: 'A proposta e evolucao gradual com uso orientado e disciplina no cuidado.' },
        { title: 'Apoio em fases de sobrecarga', desc: 'Pode compor estrategia de cuidado em periodos de maior impacto articular.' },
        { title: 'Plano completo de cuidado', desc: 'Funciona melhor com fortalecimento, controle de carga e avaliacao profissional.' },
      ],
      cautionExtra: 'Dor intensa, trauma ou limitacao importante exigem avaliacao medica imediata.',
    },
    Cabelo: {
      focus: 'saude dos fios, couro cabeludo e manutencao da qualidade capilar',
      audience: 'pessoas com queda, enfraquecimento dos fios ou busca de suporte para rotina capilar',
      whenToConsider: 'quando ha queda recorrente, fios finos, quebra ou necessidade de estrategia complementar para o couro cabeludo',
      differentiators: [
        'composicao voltada para ciclo capilar e nutricao de fios',
        'uso continuo para manter consistencia na rotina de cuidado',
      ],
      hero: [
        'apoio ao fortalecimento dos fios ao longo das semanas',
        'suporte ao couro cabeludo para ambiente capilar mais equilibrado',
        'auxilio para reduzir quebra e perda de densidade aparente',
        'complemento para rotinas com shampoo, topico e orientacao profissional',
        'dose ajustada para adesao diaria e acompanhamento de resultados',
      ],
      paraBlocks: [
        { title: 'Fortalecimento capilar', desc: 'Pode auxiliar na resistencia da fibra capilar e na qualidade geral dos fios.' },
        { title: 'Cuidado do couro cabeludo', desc: 'Apoia estrategia para um couro cabeludo mais equilibrado dentro da rotina de cuidado.' },
        { title: 'Suporte em fases de queda', desc: 'Pode compor plano nutricional em periodos de queda aumentada ou enfraquecimento.' },
        { title: 'Consistencia de tratamento', desc: 'Uso regular ajuda a manter continuidade do cuidado capilar a medio e longo prazo.' },
        { title: 'Abordagem complementar', desc: 'Melhor resposta quando associado a alimentacao, sono e manejo de estresse.' },
      ],
      cautionExtra: 'Queda intensa, falhas localizadas ou sinais inflamatorios pedem avaliacao dermatologica.',
    },
    'Detox & Fígado': {
      focus: 'suporte hepatometabolico e conforto digestivo',
      audience: 'pessoas que buscam estrategia nutricional para rotina metabolica e digestiva',
      whenToConsider: 'quando ha sensacao de sobrecarga digestiva, alimentacao irregular ou plano de ajuste metabolico',
      differentiators: [
        'ativo com foco em suporte funcional do figado e metabolismo',
        'uso complementar para rotina de cuidado nutricional com orientacao',
      ],
      hero: [
        'apoio ao suporte funcional do figado no dia a dia',
        'suporte antioxidante para rotina metabolica e digestiva',
        'auxilio para sensacao de leveza em contexto de habitos saudaveis',
        'estrategia complementar para organizacao alimentar e consistencia',
        'dose padronizada para uso responsavel e progressivo',
      ],
      paraBlocks: [
        { title: 'Suporte hepatometabolico', desc: 'Pode auxiliar no cuidado funcional do figado dentro de uma rotina nutricional organizada.' },
        { title: 'Conforto digestivo', desc: 'Contribui para estrategia de bem-estar digestivo quando associado a alimentacao adequada.' },
        { title: 'Apoio antioxidante', desc: 'Pode integrar plano de reducao de estresse oxidativo de forma complementar.' },
        { title: 'Rotina mais estavel', desc: 'Uso continuo e orientado pode favorecer consistencia no cuidado metabolico.' },
        { title: 'Cuidado sem exagero', desc: 'Nao substitui tratamento medico; atua como apoio nutricional com expectativa realista.' },
      ],
      cautionExtra: 'Pessoas com doenca hepatica ativa devem ter acompanhamento medico antes do uso.',
    },
    'Emagrecimento & Metabolismo': {
      focus: 'controle de apetite, metabolismo energetico e gerenciamento de peso',
      audience: 'pessoas em estrategia de reducao de gordura e melhoria de composicao corporal',
      whenToConsider: 'quando ha fome desorganizada, baixa aderencia ao plano alimentar ou busca de suporte metabolico',
      differentiators: [
        'ativo direcionado para saciedade e suporte metabolico em rotina real',
        'uso complementar para plano alimentar, treino e acompanhamento profissional',
      ],
      hero: [
        'apoio ao controle do apetite entre refeicoes',
        'suporte ao metabolismo energetico com rotina consistente',
        'auxilio para reduzir impulsos alimentares e melhorar aderencia',
        'estrategia complementar para composicao corporal com habitos saudaveis',
        'dose clara por unidade para acompanhamento progressivo',
      ],
      paraBlocks: [
        { title: 'Apetite mais previsivel', desc: 'Pode auxiliar no controle de fome e na reducao de lanches impulsivos ao longo do dia.' },
        { title: 'Metabolismo como suporte', desc: 'Contribui para estrategia de gasto energetico quando associado a treino e alimentacao adequada.' },
        { title: 'Aderencia ao plano', desc: 'Ajuda a manter consistencia no processo de gerenciamento de peso sem promessas irreais.' },
        { title: 'Composicao corporal', desc: 'Pode compor plano para reducao de gordura com expectativa progressiva e acompanhamento.' },
        { title: 'Rotina sustentavel', desc: 'Melhor resultado com sono, hidratacao, movimento e orientacao profissional continua.' },
      ],
      cautionExtra: 'Nao usar como substituto de refeicoes; manter acompanhamento nutricional sempre que possivel.',
    },
    'Hormonal & Libido': {
      focus: 'equilibrio hormonal, vitalidade e bem-estar intimo',
      audience: 'pessoas que buscam suporte para energia, desejo sexual e estabilidade hormonal',
      whenToConsider: 'quando ha queda de disposicao, oscilacao hormonal ou perda de vitalidade na rotina',
      differentiators: [
        'foco em suporte hormonal e funcional com abordagem clinico-comercial responsavel',
        'composicao para uso orientado conforme objetivo individual',
      ],
      hero: [
        'apoio ao equilibrio hormonal com foco em rotina e bem-estar',
        'suporte para disposicao fisica e mental no dia a dia',
        'auxilio para vitalidade e qualidade de vida intima',
        'estrategia complementar com expectativa realista e sem promessas absolutas',
        'dose definida por unidade para controle de adesao',
      ],
      paraBlocks: [
        { title: 'Equilibrio funcional', desc: 'Pode auxiliar na estabilidade hormonal e na qualidade de vida da rotina adulta.' },
        { title: 'Vitalidade diaria', desc: 'Contribui para disposicao e energia quando associado a habitos saudaveis.' },
        { title: 'Bem-estar intimo', desc: 'Pode compor estrategia de suporte para libido e conforto na vida sexual.' },
        { title: 'Acompanhamento individual', desc: 'Uso orientado permite ajustes conforme resposta e contexto clinico de cada pessoa.' },
        { title: 'Cuidado complementar', desc: 'Nao substitui investigacao de causas hormonais; atua como apoio nutricional.' },
      ],
      cautionExtra: 'Se houver uso de hormonios ou historico endocrino, o acompanhamento profissional e obrigatorio.',
    },
    Imunidade: {
      focus: 'defesas fisiologicas e resiliencia do organismo',
      audience: 'pessoas com rotina intensa que buscam suporte nutricional para imunidade',
      whenToConsider: 'em periodos de maior exposicao, estresse, baixa recuperacao ou queda de vitalidade',
      differentiators: [
        'ativo com foco em suporte imunologico e antioxidante',
        'composicao para rotina preventiva com uso orientado e continuo',
      ],
      hero: [
        'apoio as defesas naturais do organismo',
        'suporte antioxidante para rotina de prevencao e recuperacao',
        'auxilio para manter energia e regularidade ao longo das semanas',
        'estrategia complementar para fases de maior demanda fisica',
        'dose padronizada para uso diario com controle de qualidade',
      ],
      paraBlocks: [
        { title: 'Defesa fisiologica', desc: 'Pode auxiliar no suporte do sistema imune em momentos de maior exigencia da rotina.' },
        { title: 'Resistencia no dia a dia', desc: 'Contribui para manter consistencia em trabalho, estudo e treino com melhor recuperacao.' },
        { title: 'Apoio antioxidante', desc: 'Pode integrar estrategia para reduzir impacto de estresse oxidativo.' },
        { title: 'Rotina preventiva', desc: 'Uso regular orientado fortalece estrategia preventiva junto de habitos saudaveis.' },
        { title: 'Plano completo de saude', desc: 'Resultado depende de sono, alimentacao, hidratacao e acompanhamento quando necessario.' },
      ],
      cautionExtra: 'Nao substitui conduta medica em infeccoes ativas ou doencas autoimunes.',
    },
    Intestino: {
      focus: 'conforto digestivo, regularidade intestinal e equilibrio da microbiota',
      audience: 'pessoas com estufamento, irregularidade intestinal ou desconforto apos refeicoes',
      whenToConsider: 'quando ha alteracao de ritmo intestinal, sensibilidade digestiva ou dieta desorganizada',
      differentiators: [
        'ativo selecionado para rotina digestiva e equilibrio intestinal',
        'estrategia complementar para microbiota e funcao digestiva',
      ],
      hero: [
        'apoio ao conforto intestinal e digestivo no dia a dia',
        'suporte para regularidade e melhor tolerancia alimentar',
        'auxilio para reduzir desconforto apos refeicoes em rotina orientada',
        'estrategia complementar para microbiota e bem-estar abdominal',
        'dose definida por unidade para uso continuo com previsibilidade',
      ],
      paraBlocks: [
        { title: 'Conforto abdominal', desc: 'Pode auxiliar na reducao de desconfortos digestivos recorrentes do dia a dia.' },
        { title: 'Ritmo intestinal', desc: 'Contribui para regularidade intestinal com rotina alimentar e hidratacao adequadas.' },
        { title: 'Microbiota em equilibrio', desc: 'Pode compor estrategia para manutencao da saude intestinal de forma progressiva.' },
        { title: 'Digestao mais funcional', desc: 'Apoia bem-estar apos refeicoes quando usado com orientacao e constancia.' },
        { title: 'Plano integrado', desc: 'Resultado melhora com ajuste de fibras, agua, atividade fisica e sono.' },
      ],
      cautionExtra: 'Sintomas persistentes, dor intensa ou alteracao importante de habito intestinal exigem avaliacao medica.',
    },
    Lipedema: {
      focus: 'suporte circulatorio, conforto periferico e estrategia complementar para manejo de lipedema',
      audience: 'pessoas em acompanhamento para lipedema que buscam apoio nutricional',
      whenToConsider: 'quando ha desconforto em membros inferiores, sensacao de peso e necessidade de rotina consistente',
      differentiators: [
        'composicao voltada para suporte vascular e bem-estar periferico',
        'uso complementar dentro de estrategia multidisciplinar para lipedema',
      ],
      hero: [
        'apoio ao conforto em pernas e tecidos perifericos',
        'suporte para rotina de manejo de lipedema com consistencia',
        'auxilio para estrategia circulatoria e metabolica complementar',
        'combina com plano de movimento, compressao e acompanhamento clinico',
        'dose orientada para uso continuo e monitorado',
      ],
      paraBlocks: [
        { title: 'Conforto periferico', desc: 'Pode auxiliar na sensacao de bem-estar em membros inferiores ao longo do dia.' },
        { title: 'Apoio circulatorio', desc: 'Contribui para estrategia complementar de cuidado vascular e linfatico.' },
        { title: 'Manejo de rotina', desc: 'Pode integrar plano de cuidado com atividade fisica, compressao e orientacao profissional.' },
        { title: 'Consistencia terapeutica', desc: 'Uso regular favorece continuidade do plano de manejo em medio e longo prazo.' },
        { title: 'Abordagem multidisciplinar', desc: 'Nao substitui tratamento clinico; atua como apoio nutricional complementar.' },
      ],
      cautionExtra: 'Quadros com dor intensa, edema progressivo ou alteracoes cutaneas exigem avaliacao medica.',
    },
    'Menopausa & TPM': {
      focus: 'conforto hormonal, estabilidade do ciclo e bem-estar feminino',
      audience: 'mulheres em fase de TPM, peri-menopausa ou menopausa que buscam suporte de rotina',
      whenToConsider: 'quando ha oscilacao de humor, desconfortos do ciclo, caloroes ou queda de disposicao',
      differentiators: [
        'foco em suporte hormonal feminino com linguagem clinica e expectativa realista',
        'uso orientado para rotina de cuidado continuo e individualizado',
      ],
      hero: [
        'apoio ao conforto hormonal em fases de oscilacao',
        'suporte para estabilidade emocional e fisica da rotina',
        'auxilio para bem-estar no ciclo e no periodo de transicao hormonal',
        'estrategia complementar para sono, energia e qualidade de vida',
        'dose definida para adesao diaria com monitoramento',
      ],
      paraBlocks: [
        { title: 'Conforto no ciclo', desc: 'Pode auxiliar no manejo de desconfortos da TPM e variacoes do ciclo menstrual.' },
        { title: 'Transicao hormonal', desc: 'Contribui para rotina mais estavel em peri-menopausa e menopausa.' },
        { title: 'Bem-estar emocional', desc: 'Apoia estrategia para oscilacao de humor e irritabilidade da rotina.' },
        { title: 'Qualidade de vida feminina', desc: 'Pode compor plano para energia, sono e bem-estar no dia a dia.' },
        { title: 'Cuidado orientado', desc: 'Uso deve respeitar contexto clinico individual e acompanhamento profissional.' },
      ],
      cautionExtra: 'Em casos de sangramento anormal ou sintomas intensos, a avaliacao ginecologica e obrigatoria.',
    },
    Sono: {
      focus: 'relaxamento noturno, regularidade do ciclo e qualidade de sono',
      audience: 'pessoas com dificuldade para desacelerar, iniciar ou manter o sono',
      whenToConsider: 'quando ha despertares noturnos, rotina irregular ou cansaco recorrente ao acordar',
      differentiators: [
        'ativo selecionado para suporte noturno com orientacao de uso',
        'estrategia para higiene do sono com expectativa progressiva',
      ],
      hero: [
        'apoio ao relaxamento no periodo noturno',
        'suporte para inicio e continuidade do sono em rotina consistente',
        'auxilio para acordar com melhor recuperacao no dia seguinte',
        'complemento da higiene do sono sem promessas absolutas',
        'dose orientada por unidade para uso seguro e previsivel',
      ],
      paraBlocks: [
        { title: 'Transicao para o sono', desc: 'Pode auxiliar no processo de desaceleracao mental e corporal antes de dormir.' },
        { title: 'Noites mais consistentes', desc: 'Contribui para estrategia de regularidade do sono com habitos adequados.' },
        { title: 'Recuperacao ao acordar', desc: 'Pode apoiar qualidade de descanso e disposicao para o dia seguinte.' },
        { title: 'Rotina noturna organizada', desc: 'Funciona melhor com horario fixo, ambiente escuro e reducao de estimulos.' },
        { title: 'Uso progressivo e responsavel', desc: 'Resposta e individual; acompanhamento profissional aumenta seguranca do plano.' },
      ],
      cautionExtra: 'Insônia cronica, ronco intenso ou apneia suspeita exigem avaliacao medica.',
    },
  };
  return map[objective] ?? {
    focus: 'bem-estar e suporte nutricional para objetivo especifico',
    audience: 'pessoas que buscam suporte complementar com orientacao profissional',
    whenToConsider: 'quando ha necessidade de maior consistencia no cuidado de rotina',
    differentiators: [
      'composicao manipulada com dose definida e controle de qualidade',
      'estrategia de uso continuo com expectativa realista',
    ],
    hero: [
      'apoio ao objetivo principal do produto',
      'suporte para consistencia da rotina de cuidado',
      'auxilio para bem-estar com abordagem progressiva',
      'estrategia complementar sem promessas absolutas',
      'dose ajustada para uso orientado e seguro',
    ],
    paraBlocks: [
      { title: 'Suporte principal', desc: 'Pode auxiliar no objetivo central desta formula dentro de rotina organizada.' },
      { title: 'Consistencia diaria', desc: 'Contribui para adesao ao plano de cuidado com uso regular.' },
      { title: 'Bem-estar funcional', desc: 'Pode compor estrategia de qualidade de vida de forma complementar.' },
      { title: 'Uso orientado', desc: 'Recomendado com orientacao profissional para melhor seguranca.' },
      { title: 'Evolucao progressiva', desc: 'Resultados tendem a ser graduais e dependem de habitos saudaveis.' },
    ],
    cautionExtra: 'Procure avaliacao profissional em caso de sintomas persistentes.',
  };
}

function buildHowToUse(ctx: Ctx): string[] {
  if (ctx.formKey === 'topical' || ctx.formKey === 'cream') {
    return [
      '- Aplicar camada fina na região indicada, conforme orientação profissional.',
      '- Repetir 1 a 2 vezes ao dia ou conforme prescrição individual.',
      `- Apresentação: ${ctx.pack || 'uso tópico'}. Evitar contato com mucosas e olhos.`,
    ];
  }
  if (ctx.formKey === 'sachet') {
    return [
      '- Dissolver 1 sachê em 150 a 200 mL de água, conforme orientação profissional.',
      '- Preferir horário fixo para manter constância de uso.',
      `- Apresentação: ${ctx.pack || 'sachês'}. Não exceder a recomendação de uso.`,
    ];
  }
  if (ctx.formKey === 'powder') {
    return [
      '- Utilizar a porção orientada pelo profissional de saúde.',
      '- Diluir em água ou veículo indicado e consumir imediatamente após preparo.',
      `- Apresentação: ${ctx.pack || 'pó'}. Não ultrapassar a dose recomendada.`,
    ];
  }
  return [
    '- Tomar conforme orientação do médico ou nutricionista.',
    `- Respeitar a dose de ${ctx.dose || 'uso diário'} e manter regularidade no horário.`,
    `- Apresentação: ${ctx.pack || 'cápsulas'}. Não exceder a recomendação de uso.`,
  ];
}

function buildFaq(ctx: Ctx, profile: Profile): Array<{ q: string; a: string }> {
  const name = ctx.productName;
  return [
    {
      q: `O que é ${name}?`,
      a: `${name} é uma fórmula manipulada com ${ctx.active}, desenvolvida para ${profile.focus}. Atua como suporte nutricional complementar com uso orientado.`,
    },
    {
      q: `Para quem ${name} pode fazer sentido?`,
      a: `Pode fazer sentido para ${profile.audience}. A indicação ideal depende de contexto clínico, rotina e avaliação profissional.`,
    },
    {
      q: `Como usar ${name}?`,
      a: `Siga a orientação profissional e mantenha constância no uso. ${ctx.pack ? `Apresentação: ${ctx.pack}. ` : ''}Não exceda a dose recomendada.`,
    },
    {
      q: `${name} começa a agir em quanto tempo?`,
      a: 'A evolução costuma ser progressiva e individual. Em geral, a percepção melhora com adesão consistente ao plano de cuidado e hábitos saudáveis.',
    },
    {
      q: `Posso combinar ${name} com outros produtos?`,
      a: 'Pode haver interações conforme seu histórico e medicamentos em uso. A combinação deve ser validada por profissional de saúde.',
    },
  ];
}

function faqToPipe(faq: Array<{ q: string; a: string }>): string {
  return faq
    .flatMap((f) => [truncate(f.q, 180), truncate(f.a, 300)])
    .join(' | ');
}

function buildDescriptionMd(ctx: Ctx, profile: Profile): string {
  const formText = ctx.formKey === 'caps' ? 'cápsulas' : ctx.formKey;
  const isActiveInName = sameActiveAsProductName(ctx.active, ctx.productName);
  const activeLabel = activeDoseLabel(ctx);
  const oQueE = isActiveInName
    ? `${ctx.productName} foi formulado para ${profile.focus}. Com ${activeLabel} em ${formText}, entrega proposta clara de uso contínuo e monitorado.`
    : `${ctx.productName} combina ${activeLabel} para ${profile.focus}. Em ${formText}, favorece rotina consistente com estratégia clínica responsável.`;
  const paraQuem = `Pode fazer sentido para ${profile.audience}. Também é uma opção quando ${profile.whenToConsider}, sempre com ajuste individual de conduta.`;
  const diferenciais = [
    `- ${activeLabel} em ${formText}`,
    `- ${ctx.pack || 'apresentação prática para rotina diária'}`,
    `- ${profile.differentiators[0]}`,
    `- ${profile.differentiators[1]}`,
    '- Manipulação com controle farmacêutico, lote rastreável e padronização de dose',
  ].join(NL);
  const comoUsar = buildHowToUse(ctx)
    .map((b) => b.replace(/^- /, '- '))
    .join(NL);
  const cuidados =
    `Uso adulto com orientação profissional. ${profile.cautionExtra} Gestantes, lactantes e crianças devem consultar médico antes do uso. Este produto não substitui alimentação equilibrada e hábitos saudáveis, nem terapias prescritas.`;

  return [
    '## O que é',
    '',
    truncate(oQueE, 360),
    '',
    '## Para quem pode fazer sentido',
    '',
    truncate(paraQuem, 320),
    '',
    '## Diferenciais da fórmula',
    '',
    diferenciais,
    '',
    '## Como usar',
    '',
    truncate(comoUsar, 340),
    '',
    '## Cuidados',
    '',
    truncate(cuidados, 360),
  ].join(NL);
}

function normalizeWhenToConsider(text: string): string {
  const cleanText = clean(text);
  return cleanText.replace(/^quando\s+/i, '').trim();
}

function buildParaQueServe(ctx: Ctx, profile: Profile): string {
  const blocks = profile.paraBlocks.slice(0, 5).map((b, i) => {
    const title = b.title;
    const desc = i === 0
      ? `${b.desc} Com ${ctx.dose || 'dose ajustada'} por ${formUnit(ctx.formKey)}, favorece uso consistente e objetivo.`
      : b.desc;
    return [truncate(title, 90), truncate(desc, 210)];
  });
  return blocks.flat().join(' | ');
}

function stripActivePrefix(text: string, active: string): string {
  const t = clean(text);
  if (!t) return t;
  const activeNorm = normalizeToken(active);
  const leftPart = t.split(':')[0] ?? '';
  const leftNorm = normalizeToken(leftPart);
  if (activeNorm && leftNorm && (leftNorm === activeNorm || leftNorm.includes(activeNorm) || activeNorm.includes(leftNorm))) {
    return clean(t.slice(t.indexOf(':') + 1));
  }
  return t;
}

function buildHero(ctx: Ctx, profile: Profile): string {
  const unit = formUnit(ctx.formKey);
  const activeLabel = activeDoseLabel(ctx);
  const seed = hashSeed(ctx.sku);
  const objectiveLines: Record<
    string,
    {
      first: string[];
      second: string[];
      third: string[];
      fourth: string[];
    }
  > = {
    'Emagrecimento & Metabolismo': {
      first: [
        'Ajuda a controlar o apetite entre refeições.',
        'Saciedade para reduzir beliscos ao longo do dia.',
        'Fome mais previsível na rotina alimentar.',
        'Controle de ingestão com maior regularidade.',
        'Menos impulso alimentar em horários críticos.',
        'Apoio para manter o plano alimentar.',
      ],
      second: [
        `${activeLabel} para suporte metabólico diário.`,
        `${activeLabel} com foco em eficiência energética.`,
        `${activeLabel} no apoio ao gasto calórico.`,
        `${activeLabel} para complementar o manejo de peso.`,
        `${activeLabel} com abordagem metabólica contínua.`,
        `${activeLabel} no suporte ao metabolismo ativo.`,
      ],
      third: [
        'Contribui para manter constância no processo.',
        'Apoia disciplina alimentar no dia a dia.',
        'Facilita continuidade da estratégia de emagrecimento.',
        'Ajuda na adesão ao plano nutricional.',
        'Suporte para progresso com regularidade.',
        'Complementa metas de composição corporal.',
      ],
      fourth: [
        'Resultados graduais quando aliado a dieta e movimento.',
        'Evolução de medidas com hábitos sustentáveis.',
        'Resposta progressiva com acompanhamento profissional.',
        'Progresso contínuo sem promessas irreais.',
        'Avanço consistente com rotina bem estruturada.',
        'Cuidado metabólico com expectativa realista.',
      ],
    },
    'Ansiedade & Humor': {
      first: [
        'Humor mais estável em dias exigentes.',
        'Equilíbrio emocional para a rotina diária.',
        'Mais serenidade em períodos de pressão.',
        'Estabilidade emocional ao longo da semana.',
        'Apoio ao bem-estar mental contínuo.',
        'Menos oscilação emocional no dia a dia.',
      ],
      second: [
        `${activeLabel} para apoiar foco mental e clareza.`,
        `${activeLabel} com suporte à concentração diária.`,
        `${activeLabel} para atenção mais estável.`,
        `${activeLabel} no manejo da sobrecarga mental.`,
        `${activeLabel} para equilíbrio entre calma e foco.`,
        `${activeLabel} com suporte ao desempenho cognitivo.`,
      ],
      third: [
        'Ajuda a reduzir tensão e irritabilidade do dia.',
        'Apoia resposta mais equilibrada ao estresse.',
        'Contribui para maior estabilidade emocional.',
        'Suporte para dias de maior demanda mental.',
        'Complementa estratégias de manejo do estresse.',
        'Auxilia no controle da sobrecarga emocional.',
      ],
      fourth: [
        'Evolução gradual com uso consistente.',
        'Resultados progressivos com acompanhamento clínico.',
        'Melhor resposta quando associado a hábitos saudáveis.',
        'Progresso contínuo com orientação profissional.',
        'Cuidado diário com expectativa realista.',
        'Estratégia de médio prazo para estabilidade.',
      ],
    },
    Cabelo: {
      first: [
        'Fios mais fortes e resistentes à quebra.',
        'Fortalecimento capilar para uso contínuo.',
        'Apoio ao ciclo de crescimento dos fios.',
        'Mais resistência para cabelos fragilizados.',
        'Cuidado diário para manter densidade capilar.',
        'Suporte em fases de queda e enfraquecimento.',
      ],
      second: [
        `${activeLabel} para nutrir couro cabeludo e raiz.`,
        `${activeLabel} no suporte à saúde capilar.`,
        `${activeLabel} para manutenção da qualidade dos fios.`,
        `${activeLabel} com ação direcionada ao couro cabeludo.`,
        `${activeLabel} para apoiar força e espessura dos fios.`,
        `${activeLabel} no cuidado diário da fibra capilar.`,
      ],
      third: [
        'Apoia densidade e brilho ao longo das semanas.',
        'Contribui para reduzir quebra e queda aparente.',
        'Suporte para manutenção da massa capilar.',
        'Auxilia na recuperação de fios danificados.',
        'Complementa cuidados para queda recorrente.',
        'Ajuda a preservar a qualidade do comprimento.',
      ],
      fourth: [
        'Complementa a rotina capilar orientada por especialista.',
        'Melhor resposta com regularidade de uso.',
        'Resultados progressivos com cuidado integrado.',
        'Cuidado contínuo sem promessas exageradas.',
        'Progresso capilar com acompanhamento adequado.',
        'Evolução gradual com hábitos consistentes.',
      ],
    },
    Sono: {
      first: [
        'Facilita o relaxamento na transição para o sono.',
        'Desaceleração mental no fim do dia.',
        'Preparo noturno para dormir com mais tranquilidade.',
        'Apoio ao início do descanso noturno.',
        'Noites mais estáveis ao longo da semana.',
        'Relaxamento para reduzir a agitação noturna.',
      ],
      second: [
        `${activeLabel} para regularidade do ciclo noturno.`,
        `${activeLabel} no suporte ao início do sono.`,
        `${activeLabel} para continuidade do descanso.`,
        `${activeLabel} com foco em qualidade do sono.`,
        `${activeLabel} para manter o ritmo noturno.`,
        `${activeLabel} no cuidado da higiene do sono.`,
      ],
      third: [
        'Apoia noites mais contínuas e menos despertares.',
        'Contribui para acordar com melhor recuperação.',
        'Ajuda a reduzir interrupções do descanso.',
        'Suporte para regularidade do horário de dormir.',
        'Complementa rotina para sono reparador.',
        'Auxilia recuperação física e mental noturna.',
      ],
      fourth: [
        'Combina melhor com higiene do sono bem estruturada.',
        'Evolução gradual com horários regulares.',
        'Resultados progressivos com uso consistente.',
        'Cuidado noturno com expectativa realista.',
        'Melhor resposta com ajuste de hábitos diários.',
        'Estratégia complementar para sono de qualidade.',
      ],
    },
    Intestino: {
      first: [
        'Conforto abdominal e digestão mais previsível.',
        'Bem-estar intestinal para o dia a dia.',
        'Ritmo intestinal com maior regularidade.',
        'Menos desconforto digestivo após refeições.',
        'Suporte ao equilíbrio intestinal contínuo.',
        'Apoio para função intestinal mais estável.',
      ],
      second: [
        `${activeLabel} para equilíbrio da microbiota intestinal.`,
        `${activeLabel} no suporte à digestão funcional.`,
        `${activeLabel} com foco em regularidade intestinal.`,
        `${activeLabel} para manutenção do conforto digestivo.`,
        `${activeLabel} no cuidado da saúde intestinal.`,
        `${activeLabel} para estabilidade digestiva diária.`,
      ],
      third: [
        'Contribui para ritmo intestinal mais regular.',
        'Apoia redução de gases e desconforto abdominal.',
        'Auxilia resposta digestiva em rotina intensa.',
        'Complementa estratégias para constipação funcional.',
        'Suporte para estabilidade da função intestinal.',
        'Ajuda a manter conforto ao longo do dia.',
      ],
      fourth: [
        'Potencializa resultados com fibras, água e alimentação adequada.',
        'Evolução gradual com uso consistente.',
        'Resultados progressivos com orientação profissional.',
        'Cuidado complementar com expectativa realista.',
        'Estratégia de longo prazo para saúde intestinal.',
        'Resposta sustentável com hábitos bem alinhados.',
      ],
    },
    'Articulações': {
      first: [
        'Conforto articular para movimentos do dia a dia.',
        'Mobilidade com menor limitação funcional.',
        'Apoio para articulações em rotina ativa.',
        'Mais liberdade para tarefas e treino.',
        'Suporte para reduzir rigidez ao longo do dia.',
        'Cuidado articular para manter funcionalidade.',
      ],
      second: [
        `${activeLabel} para suporte de mobilidade e flexibilidade.`,
        `${activeLabel} no cuidado da cartilagem articular.`,
        `${activeLabel} para estabilidade durante o movimento.`,
        `${activeLabel} com foco em conforto articular.`,
        `${activeLabel} para complementar recuperação funcional.`,
        `${activeLabel} no suporte diário das articulações.`,
      ],
      third: [
        'Apoio em fases de sobrecarga e impacto repetitivo.',
        'Contribui para recuperação após esforço físico.',
        'Ajuda na continuidade de treino com segurança.',
        'Suporte para tarefas que exigem articulações estáveis.',
        'Auxilia manutenção da amplitude de movimento.',
        'Complementa plano de fortalecimento muscular.',
      ],
      fourth: [
        'Melhor resposta com fortalecimento e controle de carga.',
        'Evolução progressiva com uso consistente.',
        'Resultados sustentáveis com acompanhamento clínico.',
        'Cuidado de longo prazo com expectativa realista.',
        'Progresso funcional sem promessas exageradas.',
        'Estratégia complementar para saúde articular.',
      ],
    },
    'Detox & Fígado': {
      first: [
        'Apoia a função hepática e o metabolismo diário.',
        'Conforto digestivo com cuidado contínuo.',
        'Suporte ao fígado em fases de sobrecarga.',
        'Bem-estar digestivo para rotina intensa.',
        'Estratégia detox com foco funcional.',
        'Apoio metabólico para alimentação desorganizada.',
      ],
      second: [
        `${activeLabel} com foco em proteção antioxidante.`,
        `${activeLabel} para suporte hepatometabólico.`,
        `${activeLabel} no cuidado funcional do fígado.`,
        `${activeLabel} para complementar a detoxificação natural.`,
        `${activeLabel} com apoio à digestão e metabolismo.`,
        `${activeLabel} para equilíbrio metabólico contínuo.`,
      ],
      third: [
        'Contribui para digestão mais leve após refeições.',
        'Apoia redução da sensação de sobrecarga digestiva.',
        'Auxilia resposta antioxidante em períodos exigentes.',
        'Complementa plano alimentar com foco hepático.',
        'Suporte para regularidade metabólica.',
        'Apoio funcional em fases de estresse oxidativo.',
      ],
      fourth: [
        'Atua como complemento de hábitos alimentares equilibrados.',
        'Evolução gradual com uso consistente.',
        'Resultados progressivos com orientação profissional.',
        'Cuidado funcional sem promessas exageradas.',
        'Estratégia de longo prazo para saúde hepática.',
        'Resposta sustentável com disciplina diária.',
      ],
    },
    Imunidade: {
      first: [
        'Fortalece as defesas naturais no dia a dia.',
        'Imunidade mais preparada em semanas exigentes.',
        'Apoio preventivo para períodos de exposição.',
        'Resiliência física com cuidado contínuo.',
        'Suporte imunológico para rotina intensa.',
        'Proteção funcional com uso regular.',
      ],
      second: [
        `${activeLabel} para resposta imune mais equilibrada.`,
        `${activeLabel} no suporte às defesas naturais.`,
        `${activeLabel} com foco em proteção funcional.`,
        `${activeLabel} para continuidade da resposta imune.`,
        `${activeLabel} no suporte diário da imunidade.`,
        `${activeLabel} para manutenção da vitalidade.`,
      ],
      third: [
        'Apoia recuperação em períodos de maior desgaste.',
        'Contribui para manter energia e disposição.',
        'Auxilia em fases de estresse físico e mental.',
        'Complementa estratégias preventivas de saúde.',
        'Suporte para continuidade do cuidado imunológico.',
        'Ajuda a manter estabilidade ao longo da semana.',
      ],
      fourth: [
        'Melhor resposta com sono, hidratação e alimentação.',
        'Evolução progressiva com uso consistente.',
        'Resultados sustentáveis com acompanhamento clínico.',
        'Cuidado contínuo com expectativa realista.',
        'Estratégia complementar para longo prazo.',
        'Progresso funcional sem promessas exageradas.',
      ],
    },
    'Hormonal & Libido': {
      first: [
        'Apoia equilíbrio hormonal e vitalidade diária.',
        'Suporte à libido e bem-estar íntimo.',
        'Disposição física e mental ao longo do dia.',
        'Conforto hormonal em fases de oscilação.',
        'Energia funcional para rotina exigente.',
        'Estabilidade hormonal com uso contínuo.',
      ],
      second: [
        `${activeLabel} com foco em disposição e libido.`,
        `${activeLabel} para suporte hormonal contínuo.`,
        `${activeLabel} no cuidado do bem-estar íntimo.`,
        `${activeLabel} para equilíbrio e desempenho diário.`,
        `${activeLabel} com apoio ao metabolismo hormonal.`,
        `${activeLabel} para manutenção da energia funcional.`,
      ],
      third: [
        'Apoia períodos de queda de energia e disposição.',
        'Contribui para qualidade de vida íntima.',
        'Auxilia manutenção do desempenho diário.',
        'Complementa abordagem clínica individualizada.',
        'Suporte para bem-estar físico e emocional.',
        'Ajuda na constância do cuidado hormonal.',
      ],
      fourth: [
        'Melhor resposta com sono e controle de estresse.',
        'Evolução progressiva com uso responsável.',
        'Resultados sustentáveis com hábitos alinhados.',
        'Cuidado de longo prazo com expectativa realista.',
        'Progresso funcional com acompanhamento profissional.',
        'Estratégia complementar para bem-estar contínuo.',
      ],
    },
    'Menopausa & TPM': {
      first: [
        'Conforto hormonal para o ciclo feminino.',
        'Bem-estar diário em TPM e menopausa.',
        'Apoio à disposição em fases de transição.',
        'Estabilidade emocional ao longo do ciclo.',
        'Cuidado feminino para sintomas recorrentes.',
        'Suporte para oscilações hormonais.',
      ],
      second: [
        `${activeLabel} para suporte hormonal feminino.`,
        `${activeLabel} no cuidado da TPM e menopausa.`,
        `${activeLabel} com foco em estabilidade do ciclo.`,
        `${activeLabel} para conforto em fases de oscilação.`,
        `${activeLabel} no suporte ao equilíbrio emocional.`,
        `${activeLabel} para continuidade do bem-estar feminino.`,
      ],
      third: [
        'Apoia variações de humor e disposição.',
        'Contribui para reduzir desconfortos do ciclo.',
        'Auxilia qualidade de vida em fases hormonais.',
        'Complementa manejo clínico individualizado.',
        'Suporte para sintomas de transição hormonal.',
        'Ajuda a manter estabilidade no dia a dia.',
      ],
      fourth: [
        'Complementa estratégia clínica e hábitos de autocuidado.',
        'Evolução progressiva com uso consistente.',
        'Resultados sustentáveis com acompanhamento.',
        'Cuidado funcional para fases de transição.',
        'Progresso gradual com expectativa realista.',
        'Estratégia de longo prazo para bem-estar feminino.',
      ],
    },
    Lipedema: {
      first: [
        'Apoia conforto e leveza em membros inferiores.',
        'Suporte periférico para rotina com menos incômodo.',
        'Bem-estar vascular em fases de sobrecarga.',
        'Conforto nas pernas ao longo do dia.',
        'Cuidado complementar para manejo do lipedema.',
        'Apoio para reduzir sensação de peso.',
      ],
      second: [
        `${activeLabel} para suporte circulatório e tecidual.`,
        `${activeLabel} no cuidado de membros inferiores.`,
        `${activeLabel} com foco em conforto periférico.`,
        `${activeLabel} para complementar manejo do lipedema.`,
        `${activeLabel} no suporte vascular funcional.`,
        `${activeLabel} para rotina de cuidado contínuo.`,
      ],
      third: [
        'Contribui para reduzir sensação de peso nas pernas.',
        'Apoia fases de desconforto periférico recorrente.',
        'Auxilia manejo diário com maior estabilidade.',
        'Complementa compressão e movimento orientado.',
        'Suporte para rotina com menor incômodo local.',
        'Ajuda na continuidade do cuidado de longo prazo.',
      ],
      fourth: [
        'Potencializa resultados com movimento e compressão orientada.',
        'Evolução progressiva com uso responsável.',
        'Resultados sustentáveis com acompanhamento profissional.',
        'Cuidado de longo prazo com expectativa realista.',
        'Estratégia contínua para conforto periférico.',
        'Progresso gradual sem promessas exageradas.',
      ],
    },
    Saúde: {
      first: [
        'Cuidado funcional alinhado ao objetivo da fórmula.',
        'Suporte diário para bem-estar contínuo.',
        'Abordagem complementar para saúde integral.',
        'Apoio para manter consistência no cuidado.',
        'Estratégia de uso com foco em resultado gradual.',
        'Rotina de saúde com base em acompanhamento.',
      ],
      second: [
        `${activeLabel} para suporte funcional contínuo.`,
        `${activeLabel} no cuidado diário da saúde.`,
        `${activeLabel} para complementar necessidades específicas.`,
        `${activeLabel} com foco em resposta progressiva.`,
        `${activeLabel} no apoio ao objetivo terapêutico.`,
        `${activeLabel} para manutenção do bem-estar.`,
      ],
      third: [
        'Uso regular com segurança e ajuste individual.',
        'Qualidade manipulada para suporte contínuo.',
        'Complementa hábitos saudáveis e rotina clínica.',
        'Apoio técnico com expectativa realista.',
        'Contribui para constância no plano de cuidado.',
        'Estratégia complementar sem promessas exageradas.',
      ],
      fourth: [
        'Resultados progressivos com hábitos saudáveis.',
        'Evolução sustentável com acompanhamento profissional.',
        'Cuidado de longo prazo com constância.',
        'Resposta gradual com disciplina de uso.',
        'Plano funcional para manutenção do objetivo.',
        'Estratégia contínua para qualidade de vida.',
      ],
    },
  };

  const bundle = objectiveLines[ctx.objective] ?? objectiveLines['Saúde'];
  const bulletsRaw = [
    pickWithSeed(bundle.first, seed, 1),
    pickWithSeed(bundle.second, seed, 3),
    pickWithSeed(bundle.third, seed, 5),
    pickWithSeed(bundle.fourth, seed, 7),
    ctx.dose
      ? `Dose de ${ctx.dose} por ${unit}.`
      : `Dose conforme prescrição por ${unit}.`,
  ];
  const bullets = bulletsRaw
    .map((b) => stripActivePrefix(b, ctx.active))
    .map((b) => truncate(b, 92))
    .map((b) => b.replace(/\s+:\s+/g, ' ').replace(/\s{2,}/g, ' ').trim())
    .map((b) => ptBr(b));
  return bullets.join(' | ');
}

function buildShortBenefit(ctx: Ctx, profile: Profile): string {
  const seed = hashSeed(ctx.sku);
  const byObjective: Record<string, string[]> = {
    'Ansiedade & Humor': [
      'Calma emocional com foco diário.',
      'Mais equilíbrio para dias intensos.',
      'Humor estável e mente mais clara.',
      'Serenidade com concentração contínua.',
    ],
    Cabelo: [
      'Fios mais fortes e resistentes.',
      'Suporte para queda e quebra.',
      'Couro cabeludo em melhor equilíbrio.',
      'Densidade capilar com constância.',
    ],
    'Emagrecimento & Metabolismo': [
      'Mais saciedade e controle do apetite.',
      'Metabolismo ativo com disciplina.',
      'Apoio para reduzir medidas.',
      'Menos fome fora de hora.',
    ],
    Sono: [
      'Relaxamento para adormecer melhor.',
      'Noites mais contínuas e reparadoras.',
      'Despertar com menos cansaço.',
      'Sono regular com qualidade.',
    ],
    Intestino: [
      'Ritmo intestinal mais regular.',
      'Conforto digestivo no dia a dia.',
      'Menos inchaço e desconforto.',
      'Microbiota equilibrada com constância.',
    ],
    'Articulações': [
      'Conforto articular para se mover.',
      'Menos rigidez ao longo do dia.',
      'Mobilidade com suporte contínuo.',
      'Recuperação funcional das articulações.',
    ],
    'Detox & Fígado': [
      'Suporte hepático e antioxidante.',
      'Detox com conforto digestivo.',
      'Função metabólica mais equilibrada.',
      'Cuidado hepático no dia a dia.',
    ],
    Imunidade: [
      'Defesas naturais mais fortes.',
      'Imunidade reforçada no dia a dia.',
      'Proteção extra em períodos críticos.',
      'Resiliência física com constância.',
    ],
    'Hormonal & Libido': [
      'Equilíbrio hormonal e vitalidade.',
      'Energia e libido com constância.',
      'Bem-estar íntimo no dia a dia.',
      'Disposição para rotina exigente.',
    ],
    'Menopausa & TPM': [
      'Conforto hormonal na transição.',
      'Suporte para TPM e menopausa.',
      'Estabilidade de humor e energia.',
      'Bem-estar feminino com constância.',
    ],
    Lipedema: [
      'Conforto nas pernas no dia.',
      'Leveza periférica com constância.',
      'Suporte circulatório funcional.',
      'Manejo do lipedema com cuidado.',
    ],
    Saúde: [
      'Suporte funcional para bem-estar.',
      'Cuidado diário com constância.',
      'Saúde integral com acompanhamento.',
      'Apoio específico para seu objetivo.',
    ],
  };

  const options = byObjective[ctx.objective] ?? [
    'Cuidado diário com foco funcional.',
    'Suporte funcional com uso consistente.',
    'Estratégia complementar para bem-estar.',
  ];

  return truncate(ptBr(pickWithSeed(options, seed, 5).replace(/\*\*/g, '')), 90);
}

function buildMechanismSummary(ctx: Ctx, profile: Profile): string {
  const activeLabel = activeDoseLabel(ctx);
  const seed = hashSeed(ctx.sku);

  const objectiveLine: Record<string, string[]> = {
    'Ansiedade & Humor': [
      `${activeLabel} ajuda no equilíbrio emocional, melhora o foco mental e contribui para uma resposta mais estável ao estresse diário.`,
      `Com ${activeLabel}, a fórmula favorece calma, clareza e constância em dias de maior exigência mental.`,
      `${activeLabel} oferece suporte para humor mais estável, atenção sustentada e menor sobrecarga emocional.`,
    ],
    Cabelo: [
      `${activeLabel} apoia o fortalecimento dos fios, o equilíbrio do couro cabeludo e a manutenção da densidade capilar.`,
      `Com ${activeLabel}, a fórmula favorece resistência da fibra, brilho e melhor resposta em fases de queda.`,
      `${activeLabel} contribui para reduzir quebra, sustentar crescimento saudável e melhorar a qualidade dos fios.`,
    ],
    'Emagrecimento & Metabolismo': [
      `${activeLabel} contribui para saciedade, apoio metabólico e maior constância no plano de controle de peso.`,
      `Com ${activeLabel}, a fórmula ajuda a reduzir fome fora de hora e sustentar uma rotina alimentar mais previsível.`,
      `${activeLabel} apoia gasto energético e evolução da composição corporal com hábitos consistentes.`,
    ],
    Sono: [
      `${activeLabel} favorece relaxamento noturno, início do sono e manutenção de noites mais contínuas.`,
      `Com ${activeLabel}, a fórmula ajuda a desacelerar a mente e melhorar a qualidade do descanso reparador.`,
      `${activeLabel} contribui para regularidade do ciclo sono-vigília e melhor recuperação ao despertar.`,
    ],
    Intestino: [
      `${activeLabel} apoia conforto digestivo, equilíbrio da microbiota e ritmo intestinal mais regular.`,
      `Com ${activeLabel}, a fórmula ajuda a reduzir inchaço, gases e desconfortos gastrointestinais recorrentes.`,
      `${activeLabel} contribui para digestão mais eficiente e bem-estar gastrointestinal no dia a dia.`,
    ],
    'Articulações': [
      `${activeLabel} contribui para conforto articular, mobilidade e recuperação funcional ao longo do movimento.`,
      `Com ${activeLabel}, a fórmula ajuda a reduzir rigidez e sustentar flexibilidade em atividades diárias.`,
      `${activeLabel} apoia proteção das articulações e melhor tolerância a sobrecarga mecânica.`,
    ],
    'Detox & Fígado': [
      `${activeLabel} oferece suporte hepático, proteção antioxidante e melhor conforto digestivo.`,
      `Com ${activeLabel}, a fórmula ajuda a função metabólica e a resposta do fígado em fases de sobrecarga.`,
      `${activeLabel} contribui para equilíbrio hepatometabólico e digestão funcional com uso consistente.`,
    ],
    Imunidade: [
      `${activeLabel} fortalece as defesas naturais e ajuda a manter resposta imune equilibrada em períodos exigentes.`,
      `Com ${activeLabel}, a fórmula apoia imunidade funcional, recuperação e estabilidade da energia diária.`,
      `${activeLabel} contribui para proteção orgânica e menor impacto de sazonalidades na rotina.`,
    ],
    'Hormonal & Libido': [
      `${activeLabel} apoia equilíbrio hormonal, vitalidade física e melhora gradual do bem-estar íntimo.`,
      `Com ${activeLabel}, a fórmula ajuda na disposição, libido e estabilidade funcional do eixo hormonal.`,
      `${activeLabel} contribui para energia e desempenho com suporte hormonal consistente.`,
    ],
    'Menopausa & TPM': [
      `${activeLabel} apoia conforto hormonal em TPM e menopausa, com suporte ao humor e à disposição.`,
      `Com ${activeLabel}, a fórmula ajuda na transição hormonal com mais estabilidade e bem-estar diário.`,
      `${activeLabel} contribui para reduzir desconfortos do ciclo e melhorar a qualidade de vida feminina.`,
    ],
    Lipedema: [
      `${activeLabel} oferece suporte circulatório e ajuda a reduzir sensação de peso nas pernas.`,
      `Com ${activeLabel}, a fórmula contribui para o manejo funcional do lipedema e maior conforto periférico.`,
      `${activeLabel} apoia o cuidado vascular de longo prazo com abordagem complementar.`,
    ],
    Saúde: [
      `${activeLabel} oferece suporte funcional ao objetivo da fórmula e manutenção do bem-estar contínuo.`,
      `Com ${activeLabel}, a fórmula ajuda necessidades específicas de saúde dentro de um plano individualizado.`,
      `${activeLabel} contribui para evolução consistente com uso responsável e acompanhamento profissional.`,
    ],
  };
  const openers = objectiveLine[ctx.objective] ?? objectiveLine['Saúde'];
  return truncate(ptBr(pickWithSeed(openers, seed, 2).replace(/\*\*/g, '')), 175);
}

function buildBestFitProfile(profile: Profile): string {
  return truncate(
    `Ideal para ${profile.audience}, especialmente quando ${profile.whenToConsider}. Melhor resultado com uso regular e estratégia integrada de saúde.`,
    210
  );
}

function buildWarnings(profile: Profile): string {
  return truncate(
    `Imagens meramente ilustrativas. Manter em local seco, longe da luz e do calor. Manter fora do alcance de crianças. ${profile.cautionExtra} Gestantes, lactantes e crianças devem consultar médico antes do uso. Em caso de sintomas persistentes, procure orientação profissional. Este produto não substitui alimentação equilibrada e hábitos saudáveis.`,
    430
  );
}

function buildSeoDescription(ctx: Ctx, profile: Profile): string {
  return truncate(
    `${ctx.productName}: suporte para ${profile.focus}. ${ctx.pack || 'Fórmula manipulada'} com orientação profissional e entrega nacional.`,
    155
  );
}

function sanitizeReferences(text: string): string {
  return splitPipe(text).slice(0, 3).join(' | ');
}

function splitPipe(text: string): string[] {
  return (text ?? '').split(/\s*\|\s*/).map((s) => s.trim()).filter(Boolean);
}

function main() {
  const forceAll = process.argv.includes('--all');

  if (!fs.existsSync(BLUEPRINT_PATH)) {
    console.error('❌ copy-blueprint-v4.csv não encontrado.');
    process.exit(1);
  }

  const { headers, rows } = parseCSV(fs.readFileSync(BLUEPRINT_PATH, 'utf-8'));
  const auditBySku = new Map<string, PremiumClass>();
  if (fs.existsSync(AUDIT_PATH)) {
    const audit = JSON.parse(fs.readFileSync(AUDIT_PATH, 'utf-8')) as { items?: AuditItem[] };
    for (const item of audit.items ?? []) {
      if (item.sku) auditBySku.set(item.sku, item.classification);
    }
  }

  let targeted = 0;
  let updated = 0;
  let firstFoldUpdated = 0;
  let bodyUpdated = 0;
  let faqUpdated = 0;
  let warningsUpdated = 0;

  for (const row of rows) {
    const sku = clean(row.sku);
    if (!sku || sku === MASTER_SKU) continue;

    const classification = auditBySku.get(sku);
    const needsByAudit = classification && classification !== 'OK_PREMIUM';
    const needsByGeneric = hasGeneric([
      row.shortBenefit,
      row.hero_benefit,
      row.mechanism_summary,
      row.description_md,
      row.para_que_serve,
      row.faq,
    ].join(' '));

    if (!forceAll && !needsByAudit && !needsByGeneric) continue;
    targeted++;

    const ctx: Ctx = {
      sku,
      productName: clean(row.productName) || clean(row.normalizedProductName) || sku,
      objective: clean(row.objective) || 'Saúde',
      active: humanizeActive(normalizeActive(row.primaryActive) || normalizeActive(row.normalizedPrimaryActive), clean(row.productName)),
      dose: normalizeDose(row.dose) || normalizeDose(row.normalizedDose),
      pack: clean(row.pack) || clean(row.normalizedPack),
      formKey: clean(row.formKey) || 'caps',
    };

    const profile = objectiveProfile(ctx.objective);

    row.hero_benefit = ptBr(buildHero(ctx, profile));
    row.shortBenefit = ptBr(buildShortBenefit(ctx, profile));
    row.mechanism_summary = ptBr(buildMechanismSummary(ctx, profile));
    row.who_is_it_for = ptBr(truncate(`Indicado para ${profile.audience}.`, 180));
    row.when_to_consider = ptBr(truncate(`Considerar quando ${normalizeWhenToConsider(profile.whenToConsider)}.`, 180));
    row.best_fit_profile = ptBr(buildBestFitProfile(profile));
    row.what_makes_this_formula_different = truncate(
      `${ctx.productName} une ${ctx.active}${ctx.dose ? ` ${ctx.dose}` : ''} com foco em ${profile.focus}, priorizando aderência, clareza de uso e segurança de rotina.`,
      220
    );
    row.what_makes_this_formula_different = ptBr(row.what_makes_this_formula_different);
    row.comparison_note = ptBr(truncate(
      'Comparado a abordagens genéricas, aqui a proposta é dose definida, objetivo claro e orientação de uso sem promessas absolutas.',
      180
    ));
    if (!clean(row.science_summary) || hasGeneric(row.science_summary)) {
      row.science_summary = ptBr(truncate(
        `${ctx.active} possui uso descrito em literatura para ${profile.focus}. As referências da página sustentam contexto de uso e expectativa realista.`,
        220
      ));
    }
    if (!clean(row.evidence_level)) row.evidence_level = 'moderada';

    row.description_md = ptBr(buildDescriptionMd(ctx, profile));
    row.para_que_serve = ptBr(buildParaQueServe(ctx, profile));
    row.how_to_use_bullets = ptBr(buildHowToUse(ctx).join(' | '));
    row.faq = ptBr(faqToPipe(buildFaq(ctx, profile)));
    row.cautions = ptBr(truncate(
      `${profile.cautionExtra} Uso adulto com orientação profissional. Gestantes, lactantes e crianças devem consultar médico antes do uso.`,
      220
    ));
    row.advertencias_completo = ptBr(buildWarnings(profile));
    row.references = sanitizeReferences(clean(row.references));
    row.seoTitle = truncate(`${ctx.productName} | MeJoy Farmácia de Manipulação`, 70);
    row.seoDescription = ptBr(buildSeoDescription(ctx, profile));

    updated++;
    firstFoldUpdated++;
    bodyUpdated++;
    faqUpdated++;
    warningsUpdated++;
  }

  fs.writeFileSync(BLUEPRINT_PATH, writeCSV(headers, rows), 'utf-8');

  const report = {
    generatedAt: new Date().toISOString(),
    forceAll,
    targetedSkus: targeted,
    updatedSkus: updated,
    firstFoldUpdated,
    bodyUpdated,
    faqUpdated,
    warningsUpdated,
    preservedMasterSku: MASTER_SKU,
  };
  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), 'utf-8');

  console.log('✅ Refino premium editorial v4 concluído');
  console.log(`   SKUs alvo: ${targeted}`);
  console.log(`   SKUs atualizados: ${updated}`);
  console.log(`   First fold atualizados: ${firstFoldUpdated}`);
  console.log(`   Corpo atualizado: ${bodyUpdated}`);
  console.log(`   FAQ atualizados: ${faqUpdated}`);
  console.log(`   Advertências atualizadas: ${warningsUpdated}`);
  console.log(`   Relatório: ${REPORT_PATH}`);
}

main();
