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
      position: 'treatments',
      section: 'treatments_section',
    });
  };

  return (
    <section
      id="tratamentos"
      data-home-section="treatments"
      data-testid="emagrecimento-treatments"
      className="scroll-mt-24 bg-[#f8fcf9] py-14 sm:py-16 md:py-20"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Tratamentos e medicacoes</p>
            <h2 className="mt-4 text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl md:text-5xl">
              Ninguem deveria decidir isso so pelo nome do remedio.
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-slate-600 sm:text-xl">
              O que realmente importa e entender potencia, previsibilidade, seguranca clinica e quanto essa diferenca
              pode aparecer na balanca ao longo do tempo.
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-sm font-medium leading-relaxed text-slate-500 sm:text-base">
              {getLpPriceHook()}
            </p>
            <p className="mx-auto mt-4 max-w-3xl text-xs leading-relaxed text-slate-500 sm:text-sm">
              Para ficar simples: 10% do peso inicial equivale a cerca de 10 kg para alguem com 100 kg. As faixas
              abaixo resumem medias de estudos clinicos com dieta e atividade fisica junto do tratamento.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 sm:gap-8">
            {TREATMENT_TRACKS.map((track) => (
              <div
                key={track.id}
                className="relative flex h-full flex-col overflow-hidden rounded-[30px] border border-emerald-100 bg-white p-6 shadow-[0_20px_45px_rgba(15,23,42,0.06)] transition-transform duration-300 hover:-translate-y-1 sm:p-8"
              >
                <div className="absolute left-6 top-6">
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-800">
                    {track.badge}
                  </span>
                </div>

                <div className="relative mb-5 aspect-[4/3] w-full overflow-hidden rounded-[24px] border border-emerald-100 bg-emerald-50">
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

                  <h3 className="mt-5 text-2xl font-bold text-slate-950">{track.title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-slate-600">{track.subtitle}</p>

                  <div className="mt-6 space-y-4 rounded-[24px] border border-zinc-100 bg-[#fbfdfc] p-5">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">
                        Quanto costuma perder
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-slate-700 sm:text-base">{track.efficacy}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">
                        Em kg, para ficar palpavel
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-slate-700 sm:text-base">{track.estimate}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">
                        Seguranca clinica
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-slate-700 sm:text-base">{track.safety}</p>
                    </div>
                  </div>

                  <p className="mt-6 text-sm leading-relaxed text-slate-700 sm:text-base">{track.bestFor}</p>

                  <a
                    href="/triagem/emagrecimento"
                    onClick={handleCtaClick}
                    className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 sm:text-base"
                  >
                    Ver se esta opcao faz sentido pra mim
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-10 max-w-3xl text-center">
            <p className="text-sm leading-relaxed text-slate-500 sm:text-base">
              O papel da Me Joy aqui e reduzir duvida, deixar a comparacao honesta e levar a decisao para uma consulta
              melhor informada. Indicacao de medicacao, dose, duracao e frequencia continuam dependendo de avaliacao medica.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
