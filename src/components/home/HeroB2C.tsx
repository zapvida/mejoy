'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Zap, Shield, TrendingUp } from 'lucide-react';
import { track } from '@/lib/analytics';
import LpacCard from '@/components/b2b/LpacCard';
import ProductsPreview from './ProductsPreview';

const stats = [
  { icon: Zap, value: '10+', label: 'protocolos', variant: 'indigo' as const },
  { icon: Shield, value: '2 min', label: 'check-up grátis', variant: 'cyan' as const },
  { icon: TrendingUp, value: '4.8', label: 'avaliação', variant: 'amber' as const },
];

export default function HeroB2C() {
  const handleCtaCheckup = () => track('hero_primary_cta_click', { id: 'cta_hero_checkup', section: 'hero' });
  const handleCtaProdutos = () => track('hero_secondary_cta_click', { id: 'cta_hero_produtos', section: 'hero' });

  return (
    <section id="hero" className="relative min-h-[auto] sm:min-h-[80vh] flex items-center overflow-hidden bg-gradient-to-br from-surface via-muted/50 to-surface lpac-aurora py-8 sm:py-10 md:py-14" aria-label="Bem-vindo à MeJoy">
      {/* BG decorativo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10" />
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute top-1/4 right-1/4 w-[300px] sm:w-[400px] md:w-[500px] h-[300px] sm:h-[400px] md:h-[500px] bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl"
          style={{ willChange: 'transform' }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-10 md:py-14 w-full z-10">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-center">
          {/* Texto */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full bg-[color:var(--brand-600)]/10 border border-[color:var(--brand-600)]/20 mb-4 sm:mb-6 flex-wrap justify-center lg:justify-start"
            >
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[color:var(--brand-600)] animate-pulse flex-shrink-0" />
              <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-[color:var(--brand-600)] leading-tight text-balance">
                Check-up grátis · Curadoria médica · Entrega em todo Brasil
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-extrabold tracking-tight text-ink mb-3 sm:mb-4 leading-[1.1] sm:leading-tight text-balance px-1"
              style={{ fontSize: 'var(--hero-h1)' }}
            >
              Cuide da sua saúde em casa com protocolos selecionados por médicos
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-ink-muted mt-2 sm:mt-3 max-w-2xl mx-auto lg:mx-0 leading-relaxed px-1 text-balance"
              style={{ fontSize: 'var(--hero-subtitle)' }}
            >
              Emagrecimento, sono, intestino, imunidade e mais. Check-up grátis em 2 min.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm sm:text-base md:text-lg font-semibold text-ink mt-2 sm:mt-3 max-w-2xl mx-auto lg:mx-0 px-1"
            >
              Pagamento seguro. Entrega em todo Brasil.
            </motion.p>

            {/* CTAs duplos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 px-1 flex-wrap"
            >
              <Link
                href="/protocolos"
                prefetch
                onClick={handleCtaCheckup}
                className="btn-gradient-brand focus-ring inline-flex items-center justify-center gap-2 text-xs sm:text-sm px-4 sm:px-6 py-2.5 sm:py-3 w-full sm:w-auto whitespace-nowrap"
                data-analytics="lpac_hero_cta_checkup"
                aria-label="Fazer check-up gratuito e descobrir seu protocolo"
              >
                Check-up grátis
                <span>→</span>
              </Link>
              <Link
                href="/produtos"
                prefetch
                onClick={handleCtaProdutos}
                className="btn-ghost focus-ring inline-flex items-center justify-center gap-2 text-xs sm:text-sm px-4 sm:px-6 py-2.5 sm:py-3 w-full sm:w-auto border-2 border-[color:var(--brand-600)]/30 hover:border-[color:var(--brand-600)]/60 hover:bg-[color:var(--brand-600)]/5 whitespace-nowrap"
                data-analytics="lpac_hero_cta_produtos"
                aria-label="Ver todos os produtos"
              >
                Ver produtos
              </Link>
            </motion.div>

            {/* MÉTRICAS — UM ÚNICO GRID (sem duplicação) */}
            <div className="mt-4 sm:mt-5 grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 px-1 min-w-0">
              {stats.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15 + i * 0.05 }}
                  >
                    <LpacCard variant={s.variant} size="stat" className="justify-center min-h-[90px] sm:min-h-[112px]">
                      <div className="text-center w-full">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 rounded-xl bg-white/30 backdrop-blur-sm flex items-center justify-center mx-auto mb-1.5 sm:mb-2 shadow-xl border border-white/20">
                          <Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                        </div>
                        <div className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white leading-tight mb-0.5 sm:mb-1 drop-shadow-sm">
                          {s.value}
                        </div>
                        <div className="text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs text-white/90 font-medium drop-shadow-sm leading-tight">
                          {s.label}
                        </div>
                      </div>
                    </LpacCard>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Preview de Produtos - E-commerce */}
          <ProductsPreview />
        </div>
      </div>
    </section>
  );
}
