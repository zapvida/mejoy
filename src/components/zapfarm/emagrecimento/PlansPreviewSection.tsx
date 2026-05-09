'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { RefinedCard } from '@/components/ui/RefinedCard';
import { buildEmagrecimentoCheckoutPlanCatalog } from '@/lib/emagrecimento/checkout-plan-catalog';
import { CreditCard, Stethoscope, ArrowRight } from 'lucide-react';

const ASSINATURA_6M_PUBLIC = 2942;

export function PlansPreviewSection() {
  const plans = buildEmagrecimentoCheckoutPlanCatalog(
    'alternativas_clinicas',
    'rybelsus',
  ).planCatalog.map((plan) => ({
    name: plan.title,
    description: plan.subtitle,
    badge: plan.badge,
    highlight: plan.highlight || plan.recommended,
    priceMain: plan.priceMain,
    priceDetail: plan.priceDetail,
    bullets: plan.bullets,
  }));

  const format = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  const assinaturaPix = Math.round(ASSINATURA_6M_PUBLIC * 0.9 * 100) / 100;

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-zinc-50 to-brand-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 tracking-tight">
              Planos pensados pra você não ficar sozinho(a)
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Escolha o plano que melhor se adapta à sua necessidade
            </p>
          </div>

          {/* Embalagem + 3 planos */}
          <div className="flex flex-col lg:flex-row gap-6 mb-8">
            <div className="flex justify-center lg:flex-shrink-0">
              <div className="relative w-32 h-32 sm:w-40 sm:h-40">
                <Image
                  src="/products/metaboslim.svg"
                  alt="Emagrecimento"
                  width={160}
                  height={160}
                  className="object-contain drop-shadow-lg"
                />
              </div>
            </div>
            <motion.div
              className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.3 }}
              >
                <RefinedCard
                  padding="lg"
                  rounded="xl"
                  variant={plan.highlight ? 'elevated' : 'default'}
                  className={`${
                    plan.highlight
                      ? 'border-brand-400 shadow-lg scale-105'
                      : ''
                  }`}
                  hover
                >
                {plan.badge && (
                  <div className="inline-block px-3 py-1 rounded-full bg-brand-500 text-white text-xs sm:text-sm font-semibold mb-4">
                    {plan.badge}
                  </div>
                )}
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-2">
                  {plan.name}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                  {plan.description}
                </p>
                <div className="mb-4">
                  <div className="text-brand-600 font-bold text-xl sm:text-2xl mb-1">
                    {plan.priceMain}
                  </div>
                  {plan.priceDetail && (
                    <div className="text-xs text-muted-foreground leading-relaxed">
                      {plan.priceDetail}
                    </div>
                  )}
                </div>
                {plan.bullets && plan.bullets.length > 0 && (
                  <ul className="space-y-2 mb-4">
                    {plan.bullets.slice(0, 3).map((bullet, idx) => (
                      <li key={idx} className="text-xs sm:text-sm text-foreground flex items-start gap-2">
                        <span className="text-brand-600 flex-shrink-0 mt-0.5">✓</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
                </RefinedCard>
              </motion.div>
            ))}
          </motion.div>
          </div>

          {/* Card Assinatura 6 meses */}
          <div className="mb-8 p-5 sm:p-6 rounded-xl border-2 bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-200">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">Assinatura 6 meses</div>
                  <p className="text-sm text-gray-600">
                    6 meses + especialista + nutri + psicóloga + acompanhamento
                  </p>
                </div>
              </div>
              <div className="flex-1 text-right">
                <span className="font-bold text-teal-700 text-lg">{format(ASSINATURA_6M_PUBLIC)}</span>
                <span className="text-sm text-gray-600 ml-2">
                  PIX: {format(assinaturaPix)} (-10%)
                </span>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/triagem/emagrecimento"
              className="inline-flex items-center gap-2 rounded-full px-8 py-4 font-bold text-white bg-gradient-to-r from-brand-600 to-brand-700 hover:opacity-95 shadow-lg transition-all"
            >
              <Stethoscope className="w-5 h-5" />
              Fazer triagem digital
            </Link>
            <Link
              href="/produtos"
              className="inline-flex items-center gap-2 rounded-full px-8 py-4 font-bold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
            >
              Ver produtos
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <p className="mt-4 text-center text-sm text-gray-500">
            Relatório inicial com próximos passos
          </p>
        </div>
      </div>
    </section>
  );
}
