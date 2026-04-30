'use client';

/**
 * Progress bar "Faltam R$X para frete grátis".
 * - Sem CEP: copy "a partir de R$190 (varia por região)"
 * - Com CEP: threshold real da região
 */

interface CartProgressBarProps {
  subtotalCents: number;
  freeThresholdCents: number;
  region?: string;
  hasCep?: boolean;
}

function formatPrice(cents: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export default function CartProgressBar({
  subtotalCents,
  freeThresholdCents,
  region,
  hasCep = false,
}: CartProgressBarProps) {
  const remaining = Math.max(0, freeThresholdCents - subtotalCents);
  const percent = freeThresholdCents > 0 ? Math.min(100, (subtotalCents / freeThresholdCents) * 100) : 0;
  const isFree = remaining <= 0;

  return (
    <div
      data-testid="cart-progress"
      className="bg-brand-50 rounded-lg p-4 border border-brand-100"
    >
      {isFree ? (
        <div className="flex items-center gap-2">
          <span className="text-brand-700 font-medium">✓ Frete grátis!</span>
          <span className="text-sm text-brand-600">
            Seu pedido atingiu o valor mínimo para sua região.
          </span>
        </div>
      ) : (
        <>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">
              Faltam {formatPrice(remaining)} para frete grátis
            </span>
            <span className="text-gray-500">{Math.round(percent)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand rounded-full transition-all duration-300"
              style={{ width: `${percent}%` }}
              role="progressbar"
              aria-valuenow={Math.round(percent)}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {hasCep && region
              ? `Frete grátis acima de ${formatPrice(freeThresholdCents)} para ${region}`
              : 'Frete grátis a partir de R$ 190 (varia por região)'}
          </p>
        </>
      )}
    </div>
  );
}
