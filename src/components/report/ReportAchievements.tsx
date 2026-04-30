// src/components/report/ReportAchievements.tsx
// Sistema de conquistas integrado ao relatório

'use client';

import { useState, useEffect } from 'react';
import { AchievementBadge } from './interactive/AchievementBadge';
import { InteractiveSection } from './interactive/InteractiveSection';
import type { ReportViewModel } from '@/lib/report/derive';

type ReportAchievementsProps = {
  vm: ReportViewModel;
};

// Conquistas baseadas no relatório
const getReportAchievements = (vm: ReportViewModel) => {
  const achievements = [];

  // Conquista: Primeira triagem completada
  achievements.push({
    id: 'first_report',
    title: 'Primeiro Relatório',
    description: 'Você completou sua primeira avaliação de saúde!',
    icon: '🎯',
    points: 10,
    unlocked: true,
  });

  // Conquista: Score alto
  if (vm.score >= 80) {
    achievements.push({
      id: 'excellent_score',
      title: 'Excelência em Saúde',
      description: `Parabéns! Você alcançou um score de ${vm.score}/100`,
      icon: '💯',
      points: 30,
      unlocked: true,
    });
  } else if (vm.score >= 60) {
    achievements.push({
      id: 'good_score',
      title: 'Bom Resultado',
      description: `Você está no caminho certo com ${vm.score}/100`,
      icon: '👍',
      points: 20,
      unlocked: true,
    });
  }

  // Conquista: Triagem específica (emagrecimento é convertido para metabolico)
  if (vm.triage === 'metabolico' || (vm as any).triageSlug === 'emagrecimento') {
    achievements.push({
      id: 'weight_loss_triage',
      title: 'Foco em Emagrecimento',
      description: 'Você iniciou sua jornada de emagrecimento saudável',
      icon: '🏃',
      points: 15,
      unlocked: true,
    });
  }

  // Conquista: Sem red flags
  if (vm.context.redFlags.length === 0) {
    achievements.push({
      id: 'no_red_flags',
      title: 'Sinais Verdes',
      description: 'Nenhum sinal de alerta identificado!',
      icon: '✅',
      points: 25,
      unlocked: true,
    });
  }

  // Conquista: Plano completo
  const totalActions = vm.content.todayPlan.length + 
                       vm.content.shortTermPlan.length + 
                       vm.content.longTermPlan.length;
  if (totalActions >= 10) {
    achievements.push({
      id: 'comprehensive_plan',
      title: 'Plano Completo',
      description: 'Você tem um plano detalhado com muitas ações!',
      icon: '📋',
      points: 20,
      unlocked: true,
    });
  }

  return achievements;
};

export function ReportAchievements({ vm }: ReportAchievementsProps) {
  const [achievements, setAchievements] = useState(getReportAchievements(vm));
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    const points = achievements
      .filter(a => a.unlocked)
      .reduce((sum, a) => sum + (a.points || 0), 0);
    setTotalPoints(points);
  }, [achievements]);

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  if (achievements.length === 0) return null;

  // Versão adaptada para tema claro (emagrecimento) ou escuro (GI)
  const isLightTheme = vm.triage === 'metabolico' || (vm as any).triageSlug === 'emagrecimento';

  if (isLightTheme) {
    // Versão para tema claro (emagrecimento)
    return (
      <section className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-5 sm:p-6 md:p-8 border border-purple-100">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🏆</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Conquistas Desbloqueadas
            </h2>
          </div>
          <p className="text-sm sm:text-base text-gray-600">
            Você desbloqueou {unlockedCount} conquista{unlockedCount !== 1 ? 's' : ''} e ganhou {totalPoints} pontos!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className="relative overflow-hidden rounded-xl border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50 p-4 shadow-md"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-2xl shadow-lg">
                  {achievement.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-gray-900 mb-1">
                    {achievement.title}
                  </h4>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    {achievement.description}
                  </p>
                  {achievement.points && (
                    <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-500/20 border border-yellow-500/30">
                      <span className="text-xs font-bold text-yellow-700">+{achievement.points}</span>
                      <span className="text-xs text-yellow-600">pontos</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Resumo de pontos */}
        <div className="p-5 bg-gradient-to-r from-purple-50 to-orange-50 rounded-xl border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">
                Total de Pontos
              </p>
              <p className="text-2xl font-bold text-purple-600">
                {totalPoints} pts
              </p>
            </div>
            <div className="text-4xl">⭐</div>
          </div>
        </div>
      </section>
    );
  }

  // Versão para tema escuro (GI e outros)
  return (
    <InteractiveSection
      title="Conquistas Desbloqueadas"
      icon="🏆"
      description={`Você desbloqueou ${unlockedCount} conquista${unlockedCount !== 1 ? 's' : ''} e ganhou ${totalPoints} pontos!`}
      variant="highlight"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((achievement) => (
          <AchievementBadge
            key={achievement.id}
            title={achievement.title}
            description={achievement.description}
            icon={achievement.icon}
            unlocked={achievement.unlocked}
            points={achievement.points}
          />
        ))}
      </div>

      {/* Resumo de pontos */}
      <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-yellow-300 mb-1">
              Total de Pontos
            </p>
            <p className="text-2xl font-bold text-yellow-200">
              {totalPoints} pts
            </p>
          </div>
          <div className="text-4xl">⭐</div>
        </div>
      </div>
    </InteractiveSection>
  );
}

