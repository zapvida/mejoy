'use client';

import {
  ChatBubbleLeftRightIcon,
  ClipboardDocumentCheckIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

const STEPS = [
  {
    number: '01',
    icon: ClipboardDocumentCheckIcon,
    title: 'Faça sua triagem online',
    description:
      'Responde em poucos minutos pelo celular ou computador. Seus dados ficam organizados para a próxima etapa.',
  },
  {
    number: '02',
    icon: UserCircleIcon,
    title: 'Receba uma análise inicial',
    description:
      'Um relatório personalizado mostra elegibilidade, próximos passos e, quando indicado, abre a consulta com médico.',
  },
  {
    number: '03',
    icon: ChatBubbleLeftRightIcon,
    title: 'Tenha suporte oficial pelo WhatsApp',
    description:
      'Acompanhamento contínuo pelo canal oficial da Me Joy, com clareza sobre o que vem antes e depois de cada etapa.',
  },
] as const;

export function HomeHowItWorks() {
  return (
    <section
      id="como-funciona"
      className="bg-white py-14 sm:py-16 md:py-20"
      data-home-section="how_it_works"
      aria-labelledby="home-how-it-works-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Como funciona</p>
            <h2
              id="home-how-it-works-heading"
              className="mt-4 text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl md:text-5xl"
            >
              Três passos simples para começar com clareza
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-600 sm:text-xl">
              Sem fricção, sem fórmulas mágicas e sem promessa automática de prescrição. A jornada respeita o seu tempo
              e a decisão clínica final é sempre médica.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {STEPS.map(({ number, icon: Icon, title, description }) => (
              <div
                key={number}
                className="flex h-full flex-col rounded-[28px] border border-emerald-100 bg-[#fcfffd] p-6 shadow-[0_20px_45px_rgba(15,23,42,0.05)]"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex rounded-2xl bg-emerald-100 p-3 text-emerald-800 ring-1 ring-emerald-200">
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <span className="text-sm font-bold tracking-[0.18em] text-emerald-700">{number}</span>
                </div>
                <h3 className="mt-5 text-xl font-bold text-slate-950">{title}</h3>
                <p className="mt-3 flex-1 text-base leading-relaxed text-slate-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
