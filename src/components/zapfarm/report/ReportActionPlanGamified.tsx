// src/components/zapfarm/report/ReportActionPlanGamified.tsx
// Plano de ações gamificado com checkboxes interativos e progresso visual

'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, RotateCcw } from 'lucide-react';
import type { ReportViewModel } from '@/lib/report/derive';

interface ReportActionPlanGamifiedProps {
  vm: ReportViewModel;
  reportId: string;
}

export function ReportActionPlanGamified({ vm, reportId }: ReportActionPlanGamifiedProps) {
  const storageKey = `action-plan-${reportId}`;
  
  // Carregar estado salvo do localStorage
  const loadSavedState = () => {
    if (typeof window === 'undefined') return {};
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  };

  const [completedActions, setCompletedActions] = useState<Record<string, boolean>>(loadSavedState);

  // Salvar estado no localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(completedActions));
    }
  }, [completedActions, storageKey]);

  // Função helper para identificar o pilar de uma ação
  const getActionPillar = (action: string): { icon: string; color: string; name: string } => {
    const lowerAction = action.toLowerCase();
    if (lowerAction.includes('água') || lowerAction.includes('agua') || lowerAction.includes('beba') || 
        lowerAction.includes('comer') || lowerAction.includes('refeição') || lowerAction.includes('refeicao') ||
        lowerAction.includes('proteína') || lowerAction.includes('proteina') || lowerAction.includes('alimento') ||
        lowerAction.includes('mastigue') || lowerAction.includes('ultraprocessado')) {
      return { icon: '🥗', color: 'green', name: 'Alimentação' };
    }
    if (lowerAction.includes('caminhada') || lowerAction.includes('exercício') || lowerAction.includes('exercicio') ||
        lowerAction.includes('atividade física') || lowerAction.includes('atividade fisica') || lowerAction.includes('movimento')) {
      return { icon: '🏃', color: 'blue', name: 'Movimento' };
    }
    if (lowerAction.includes('sono') || lowerAction.includes('dormir') || lowerAction.includes('tela') ||
        lowerAction.includes('horas por noite') || lowerAction.includes('descanso')) {
      return { icon: '😴', color: 'purple', name: 'Sono' };
    }
    if (lowerAction.includes('respiração') || lowerAction.includes('respiracao') || lowerAction.includes('estresse') ||
        lowerAction.includes('ansiedade') || lowerAction.includes('positivo') || lowerAction.includes('pausa')) {
      return { icon: '🧘', color: 'pink', name: 'Saúde Emocional' };
    }
    return { icon: '✅', color: 'gray', name: 'Geral' };
  };

  const toggleAction = (category: string, index: number) => {
    const key = `${category}-${index}`;
    setCompletedActions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const resetProgress = () => {
    if (confirm('Tem certeza que deseja reiniciar seu progresso?')) {
      setCompletedActions({});
      if (typeof window !== 'undefined') {
        localStorage.removeItem(storageKey);
      }
    }
  };

  const getCompletedCount = (category: 'today' | 'shortTerm' | 'longTerm') => {
    const prefix = category === 'today' ? 'today' : category === 'shortTerm' ? 'shortTerm' : 'longTerm';
    return Object.keys(completedActions).filter(
      key => key.startsWith(prefix) && completedActions[key]
    ).length;
  };

  const totalToday = vm.content.todayPlan.length;
  const totalShortTerm = vm.content.shortTermPlan.length;
  const totalLongTerm = vm.content.longTermPlan.length;

  const completedToday = getCompletedCount('today');
  const completedShortTerm = getCompletedCount('shortTerm');
  const completedLongTerm = getCompletedCount('longTerm');

  const totalCompleted = completedToday + completedShortTerm + completedLongTerm;
  const totalActions = totalToday + totalShortTerm + totalLongTerm;
  const overallProgress = totalActions > 0 ? Math.round((totalCompleted / totalActions) * 100) : 0;

  return (
    <section className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-5 sm:p-6 md:p-8 border border-purple-100">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎯</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Plano de Ações
            </h2>
          </div>
        </div>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          Plano de ações práticas organizado em 4 pilares essenciais: Alimentação, Movimento, Sono e Saúde Emocional. 
          Marque conforme concluir para acompanhar sua evolução diária.
        </p>
        
        {/* Botão Reiniciar */}
        <button
          onClick={resetProgress}
          className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm"
        >
          <RotateCcw className="w-4 h-4" />
          REINICIAR
        </button>
      </div>
      
      {/* Pilares visuais */}
      <div className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 border border-green-200 text-center">
          <div className="text-2xl mb-1">🥗</div>
          <div className="text-xs sm:text-sm font-semibold text-gray-700">Alimentação</div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200 text-center">
          <div className="text-2xl mb-1">🏃</div>
          <div className="text-xs sm:text-sm font-semibold text-gray-700">Movimento</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 border border-purple-200 text-center">
          <div className="text-2xl mb-1">😴</div>
          <div className="text-xs sm:text-sm font-semibold text-gray-700">Sono</div>
        </div>
        <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-3 border border-pink-200 text-center">
          <div className="text-2xl mb-1">🧘</div>
          <div className="text-xs sm:text-sm font-semibold text-gray-700">Saúde Emocional</div>
        </div>
      </div>

      {/* Progresso Geral */}
      <div className="mb-8 p-5 bg-gradient-to-r from-purple-50 to-orange-50 rounded-xl border border-purple-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">Progresso Geral</span>
          <span className="text-lg font-bold text-purple-600">{totalCompleted}/{totalActions}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-purple-500 to-orange-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
        <p className="text-xs text-gray-600 mt-2">{overallProgress}% concluído</p>
      </div>

      {/* Seção HOJE */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Hoje</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-600">
              {completedToday}/{totalToday}
            </span>
            <div className="w-24 bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${totalToday > 0 ? (completedToday / totalToday) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {vm.content.todayPlan.map((action, index) => {
            const key = `today-${index}`;
            const isCompleted = completedActions[key] || false;
            
            return (
              <div
                key={index}
                onClick={() => toggleAction('today', index)}
                className={`
                  flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                  ${isCompleted 
                    ? 'bg-green-50 border-green-300' 
                    : 'bg-white border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                  }
                `}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 flex items-start gap-2">
                  <span className="text-lg flex-shrink-0">{getActionPillar(action).icon}</span>
                  <p className={`
                    flex-1 text-sm sm:text-base leading-relaxed
                    ${isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'}
                  `}>
                    {action}
                  </p>
                </div>
                {isCompleted && (
                  <span className="text-green-500 text-xl">✓</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Seção 7-14 dias */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📅</span>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">7-14 dias</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-600">
              {completedShortTerm}/{totalShortTerm}
            </span>
            <div className="w-24 bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${totalShortTerm > 0 ? (completedShortTerm / totalShortTerm) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {vm.content.shortTermPlan.map((action, index) => {
            const key = `shortTerm-${index}`;
            const isCompleted = completedActions[key] || false;
            
            return (
              <div
                key={index}
                onClick={() => toggleAction('shortTerm', index)}
                className={`
                  flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                  ${isCompleted 
                    ? 'bg-green-50 border-green-300' 
                    : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }
                `}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 flex items-start gap-2">
                  <span className="text-lg flex-shrink-0">{getActionPillar(action).icon}</span>
                  <p className={`
                    flex-1 text-sm sm:text-base leading-relaxed
                    ${isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'}
                  `}>
                    {action}
                  </p>
                </div>
                {isCompleted && (
                  <span className="text-green-500 text-xl">✓</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Seção 1-3 meses */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">1-3 meses</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-600">
              {completedLongTerm}/{totalLongTerm}
            </span>
            <div className="w-24 bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${totalLongTerm > 0 ? (completedLongTerm / totalLongTerm) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {vm.content.longTermPlan.map((action, index) => {
            const key = `longTerm-${index}`;
            const isCompleted = completedActions[key] || false;
            
            return (
              <div
                key={index}
                onClick={() => toggleAction('longTerm', index)}
                className={`
                  flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                  ${isCompleted 
                    ? 'bg-green-50 border-green-300' 
                    : 'bg-white border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                  }
                `}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 flex items-start gap-2">
                  <span className="text-lg flex-shrink-0">{getActionPillar(action).icon}</span>
                  <p className={`
                    flex-1 text-sm sm:text-base leading-relaxed
                    ${isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'}
                  `}>
                    {action}
                  </p>
                </div>
                {isCompleted && (
                  <span className="text-green-500 text-xl">✓</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* CTAs no rodapé */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <a
          href="#report-inline-checkout"
          className="flex items-center justify-center gap-3 px-6 py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
        >
          <span className="text-xl">💬</span>
          <span>Consulta médica já!</span>
        </a>
        <a
          href="#report-inline-checkout"
          className="flex items-center justify-center gap-3 px-6 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
        >
          <span className="text-xl">🌱</span>
          <span>Conhecer Planos!</span>
        </a>
      </div>
    </section>
  );
}




