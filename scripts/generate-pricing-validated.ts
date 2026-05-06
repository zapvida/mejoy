#!/usr/bin/env tsx
/**
 * Gera pricing-content-v3-validado.csv a partir de pricing-content-v3 + catalogo.
 * Restringe a 162 SKUs. Aplica Title Case, tokens protegidos, seoDescription ≤155.
 * QUALITY GATE: falha se CSV contiver 5-Htp, para apoia, MáLico, MagnéSio, ou espaços duplos.
 */

import * as fs from 'fs';
import * as path from 'path';

const CATALOG_PATH = path.join(process.cwd(), 'data', 'store-v2', 'catalogo_mejoy_validado_v2.csv');
const PRICING_PATH = path.join(process.cwd(), 'data', 'store-v2', 'pricing-content-v3.csv');
const OUTPUT_PATH = path.join(process.cwd(), 'data', 'store-v2', 'pricing-content-v3-validado.csv');

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
  if (val.includes(',') || val.includes('"') || val.includes('\n')) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}

function collapseSpaces(s: string): string {
  return (s || '').replace(/\s{2,}/g, ' ').trim();
}

// --- TOKENS PROTEGIDOS ---
// Usar caracteres Unicode privados (não afetados por toLowerCase) para preservar durante titleCase
const PH = {
  '5HTP': '\uE001',
  NAC: '\uE002',
  KSM66: '\uE003',
  HCL: '\uE004',
  UI: '\uE005',
  UFC: '\uE006',
  ML: '\uE007',
  MG: '\uE008',
  MCG: '\uE009',
  G: '\uE00A',
};

const TOKEN_PLACEHOLDERS: [RegExp, string][] = [
  [/\b5\s*[-–]\s*htp\b/gi, PH['5HTP']],
  [/\b5htp\b/gi, PH['5HTP']],
  [/\b5\s+htp\b/gi, PH['5HTP']],
  [/\b5-HTP\b/g, PH['5HTP']],
  [/\bNAC\b/g, PH.NAC],
  [/\bKSM\s*66\b/gi, PH.KSM66],
  [/\bHCl\b/g, PH.HCL],
  [/\bUI\b/g, PH.UI],
  [/\bUFC\b/g, PH.UFC],
  [/(\d+)\s*mL\b/gi, `$1${PH.ML}`],
  [/(\d+)\s*ml\b/gi, `$1${PH.ML}`],
  [/(\d+)\s*mg\b/gi, `$1${PH.MG}`],
  [/(\d+)\s*mcg\b/gi, `$1${PH.MCG}`],
  [/(\d+)\s*g\b/gi, `$1${PH.G}`],
];

const TOKEN_RESTORE: [string, string][] = [
  [PH['5HTP'], '5-HTP'],
  [PH.NAC, 'NAC'],
  [PH.KSM66, 'KSM 66'],
  [PH.HCL, 'HCl'],
  [PH.UI, 'UI'],
  [PH.UFC, 'UFC'],
  [PH.ML, ' mL'],
  [PH.MG, ' mg'],
  [PH.MCG, ' mcg'],
  [PH.G, ' g'],
];

function protectTokens(s: string): string {
  let out = s;
  for (const [re, ph] of TOKEN_PLACEHOLDERS) {
    out = out.replace(re, ph);
  }
  return out;
}

function restoreTokens(s: string): string {
  let out = s;
  for (const [from, to] of TOKEN_RESTORE) {
    out = out.split(from).join(to);
  }
  return out;
}

// Typos (aplicar após restore; não incluir tokens que já estão protegidos)
const TYPOS: [RegExp | string, string][] = [
  [/\bpara\s+apoia\b/gi, 'para apoiar'],
  [/\bASWHAGANDA\b/gi, 'Ashwagandha'],
  [/\bL TEANINE\b/gi, 'L-Teanina'],
  [/\bL TEANINA\b/gi, 'L-Teanina'],
  [/\bIOMBINA\b/gi, 'Ioimbina'],
  [/\bIOIMBINA\b/gi, 'Ioimbina'],
  [/\bCHA VERDE \(EXT S\)\b/gi, 'Chá Verde (Extrato Seco)'],
  [/\bOLEO\b/gi, 'Óleo'],
  [/\bOL SEMENTE DE ABÓORA\b/gi, 'Óleo de Semente de Abóbora'],
  [/\bABÓORA\b/gi, 'Abóbora'],
  [/\bINDIANDO\b/gi, 'Indiano'],
  [/\bTRIBULLUS\b/gi, 'Tribulus'],
  [/\bMINOXDIL\b/gi, 'Minoxidil'],
  [/\bBETAÍNA HCL\b/gi, 'Betaína HCl'],
  [/\bBETAÍNA HCl\b/gi, 'Betaína HCl'],
  [/\bN ACETILCISTEINA\b/gi, 'N-Acetilcisteína'],
  [/\bTRANS RESVERATROL\b/gi, 'Trans-Resveratrol'],
  [/\bAC HIALURONICO\b/gi, 'Ácido Hialurônico'],
  [/\bHIALURONICO\b/gi, 'Hialurônico'],
  [/\bMáLico\b/g, 'Málico'],
  [/\bMagnéSio\b/g, 'Magnésio'],
  [/\bColáGeno\b/g, 'Colágeno'],
  [/\bEquilíBrio\b/g, 'Equilíbrio'],
  [/\bFóRmula\b/g, 'Fórmula'],
  [/\bTipo Ii\b/gi, 'Tipo II'],
  [/\bTrimagnéSio\b/g, 'Trimagnésio'],
];

function applyTypos(s: string): string {
  let out = s;
  for (const [from, to] of TYPOS) {
    out = out.replace(from as RegExp, to);
  }
  return out;
}

function titleCaseSafe(s: string): string {
  return (s || '')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Sentence case: primeira letra maiúscula, resto normal. NÃO capitalizar E/De/Da/Do no meio. */
function sentenceCase(s: string): string {
  const t = (s || '').trim();
  if (!t) return '';
  const lower = t.toLowerCase();
  const first = lower.charAt(0).toUpperCase();
  return first + lower.slice(1);
}

function normalizeWithTokens(s: string): string {
  const protected_ = protectTokens(s);
  const titled = titleCaseSafe(protected_);
  const restored = restoreTokens(titled);
  const typosFixed = applyTypos(restored);
  return collapseSpaces(typosFixed);
}

function truncateAtWord(s: string, maxLen: number): string {
  if (s.length <= maxLen) return s;
  const cut = s.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(' ');
  return lastSpace > maxLen * 0.7 ? cut.slice(0, lastSpace) : cut;
}

const DISCLAIMER =
  ' Use conforme orientação de profissional de saúde. Este produto não substitui uma alimentação equilibrada e hábitos saudáveis.';

const FORBIDDEN_TERMS = /cura|trata|garante|100%|reverte|resultado em|sem efeitos colaterais/i;
const TITLE_CASE_BAD = /\s(E|De|Da|Do|Ao|Em|No|Na)\s/g; // " E ", " De ", etc. no meio = Title Case feio

function runQualityGate(csvContent: string, rows: string[][]): void {
  const lines = csvContent.split(/\n/);
  const errors: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const sku = rows[i]?.[0] ?? `linha ${i + 1}`;

    if (/5-Htp\b/.test(line)) {
      errors.push(`SKU ${sku}: contém "5-Htp" (deve ser "5-HTP")`);
    }
    if (/\bpara\s+apoia\b/i.test(line)) {
      errors.push(`SKU ${sku}: contém "para apoia" (deve ser "para apoiar")`);
    }
    if (/MáLico/.test(line)) {
      errors.push(`SKU ${sku}: contém "MáLico" (deve ser "Málico")`);
    }
    if (/MagnéSio/.test(line)) {
      errors.push(`SKU ${sku}: contém "MagnéSio" (deve ser "Magnésio")`);
    }
    if (/EquilíBrio/.test(line)) {
      errors.push(`SKU ${sku}: contém "EquilíBrio" (deve ser "Equilíbrio")`);
    }
    if (/FóRmula/.test(line)) {
      errors.push(`SKU ${sku}: contém "FóRmula" (deve ser "Fórmula")`);
    }
    if (/  /.test(line)) {
      errors.push(`SKU ${sku}: contém espaços duplos`);
    }
    if (FORBIDDEN_TERMS.test(line)) {
      errors.push(`SKU ${sku}: contém termo proibido (cura/trata/garante/100%/reverte/resultado em/sem efeitos colaterais)`);
    }
    // seoDescription é a última coluna (índice 7). Verificar Title Case ruim
    const seoDesc = rows[i]?.[7] ?? '';
    if (TITLE_CASE_BAD.test(seoDesc)) {
      errors.push(`SKU ${sku}: seoDescription com Title Case ruim (" E ", " De ", etc.)`);
    }
  }

  if (errors.length > 0) {
    console.error('❌ QUALITY GATE FALHOU:');
    errors.slice(0, 20).forEach((e) => console.error('   ', e));
    if (errors.length > 20) {
      console.error(`   ... e mais ${errors.length - 20} erro(s)`);
    }
    process.exit(1);
  }
}

function main() {
  const catalogContent = fs.readFileSync(CATALOG_PATH, 'utf-8');
  const pricingContent = fs.readFileSync(PRICING_PATH, 'utf-8');

  const catalog = parseCSV(catalogContent);
  const pricing = parseCSV(pricingContent);

  const catalogSkus = new Set(catalog.map((r) => r.sku?.trim()).filter(Boolean));
  const pricingBySku = new Map<string, Record<string, string>>();
  for (const r of pricing) {
    const sku = r.sku?.trim();
    if (sku) pricingBySku.set(sku, r);
  }

  const extras = [...pricingBySku.keys()].filter((s) => !catalogSkus.has(s));
  if (extras.length > 0) {
    console.warn('⚠️  SKUs em pricing mas não no catálogo (excluídos):', extras.join(', '));
  }

  const rows: string[][] = [];
  const header = ['sku', 'priceCents', 'nome', 'compareAtCents', 'shortBenefit', 'description', 'seoTitle', 'seoDescription'];
  rows.push(header);

  for (const catRow of catalog) {
    const sku = catRow.sku?.trim();
    if (!sku) continue;

    const priceRow = pricingBySku.get(sku);
    const priceCents = catRow.priceCents ?? priceRow?.priceCents ?? '';
    const compareAtCents = priceRow?.compareAtCents ?? '';
    const shortBenefit = priceRow?.shortBenefit ?? '';

    let nome = priceRow?.nome ?? catRow.name ?? '';
    let seoTitle = priceRow?.seoTitle ?? `${nome} | MeJoy`;
    nome = normalizeWithTokens(nome);
    seoTitle = normalizeWithTokens(seoTitle);
    if (!seoTitle.endsWith(' | MeJoy')) seoTitle = `${seoTitle} | MeJoy`;

    let description = priceRow?.description ?? '';
    description = protectTokens(description);
    description = applyTypos(description.replace(/\bpara\s+apoia\b/gi, 'para apoiar'));
    if (description && !description.includes('Este produto não substitui')) {
      description = description.trimEnd() + DISCLAIMER;
    }
    description = restoreTokens(description);
    description = collapseSpaces(description);

    let seoDescription = priceRow?.seoDescription ?? '';
    seoDescription = protectTokens(seoDescription);
    seoDescription = sentenceCase(seoDescription);
    seoDescription = restoreTokens(seoDescription);
    seoDescription = applyTypos(seoDescription);
    seoDescription = collapseSpaces(truncateAtWord(seoDescription, 155));

    // Passagem final defensiva (titleCase pode gerar EquilíBrio, FóRmula etc.)
    nome = applyTypos(nome);
    seoTitle = applyTypos(seoTitle);
    description = applyTypos(description);

    rows.push([
      sku,
      String(priceCents),
      nome,
      compareAtCents,
      shortBenefit,
      description,
      seoTitle,
      seoDescription,
    ]);
  }

  const csv = rows.map((r) => r.map(escapeCSV).join(',')).join('\n');
  fs.writeFileSync(OUTPUT_PATH, csv, 'utf-8');

  runQualityGate(csv, rows);
  console.log(`✅ Gerado ${OUTPUT_PATH} com ${rows.length - 1} SKUs`);
}

main();
