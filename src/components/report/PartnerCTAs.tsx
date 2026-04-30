// src/components/report/PartnerCTAs.tsx
// Adapter para o novo sistema de CTAs unificados

import React from 'react';

import PartnerCTAGroup from '@/components/cta/PartnerCTAGroup';

interface PartnerCTAsProps {
  context?: string;
  redFlags?: string[];
  className?: string;
}

export default function PartnerCTAs({ 
  context = 'gi_report', 
  redFlags = [],
  className = ''
}: PartnerCTAsProps) {
  return (
    <aside
      aria-label="Parceiros que viabilizam este relatório"
      className={`rounded-2xl border border-white/15 bg-white/10 p-4 shadow-md shadow-slate-950/20 backdrop-blur print:hidden ${className}`}
    >
      <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wide text-white/70">
        Este relatório é viabilizado por parceiros
      </p>
      
      <PartnerCTAGroup 
        partners={['zapvida', 'zapfarm']} 
        context={context} 
        redFlags={redFlags} 
        variant="light"
        fullWidth 
      />
    </aside>
  );
}

// Manter export nomeado para compatibilidade
export { PartnerCTAs };