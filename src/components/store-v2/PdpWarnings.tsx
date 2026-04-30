'use client';

import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

interface PdpWarningsProps {
  advertenciasAnvisa: string;
  cautions?: string | null;
  complianceBlock?: string;
  /** Bloco completo de advertências (como OficialFarma) — quando preenchido, exibe em prioridade */
  advertenciasCompleto?: string | null;
}

function splitIntoBullets(text: string): string[] {
  if (!text?.trim()) return [];
  return text
    .split(/[.;]\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 10);
}

const TRUNCATE_LENGTH = 800;

export default function PdpWarnings({
  advertenciasAnvisa,
  cautions,
  complianceBlock,
  advertenciasCompleto,
}: PdpWarningsProps) {
  const [expanded, setExpanded] = useState(false);

  if (advertenciasCompleto?.trim()) {
    const fullText = advertenciasCompleto.trim();
    const shouldTruncate = fullText.length > TRUNCATE_LENGTH;
    const displayText = shouldTruncate && !expanded ? fullText.slice(0, TRUNCATE_LENGTH) + '…' : fullText;

    return (
      <div className="rounded-2xl border border-amber-200/70 bg-white overflow-hidden shadow-sm">
        <div className="flex items-center gap-2.5 p-4 md:p-5 border-b border-amber-200/60 bg-amber-50/40">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" aria-hidden />
          <h3 className="font-semibold text-gray-900 text-[15px]">Advertências e precauções</h3>
        </div>
        <div className="p-4 md:p-5 text-sm text-gray-800 leading-relaxed whitespace-pre-line">
          {displayText}
        </div>
        {shouldTruncate && !expanded && (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="w-full py-3 text-sm font-medium text-amber-800 hover:bg-amber-50/80 transition-colors border-t border-amber-100"
          >
            Ver mais
          </button>
        )}
      </div>
    );
  }

  const defaultBullets = splitIntoBullets(advertenciasAnvisa);
  const cautionBullets = cautions ? splitIntoBullets(cautions) : [];
  const complianceBullets = complianceBlock ? splitIntoBullets(complianceBlock) : [];

  const all = [...new Set([...cautionBullets, ...complianceBullets, ...defaultBullets])];
  const display = expanded ? all : all.slice(0, 5);
  const hasMore = all.length > 5;

  if (all.length === 0) return null;

  return (
    <div className="rounded-2xl border border-amber-200/70 bg-white overflow-hidden shadow-sm">
      <div className="flex items-center gap-2.5 p-4 md:p-5 border-b border-amber-200/60 bg-amber-50/40">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" aria-hidden />
        <h3 className="font-semibold text-gray-900 text-[15px]">Advertências e precauções</h3>
      </div>
      <ul className="p-4 md:p-5 space-y-2.5 md:space-y-3">
        {display.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-gray-800 leading-relaxed">
            <span className="text-amber-600 mt-0.5 shrink-0">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      {hasMore && !expanded && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="w-full py-3 text-sm font-medium text-amber-800 hover:bg-amber-50/80 transition-colors border-t border-amber-100"
        >
          Ver mais
        </button>
      )}
    </div>
  );
}
