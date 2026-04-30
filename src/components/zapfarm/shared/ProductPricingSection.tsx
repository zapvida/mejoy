'use client';

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { getProductColorClasses } from '@/lib/zapfarm/color-utils';
import { getTriageUrl } from '@/lib/zapfarm/product-loader';
import type { ZapfarmProductConfig } from '@/config/zapfarm/products';
import { Stethoscope, ArrowRight, CreditCard } from 'lucide-react';

/** Preços Assinatura 6m (Sócio / Público) - alinhado ao checkout */
const ASSINATURA_6M_PUBLIC = 2942;

interface ProductPricingSectionProps {
  productConfig: ZapfarmProductConfig;
  pricesReais: { basico: number; completo: number; premium: number } | null;
}

export function ProductPricingSection({ productConfig, pricesReais }: ProductPricingSectionProps) {
  const colorClasses = getProductColorClasses(productConfig.colors);
  const triageUrl = getTriageUrl(productConfig.slug);

  if (!pricesReais || (pricesReais.basico === 0 && pricesReais.completo === 0 && pricesReais.premium === 0)) {
    return null;
  }

  const format = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  const plans = [
    { id: 'basico', name: productConfig.plans.basico.name, price: pricesReais.basico },
    { id: 'completo', name: productConfig.plans.completo.name, price: pricesReais.completo, recommended: true },
    { id: 'premium', name: productConfig.plans.premium.name, price: pricesReais.premium },
  ];

  const assinaturaPrice = ASSINATURA_6M_PUBLIC;
  const assinaturaPix = Math.round(assinaturaPrice * 0.9 * 100) / 100;

  return (
    <section className="py-12 sm:py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-2">
          Planos e preços
        </h2>
        <p className="text-gray-600 text-center mb-8">
          PIX com 10% de desconto • Parcelamento em até 12x sem juros
        </p>

        {/* Embalagem + 3 planos */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="flex justify-center lg:flex-shrink-0">
            <div className="relative w-32 h-32 sm:w-40 sm:h-40">
              <Image
                src={productConfig.image}
                alt={productConfig.displayName}
                width={160}
                height={160}
                className="object-contain drop-shadow-lg"
              />
            </div>
          </div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={cn(
                  'p-5 sm:p-6 rounded-xl border-2 bg-white text-center',
                  plan.recommended
                    ? `border-2 ${colorClasses.border500} shadow-lg`
                    : 'border-gray-200'
                )}
              >
                {plan.recommended && (
                  <span className={cn(
                    'inline-block px-3 py-1 rounded-full text-white text-xs font-bold mb-3',
                    colorClasses.bg600
                  )}>
                    Recomendado
                  </span>
                )}
                <div className="font-semibold text-gray-900 mb-2">{plan.name}</div>
                <div className={cn('font-bold text-xl sm:text-2xl mb-1', colorClasses.text)}>
                  {format(plan.price)}
                </div>
                <div className="text-xs text-gray-600">
                  PIX: {format(Math.round(plan.price * 0.9 * 100) / 100)} (-10%) • 12x {format(Math.round(plan.price / 12 * 100) / 100)} sem juros
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card Assinatura 6 meses */}
        <div
          className={cn(
            'mb-8 p-5 sm:p-6 rounded-xl border-2 bg-gradient-to-r',
            'from-teal-50 to-cyan-50 border-teal-200'
          )}
        >
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <div className="font-bold text-gray-900">Assinatura 6 meses</div>
                <p className="text-sm text-gray-600">
                  6 meses + especialista + nutri + psicóloga + check-up
                </p>
              </div>
            </div>
            <div className="flex-1 text-right">
              <span className="font-bold text-teal-700 text-lg">{format(assinaturaPrice)}</span>
              <span className="text-sm text-gray-600 ml-2">
                PIX: {format(assinaturaPix)} (-10%)
              </span>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href={triageUrl}
            className={cn(
              'inline-flex items-center gap-2 rounded-full px-8 py-4 font-bold text-center',
              'bg-gradient-to-r text-white shadow-lg hover:scale-105 transition-all',
              colorClasses.gradientCTA
            )}
          >
            <Stethoscope className="w-5 h-5" />
            Fazer check-up digital
          </Link>
          <Link
            href="/produtos"
            className="inline-flex items-center gap-2 rounded-full px-8 py-4 font-bold text-center border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
          >
            Ver produtos
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
        <p className="mt-4 text-center text-sm text-gray-500">
          Relatório completo de saúde grátis
        </p>
      </div>
    </section>
  );
}
