import Head from 'next/head';
import dynamic from 'next/dynamic';
import { GetServerSideProps } from 'next';
import { isRootB2BDomain, isStoreV2Enabled, isCopyV4Enabled } from '@/lib/flags';
import { getHomeSections, getProductsByTag, getNewestProducts, getTopProducts } from '@/lib/store-v2/catalog';
import { getCopyV4BySku } from '@/lib/store-v2/copy-v2';
import { buildCanonical, SITE } from '@/lib/seo';
import type { ProductCardData } from '@/lib/store-v2/catalog';
import { MeJoyGreenHome } from '@/components/home/MeJoyGreenHome';

const B2BLanding = dynamic(() => import('@/components/b2b/B2BLanding'));

/**
 * Homepage: mejoy.com.br = Loja (B2CLanding ou StoreV2Home). zapfarm.com.br = B2B white-label.
 */
export type HomeFeaturedSections = {
  maisBuscados: ProductCardData[];
  maisVendidos: ProductCardData[];
  novidades: ProductCardData[];
};

type HomeSection = { objectiveSlug: string; objectiveName: string; products: ProductCardData[] };

const FEATURED_LIMIT = 8;
const SUBTITLE_MAX_WORDS = 6;
const ROOT_DESCRIPTION =
  'Saúde digital com avaliação médica, triagem online e acompanhamento humano em uma jornada contínua da leitura inicial aos próximos passos.';
const OBJECTIVE_HOME_FALLBACKS: Record<string, string[]> = {
  'Ansiedade & Humor': [
    'Equilíbrio emocional com foco diário.',
    'Clareza mental para dias exigentes.',
    'Calma e constância na rotina.',
  ],
  'Articulações': [
    'Conforto articular para movimento diário.',
    'Mobilidade com cuidado contínuo.',
    'Apoio funcional para articulações.',
  ],
  Cabelo: [
    'Fortalecimento dos fios na rotina.',
    'Cuidado do couro cabeludo diário.',
    'Suporte capilar com constância.',
  ],
  'Detox & Fígado': [
    'Suporte hepático com rotina estável.',
    'Conforto digestivo com cuidado diário.',
    'Apoio detox com uso orientado.',
  ],
  'Emagrecimento & Metabolismo': [
    'Controle de apetite com constância.',
    'Apoio metabólico para evolução.',
    'Rotina de emagrecimento sustentável.',
  ],
  Intestino: [
    'Conforto digestivo no dia a dia.',
    'Regularidade intestinal com constância.',
    'Equilíbrio da microbiota na rotina.',
  ],
  Saúde: [
    'Cuidado diário com foco em bem-estar.',
    'Suporte funcional para rotina saudável.',
    'Estratégia de saúde com constância.',
  ],
  Sono: [
    'Relaxamento noturno para dormir melhor.',
    'Noites mais estáveis com constância.',
    'Descanso com rotina organizada.',
  ],
};
const NAME_STOPWORDS = new Set([
  'de',
  'da',
  'do',
  'das',
  'dos',
  'para',
  'com',
  'sem',
  'e',
  'em',
  'capsula',
  'capsulas',
  'caps',
  'mg',
  'ml',
  'g',
  'tipo',
  'ii',
  'iii',
  'plus',
  'max',
]);

function normalizeSubtitle(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeWord(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

function countWords(value: string): number {
  return value
    .replace(/[.!?]+$/g, '')
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean).length;
}

function formatHomeSubtitle(value: string): string {
  const words = value
    .replace(/\.\.\.+/g, ' ')
    .replace(/[!?]/g, ' ')
    .split(/\s+/)
    .map((word) => word.replace(/^[^A-Za-zÀ-ÖØ-öø-ÿ0-9-]+|[^A-Za-zÀ-ÖØ-öø-ÿ0-9-]+$/g, ''))
    .filter(Boolean)
    .slice(0, SUBTITLE_MAX_WORDS);

  if (!words.length) return '';
  return `${words.join(' ').replace(/[.!?]+$/g, '')}.`;
}

function hashSeed(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 33 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function subtitleRepeatsProductName(subtitle: string, productName: string): boolean {
  const nameTokens = new Set(
    productName
      .split(/\s+/)
      .map(normalizeWord)
      .filter((token) => token.length >= 4 && !NAME_STOPWORDS.has(token) && !/^\d+$/.test(token)),
  );
  if (!nameTokens.size) return false;
  return subtitle
    .replace(/[.!?]+$/g, '')
    .split(/\s+/)
    .map(normalizeWord)
    .some((token) => nameTokens.has(token));
}

function stripProductNameFromSubtitle(subtitle: string, productName: string): string {
  const subtitleNorm = normalizeSubtitle(subtitle);
  const productNorm = normalizeSubtitle(productName);
  if (!subtitleNorm || !productNorm) return subtitle;
  const productWords = productNorm.split(' ').filter((w) => w.length >= 4 && !NAME_STOPWORDS.has(w));
  if (!productWords.length) return subtitle;

  const words = subtitle.split(/\s+/).filter(Boolean);
  const filtered = words.filter((word) => {
    const n = normalizeWord(word);
    return !(n.length >= 4 && productWords.includes(n));
  });
  const cleaned = filtered.join(' ').replace(/\s+/g, ' ').trim();
  return cleaned || subtitle;
}

function extractSubtitleFromBenefit(raw: string): string {
  const cleanRaw = raw
    .replace(/\*\*/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*\|\s*/g, '. ')
    .trim();
  if (!cleanRaw) return '';
  const firstSentence = cleanRaw.split(/[.!?]/).map((s) => s.trim()).find(Boolean) ?? cleanRaw;
  const noColon = firstSentence.replace(/\s*:\s*/g, ' ').trim();
  return formatHomeSubtitle(noColon);
}

function buildSubtitleCandidate(product: ProductCardData, objectiveName: string | undefined, attempt: number): string {
  if (attempt === 0 && product.shortBenefit) {
    const fromBenefit = extractSubtitleFromBenefit(product.shortBenefit);
    if (fromBenefit) return stripProductNameFromSubtitle(fromBenefit, product.name);
  }

  const fallback = OBJECTIVE_HOME_FALLBACKS[objectiveName ?? ''] ?? OBJECTIVE_HOME_FALLBACKS['Saúde'];
  const seed = hashSeed(`${product.id}|${product.slug}|${objectiveName ?? ''}|${attempt}`);
  return formatHomeSubtitle(fallback[seed % fallback.length] ?? 'Cuidado diário com constância.');
}

function buildUniqueSubtitle(
  product: ProductCardData,
  objectiveName: string | undefined,
  usedSubtitles: Set<string>,
): string {
  for (let attempt = 0; attempt < 500; attempt += 1) {
    const subtitle = buildSubtitleCandidate(product, objectiveName, attempt);
    if (!subtitle) continue;
    if (subtitle.includes('...')) continue;
    if (countWords(subtitle) > SUBTITLE_MAX_WORDS) continue;
    if (!subtitle.endsWith('.')) continue;
    if (subtitleRepeatsProductName(subtitle, product.name)) continue;

    const key = normalizeSubtitle(subtitle);
    if (usedSubtitles.has(key)) continue;
    usedSubtitles.add(key);
    return subtitle;
  }

  const fallbackList = OBJECTIVE_HOME_FALLBACKS[objectiveName ?? ''] ?? OBJECTIVE_HOME_FALLBACKS['Saúde'];
  for (const fallback of fallbackList) {
    if (!fallback) continue;
    if (subtitleRepeatsProductName(fallback, product.name)) continue;
    const key = normalizeSubtitle(fallback);
    if (usedSubtitles.has(key)) continue;
    usedSubtitles.add(key);
    return fallback;
  }

  return 'Cuidado diário com bem-estar.';
}

function ensureUniqueHomeSubtitles(
  sections: HomeSection[],
  featured: HomeFeaturedSections,
): { sections: HomeSection[]; featured: HomeFeaturedSections } {
  const byProductId = new Map<string, ProductCardData>();
  const objectiveByProductId = new Map<string, string>();

  for (const section of sections) {
    for (const product of section.products) {
      byProductId.set(product.id, product);
      objectiveByProductId.set(product.id, section.objectiveName);
    }
  }
  for (const list of [featured.maisBuscados, featured.maisVendidos, featured.novidades]) {
    for (const product of list) {
      if (!byProductId.has(product.id)) byProductId.set(product.id, product);
      if (!objectiveByProductId.has(product.id)) {
        const objective = (product as ProductCardData & { objective?: string | null }).objective;
        if (typeof objective === 'string' && objective.trim()) {
          objectiveByProductId.set(product.id, objective.trim());
        }
      }
    }
  }

  const usedSubtitles = new Set<string>();
  const subtitleById = new Map<string, string>();
  const orderedIds = Array.from(byProductId.keys()).sort((a, b) => a.localeCompare(b));
  for (const id of orderedIds) {
    const product = byProductId.get(id);
    if (!product) continue;
    subtitleById.set(id, buildUniqueSubtitle(product, objectiveByProductId.get(id), usedSubtitles));
  }

  const applySubtitle = (product: ProductCardData): ProductCardData => ({
    ...product,
    shortBenefit: subtitleById.get(product.id) ?? product.shortBenefit,
  });

  return {
    sections: sections.map((section) => ({
      ...section,
      products: section.products.map(applySubtitle),
    })),
    featured: {
      maisBuscados: featured.maisBuscados.map(applySubtitle),
      maisVendidos: featured.maisVendidos.map(applySubtitle),
      novidades: featured.novidades.map(applySubtitle),
    },
  };
}

function pickUniqueProducts(
  sources: ProductCardData[][],
  limit: number,
  usedIds: Set<string>,
): ProductCardData[] {
  const selected: ProductCardData[] = [];
  const localIds = new Set<string>();

  for (const source of sources) {
    for (const product of source) {
      if (selected.length >= limit) return selected;
      if (usedIds.has(product.id) || localIds.has(product.id)) continue;
      selected.push(product);
      localIds.add(product.id);
      usedIds.add(product.id);
    }
  }

  return selected;
}

function fillListWithGlobalUniqueness(
  current: ProductCardData[],
  fallback: ProductCardData[],
  limit: number,
  usedIds: Set<string>,
): ProductCardData[] {
  if (current.length >= limit) return current;

  const merged = [...current];
  const ids = new Set(current.map((p) => p.id));

  // 1) Prioriza itens inéditos entre vitrines.
  for (const product of fallback) {
    if (merged.length >= limit) break;
    if (ids.has(product.id) || usedIds.has(product.id)) continue;
    merged.push(product);
    ids.add(product.id);
    usedIds.add(product.id);
  }

  // 2) Catálogo curto: completa a vitrine mesmo com repetição.
  for (const product of fallback) {
    if (merged.length >= limit) break;
    if (ids.has(product.id)) continue;
    merged.push(product);
    ids.add(product.id);
  }

  return merged;
}

async function getFeaturedHomeSections(limit = FEATURED_LIMIT): Promise<HomeFeaturedSections> {
  const poolLimit = Math.max(limit * 4, 24);
  const [tagBuscados, tagVendidos, tagNovidades, topProducts, newestProducts] = await Promise.all([
    getProductsByTag('mais_buscados', poolLimit),
    getProductsByTag('mais_vendidos', poolLimit),
    getProductsByTag('novidades', poolLimit),
    getTopProducts(poolLimit),
    getNewestProducts(poolLimit),
  ]);

  const usedIds = new Set<string>();

  let maisBuscados = pickUniqueProducts([tagBuscados, topProducts, newestProducts], limit, usedIds);
  let maisVendidos = pickUniqueProducts([tagVendidos, topProducts, newestProducts], limit, usedIds);
  let novidades = pickUniqueProducts([tagNovidades, newestProducts, topProducts], limit, usedIds);

  // Catálogo pequeno: completa cada vitrine sem deixá-la vazia.
  maisBuscados = fillListWithGlobalUniqueness(maisBuscados, [...tagBuscados, ...topProducts, ...newestProducts], limit, usedIds);
  maisVendidos = fillListWithGlobalUniqueness(maisVendidos, [...tagVendidos, ...topProducts, ...newestProducts], limit, usedIds);
  novidades = fillListWithGlobalUniqueness(novidades, [...tagNovidades, ...newestProducts, ...topProducts], limit, usedIds);

  return { maisBuscados, maisVendidos, novidades };
}

export default function Home({
  showB2C,
}: {
  showB2C: boolean;
  storeV2: boolean;
  sections: HomeSection[];
  featured: HomeFeaturedSections;
}) {
  if (!showB2C) return <B2BLanding />;

  const canonical = buildCanonical('/');
  const ogImage = `${SITE.baseUrl}/images/emagrecimento/medvi/hero-main.webp`;

  return (
    <>
      <Head>
        <title>Saúde digital para a vida real · Me Joy</title>
        <meta name="description" content={ROOT_DESCRIPTION} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content="Saúde digital para a vida real · Me Joy" />
        <meta property="og:description" content={ROOT_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:site_name" content={SITE.name} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Saúde digital para a vida real · Me Joy" />
        <meta name="twitter:description" content={ROOT_DESCRIPTION} />
        <meta name="twitter:image" content={ogImage} />
      </Head>
      <MeJoyGreenHome />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const host = ctx.req?.headers?.host ?? '';
  const showB2C = !isRootB2BDomain(host);
  const storeV2 = isStoreV2Enabled();

  let sections: HomeSection[] = [];
  let featured: HomeFeaturedSections = { maisBuscados: [], maisVendidos: [], novidades: [] };

  if (storeV2) {
    try {
      sections = await getHomeSections();
      featured = await getFeaturedHomeSections(FEATURED_LIMIT);

      const applyCopy = (list: ProductCardData[]) =>
        isCopyV4Enabled()
          ? list.map((p) => {
              if (!p.sku) return p;
              const copy = getCopyV4BySku(p.sku);
              if (!copy?.shortBenefit && !copy?.hero_benefit) return p;
              return { ...p, shortBenefit: copy.shortBenefit || copy.hero_benefit || p.shortBenefit };
            })
          : list;

      sections = sections.map((sec) => ({ ...sec, products: applyCopy(sec.products) }));
      featured = {
        maisBuscados: applyCopy(featured.maisBuscados),
        maisVendidos: applyCopy(featured.maisVendidos),
        novidades: applyCopy(featured.novidades),
      };

      ({ sections, featured } = ensureUniqueHomeSubtitles(sections, featured));
    } catch {
      sections = [];
    }
  }

  return {
    props: {
      showB2C,
      storeV2,
      sections,
      featured,
    },
  };
};
