// src/components/report/sections/NonMedicalAdvice.tsx
// Seção de conselhos não-medicamentosos

import type { ReportViewModel } from "@/lib/report/derive";

type NonMedicalAdviceProps = {
  vm: ReportViewModel;
};

export function NonMedicalAdvice({ vm }: NonMedicalAdviceProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/70 p-6 text-white backdrop-blur-xl">
      <header className="mb-6">
        <h2 className="text-xl font-semibold">🌱 Condutas Não-Medicamentosas</h2>
        <p className="text-sm text-white/70 mt-1">
          Mudanças no estilo de vida que fazem a diferença
        </p>
      </header>

      <div className="space-y-4">
        {vm.content.nonMedicalAdvice.map((advice, index) => (
          <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-white/5">
            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-emerald-400 mt-2" />
            <p className="text-sm text-white/90 leading-relaxed">
              {advice}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
        <h3 className="text-sm font-semibold text-blue-400 mb-2">
          💡 Dica Extra
        </h3>
        <p className="text-sm text-blue-300">
          Lembre-se: pequenas mudanças consistentes são mais eficazes que mudanças drásticas ocasionais. 
          Comece com 1-2 hábitos e vá incorporando outros gradualmente.
        </p>
      </div>
    </section>
  );
}
