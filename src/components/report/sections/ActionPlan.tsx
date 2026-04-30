// src/components/report/sections/ActionPlan.tsx
// Seção de plano de ações personalizado

import type { ReportViewModel } from "@/lib/report/derive";

type ActionPlanProps = {
  vm: ReportViewModel;
};

export function ActionPlan({ vm }: ActionPlanProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/70 p-6 text-white backdrop-blur-xl">
      <header className="mb-6">
        <h2 className="text-xl font-semibold">🎯 Plano de Ações</h2>
        <p className="text-sm text-white/70 mt-1">
          Passos práticos para melhorar sua saúde
        </p>
      </header>

      <div className="space-y-6">
        {/* Hoje */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-green-400 flex items-center gap-2">
            <span className="text-xl">⚡</span>
            Hoje
          </h3>
          <ul className="space-y-2 ml-6">
            {vm.content.todayPlan.map((action, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-green-400 mt-2" />
                <p className="text-sm text-white/90 leading-relaxed">
                  {action}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* 7-14 dias */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-blue-400 flex items-center gap-2">
            <span className="text-xl">📅</span>
            7-14 dias
          </h3>
          <ul className="space-y-2 ml-6">
            {vm.content.shortTermPlan.map((action, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400 mt-2" />
                <p className="text-sm text-white/90 leading-relaxed">
                  {action}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* 1-3 meses */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-purple-400 flex items-center gap-2">
            <span className="text-xl">🎯</span>
            1-3 meses
          </h3>
          <ul className="space-y-2 ml-6">
            {vm.content.longTermPlan.map((action, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-purple-400 mt-2" />
                <p className="text-sm text-white/90 leading-relaxed">
                  {action}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
