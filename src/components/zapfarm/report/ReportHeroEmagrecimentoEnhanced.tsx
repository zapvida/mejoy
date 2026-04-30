// src/components/zapfarm/report/ReportHeroEmagrecimentoEnhanced.tsx
// Hero section melhorado para emagrecimento com score e métricas

'use client';

import { useEffect, useState } from 'react';
import { ScoreCard } from '@/components/report/interactive/ScoreCard';
import { normalizeBMI } from '@/lib/health/bmi';
import type { ReportViewModel } from '@/lib/report/derive';
import { getScientificFactsForProfile } from '@/lib/emagrecimento/scientificFacts';

interface Props {
  vm: ReportViewModel;
  reportId?: string;
}

export function ReportHeroEmagrecimentoEnhanced({ vm, reportId }: Props) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const bmi = normalizeBMI(vm.basics.bmi, vm.basics.age);
  const bmiValue = bmi?.bmi ?? null;
  const bmiClass = bmi?.classification ?? 'Não calculado';
  
  // Obter comorbidades do vm
  const answers = (vm as any).answers || {};
  const comorbidades = Array.isArray(answers.comorbidades)
    ? answers.comorbidades.filter((c: string) => c !== 'nenhuma')
    : [];
  
  // Obter uma curiosidade científica (usando reportId como seed para consistência servidor/cliente)
  const scientificFact = getScientificFactsForProfile(
    { age: vm.basics.age, sex: vm.basics.sex },
    comorbidades,
    1,
    reportId || vm.triageId
  )[0];
  
  // Frase de síntese baseada no IMC
  const getSynthesisPhrase = () => {
    if (!bmiValue) return 'Vamos entender melhor seu quadro e criar um plano personalizado para você.';
    
    if (bmiValue >= 30) {
      return 'Seu peso atual aumenta o risco de problemas metabólicos e cardiovasculares, mas há muito o que podemos fazer juntos para melhorar sua saúde.';
    } else if (bmiValue >= 25) {
      return 'Seu peso está acima do ideal e pode impactar sua saúde, mas com mudanças graduais e acompanhamento, é possível alcançar seus objetivos.';
    }
    return 'Vamos trabalhar juntos para manter ou melhorar sua saúde e qualidade de vida.';
  };

  const getScoreColor = (score: number): 'green' | 'blue' | 'purple' | 'orange' | 'red' => {
    if (score >= 80) return 'green';
    if (score >= 60) return 'blue';
    if (score >= 40) return 'purple';
    if (score >= 20) return 'orange';
    return 'red';
  };

  return (
    <section className={`
      bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white py-10 sm:py-12 md:py-16
      transition-all duration-1000 ease-out
      ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
    `}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Mobile Layout */}
          <div className="md:hidden space-y-6">
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.25em] text-white/70 mb-2">
                Relatório Personalizado
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-white">
                Olá, {vm.basics.firstName}! 👋
              </h1>
              <p className="text-base sm:text-lg text-emerald-50 mb-2 leading-relaxed">
                {vm.greeting}
              </p>
              <p className="text-sm sm:text-base text-emerald-100/90 mb-4 leading-relaxed italic">
                {getSynthesisPhrase()}
              </p>
              
              {/* Cards de métricas */}
              <div className="grid grid-cols-3 gap-3 mt-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="text-2xl font-bold text-white">
                    {bmiValue?.toFixed(1) ?? '—'}
                  </div>
                  <div className="text-xs text-white/80 mt-1">IMC</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="text-lg font-bold text-white leading-tight">
                    {bmiClass}
                  </div>
                  <div className="text-xs text-white/80 mt-1">Classificação</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="text-xl">⚠️</div>
                  <div className="text-xs text-white/80 mt-1">Avaliação</div>
                </div>
              </div>
            </div>

            {/* Score Card Mobile */}
            <div className="px-2">
              <ScoreCard
                score={vm.score}
                label="Seu Momento Atual"
                icon={vm.icon}
                color={getScoreColor(vm.score)}
                interpretation={vm.interpretation}
              />
            </div>
            
            {/* Seu IMC no contexto + Curiosidade */}
            <div className="px-2 space-y-4 mt-6">
              {/* Seu IMC no contexto */}
              {bmiValue && (
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <h3 className="text-sm font-semibold text-white mb-2">📊 Seu IMC no contexto</h3>
                    <p className="text-xs sm:text-sm text-emerald-50/95 leading-relaxed">
                    Seu IMC de <strong>{bmiValue.toFixed(1)}</strong> ({bmiClass.toLowerCase()}) está acima do ideal e aumenta o risco de problemas como diabetes tipo 2, pressão alta e doenças cardiovasculares. 
                    Mas não se preocupe: perder cerca de 5-10% do peso já traz grandes benefícios para glicose, pressão e saúde do fígado.
                  </p>
                </div>
              )}
              
              {/* Você sabia? */}
              {scientificFact && (
                <div className="bg-gradient-to-r from-emerald-400/10 to-teal-300/10 backdrop-blur-sm rounded-xl p-4 border border-emerald-200/30">
                  <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                    <span>💡</span> Você sabia que...
                  </h3>
                  <p className="text-xs sm:text-sm text-white leading-relaxed font-medium mb-1">
                    {scientificFact.title}
                  </p>
                  <p className="text-xs text-white/90 leading-relaxed">
                    {scientificFact.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:grid md:grid-cols-2 md:gap-8 lg:gap-12">
            <div className="space-y-6">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-white/70 mb-2">
                  Relatório Personalizado
                </p>
                <h1 className="text-3xl lg:text-4xl font-bold mb-4 text-white">
                  Olá, {vm.basics.firstName}! 👋
                </h1>
                <p className="text-lg lg:text-xl text-emerald-50 mb-2 leading-relaxed">
                  {vm.greeting}
                </p>
                <p className="text-base text-emerald-100/90 mb-6 leading-relaxed italic">
                  {getSynthesisPhrase()}
                </p>
                
                {/* Cards de métricas */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                    <div className="text-3xl font-bold text-white">
                      {bmiValue?.toFixed(1) ?? '—'}
                    </div>
                    <div className="text-sm text-white/80 mt-1">IMC</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                    <div className="text-xl font-bold text-white leading-tight">
                      {bmiClass}
                    </div>
                    <div className="text-sm text-white/80 mt-1">Classificação</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                    <div className="text-2xl">⚠️</div>
                    <div className="text-sm text-white/80 mt-1">Avaliação</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Score Card Desktop */}
              <ScoreCard
                score={vm.score}
                label="Seu Momento Atual"
                icon={vm.icon}
                color={getScoreColor(vm.score)}
                interpretation={vm.interpretation}
              />
              
              {/* Seu IMC no contexto + Curiosidade */}
              <div className="space-y-4">
                {/* Seu IMC no contexto */}
                {bmiValue && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                    <h3 className="text-sm font-semibold text-white mb-2">📊 Seu IMC no contexto</h3>
                    <p className="text-sm text-emerald-50/95 leading-relaxed">
                      Seu IMC de <strong>{bmiValue.toFixed(1)}</strong> ({bmiClass.toLowerCase()}) está acima do ideal e aumenta o risco de problemas como diabetes tipo 2, pressão alta e doenças cardiovasculares. 
                      Mas não se preocupe: perder cerca de 5-10% do peso já traz grandes benefícios para glicose, pressão e saúde do fígado.
                    </p>
                  </div>
                )}
                
                {/* Você sabia? */}
                {scientificFact && (
                  <div className="bg-gradient-to-r from-emerald-400/10 to-teal-300/10 backdrop-blur-sm rounded-xl p-5 border border-emerald-200/30">
                    <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                      <span>💡</span> Você sabia que...
                    </h3>
                    <p className="text-sm text-white leading-relaxed font-medium mb-1">
                      {scientificFact.title}
                    </p>
                    <p className="text-xs text-white/90 leading-relaxed">
                      {scientificFact.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}





