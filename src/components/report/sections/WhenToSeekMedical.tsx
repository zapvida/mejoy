// src/components/report/sections/WhenToSeekMedical.tsx
// Seção de quando procurar médico

import type { ReportViewModel } from "@/lib/report/derive";

type WhenToSeekMedicalProps = {
  vm: ReportViewModel;
};

export function WhenToSeekMedical({ vm }: WhenToSeekMedicalProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/70 p-6 text-white backdrop-blur-xl">
      <header className="mb-6">
        <h2 className="text-xl font-semibold">🏥 Quando Procurar Médico</h2>
        <p className="text-sm text-white/70 mt-1">
          Sinais que indicam necessidade de avaliação médica
        </p>
      </header>

      <div className="space-y-4">
        {vm.content.whenToSeekMedical.map((warning, index) => (
          <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-red-400 mt-2" />
            <p className="text-sm text-red-300 leading-relaxed">
              {warning}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
        <h3 className="text-sm font-semibold text-amber-400 mb-2">
          ⚠️ Importante
        </h3>
        <p className="text-sm text-amber-300">
          Este relatório é informativo e não substitui consulta médica presencial. 
          Para emergências médicas, procure atendimento imediato.
        </p>
      </div>
    </section>
  );
}
