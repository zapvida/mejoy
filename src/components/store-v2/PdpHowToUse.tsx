'use client';

import { Check } from 'lucide-react';

/**
 * Seção "Como usar" — bullets específicos do produto ou fallback genérico.
 * Espelha o OficialFarma com bullets claros.
 */

interface PdpHowToUseProps {
  bullets: string[];
  packSizeDisplay?: string | null;
  className?: string;
}

export default function PdpHowToUse({
  bullets,
  packSizeDisplay,
  className = '',
}: PdpHowToUseProps) {
  const hasBullets = bullets && bullets.length > 0;
  const hasPackSize = packSizeDisplay?.trim();

  if (!hasBullets && !hasPackSize) return null;

  return (
    <div className={`bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm ${className}`}>
      <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 tracking-tight">Como usar</h2>
      {hasBullets ? (
        <ul className="space-y-2.5 md:space-y-3">
          {bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" aria-hidden />
              <span className="text-gray-700 text-[15px] leading-relaxed">{b}</span>
            </li>
          ))}
        </ul>
      ) : null}
      {hasPackSize && (
        <p className={`text-gray-700 mt-4 text-[15px] ${hasBullets ? 'text-sm' : ''}`}>
          Apresentação: {packSizeDisplay}. Siga sempre a orientação do seu médico ou nutricionista.
        </p>
      )}
    </div>
  );
}
