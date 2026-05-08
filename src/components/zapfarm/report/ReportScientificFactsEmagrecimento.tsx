import type { ReportViewModel } from "@/lib/report/derive";
import { getScientificFactsForProfile } from "@/lib/emagrecimento/scientificFacts";

interface Props {
  vm: ReportViewModel;
  reportId?: string;
}

export function ReportScientificFactsEmagrecimento({ vm, reportId }: Props) {
  const answers = (vm as any).answers || {};
  const comorbidades = Array.isArray(answers.comorbidades)
    ? answers.comorbidades.filter((item: string) => item !== "nenhuma")
    : [];

  const facts = getScientificFactsForProfile(
    { age: vm.basics.age, sex: vm.basics.sex },
    comorbidades,
    3,
    reportId || vm.triageId,
  );

  if (facts.length === 0) {
    return null;
  }

  return (
    <section className="rounded-[28px] border border-[#d7e3da] bg-white p-5 shadow-[0_20px_50px_rgba(15,23,42,0.06)] sm:p-6">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
          Curiosidades úteis
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-[-0.04em] text-slate-950 sm:text-3xl">
          Fatos simples que costumam explicar por que o resultado acelera ou
          trava
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
          Este bloco não substitui prescrição. Ele ajuda a tornar o tratamento
          mais compreensível e mais fácil de sustentar no dia a dia.
        </p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {facts.map((fact) => (
          <article
            key={fact.id}
            className="rounded-[24px] border border-[#e1e8df] bg-[linear-gradient(180deg,#ffffff_0%,#f5f8f4_100%)] p-5"
          >
            <span className="inline-flex rounded-full bg-[#eef6ef] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-800">
              Base científica
            </span>
            <h3 className="mt-4 text-lg font-bold text-slate-950">
              {fact.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              {fact.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
