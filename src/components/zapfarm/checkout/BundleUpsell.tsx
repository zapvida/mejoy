'use client';

import { cn } from '@/lib/utils';
import { getBundleConfig } from '@/config/zapfarm/bundles';

interface BundleUpsellProps {
  currentProductSlug: string;
  bundlePriceReais: number | null;
   
  onSelect: (bundleId: string) => void;
  colorClasses: { gradientCTA: string };
  basePath?: string;
}

const BUNDLE_SUGGESTIONS: Record<string, string[]> = {
  sono: ['sono-ansiedade'],
  ansiedade: ['sono-ansiedade'],
  intestino: ['intestino-imunidade'],
  imunidade: ['intestino-imunidade'],
};

export function BundleUpsell({
  currentProductSlug,
  bundlePriceReais,
  onSelect,
  colorClasses,
  basePath = '',
}: BundleUpsellProps) {
  const bundleIds = BUNDLE_SUGGESTIONS[currentProductSlug];
  if (!bundleIds || bundleIds.length === 0) return null;

  const bundleId = bundleIds[0]!;
  const bundle = getBundleConfig(bundleId);
  if (!bundle) return null;

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
      <div className="text-sm font-semibold text-gray-700 mb-2">💡 Compre junto e economize</div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="font-bold text-gray-900">{bundle.name}</div>
          {bundle.description && (
            <div className="text-xs text-gray-600">{bundle.description}</div>
          )}
        </div>
        <button
          type="button"
          onClick={() => {
            onSelect(bundleId);
            if (basePath) {
              const url = new URL(basePath, window.location.origin);
              url.searchParams.set('bundle', bundleId);
              window.location.href = url.toString();
            }
          }}
          className={cn(
            'px-4 py-2 rounded-lg font-bold text-white text-sm whitespace-nowrap',
            `bg-gradient-to-r ${colorClasses.gradientCTA}`
          )}
        >
          {bundlePriceReais != null
            ? formatCurrency(bundlePriceReais)
            : 'Ver preço'}
        </button>
      </div>
    </div>
  );
}
