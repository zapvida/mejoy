'use client';

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { getProductColorClasses } from '@/lib/zapfarm/color-utils';
import { getTriageUrl } from '@/lib/zapfarm/product-loader';
import type { ZapfarmProductConfig } from '@/config/zapfarm/products';
import { Stethoscope, ArrowRight } from 'lucide-react';

interface ProductPlansCardProps {
  product: ZapfarmProductConfig;
  pricesReais: { basico: number; completo: number; premium: number } | null;
  /** Se true, layout compacto para grid. Se false, layout expandido para LPAC. */
  compact?: boolean;
}

const formatPrice = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

export function ProductPlansCard({
  product,
  pricesReais,
  compact = false,
}: ProductPlansCardProps) {
  const colorClasses = getProductColorClasses(product.colors);
  const triageUrl = getTriageUrl(product.slug);

  if (!pricesReais || (pricesReais.basico === 0 && pricesReais.completo === 0 && pricesReais.premium === 0)) {
    return null;
  }

  const plans = [
    { id: 'basico', name: product.plans.basico.name, price: pricesReais.basico },
    { id: 'completo', name: product.plans.completo.name, price: pricesReais.completo, recommended: true },
    { id: 'premium', name: product.plans.premium.name, price: pricesReais.premium },
  ];

  return (
    <div
      className={cn(
        'rounded-2xl overflow-hidden bg-white shadow-lg border border-gray-100',
        compact ? 'p-5' : 'p-6 sm:p-8'
      )}
    >
      <div className={cn('flex gap-4', compact ? 'flex-col' : 'flex-col sm:flex-row sm:items-start')}>
        {/* Embalagem */}
        <div className={cn('flex-shrink-0', compact ? 'flex justify-center' : '')}>
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto sm:mx-0">
            <Image
              src={product.image}
              alt={product.displayName}
              width={112}
              height={112}
              className="object-contain drop-shadow-md"
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
            {product.displayName}
          </h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {product.shortDescription}
          </p>

          {/* 3 planos */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={cn(
                  'rounded-lg p-2 sm:p-3 text-center border',
                  plan.recommended
                    ? `${colorClasses.border500} ${colorClasses.bg}`
                    : 'border-gray-200 bg-gray-50/50'
                )}
              >
                {plan.recommended && (
                  <span className={cn(
                    'inline-block px-1.5 py-0.5 rounded text-[10px] font-bold text-white mb-1',
                    colorClasses.bg600
                  )}>
                    ✓
                  </span>
                )}
                <div className="text-[10px] sm:text-xs font-medium text-gray-600 truncate">
                  {plan.name.split('–')[0]?.trim() || plan.name}
                </div>
                <div className={cn('font-bold text-sm sm:text-base', colorClasses.text)}>
                  {formatPrice(plan.price)}
                </div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Link
              href={triageUrl}
              className={cn(
                'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 font-semibold text-sm text-white',
                colorClasses.gradientCTA,
                'hover:opacity-95 transition-opacity'
              )}
            >
              <Stethoscope className="w-4 h-4" />
              Fazer check-up digital
            </Link>
            <Link
              href={`/${product.slug}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 font-semibold text-sm border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Ver protocolo
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Relatório completo de saúde grátis
          </p>
        </div>
      </div>
    </div>
  );
}
