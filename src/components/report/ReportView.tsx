// src/components/report/ReportView.tsx
// Componente principal que renderiza o relatório completo - Otimizado com lazy-load

'use client';

import dynamic from 'next/dynamic';
import { ReportActionBar } from "./ReportActionBar";
import { ReportHeroEnhanced } from "./ReportHeroEnhanced";
import { ReportAchievements } from "./ReportAchievements";
import type { ReportViewModel } from "@/lib/report/derive";

// Lazy-load seções abaixo da dobra para melhor TTI
const ExecutiveSummaryEnhanced = dynamic(
  () => import('./sections/ExecutiveSummaryEnhanced').then((m) => m.ExecutiveSummaryEnhanced),
  { loading: () => <section className="h-32 rounded-xl bg-white/5 animate-pulse" /> }
);
const ActionPlanEnhanced = dynamic(
  () => import('./sections/ActionPlanEnhanced').then((m) => m.ActionPlanEnhanced),
  { loading: () => <section className="h-40 rounded-xl bg-white/5 animate-pulse" /> }
);
const NonMedicalAdviceEnhanced = dynamic(
  () => import('./sections/NonMedicalAdviceEnhanced').then((m) => m.NonMedicalAdviceEnhanced),
  { loading: () => <section className="h-32 rounded-xl bg-white/5 animate-pulse" /> }
);
const WhenToSeekMedicalEnhanced = dynamic(
  () => import('./sections/WhenToSeekMedicalEnhanced').then((m) => m.WhenToSeekMedicalEnhanced),
  { loading: () => <section className="h-28 rounded-xl bg-white/5 animate-pulse" /> }
);
const ScientificEvidenceEnhanced = dynamic(
  () => import('./sections/ScientificEvidenceEnhanced').then((m) => m.ScientificEvidenceEnhanced),
  { loading: () => <section className="h-24 rounded-xl bg-white/5 animate-pulse" /> }
);

type ReportViewProps = {
  vm: ReportViewModel;
  onHeroVisible?: () => void;
  onRequestPrint?: () => void;
  onCTAClick?: (ctaId: string) => void;
};

export function ReportView({ vm, onHeroVisible, onRequestPrint, onCTAClick: _onCTAClick }: ReportViewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 relative overflow-hidden">
      {/* Efeito de fundo animado */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 animate-gradient-xy" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8 sm:space-y-10">
        {/* Hero Section Melhorado */}
        <ReportHeroEnhanced vm={vm} {...(onHeroVisible ? { onHeroVisible } : {})} />

        {/* Action Bar */}
        <ReportActionBar 
          reportId={vm.id}
          {...(onRequestPrint ? { onRequestPrint } : {})}
        />

        {/* Conquistas */}
        <ReportAchievements vm={vm} />

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-8">
            <ExecutiveSummaryEnhanced vm={vm} />
            <ActionPlanEnhanced vm={vm} />
            <NonMedicalAdviceEnhanced vm={vm} />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <WhenToSeekMedicalEnhanced vm={vm} />
            <ScientificEvidenceEnhanced vm={vm} />
          </div>
        </div>

        {/* Footer Melhorado */}
        <footer className="text-center py-8 sm:py-10 border-t border-white/10 mt-12">
          <div className="space-y-3">
            <p className="text-white/70 text-sm sm:text-base">
              Relatório gerado em {new Date(vm.createdAt).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
              })}
            </p>
            <div className="flex items-center justify-center gap-2 text-white/60 text-xs sm:text-sm">
              {vm.aiGenerated ? (
                <>
                  <span className="text-purple-400">✨</span>
                  <span>Personalizado com Inteligência Artificial</span>
                </>
              ) : (
                <>
                  <span className="text-blue-400">📋</span>
                  <span>Baseado em protocolos médicos validados</span>
                </>
              )}
            </div>
            <p className="text-white/50 text-xs mt-4">
              Este relatório é informativo e não substitui consulta médica presencial
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
