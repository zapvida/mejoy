import type { ReportViewModel } from "@/lib/report/derive";
import {
  getEvidenceForProfile,
  type Classification,
} from "@/lib/emagrecimento/evidence";

interface Props {
  vm?: ReportViewModel;
}

export function ReportEvidenceEmagrecimento({ vm }: Props) {
  const answers = vm ? (vm as any).answers || {} : {};
  const classification = vm
    ? ((vm as any).classification as Classification | undefined)
    : undefined;
  const comorbidades = Array.isArray(answers.comorbidades)
    ? answers.comorbidades.filter((item: string) => item !== "nenhuma")
    : [];

  const evidence = vm
    ? getEvidenceForProfile(
        { age: vm.basics.age, sex: vm.basics.sex, bmi: vm.basics.bmi },
        classification || "any",
        comorbidades,
      )
    : getEvidenceForProfile({}, "any", []);

  return (
    <section className="rounded-[28px] border border-[#d7e3da] bg-white p-5 shadow-[0_20px_50px_rgba(15,23,42,0.06)] sm:p-6">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
          Evidência rastreável
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-[-0.04em] text-slate-950 sm:text-3xl">
          O valor deste relatório depende de informação verdadeira, não de hype
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
          A leitura abaixo usa estudos e diretrizes reconhecidos para explicar o
          que costuma mudar com perda de peso, mudança de hábitos e tratamento
          medicamentoso quando ele é clinicamente indicado.
        </p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {evidence.map((item) => (
          <article
            key={item.id}
            className="rounded-[24px] border border-[#e1e8df] bg-[linear-gradient(180deg,#fbfcfa_0%,#f5f8f4_100%)] p-5"
          >
            <div className="flex flex-wrap gap-2">
              {item.study ? (
                <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-800">
                  {item.study}
                </span>
              ) : null}
              {item.year ? (
                <span className="rounded-full border border-[#d5e1d7] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                  {item.year}
                </span>
              ) : null}
            </div>

            <h3 className="mt-4 text-lg font-bold text-slate-950">
              {item.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              {item.summary}
            </p>

            {item.impact ? (
              <div className="mt-4 rounded-[18px] border border-white bg-white px-4 py-3 text-sm text-slate-700">
                {item.impact}
              </div>
            ) : null}

            <p className="mt-4 text-xs font-medium text-slate-500">
              Fonte-base: {item.source}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-6 rounded-[24px] border border-[#d7e3da] bg-[#f6fbf7] p-5">
        <p className="text-sm font-semibold text-slate-900">
          O ponto central para o paciente
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          Em obesidade e sobrepeso, o objetivo clínico mais valioso costuma ser
          reduzir risco cardiometabólico, melhorar saciedade, sono, energia e
          capacidade de manter hábitos. A estética pode vir junto, mas não é o
          único marcador relevante de sucesso.
        </p>
      </div>
    </section>
  );
}
