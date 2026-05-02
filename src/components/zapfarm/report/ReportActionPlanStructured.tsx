'use client';

import type { ReportViewModel } from '@/lib/report/derive';

interface Props {
  vm: ReportViewModel;
}

const SECTION_META = [
  { key: 'todayPlan', eyebrow: 'Hoje', title: 'Ações imediatas' },
  { key: 'shortTermPlan', eyebrow: '7 a 14 dias', title: 'Curto prazo' },
  { key: 'longTermPlan', eyebrow: '1 a 3 meses', title: 'Continuidade' },
] as const;

export function ReportActionPlanStructured({ vm }: Props) {
  const contentMap = {
    todayPlan: vm.content.todayPlan,
    shortTermPlan: vm.content.shortTermPlan,
    longTermPlan: vm.content.longTermPlan,
  };

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.05)] sm:p-6 md:p-8">
      <div className="max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#4d6d56]">Plano estruturado</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[#2f2925]">Próximos passos organizados por horizonte</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
          O objetivo aqui é transformar a leitura clínica em execução prática. Comece pelo que cabe agora e avance com
          constância, não com pressa.
        </p>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {SECTION_META.map(section => (
          <div key={section.key} className="rounded-[1.8rem] border border-slate-200 bg-[#fbfaf7] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#4d6d56]">{section.eyebrow}</p>
            <h3 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-slate-900">{section.title}</h3>
            <ul className="mt-5 space-y-3">
              {contentMap[section.key].map((item, index) => (
                <li key={`${section.key}-${index}`} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#dbe9d5] text-[11px] font-bold text-[#204b3d]">
                    ✓
                  </span>
                  <span className="text-sm leading-6 text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
