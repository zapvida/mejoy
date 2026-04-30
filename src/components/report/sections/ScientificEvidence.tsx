// src/components/report/sections/ScientificEvidence.tsx
// Seção de evidências científicas

import type { ReportViewModel } from "@/lib/report/derive";

type ScientificEvidenceProps = {
  vm: ReportViewModel;
};

export function ScientificEvidence({ vm }: ScientificEvidenceProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/70 p-6 text-white backdrop-blur-xl">
      <header className="mb-6">
        <h2 className="text-xl font-semibold">🔬 Evidências Científicas</h2>
        <p className="text-sm text-white/70 mt-1">
          Base científica das recomendações
        </p>
      </header>

      <div className="space-y-4">
        {vm.content.scientificEvidence.map((evidence, index) => (
          <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-white/5">
            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-400 mt-2" />
            <p className="text-sm text-white/90 leading-relaxed">
              {evidence}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-xl bg-slate-500/10 border border-slate-500/20">
        <h3 className="text-sm font-semibold text-slate-400 mb-2">
          📚 Referências
        </h3>
        <p className="text-sm text-slate-300">
          As evidências apresentadas são baseadas em estudos científicos revisados por pares. 
          Para mais informações, consulte as referências médicas atualizadas.
        </p>
      </div>
    </section>
  );
}
