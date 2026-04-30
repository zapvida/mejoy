'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Stethoscope, Clock, Sparkles, ArrowRight } from 'lucide-react';
import { track } from '@/lib/analytics';

export default function CheckupDigitalSection() {
  const handleCta = () => track('checkup_section_cta_click', { section: 'checkup_digital' });

  return (
    <section id="checkup-digital" className="py-12 md:py-16 bg-gradient-to-br from-[color:var(--brand-600)]/5 via-transparent to-[color:var(--brand-600)]/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[color:var(--brand-600)] to-[color:var(--brand-700)] p-6 sm:p-8 md:p-10 shadow-xl border border-[color:var(--brand-600)]/20"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm mb-4">
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-sm font-semibold text-white">Grátis e rápido</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight text-balance">
                Check-up digital gratuito
              </h2>
              <p className="text-white/90 text-sm sm:text-base md:text-lg max-w-xl mx-auto lg:mx-0 mb-4 text-balance">
                2 min. Descubra qual protocolo combina com você. Sem compromisso.
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-white/80 text-sm">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  2 minutos
                </span>
                <span className="flex items-center gap-1.5">
                  <Stethoscope className="w-4 h-4" />
                  Curadoria médica
                </span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Link
                href="/protocolos"
                prefetch
                onClick={handleCta}
                className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-white text-[color:var(--brand-700)] font-bold text-sm sm:text-base shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all focus-ring whitespace-nowrap"
                data-analytics="checkup_digital_cta"
                aria-label="Fazer check-up digital gratuito"
              >
                Fazer check-up
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
