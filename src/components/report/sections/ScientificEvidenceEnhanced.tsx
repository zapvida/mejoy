// src/components/report/sections/ScientificEvidenceEnhanced.tsx
// Seção de evidências científicas melhorada

'use client';

import { InteractiveSection } from '../interactive/InteractiveSection';
import type { ReportViewModel } from '@/lib/report/derive';

type ScientificEvidenceEnhancedProps = {
  vm: ReportViewModel;
};

export function ScientificEvidenceEnhanced({ vm }: ScientificEvidenceEnhancedProps) {
  return (
    <InteractiveSection
      title="Evidências Científicas"
      icon="🔬"
      description="Base científica robusta por trás das recomendações apresentadas"
      eyebrow="Fundamentação Científica"
      variant="default"
    >
      <div className="space-y-4">
        {vm.content.scientificEvidence.map((evidence, index) => (
          <div
            key={index}
            className="group relative p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:scale-[1.01]"
          >
            {/* Ícone de evidência */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                {index + 1}
              </div>
              <p className="text-sm sm:text-base text-white/90 leading-relaxed flex-1">
                {evidence}
              </p>
            </div>

            {/* Efeito de brilho */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Referências e credibilidade */}
      <div className="mt-6 p-5 rounded-xl bg-gradient-to-br from-slate-500/20 to-slate-600/20 border border-slate-500/30">
        <div className="flex items-start gap-3">
          <span className="text-2xl">📚</span>
          <div>
            <h3 className="text-sm font-semibold text-slate-300 mb-2">
              Referências Científicas
            </h3>
            <p className="text-sm text-slate-300/80 leading-relaxed">
              As evidências apresentadas são baseadas em estudos científicos revisados por pares 
              e publicados em periódicos médicos de alto impacto. Para mais informações detalhadas, 
              consulte as referências médicas atualizadas e sempre discuta com seu médico.
            </p>
          </div>
        </div>
      </div>

      {/* Badge de confiabilidade */}
      <div className="mt-4 flex items-center justify-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
        <span className="text-xs text-green-300 font-medium">
          ✓ Baseado em evidências científicas revisadas por pares
        </span>
      </div>
    </InteractiveSection>
  );
}

