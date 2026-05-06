import Head from 'next/head';
import Link from 'next/link';
import { isStoreV2Enabled, isCopyV2PilotEnabled, isCopyV4Enabled } from '@/lib/flags';
import { getProductsByObjective } from '@/lib/store-v2/catalog';
import { getCopyV2BySku, getCopyV4BySku, isSonoPilotSku } from '@/lib/store-v2/copy-v2';
import StorefrontHeader from '@/components/store-v2/StorefrontHeader';
import ProductCard from '@/components/store-v2/ProductCard';
import TrustBar from '@/components/store-v2/TrustBar';
import StorefrontFooter from '@/components/store-v2/StorefrontFooter';
import Seo from '@/components/Seo';
import { slugToObjective, OBJECTIVES } from '@/lib/store-v2/slugs';

interface Props {
  products: Awaited<ReturnType<typeof getProductsByObjective>>;
  objetivo: string;
  objectiveName: string;
}

export default function CategoryPage({ products, objetivo, objectiveName }: Props) {
  return (
    <>
      <Seo
        title={`${objectiveName} | MeJoy`}
        description={`Fórmulas manipuladas para ${objectiveName}. Curadoria médica e entrega em todo Brasil.`}
        path={`/c/${objetivo}`}
      />
      <Head>
        <link rel="canonical" href={`https://www.mejoy.com.br/c/${objetivo}`} />
      </Head>
      <StorefrontHeader />
      <main className="min-h-screen">
        <TrustBar />
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="text-sm text-gray-500 mb-6">
              <Link href="/" className="hover:text-brand">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900">{objectiveName}</span>
            </nav>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">{objectiveName}</h1>
            {products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {products.map((p) => (
                  <ProductCard
                    key={p.id}
                    slug={p.slug}
                    name={p.name}
                    shortName={p.shortName}
                    shortBenefit={p.shortBenefit}
                    priceCents={p.priceCents}
                    compareAtCents={p.compareAtCents}
                    image={p.image}
                    badges={p.badges}
                    rating={p.rating}
                    formDisplay={p.formDisplay}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Nenhum produto encontrado para esta categoria.</p>
            )}
          </div>
        </section>
        <StorefrontFooter />
      </main>
    </>
  );
}

export const getServerSideProps = async (ctx: { params?: { objetivo?: string }; res: { writeHead: (a: number, b: { Location: string }) => void; end: () => void } }) => {
  if (!isStoreV2Enabled()) {
    return { redirect: { destination: '/', permanent: false } };
  }

  const objetivo = ctx.params?.objetivo ?? '';
  const objectiveName = slugToObjective(objetivo);
  const validSlugs = OBJECTIVES.map((o) => o.slug);
  if (!validSlugs.includes(objetivo as typeof validSlugs[number])) {
    return { notFound: true };
  }

  let products: Awaited<ReturnType<typeof getProductsByObjective>> = [];
  try {
    products = await getProductsByObjective(objetivo);
  } catch {
    products = [];
  }

  const useCopy = isCopyV4Enabled() || (objetivo === 'sono' && isCopyV2PilotEnabled());
  if (useCopy) {
    products = products.map((p) => {
      if (!p.sku) return p;
      const copy = isCopyV4Enabled() ? getCopyV4BySku(p.sku) : isSonoPilotSku(p.sku) ? getCopyV2BySku(p.sku) : null;
      if (!copy) return p;
      return { ...p, shortBenefit: copy.shortBenefit || copy.hero_benefit || p.shortBenefit };
    });
  }

  return {
    props: {
      products,
      objetivo,
      objectiveName,
    },
  };
};
