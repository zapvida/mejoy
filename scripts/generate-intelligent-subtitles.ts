#!/usr/bin/env tsx
/**
 * Gera mechanism_summary inteligente para os 162 produtos.
 * - 2–3 linhas (80–180 chars)
 * - Nunca começa com nome do produto
 * - Sem markdown cru no texto final
 * - Termina com ponto (nunca reticências)
 * - Específico do produto, baseado em evidências
 */

import * as fs from 'fs';
import * as path from 'path';
import { parseCSV, writeCSV } from './lib/copy-utils';

const BLUEPRINT_PATH = path.join(process.cwd(), 'data', 'store-v2', 'copy', 'copy-blueprint-v4.csv');
const MASTER_SKU = 'MEJOY-0048';

function clean(s: string): string {
  return (s ?? '').replace(/\s+/g, ' ').trim();
}

function normalizeForCompare(s: string): string {
  return clean(s)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function stripProductName(text: string, productName: string, primaryActive?: string): string {
  let t = clean(text);
  const names = [productName, primaryActive].filter(Boolean);
  for (const name of names) {
    const n = clean(name);
    if (!n || n.length < 3) continue;
    const re = new RegExp(`^${escapeRe(n)}\\s+`, 'i');
    t = t.replace(re, '').trim();
    const reAtua = new RegExp(`^${escapeRe(n)}\\s+atua\\s+`, 'i');
    t = t.replace(reAtua, 'Atua ').trim();
  }
  t = t.replace(/^\d+(?:[.,]\d+)?\s*(mg|mcg|g|ml|%)\s+/i, '').trim();
  t = t.replace(/^atua\s+/i, 'Atua ').trim();
  return t;
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Palavras-chave por objetivo para negrito (2–3 por subtítulo) */
const OBJECTIVE_KEYWORDS: Record<string, string[]> = {
  'Ansiedade & Humor': ['equilíbrio emocional', 'foco', 'estresse'],
  'Emagrecimento & Metabolismo': ['apetite', 'metabolismo', 'composição corporal'],
  Sono: ['relaxamento', 'sono', 'descanso'],
  Cabelo: ['fios', 'couro cabeludo', 'fortalecimento'],
  Intestino: ['intestino', 'microbiota', 'equilíbrio'],
  Saúde: ['bem-estar', 'suporte', 'rotina'],
  Imunidade: ['defesas', 'antioxidante', 'imunidade'],
  Articulações: ['mobilidade', 'conforto'],
  'Detox & Fígado': ['fígado', 'metabolismo', 'detox'],
  'Energia & Performance': ['energia', 'performance'],
  'Hormonal & Libido': ['equilíbrio hormonal', 'vitalidade'],
  'Pele & Beleza': ['pele', 'beauty'],
  'Menopausa & TPM': ['menopausa', 'equilíbrio hormonal'],
  Lipedema: ['lipedema', 'circulação'],
};

function pickKeywords(text: string, objective: string): string[] {
  const lower = text.toLowerCase();
  const candidates = OBJECTIVE_KEYWORDS[objective] ?? ['suporte', 'rotina'];
  const found: string[] = [];
  for (const kw of candidates) {
    if (lower.includes(kw.toLowerCase()) && found.length < 3) {
      found.push(kw);
    }
  }
  if (found.length === 0) found.push(candidates[0]);
  return found.slice(0, 3);
}

function addBold(text: string, keywords: string[]): string {
  // Mantém texto limpo para evitar exibição de ** no front.
  return text;
}

function generateSubtitle(row: Record<string, string>): string {
  const productName = clean(row.productName ?? '');
  const primaryActive = clean(row.primaryActive ?? '').replace(/^[^a-z0-9]+/i, '');
  const objective = row.objective ?? 'Saúde';
  const mechanism = clean(row.mechanism_summary ?? '');
  const science = clean(row.science_summary ?? '');
  const hero = clean(row.hero_benefit ?? '');

  let src = mechanism || science || hero;
  if (!src || src.length < 20) {
    const focus = OBJECTIVE_KEYWORDS[objective]?.[0] ?? 'suporte';
    return `${focus} para rotina com mais consistência e orientação profissional.`;
  }

  src = stripProductName(src, productName, primaryActive);
  src = src
    .replace(/\s+O foco é[\s\S]*$/i, '')
    .replace(/\s+com acompanhamento profissional[\s\S]*$/i, '')
    .replace(/\s+construir resultado progressivo[\s\S]*$/i, '')
    .replace(/\s+[—-]\s*$/u, '')
    .replace(/[.…]+$/, '')
    .trim();

  if (!src) src = mechanism || science || hero;
  src = stripProductName(src, productName, primaryActive);

  const firstSentence = src.split(/[.;]/)[0]?.trim();
  let base = (firstSentence && firstSentence.length >= 40 ? firstSentence : src).slice(0, 165);
  if (base.length < 40) base = src.slice(0, 165);

  const lastSpace = base.slice(0, 155).lastIndexOf(' ');
  if (lastSpace > 60) base = base.slice(0, lastSpace);
  base = base.trim();
  base = base.replace(/\s+(da|de|do|dos|das)\.$/, '.');
  if (base.length < 30) base = src.slice(0, 120).trim();
  const lastSpace2 = base.lastIndexOf(' ');
  if (lastSpace2 > 50 && /^(da|de|do|dos|das)$/i.test(base.slice(lastSpace2 + 1).replace(/\.$/, ''))) {
    base = base.slice(0, lastSpace2).trim();
  }
  if (!/[.!?]$/.test(base)) base += '.';
  if (base.length < 90) base = (base + ' Suporte para rotina com orientação profissional.').slice(0, 165);
  const lastSpace3 = base.slice(0, 155).lastIndexOf(' ');
  if (lastSpace3 > 80) base = base.slice(0, lastSpace3).trim();
  if (!/[.!?]$/.test(base)) base += '.';

  const keywords = pickKeywords(base, objective);
  return addBold(base, keywords);
}

function fixBenefitEndings(paraQueServe: string): string {
  if (!paraQueServe) return paraQueServe;
  const parts = paraQueServe.split(/\s*\|\s*/).map((s) => clean(s)).filter(Boolean);
  const pairs: string[] = [];
  for (let i = 0; i < parts.length - 1; i += 2) {
    const title = (parts[i] ?? '').replace(/\.$/, '');
    let desc = (parts[i + 1] ?? '').replace(/[.…]+$/, '').trim();
    if (desc.length > 40) {
      const lastSpace = desc.slice(0, 38).lastIndexOf(' ');
      desc = (lastSpace > 20 ? desc.slice(0, lastSpace) : desc.slice(0, 38)).trim();
    }
    desc = desc.replace(/\s+(da|de|do|dos|das)\.?$/, '');
    if (desc && !/[.!?]$/.test(desc)) desc += '.';
    pairs.push(`${title} | ${desc}`);
  }
  if (parts.length % 2 === 1 && parts[parts.length - 1]) {
    pairs.push(parts[parts.length - 1]!);
  }
  return pairs.join(' | ');
}

function fixHeroBenefitEndings(heroBenefit: string): string {
  if (!heroBenefit) return heroBenefit;
  const items = heroBenefit.split(/\s*\|\s*/).map((s) => clean(s)).filter(Boolean);
  const fixed = items.map((item) => {
    const colon = item.indexOf(':');
    if (colon <= 1 || colon > 50) return item;
    const title = item.slice(0, colon).trim().replace(/\.$/, '');
    let desc = item.slice(colon + 1).replace(/[.…]+$/, '').trim();
    if (desc.length > 40) {
      const lastSpace = desc.slice(0, 38).lastIndexOf(' ');
      desc = (lastSpace > 20 ? desc.slice(0, lastSpace) : desc.slice(0, 38)).trim();
    }
    desc = desc.replace(/\s+(da|de|do|dos|das)\.?$/, '');
    if (desc && !/[.!?]$/.test(desc)) desc += '.';
    return `${title}: ${desc}`;
  });
  return fixed.join(' | ');
}

function main() {
  const content = fs.readFileSync(BLUEPRINT_PATH, 'utf-8');
  const { headers, rows } = parseCSV(content);

  let updated = 0;
  const newRows = rows.map((row) => {
    const sku = row.sku ?? '';
    if (!sku) return row;

    const newMechanism = sku === MASTER_SKU ? (row.mechanism_summary ?? '') : generateSubtitle(row);
    const changed = row.mechanism_summary !== newMechanism;
    if (changed) updated++;

    const newPara = fixBenefitEndings(row.para_que_serve ?? '');
    const newHero = fixHeroBenefitEndings(row.hero_benefit ?? '');

    return {
      ...row,
      mechanism_summary: newMechanism,
      ...(newPara && newPara !== row.para_que_serve ? { para_que_serve: newPara } : {}),
      ...(newHero && newHero !== row.hero_benefit ? { hero_benefit: newHero } : {}),
    };
  });

  fs.writeFileSync(BLUEPRINT_PATH, writeCSV(headers, newRows), 'utf-8');
  console.log(`[OK] mechanism_summary atualizado em ${updated} produtos`);
  console.log(`[OK] Benefícios (para_que_serve) com ponto final verificados`);
}

main();
