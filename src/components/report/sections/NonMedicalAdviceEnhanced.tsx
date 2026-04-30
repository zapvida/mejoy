// src/components/report/sections/NonMedicalAdviceEnhanced.tsx
// Seção de condutas não-medicamentosas melhorada

'use client';

import { InteractiveSection } from '../interactive/InteractiveSection';
import type { ReportViewModel } from '@/lib/report/derive';

type NonMedicalAdviceEnhancedProps = {
  vm: ReportViewModel;
};

export function NonMedicalAdviceEnhanced({ vm }: NonMedicalAdviceEnhancedProps) {
  return (
    <InteractiveSection
      title="Condutas Não-Medicamentosas"
      icon="🌱"
      description="Mudanças no estilo de vida que fazem a diferença na sua saúde"
      variant="success"
    >
      <div className="space-y-4">
        {vm.content.nonMedicalAdvice.map((advice, index) => (
          <div
            key={index}
            className="group relative flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 hover:scale-[1.01]"
          >
            {/* Ícone de check */}
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-sm font-bold mt-0.5">
              ✓
            </div>
            
            {/* Texto */}
            <p className="text-sm sm:text-base text-white/90 leading-relaxed flex-1">
              {advice}
            </p>

            {/* Efeito de brilho */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Dica extra destacada */}
      <div className="mt-6 p-5 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-2 border-blue-500/40 shadow-lg">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <h3 className="text-base font-semibold text-blue-300 mb-2">
              Dica Extra
            </h3>
            <p className="text-sm text-blue-200/90 leading-relaxed">
              Lembre-se: pequenas mudanças consistentes são mais eficazes que mudanças drásticas ocasionais. 
              Comece com 1-2 hábitos e vá incorporando outros gradualmente. A consistência é a chave do sucesso!
            </p>
          </div>
        </div>
      </div>

      {/* Motivação */}
      <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30">
        <p className="text-sm text-green-300 text-center font-medium">
          🌟 Cada pequena mudança é um passo em direção a uma vida mais saudável!
        </p>
      </div>
    </InteractiveSection>
  );
}

