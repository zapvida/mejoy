// src/components/report/sections/ActionPlanEnhanced.tsx
// Seção de plano de ações melhorada com interatividade e gamificação

'use client';

import { useState, useEffect } from 'react';
import { InteractiveSection } from '../interactive/InteractiveSection';
import { ActionItem } from '../interactive/ActionItem';
import { ProgressTracker } from '../interactive/ProgressTracker';
import type { ReportViewModel } from '@/lib/report/derive';

type ActionPlanEnhancedProps = {
  vm: ReportViewModel;
};

export function ActionPlanEnhanced({ vm }: ActionPlanEnhancedProps) {
  const [completedToday, setCompletedToday] = useState(0);
  const [completedShortTerm, setCompletedShortTerm] = useState(0);
  const [completedLongTerm, setCompletedLongTerm] = useState(0);

  const totalToday = vm.content.todayPlan.length;
  const totalShortTerm = vm.content.shortTermPlan.length;
  const totalLongTerm = vm.content.longTermPlan.length;

  const handleToggle = (category: 'today' | 'shortTerm' | 'longTerm', index: number, completed: boolean) => {
    if (category === 'today') {
      setCompletedToday(prev => completed ? prev + 1 : prev - 1);
    } else if (category === 'shortTerm') {
      setCompletedShortTerm(prev => completed ? prev + 1 : prev - 1);
    } else {
      setCompletedLongTerm(prev => completed ? prev + 1 : prev - 1);
    }
  };

  return (
    <InteractiveSection
      title="Plano de Ações"
      icon="🎯"
      description="Passos práticos e personalizados para melhorar sua saúde. Marque conforme concluir para acompanhar seu progresso."
      variant="highlight"
    >
      <div className="space-y-8">
        {/* Progresso geral */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ProgressTracker
            completed={completedToday}
            total={totalToday}
            label="Hoje"
            color="green"
          />
          <ProgressTracker
            completed={completedShortTerm}
            total={totalShortTerm}
            label="7-14 dias"
            color="blue"
          />
          <ProgressTracker
            completed={completedLongTerm}
            total={totalLongTerm}
            label="1-3 meses"
            color="purple"
          />
        </div>

        {/* Ações de Hoje */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">⚡</span>
            <h3 className="text-lg font-semibold text-green-400">
              Hoje - Ações Imediatas
            </h3>
          </div>
          <div className="space-y-2">
            {vm.content.todayPlan.map((action, index) => (
              <ActionItem
                key={index}
                text={action}
                priority="high"
                timeframe="Hoje"
                onToggle={(completed) => handleToggle('today', index, completed)}
              />
            ))}
          </div>
        </div>

        {/* Ações de 7-14 dias */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">📅</span>
            <h3 className="text-lg font-semibold text-blue-400">
              7-14 dias - Curto Prazo
            </h3>
          </div>
          <div className="space-y-2">
            {vm.content.shortTermPlan.map((action, index) => (
              <ActionItem
                key={index}
                text={action}
                priority="medium"
                timeframe="7-14 dias"
                onToggle={(completed) => handleToggle('shortTerm', index, completed)}
              />
            ))}
          </div>
        </div>

        {/* Ações de 1-3 meses */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🎯</span>
            <h3 className="text-lg font-semibold text-purple-400">
              1-3 meses - Médio Prazo
            </h3>
          </div>
          <div className="space-y-2">
            {vm.content.longTermPlan.map((action, index) => (
              <ActionItem
                key={index}
                text={action}
                priority="low"
                timeframe="1-3 meses"
                onToggle={(completed) => handleToggle('longTerm', index, completed)}
              />
            ))}
          </div>
        </div>

        {/* Dica motivacional */}
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30">
          <p className="text-sm text-white/90 leading-relaxed flex items-start gap-2">
            <span className="text-lg">💡</span>
            <span>
              <strong>Dica:</strong> Comece pelas ações de hoje. Pequenos passos consistentes 
              são mais eficazes que mudanças drásticas. Cada ação concluída é uma vitória!
            </span>
          </p>
        </div>
      </div>
    </InteractiveSection>
  );
}

