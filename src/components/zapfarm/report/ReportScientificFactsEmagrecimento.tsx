// src/components/zapfarm/report/ReportScientificFactsEmagrecimento.tsx
// Componente de curiosidades científicas para o relatório de emagrecimento

import type { ReportViewModel } from '@/lib/report/derive';
import { getScientificFactsForProfile } from '@/lib/emagrecimento/scientificFacts';
import { RefinedCard } from '@/components/ui/RefinedCard';

interface Props {
  vm: ReportViewModel;
  reportId?: string;
}

export function ReportScientificFactsEmagrecimento({ vm, reportId }: Props) {
  const answers = (vm as any).answers || {};
  const comorbidades = Array.isArray(answers.comorbidades)
    ? answers.comorbidades.filter((c: string) => c !== 'nenhuma')
    : [];
  
  const facts = getScientificFactsForProfile(
    { age: vm.basics.age, sex: vm.basics.sex },
    comorbidades,
    3,
    reportId || vm.triageId
  );

  if (facts.length === 0) {
    return null;
  }

  return (
    <RefinedCard variant="default" padding="lg" rounded="xl" className="shadow-xl">
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 flex items-center gap-3 tracking-tight">
          <span>🔬</span> Você sabia que...?
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Curiosidades científicas verdadeiras sobre emagrecimento e saúde
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {facts.map((fact) => (
          <RefinedCard
            key={fact.id}
            variant="subtle"
            padding="lg"
            rounded="lg"
            hover
            className="bg-gradient-to-br from-brand-50 to-purple-50/50 border-brand-200"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 text-2xl">💡</div>
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 leading-tight">
                  {fact.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                  {fact.description}
                </p>
              </div>
            </div>
          </RefinedCard>
        ))}
      </div>
    </RefinedCard>
  );
}

