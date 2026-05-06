'use client';

import { useState, useMemo } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Search, Filter, ArrowRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import FooterB2C from '@/components/home/FooterB2C';
import { getAllProducts } from '@/lib/zapfarm/product-loader';
import type { ZapfarmProductConfig } from '@/config/zapfarm/products';
import { track } from '@/lib/analytics';
import Seo from '@/components/Seo';
import { ProductPlansCard } from '@/components/zapfarm/shared/ProductPlansCard';

function getPricesFromProduct(product: ZapfarmProductConfig) {
  return {
    basico: product.plans.basico.unitPrice ?? 0,
    completo: product.plans.completo.unitPrice ?? 0,
    premium: product.plans.premium.unitPrice ?? 0,
  };
}

export default function ProdutosPageZapfarm() {
  const products = useMemo(() => getAllProducts(), []);
  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).sort(),
    [products]
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchSearch =
        !searchTerm ||
        [
          product.displayName,
          product.commercialName,
          product.shortDescription,
          product.category,
        ]
          .join(' ')
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchCategory =
        !selectedCategory || product.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  return (
    <>
      <Seo
        title="Produtos de Saúde para Viver Mais | Protocolos com Curadoria Médica | MeJoy"
        description="Compre protocolos de saúde prontos: emagrecimento, sono, intestino, imunidade, calvície e mais. Curadoria médica. Check-up gratuito. Entrega em todo Brasil."
        path="/produtos"
        keywords={[
          'produtos de saúde',
          'protocolos médicos',
          'emagrecimento',
          'sono',
          'intestino',
          'imunidade',
          'curadoria médica',
          'check-up gratuito',
        ]}
      />
      <Head>
        <link rel="icon" href="/logosmejoy/faviconmejoy.png" />
      </Head>

      <main
        data-lpac="vibrant"
        className="min-h-screen bg-bg pb-safe"
        role="main"
        aria-label="Catálogo de produtos MeJoy"
      >
        <Navbar />

        {/* Hero */}
        <section className="relative pt-24 pb-12 sm:pt-28 sm:pb-16 overflow-hidden bg-gradient-to-br from-surface via-muted/30 to-surface">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 right-0 w-96 h-96 bg-[color:var(--brand-600)]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-[color:var(--brand-600)]/5 rounded-full blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-ink mb-4 leading-tight">
                Produtos de saúde para viver mais
              </h1>
              <p className="text-lg sm:text-xl text-ink-muted leading-relaxed">
                Protocolos com curadoria médica. Escolha o ideal para você.
              </p>
              <Link
                href="/formulas"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
              >
                Transparência: veja componentes, doses e custos das 33 fórmulas
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Filtros e busca */}
        <section className="sticky top-16 z-30 bg-bg/95 backdrop-blur-md border-b border-border py-4">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-muted" />
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-surface text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-600)]/30 focus:border-[color:var(--brand-600)]"
                  aria-label="Buscar produtos"
                />
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                <Filter className="w-5 h-5 text-ink-muted flex-shrink-0" />
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    !selectedCategory
                      ? 'bg-[color:var(--brand-600)] text-white'
                      : 'bg-muted/50 text-ink-muted hover:bg-muted'
                  }`}
                >
                  Todos
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === cat
                        ? 'bg-[color:var(--brand-600)] text-white'
                        : 'bg-muted/50 text-ink-muted hover:bg-muted'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Grid de produtos */}
        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {filteredProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <p className="text-ink-muted text-lg">
                  Nenhum produto encontrado. Tente outra busca ou categoria.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory(null);
                  }}
                  className="mt-4 text-[color:var(--brand-600)] font-semibold hover:underline"
                >
                  Limpar filtros
                </button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product, index) => {
                    const pricesReais = getPricesFromProduct(product);
                    return (
                      <motion.div
                        key={product.slug}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, delay: index * 0.03 }}
                        onClick={() =>
                          track('produtos_page_cta', {
                            product: product.slug,
                            action: 'view_card',
                          })
                        }
                      >
                        <ProductPlansCard
                          product={product}
                          pricesReais={pricesReais}
                          compact
                        />
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </section>

        {/* CTA Check-up */}
        <section className="py-12 md:py-16 bg-gradient-to-br from-[color:var(--brand-600)]/10 to-transparent">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl bg-gradient-to-br from-[color:var(--brand-600)] to-[color:var(--brand-700)] p-8 md:p-10 text-center"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                Não sabe por onde começar?
              </h2>
              <p className="text-white/90 max-w-xl mx-auto mb-6">
                Faça seu check-up digital gratuito em 2 minutos e descubra o
                protocolo ideal para você.
              </p>
              <Link
                href="/protocolos"
                prefetch
                onClick={() =>
                  track('produtos_page_checkup_cta', { section: 'bottom' })
                }
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-[color:var(--brand-700)] font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                aria-label="Fazer check-up gratuito"
              >
                Fazer meu check-up gratuito
                <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="mt-4 text-sm text-white/80">
                Relatório completo de saúde grátis
              </p>
            </motion.div>
          </div>
        </section>

        <FooterB2C />
      </main>
    </>
  );
}
