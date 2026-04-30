'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShoppingBag, MessageSquare, CreditCard, Package, ArrowRight } from 'lucide-react';
import { track } from '@/lib/analytics';
import LpacCard from '@/components/b2b/LpacCard';

const steps = [
  {
    number: '1',
    icon: ShoppingBag,
    title: 'Escolha o que quer cuidar',
    desc: 'Emagrecimento, sono, cabelos, intestino, fígado, imunidade e mais.',
    detail: '',
  },
  {
    number: '2',
    icon: MessageSquare,
    title: 'Check-up rápido',
    desc: 'Poucas perguntas. Relatório personalizado em minutos.',
    detail: '',
  },
  {
    number: '3',
    icon: CreditCard,
    title: 'Compra segura',
    desc: 'Cartão, PIX ou parcelado. Checkout protegido.',
    detail: '',
  },
  {
    number: '4',
    icon: Package,
    title: 'Receba em casa',
    desc: 'Produtos + instruções. Suporte por WhatsApp.',
    detail: '',
  },
];

const variants: Array<'amber' | 'violet' | 'blue' | 'emerald'> = ['amber', 'violet', 'blue', 'emerald'];

export default function StepsB2C() {
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
            Como funciona
          </h2>
          <p className="text-xl text-ink-muted max-w-2xl mx-auto leading-relaxed">
            4 passos. Simples e seguro.
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
                    {step.detail && (
                      <p className="text-white/80 text-xs italic leading-relaxed">{step.detail}</p>
                    )}
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
            href="/protocolos"
            onClick={() => track('cta_click', { id: 'steps_cta', href: '/protocolos', section: 'steps' })}
            className="btn-gradient-brand focus-ring inline-flex items-center gap-2"
            data-analytics="lpac_steps_cta"
          >
            Ver protocolos de saúde
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

