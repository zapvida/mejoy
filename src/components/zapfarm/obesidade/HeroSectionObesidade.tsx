'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { track } from '@/lib/analytics';
import { useLandingPageKey } from '@/contexts/LandingAnalyticsContext';
import { getLpPriceHook } from '@/lib/emagrecimento/launchPricing';

const COPY = {
  default: {
    h1: 'Comece sua jornada de bem-estar hoje',
    sub: 'Plano personalizado com avaliação clínica e acompanhamento contínuo.',
  },
  emagrecimento: {
    h1: 'Emagrecimento com avaliação médica e acompanhamento contínuo',
    sub:
      'Triagem curta, conduta individual e próximos passos claros no mesmo fluxo.',
  },
} as const;

type HeroVariant = keyof typeof COPY;

const mobileHeroGallery = [
  {
    src: '/images/emagrecimento/medvi/reviews-06.webp',
    alt: 'Paciente sorrindo após iniciar a jornada de emagrecimento',
    className: 'mt-4 h-36 rounded-[2rem]',
    imageClassName: 'object-[58%_center]',
  },
  {
    src: '/images/benchmarks/medvi-glp/00039_hero-grid-3_ab9926cad088.webp',
    alt: 'Paciente no centro da composição principal da jornada',
    className: 'h-44 rounded-[2.1rem]',
    imageClassName: 'object-center',
  },
  {
    src: '/images/emagrecimento/medvi/reviews-07.webp',
    alt: 'Paciente representando a evolução com acompanhamento contínuo',
    className: 'mt-7 h-32 rounded-[1.9rem]',
    imageClassName: 'object-[54%_center]',
  },
] as const;

export function HeroSectionObesidade({ variant = 'default' }: { variant?: HeroVariant }) {
  const page = useLandingPageKey();
  const { h1, sub } = COPY[variant];

  const emagrecimentoHeadline = (
    <>
      Emagrecimento com
      <span className="text-emerald-700"> avaliação médica</span> e
      <span className="text-emerald-700"> acompanhamento contínuo</span>.
    </>
  );

  const handlePrimaryCta = () => {
    track('hero_primary_cta_click', {
      page,
      position: 'hero',
      section: 'hero',
    });
  };

  const handleSecondaryCta = () => {
    track('hero_secondary_cta_click', {
      page,
      position: 'hero',
      section: 'hero_secondary',
    });
  };

  return (
    <section className="relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-emerald-50/70 via-white to-white pt-20 sm:pt-28 lg:min-h-[88vh]">
      <div className="relative mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 sm:py-10 lg:px-8 lg:py-16">
        <div className="flex flex-col items-center gap-6 lg:flex-row lg:gap-12">
          <div className="w-full flex-1 space-y-5 text-center lg:text-left">
            {variant === 'emagrecimento' && (
              <div className="inline-flex whitespace-nowrap rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-800 sm:px-4 sm:text-[11px] sm:tracking-[0.16em]">
                Programa 100% online com avaliação médica
              </div>
            )}

            <div className="space-y-3 sm:space-y-5">
              <h1 className="px-2 text-[1.72rem] font-bold leading-[1.02] text-gray-900 sm:text-5xl md:text-6xl lg:px-0 lg:text-[66px]">
                {variant === 'emagrecimento' ? emagrecimentoHeadline : h1}
              </h1>

              <p className="mx-auto max-w-2xl px-2 text-[14px] leading-6 text-gray-700 sm:text-xl sm:leading-8 lg:mx-0 lg:px-0">
                {variant === 'emagrecimento'
                  ? 'Triagem rápida, avaliação médica quando indicada e acompanhamento com próximos passos claros.'
                  : sub}
              </p>

              {variant === 'emagrecimento' && (
                <ul className="mx-auto max-w-2xl space-y-2 px-2 text-left lg:mx-0 lg:px-0">
                  {[
                    'Triagem rápida para entender histórico, rotina e objetivos.',
                    'Conduta individual com próximos passos objetivos.',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[13px] text-slate-700 sm:text-base">
                      <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                        ✓
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex flex-col justify-center gap-3 px-2 sm:flex-row lg:justify-start lg:px-0">
              <div className="relative inline-flex w-full sm:w-auto">
                <a
                  href="/triagem/emagrecimento"
                  onClick={handlePrimaryCta}
                  className={cn(
                    'relative inline-flex items-center justify-center z-10',
                    'h-14 px-7 sm:h-16 sm:px-10',
                    'whitespace-nowrap text-base font-bold text-white sm:text-lg',
                    'rounded-full transition-all duration-300',
                    'bg-emerald-600 hover:bg-emerald-700 shadow-[0_20px_50px_rgba(5,150,105,0.28)]',
                    'hover:scale-105 active:scale-100',
                    'w-full sm:w-auto'
                  )}
                >
                  <span className="relative z-10 drop-shadow-md">Começar minha triagem</span>
                </a>
              </div>

              {variant === 'emagrecimento' && (
                <a
                  href="#como-funciona"
                  onClick={handleSecondaryCta}
                  className={cn(
                    'inline-flex items-center justify-center whitespace-nowrap text-sm font-bold text-emerald-800 transition-colors hover:text-emerald-900 sm:h-16 sm:rounded-full sm:border-2 sm:border-emerald-200 sm:bg-white sm:px-10 sm:text-lg sm:hover:bg-emerald-50',
                    'w-full sm:w-auto'
                  )}
                >
                  Ver como funciona
                </a>
              )}
            </div>

            {variant === 'emagrecimento' && (
              <div className="hidden space-y-3 px-2 lg:block">
                <p className="mx-auto max-w-[32rem] rounded-xl border border-emerald-100 bg-emerald-50/70 px-3 py-3 text-sm leading-6 text-gray-700 lg:mx-0">
                  {getLpPriceHook()}
                </p>
              </div>
            )}

            {variant === 'emagrecimento' && (
              <div className="relative mx-auto w-full max-w-[460px] lg:hidden">
                <div className="mt-1 grid grid-cols-3 gap-3">
                  {mobileHeroGallery.map(item => (
                    <div
                      key={item.src}
                      className={cn(
                        'relative overflow-hidden border border-white/80 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.10)]',
                        item.className
                      )}
                    >
                      <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        className={cn('object-cover', item.imageClassName)}
                        sizes="33vw"
                        quality={86}
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex justify-center">
                  <div className="inline-flex rounded-full border border-emerald-100 bg-white/95 px-4 py-2 shadow-lg backdrop-blur">
                    <p className="whitespace-nowrap text-[11px] font-semibold text-slate-900">
                      Fluxo completo: triagem, consulta e suporte
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-[2rem] border border-emerald-100 bg-white p-2 shadow-[0_24px_60px_rgba(15,23,42,0.14)]">
                  <div className="relative overflow-hidden rounded-[1.7rem]">
                    <div className="relative aspect-[1.18/1] w-full overflow-hidden rounded-[1.7rem]">
                      <Image
                        src="/images/emagrecimento/medvi/hero-main.webp"
                        alt="Paciente em consulta para programa de emagrecimento com acompanhamento profissional"
                        fill
                        className="object-cover object-center"
                        priority
                        sizes="100vw"
                        quality={88}
                      />
                    </div>

                    <div className="absolute right-3 top-3 rounded-2xl border border-emerald-100 bg-white/95 px-3 py-2 shadow-xl backdrop-blur">
                      <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-emerald-700">
                        Fluxo completo
                      </p>
                      <p className="whitespace-nowrap text-xs font-semibold text-slate-900">Triagem → Consulta → Suporte</p>
                    </div>

                    <div className="absolute -bottom-1 left-3 overflow-hidden rounded-2xl border border-white/80 bg-white shadow-2xl">
                      <div className="relative h-16 w-24 sm:h-20 sm:w-28">
                        <Image
                          src="/images/emagrecimento/medvi/hero-secondary.webp"
                          alt="Acompanhamento contínuo para manutenção de resultados"
                          fill
                          className="object-cover"
                          sizes="128px"
                          quality={84}
                        />
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50/70 px-3 py-3 text-sm leading-6 text-gray-700">
                    {getLpPriceHook()}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="relative hidden w-full max-w-xl flex-1 items-center justify-center lg:flex">
            <div className="relative w-full max-w-xl">
              <div className="relative aspect-[11/10] w-full overflow-hidden rounded-[2rem] shadow-[0_30px_80px_rgba(15,23,42,0.16)] ring-1 ring-emerald-100">
                <Image
                  src="/images/emagrecimento/medvi/hero-main.webp"
                  alt="Paciente em consulta para programa de emagrecimento com acompanhamento profissional"
                  fill
                  className="object-cover object-center"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={88}
                />
              </div>

              <div className="absolute -bottom-4 left-3 w-44 overflow-hidden rounded-2xl border border-white/80 bg-white shadow-2xl sm:w-56">
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src="/images/emagrecimento/medvi/hero-secondary.webp"
                    alt="Acompanhamento contínuo para manutenção de resultados"
                    fill
                    className="object-cover"
                    sizes="220px"
                    quality={85}
                  />
                </div>
              </div>

              <div className="absolute -top-4 right-2 sm:right-0 rounded-2xl border border-emerald-100 bg-white/95 px-4 py-3 shadow-xl backdrop-blur">
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-emerald-700">
                  Fluxo completo
                </p>
                <p className="whitespace-nowrap text-sm font-semibold text-slate-900">Triagem → Consulta → Acompanhamento</p>
              </div>

              <div className="absolute bottom-4 right-2 rounded-full border border-white/70 bg-white/95 px-4 py-2 shadow-xl sm:right-0">
                <p className="whitespace-nowrap text-xs font-bold text-slate-900">Suporte oficial no WhatsApp</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
