// src/components/report/sections/WhenToSeekMedicalEnhanced.tsx
// Seção de quando procurar médico melhorada

'use client';

import { InteractiveSection } from '../interactive/InteractiveSection';
import type { ReportViewModel } from '@/lib/report/derive';

type WhenToSeekMedicalEnhancedProps = {
  vm: ReportViewModel;
};

export function WhenToSeekMedicalEnhanced({ vm }: WhenToSeekMedicalEnhancedProps) {
  return (
    <InteractiveSection
      title="Quando Procurar Médico"
      icon="🏥"
      description="Sinais que indicam necessidade de avaliação médica profissional"
      variant="warning"
    >
      <div className="space-y-4">
        {vm.content.whenToSeekMedical.map((warning, index) => (
          <div
            key={index}
            className="group relative p-4 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border-2 border-red-500/30 hover:border-red-500/50 transition-all duration-300 hover:scale-[1.01]"
          >
            {/* Ícone de alerta */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-red-500/30 flex items-center justify-center text-red-300 text-lg animate-pulse">
                ⚠️
              </div>
              <p className="text-sm sm:text-base text-red-200 leading-relaxed flex-1 font-medium">
                {warning}
              </p>
            </div>

            {/* Efeito de brilho */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Aviso importante destacado */}
      <div className="mt-6 p-5 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border-2 border-amber-500/40 shadow-lg">
        <div className="flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <h3 className="text-base font-semibold text-amber-300 mb-2">
              Importante
            </h3>
            <p className="text-sm text-amber-200/90 leading-relaxed mb-3">
              Este relatório é informativo e não substitui consulta médica presencial. 
              Para emergências médicas, procure atendimento imediato.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-200/80">
              <span>📞</span>
              <span>Emergências: SAMU 192</span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA para agendar consulta */}
      <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30">
        <p className="text-sm text-blue-300 text-center font-medium">
          💬 Precisa de ajuda? Entre em contato com nossos profissionais de saúde
        </p>
      </div>
    </InteractiveSection>
  );
}

