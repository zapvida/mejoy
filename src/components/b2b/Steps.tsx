'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle2, Palette, Zap, Rocket, ArrowRight } from 'lucide-react';
import { track } from '@/lib/analytics';
import LpacCard from './LpacCard';

const steps = [
  {
    number: '1',
    icon: CheckCircle2,
    title: 'Assine',
    desc: 'Planos flexíveis. Ativação rápida.',
    detail: 'Comece pequeno, sem risco; evolua em dias.',
  },
  {
    number: '2',
    icon: Palette,
    title: 'Branding',
    desc: 'Logo, cores, domínio e CTAs.',
    detail: 'Personalize em minutos, sem equipe técnica.',
  },
  {
    number: '3',
    icon: Zap,
    title: 'Ative triagens',
    desc: 'Ex.: GI com IA — case de entrada.',
    detail: 'Escolha as triagens e configure campanhas.',
  },
  {
    number: '4',
    icon: Rocket,
    title: 'Rode campanhas',
    desc: 'Link curto, QR code, embed e UTMs.',
    detail: 'Mensure conversão e otimize em tempo real.',
  },
];

const variants: Array<'blue' | 'violet' | 'amber' | 'emerald'> = ['blue', 'violet', 'amber', 'emerald'];

export default function Steps() {
  return (
    <section id="como-funciona" className="py-20 md:py-28 bg-muted/30 relative overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-ink mb-4 leading-tight text-balance">
            Do zero ao go-live em 4 passos
          </h2>
          <p className="text-xl text-ink-muted max-w-2xl mx-auto leading-relaxed">
            Simples, rápido e sem complicação. Comece hoje e ative em minutos.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="h-full"
              >
                <LpacCard variant={variants[index % variants.length]} size="panel" className="relative h-full">
                  {/* ✅ Número menor e no canto superior direito */}
                  <div className="absolute top-3 right-3 bg-gradient-to-br from-[color:var(--brand-600)] to-[color:var(--brand-700)] text-white text-sm font-bold w-8 h-8 rounded-full shadow-lg z-20 flex items-center justify-center ring-2 ring-white/50">
                    {step.number}
                  </div>

                  <div className="w-full mt-8">
                    <div className="w-12 h-12 rounded-xl bg-white/30 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:bg-white/40 transition-colors shadow-md border border-white/20">
                      <Icon className="w-6 h-6 text-white drop-shadow-sm" />
                    </div>
                    <h3 className="font-bold text-lg text-white mb-2 drop-shadow-sm">
                      {step.title}
                    </h3>
                    <p className="text-white/90 text-sm mb-2 leading-relaxed font-medium">{step.desc}</p>
                    <p className="text-white/80 text-xs italic leading-relaxed">{step.detail}</p>
                  </div>
                </LpacCard>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Link
            href="/b2b/assinar"
            onClick={() => track('cta_click', { id: 'steps_cta', href: '/b2b/assinar', section: 'steps' })}
            className="btn-gradient-brand focus-ring inline-flex items-center gap-2"
            data-analytics="lpac_steps_cta"
          >
            Ver planos e assinar
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
