'use client';

import { DevicePhoneMobileIcon, ShieldCheckIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { track } from '@/lib/analytics';
import { useLandingPageKey } from '@/contexts/LandingAnalyticsContext';

const proofCards = [
  {
    icon: ShieldCheckIcon,
    title: 'Avaliação médica individual',
    text: 'O fluxo organiza seus dados para o médico decidir com critério, sem promessa automática de prescrição.',
  },
  {
    icon: DevicePhoneMobileIcon,
    title: 'Jornada digital enxuta',
    text: 'Triagem, próximos passos e suporte ficam na mesma experiência, com menos fricção entre decidir e avançar.',
  },
  {
    icon: UserGroupIcon,
    title: 'Suporte oficial e acompanhamento',
    text: 'Você entende o que acontece depois da triagem e mantém contato pelos canais oficiais da Me Joy.',
  },
] as const;

export function BenefitsSectionObesidade() {
  const page = useLandingPageKey();

  const handleCtaClick = () => {
    track('cta_click', {
      page,
      position: 'benefits',
      section: 'benefits_section',
    });
  };

  return (
    <section
      className="bg-white py-14 sm:py-16 md:py-20"
      data-home-section="benefits"
      data-testid="emagrecimento-proof"
      aria-labelledby="emagrecimento-proof-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Prova e autoridade</p>
            <h2
              id="emagrecimento-proof-heading"
              className="mt-4 text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl md:text-5xl"
            >
              O programa precisa parecer simples sem perder rigor clínico
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-600 sm:text-xl">
              A decisão vem com contexto, transparência e canais oficiais. Sem exagerar nos claims e sem transformar a
              landing em e-commerce genérico.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm font-semibold text-slate-600">
              {['Médicos com CRM', 'LGPD e privacidade', 'Suporte oficial', 'Próximos passos claros'].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 shadow-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {proofCards.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-[28px] border border-emerald-100 bg-[#fcfffd] p-6 shadow-[0_20px_45px_rgba(15,23,42,0.05)]"
              >
                <div className="inline-flex rounded-2xl bg-emerald-100 p-3 text-emerald-800 ring-1 ring-emerald-200">
                  <Icon className="h-6 w-6" aria-hidden />
                </div>
                <h3 className="mt-5 text-xl font-bold text-slate-950">{title}</h3>
                <p className="mt-3 text-base leading-relaxed text-slate-600">{text}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a
              href="/triagem/emagrecimento"
              onClick={handleCtaClick}
              className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-base font-bold text-emerald-800 shadow-sm ring-1 ring-emerald-200 transition-all hover:-translate-y-0.5 hover:bg-emerald-50"
            >
              Ver minha elegibilidade
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
