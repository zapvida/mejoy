'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Package, Heart, Moon, Scissors, Activity, Shield, Zap, Brain, Pill, Smile, ArrowRight } from 'lucide-react';
import { track } from '@/lib/analytics';
import { getAllProducts } from '@/lib/zapfarm/product-loader';
import type { ZapfarmProductConfig } from '@/config/zapfarm/products';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  emagrecimento: Activity,
  calvicie: Scissors,
  sono: Moon,
  ansiedade: Smile,
  intestino: Package,
  figado: Shield,
  'libido-masculina': Heart,
  menopausa: Brain,
  articulacoes: Pill,
  imunidade: Zap,
  tirzepatida: Activity,
};

export default function ProductsSection() {
  const products = getAllProducts();

  return (
    <section id="produtos" className="py-16 md:py-20 bg-surface/50 relative overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-ink mb-4 leading-tight text-balance">
            Produtos de saúde para viver mais
          </h2>
          <p className="text-xl text-ink-muted max-w-2xl mx-auto leading-relaxed">
            Protocolos com curadoria médica. Escolha o ideal para você.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {products.map((product: ZapfarmProductConfig, index: number) => {
            const Icon = ICON_MAP[product.slug] ?? Package;
            const gradient = `bg-gradient-to-br ${product.colors.gradient}`;
            return (
              <motion.div
                key={product.slug}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.5) }}
              >
                <Link
                  href={`/${product.slug}`}
                  onClick={() => track('product_card_click', { product: product.slug, section: 'products' })}
                  className="block group"
                >
                  <div className={`relative overflow-hidden rounded-2xl ${gradient} p-6 h-full min-h-[160px] flex flex-col justify-between shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] cursor-pointer`}>
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:bg-white/30 transition-colors">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2 drop-shadow-sm">
                        {product.displayName}
                      </h3>
                      <p className="text-sm text-white/90 leading-relaxed">
                        {product.shortDescription}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-white/90 group-hover:text-white transition-colors">
                      <span className="text-sm font-medium">Ver protocolo</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/produtos"
            onClick={() => track('cta_click', { id: 'products_section_cta', href: '/produtos', section: 'products' })}
            className="btn-gradient-brand focus-ring inline-flex items-center gap-2"
          >
            Ver todos os produtos
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/protocolos"
            onClick={() => track('cta_click', { id: 'products_checkup_cta', href: '/protocolos', section: 'products' })}
            className="text-sm font-medium text-ink-muted hover:text-brand transition-colors"
          >
            Ou faça seu check-up grátis →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

