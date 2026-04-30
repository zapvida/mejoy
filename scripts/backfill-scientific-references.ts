#!/usr/bin/env tsx
/**
 * Backfill de referencias cientificas (3 por SKU) no copy-blueprint-v4.
 * Estrategia:
 * 1) tentar busca por ativo primario + tipo de estudo
 * 2) fallback por ativo + objetivo
 * 3) fallback por objetivo (quando ativo nao tem literatura suficiente)
 *
 * Uso:
 *   pnpm tsx scripts/backfill-scientific-references.ts
 *   pnpm tsx scripts/backfill-scientific-references.ts --only-missing
 */

import * as fs from 'fs';
import * as path from 'path';
import { parseCSV, writeCSV } from './lib/copy-utils';

const BLUEPRINT_PATH = path.join(process.cwd(), 'data', 'store-v2', 'copy', 'copy-blueprint-v4.csv');
const REPORT_PATH = path.join(process.cwd(), 'scripts', 'generated', 'scientific-references-backfill-report.json');

const OBJECTIVE_QUERY_BASE: Record<string, string> = {
  'Ansiedade & Humor': '(anxiety OR stress OR mood OR depression)',
  'Sono': '(insomnia OR sleep quality OR sleep disorder)',
  'Emagrecimento & Metabolismo': '(obesity OR weight loss OR appetite OR metabolism)',
  'Cabelo': '(androgenetic alopecia OR hair loss OR scalp health)',
  'Intestino': '(gut microbiota OR irritable bowel syndrome OR digestive health)',
  'Imunidade': '(immune function OR respiratory infection OR immune support)',
  'Articulações': '(osteoarthritis OR joint pain OR cartilage)',
  'Detox & Fígado': '(fatty liver OR liver health OR hepatoprotection)',
  'Hormonal & Libido': '(libido OR sexual function OR testosterone OR hormonal balance)',
  'Menopausa & TPM': '(menopause OR premenstrual syndrome OR vasomotor symptoms)',
  'Lipedema': '(lipedema OR edema OR microcirculation)',
};

const STUDY_FILTER = '(systematic review[Publication Type] OR meta-analysis[Publication Type] OR randomized controlled trial[Publication Type])';
const DATE_FILTER = '("2012"[Date - Publication] : "3000"[Date - Publication])';

const ACTIVE_SYNONYMS: Record<string, string[]> = {
  '5 htp': ['5-hydroxytryptophan', '5-htp'],
  'l teanina': ['l-theanine', 'theanine'],
  'ashwagandha': ['ashwagandha', 'withania somnifera'],
  'bacopa monnieri': ['bacopa monnieri'],
  'rhodiola rosea': ['rhodiola rosea'],
  passiflora: ['passiflora incarnata'],
  inositol: ['inositol'],
  glucosamina: ['glucosamine'],
  condroitina: ['chondroitin'],
  msm: ['methylsulfonylmethane', 'msm'],
  'acido hialuronico': ['hyaluronic acid'],
  'coenzima q10': ['coenzyme q10', 'ubiquinone'],
  'alfa lipoico': ['alpha-lipoic acid', 'lipoic acid', 'thioctic acid'],
  'acido lipoico': ['alpha-lipoic acid', 'lipoic acid', 'thioctic acid'],
  curcumina: ['curcumin'],
  berberina: ['berberine'],
  melatonina: ['melatonin'],
  valeriana: ['valerian'],
  magnésio: ['magnesium'],
  magnesio: ['magnesium'],
  creatina: ['creatine'],
  cafeina: ['caffeine'],
  probiotico: ['probiotic'],
  omega: ['omega-3'],
  saw: ['saw palmetto'],
  minoxidil: ['minoxidil'],
  cactin: ['opuntia ficus-indica', 'nopal cactus extract', 'cactus extract'],
};

const OBJECTIVE_RELEVANCE: Record<string, string[]> = {
  'Ansiedade & Humor': ['anxiety', 'stress', 'mood', 'depression', 'cognition', 'attention', 'nootropic'],
  'Sono': ['sleep', 'insomnia', 'circadian', 'sleep quality', 'melatonin'],
  'Emagrecimento & Metabolismo': ['obesity', 'weight', 'appetite', 'metabolism', 'body composition', 'thermogenesis'],
  'Cabelo': ['alopecia', 'hair', 'scalp', 'follicle', 'hair loss'],
  'Intestino': ['gut', 'microbiota', 'intestinal', 'digestive', 'bowel'],
  'Imunidade': ['immune', 'immunity', 'infection', 'inflammatory'],
  'Articulações': ['joint', 'osteoarthritis', 'cartilage', 'musculoskeletal'],
  'Detox & Fígado': ['liver', 'hepatic', 'hepatoprotective', 'steatosis', 'fatty liver'],
  'Hormonal & Libido': ['libido', 'sexual', 'hormonal', 'testosterone', 'erectile'],
  'Menopausa & TPM': ['menopause', 'premenstrual', 'vasomotor', 'hot flash'],
  'Lipedema': ['lipedema', 'edema', 'microcirculation', 'lymphatic'],
};

const IRRELEVANT_REFERENCE_TOKENS = [
  'sister chromatid',
  'drosophila',
  'polycythaemia',
  'septic shock',
  'ovarian reserve',
  'ubiquitination',
  'chromatid cohesion',
  'virus',
  'antiviral activity',
  'cell polarity',
  'chicken hepatocyte',
  'murine',
  'mouse model',
  'rat model',
];

type PubmedSummary = {
  uid: string;
  title: string;
  pubdate?: string;
  fulljournalname?: string;
  source?: string;
};

type SearchResp = { esearchresult?: { idlist?: string[] } };
type SummaryResp = { result?: { uids?: string[]; [id: string]: PubmedSummary | string[] | undefined } };

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function norm(value: string): string {
  return (value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function cleanText(s: string): string {
  return (s ?? '')
    .replace(/\s+/g, ' ')
    .replace(/[“”]/g, '"')
    .replace(/[’]/g, "'")
    .trim();
}

function extractYear(pubdate?: string): string {
  const m = (pubdate ?? '').match(/\b(19|20)\d{2}\b/);
  return m?.[0] ?? 's.d.';
}

function splitActiveTerms(primaryActive: string): string[] {
  const base = cleanText(primaryActive)
    .replace(/\b\d+([.,]\d+)?\s?(mg|g|mcg|ml|%)\b/gi, ' ')
    .replace(/[+/,;()-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const stopTokens = new Set([
    'ativo',
    'ativos',
    'complex',
    'blend',
    'formula',
    'capsulas',
    'capsula',
    'saches',
    'sache',
    'htp',
    'tipo',
    'acido',
    'oleo',
    'extract',
  ]);

  const raw = base
    .split(' ')
    .map((w) => cleanText(w))
    .filter((w) => w.length > 3)
    .filter((w) => !stopTokens.has(norm(w)));
  const key = norm(base);
  const mapped = Object.entries(ACTIVE_SYNONYMS)
    .filter(([k]) => key.includes(k))
    .flatMap(([, terms]) => terms);

  const unique: string[] = [];
  const add = (term: string) => {
    const t = cleanText(term);
    if (!t) return;
    if (!unique.some((u) => norm(u) === norm(t))) unique.push(t);
  };

  mapped.forEach(add);
  // Quando nao ha sinonimo mapeado, evita buscar por nomes comerciais/ambíguos.
  if (mapped.length === 0) {
    const safeRaw = raw.filter((term) =>
      /(acid|acido|extract|melatonin|valerian|ashwagandha|bacopa|rhodiola|passiflora|inositol|berberine|curcumin|glucosamine|chondroitin|hyaluronic|magnesium|creatine|caffeine|probiotic|omega|minoxidil|finasteride|orlistat|tadalafila|centella|vitex|teanina|lipoic)/i.test(term)
    );
    safeRaw.slice(0, 3).forEach(add);
  }
  return unique.slice(0, 4);
}

function isRelevantReference(reference: string, objective: string, activeTerms: string[]): boolean {
  const hay = norm(reference);
  if (!hay) return false;
  for (const bad of IRRELEVANT_REFERENCE_TOKENS) {
    if (hay.includes(norm(bad))) return false;
  }
  const objectiveHits = (OBJECTIVE_RELEVANCE[objective] ?? []).some((kw) => hay.includes(norm(kw)));
  const activeHits = activeTerms.some((term) => {
    const t = norm(term);
    return t.length >= 4 && hay.includes(t);
  });
  if (objective === 'Emagrecimento & Metabolismo') {
    // Emagrecimento exige conexão explícita com peso/metabolismo.
    return objectiveHits;
  }
  return objectiveHits || activeHits;
}

async function fetchJson<T>(url: string): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const res = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'User-Agent': 'mejoy-codex-reference-backfill/2.0',
      },
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} for ${url}`);
    }
    return (await res.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

function toRef(item: PubmedSummary): string | null {
  if (!item?.uid || !item?.title) return null;
  const title = cleanText(item.title).replace(/\.$/, '');
  const year = extractYear(item.pubdate);
  const journal = cleanText(item.fulljournalname || item.source || 'PubMed');
  return `${title} (${year}). ${journal}. https://pubmed.ncbi.nlm.nih.gov/${item.uid}/`;
}

function uniqRefs(refs: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const ref of refs) {
    const id = ref.match(/pubmed\.ncbi\.nlm\.nih\.gov\/(\d+)\//)?.[1] ?? norm(ref);
    if (seen.has(id)) continue;
    seen.add(id);
    out.push(ref);
  }
  return out;
}

async function fetchReferencesByQuery(term: string, retmax = 18): Promise<string[]> {
  const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=${retmax}&sort=relevance&term=${encodeURIComponent(term)}`;
  const searchData = await fetchJson<SearchResp>(searchUrl);
  const ids = (searchData?.esearchresult?.idlist ?? []).slice(0, retmax);
  if (ids.length === 0) return [];

  const summaryUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=${ids.join(',')}`;
  const summaryData = await fetchJson<SummaryResp>(summaryUrl);
  const uids = (summaryData?.result?.uids ?? []).slice(0, retmax);
  const refs: string[] = [];
  for (const uid of uids) {
    const item = summaryData?.result?.[uid] as PubmedSummary | undefined;
    const ref = item ? toRef(item) : null;
    if (ref) refs.push(ref);
    if (refs.length >= 6) break;
  }
  return uniqRefs(refs);
}

async function fetchObjectiveReferences(objective: string): Promise<string[]> {
  const objectiveBase = OBJECTIVE_QUERY_BASE[objective] ?? '(diet OR supplementation OR lifestyle)';
  const query = `(${objectiveBase}) AND ${STUDY_FILTER} AND ${DATE_FILTER}`;
  const refs = (await fetchReferencesByQuery(query, 18))
    .filter((ref) => isRelevantReference(ref, objective, []));
  if (refs.length >= 3) return refs.slice(0, 3);

  const looser = `(${objectiveBase}) AND ("2010"[Date - Publication] : "3000"[Date - Publication])`;
  const refsLoose = (await fetchReferencesByQuery(looser, 18))
    .filter((ref) => isRelevantReference(ref, objective, []));
  return refsLoose.slice(0, 3);
}

async function fetchActiveReferences(primaryActive: string, objective: string): Promise<string[]> {
  const terms = splitActiveTerms(primaryActive);
  if (terms.length === 0) return [];
  const activeClause = terms.map((t) => `"${t}"[Title/Abstract]`).join(' OR ');
  const objectiveBase = OBJECTIVE_QUERY_BASE[objective] ?? '(nutrition OR supplementation)';

  const strict = `(${activeClause}) AND ${STUDY_FILTER} AND ${DATE_FILTER}`;
  const strictRefs = (await fetchReferencesByQuery(strict, 22))
    .filter((ref) => isRelevantReference(ref, objective, terms));
  if (strictRefs.length >= 3) return strictRefs.slice(0, 3);

  const blended = `(${activeClause}) AND (${objectiveBase}) AND ${DATE_FILTER}`;
  const blendedRefs = (await fetchReferencesByQuery(blended, 22))
    .filter((ref) => isRelevantReference(ref, objective, terms));
  if (blendedRefs.length >= 3) return blendedRefs.slice(0, 3);

  const loose = `(${activeClause}) AND ("2008"[Date - Publication] : "3000"[Date - Publication])`;
  const looseRefs = (await fetchReferencesByQuery(loose, 22))
    .filter((ref) => isRelevantReference(ref, objective, terms));
  return looseRefs.slice(0, 3);
}

async function main() {
  const onlyMissing = process.argv.includes('--only-missing');

  if (!fs.existsSync(BLUEPRINT_PATH)) {
    console.error('❌ copy-blueprint-v4.csv nao encontrado.');
    process.exit(1);
  }

  const { headers, rows } = parseCSV(fs.readFileSync(BLUEPRINT_PATH, 'utf-8'));
  if (!headers.includes('references')) {
    console.error('❌ Coluna references nao encontrada no CSV.');
    process.exit(1);
  }

  const objectiveCache = new Map<string, string[]>();
  const activeCache = new Map<string, string[]>();
  const objectiveErrors: string[] = [];
  const activeErrors: string[] = [];

  let updated = 0;
  let activeWins = 0;
  let objectiveFallbackWins = 0;

  for (const row of rows) {
    const objective = cleanText(row.objective ?? '');
    const primaryActive = cleanText(row.primaryActive ?? row.normalizedPrimaryActive ?? '');
    const currentRefs = (row.references ?? '').split(/\s*\|\s*/).map((s) => s.trim()).filter(Boolean);
    const hasEnough = currentRefs.length >= 3;
    if (onlyMissing && hasEnough) continue;

    const cacheKey = `${norm(primaryActive)}|${norm(objective)}`;
    let refs = activeCache.get(cacheKey) ?? [];
    if (refs.length < 3) {
      try {
        refs = await fetchActiveReferences(primaryActive, objective);
        if (refs.length >= 3) {
          activeCache.set(cacheKey, refs);
        } else if (primaryActive) {
          activeErrors.push(`${row.sku ?? 'sem-sku'} (${primaryActive}): refs por ativo insuficientes`);
        }
      } catch (e) {
        if (primaryActive) activeErrors.push(`${row.sku ?? 'sem-sku'} (${primaryActive}): ${(e as Error).message}`);
      }
      await sleep(180);
    }

    if (refs.length < 3) {
      let objectiveRefs = objectiveCache.get(objective) ?? [];
      if (objectiveRefs.length < 3) {
        try {
          objectiveRefs = await fetchObjectiveReferences(objective);
          objectiveCache.set(objective, objectiveRefs);
        } catch (e) {
          objectiveErrors.push(`${objective}: ${(e as Error).message}`);
          objectiveRefs = [];
        }
        await sleep(180);
      }
      refs = objectiveRefs;
      if (refs.length >= 3) objectiveFallbackWins++;
    } else {
      activeWins++;
    }

    if (refs.length >= 3) {
      row.references = refs.slice(0, 3).join(' | ');
      updated++;
    }
  }

  fs.writeFileSync(BLUEPRINT_PATH, writeCSV(headers, rows), 'utf-8');

  const report = {
    generatedAt: new Date().toISOString(),
    onlyMissing,
    rowsUpdated: updated,
    totalRows: rows.length,
    activeWins,
    objectiveFallbackWins,
    activeCacheSize: activeCache.size,
    objectiveCacheSize: objectiveCache.size,
    activeErrors: activeErrors.slice(0, 200),
    objectiveErrors: objectiveErrors.slice(0, 200),
  };
  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), 'utf-8');

  console.log('✅ Backfill de referencias cientificas concluido');
  console.log(`   SKUs atualizados: ${updated}`);
  console.log(`   refs por ativo: ${activeWins}`);
  console.log(`   fallback por objetivo: ${objectiveFallbackWins}`);
  console.log(`   Relatorio: ${REPORT_PATH}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
