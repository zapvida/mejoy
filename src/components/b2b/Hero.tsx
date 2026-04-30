'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Zap, Shield, TrendingUp } from 'lucide-react';
import { track } from '@/lib/analytics';
import LpacCard from './LpacCard';

const stats = [
  { icon: Zap, value: '4 min', label: 'Ativação', variant: 'indigo' as const },
  { icon: Shield, value: '100+', label: 'Clínicas', variant: 'cyan' as const },
  { icon: TrendingUp, value: '+37%', label: 'Conversão', variant: 'amber' as const },
];

export default function Hero() {
  const handleCta = () => track('hero_primary_cta_click', { id: 'cta_hero_personalizar', section: 'hero' });
  const handleCtaSecondary = () => track('hero_secondary_cta_click', { id: 'cta_hero_exemplos', section: 'hero' });

  return (
    <section id="hero" className="relative min-h-[80vh] flex items-center overflow-hidden bg-gradient-to-br from-surface via-muted/50 to-surface lpac-aurora">
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
          className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl"
          style={{ willChange: 'transform' }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-14 pb-6 w-full z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Texto */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[color:var(--brand-600)]/10 border border-[color:var(--brand-600)]/20 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-[color:var(--brand-600)] animate-pulse" />
              <span className="text-sm font-semibold text-[color:var(--brand-600)]">Ativação em minutos · Sem equipe técnica</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-ink mb-4 leading-tight text-balance"
            >
              Relatórios de saúde personalizados para cada pessoa
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-lg md:text-xl text-ink-muted mt-3 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              Triagens inteligentes que geram um PDF completo com a <strong>sua marca</strong> — prontos para enviar por WhatsApp ou e-mail, reaquecer leads e aumentar conversão.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-base md:text-lg font-semibold text-ink mt-2 max-w-2xl mx-auto lg:mx-0"
            >
              Ativação em minutos. Sem equipe técnica.
            </motion.p>

            {/* CTAs duplos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex flex-col sm:flex-row items-center gap-3"
            >
              <Link
                href="/b2b/configurar"
                onClick={handleCta}
                className="btn-gradient-brand focus-ring inline-flex items-center gap-2"
                data-analytics="lpac_hero_cta"
              >
                Personalizar grátis
                <span>→</span>
              </Link>
              <Link
                href="#cases"
                onClick={handleCtaSecondary}
                className="btn-ghost focus-ring inline-flex items-center gap-2"
                data-analytics="lpac_hero_cta_secondary"
              >
                Ver exemplos
              </Link>
            </motion.div>

            {/* MÉTRICAS — UM ÚNICO GRID (sem duplicação) */}
            <div className="mt-5 grid grid-cols-3 gap-3 sm:gap-4">
              {stats.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15 + i * 0.05 }}
                  >
                    <LpacCard variant={s.variant} size="stat" className="justify-center">
                      <div className="text-center w-full">
                        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/30 backdrop-blur-sm flex items-center justify-center mx-auto mb-2 shadow-xl border border-white/20">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-2xl md:text-3xl font-bold text-white leading-tight mb-1 drop-shadow-sm">
                          {s.value}
                        </div>
                        <div className="text-[11px] sm:text-xs text-white/90 font-medium drop-shadow-sm">
                          {s.label}
                        </div>
                      </div>
                    </LpacCard>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Preview - reduzido em 25% (75% do tamanho original) */}
          <div className="hidden md:block relative flex justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-3xl shadow-2xl ring-1 ring-[color:var(--border)]/60 bg-white p-2"
              style={{ width: '75%', maxWidth: '720px' }}
            >
              <Image
                src="/relatorioaistotele.png"
                alt="Exemplo de relatório"
                width={720}
                height={480}
                priority
                className="rounded-2xl h-auto w-full"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
