'use client';

import {
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  LockClosedIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

const REASONS = [
  {
    icon: ShieldCheckIcon,
    title: 'Decisão clínica individual',
    description:
      'A plataforma organiza o contexto, mas a conduta depende da avaliação de profissional habilitado.',
  },
  {
    icon: AcademicCapIcon,
    title: 'Critério antes de conduta',
    description:
      'Você entende por que cada próximo passo pode fazer sentido antes de avançar no programa.',
  },
  {
    icon: LockClosedIcon,
    title: 'Privacidade e LGPD',
    description:
      'Dados de saúde tratados com sigilo, segurança e conformidade com a legislação aplicável.',
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: 'Canal oficial contínuo',
    description:
      'Orientações, lembretes e próximos passos ficam centralizados no WhatsApp oficial da Me Joy.',
  },
] as const;

export function HomeWhyChoose() {
  return (
    <section
      className="bg-[#f7faf7] py-14 sm:py-16 md:py-20"
      data-home-section="why_choose"
      aria-labelledby="home-why-choose-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Por que Me Joy</p>
            <h2
              id="home-why-choose-heading"
              className="mt-4 text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl md:text-5xl"
            >
              Confiança vem de clareza, não de promessa
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-600 sm:text-xl">
              A Me Joy foi desenhada para reduzir tentativa e erro: contexto organizado, linguagem simples e decisão
              clínica quando indicada.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {REASONS.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="flex h-full flex-col rounded-[28px] border border-emerald-100 bg-white p-6 shadow-[0_20px_45px_rgba(15,23,42,0.05)]"
              >
                <span className="inline-flex w-fit rounded-2xl bg-emerald-100 p-3 text-emerald-800 ring-1 ring-emerald-200">
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="mt-5 text-lg font-bold text-slate-950">{title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
