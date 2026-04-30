'use client';

import { cn } from '@/lib/utils';
import type { VariantKey } from '@/types/zapfarm';
import { getVariantInfo } from '@/config/zapfarm/product-variants';

interface VariantSelectorProps {
  productSlug: string;
  selected: VariantKey;
   
  onSelect: (variant: VariantKey) => void;
  colorClasses: { border500: string; gradientBg: string; text: string; bg600: string };
}

export function VariantSelector({
  productSlug,
  selected,
  onSelect,
  colorClasses,
}: VariantSelectorProps) {
  const info = getVariantInfo(productSlug);
  if (!info) return null;

  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-700 mb-3">Fórmula</label>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onSelect('core')}
          className={cn(
            'p-4 rounded-xl border-2 text-left transition-all',
            selected === 'core'
              ? `${colorClasses.border500} bg-gradient-to-br ${colorClasses.gradientBg} shadow-md`
              : 'border-gray-200 hover:border-gray-300 bg-white'
          )}
        >
          <div className="font-bold text-gray-900">{info.core.displayName}</div>
          {info.core.description && (
            <div className="text-xs text-gray-600 mt-1">{info.core.description}</div>
          )}
        </button>
        <button
          type="button"
          onClick={() => onSelect('pro')}
          className={cn(
            'p-4 rounded-xl border-2 text-left transition-all relative',
            selected === 'pro'
              ? `${colorClasses.border500} bg-gradient-to-br ${colorClasses.gradientBg} shadow-md`
              : 'border-gray-200 hover:border-gray-300 bg-white'
          )}
        >
          <span
            className={cn(
              'absolute top-2 right-2 px-2 py-0.5 rounded text-xs font-bold text-white',
              colorClasses.bg600
            )}
          >
            Recomendado
          </span>
          <div className="font-bold text-gray-900">{info.pro.displayName}</div>
          {info.pro.description && (
            <div className="text-xs text-gray-600 mt-1">{info.pro.description}</div>
          )}
        </button>
      </div>
    </div>
  );
}
