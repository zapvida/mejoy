'use client';

function formatPrice(cents: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

interface CheckoutBannerProps {
  hasCep: boolean;
  freeThresholdCents?: number;
  region?: string;
  subtotalCents: number;
}

export default function CheckoutBanner({
  hasCep,
  freeThresholdCents = 19000,
  region = 'sua região',
  subtotalCents,
}: CheckoutBannerProps) {
  const remaining = Math.max(0, freeThresholdCents - subtotalCents);
  const percent = freeThresholdCents > 0 ? Math.min(100, (subtotalCents / freeThresholdCents) * 100) : 0;
  const isFree = remaining <= 0 && hasCep;

  if (!hasCep) {
    return (
      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
        <p className="text-emerald-800 text-sm font-medium">
          📦 Informe seu CEP para calcular o frete
        </p>
      </div>
    );
  }

  if (isFree) {
    return (
      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
        <p className="text-emerald-800 text-sm font-medium">
          🚚 Frete grátis! Pedidos acima de {formatPrice(freeThresholdCents)} para {region}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
      <div className="flex justify-between text-sm mb-2">
        <span className="text-emerald-800 font-medium">
          Faltam {formatPrice(remaining)} para frete grátis
        </span>
        <span className="text-emerald-600">{Math.round(percent)}%</span>
      </div>
      <div className="h-2 bg-emerald-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 rounded-full transition-all duration-300"
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={Math.round(percent)}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      <p className="text-xs text-emerald-700 mt-2">
        Frete grátis acima de {formatPrice(freeThresholdCents)} para {region}
      </p>
    </div>
  );
}
