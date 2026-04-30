'use client';

import { cn } from '@/lib/utils';

const PIX_DISCOUNT = 0.1;

interface Assinatura6MUpsellProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  pricePartnerReais: number;
  pricePublicReais: number;
  isPartner?: boolean;
  colorClasses: { gradientCTA: string; text: string; bg600: string };
}

export function Assinatura6MUpsell({
  checked,
  onChange,
  pricePartnerReais,
  pricePublicReais,
  isPartner = false,
  colorClasses,
}: Assinatura6MUpsellProps) {
  const priceReais = isPartner ? pricePartnerReais : pricePublicReais;
  const pixReais = Math.round(priceReais * (1 - PIX_DISCOUNT) * 100) / 100;
  const parcela3 = Math.round(priceReais / 3 * 100) / 100;
  const parcela6 = Math.round(priceReais / 6 * 100) / 100;
  const parcela12 = Math.round(priceReais / 12 * 100) / 100;
  const format = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  return (
    <div
      className={cn(
        'mt-6 p-5 sm:p-6 rounded-xl border-2 transition-all cursor-pointer',
        checked
          ? `${colorClasses.bg600} border-white/30 bg-white/10`
          : 'bg-white/5 border-gray-200 hover:border-gray-300'
      )}
      onClick={() => onChange(!checked)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onChange(!checked)}
    >
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-1 w-5 h-5 rounded border-2"
        />
        <div className="flex-1">
          <div className="font-bold text-gray-900 text-base sm:text-lg mb-1">
            Assinar 6 meses (recomendado)
          </div>
          <p className="text-sm text-gray-600 mb-3">
            6 meses + especialista + nutri + psicóloga + check-up
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <span className="font-semibold text-gray-900">{format(priceReais)}</span>
            <span className="text-gray-600">PIX: {format(pixReais)} (-10%)</span>
            <span className="text-gray-600">3x {format(parcela3)} • 6x {format(parcela6)} • 12x {format(parcela12)} sem juros</span>
          </div>
        </div>
      </label>
    </div>
  );
}
