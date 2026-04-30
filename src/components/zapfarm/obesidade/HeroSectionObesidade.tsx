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
    h1: 'Emagrecimento com avaliação médica, plano personalizado e suporte contínuo',
    sub:
      'Triagem objetiva, decisão clínica individual e acompanhamento contínuo para sustentar resultado com menos tentativa e erro.',
  },
} as const;

type HeroVariant = keyof typeof COPY;

export function HeroSectionObesidade({ variant = 'default' }: { variant?: HeroVariant }) {
  const page = useLandingPageKey();
  const { h1, sub } = COPY[variant];

  const emagrecimentoHeadline = (
    <>
      Emagrecimento com
      <span className="text-emerald-700"> avaliação médica</span>,
      <span className="text-emerald-700"> plano personalizado</span> e
      <span className="text-emerald-700"> suporte contínuo</span>.
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
    <section className="relative flex min-h-[88vh] items-center justify-center overflow-hidden bg-gradient-to-b from-emerald-50/70 via-white to-white pt-24 sm:pt-28">
      <div className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:gap-12">
          <div className="w-full flex-1 space-y-6 text-center lg:text-left">
            {variant === 'emagrecimento' && (
              <div className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-800">
                Programa 100% online com avaliação médica
              </div>
            )}
            <div className="space-y-4 sm:space-y-5">
              <h1 className="px-2 text-4xl font-bold leading-[1.02] text-gray-900 sm:text-5xl md:text-6xl lg:px-0 lg:text-[66px]">
                {variant === 'emagrecimento' ? emagrecimentoHeadline : h1}
              </h1>

              <p className="mx-auto max-w-2xl px-2 text-lg leading-8 text-gray-700 sm:text-xl lg:mx-0 lg:px-0">
                {sub}
              </p>

              {variant === 'emagrecimento' && (
                <ul className="mx-auto max-w-2xl space-y-2 px-2 text-left lg:mx-0 lg:px-0">
                  {[
                    'Triagem curta para mapear histórico, rotina e objetivos.',
                    'Conduta individualizada, sem promessa milagrosa e com próximos passos claros.',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm sm:text-base text-slate-700">
                      <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                        ✓
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {variant === 'emagrecimento' && (
                <p className="mx-auto max-w-2xl rounded-xl border border-emerald-100 bg-emerald-50/70 px-3 py-3 text-sm text-gray-700 sm:text-base lg:mx-0">
                  {getLpPriceHook()}
                </p>
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
                    'inline-flex items-center justify-center',
                    'h-14 px-7 sm:h-16 sm:px-10',
                    'whitespace-nowrap text-base font-bold text-emerald-800 sm:text-lg',
                    'rounded-full border-2 border-emerald-200 bg-white',
                    'hover:bg-emerald-50 transition-colors',
                    'w-full sm:w-auto'
                  )}
                >
                  Ver como funciona
                </a>
              )}
            </div>

            {variant === 'emagrecimento' && (
              <p className="px-2 text-xs sm:text-sm text-slate-500">
                Prescrição somente quando indicada em consulta médica. Dados tratados com boas práticas de privacidade.
              </p>
            )}
          </div>

          <div className="relative flex w-full max-w-xl flex-1 items-center justify-center">
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
