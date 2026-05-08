/**
 * Acesso ao catálogo Store V2 (Prisma)
 */

import * as fs from 'fs';
import * as path from 'path';
import { buildProductAppValue, buildProtocolContext } from '@/lib/mejoy-app/value';
import { prisma } from '@/lib/prisma';
import { objectiveToSlug } from './slugs';

const AKKERMAT_SLUGS = ['akkermat-150-mg-30-capsulas'];
const AKKERMAT_IMG = '/products/akkermat-150mg.png';

/** Convenção: imagens MeJoy em public/products/{slug}.png */
function resolveProductImages(slug: string, dbImages: string[]): string[] {
  if (AKKERMAT_SLUGS.includes(slug)) return Array(5).fill(AKKERMAT_IMG);
  if (Array.isArray(dbImages) && dbImages.length > 0) {
    const real = dbImages.filter((u) => !/metaboslim|zapfarm/i.test(u));
    if (real.length > 0) return real;
  }
  const candidate = `/products/${slug}.png`;
  const fullPath = path.join(process.cwd(), 'public', candidate);
  if (fs.existsSync(fullPath)) return [candidate];
  return [];
}

export interface ProductCardData {
  id: string;
  slug: string;
  name: string;
  shortName?: string | null;
  shortBenefit?: string | null;
  priceCents: number | null;
  compareAtCents?: number | null;
  image?: string | null;
  badges?: string[];
  rating?: number | null;
  formDisplay?: string | null;
  sku?: string | null;
  appIncluded?: boolean;
  appTier?: 'premium_full_access';
  appValueHeadline?: string;
  appFeatureMatrix?: ReturnType<typeof buildProductAppValue>['featureMatrix'];
  protocolContext?: ReturnType<typeof buildProtocolContext>;
}

export async function getProductsByObjective(objectiveSlug: string, limit = 50) {
  const objectives: Record<string, string> = {
    'sono': 'Sono',
    'saude': 'Saúde',
    'cabelo': 'Cabelo',
    'emagrecimento-metabolismo': 'Emagrecimento & Metabolismo',
    'ansiedade-humor': 'Ansiedade & Humor',
    'articulacoes': 'Articulações',
    'detox-figado': 'Detox & Fígado',
    'energia-performance': 'Energia & Performance',
    'hormonal-libido': 'Hormonal & Libido',
    'imunidade': 'Imunidade',
    'intestino': 'Intestino',
    'pele-beleza': 'Pele & Beleza',
    'menopausa-tpm': 'Menopausa & TPM',
    'lipedema': 'Lipedema',
  };
  const objective = objectives[objectiveSlug] ?? objectiveSlug;

  const products = await prisma.product.findMany({
    where: {
      objective,
      status: 'active',
      active: true,
    },
    include: {
      variants: true,
      priceVersions: {
        where: { validTo: null },
        take: 1,
      },
    },
    orderBy: [{ priorityRank: 'asc' }, { name: 'asc' }],
    take: limit,
  });

  return products.map((p) => {
    const imgs = resolveProductImages(p.slug, p.images);
    const protocolContext = buildProtocolContext({
      productSlug: p.slug,
      objective: p.objective,
    });
    const appValue = buildProductAppValue({
      productSlug: p.slug,
      objective: p.objective,
      productName: p.name,
    });
    return {
      id: p.id,
      sku: p.sku,
      slug: p.slug,
      name: p.name,
      shortName: p.shortName,
      shortBenefit: p.shortBenefit,
      objective: p.objective,
      category: p.category,
      formDisplay: p.formDisplay,
      packSizeDisplay: p.packSizeDisplay,
      priceCents: p.variants[0]?.priceCents ?? p.priceVersions[0]?.priceCents ?? null,
      compareAtCents: p.priceVersions[0]?.compareAtCents ?? null,
      rating: null as number | null,
      reviewCount: 0,
      image: imgs[0] ?? p.images[0] ?? null,
      badges: p.badges,
      requiresRx: p.requiresRx,
      requiresValidation: p.requiresValidation,
      appIncluded: appValue.appIncluded,
      appTier: appValue.appTier,
      appValueHeadline: appValue.headline,
      appFeatureMatrix: appValue.featureMatrix,
      protocolContext,
      appValue,
    };
  });
}

/** Aliases: matriz/blueprint slug → slug real no DB. Gerado por scripts/audit-slugs.ts */
const SLUG_ALIASES: Record<string, string> = {
  'acido-malico-magnesio-quelato-90-capsulas': 'ac-malico-magnesio-quelato-90-capsulas',
  'l-teanina-200-mg-60-capsulas': 'l-teanine-200-mg-60-capsulas',
  'glucosamina-condroitina-ct2-acido-hialuronico-30-capsulas': 'glucosamina-condroitina-ct2-ac-hialuronico-30-capsulas',
  'minoxidil-d-pantenol-auxina-tricogena-100-ml-100-ml': 'minoxdil-d-pantenol-auxina-tricogena-100-ml',
  'minoxidil-5-com-biotina-100-ml-100-ml': 'minoxidil-5-com-biotina-100-ml',
  'minoxidil-5-com-propilenoglicol-100-ml-100-ml': 'minoxidil-5-com-propilenoglicol-100-ml',
  'minoxidil-5-em-trichosol-50-ml-50-ml': 'minoxidil-5-em-trichosol-50-ml',
  'minoxidil-turbinado-100-ml-100-ml': 'minoxidil-turbinado-100-ml',
  'saw-palmetto-160-mg-60-capsulas': 'saw-palmeto-160-mg-60-capsulas',
  'trichoxidil-2-5-60-ml-60-ml': 'trichoxidil-2-5-60-ml',
  'ioimbina-10-mg-90-capsulas': 'iombina-10-mg-90-capsulas',
  'oleo-de-semente-de-abobora-1-g-80-capsulas': 'ol-semente-de-aboora-1-g-80-capsulas',
  'tribulus-terrestris-500-mg-120-capsulas': 'tribullus-terrestris-500-mg-120-capsulas',
  'tribulus-terrestris-500-mg-60-capsulas': 'tribullus-terrestris-500-mg-60-capsulas',
  'colageno-com-ac-hialuronico-biotina-hibisco-e-vitamina-c-300-g-300-g': 'colageno-com-ac-hialuronico-biotina-hibisco-e-vitamina-c-300g',
  'colageno-skin-com-verisol-2-5-g-saches-30-saches': 'colageno-skin-com-verisol-2-5g-saches-30-saches',
  'creme-corporal-firmador-com-coenzima-q10-100-g-100-g': 'creme-corporal-firmador-com-coenzima-q10-100-g',
  'progesterona-transdermica-50-g-50-g': 'progesterona-transdermica-50g-50-g',
  'passiflora-200-mg-60-capsulas': 'passiflora-200-mg-60-capsulas-1',
};

export async function getProductBySlug(slug: string, includeDraft = true) {
  if (!slug) return null;
  let product = await prisma.product.findFirst({
    where: includeDraft ? { slug, active: true } : { slug, status: 'active', active: true },
    include: {
      variants: true,
      priceVersions: {
        where: { validTo: null },
        take: 1,
      },
      reviews: true,
    },
  });
  if (!product && SLUG_ALIASES[slug]) {
    product = await prisma.product.findFirst({
      where: includeDraft ? { slug: SLUG_ALIASES[slug], active: true } : { slug: SLUG_ALIASES[slug], status: 'active', active: true },
      include: {
        variants: true,
        priceVersions: { where: { validTo: null }, take: 1 },
        reviews: true,
      },
    });
  }
  if (!product) return null;

  const variants = Array.isArray(product.variants) ? product.variants : [];
  const priceVersions = Array.isArray(product.priceVersions) ? product.priceVersions : [];
  const reviews = Array.isArray(product.reviews) ? product.reviews : [];
  const priceCents = variants[0]?.priceCents ?? priceVersions[0]?.priceCents ?? null;
  const compareAtCents = priceVersions[0]?.compareAtCents ?? null;
  const rating =
    reviews.length > 0 ? reviews.reduce((s, r) => s + (r?.rating ?? 0), 0) / reviews.length : null;

  const dbImages = Array.isArray(product.images) ? product.images : [];
  const resolvedImages = resolveProductImages(product.slug, dbImages);
  const protocolContext = buildProtocolContext({
    productSlug: product.slug,
    objective: product.objective,
  });
  const appValue = buildProductAppValue({
    productSlug: product.slug,
    objective: product.objective,
    productName: product.name,
  });

  return {
    id: product.id,
    sku: product.sku,
    slug: product.slug,
    name: product.name,
    shortName: product.shortName,
    description: product.description,
    shortBenefit: product.shortBenefit,
    activeIngredients: product.activeIngredients,
    objective: product.objective,
    category: product.category,
    formDisplay: product.formDisplay,
    formKey: product.formKey,
    packSizeDisplay: product.packSizeDisplay,
    priceCents,
    compareAtCents,
    rating,
    reviewCount: reviews.length,
    images: resolvedImages.length > 0 ? resolvedImages : dbImages,
    badges: Array.isArray(product.badges) ? product.badges : [],
    tags: product.tags,
    requiresRx: product.requiresRx,
    requiresValidation: product.requiresValidation,
    whatsappFlow: product.whatsappFlow ?? 'none',
    canSubscribe: product.canSubscribe,
    subscribeDiscountPct: product.subscribeDiscountPct,
    leadTimeDays: product.leadTimeDays,
    seoTitle: product.seoTitle,
    seoDescription: product.seoDescription,
    status: product.status,
    appIncluded: appValue.appIncluded,
    appTier: appValue.appTier,
    appValueHeadline: appValue.headline,
    appFeatureMatrix: appValue.featureMatrix,
    protocolContext,
    appValue,
  };
}

export async function searchProducts(query: string, limit = 20) {
  if (!query || query.length < 2) return [];

  const q = query.trim();
  const qLower = q.toLowerCase();

  const products = await prisma.product.findMany({
    where: {
      status: 'active',
      active: true,
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { slug: { contains: q, mode: 'insensitive' } },
        { tags: { has: qLower } },
        { objective: { contains: q, mode: 'insensitive' } },
        ...(q.length >= 2
          ? [{ activeIngredients: { contains: q, mode: 'insensitive' } } as const]
          : []),
      ],
    },
    include: {
      variants: true,
      priceVersions: { where: { validTo: null }, take: 1 },
    },
    take: limit,
  });

  return products.map((p) => {
    const imgs = resolveProductImages(p.slug, p.images);
    const protocolContext = buildProtocolContext({
      productSlug: p.slug,
      objective: p.objective,
    });
    const appValue = buildProductAppValue({
      productSlug: p.slug,
      objective: p.objective,
      productName: p.name,
    });
    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      shortName: p.shortName,
      shortBenefit: p.shortBenefit,
      priceCents: p.variants[0]?.priceCents ?? p.priceVersions[0]?.priceCents ?? null,
      compareAtCents: p.priceVersions[0]?.compareAtCents ?? null,
      image: imgs[0] ?? p.images[0] ?? null,
      objective: p.objective,
      sku: p.sku ?? null,
      appIncluded: appValue.appIncluded,
      appTier: appValue.appTier,
      appValueHeadline: appValue.headline,
      appFeatureMatrix: appValue.featureMatrix,
      protocolContext,
      appValue,
    };
  });
}

/** Produtos por tag (ex: mais_buscados, mais_vendidos, novidades). */
export async function getProductsByTag(tag: string, limit = 8): Promise<ProductCardData[]> {
  const products = await prisma.product.findMany({
    where: {
      status: 'active',
      active: true,
      tags: { has: tag.toLowerCase() },
    },
    include: {
      variants: true,
      priceVersions: { where: { validTo: null }, take: 1 },
    },
    orderBy: [{ priorityRank: 'asc' }, { name: 'asc' }],
    take: limit,
  });
  return products.map((p) => {
    const imgs = resolveProductImages(p.slug, p.images);
    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      shortName: p.shortName,
      shortBenefit: p.shortBenefit,
      priceCents: p.variants[0]?.priceCents ?? p.priceVersions[0]?.priceCents ?? null,
      compareAtCents: p.priceVersions[0]?.compareAtCents ?? null,
      image: imgs[0] ?? p.images[0] ?? null,
      badges: p.badges,
      rating: null as number | null,
      formDisplay: p.formDisplay,
      sku: p.sku ?? null,
    };
  });
}

/** Produtos mais recentes (ordenados por createdAt). */
export async function getNewestProducts(limit = 8): Promise<ProductCardData[]> {
  const products = await prisma.product.findMany({
    where: { status: 'active', active: true },
    include: {
      variants: true,
      priceVersions: { where: { validTo: null }, take: 1 },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
  return products.map((p) => {
    const imgs = resolveProductImages(p.slug, p.images);
    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      shortName: p.shortName,
      shortBenefit: p.shortBenefit,
      priceCents: p.variants[0]?.priceCents ?? p.priceVersions[0]?.priceCents ?? null,
      compareAtCents: p.priceVersions[0]?.compareAtCents ?? null,
      image: imgs[0] ?? p.images[0] ?? null,
      badges: p.badges,
      rating: null as number | null,
      formDisplay: p.formDisplay,
      sku: p.sku ?? null,
    };
  });
}

/** Produtos em destaque (ordenados por priorityRank). */
export async function getTopProducts(limit = 8): Promise<ProductCardData[]> {
  const products = await prisma.product.findMany({
    where: { status: 'active', active: true },
    include: {
      variants: true,
      priceVersions: { where: { validTo: null }, take: 1 },
    },
    orderBy: [{ priorityRank: 'asc' }, { name: 'asc' }],
    take: limit,
  });
  return products.map((p) => {
    const imgs = resolveProductImages(p.slug, p.images);
    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      shortName: p.shortName,
      shortBenefit: p.shortBenefit,
      priceCents: p.variants[0]?.priceCents ?? p.priceVersions[0]?.priceCents ?? null,
      compareAtCents: p.priceVersions[0]?.compareAtCents ?? null,
      image: imgs[0] ?? p.images[0] ?? null,
      badges: p.badges,
      rating: null as number | null,
      formDisplay: p.formDisplay,
      sku: p.sku ?? null,
    };
  });
}

export async function getHomeSections(): Promise<
  { objectiveSlug: string; objectiveName: string; products: ProductCardData[] }[]
> {
  const order = [
    'Sono',
    'Saúde',
    'Emagrecimento & Metabolismo',
    'Cabelo',
    'Intestino',
    'Imunidade',
    'Ansiedade & Humor',
    'Articulações',
    'Detox & Fígado',
    'Energia & Performance',
    'Hormonal & Libido',
    'Pele & Beleza',
    'Menopausa & TPM',
    'Lipedema',
  ];
  const slugMap: Record<string, string> = {
    Sono: 'sono',
    Saúde: 'saude',
    'Emagrecimento & Metabolismo': 'emagrecimento-metabolismo',
    Cabelo: 'cabelo',
    Intestino: 'intestino',
    Imunidade: 'imunidade',
    'Ansiedade & Humor': 'ansiedade-humor',
    Articulações: 'articulacoes',
    'Detox & Fígado': 'detox-figado',
    'Energia & Performance': 'energia-performance',
    'Hormonal & Libido': 'hormonal-libido',
    'Pele & Beleza': 'pele-beleza',
    'Menopausa & TPM': 'menopausa-tpm',
    Lipedema: 'lipedema',
  };

  const products = await prisma.product.findMany({
    where: { status: 'active', active: true },
    include: {
      variants: true,
      priceVersions: { where: { validTo: null }, take: 1 },
    },
    orderBy: [{ priorityRank: 'asc' }, { name: 'asc' }],
  });

  const byObjective = new Map<string, ProductCardData[]>();
  for (const p of products) {
    const imgs = resolveProductImages(p.slug, p.images);
    const data: ProductCardData = {
      id: p.id,
      slug: p.slug,
      name: p.name,
      shortName: p.shortName,
      shortBenefit: p.shortBenefit,
      priceCents: p.variants[0]?.priceCents ?? p.priceVersions[0]?.priceCents ?? null,
      compareAtCents: p.priceVersions[0]?.compareAtCents ?? null,
      image: imgs[0] ?? p.images[0] ?? null,
      badges: p.badges,
      rating: null,
      formDisplay: p.formDisplay,
      sku: p.sku ?? null,
    };
    const list = byObjective.get(p.objective) ?? [];
    list.push(data);
    byObjective.set(p.objective, list);
  }

  return order
    .filter((obj) => byObjective.has(obj))
    .map((obj) => ({
      objectiveSlug: slugMap[obj] ?? objectiveToSlug(obj),
      objectiveName: obj,
      products: byObjective.get(obj)!,
    }));
}

/** Todos os produtos agrupados por objetivo, ordenados A–Z dentro de cada grupo. */
export async function getAllProductsByObjective(): Promise<
  { objectiveSlug: string; objectiveName: string; products: ProductCardData[] }[]
> {
  const sections = await getHomeSections();
  return sections.map((s) => ({
    ...s,
    products: [...s.products].sort((a, b) =>
      (a.name || '').localeCompare(b.name || '', 'pt-BR')
    ),
  }));
}

export async function getObjectivesWithCounts() {
  const counts = await prisma.product.groupBy({
    by: ['objective'],
    where: { status: 'active', active: true },
    _count: { id: true },
  });

  return counts.map((c) => ({
    objective: c.objective,
    count: c._count.id,
  }));
}

/** Produtos relacionados (mesmo objetivo, excluindo o atual). */
export async function getRelatedProducts(objective: string, excludeSlug: string, limit = 4) {
  const products = await prisma.product.findMany({
    where: {
      objective,
      slug: { not: excludeSlug },
      status: 'active',
      active: true,
    },
    include: {
      variants: true,
      priceVersions: { where: { validTo: null }, take: 1 },
    },
    orderBy: [{ priorityRank: 'asc' }, { name: 'asc' }],
    take: limit,
  });

  return products.map((p) => {
    const imgs = resolveProductImages(p.slug, p.images);
    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      shortName: p.shortName,
      shortBenefit: p.shortBenefit,
      priceCents: p.variants[0]?.priceCents ?? p.priceVersions[0]?.priceCents ?? null,
      compareAtCents: p.priceVersions[0]?.compareAtCents ?? null,
      image: imgs[0] ?? p.images[0] ?? null,
      badges: p.badges,
      formDisplay: p.formDisplay,
      sku: p.sku ?? null,
    };
  });
}

/** Retorna produtos por lista de slugs (para favoritos). */
export async function getProductsBySlugs(slugs: string[]): Promise<ProductCardData[]> {
  if (!slugs.length) return [];

  const products = await prisma.product.findMany({
    where: {
      slug: { in: slugs },
      status: 'active',
      active: true,
    },
    include: {
      variants: true,
      priceVersions: { where: { validTo: null }, take: 1 },
    },
  });

  return products.map((p) => {
    const imgs = resolveProductImages(p.slug, p.images);
    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      shortName: p.shortName,
      shortBenefit: p.shortBenefit,
      priceCents: p.variants[0]?.priceCents ?? p.priceVersions[0]?.priceCents ?? null,
      compareAtCents: p.priceVersions[0]?.compareAtCents ?? null,
      image: imgs[0] ?? p.images[0] ?? null,
      badges: p.badges,
      rating: null as number | null,
      formDisplay: p.formDisplay,
      sku: p.sku ?? null,
    };
  });
}

/** Retorna o slug de um produto ativo para validação de PDP (evita falso positivo 404). */
export async function getSampleProductSlug(): Promise<string | null> {
  const p = await prisma.product.findFirst({
    where: { status: 'active', active: true },
    select: { slug: true },
    orderBy: { priorityRank: 'asc' },
  });
  return p?.slug ?? null;
}
