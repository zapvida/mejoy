'use client';

import Image from 'next/image';
import { track } from '@/lib/analytics';
import { useLandingPageKey } from '@/contexts/LandingAnalyticsContext';
import { getLpPriceHook } from '@/lib/emagrecimento/launchPricing';
import { TREATMENT_TRACKS } from '@/lib/emagrecimento/treatmentTracks';

export function PlansSectionObesidade() {
  const page = useLandingPageKey();

  const handleCtaClick = () => {
    track('cta_click', {
      page,
      position: 'plans',
      section: 'plans_section',
    });
  };

  return (
    <section
      id="tratamentos"
      data-home-section="plans"
      data-testid="emagrecimento-treatments"
      className="scroll-mt-24 bg-[#f8fcf9] py-12 sm:py-14 md:py-16"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center sm:mb-12">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Tratamentos e medicações</p>
            <h2 className="mt-4 text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl">
              Compare opções com contexto, não por impulso.
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
              O nome do medicamento não basta. O que importa é entender perfil, tolerância, riscos, resposta esperada e
              indicação médica.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {TREATMENT_TRACKS.map((track) => (
              <article
                key={track.id}
                className="relative flex h-full flex-col overflow-hidden rounded-[30px] border border-emerald-100 bg-white p-5 shadow-[0_20px_45px_rgba(15,23,42,0.06)] transition-transform duration-300 hover:-translate-y-1 sm:p-6"
              >
                <div className="absolute left-5 top-5 z-10 sm:left-6 sm:top-6">
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-800">
                    {track.badge}
                  </span>
                </div>

                <div className="relative mb-4 aspect-[16/9] w-full overflow-hidden rounded-[24px] border border-emerald-100 bg-emerald-50">
                  <Image
                    src={track.image}
                    alt={track.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    quality={85}
                  />
                </div>

                <div className="mt-auto flex h-full flex-col">
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <span className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800">
                      {track.format}
                    </span>
                    <span className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700">
                      {track.potency}
                    </span>
                    <span className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700">
                      {track.certainty}
                    </span>
                  </div>

                  <h3 className="mt-4 text-2xl font-bold text-slate-950">{track.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-[15px]">{track.subtitle}</p>

                  <div className="mt-5 grid grid-cols-1 gap-3 rounded-[24px] border border-zinc-100 bg-[#fbfdfc] p-4 sm:grid-cols-2">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-700">Perda observada</p>
                      <p className="mt-1 text-sm leading-relaxed text-slate-700">{track.efficacy}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-700">Equivalência prática</p>
                      <p className="mt-1 text-sm leading-relaxed text-slate-700">{track.estimate}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-700">Segurança clínica</p>
                      <p className="mt-1 text-sm leading-relaxed text-slate-700">{track.safety}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-700">Quando tende a fazer sentido</p>
                      <p className="mt-1 text-sm leading-relaxed text-slate-700">{track.bestFor}</p>
                    </div>
                  </div>

                  <a
                    href="/triagem/emagrecimento"
                    onClick={handleCtaClick}
                    className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 sm:text-base"
                  >
                    Fazer minha triagem
                  </a>
                </div>
              </article>
            ))}
          </div>

          <div className="mx-auto mt-8 max-w-3xl text-center">
            <p className="text-sm font-medium leading-relaxed text-slate-500 sm:text-base">{getLpPriceHook()}</p>
            <p className="mt-3 text-sm leading-relaxed text-slate-500 sm:text-base">
              A comparação ajuda você a chegar mais informado na avaliação. Ela não substitui consulta nem promete
              prescrição.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
