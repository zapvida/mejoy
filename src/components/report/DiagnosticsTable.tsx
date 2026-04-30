import clsx from "clsx";

import type { EvidenceItem, ExamItem, Supplement } from "@/lib/report/types";

type DiagnosticsTableProps = {
  exams: ExamItem[];
  supplements?: Supplement[];
  evidence?: EvidenceItem[];
};

export function DiagnosticsTable({ exams, supplements = [], evidence = [] }: DiagnosticsTableProps) {
  return (
    <div className="space-y-8">
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_22px_55px_rgba(6,10,30,0.35)] print:border-slate-200 print:bg-white print:shadow-none">
        <header className="border-b border-white/5 px-6 py-4 print:border-slate-200">
          <h3 className="text-lg font-semibold text-white print:text-slate-900">Exames Prioritários</h3>
          <p className="mt-1 text-sm text-white/60 print:text-slate-600">
            Entenda por que cada exame importa, quando realizar e como se preparar.
          </p>
        </header>
        <div className="divide-y divide-white/5 print:divide-slate-200">
          {exams.map((exam, idx) => (
            <div
              key={`${exam.name}-${idx}`}
              className={clsx(
                "grid gap-3 px-6 py-5 text-sm text-white/80 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,0.7fr)]",
                "print:text-slate-700",
              )}
            >
              <div>
                <p className="font-medium text-white print:text-slate-900">{exam.name}</p>
                {exam.prep && <p className="text-xs text-white/50 print:text-slate-500">Preparo: {exam.prep}</p>}
              </div>
              <p>{exam.why}</p>
              <p className="text-white/65 print:text-slate-600">Quando fazer: {exam.when}</p>
            </div>
          ))}
          {!exams.length && (
            <p className="px-6 py-5 text-sm text-white/70 print:text-slate-600">
              Nenhum exame adicional necessário neste momento. Foque nas rotinas recomendadas.
            </p>
          )}
        </div>
      </div>

      {supplements.length > 0 && (
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-6 shadow-[0_22px_55px_rgba(6,10,30,0.35)] print:border-slate-200 print:bg-white print:shadow-none">
          <h3 className="text-lg font-semibold text-white print:text-slate-900">Suplementação estratégica</h3>
          <p className="mt-1 text-sm text-white/60 print:text-slate-600">
            Avalie com seu profissional de saúde antes de iniciar qualquer suplemento.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {supplements.map((item, idx) => (
              <div key={`${item.name}-${idx}`} className="rounded-2xl border border-white/10 bg-white/5 p-4 print:border-slate-200 print:bg-white">
                <p className="text-base font-semibold text-white print:text-slate-900">{item.name}</p>
                <p className="text-sm text-white/70 print:text-slate-600">{item.dose}</p>
                {item.note && <p className="mt-2 text-xs text-white/60 print:text-slate-500">{item.note}</p>}
                {item.evidence && (
                  <p className="mt-3 text-xs text-white/40 print:text-slate-500">Evidência: {item.evidence}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {evidence.length > 0 && (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 print:border-slate-200 print:bg-white">
          <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-white/40 print:text-slate-500">
            Fontes e evidências
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-white/70 print:list-disc print:pl-5 print:text-slate-600">
            {evidence.map((item, idx) => (
              <li key={`${item.cite}-${idx}`}>
                {item.url ? (
                  <a href={item.url} target="_blank" rel="noreferrer" className="text-white underline decoration-white/40 underline-offset-4 print:text-blue-600">
                    {item.cite}
                  </a>
                ) : (
                  item.cite
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
