'use client';

import { DevicePhoneMobileIcon, ShieldCheckIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { track } from '@/lib/analytics';
import { useLandingPageKey } from '@/contexts/LandingAnalyticsContext';

const proofCards = [
  {
    icon: ShieldCheckIcon,
    title: 'Avaliação médica individual',
    text: 'Se houver indicação, a decisão acontece em consulta, com critério clínico e sem prescrição automática.',
  },
  {
    icon: DevicePhoneMobileIcon,
    title: 'Fluxo digital enxuto',
    text: 'Triagem, próximos passos e suporte ficam no mesmo caminho, com menos fricção para avançar.',
  },
  {
    icon: UserGroupIcon,
    title: 'Suporte oficial',
    text: 'Você entende o que acontece depois da triagem e segue pelos canais oficiais da MeJoy.',
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
              Simples na leitura, criterioso na decisão.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-600 sm:text-xl">
              O objetivo aqui é reduzir ruído: você entende elegibilidade, fluxo e suporte sem transformar a LP em catálogo genérico.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm font-semibold text-slate-600">
              {['Médicos com CRM', 'LGPD e privacidade', 'Suporte oficial', 'Próximos passos claros'].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-emerald-100 bg-white px-4 py-2 shadow-sm"
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
                className="rounded-[28px] border border-emerald-100 bg-[#fcfffd] p-6 shadow-[0_16px_36px_rgba(15,23,42,0.05)]"
              >
                <div className="inline-flex rounded-2xl bg-emerald-100 p-3 text-emerald-800 ring-1 ring-emerald-200">
                  <Icon className="h-6 w-6" aria-hidden />
                </div>
                <h3 className="mt-5 text-xl font-bold text-slate-950">{title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-slate-600">{text}</p>
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
