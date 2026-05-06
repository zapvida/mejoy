'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { track } from '@/lib/analytics';
import { useLandingPageKey } from '@/contexts/LandingAnalyticsContext';
import { appFeatures } from '@/config/zapfarm/benefits';
import { EMAGRECIMENTO_LP } from '@/lib/emagrecimento-lp-assets';

const quickStats = [
  { label: 'Triagem', value: '5 min' },
  { label: 'Canal oficial', value: 'WhatsApp' },
  { label: 'Avaliação médica', value: 'Quando indicada' },
];

export function AppFeaturesSectionObesidade() {
  const page = useLandingPageKey();

  const handleCtaClick = () => {
    track('cta_click', {
      page,
      position: 'app_features',
      section: 'app_features_section',
    });
  };

  const features = appFeatures;

  return (
    <section
      className="bg-gradient-to-br from-emerald-50 via-white to-lime-50 py-12 sm:py-16 md:py-20"
      aria-labelledby="app-portal-heading"
      data-home-section="app-features"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-12">
            <div className="flex-1 space-y-6 sm:space-y-8">
              <h2
                id="app-portal-heading"
                className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl md:text-5xl"
              >
                Acompanhamento para não deixar o plano morrer na rotina
              </h2>
              <p className="max-w-xl text-lg text-gray-600 sm:text-xl">
                Depois da decisão inicial, o que sustenta resultado é constância. Por isso a jornada continua com
                check-ins, lembretes e suporte oficial.
              </p>

              <div className="grid grid-cols-3 gap-3 sm:max-w-xl">
                {quickStats.map(item => (
                  <div key={item.label} className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700">{item.label}</p>
                    <p className="mt-2 whitespace-nowrap text-sm font-semibold text-slate-900 sm:text-base">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <ul className="space-y-4 sm:space-y-5">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3 sm:gap-4">
                    <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 to-emerald-800">
                      <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-base leading-relaxed text-gray-700 sm:text-lg">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <a
                  href="/triagem/emagrecimento"
                  onClick={handleCtaClick}
                  className={cn(
                    'inline-flex items-center justify-center',
                    'h-14 px-8 sm:h-16 sm:px-10',
                    'whitespace-nowrap text-base font-bold text-white sm:text-lg',
                    'rounded-full shadow-xl transition-all duration-200',
                    'bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800',
                    'hover:from-emerald-700 hover:via-emerald-800 hover:to-emerald-900',
                    'hover:shadow-2xl hover:scale-105 active:scale-100'
                  )}
                >
                  Ver se sou elegível
                </a>
                <a
                  href="/#como-funciona"
                  onClick={handleCtaClick}
                  className={cn(
                    'inline-flex items-center justify-center gap-2',
                    'h-14 px-8 sm:h-16 sm:px-10',
                    'whitespace-nowrap text-base font-bold text-emerald-700 sm:text-lg',
                    'rounded-full border-2 border-emerald-600',
                    'bg-white hover:bg-emerald-50',
                    'transition-all duration-200'
                  )}
                >
                  Ver como funciona
                </a>
              </div>
            </div>

            <div className="flex-1">
              <div className="relative mx-auto w-full max-w-[520px]">
                <div className="absolute inset-x-8 top-8 h-48 rounded-full bg-emerald-200/40 blur-3xl" />
                <div className="relative rounded-[34px] border border-emerald-100 bg-white p-4 shadow-[0_32px_90px_rgba(16,24,40,0.14)] sm:p-5">
                  <div className="rounded-[30px] bg-[#15392f] p-3 sm:p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-emerald-200">
                          Painel do cuidado
                        </p>
                        <p className="text-sm font-semibold text-white">Acompanhamento ativo</p>
                      </div>
                      <span className="rounded-full bg-white/12 px-3 py-1 text-xs font-semibold text-emerald-100">
                        Hoje
                      </span>
                    </div>

                    <div className="grid gap-3 md:grid-cols-[1.05fr_0.95fr]">
                      <div className="rounded-[24px] bg-white p-3 shadow-sm">
                        <div className="relative aspect-[4/3] overflow-hidden rounded-[20px]">
                          <Image
                            src={EMAGRECIMENTO_LP.storyPortraitA}
                            alt="Acompanhamento contínuo com suporte humano"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 260px"
                            quality={88}
                          />
                        </div>
                        <div className="mt-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-3 py-2">
                          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                            Próximo passo
                          </p>
                          <p className="mt-1 text-sm font-semibold text-slate-900">Resumo da triagem + próximo passo</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="rounded-[24px] bg-white/10 p-4 text-white ring-1 ring-white/10">
                          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-200">Canal oficial</p>
                          <p className="mt-2 text-sm font-semibold">WhatsApp MeJoy</p>
                          <p className="mt-2 text-sm leading-6 text-white/78">
                            Relatório inicial, próximos passos e lembretes no mesmo canal oficial.
                          </p>
                        </div>

                        <div className="rounded-[24px] bg-white p-4 shadow-sm">
                          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-700">
                            Evolução organizada
                          </p>
                          <div className="mt-3 space-y-2">
                            {['Triagem enviada', 'Avaliação médica quando indicada', 'Acompanhamento ativo'].map(item => (
                              <div key={item} className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2">
                                <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
                                <span className="whitespace-nowrap text-sm font-medium text-slate-700">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-5 right-3 w-44 rounded-[24px] border border-white/90 bg-white p-3 shadow-xl sm:right-0 sm:w-52">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[18px]">
                    <Image
                      src={EMAGRECIMENTO_LP.appContext}
                      alt="Monitoramento de hábitos e evolução"
                      fill
                      className="object-cover"
                      sizes="220px"
                      quality={84}
                    />
                  </div>
                  <p className="mt-2 text-xs font-semibold text-slate-700">Check-ins e evolução no mesmo ambiente</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
