import Link from 'next/link';
import { ArrowRight, Grid3X3 } from 'lucide-react';
import StorefrontHeader from './StorefrontHeader';
import StorefrontFooter from './StorefrontFooter';
import TrustBar from './TrustBar';
import ProductCard from './ProductCard';
import Seo from '@/components/Seo';
import type { ProductCardData } from '@/lib/store-v2/catalog';

interface Section {
  objectiveSlug: string;
  objectiveName: string;
  products: ProductCardData[];
}

interface ProdutosCatalogProps {
  sections: Section[];
}

export default function ProdutosCatalog({ sections }: ProdutosCatalogProps) {
  const totalProducts = sections.reduce((sum, s) => sum + s.products.length, 0);

  if (sections.length === 0) {
    return (
      <>
        <Seo
          title="Todos os produtos | Me Joy"
          description="Fórmulas manipuladas por objetivo. Curadoria médica e entrega em todo o Brasil."
          path="/produtos"
        />
        <StorefrontHeader />
        <main className="min-h-screen">
          <TrustBar />
          <section className="py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Todos os produtos</h1>
              <p className="text-gray-500">Catálogo em construção. Em breve, fórmulas para você.</p>
            </div>
          </section>
          <StorefrontFooter />
        </main>
      </>
    );
  }

  return (
    <>
      <Seo
        title="Todos os produtos | Me Joy"
        description="Fórmulas manipuladas por objetivo: sono, saúde, cabelo, emagrecimento e mais. Curadoria médica e entrega em todo o Brasil."
        path="/produtos"
        keywords={[
          'fórmulas manipuladas',
          'suplementos',
          'sono',
          'saúde',
          'cabelo',
          'emagrecimento',
          'intestino',
          'Me Joy',
        ]}
      />
      <StorefrontHeader />
      <main className="min-h-screen">
        <TrustBar />

        {/* Hero */}
        <section className="py-10 md:py-14 bg-gradient-to-b from-white via-orange-50/30 to-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-brand transition-colors">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900 font-medium">Todos os produtos</span>
            </nav>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                  Todos os produtos
                </h1>
                <p className="mt-2 text-gray-600">
                  {totalProducts} fórmulas organizadas por objetivo. Encontre o ideal para você.
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Grid3X3 className="w-5 h-5 text-brand" />
                <span>Ordenação A–Z por nicho</span>
              </div>
            </div>
          </div>
        </section>

        {/* Navegação por nichos */}
        <section className="sticky top-16 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-100 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
              {sections.map((s) => (
                <a
                  key={s.objectiveSlug}
                  href={`#niche-${s.objectiveSlug}`}
                  className="shrink-0 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-brand hover:bg-orange-50 transition-colors whitespace-nowrap"
                >
                  {s.objectiveName}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Seções por nicho */}
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            {sections.map((section) => (
              <article
                key={section.objectiveSlug}
                id={`niche-${section.objectiveSlug}`}
                className="scroll-mt-24"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {section.objectiveName}
                  </h2>
                  <Link
                    href={`/c/${section.objectiveSlug}`}
                    className="inline-flex items-center gap-2 text-brand font-medium hover:text-brand-600 transition-colors text-sm"
                  >
                    Ver todos em {section.objectiveName}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {section.products.map((p) => (
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
              </article>
            ))}
          </div>
        </section>

        <StorefrontFooter />
      </main>
    </>
  );
}
