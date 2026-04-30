'use client';

interface SubscriptionToggleProps {
  checked: boolean;
   
  onChange: (isChecked: boolean) => void;
  priceReais: number;
  colorClasses?: { gradientCTA: string; text: string };
}

export function SubscriptionToggle({
  checked,
  onChange,
  priceReais,
}: SubscriptionToggleProps) {
  const discountPrice = Math.round(priceReais * 0.9 * 100) / 100;
  const format = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  return (
    <div className="mt-4 p-4 bg-green-50 rounded-xl border-2 border-green-200">
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-1 w-4 h-4 rounded border-green-300"
        />
        <div>
          <span className="font-semibold text-gray-900">Assinatura -10%</span>
          <span className="text-sm text-gray-600 block">
            Mantenha consistência e pague {format(discountPrice)}/mês (em vez de {format(priceReais)})
          </span>
        </div>
      </label>
    </div>
  );
}
