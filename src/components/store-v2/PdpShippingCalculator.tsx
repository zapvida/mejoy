'use client';

import { useState, useCallback } from 'react';
import { Truck } from 'lucide-react';

function formatPrice(cents: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(cents / 100);
}

interface PdpShippingCalculatorProps {
  subtotalCents: number;
  freeThresholdCents?: number;
  variant?: 'default' | 'compact';
}

export default function PdpShippingCalculator({
  subtotalCents,
  freeThresholdCents = 19000,
  variant = 'default',
}: PdpShippingCalculatorProps) {
  const [cep, setCep] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    shippingCents: number;
    shippingDays: number;
    region?: string;
    freeThresholdCents?: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = useCallback(async () => {
    const cepClean = cep.replace(/\D/g, '');
    if (cepClean.length !== 8) {
      setError('Informe um CEP válido com 8 dígitos.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/store-v2/checkout/calculate-shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cep: cepClean, subtotalCents }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error || 'Erro ao calcular frete.');
        setResult(null);
      } else {
        setResult({
          shippingCents: data.shippingCents ?? 2990,
          shippingDays: data.shippingDays ?? 10,
          region: data.region,
          freeThresholdCents: data.freeThresholdCents,
        });
      }
    } catch {
      setError('Erro ao calcular frete. Tente novamente.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, [cep, subtotalCents]);

  const handleCepChange = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 8);
    setCep(digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits);
    setResult(null);
    setError(null);
  };

  const isFree = result && result.shippingCents === 0;

  if (variant === 'compact') {
    return (
      <div className="space-y-2 min-w-0">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Truck className="w-4 h-4 text-gray-500 shrink-0" aria-hidden />
            <input
              type="text"
              inputMode="numeric"
              placeholder="00000-000"
              value={cep}
              onChange={(e) => handleCepChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && calculate()}
              className="pdp-shipping-input flex-1 min-w-[100px] px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-brand/20 focus:border-brand text-sm"
              maxLength={9}
              aria-label="CEP para frete"
            />
            <button
              type="button"
              onClick={calculate}
              disabled={loading || cep.replace(/\D/g, '').length < 8}
              className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '...' : 'Calcular'}
            </button>
          </div>
          <a href="https://buscacepinter.correios.com.br/app/endereco/index.php" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-brand transition-colors">
            Não sei meu CEP
          </a>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {result && !error && (
          <p className="text-sm text-gray-600">
            {isFree ? (
              <span className="text-emerald-700 font-medium">Frete grátis</span>
            ) : (
              <span className="font-medium text-gray-900">{formatPrice(result.shippingCents)}</span>
            )}
            {' · '}Entrega em até {result.shippingDays} dias úteis
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mt-3 p-3 rounded-lg border border-gray-200 bg-gray-50/50">
      <div className="flex items-center gap-1.5 mb-2">
        <Truck className="w-4 h-4 text-brand-600" aria-hidden />
        <h3 className="font-medium text-gray-900 text-sm">Calcular frete e prazo</h3>
      </div>
      <div className="flex gap-1.5">
        <input
          type="text"
          inputMode="numeric"
          placeholder="00000-000"
          value={cep}
          onChange={(e) => handleCepChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && calculate()}
          className="pdp-shipping-input flex-1 px-2.5 py-1.5 rounded-md border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-brand focus:border-brand text-xs"
          maxLength={9}
          aria-label="CEP para cálculo de frete"
        />
        <button
          type="button"
          onClick={calculate}
          disabled={loading || cep.replace(/\D/g, '').length < 8}
          className="px-3 py-1.5 rounded-md bg-brand text-white text-xs font-medium hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? '...' : 'Calcular'}
        </button>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
      {result && !error && (
        <div className="mt-2 p-2 rounded-md bg-white border border-gray-100">
          {isFree ? (
            <p className="text-xs font-medium text-green-700">
              🚚 Frete grátis! Até {result.shippingDays} dias para {result.region || 'sua região'}.
            </p>
          ) : (
            <p className="text-xs text-gray-700">
              <span className="font-semibold">{formatPrice(result.shippingCents)}</span>
              {' — '}
              Até {result.shippingDays} dias úteis.
            </p>
          )}
          {subtotalCents < freeThresholdCents && (
            <p className="text-[10px] text-gray-500 mt-0.5">
              Faltam {formatPrice(freeThresholdCents - subtotalCents)} para frete grátis.
            </p>
          )}
        </div>
      )}
      <p className="text-[10px] text-gray-500 mt-1.5">
        <a href="https://buscacepinter.correios.com.br/app/endereco/index.php" target="_blank" rel="noopener noreferrer" className="underline hover:text-brand">
          Não sei meu CEP
        </a>
      </p>
    </div>
  );
}
