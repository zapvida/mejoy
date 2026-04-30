'use client';

interface PdpCashbackBadgeProps {
  percent?: number;
  minAmountCents?: number;
}

const DEFAULT_PERCENT = 5;
const DEFAULT_MIN_CENTS = 10000; // R$ 100

export default function PdpCashbackBadge({ percent = DEFAULT_PERCENT, minAmountCents = DEFAULT_MIN_CENTS }: PdpCashbackBadgeProps) {
  const minReais = minAmountCents / 100;

  return (
    <p className="text-sm text-emerald-700 font-medium">
      Ganhe {percent}% de cashback em compras acima de R$ {minReais.toLocaleString('pt-BR')}
    </p>
  );
}
