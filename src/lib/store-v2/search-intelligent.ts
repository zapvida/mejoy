/**
 * Busca inteligente para produtos Store V2.
 * Suporta: nome do produto, ingredientes, sintomas, para_que_serve, problem_statement.
 */

import { searchProducts } from '@/lib/store-v2/catalog';
import { getCopyV4BySku } from '@/lib/store-v2/copy-v2';
import { getProductsByObjective } from '@/lib/store-v2/catalog';

export interface IntelligentSearchResult {
  id: string;
  slug: string;
  name: string;
  shortName?: string | null;
  shortBenefit?: string | null;
  priceCents: number | null;
  compareAtCents?: number | null;
  image?: string | null;
  objective?: string;
  sku?: string | null;
}

/** Mapeamento sintoma/palavra-chave → slug do objective para expandir busca */
const SYMPTOM_TO_OBJECTIVE_SLUG: Record<string, string> = {
  insônia: 'sono',
  insonia: 'sono',
  sono: 'sono',
  dormir: 'sono',
  ansiedade: 'ansiedade-humor',
  estresse: 'ansiedade-humor',
  depressão: 'ansiedade-humor',
  depressao: 'ansiedade-humor',
  humor: 'ansiedade-humor',
  emagrecer: 'emagrecimento-metabolismo',
  peso: 'emagrecimento-metabolismo',
  obesidade: 'emagrecimento-metabolismo',
  metabolismo: 'emagrecimento-metabolismo',
  cabelo: 'cabelo',
  'queda capilar': 'cabelo',
  calvície: 'cabelo',
  calvicie: 'cabelo',
  intestino: 'intestino',
  digestão: 'intestino',
  digestao: 'intestino',
  microbioma: 'intestino',
  articulação: 'articulacoes',
  articulações: 'articulacoes',
  articulacoes: 'articulacoes',
  articulacao: 'articulacoes',
  dor: 'articulacoes',
  energia: 'energia-performance',
  fadiga: 'energia-performance',
  cansaço: 'energia-performance',
  cansaco: 'energia-performance',
  disposição: 'energia-performance',
  imunidade: 'imunidade',
  pele: 'pele-beleza',
  acne: 'pele-beleza',
  beleza: 'pele-beleza',
  detox: 'detox-figado',
  fígado: 'detox-figado',
  figado: 'detox-figado',
  menopausa: 'menopausa-tpm',
  tpm: 'menopausa-tpm',
  saúde: 'saude',
  saude: 'saude',
  'perder peso': 'emagrecimento-metabolismo',
  'qualidade do sono': 'sono',
  'queda de cabelo': 'cabelo',
};

function normalizeForSearch(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ');
}

function textContainsQuery(text: string, query: string): boolean {
  if (!text) return false;
  const nText = normalizeForSearch(text);
  const nQuery = normalizeForSearch(query);
  const words = nQuery.split(' ').filter((w) => w.length > 0);
  return words.some((w) => nText.includes(w)) || nText.includes(nQuery);
}

/** Verifica se o copy v4 contém a query em campos de busca */
function copyMatchesQuery(
  copy: ReturnType<typeof getCopyV4BySku>,
  query: string
): boolean {
  if (!copy) return false;
  const fields = [
    copy.hero_benefit,
    copy.shortBenefit,
    copy.para_que_serve,
    copy.problem_statement,
    copy.semantic_entities,
    copy.keywords_primary,
    copy.keywords_secondary,
  ].filter(Boolean) as string[];
  return fields.some((f) => textContainsQuery(f, query));
}

/**
 * Busca inteligente: combina busca Prisma com expansão por sintomas e boost por copy.
 */
export async function searchProductsIntelligent(
  query: string,
  limit = 20
): Promise<IntelligentSearchResult[]> {
  if (!query || query.length < 2) return [];

  const q = query.trim();
  const qNorm = normalizeForSearch(q);
  const seenIds = new Set<string>();
  const scored = new Map<string, { product: IntelligentSearchResult; score: number }>();

  // 1. Busca base (Prisma)
  const baseResults = await searchProducts(q, limit * 2);
  for (const p of baseResults) {
    seenIds.add(p.id);
    let score = 50;
    if (normalizeForSearch(p.name).includes(qNorm)) score = 100;
    else if (p.slug && normalizeForSearch(p.slug).includes(qNorm)) score = 95;
    else if (p.objective && normalizeForSearch(p.objective).includes(qNorm)) score = 70;
    scored.set(p.id, { product: p, score });
  }

  // 2. Expansão por sintoma → objective
  const qLower = q.toLowerCase().trim();
  let objectiveSlug =
    SYMPTOM_TO_OBJECTIVE_SLUG[qNorm] ??
    SYMPTOM_TO_OBJECTIVE_SLUG[qLower] ??
    SYMPTOM_TO_OBJECTIVE_SLUG[qNorm.replace(/\s+/g, ' ')];
  if (!objectiveSlug) {
    const words = qNorm.split(' ').filter((w) => w.length > 1);
    for (const w of words) {
      if (SYMPTOM_TO_OBJECTIVE_SLUG[w]) {
        objectiveSlug = SYMPTOM_TO_OBJECTIVE_SLUG[w];
        break;
      }
    }
  }
  if (objectiveSlug) {
    const byObjective = await getProductsByObjective(objectiveSlug, 15);
    for (const p of byObjective) {
      if (seenIds.has(p.id)) {
        const existing = scored.get(p.id);
        if (existing && existing.score < 85) {
          scored.set(p.id, { product: existing.product, score: 85 });
        }
      } else {
        seenIds.add(p.id);
        scored.set(p.id, {
          product: {
            id: p.id,
            slug: p.slug,
            name: p.name,
            shortName: p.shortName,
            shortBenefit: p.shortBenefit,
            priceCents: p.priceCents,
            compareAtCents: p.compareAtCents,
            image: p.image,
            objective: p.objective,
            sku: p.sku,
          },
          score: 80,
        });
      }
    }
  }

  // 3. Boost por match no copy v4 (problem_statement, para_que_serve, etc.)
  for (const [, { product, score }] of scored) {
    if (product.sku) {
      const copy = getCopyV4BySku(product.sku);
      if (copy && copyMatchesQuery(copy, q) && score < 90) {
        scored.set(product.id, { product, score: Math.max(score, 88) });
      }
    }
  }

  // 4. Ordenar por score e limitar
  const sorted = Array.from(scored.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ product }) => product);

  return sorted;
}
