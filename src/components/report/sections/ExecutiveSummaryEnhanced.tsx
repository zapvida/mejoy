// src/components/report/sections/ExecutiveSummaryEnhanced.tsx
// Seção de resumo executivo melhorada com visual moderno

'use client';

import { InteractiveSection } from '../interactive/InteractiveSection';
import type { ReportViewModel } from '@/lib/report/derive';

type ExecutiveSummaryEnhancedProps = {
  vm: ReportViewModel;
};

export function ExecutiveSummaryEnhanced({ vm }: ExecutiveSummaryEnhancedProps) {
  return (
    <InteractiveSection
      title="Resumo Executivo"
      icon="📋"
      description="Pontos-chave baseados nas suas respostas e perfil de saúde"
      eyebrow="Análise Personalizada"
    >
      <div className="space-y-4">
        {vm.content.executiveSummary.map((bullet, index) => (
          <div
            key={index}
            className="group relative flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-[1.01]"
          >
            {/* Indicador animado */}
            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-400 mt-2 animate-pulse group-hover:scale-150 transition-transform" />
            
            {/* Texto */}
            <p className="text-sm sm:text-base text-white/90 leading-relaxed flex-1">
              {bullet}
            </p>

            {/* Efeito de brilho no hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Red Flags destacados */}
      {vm.context.redFlags.length > 0 && (
        <div className="mt-6 p-5 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border-2 border-red-500/40 shadow-lg">
          <div className="flex items-start gap-3 mb-3">
            <span className="text-2xl animate-pulse">🚨</span>
            <div>
              <h3 className="text-base font-semibold text-red-300 mb-2">
                Sinais de Alerta Identificados
              </h3>
              <p className="text-xs text-red-200/80 mb-3">
                Estes sinais requerem atenção médica imediata
              </p>
            </div>
          </div>
          <ul className="space-y-2 ml-8">
            {vm.context.redFlags.map((flag, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-red-200">
                <span className="text-red-400 mt-1">•</span>
                <span className="leading-relaxed">{flag}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Badge de personalização */}
      <div className="mt-6 flex items-center justify-center gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
        <span className="text-sm text-blue-300 font-medium">
          ✨ Relatório personalizado com base no seu perfil único
        </span>
      </div>
    </InteractiveSection>
  );
}

