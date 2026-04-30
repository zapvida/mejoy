// src/components/report/sections/ExecutiveSummary.tsx
// Seção de resumo executivo personalizado

import type { ReportViewModel } from "@/lib/report/derive";

type ExecutiveSummaryProps = {
  vm: ReportViewModel;
};

export function ExecutiveSummary({ vm }: ExecutiveSummaryProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/70 p-6 text-white backdrop-blur-xl">
      <header className="mb-6">
        <h2 className="text-xl font-semibold">📋 Resumo Executivo</h2>
        <p className="text-sm text-white/70 mt-1">
          Pontos-chave baseados nas suas respostas
        </p>
      </header>

      <div className="space-y-4">
        {vm.content.executiveSummary.map((bullet, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-400 mt-2" />
            <p className="text-sm text-white/90 leading-relaxed">
              {bullet}
            </p>
          </div>
        ))}
      </div>

      {vm.context.redFlags.length > 0 && (
        <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
          <h3 className="text-sm font-semibold text-red-400 mb-2">
            🚨 Sinais de Alerta Identificados
          </h3>
          <ul className="space-y-1">
            {vm.context.redFlags.map((flag, index) => (
              <li key={index} className="text-sm text-red-300">
                • {flag}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
