import * as fs from 'fs';
import * as path from 'path';
import { PDP_MASTER_COMPARE_AT_FALLBACK_CENTS, PDP_TEMPLATE_MASTER_SKU } from './copy-v2';

const COPY_V4_PATH = path.join(process.cwd(), 'data', 'store-v2', 'copy', 'copy-blueprint-v4.csv');
const PRICING_PATH = path.join(process.cwd(), 'data', 'store-v2', 'pricing-content-v3-validado.csv');
const AKKERMAT_SLUG = 'akkermat-150-mg-30-capsulas';
const AKKERMAT_IMG = '/products/akkermat-150mg.png';

type CsvRow = Record<string, string>;

export interface FallbackCatalogProduct {
  id: string;
  sku: string;
  slug: string;
  name: string;
  shortName: string | null;
  description: string | null;
  shortBenefit: string | null;
  activeIngredients: string | null;
  objective: string;
  category: string | null;
  formDisplay: string | null;
  formKey: string | null;
  packSizeDisplay: string | null;
  priceCents: number | null;
  compareAtCents: number | null;
  rating: number | null;
  reviewCount: number;
  images: string[];
  badges: string[];
  requiresRx: boolean;
  requiresValidation: boolean;
  whatsappFlow: string;
  canSubscribe: boolean;
  subscribeDiscountPct: number | null;
  leadTimeDays: number;
  seoTitle: string | null;
  seoDescription: string | null;
  status: string;
}

interface FallbackCatalogEntry extends FallbackCatalogProduct {
  searchText: string;
}

let cachedEntries: FallbackCatalogEntry[] | null = null;

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else if (char !== '\n' && char !== '\r') {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

function parseCSV(content: string): CsvRow[] {
  const lines = content.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = parseCSVLine(line);
    const row: CsvRow = {};
    headers.forEach((header, index) => {
      row[header] = values[index] ?? '';
    });
    return row;
  });
}

function normalizeForSearch(value: string): string {
  return String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function slugFromBlueprint(row: CsvRow): string {
  const base = normalizeForSearch(row.normalizedProductName || row.productName)
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  const pack = normalizeForSearch(row.normalizedPack || row.pack)
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  return pack ? `${base}-${pack}` : base;
}

function resolveFallbackImages(slug: string): string[] {
  if (slug === AKKERMAT_SLUG) return Array(5).fill(AKKERMAT_IMG);

  const candidate = `/products/${slug}.png`;
  const fullPath = path.join(process.cwd(), 'public', candidate);
  if (fs.existsSync(fullPath)) return [candidate];

  return [];
}

function toInt(value: string | undefined): number | null {
  const digits = String(value ?? '').replace(/[^\d-]/g, '');
  if (!digits) return null;
  const parsed = Number.parseInt(digits, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function buildFallbackEntries(): FallbackCatalogEntry[] {
  const copyRows = fs.existsSync(COPY_V4_PATH) ? parseCSV(fs.readFileSync(COPY_V4_PATH, 'utf-8')) : [];
  const pricingRows = fs.existsSync(PRICING_PATH) ? parseCSV(fs.readFileSync(PRICING_PATH, 'utf-8')) : [];
  const pricingBySku = new Map(pricingRows.map((row) => [String(row.sku ?? '').trim(), row]));

  return copyRows
    .map((row) => {
      const sku = String(row.sku ?? '').trim();
      if (!sku) return null;

      const slug = slugFromBlueprint(row);
      const pricing = pricingBySku.get(sku);
      const priceCents = toInt(pricing?.priceCents);
      const compareAtCents = toInt(pricing?.compareAtCents) ?? (sku === PDP_TEMPLATE_MASTER_SKU ? PDP_MASTER_COMPARE_AT_FALLBACK_CENTS : null);
      const activeIngredients = [row.primaryActive, row.dose].filter(Boolean).join(' ').trim() || null;
      const images = resolveFallbackImages(slug);

      const entry: FallbackCatalogEntry = {
        id: `fallback-${sku}`,
        sku,
        slug,
        name: row.productName || row.normalizedProductName || sku,
        shortName: null,
        description: pricing?.description || row.description_md || null,
        shortBenefit: pricing?.shortBenefit || row.shortBenefit || row.hero_benefit || null,
        activeIngredients,
        objective: row.objective || 'Saúde',
        category: row.niche || null,
        formDisplay: row.normalizedFormDisplay || null,
        formKey: row.formKey || null,
        packSizeDisplay: row.normalizedPack || row.pack || null,
        priceCents,
        compareAtCents,
        rating: null,
        reviewCount: 0,
        images,
        badges: [],
        requiresRx: false,
        requiresValidation: false,
        whatsappFlow: 'none',
        canSubscribe: true,
        subscribeDiscountPct: null,
        leadTimeDays: 2,
        seoTitle: pricing?.seoTitle || row.seoTitle || null,
        seoDescription: pricing?.seoDescription || row.seoDescription || null,
        status: 'active',
        searchText: normalizeForSearch(
          [
            row.productName,
            row.normalizedProductName,
            row.objective,
            row.niche,
            row.primaryActive,
            row.hero_benefit,
            row.shortBenefit,
            row.keywords_primary,
            row.keywords_secondary,
            row.semantic_entities,
            slug,
          ]
            .filter(Boolean)
            .join(' ')
        ),
      };

      return entry;
    })
    .filter((entry): entry is FallbackCatalogEntry => Boolean(entry));
}

function getEntries(): FallbackCatalogEntry[] {
  if (cachedEntries) return cachedEntries;
  cachedEntries = buildFallbackEntries();
  return cachedEntries;
}

export function getFallbackProductBySlug(slug: string): FallbackCatalogProduct | null {
  const match = getEntries().find((entry) => entry.slug === slug);
  if (!match) return null;
  return { ...match };
}

export function searchFallbackCatalog(query: string, limit = 20): Array<{
  id: string;
  slug: string;
  name: string;
  shortName: string | null;
  shortBenefit: string | null;
  priceCents: number | null;
  compareAtCents: number | null;
  image: string | null;
  objective: string;
  sku: string;
}> {
  const normalizedQuery = normalizeForSearch(query);
  if (normalizedQuery.length < 2) return [];

  const queryWords = normalizedQuery.split(' ').filter(Boolean);

  return getEntries()
    .map((entry) => {
      let score = 0;
      if (entry.slug === normalizedQuery) score += 120;
      if (normalizeForSearch(entry.name).includes(normalizedQuery)) score += 100;
      if (entry.searchText.includes(normalizedQuery)) score += 60;
      score += queryWords.reduce((total, word) => total + (entry.searchText.includes(word) ? 10 : 0), 0);
      return { entry, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ entry }) => ({
      id: entry.id,
      slug: entry.slug,
      name: entry.name,
      shortName: entry.shortName,
      shortBenefit: entry.shortBenefit,
      priceCents: entry.priceCents,
      compareAtCents: entry.compareAtCents,
      image: entry.images[0] ?? null,
      objective: entry.objective,
      sku: entry.sku,
    }));
}

export function getFallbackRelatedProducts(
  objective: string,
  excludeSlug: string,
  limit = 4
): Array<{
  id: string;
  slug: string;
  name: string;
  shortName: string | null;
  shortBenefit: string | null;
  priceCents: number | null;
  compareAtCents: number | null;
  image: string | null;
  badges: string[];
  formDisplay: string | null;
  sku: string;
}> {
  return getEntries()
    .filter((entry) => entry.objective === objective && entry.slug !== excludeSlug)
    .slice(0, limit)
    .map((entry) => ({
      id: entry.id,
      slug: entry.slug,
      name: entry.name,
      shortName: entry.shortName,
      shortBenefit: entry.shortBenefit,
      priceCents: entry.priceCents,
      compareAtCents: entry.compareAtCents,
      image: entry.images[0] ?? null,
      badges: entry.badges,
      formDisplay: entry.formDisplay,
      sku: entry.sku,
    }));
}

export function getFallbackSampleSlug(): string | null {
  return getEntries()[0]?.slug ?? AKKERMAT_SLUG;
}

export function getFallbackCatalogStats(): {
  total: number;
  sampleSlug: string | null;
  sampleName: string | null;
  slugsUnique: boolean;
} {
  const entries = getEntries();
  const slugs = entries.map((entry) => entry.slug);

  return {
    total: entries.length,
    sampleSlug: entries[0]?.slug ?? null,
    sampleName: entries[0]?.name ?? null,
    slugsUnique: new Set(slugs).size === slugs.length,
  };
}
